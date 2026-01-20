import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

async function main() {
  // Clear existing data (optional - remove if you want to keep existing data)
  await prisma.signup.deleteMany();
  await prisma.otp.deleteMany();
  await prisma.users.deleteMany();

  // Create users
  const user1 = await prisma.users.create({
    data: {
      phone: '+919876543210',
      is_verified: true,
    },
  });

  const user2 = await prisma.users.create({
    data: {
      phone: '+919876543211',
      is_verified: true,
    },
  });

  const user3 = await prisma.users.create({
    data: {
      phone: '+919876543212',
      is_verified: false,
    },
  });

  // Create signups for verified users
  await prisma.signup.createMany({
    data: [
      {
        user_id: user1.id,
        business_name: 'Tech Solutions Hub',
        category: 'Technology',
        area: 'Chennai',
      },
      {
        user_id: user1.id,
        business_name: 'Digital Marketing Pro',
        category: 'Marketing',
        area: 'Bangalore',
      },
      {
        user_id: user2.id,
        business_name: 'Fresh Bites Cafe',
        category: 'Food & Beverage',
        area: 'Mumbai',
      },
      {
        user_id: user2.id,
        business_name: 'Fitness First Gym',
        category: 'Health & Fitness',
        area: 'Delhi',
      },
    ],
  });

  // Create OTP records (some expired, some valid)
  const now = new Date();
  const fiveMinutesLater = new Date(now.getTime() + 5 * 60000);
  const fiveMinutesAgo = new Date(now.getTime() - 5 * 60000);

  await prisma.otp.createMany({
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
    ],
  });

  console.log('Database seeded successfully ✅');
  console.log(`Created ${await prisma.users.count()} users`);
  console.log(`Created ${await prisma.signup.count()} signups`);
  console.log(`Created ${await prisma.otp.count()} OTP records`);
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });