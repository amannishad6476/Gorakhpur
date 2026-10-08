process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_jwt_secret_key_munnalal_gorakhpur_2026_super_secure';
process.env.ADMIN_EMAIL = 'admin@munnalaltest.com';
process.env.ADMIN_PASSWORD = 'TestAdmin@2026!';

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const http = require('http');
const app = require('./src/index');
const User = require('./src/models/User');
const Banner = require('./src/models/Banner');
const Service = require('./src/models/Service');
const autoSeed = require('./src/utils/autoSeed');

let mongod;
let server;
let baseUrl;

async function request(path, options = {}) {
  const url = `${baseUrl}${path}`;
  const response = await fetch(url, {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await response.json() : await response.text();
  return { status: response.status, data, headers: response.headers };
}

async function runTests() {
  console.log('🧪 Starting Munnalal Painter Admin Security & API Test Suite...\n');
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
    // 1. Setup in-memory MongoDB
    mongod = await MongoMemoryServer.create({ spawnTimeoutMS: 60000 });
    const uri = mongod.getUri();
    await mongoose.connect(uri);

    // 2. Start HTTP server
    server = http.createServer(app);
    await new Promise((resolve) => server.listen(0, resolve));
    const port = server.address().port;
    baseUrl = `http://127.0.0.1:${port}`;

    // 3. Run autoSeed
    await autoSeed();

    // -------------------------------------------------------------
    console.log('\n--- 1. Admin Initialization & Password Security ---');
    const adminUser = await User.findOne({ email: 'admin@munnalaltest.com' }).select('+password');
    assert(adminUser !== null, 'Admin user created during initialization');
    assert(adminUser && adminUser.password.startsWith('$2a$') || adminUser.password.startsWith('$2b$'), 'Admin password is stored as a bcrypt hash');
    assert(adminUser && adminUser.password !== 'TestAdmin@2026!', 'Plaintext password is NEVER stored in database');

    // -------------------------------------------------------------
    console.log('\n--- 2. Public Endpoints Integrity ---');
    const publicBanners = await request('/api/banners');
    assert(publicBanners.status === 200 && Array.isArray(publicBanners.data.data), 'Public banners endpoint is accessible without authentication');

    const publicServices = await request('/api/services');
    assert(publicServices.status === 200 && Array.isArray(publicServices.data.data), 'Public services endpoint is accessible without authentication');

    // -------------------------------------------------------------
    console.log('\n--- 3. Unauthenticated Access Protection (401) ---');
    const unauthBannersAdmin = await request('/api/banners/admin/all');
    assert(unauthBannersAdmin.status === 401, 'GET /api/banners/admin/all returns 401 when unauthenticated');

    const unauthServicesAdmin = await request('/api/services/admin/all');
    assert(unauthServicesAdmin.status === 401, 'GET /api/services/admin/all returns 401 when unauthenticated');

    const unauthCreateBanner = await request('/api/banners', {
      method: 'POST',
      body: { title: 'Hacker Banner', image: 'https://evil.com/img.png' },
    });
    assert(unauthCreateBanner.status === 401, 'POST /api/banners returns 401 when unauthenticated');

    const unauthCreateService = await request('/api/services', {
      method: 'POST',
      body: { title: 'Hacker Service', shortDescription: 'Malicious payload' },
    });
    assert(unauthCreateService.status === 401, 'POST /api/services returns 401 when unauthenticated');

    const unauthUpload = await request('/api/upload', {
      method: 'POST',
      body: {},
    });
    assert(unauthUpload.status === 401, 'POST /api/upload returns 401 when unauthenticated');

    const unauthStats = await request('/api/stats/dashboard');
    assert(unauthStats.status === 401, 'GET /api/stats/dashboard returns 401 when unauthenticated');

    // -------------------------------------------------------------
    console.log('\n--- 4. Admin Authentication Flow ---');
    // Wrong password
    const wrongLogin = await request('/api/auth/login', {
      method: 'POST',
      body: { email: 'admin@munnalaltest.com', password: 'WrongPassword@123' },
    });
    assert(wrongLogin.status === 401, 'Login with wrong password returns 401');
    assert(wrongLogin.data.message === 'Invalid email or password.', 'Generic error message returned on wrong password');

    // Non-existent email
    const unknownLogin = await request('/api/auth/login', {
      method: 'POST',
      body: { email: 'nobody@example.com', password: 'AnyPassword@123' },
    });
    assert(unknownLogin.status === 401, 'Login with non-existent email returns 401');
    assert(unknownLogin.data.message === 'Invalid email or password.', 'Generic error message returned on unknown email');

    // Correct password
    const correctLogin = await request('/api/auth/login', {
      method: 'POST',
      body: { email: 'admin@munnalaltest.com', password: 'TestAdmin@2026!' },
    });
    assert(correctLogin.status === 200, 'Login with valid admin credentials succeeds');
    assert(typeof correctLogin.data.token === 'string', 'JWT token returned on successful login');
    assert(correctLogin.data.user && correctLogin.data.user.password === undefined, 'User password is NOT returned in login API response');

    const adminToken = correctLogin.data.token;

    // Get Me (/api/auth/me)
    const meRes = await request('/api/auth/me', { token: adminToken });
    assert(meRes.status === 200, 'GET /api/auth/me succeeds with valid token');
    assert(meRes.data.user && meRes.data.user.email === 'admin@munnalaltest.com', 'User profile returned correctly');
    assert(meRes.data.user.password === undefined, 'Password field is NOT exposed in /api/auth/me');

    // -------------------------------------------------------------
    console.log('\n--- 5. Password Policy & Change Password Enforcement ---');
    // Weak password change rejection
    const weakChange = await request('/api/auth/change-password', {
      method: 'PUT',
      token: adminToken,
      body: { currentPassword: 'TestAdmin@2026!', newPassword: 'weak' },
    });
    assert(weakChange.status === 400, 'Reject weak password change (< 12 characters)');

    // Missing special character
    const noSpecialChange = await request('/api/auth/change-password', {
      method: 'PUT',
      token: adminToken,
      body: { currentPassword: 'TestAdmin@2026!', newPassword: 'NewPassword12345' },
    });
    assert(noSpecialChange.status === 400, 'Reject password missing special character');

    // Valid password change
    const validChange = await request('/api/auth/change-password', {
      method: 'PUT',
      token: adminToken,
      body: { currentPassword: 'TestAdmin@2026!', newPassword: 'NewStrong@Password2026!' },
    });
    assert(validChange.status === 200, 'Valid strong password change succeeds');

    // Login with new password
    const newLogin = await request('/api/auth/login', {
      method: 'POST',
      body: { email: 'admin@munnalaltest.com', password: 'NewStrong@Password2026!' },
    });
    assert(newLogin.status === 200, 'Login with new strong password succeeds');
    const newAdminToken = newLogin.data.token;

    // -------------------------------------------------------------
    console.log('\n--- 6. Authenticated Admin Banner Operations ---');
    // Admin list banners
    const adminBanners = await request('/api/banners/admin/all', { token: newAdminToken });
    assert(adminBanners.status === 200, 'Admin can view all hero banners');

    // Create banner
    const createBannerRes = await request('/api/banners', {
      method: 'POST',
      token: newAdminToken,
      body: {
        title: 'Diwali Special Offer 2026',
        subtitle: 'Get 20% off on interior and exterior painting',
        image: 'https://images.unsplash.com/photo-1562663474-6cbb3eaa4d14?w=1920',
        buttonText: 'Claim Discount',
        buttonLink: '/free-estimate',
        isPrimary: true,
        order: 1,
      },
    });
    assert(createBannerRes.status === 201, 'Admin can create a new hero banner');
    const bannerId = createBannerRes.data.data._id;

    // Update banner
    const updateBannerRes = await request(`/api/banners/${bannerId}`, {
      method: 'PUT',
      token: newAdminToken,
      body: {
        title: 'Updated Diwali Special 2026',
        subtitle: 'Limited time festive discount on all painting services',
      },
    });
    assert(updateBannerRes.status === 200 && updateBannerRes.data.data.title === 'Updated Diwali Special 2026', 'Admin can update hero banner');

    // Toggle banner status
    const toggleBannerRes = await request(`/api/banners/${bannerId}/status`, {
      method: 'PATCH',
      token: newAdminToken,
    });
    assert(toggleBannerRes.status === 200, 'Admin can toggle banner active status');

    // Delete banner
    const deleteBannerRes = await request(`/api/banners/${bannerId}`, {
      method: 'DELETE',
      token: newAdminToken,
    });
    assert(deleteBannerRes.status === 200, 'Admin can delete hero banner');

    // -------------------------------------------------------------
    console.log('\n--- 7. Authenticated Admin Service Operations ---');
    // Admin list services
    const adminServices = await request('/api/services/admin/all', { token: newAdminToken });
    assert(adminServices.status === 200, 'Admin can view all services');

    // Create service
    const createServiceRes = await request('/api/services', {
      method: 'POST',
      token: newAdminToken,
      body: {
        title: 'Waterproofing & Damp Proofing',
        shortDescription: 'Advanced moisture protection for walls and roofs',
        description: '<p>Comprehensive waterproofing with 5-year warranty</p>',
        features: ['100% Leak Proof', '5-Year Warranty', 'Premium Materials'],
        icon: '💧',
        price: '₹12-30',
        priceUnit: 'per sq ft',
      },
    });
    assert(createServiceRes.status === 201, 'Admin can create a new service');
    const serviceId = createServiceRes.data.data._id;

    // Update service
    const updateServiceRes = await request(`/api/services/${serviceId}`, {
      method: 'PUT',
      token: newAdminToken,
      body: {
        title: 'Advanced Waterproofing Solutions',
        price: '₹15-35',
      },
    });
    assert(updateServiceRes.status === 200 && updateServiceRes.data.data.title === 'Advanced Waterproofing Solutions', 'Admin can update service');

    // Toggle service status
    const toggleServiceRes = await request(`/api/services/${serviceId}/status`, {
      method: 'PATCH',
      token: newAdminToken,
    });
    assert(toggleServiceRes.status === 200, 'Admin can toggle service active status');

    // Remove service image
    const removeImgRes = await request(`/api/services/${serviceId}/image`, {
      method: 'DELETE',
      token: newAdminToken,
    });
    assert(removeImgRes.status === 200, 'Admin can remove service image');

    // Delete service
    const deleteServiceRes = await request(`/api/services/${serviceId}`, {
      method: 'DELETE',
      token: newAdminToken,
    });
    assert(deleteServiceRes.status === 200, 'Admin can delete service');

    // -------------------------------------------------------------
    console.log('\n--- 8. Admin Logout & Token Expiry Flow ---');
    const logoutRes = await request('/api/auth/logout', {
      method: 'POST',
      token: newAdminToken,
    });
    assert(logoutRes.status === 200, 'Admin logout succeeds');

    // Attempting access with invalid token
    const invalidTokenRes = await request('/api/banners/admin/all', {
      token: 'invalid_or_manipulated_jwt_token',
    });
    assert(invalidTokenRes.status === 401, 'Protected endpoint rejects invalid/tampered token with 401');

    console.log(`\n========================================`);
    console.log(`📊 Test Results: ${passed} Passed, ${failed} Failed`);
    console.log(`========================================\n`);

    if (failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error('Fatal error during test run:', err);
    process.exit(1);
  } finally {
    if (server) server.close();
    if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
    if (mongod) await mongod.stop();
  }
}

runTests();
