 errHandling
import { prisma } from '../src/lib/prisma';

async function main() {
  await prisma.users.createMany({
    data: [
      { phone: '+1234567890' },
      { phone: '+0987654321' },

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

async function main() {
  // Clear existing data (optional - remove if you want to keep existing data)
  await prisma.oTP.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.business.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const user1 = await prisma.user.create({
    data: {
      phone: '+919876543210',
      email: 'user1@example.com',
      name: 'John Doe',
      password: 'hashed_password_1',
      is_verified: true,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      phone: '+919876543211',
      email: 'user2@example.com',
      name: 'Jane Smith',
      password: 'hashed_password_2',
      is_verified: true,
    },
  });

  // Create businesses
  const business1 = await prisma.business.create({
    data: {
      name: 'Tech Solutions Hub',
      email: 'tech@solutionshub.com',
      phone: '+919876543210',
      category: 'Technology',
      area: 'Chennai',
      owner_id: user1.id,
    },
  });

  const business2 = await prisma.business.create({
    data: {
      name: 'Fresh Bites Cafe',
      email: 'fresh@bitescafe.com',
      phone: '+919876543211',
      category: 'Food & Beverage',
      area: 'Mumbai',
      owner_id: user2.id,
    },
  });

  // Create products
  const product1 = await prisma.product.create({
    data: {
      name: 'Laptop Stand',
      description: 'Ergonomic adjustable laptop stand',
      price: 29.99,
      stock: 50,
      category: 'Electronics',
      business_id: business1.id,
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: 'Coffee Mug',
      description: 'Premium ceramic coffee mug',
      price: 12.99,
      stock: 100,
      category: 'Kitchenware',
      business_id: business2.id,
    },
  });

  // Create OTP records (some expired, some valid)
  const now = new Date();
  const fiveMinutesLater = new Date(now.getTime() + 5 * 60000);
  const fiveMinutesAgo = new Date(now.getTime() - 5 * 60000);

  await prisma.oTP.createMany({
    data: [
      {
        phone: '+919876543210',
        otp: '123456',
        expires_at: fiveMinutesLater,
      },
      {
        phone: '+919876543211',
        otp: '789012',
        expires_at: fiveMinutesLater,
      },
      {
        phone: '+919876543212',
        otp: '345678',
        expires_at: fiveMinutesLater,
      },
      {
        phone: '+919876543213',
        otp: '901234',
        expires_at: fiveMinutesAgo, // Expired OTP
      },
      {
        phone: '+919876543214',
        otp: '567890',
        expires_at: fiveMinutesAgo, // Expired OTP
      },
 main
    ],
  });

  console.log('Database seeded successfully ✅');
  console.log(`Created ${await prisma.user.count()} users`);
  console.log(`Created ${await prisma.business.count()} businesses`);
  console.log(`Created ${await prisma.product.count()} products`);
  console.log(`Created ${await prisma.oTP.count()} OTP records`);
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });