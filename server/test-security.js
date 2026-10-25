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
const connectDB = require('./src/config/db');
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
    // 1. Setup test MongoDB instance
    mongod = await MongoMemoryServer.create({ spawnTimeoutMS: 60000 });
    const uri = mongod.getUri();
    await mongoose.connect(uri);

    // 2. Start HTTP server
    server = http.createServer(app);
    await new Promise((resolve) => server.listen(0, resolve));
    const port = server.address().port;
    baseUrl = `http://127.0.0.1:${port}`;

    // Verify login fails with 401 when admin account is missing (before seeding)
    const preSeedLogin = await request('/api/auth/login', {
      method: 'POST',
      body: { email: 'admin@munnalaltest.com', password: 'TestAdmin@2026!' },
    });
    assert(preSeedLogin.status === 401, 'Login returns 401 when admin account is missing from database');

    // 3. Connect via connectDB() with explicitly configured MONGODB_URI (which also runs autoSeed)
    await mongoose.disconnect();
    process.env.MONGODB_URI = uri;
    await connectDB();
    assert(mongoose.connection.readyState === 1, 'connectDB() connects with explicitly configured MONGODB_URI');

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
    // Missing email and password
    const missingBothLogin = await request('/api/auth/login', {
      method: 'POST',
      body: {},
    });
    assert(missingBothLogin.status === 400, 'Login with missing email and password returns 400');
    assert(missingBothLogin.data.message === 'Please provide email and password.', 'Expected validation message returned when credentials are missing');

    // Missing password
    const missingPassLogin = await request('/api/auth/login', {
      method: 'POST',
      body: { email: 'admin@munnalaltest.com' },
    });
    assert(missingPassLogin.status === 400, 'Login with missing password returns 400');

    // Missing email
    const missingEmailLogin = await request('/api/auth/login', {
      method: 'POST',
      body: { password: 'TestAdmin@2026!' },
    });
    assert(missingEmailLogin.status === 400, 'Login with missing email returns 400');

    // Invalid email format
    const invalidEmailLogin = await request('/api/auth/login', {
      method: 'POST',
      body: { email: 'not-an-email', password: 'TestAdmin@2026!' },
    });
    assert(invalidEmailLogin.status === 400, 'Login with invalid email format returns 400');

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
    console.log('\n--- 8. Festival Offers Security, Scheduling & Admin Operations ---');
    // Public active endpoint is accessible without authentication
    const publicOfferRes = await request('/api/festival-offers/active');
    assert(publicOfferRes.status === 200, 'Public active festival offer endpoint is accessible without authentication');

    // Unauthenticated protection
    const unauthOfferRes = await request('/api/festival-offers/admin/all');
    assert(unauthOfferRes.status === 401, 'GET /api/festival-offers/admin/all returns 401 when unauthenticated');

    const unauthCreateOffer = await request('/api/festival-offers', {
      method: 'POST',
      body: { festivalName: 'Test Festival', heading: 'Test Heading', startDate: new Date(), endDate: new Date() },
    });
    assert(unauthCreateOffer.status === 401, 'POST /api/festival-offers returns 401 when unauthenticated');

    // Validation: missing required fields
    const invalidOfferRes1 = await request('/api/festival-offers', {
      method: 'POST',
      token: newAdminToken,
      body: { festivalName: '' },
    });
    assert(invalidOfferRes1.status === 400, 'Create festival offer rejects missing required name');

    // Validation: end date earlier than start date
    const nowTime = new Date();
    const pastTime = new Date(nowTime.getTime() - 1000000);
    const invalidOfferRes2 = await request('/api/festival-offers', {
      method: 'POST',
      token: newAdminToken,
      body: {
        festivalName: 'Holi Offer',
        heading: 'HOLI DHAMAKA 2027',
        startDate: nowTime.toISOString(),
        endDate: pastTime.toISOString(),
      },
    });
    assert(invalidOfferRes2.status === 400, 'Create festival offer rejects end date earlier than start date');

    // Valid admin creation
    const startTime = new Date(Date.now() - 60000); // 1 minute ago
    const endTime = new Date(Date.now() + 86400000 * 7); // 7 days from now
    const createOfferRes = await request('/api/festival-offers', {
      method: 'POST',
      token: newAdminToken,
      body: {
        festivalName: 'Holi Rangotsav 2027',
        heading: 'HOLI SPECIAL 2027',
        subheading: 'Brighten Your Home with Festive Colors',
        offerMessage: 'Special Holi Offer — Contact Us for Your Best Painting Quote!',
        discountText: 'Special Holi Package',
        theme: 'holi',
        primaryButtonLabel: 'Get Free Quotation',
        showWhatsappButton: true,
        secondaryButtonLabel: 'Explore Services',
        startDate: startTime.toISOString(),
        endDate: endTime.toISOString(),
        isActive: true,
      },
    });
    assert(createOfferRes.status === 201, 'Admin can create a new festival campaign');
    const offerId = createOfferRes.data.data._id;

    // Admin can view all campaigns
    const allOffersRes = await request('/api/festival-offers/admin/all', {
      token: newAdminToken,
    });
    assert(allOffersRes.status === 200 && Array.isArray(allOffersRes.data.data), 'Admin can list all festival campaigns');

    // Active campaign appears in public response
    const activeOfferRes = await request('/api/festival-offers/active');
    assert(
      activeOfferRes.status === 200 && activeOfferRes.data.data && activeOfferRes.data.data.festivalName === 'Holi Rangotsav 2027',
      'Active festival offer within valid date range is returned publicly'
    );

    // Update campaign
    const updateOfferRes = await request(`/api/festival-offers/${offerId}`, {
      method: 'PUT',
      token: newAdminToken,
      body: {
        heading: 'UPDATED HOLI SPECIAL 2027',
        discountText: 'Festive Color Package',
      },
    });
    assert(
      updateOfferRes.status === 200 && updateOfferRes.data.data.heading === 'UPDATED HOLI SPECIAL 2027',
      'Admin can update festival campaign'
    );

    // Toggle active status (disable it)
    const toggleOfferRes = await request(`/api/festival-offers/${offerId}/toggle`, {
      method: 'PATCH',
      token: newAdminToken,
    });
    assert(toggleOfferRes.status === 200 && toggleOfferRes.data.data.isActive === false, 'Admin can toggle festival campaign to disabled');

    // When disabled, public active endpoint returns null (or another active campaign if any, but not the disabled one)
    const afterDisabledPublicRes = await request('/api/festival-offers/active');
    const activeData = afterDisabledPublicRes.data.data;
    assert(
      !activeData || activeData._id !== offerId,
      'Disabled festival campaign is NEVER returned publicly'
    );

    // Delete campaign
    const deleteOfferRes = await request(`/api/festival-offers/${offerId}`, {
      method: 'DELETE',
      token: newAdminToken,
    });
    assert(deleteOfferRes.status === 200, 'Admin can delete festival campaign');

    // -------------------------------------------------------------
    console.log('\n--- 9. Admin Logout & Token Expiry Flow ---');
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

    // -------------------------------------------------------------
    console.log('\n--- 9. Idempotent Seeding, Data Preservation & Production DB Fail-Fast ---');
    const serviceCountBefore = await Service.countDocuments();
    process.env.ADMIN_EMAIL = 'admin@munnalalpainter.com';
    process.env.ADMIN_PASSWORD = 'Admin@123456';
    await autoSeed();
    const serviceCountAfter = await Service.countDocuments();
    assert(serviceCountAfter === serviceCountBefore && serviceCountAfter > 0, 'autoSeed is idempotent and preserves existing database records');

    // Existing admin account (admin@munnalaltest.com) and its changed password must be preserved
    const preservedAdminLogin = await request('/api/auth/login', {
      method: 'POST',
      body: { email: 'admin@munnalaltest.com', password: 'NewStrong@Password2026!' },
    });
    assert(preservedAdminLogin.status === 200, 'Existing admin account and its changed password are preserved across autoSeed runs');

    // Newly configured admin account (and owner account) is also initialized without deleting existing accounts
    const ownerLogin = await request('/api/auth/login', {
      method: 'POST',
      body: { email: 'amannishad6476@gmail.com', password: 'Admin@123456' },
    });
    assert(ownerLogin.status === 200 && typeof ownerLogin.data.token === 'string', 'Initialized owner admin account succeeds with 200 and token');

    // Test production database fail-fast behavior (no silent in-memory fallback)
    await mongoose.disconnect();
    process.env.NODE_ENV = 'production';

    // 1) Missing MONGODB_URI in production
    process.env.MONGODB_URI = '';
    let missingUriFailed = false;
    try {
      await connectDB();
    } catch (err) {
      missingUriFailed = err.message.includes('MONGODB_URI environment variable is missing in production');
    }
    assert(missingUriFailed, 'Production connectDB() fails fast when MONGODB_URI is missing');
    assert(mongoose.connection.readyState === 0, 'Production does NOT start in-memory fallback when MONGODB_URI is missing');

    // 2) Unreachable MongoDB in production (and credential sanitization)
    process.env.MONGODB_URI = 'mongodb://amannishad6476_db_user:SuperSecretAtlasPass123@127.0.0.1:27099/munnalal_painter';
    let unreachableFailed = false;
    let leakedPassword = false;
    try {
      await connectDB({ serverSelectionTimeoutMS: 500 });
    } catch (err) {
      unreachableFailed = err.message.includes('Production MongoDB connection failed');
      leakedPassword = err.message.includes('SuperSecretAtlasPass123');
    }
    assert(unreachableFailed, 'Production connectDB() fails fast when MongoDB is unreachable');
    assert(!leakedPassword, 'Database error messages never expose database passwords');
    assert(mongoose.connection.readyState === 0, 'Production does NOT silently start in-memory MongoMemoryServer when connection fails');

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
  } finally {
    if (server) server.close();
    if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
    if (mongod) await mongod.stop();
  }
}

runTests();
