// Transaction and Performance Testing Examples
// This file demonstrates all the implemented tasks

import { prisma } from '../lib/prisma';

/**
 * TASK 1 & 2: Transaction Examples with Error Handling
 */

// Example 1: Place Order Transaction (Atomic Operation)
export async function placeOrderWithTransaction(userId: string, businessId: string, items: any[]) {
  try {
    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const result = await prisma.$transaction(async (tx) => {
      // 1. Create the order
      const order = await tx.order.create({
        data: {
          user_id: userId,
          business_id: businessId,
          total_amount: totalAmount,
          status: 'pending'
        }
      });

      // 2. Create order items and update inventory
      const orderItemsPromises = items.map(async (item) => {
        // Update product stock
        const updatedProduct = await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } }
        });

        // Check stock availability
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

      // 3. Record payment
      const payment = await tx.payment.create({
        data: {
          order_id: order.id,
          user_id: userId,
          amount: totalAmount,
          method: 'credit_card',
          status: 'completed'
        }
      });

      // Update order status
      const updatedOrder = await tx.order.update({
        where: { id: order.id },
        data: { status: 'confirmed' }
      });

      return { order: updatedOrder, payment, orderItems };
    });

    console.log('✅ Transaction successful:', result);
    return result;
  } catch (error) {
    console.error('❌ Transaction failed. Rolling back.', error);
    throw error;
  }
}

// Example 2: Test Transaction Rollback
export async function testTransactionRollback() {
  try {
    const result = await prisma.$transaction(async (tx) => {
      // Create test data
      const user = await tx.user.create({
        data: {
          phone: '+1999999999',
          email: 'rollback_test@example.com',
          name: 'Rollback Test',
          password: 'test_password'
        }
      });

      console.log('Created user for rollback test:', user.id);

      // Intentionally cause error to trigger rollback
      throw new Error('Intentional error to test rollback');

    });

    // This won't be reached due to the error above
    return result;
  } catch (error) {
    console.log('✅ Rollback test successful - Error caught:', (error as Error).message);
    
    // Verify rollback by checking if test user was actually created
    const testUser = await prisma.user.findUnique({
      where: { email: 'rollback_test@example.com' }
    });

    if (!testUser) {
      console.log('✅ Complete rollback confirmed - test user not found');
    } else {
      console.log('⚠️ Partial rollback - test user still exists');
    }
  }
}

/**
 * TASK 3: Optimized Queries Examples
 */

// Example 1: Efficient User Query with Selection
export async function getOptimizedUsers(page: number = 1, limit: number = 10) {
  const skip = (page - 1) * limit;

  // Optimized - Select only needed fields
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      is_verified: true,
      created_at: true,
      _count: {
        select: {
          businesses: true,
          orders: true
        }
      }
    },
    skip,
    take: limit,
    orderBy: {
      created_at: 'desc'
    }
  });

  const totalCount = await prisma.user.count();
  const totalPages = Math.ceil(totalCount / limit);

  return {
    users,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: totalCount
    }
  };
}

// Example 2: Batch Operations
export async function createUsersBatch(userData: any[]) {
  // Efficient batch creation instead of individual creates
  const result = await prisma.user.createMany({
    data: userData.map(user => ({
      phone: user.phone,
      email: user.email,
      name: user.name,
      password: user.password,
      is_verified: user.is_verified ?? false
    })),
    skipDuplicates: true
  });

  console.log(`✅ Created ${result.count} users in batch`);
  return result;
}

/**
 * TASK 4: Index Usage Examples
 * 
 * The following indexes were added to schema.prisma:
 * 
 * User model indexes:
 * @@index([phone])
 * @@index([email]) 
 * @@index([created_at])
 * 
 * Business model indexes:
 * @@index([owner_id])
 * @@index([category])
 * @@index([area])
 * @@index([is_active])
 * @@index([created_at])
 * 
 * Product model indexes:
 * @@index([business_id])
 * @@index([category])
 * @@index([stock])
 * @@index([is_active])
 * @@index([created_at])
 * 
 * Order model indexes:
 * @@index([user_id])
 * @@index([business_id])
 * @@index([status])
 * @@index([created_at])
 */

/**
 * TASK 5: Query Performance Monitoring Examples
 */

// Enable Prisma query logging for monitoring
// Run with: DEBUG="prisma:query" npm run dev

// Example performance comparison function
export async function compareQueryPerformance() {
  console.log('🔍 Comparing query performance...');
  
  // Query 1: Simple count
  const startTime1 = Date.now();
  const count1 = await prisma.user.count();
  const duration1 = Date.now() - startTime1;
  
  // Query 2: Complex query with joins
  const startTime2 = Date.now();
  const complexQuery = await prisma.user.findMany({
    take: 10,
    include: {
      businesses: true,
      orders: {
        take: 5,
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      }
    }
  });
  const duration2 = Date.now() - startTime2;
  
  console.log(`📊 Performance Results:`);
  console.log(`- Simple count query: ${duration1}ms (${count1} users)`);
  console.log(`- Complex join query: ${duration2}ms (${complexQuery.length} users)`);
  console.log(`- Performance ratio: ${(duration2/duration1).toFixed(2)}x slower`);
  
  return {
    simpleQuery: { duration: duration1, resultCount: count1 },
    complexQuery: { duration: duration2, resultCount: complexQuery.length },
    ratio: duration2/duration1
  };
}

// Health check function
export async function databaseHealthCheck() {
  try {
    // Test basic connectivity
    const startTime = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const connectionTime = Date.now() - startTime;
    
    // Test query performance
    const userCount = await prisma.user.count();
    
    return {
      status: 'healthy',
      connectionTime: `${connectionTime}ms`,
      userCount,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: (error as Error).message,
      timestamp: new Date().toISOString()
    };
  }
}

// Usage examples:
/*
// Run transaction example
placeOrderWithTransaction(
  'user-id-here',
  'business-id-here', 
  [
    { productId: 'product-id-1', quantity: 2, price: 29.99 },
    { productId: 'product-id-2', quantity: 1, price: 49.99 }
  ]
);

// Test rollback
testTransactionRollback();

// Get optimized users
getOptimizedUsers(1, 20);

// Batch create users
createUsersBatch([
  { phone: '+1234567890', email: 'user1@test.com', name: 'User 1', password: 'pass123' },
  { phone: '+1234567891', email: 'user2@test.com', name: 'User 2', password: 'pass123' }
]);

// Compare query performance
compareQueryPerformance();

// Check database health
databaseHealthCheck();
*/