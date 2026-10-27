const prisma = require('./prisma');
const autoSeed = require('../utils/autoSeed');

const sanitizeDbError = (message = '') => {
  if (typeof message !== 'string') return 'Unknown database error';
  return message.replace(/postgres(ql)?:\/\/([^:@]+):([^@]+)@/gi, 'postgres$1://$2:<redacted>@');
};

const connectDB = async (options = {}) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const databaseUrl = (process.env.DATABASE_URL || '').trim();

  if (isProduction && !databaseUrl) {
    const errMsg = 'DATABASE_URL environment variable is missing in production. Please configure your PostgreSQL connection string in Render / hosting.';
    console.error(`❌ PostgreSQL Configuration Error: ${errMsg}`);
    throw new Error(errMsg);
  }

  if (databaseUrl) {
    try {
      await prisma.$connect();
      await prisma.$queryRaw`SELECT 1`;

      let host = 'postgres';
      let dbName = 'database';
      try {
        const parsedUrl = new URL(databaseUrl.replace(/^postgres:/, 'http:').replace(/^postgresql:/, 'http:'));
        host = parsedUrl.host || 'postgres';
        dbName = parsedUrl.pathname.replace(/^\//, '') || 'database';
      } catch (_) {}

      console.log(`✅ PostgreSQL Connected via Prisma: ${host}/${dbName}`);
      await autoSeed();
      return prisma;
    } catch (error) {
      const safeMessage = sanitizeDbError(error.message);
      if (isProduction) {
        console.error(`❌ Production PostgreSQL Connection Failed (${safeMessage}).`);
        throw new Error(`Production PostgreSQL connection failed: ${safeMessage}`);
      }
      console.warn(`⚠️ PostgreSQL connection attempt failed (${safeMessage}).`);
      throw error;
    }
  } else {
    console.warn(`⚠️ DATABASE_URL is not set. Please provide a valid PostgreSQL DATABASE_URL in .env.`);
  }
};

module.exports = connectDB;
