const User = require('../models/User');
const Service = require('../models/Service');
const FAQ = require('../models/FAQ');
const Testimonial = require('../models/Testimonial');
const SiteContent = require('../models/SiteContent');
const Banner = require('../models/Banner');

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

const autoSeed = async () => {
  try {
    const adminCount = await User.countDocuments();
    if (adminCount === 0) {
      const email = process.env.ADMIN_EMAIL || 'amannishad6476@gmail.com';
      const password = process.env.ADMIN_PASSWORD || 'Admin@123456';
      await User.create({
        name: 'Munnalal Painter Admin',
        email,
        password,
        role: 'superadmin',
      });
      console.log(`👤 Admin user verified/created: ${email}`);
    }

    const serviceCount = await Service.countDocuments();
    if (serviceCount === 0) {
      await Service.insertMany(services);
      console.log(`📦 Seeded default services`);
    }

    const bannerCount = await Banner.countDocuments();
    if (bannerCount === 0) {
      await Banner.insertMany(defaultBanners);
      console.log(`🖼️ Seeded default hero banners`);
    }

    const faqCount = await FAQ.countDocuments();
    if (faqCount === 0) {
      await FAQ.insertMany(faqs);
      console.log(`❓ Seeded default FAQs`);
    }

    const testimonialCount = await Testimonial.countDocuments();
    if (testimonialCount === 0) {
      await Testimonial.insertMany(testimonials);
      console.log(`⭐ Seeded default testimonials`);
    }

    const contentCount = await SiteContent.countDocuments();
    if (contentCount === 0) {
      await SiteContent.insertMany(defaultContent);
      console.log(`📝 Seeded default site content`);
    }
  } catch (error) {
    console.error('Auto-seed warning:', error.message);
  }
};

module.exports = autoSeed;
