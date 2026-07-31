require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');
const Service = require('./src/models/Service');
const FAQ = require('./src/models/FAQ');
const Testimonial = require('./src/models/Testimonial');
const Banner = require('./src/models/Banner');
const SiteContent = require('./src/models/SiteContent');

const connectDB = require('./src/config/db');

const services = [
  { title: 'House Painting', slug: 'house-painting', shortDescription: 'Complete house painting with premium paints for a beautiful, long-lasting finish.', description: '<p>Transform your home with our professional house painting services. We use premium quality paints from top brands like Asian Paints, Berger, and Nerolac to give your home a beautiful, durable finish that lasts for years.</p><p>Our expert painters ensure thorough surface preparation, priming, and application of multiple coats for the best results.</p>', icon: '🏠', features: ['Premium quality paints', 'Expert painters', 'Surface preparation', 'Multiple coat application', 'Clean work guarantee', 'On-time completion'], metaTitle: 'House Painting in Gorakhpur | Munnalal Painter', metaDescription: 'Professional house painting services in Gorakhpur. Premium paints, expert painters, affordable prices. Call for free estimate.', order: 1 },
  { title: 'Interior Painting', slug: 'interior-painting', shortDescription: 'Beautiful interior painting that transforms your living spaces with perfect finishes.', description: '<p>Our interior painting services cover all rooms — bedrooms, living rooms, kitchens, and bathrooms. We specialize in creating beautiful, durable finishes that complement your interior design.</p>', icon: '🎨', features: ['All room coverage', 'Color consultation', 'Premium interior paints', 'Smooth finish', 'Low VOC options', 'Furniture protection'], metaTitle: 'Interior Painting in Gorakhpur | Munnalal Painter', metaDescription: 'Expert interior painting services in Gorakhpur. Beautiful finishes for all rooms. Free color consultation.', order: 2 },
  { title: 'Exterior Painting', slug: 'exterior-painting', shortDescription: 'Weather-resistant exterior painting that protects and beautifies your property.', description: '<p>Protect your property from harsh weather while enhancing its curb appeal with our professional exterior painting services. We use weather-resistant paints that withstand rain, heat, and UV exposure.</p>', icon: '🏗️', features: ['Weather-resistant paints', 'UV protection', 'Anti-fungal coating', 'Pressure washing', 'Crack filling', 'Long-lasting finish'], metaTitle: 'Exterior Painting in Gorakhpur | Munnalal Painter', metaDescription: 'Professional exterior painting in Gorakhpur. Weather-resistant, UV-protected paints. Protects your property year-round.', order: 3 },
  { title: 'Texture Painting', slug: 'texture-painting', shortDescription: 'Stunning texture painting designs that add character and dimension to your walls.', description: '<p>Add a unique artistic touch to your walls with our texture painting services. From subtle sand textures to bold 3D patterns, we create stunning visual effects that make your walls stand out.</p>', icon: '✨', features: ['Custom texture designs', '3D effect options', 'Sand texture', 'Stone texture', 'Stucco finish', 'Designer patterns'], metaTitle: 'Texture Painting in Gorakhpur | Munnalal Painter', metaDescription: 'Expert texture painting services in Gorakhpur. Custom 3D designs, sand textures, stone effects. Transform your walls today.', order: 4 },
  { title: 'Wall Putty', slug: 'wall-putty', shortDescription: 'Professional wall putty application for a smooth, perfect base before painting.', description: '<p>A perfect paint job starts with proper surface preparation. Our wall putty services ensure your walls are smooth, level, and ready for painting. We use premium white cement and polymer-based putty for the best results.</p>', icon: '🔧', features: ['Surface smoothing', 'Crack filling', 'White cement putty', 'Polymer putty', 'Perfect base coat', 'Anti-moisture properties'], metaTitle: 'Wall Putty Services in Gorakhpur | Munnalal Painter', metaDescription: 'Professional wall putty application in Gorakhpur for smooth, perfect walls. Premium materials and expert application.', order: 5 },
  { title: 'Waterproofing', slug: 'waterproofing', shortDescription: 'Effective waterproofing solutions to protect your property from water damage.', description: '<p>Protect your home or commercial property from water seepage and dampness with our professional waterproofing services. We provide comprehensive solutions for roofs, bathrooms, kitchens, and basements.</p>', icon: '💧', features: ['Roof waterproofing', 'Bathroom waterproofing', 'Basement protection', 'Terrace treatment', 'Chemical treatment', '5-year guarantee'], metaTitle: 'Waterproofing Services in Gorakhpur | Munnalal Painter', metaDescription: 'Expert waterproofing services in Gorakhpur. Protect your property from water damage. Roof, bathroom, basement solutions.', order: 6 },
  { title: 'POP Design', slug: 'pop-design', shortDescription: 'Decorative POP (Plaster of Paris) designs for ceilings, walls and architectural details.', description: '<p>Enhance the beauty of your home with our decorative POP (Plaster of Paris) designs. From elegant ceiling roses to ornate cornices and custom architectural features, our skilled craftsmen bring your vision to life.</p>', icon: '🏛️', features: ['False ceiling designs', 'Ceiling roses', 'Cornice work', 'Wall panels', 'Custom designs', 'LED integration'], metaTitle: 'POP Design in Gorakhpur | Munnalal Painter', metaDescription: 'Beautiful POP design services in Gorakhpur. False ceilings, wall panels, architectural details. Expert craftsmen.', order: 7 },
  { title: 'Wood Polish', slug: 'wood-polish', shortDescription: 'Expert wood polishing and finishing for doors, furniture and wooden surfaces.', description: '<p>Restore and protect your wooden surfaces with our professional wood polishing services. We offer a range of finishes from natural matte to high-gloss lacquer, enhancing the natural beauty of wood while providing lasting protection.</p>', icon: '🪵', features: ['Door polishing', 'Furniture finishing', 'PU coating', 'French polish', 'Wood staining', 'Varnishing'], metaTitle: 'Wood Polish in Gorakhpur | Munnalal Painter', metaDescription: 'Professional wood polishing services in Gorakhpur. Door, furniture finishing, PU coating. Restore natural wood beauty.', order: 8 },
  { title: 'Metal Painting', slug: 'metal-painting', shortDescription: 'Anti-rust metal painting for gates, grills, pipes and all metal surfaces.', description: '<p>Protect your metal structures from rust and corrosion with our professional metal painting services. We use primer, anti-rust coatings, and durable enamel paints to ensure long-lasting protection for all metal surfaces.</p>', icon: '⚙️', features: ['Anti-rust coating', 'Primer application', 'Enamel paint', 'Gates and grills', 'Structural steel', 'Pipeline painting'], metaTitle: 'Metal Painting in Gorakhpur | Munnalal Painter', metaDescription: 'Professional metal painting services in Gorakhpur. Anti-rust coatings for gates, grills, pipes. Durable protection.', order: 9 },
  { title: 'Commercial Painting', slug: 'commercial-painting', shortDescription: 'Professional commercial painting for shops, showrooms, restaurants and business spaces.', description: '<p>We provide comprehensive commercial painting solutions for all types of businesses. Our team works efficiently to minimize disruption to your business operations while delivering high-quality results.</p>', icon: '🏢', features: ['Shop painting', 'Showroom painting', 'Restaurant painting', 'Warehouse painting', 'Weekend scheduling', 'Minimal disruption'], metaTitle: 'Commercial Painting in Gorakhpur | Munnalal Painter', metaDescription: 'Expert commercial painting services in Gorakhpur for shops, offices, restaurants. Minimal disruption, quick turnaround.', order: 10 },
  { title: 'Apartment Painting', slug: 'apartment-painting', shortDescription: 'Complete apartment painting with premium paints for a fresh, modern look.', description: '<p>Give your apartment a fresh new look with our professional apartment painting services. Whether you are moving in, renovating, or just want to refresh your space, our team delivers excellent results.</p>', icon: '🏙️', features: ['Complete apartment coverage', 'Move-in painting', 'Renovation painting', 'Color consultation', 'Tenant-friendly service', 'Quick turnaround'], metaTitle: 'Apartment Painting in Gorakhpur | Munnalal Painter', metaDescription: 'Professional apartment painting in Gorakhpur. Complete coverage, premium paints, expert painters. Get free estimate today.', order: 11 },
  { title: 'Office Painting', slug: 'office-painting', shortDescription: 'Professional office painting that creates productive, inspiring work environments.', description: '<p>Create an inspiring and productive work environment with our professional office painting services. We understand the importance of a professional aesthetic in the workplace and deliver results that impress both employees and clients.</p>', icon: '🏬', features: ['Office walls and ceiling', 'Conference rooms', 'Cabins and workstations', 'Lobby painting', 'After-hours service', 'Corporate colors'], metaTitle: 'Office Painting in Gorakhpur | Munnalal Painter', metaDescription: 'Professional office painting services in Gorakhpur. Create inspiring workplaces. After-hours scheduling available.', order: 12 },
];

const faqs = [
  { question: 'How much does house painting cost in Gorakhpur?', answer: 'The cost of house painting in Gorakhpur depends on various factors including the size of the area, type of paint, number of coats, and surface condition. Typically, it ranges from ₹8-25 per square foot. Contact us for a free detailed estimate specific to your project.', category: 'Pricing', order: 1 },
  { question: 'How long does it take to paint a 2BHK apartment?', answer: 'A standard 2BHK apartment (approximately 800-1000 sq ft) typically takes 3-5 days to complete, including surface preparation, putty application, primer, and 2 coats of paint. The exact timeline depends on the condition of walls and the type of finish required.', category: 'Timeline', order: 2 },
  { question: 'Do you provide paint materials or should I arrange them?', answer: 'We offer both options. We can procure all materials (paint, putty, primer) at competitive prices with quality assurance, or if you prefer to buy your own materials, our team will work with whatever you provide. We recommend letting us handle materials for best results and warranty purposes.', category: 'General', order: 3 },
  { question: 'What brands of paint do you use?', answer: 'We work with all major paint brands including Asian Paints, Berger Paints, Nerolac, Dulux, and Indigo. We recommend the best product based on your requirements, budget, and the specific application (interior/exterior/texture).', category: 'General', order: 4 },
  { question: 'Do you offer a warranty on your painting work?', answer: 'Yes, we provide a 1-year workmanship warranty on all painting services. For waterproofing services, we offer a 5-year guarantee. The paint manufacturer\'s warranty (typically 5-7 years) also applies to the paint materials used.', category: 'Warranty', order: 5 },
  { question: 'Can you paint my home while I am living there?', answer: 'Absolutely! We are experienced in working in occupied homes with minimal disruption to your daily routine. We cover furniture and flooring with protective sheets, work room by room, and ensure the space is habitable each evening. For best results, we recommend clearing small items from the work area.', category: 'General', order: 6 },
  { question: 'Do you provide free estimates?', answer: 'Yes, we provide completely free on-site estimates. Our expert will visit your property, assess the work required, and provide a detailed written quotation with no obligation. You can also fill out our online estimate request form and we will contact you within 24 hours.', category: 'Pricing', order: 7 },
  { question: 'What is the difference between texture painting and regular painting?', answer: 'Regular painting applies a smooth, uniform coat of paint. Texture painting creates a 3-dimensional effect on your walls using special techniques and materials like sand, stone, or metallic finishes. Texture painting adds depth, character, and a premium look to your walls, hiding imperfections better than regular paint.', category: 'Services', order: 8 },
  { question: 'Which areas in Gorakhpur do you serve?', answer: 'We serve all areas of Gorakhpur including Civil Lines, Golghar, Rapti Nagar, Shastri Nagar, Basharatpur, BRD College area, Bargadwa, Sahjanwa, Pharenda, Deoria, Kushinagar, and all surrounding areas within 50 km of Gorakhpur.', category: 'Service Area', order: 9 },
  { question: 'How do I maintain my painted walls?', answer: 'To maintain your painted walls: clean with a soft, damp cloth for light stains; avoid harsh chemicals; ensure good ventilation to prevent moisture build-up; touch up chips or scratches promptly; for textured walls, use a soft brush to remove dust. Regular cleaning extends the life of your paint.', category: 'Maintenance', order: 10 },
];

const testimonials = [
  { name: 'Rajesh Kumar Gupta', designation: 'Home Owner', location: 'Civil Lines, Gorakhpur', message: 'Munnalal Painter did an excellent job on our 3BHK home. The finish is absolutely perfect, they completed work on time, and the price was very reasonable. The team was professional, clean, and respectful of our space. Highly recommend!', rating: 5, isFeatured: true, order: 1 },
  { name: 'Sunita Agarwal', designation: 'Apartment Owner', location: 'Rapti Nagar, Gorakhpur', message: 'We got our apartment painted before Diwali and the results were stunning! The texture work in the living room looks especially beautiful. The team was punctual and completed everything in just 4 days. Will definitely use their services again.', rating: 5, isFeatured: true, order: 2 },
  { name: 'Anand Mishra', designation: 'Business Owner', location: 'Golghar, Gorakhpur', message: 'Got my showroom painted by Munnalal Painter. The commercial painting work was professional grade. They worked during non-business hours to avoid disruption. The waterproofing treatment on the roof has been working perfectly for 2 years now. Great service!', rating: 5, isFeatured: true, order: 3 },
  { name: 'Priya Singh', designation: 'Interior Designer', location: 'Shastri Nagar, Gorakhpur', message: 'As an interior designer, I have high standards. Munnalal Painter consistently delivers excellence. Their POP work and texture painting are top-notch. I recommend them to all my clients in Gorakhpur and they have never disappointed. Truly professional team.', rating: 5, isFeatured: true, order: 4 },
  { name: 'Vikram Pandey', designation: 'Builder', location: 'Sahjanwa, Gorakhpur', message: 'We have used Munnalal Painter for multiple apartment projects. Their work quality is consistent, they handle large projects efficiently, and pricing is transparent. The waterproofing guarantee they provide gives our buyers confidence. Trusted contractor for us.', rating: 5, isFeatured: true, order: 5 },
];

const defaultContent = [
  { key: 'hero_title', value: 'Gorakhpur\'s Most Trusted Painting Service', type: 'text', label: 'Hero Title', group: 'home' },
  { key: 'hero_subtitle', value: 'Premium Quality Painting for Homes, Offices & Commercial Spaces in Gorakhpur', type: 'text', label: 'Hero Subtitle', group: 'home' },
  { key: 'about_title', value: 'About Munnalal Painter', type: 'text', label: 'About Title', group: 'about' },
  { key: 'about_description', value: 'With over 15 years of experience in the painting industry, Munnalal Painter has established itself as the most trusted painting contractor in Gorakhpur, Uttar Pradesh. We combine traditional craftsmanship with modern techniques to deliver exceptional results.', type: 'text', label: 'About Description', group: 'about' },
  { key: 'phone', value: '+91-9876543210', type: 'text', label: 'Phone Number', group: 'contact' },
  { key: 'whatsapp', value: '+919876543210', type: 'text', label: 'WhatsApp Number', group: 'contact' },
  { key: 'email', value: 'info@munnalalpainter.com', type: 'text', label: 'Email', group: 'contact' },
  { key: 'address', value: 'Near Railway Station, Gorakhpur, Uttar Pradesh 273001', type: 'text', label: 'Address', group: 'contact' },
  { key: 'years_experience', value: '15+', type: 'text', label: 'Years of Experience', group: 'stats' },
  { key: 'projects_completed', value: '2500+', type: 'text', label: 'Projects Completed', group: 'stats' },
  { key: 'happy_clients', value: '1800+', type: 'text', label: 'Happy Clients', group: 'stats' },
  { key: 'cities_served', value: '12+', type: 'text', label: 'Cities Served', group: 'stats' },
];

const seed = async () => {
  try {
    await connectDB();
    
    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Service.deleteMany({}),
      FAQ.deleteMany({}),
      Testimonial.deleteMany({}),
      SiteContent.deleteMany({}),
    ]);
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const admin = await User.create({
      name: 'Munnalal Painter Admin',
      email: process.env.ADMIN_EMAIL || 'admin@munnalalpainter.com',
      password: process.env.ADMIN_PASSWORD || 'Admin@123456',
      role: 'superadmin',
    });
    console.log(`✅ Admin user created: ${admin.email}`);

    // Seed data
    await Service.insertMany(services);
    console.log(`✅ ${services.length} services seeded`);

    await FAQ.insertMany(faqs);
    console.log(`✅ ${faqs.length} FAQs seeded`);

    await Testimonial.insertMany(testimonials);
    console.log(`✅ ${testimonials.length} testimonials seeded`);

    await SiteContent.insertMany(defaultContent);
    console.log(`✅ ${defaultContent.length} site content entries seeded`);

    console.log('\n🎉 Database seeded successfully!');
    console.log(`\n📧 Admin Login:\n   Email: ${admin.email}\n   Password: ${process.env.ADMIN_PASSWORD || 'Admin@123456'}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seed();
