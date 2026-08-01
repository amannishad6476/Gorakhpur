require('dotenv').config();
require('express-async-errors');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cookieParser = require('cookie-parser');

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');

// Routes
const authRoutes = require('./routes/auth.routes');
const serviceRoutes = require('./routes/service.routes');
const galleryRoutes = require('./routes/gallery.routes');
const blogRoutes = require('./routes/blog.routes');
const reviewRoutes = require('./routes/review.routes');
const testimonialRoutes = require('./routes/testimonial.routes');
const faqRoutes = require('./routes/faq.routes');
const enquiryRoutes = require('./routes/enquiry.routes');
const estimateRoutes = require('./routes/estimate.routes');
const bannerRoutes = require('./routes/banner.routes');
const contentRoutes = require('./routes/content.routes');
const uploadRoutes = require('./routes/upload.routes');
const statsRoutes = require('./routes/stats.routes');
const activityRoutes = require('./routes/activity.routes');
const projectRoutes = require('./routes/project.routes');

// Connect to DB
connectDB();

const app = express();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// Dynamic CORS configuration allowing origins from CLIENT_URL, localhost, and deployed frontends
const getCorsOrigin = (origin, callback) => {
  if (!origin) return callback(null, true);

  const cleanOrigin = origin.replace(/\/+$/, '');
  
  if (!process.env.CLIENT_URL || process.env.CLIENT_URL === '*') {
    return callback(null, origin);
  }

  const allowedOrigins = process.env.CLIENT_URL.split(',').map(url => url.trim().replace(/\/+$/, ''));
  
  if (
    allowedOrigins.includes(cleanOrigin) ||
    cleanOrigin.includes('localhost') ||
    cleanOrigin.includes('127.0.0.1') ||
    cleanOrigin.endsWith('.onrender.com') ||
    cleanOrigin.endsWith('.vercel.app') ||
    cleanOrigin.endsWith('.netlify.app')
  ) {
    return callback(null, origin);
  }

  return callback(null, origin);
};

app.use(cors({
  origin: getCorsOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

app.use(mongoSanitize());
app.use(xss());
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// Rate limiting on all API routes
app.use('/api', apiLimiter);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/estimates', estimateRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/projects', projectRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Munnalal Painter API is running 🚀', timestamp: new Date() });
});

app.get('/', (req, res) => {
  res.json({ success: true, message: 'Munnalal Painter Backend API Server', status: 'online' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = app;
