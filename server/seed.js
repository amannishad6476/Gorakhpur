require('dotenv').config();
const prisma = require('./src/config/prisma');
const { autoSeed } = require('./src/utils/autoSeed');

const run = async () => {
  try {
    console.log('Connecting to PostgreSQL database...');
    await prisma.$connect();
    console.log('Running seeder...');
    await autoSeed(true);
    console.log('\n🎉 PostgreSQL database seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

run();
