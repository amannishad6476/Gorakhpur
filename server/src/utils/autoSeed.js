const prisma = require('../config/prisma');
const bcrypt = require('bcryptjs');
const { isStrongPassword } = require('./validation');

const services = [
  { title: 'House Painting', slug: 'house-painting', shortDescription: 'Complete house painting with premium paints for a beautiful, long-lasting finish.', description: '<p>Transform your home with our professional house painting services. We use premium quality paints from top brands like Asian Paints, Berger, and Nerolac to give your home a beautiful, durable finish that lasts for years.</p><p>Our expert painters ensure thorough surface preparation, priming, and application of multiple coats for the best results.</p>', icon: '🏠', image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80', features: ['Premium quality paints', 'Expert painters', 'Surface preparation', 'Multiple coat application', 'Clean work guarantee', 'On-time completion'], metaTitle: 'House Painting in Gorakhpur | Munnalal Painter', metaDescription: 'Professional house painting services in Gorakhpur. Premium paints, expert painters, affordable prices. Call for free estimate.', order: 1 },
  { title: 'Interior Painting', slug: 'interior-painting', shortDescription: 'Beautiful interior painting that transforms your living spaces with perfect finishes.', description: '<p>Our interior painting services cover all rooms — bedrooms, living rooms, kitchens, and bathrooms. We specialize in creating beautiful, durable finishes that complement your interior design.</p>', icon: '🎨', image: 'https://images.unsplash.com/photo-1562663474-6cbb3eaa4d14?auto=format&fit=crop&w=800&q=80', features: ['All room coverage', 'Color consultation', 'Premium interior paints', 'Smooth finish', 'Low VOC options', 'Furniture protection'], metaTitle: 'Interior Painting in Gorakhpur | Munnalal Painter', metaDescription: 'Expert interior painting services in Gorakhpur. Beautiful finishes for all rooms. Free color consultation.', order: 2 },
  { title: 'Exterior Painting', slug: 'exterior-painting', shortDescription: 'Weather-resistant exterior painting that protects and beautifies your property.', description: '<p>Protect your property from harsh weather while enhancing its curb appeal with our professional exterior painting services. We use weather-resistant paints that withstand rain, heat, and UV exposure.</p>', icon: '🏗️', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80', features: ['Weather-resistant paints', 'UV protection', 'Anti-fungal coating', 'Pressure washing', 'Crack filling', 'Long-lasting finish'], metaTitle: 'Exterior Painting in Gorakhpur | Munnalal Painter', metaDescription: 'Professional exterior painting in Gorakhpur. Weather-resistant, UV-protected paints. Protects your property year-round.', order: 3 },
  { title: 'Texture Painting', slug: 'texture-painting', shortDescription: 'Stunning texture painting designs that add character and dimension to your walls.', description: '<p>Add a unique artistic touch to your walls with our texture painting services. From subtle sand textures to bold 3D patterns, we create stunning visual effects that make your walls stand out.</p>', icon: '✨', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80', features: ['Custom texture designs', '3D effect options', 'Sand texture', 'Stone texture', 'Stucco finish', 'Designer patterns'], metaTitle: 'Texture Painting in Gorakhpur | Munnalal Painter', metaDescription: 'Expert texture painting services in Gorakhpur. Custom 3D designs, sand textures, stone effects. Transform your walls today.', order: 4 },
];

const defaultBanners = [
  {
    title: 'Transform Your Home with Colors That Last',
    subtitle: "Professional house painting, interior & exterior painting, texture painting, waterproofing and POP design in Gorakhpur. 15+ years of excellence, 2500+ projects completed.",
    ctaText: '🎨 Get Free Estimate',
    ctaLink: '/free-estimate',
    image: 'https://images.unsplash.com/photo-1562663474-6cbb3eaa4d14?auto=format&fit=crop&w=1920&q=80',
    isActive: true,
    isPrimary: true,
    order: 1,
  },
  {
    title: "Gorakhpur's #1 Premium Painting & Decorating Service",
    subtitle: "Give your walls a luxury makeover with top quality paints, 3D texture patterns, and 1-year warranty on every job.",
    ctaText: '📞 Call Now',
    ctaLink: 'tel:7668415684',
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1920&q=80',
    isActive: true,
    isPrimary: false,
    order: 2,
  },
];

const faqs = [
  { question: 'How much does house painting cost in Gorakhpur?', answer: 'The cost of house painting in Gorakhpur depends on various factors including the size of the area, type of paint, number of coats, and surface condition. Typically, it ranges from ₹8-25 per square foot. Contact us for a free detailed estimate specific to your project.', category: 'Pricing', order: 1 },
  { question: 'How long does it take to paint a 2BHK apartment?', answer: 'A standard 2BHK apartment (approximately 800-1000 sq ft) typically takes 3-5 days to complete, including surface preparation, putty application, primer, and 2 coats of paint. The exact timeline depends on the condition of walls and the type of finish required.', category: 'Timeline', order: 2 },
];

const testimonials = [
  { name: 'Rajesh Kumar Gupta', designation: 'Home Owner', location: 'Civil Lines, Gorakhpur', message: 'Munnalal Painter did an excellent job on our 3BHK home. The finish is absolutely perfect, they completed work on time, and the price was very reasonable. The team was professional, clean, and respectful of our space. Highly recommend!', rating: 5, isFeatured: true, order: 1 },
];

const defaultContent = [
  { key: 'hero_title', value: 'Gorakhpur\'s Most Trusted Painting Service', type: 'text', label: 'Hero Title', group: 'home' },
  { key: 'hero_subtitle', value: 'Premium Quality Painting for Homes, Offices & Commercial Spaces in Gorakhpur', type: 'text', label: 'Hero Subtitle', group: 'home' },
];

const PLACEHOLDER_EMAILS = ['your-admin-email@example.com', 'admin@example.com', 'your_email@gmail.com'];

const ensureAdminAccount = async (targetEmail, password) => {
  const existingAdmin = await prisma.user.findUnique({
    where: { email: targetEmail },
  });

  if (existingAdmin) {
    if (existingAdmin.password && !existingAdmin.password.startsWith('$2a$') && !existingAdmin.password.startsWith('$2b$')) {
      const hashedPassword = await bcrypt.hash(existingAdmin.password, 12);
      await prisma.user.update({
        where: { id: existingAdmin.id },
        data: { password: hashedPassword },
      });
      console.log(`👤 Migrated unhashed password for existing admin: ${existingAdmin.email}`);
    }
    return existingAdmin;
  }

  const hashedPassword = password.startsWith('$2a$') || password.startsWith('$2b$')
    ? password
    : await bcrypt.hash(password, 12);

  const created = await prisma.user.create({
    data: {
      name: 'Munnalal Painter Admin',
      email: targetEmail,
      password: hashedPassword,
      role: 'superadmin',
      isActive: true,
    },
  });
  console.log(`👤 Admin account initialized securely for: ${targetEmail}`);
  return created;
};

const autoSeed = async () => {
  try {
    const rawEnvEmail = (process.env.ADMIN_EMAIL || '').toLowerCase().trim();
    const adminEmail = (rawEnvEmail && !PLACEHOLDER_EMAILS.includes(rawEnvEmail))
      ? rawEnvEmail
      : 'amannishad6476@gmail.com';
    const rawPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';
    if (process.env.ADMIN_PASSWORD && !isStrongPassword(process.env.ADMIN_PASSWORD)) {
      console.warn('⚠️ ADMIN_PASSWORD in environment does not meet complexity requirements. Using default fallback password for initial admin creation.');
    }
    const password = isStrongPassword(rawPassword) ? rawPassword : 'Admin@123456';

    await ensureAdminAccount(adminEmail, password);

    if (adminEmail === 'admin@munnalalpainter.com') {
      await ensureAdminAccount('amannishad6476@gmail.com', password);
    }

    const serviceCount = await prisma.service.count();
    if (serviceCount === 0) {
      for (const s of services) {
        await prisma.service.create({ data: s });
      }
      console.log(`📦 Seeded default services`);
    }

    const bannerCount = await prisma.banner.count();
    if (bannerCount === 0) {
      for (const b of defaultBanners) {
        await prisma.banner.create({ data: b });
      }
      console.log(`🖼️ Seeded default hero banners`);
    }

    const faqCount = await prisma.fAQ.count();
    if (faqCount === 0) {
      for (const f of faqs) {
        await prisma.fAQ.create({ data: f });
      }
      console.log(`❓ Seeded default FAQs`);
    }

    const testimonialCount = await prisma.testimonial.count();
    if (testimonialCount === 0) {
      for (const t of testimonials) {
        await prisma.testimonial.create({ data: t });
      }
      console.log(`⭐ Seeded default testimonials`);
    }

    const contentCount = await prisma.siteContent.count();
    if (contentCount === 0) {
      for (const c of defaultContent) {
        await prisma.siteContent.create({ data: c });
      }
      console.log(`📝 Seeded default site content`);
    }

    const festivalCount = await prisma.festivalOffer.count();
    if (festivalCount === 0) {
      const now = new Date();
      const start = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const end = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      await prisma.festivalOffer.create({
        data: {
          festivalName: 'Diwali Dhamaka 2026',
          heading: 'DIWALI DHAMAKA 2026',
          subheading: 'Give Your Home a Beautiful Festive Makeover!',
          offerMessage: 'Special Diwali Offer — Contact Us for Your Best Painting Quote!',
          discountText: '',
          services: [
            'Interior & Exterior Painting',
            'Premium Texture Painting',
            'Wall Putty & Waterproofing',
          ],
          theme: 'diwali',
          primaryButtonLabel: 'Get Free Quotation',
          showWhatsappButton: true,
          secondaryButtonLabel: 'Explore Services',
          secondaryButtonLink: '/services',
          startDate: start,
          endDate: end,
          isActive: true,
        },
      });
      console.log(`🎉 Seeded default festival offer campaign`);
    }
  } catch (error) {
    console.error('Auto-seed warning:', error.message);
  }
};

module.exports = autoSeed;
