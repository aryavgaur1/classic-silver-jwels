require('dotenv').config();
const express    = require('express');
const mongoose   = require('mongoose');
const cors       = require('cors');
const path       = require('path');
const rateLimit  = require('express-rate-limit');

const app = express();

// ── MIDDLEWARE ────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: '10mb' }));  // 10mb for base64 images

// Rate limiting — protect API from abuse
const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
const contactLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 100,
  message: { error: 'Too many enquiries sent. Please try again in an hour.' }
});
app.use('/api/', apiLimiter);
app.use('/api/contact', contactLimiter);

// ── ROUTES ────────────────────────────────────────────────
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/content',  require('./routes/content'));
app.use('/api/faq',      require('./routes/faq'));
app.use('/api/contact',  require('./routes/contact'));

// ── HEALTH CHECK ──────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date() }));

// ── SERVE FRONTEND (static) ───────────────────────────────
// Place all your HTML/CSS/assets in the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Fallback: any unknown route → serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ── CONNECT DB + START ────────────────────────────────────
const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/classic_silver_palace';

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB connected:', MONGO_URI);
    await seedAdmin();       // create default admin if none exists
    await seedDefaults();    // seed default content if DB is empty
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });

// ── SEED FUNCTIONS ────────────────────────────────────────
async function seedAdmin() {
  const Admin = require('./models/Admin');
  const count = await Admin.countDocuments();
  if (count === 0) {
    const username = process.env.ADMIN_USERNAME || 'nwi_admin';
    const password = process.env.ADMIN_PASSWORD || 'NWI@Secure2025!';
    await Admin.create({ username, passwordHash: Admin.hashPassword(password) });
    console.log(`👤 Admin created: ${username}`);
  }
}

async function seedDefaults() {
  const SiteContent = require('./models/SiteContent');
  const Product     = require('./models/Product');
  const Faq         = require('./models/Faq');

  // Seed site content
  const contentCount = await SiteContent.countDocuments();
  if (contentCount === 0) {
    await SiteContent.insertMany([
      { key: 'content', data: {
        eyebrow: 'Established 1970 - Jaipur, India',
        heroTitle: 'Classic Silver Palace Jewellery Catalog',
        heroDesc: 'Established in 1970, Classic Silver Palace has carved a niche for itself in the market as a leading wholesale manufacturer and exporter of Sterling Silver Jewellery.',
        intro: 'Established in 1970, Classic Silver Palace has carved a niche for itself as a leading manufacturer and exporter. Our success is based on innovative design, exquisite craftsmanship, impeccable quality and real value for money.',
        ourProducts: 'Where elegance is an attitude, we at Classic Silver Jewellery are committed to excellence by providing a nonpareil collection of Sterling Silver Jewellery & Silver Articles.',
        infra: 'Owing to our well-established infrastructural setup, outfitted with latest machinery and advanced technology, we offer a vast array of premium quality Silver Jewelries.',
        why: 'Unique and exclusive designs. Flawless quality and fine finish. Wide choice in design and types of jewellery. Fast order processing and timely delivery. Certified Gems & Diamonds.',
        address: 'V-2, Opp. Aashiyana Guest House, Chameli Wala Market, M.I. Road,\nJaipur 302003, Rajasthan, India'
      }},
      { key: 'contact', data: {
        paypalEmail: 'info@indianclassicsilverjewellery.com',
        paypalNote: 'Instant Payment by PAYPAL (For all customers other than India)',
        usdBank: 'JP MORGAN CHASE BANK', usdSwift: 'HASUS33XXX',
        usdAcc: '001-1-407376', usdRouting: '021000021',
        usdBeneBank: 'AXIS Bank Ltd', usdBeneAcc: '010010200019196',
        gbpBank: 'Chase Manhattan Bank', gbpSwift: 'CHASGB2LXXX',
        gbpSort: '60-92-42', gbpAcc: '00111 31588', gbpBeneAcc: '010010200019196',
        eurBank: 'JPMorgan Chase Bank Frankfurt', eurSwift: 'CHASDEFXXXX',
        eurIban: 'DE81501108006231605392', eurBeneAcc: '010010200019196',
        companyName: 'Classic Silver Palace',
        addr1: 'V-2, Opp. Aashiyana Guest House, Chameli Wala Market',
        addr2: 'M.I. Road', city: 'Jaipur 302003, Rajasthan, India',
        phone: '0091-141-2360070', mobile: '0091-94140-72173',
        email: 'info@indianclassicsilverjewellery.com',
        ownerEmail: 'info@indianclassicsilverjewellery.com',
        minOrder: 'No minimum order amount or minimum order quantity.'
      }},
      { key: 'settings', data: {
        siteTitle: 'Classic Silver Palace', tagline: 'Manufacturer & Exporter',
        stat1val: '1970', stat1lbl: 'Established',
        stat2val: '925', stat2lbl: 'Sterling Silver',
        stat3val: '500+', stat3lbl: 'Products',
        stat4val: '50+', stat4lbl: 'Countries'
      }},
      { key: 'appearance', data: {
        displayFont: "'Playfair Display', Georgia, serif", displayWeight: '400',
        bodyFont: 'Inter, system-ui, sans-serif', baseFontSize: '15',
        lineHeight: '1.65', accentColor: '#9b7230', bgStyle: 'warm-cream',
        radius: '4px', btnStyle: 'subtle'
      }}
    ]);
    console.log('📝 Default site content seeded');
  }

  // Seed products from catalog-products.json if DB is empty
  const prodCount = await Product.countDocuments();
  if (prodCount === 0) {
    try {
      const products = require('./seed/catalog-products.json');
      await Product.insertMany(products.map((p, i) => ({ ...p, order: i })));
      console.log(`💎 ${products.length} products seeded`);
    } catch (e) {
      console.log('ℹ️  No seed products file found — starting with empty catalog');
    }
  }

  // Seed FAQ
  const faqCount = await Faq.countDocuments();
  if (faqCount === 0) {
    await Faq.insertMany([
      { id: 'f1', q: 'Do your prices include shipping?', a: 'No, all prices are exclusive of shipping charges.', order: 1 },
      { id: 'f2', q: 'Where do you ship from?', a: 'We are based in Jaipur, Rajasthan, India. All items ship directly from Jaipur.', order: 2 },
      { id: 'f3', q: 'How do you ship?', a: 'We use FedEx, UPS, and Express Mail Service (EMS/Post Parcel).', order: 3 },
      { id: 'f4', q: 'How long does delivery take?', a: 'We normally dispatch within 1–2 working weeks.', order: 4 },
      { id: 'f5', q: 'What is your Minimum Order Amount?', a: 'There is NO minimum order amount and no minimum order quantity.', order: 5 },
      { id: 'f6', q: 'Do I have to pay customs duty?', a: 'Rules and rates differ by country. You may be charged customs duty by your government.', order: 6 },
    ]);
    console.log('❓ Default FAQ seeded');
  }
}
