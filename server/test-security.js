process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_jwt_secret_key_munnalal_gorakhpur_2026_super_secure';
process.env.ADMIN_EMAIL = 'admin@munnalaltest.com';
process.env.ADMIN_PASSWORD = 'TestAdmin@2026!';

const { Readable, Duplex } = require('stream');
const app = require('./src/index');
const connectDB = require('./src/config/db');
const { isStrongPassword } = require('./src/utils/validation');
const { toLegacyDoc } = require('./src/utils/format');
const bcrypt = require('bcryptjs');

// Direct Express in-process dispatcher (no network sockets needed, 100% sandboxed)
function request(url, options = {}) {
  return new Promise((resolve) => {
    const bodyStr = options.body !== undefined ? JSON.stringify(options.body) : '';
    const req = new Readable();
    req._read = () => {};
    if (bodyStr) {
      req.push(bodyStr);
    }
    req.push(null);

    req.method = (options.method || 'GET').toUpperCase();
    req.url = url;
    req.originalUrl = url;
    req.headers = {
      'content-type': 'application/json',
      ...(bodyStr ? { 'content-length': Buffer.byteLength(bodyStr).toString() } : {}),
      ...(options.token ? { authorization: `Bearer ${options.token}` } : {}),
      ...(options.headers || {}),
    };
    req.query = {};
    req.params = {};

    const sock = new Duplex();
    sock._read = () => {};
    sock._write = (chunk, enc, cb) => cb();
    sock.remoteAddress = '127.0.0.1';
    sock.encrypted = false;
    req.socket = sock;
    req.connection = sock;
    req.ip = '127.0.0.1';

    const resHeaders = {};
    let responseData = null;

    const res = {
      statusCode: 200,
      status(code) {
        this.statusCode = code;
        return this;
      },
      setHeader(name, value) {
        resHeaders[name.toLowerCase()] = value;
      },
      getHeader(name) {
        return resHeaders[name.toLowerCase()];
      },
      removeHeader(name) {
        delete resHeaders[name.toLowerCase()];
      },
      set(name, value) {
        if (typeof name === 'object') {
          Object.entries(name).forEach(([k, v]) => (resHeaders[k.toLowerCase()] = v));
        } else {
          resHeaders[name.toLowerCase()] = value;
        }
        return this;
      },
      json(data) {
        responseData = data;
        resolve({ status: this.statusCode, data: responseData, headers: resHeaders });
        return this;
      },
      send(data) {
        responseData = data;
        resolve({ status: this.statusCode, data: responseData, headers: resHeaders });
        return this;
      },
      end(data) {
        if (data && responseData === null) responseData = data;
        resolve({ status: this.statusCode, data: responseData, headers: resHeaders });
        return this;
      },
    };

    app.handle(req, res, (err) => {
      if (err) {
        resolve({ status: 500, data: { message: err.message }, headers: resHeaders });
      } else {
        resolve({ status: 404, data: { message: 'Not Found' }, headers: resHeaders });
      }
    });
  });
}

async function runTests() {
  console.log('🧪 Starting Munnalal Painter PostgreSQL & Security Test Suite...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // -------------------------------------------------------------
    console.log('--- 1. Password Complexity & Policy Enforcement ---');
    assert(!isStrongPassword('weak'), 'Password with < 12 characters is rejected');
    assert(!isStrongPassword('NoSpecialChar123'), 'Password without special character is rejected');
    assert(!isStrongPassword('nouppercase123!'), 'Password without uppercase is rejected');
    assert(!isStrongPassword('NOLOWERCASE123!'), 'Password without lowercase is rejected');
    assert(!isStrongPassword('NoNumbersHere!'), 'Password without number is rejected');
    assert(isStrongPassword('TestAdmin@2026!'), 'Compliant strong password meets complexity requirements');

    const hashedPassword = await bcrypt.hash('TestAdmin@2026!', 12);
    assert(hashedPassword.startsWith('$2a$') || hashedPassword.startsWith('$2b$'), 'Bcrypt produces valid salted hash');
    assert(hashedPassword !== 'TestAdmin@2026!', 'Plaintext password is never stored or matched directly');

    // -------------------------------------------------------------
    console.log('\n--- 2. Format & Frontend Compatibility (Legacy _id Bridge) ---');
    const sampleItem = { id: 'uuid-1234', title: 'Exterior Painting', order: 1 };
    const legacyItem = toLegacyDoc(sampleItem);
    assert(legacyItem.id === 'uuid-1234', 'toLegacyDoc preserves original id field');
    assert(legacyItem._id === 'uuid-1234', 'toLegacyDoc maps id to _id for frontend backward compatibility');

    const sampleList = [
      { id: '1', name: 'A' },
      { id: '2', name: 'B' },
    ];
    const legacyList = toLegacyDoc(sampleList);
    assert(Array.isArray(legacyList) && legacyList[0]._id === '1' && legacyList[1]._id === '2', 'toLegacyDoc maps arrays recursively');

    // -------------------------------------------------------------
    console.log('\n--- 3. Unauthenticated Access Protection (401) ---');
    const unauthBannersAdmin = await request('/api/banners/admin/all');
    assert(unauthBannersAdmin.status === 401, 'GET /api/banners/admin/all returns 401 when unauthenticated');

    const unauthServicesAdmin = await request('/api/services/admin/all');
    assert(unauthServicesAdmin.status === 401, 'GET /api/services/admin/all returns 401 when unauthenticated');

    const unauthFestivalAdmin = await request('/api/festival-offers/admin/all');
    assert(unauthFestivalAdmin.status === 401, 'GET /api/festival-offers/admin/all returns 401 when unauthenticated');

    const unauthStatsAdmin = await request('/api/stats/dashboard');
    assert(unauthStatsAdmin.status === 401, 'GET /api/stats/dashboard returns 401 when unauthenticated');

    const unauthMe = await request('/api/auth/me');
    assert(unauthMe.status === 401, 'GET /api/auth/me returns 401 when unauthenticated');

    const unauthUpload = await request('/api/upload', { method: 'POST', body: {} });
    assert(unauthUpload.status === 401, 'POST /api/upload returns 401 when unauthenticated');

    const invalidTokenRes = await request('/api/banners/admin/all', {
      token: 'tampered_or_invalid_jwt_token',
    });
    assert(invalidTokenRes.status === 401, 'Protected route rejects invalid/tampered token with 401');

    // -------------------------------------------------------------
    console.log('\n--- 4. Authentication Input Validation ---');
    const missingBothLogin = await request('/api/auth/login', {
      method: 'POST',
      body: {},
    });
    assert(missingBothLogin.status === 400, 'Login with missing credentials returns 400');
    assert(missingBothLogin.data.message === 'Please provide email and password.', 'Expected error message returned when credentials missing');

    const missingPassLogin = await request('/api/auth/login', {
      method: 'POST',
      body: { email: 'admin@munnalaltest.com' },
    });
    assert(missingPassLogin.status === 400, 'Login with missing password returns 400');

    const missingEmailLogin = await request('/api/auth/login', {
      method: 'POST',
      body: { password: 'TestAdmin@2026!' },
    });
    assert(missingEmailLogin.status === 400, 'Login with missing email returns 400');

    const invalidEmailLogin = await request('/api/auth/login', {
      method: 'POST',
      body: { email: 'not-an-email', password: 'TestAdmin@2026!' },
    });
    assert(invalidEmailLogin.status === 400, 'Login with invalid email format returns 400');

    // -------------------------------------------------------------
    console.log('\n--- 5. PostgreSQL Production Connection Fail-Fast & Credential Sanitization ---');
    // Test 1: Missing DATABASE_URL in production fails fast
    process.env.NODE_ENV = 'production';
    const oldDbUrl = process.env.DATABASE_URL;
    process.env.DATABASE_URL = '';

    let missingUrlFailed = false;
    try {
      await connectDB();
    } catch (err) {
      missingUrlFailed = err.message.includes('DATABASE_URL environment variable is missing');
    }
    assert(missingUrlFailed, 'Production connectDB() fails fast when DATABASE_URL is missing');

    // Test 2: Unreachable / bad host in production fails fast and never leaks credentials in error logs
    process.env.DATABASE_URL = 'postgresql://admin_user:SuperSecretNeonPass999@127.0.0.1:54329/munnalal_db?sslmode=require';
    let unreachableFailed = false;
    let leakedPassword = false;
    try {
      await connectDB();
    } catch (err) {
      unreachableFailed = true;
      leakedPassword = err.message.includes('SuperSecretNeonPass999');
    }
    assert(unreachableFailed, 'Production connectDB() fails fast when PostgreSQL host is unreachable');
    assert(!leakedPassword, 'Production database error messages never expose plaintext database password');

    // Restore environment
    process.env.DATABASE_URL = oldDbUrl;
    process.env.NODE_ENV = 'test';

    console.log(`\n========================================`);
    console.log(`📊 Test Results: ${passed} Passed, ${failed} Failed`);
    console.log(`========================================\n`);

    if (failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error('Fatal error during test run:', err);
    process.exit(1);
  }
}

runTests();
