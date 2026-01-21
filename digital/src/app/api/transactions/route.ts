import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendSuccess, sendError } from '@/lib/responseHandler';
import { ERROR_CODES } from '@/lib/errorCodes';

/**
 * POST /api/transactions/place-order
 * Place an order with transaction handling
 * This demonstrates atomic operations: create order, update inventory, record payment
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, businessId, items, paymentMethod } = body;

    // Validate required fields
    if (!userId || !businessId || !items || !Array.isArray(items) || items.length === 0) {
      return sendError(
        'Missing required fields: userId, businessId, and items array',
        ERROR_CODES.VALIDATION_ERROR,
        400
      );
    }

    // Calculate total amount
    const totalAmount = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);

    // Execute transaction with proper error handling
    try {
      const result = await prisma.$transaction(async (tx) => {
        // 1. Create the order
        const order = await tx.order.create({
          data: {
            user_id: userId,
            business_id: businessId,
            total_amount: totalAmount,
            status: 'pending'
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            },
            business: {
              select: {
                id: true,
                name: true
              }
            }
          }
        });

        // 2. Create order items and update product inventory
        const orderItemsPromises = items.map(async (item: any) => {
          // Update product stock (decrement)
          const updatedProduct = await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                decrement: item.quantity
              }
            },
            select: {
              id: true,
              name: true,
              stock: true
            }
          });

          // Check if sufficient stock is available
          if (updatedProduct.stock < 0) {
            throw new Error(`Insufficient stock for product: ${updatedProduct.name}`);
          }

          // Create order item
          return await tx.orderItem.create({
            data: {
              order_id: order.id,
              product_id: item.productId,
              quantity: item.quantity,
              price: item.price
            }
          });
        });

        const orderItems = await Promise.all(orderItemsPromises);

        // 3. Record the payment
        const payment = await tx.payment.create({
          data: {
            order_id: order.id,
            user_id: userId,
            amount: totalAmount,
            method: paymentMethod || 'credit_card',
            status: 'completed'
          }
        });

        // Update order status to confirmed
        const updatedOrder = await tx.order.update({
          where: { id: order.id },
          data: { status: 'confirmed' },
          include: {
            items: {
              include: {
                product: {
                  select: {
                    name: true,
                    price: true
                  }
                }
              }
            },
            payments: true
          }
        });

        return {
          order: updatedOrder,
          payment,
          orderItems
        };
      }, {
        // Transaction configuration
        maxWait: 5000, // 5 seconds max wait for connection
        timeout: 10000, // 10 seconds timeout for transaction
      });

      return sendSuccess(
        { data: result },
        'Order placed successfully with transaction',
        201
      );

    } catch (transactionError: any) {
      console.error('Transaction failed. Rolling back.', transactionError);
      
      // Handle specific error cases
      if (transactionError.message.includes('Insufficient stock')) {
        return sendError(
          transactionError.message,
          ERROR_CODES.VALIDATION_ERROR,
          400
        );
      }
      
      if (transactionError.code === 'P2025') {
        return sendError(
          'One or more records not found',
          ERROR_CODES.NOT_FOUND,
          404
        );
      }

      return sendError(
        'Transaction failed. Changes have been rolled back.',
        ERROR_CODES.INTERNAL_ERROR,
        500
      );
    }

  } catch (error) {
    console.error('Error in place-order endpoint:', error);
    return sendError(
      'Internal server error',
      ERROR_CODES.INTERNAL_ERROR,
      500
    );
  }
}

/**
 * GET /api/transactions/test-rollback
 * Test transaction rollback by intentionally causing an error
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const shouldFail = searchParams.get('fail') === 'true';

    try {
      const result = await prisma.$transaction(async (tx) => {
        // Create a test user
        const user = await tx.user.create({
          data: {
            phone: '+1999999999',
            email: 'test@example.com',
            name: 'Test User',
            password: 'hashed_password',
            is_verified: true
          }
        });

        console.log('Created user:', user.id);

        // Create a test business
        const business = await tx.business.create({
          data: {
            name: 'Test Business',
            email: 'business@test.com',
            phone: '+1888888888',
            category: 'Test Category',
            area: 'Test Area',
            owner_id: user.id
          }
        });

        console.log('Created business:', business.id);

        // Intentionally cause an error to test rollback
        if (shouldFail) {
          throw new Error('Intentional error to test transaction rollback');
        }

        // Create a test product
        const product = await tx.product.create({
          data: {
            name: 'Test Product',
            price: 99.99,
            stock: 10,
            category: 'Test',
            business_id: business.id
          }
        });

        console.log('Created product:', product.id);

        return {
          user,
          business,
          product
        };
      }, {
        maxWait: 5000,
        timeout: 10000,
      });

      if (shouldFail) {
        // This shouldn't be reached if rollback works properly
        return sendSuccess(
          { data: result, rollbackTest: 'FAILED - Changes were committed despite error' },
          'Test completed'
        );
      } else {
        return sendSuccess(
          { data: result, rollbackTest: 'SUCCESS - All operations completed' },
          'Transaction test successful'
        );
      }

    } catch (transactionError: any) {
      console.error('Transaction test error (expected for rollback):', transactionError.message);
      
      // Verify rollback by checking if test data exists
      const testUser = await prisma.user.findUnique({
        where: { email: 'test@example.com' }
      });

      const rollbackStatus = testUser ? 'PARTIAL_ROLLBACK' : 'COMPLETE_ROLLBACK';
      
      return sendSuccess(
        { 
          message: 'Transaction rolled back as expected',
          rollbackStatus,
          error: transactionError.message
        },
        'Rollback test completed'
      );
    }

  } catch (error) {
    console.error('Error in test-rollback endpoint:', error);
    return sendError(
      'Internal server error',
      ERROR_CODES.INTERNAL_ERROR,
      500
    );
  }
}