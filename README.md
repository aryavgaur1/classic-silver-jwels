# Classic Silver Palace — Backend

Node.js + Express + MongoDB backend for the Classic Silver Palace website.

## Folder Structure

```
csp-backend/
├── server.js              ← Main entry point
├── package.json
├── .env.example           ← Copy to .env and fill in values
├── models/
│   ├── Admin.js           ← Admin credentials (hashed)
│   ├── Product.js         ← Jewelry products
│   ├── SiteContent.js     ← All site text (content/contact/settings/appearance)
│   ├── Faq.js             ← FAQ items
│   └── Enquiry.js         ← Contact form submissions
├── routes/
│   ├── auth.js            ← /api/auth/login, /api/auth/change-password
│   ├── products.js        ← /api/products CRUD
│   ├── content.js         ← /api/content/:key (content/contact/settings/appearance)
│   ├── faq.js             ← /api/faq CRUD
│   └── contact.js         ← /api/contact (send enquiry)
├── middleware/
│   └── auth.js            ← JWT verification
├── seed/
│   └── catalog-products.json  ← Default products seeded on first run
├── public/                ← Put all your HTML/CSS/assets here
│   ├── index.html
│   ├── catalog.html
│   ├── about.html
│   ├── contact.html
│   ├── faq.html
│   ├── product.html
│   ├── admin.html         ← Use admin_new.html (API-powered version)
│   ├── csp-api.js         ← Include on every frontend page
│   └── assets/
└── admin_new.html         ← Updated admin panel (copy to public/)
```

## Setup (Local)

```bash
# 1. Install dependencies
npm install

# 2. Create .env file
cp .env.example .env
# Edit .env with your MongoDB URI and email credentials

# 3. Copy all HTML files into public/
#    Copy admin_new.html → public/admin.html
#    Copy csp-api.js → public/csp-api.js

# 4. Add <script src="csp-api.js"></script> before </body> on every HTML page

# 5. Start server
npm start
# → Server runs on http://localhost:3001
```

## Deploy to Railway

1. Push this folder to a GitHub repo
2. Create a new Railway project → Deploy from GitHub
3. Add a MongoDB plugin (Railway has built-in MongoDB)
4. Set environment variables in Railway dashboard:
   - MONGODB_URI  → Railway gives you this automatically
   - JWT_SECRET   → Any random long string
   - ADMIN_USERNAME → nwi_admin
   - ADMIN_PASSWORD → NWI@Secure2025!
   - EMAIL_USER / EMAIL_PASS / EMAIL_TO → Gmail SMTP

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/auth/login | No | Login, returns JWT token |
| POST | /api/auth/change-password | Yes | Change admin password |
| GET | /api/products | No | Get all products |
| POST | /api/products | Yes | Create/update product |
| PUT | /api/products/:id | Yes | Update product |
| DELETE | /api/products/:id | Yes | Delete product |
| POST | /api/products/bulk/import | Yes | Replace all products |
| GET | /api/content/:key | No | Get site content (content/contact/settings/appearance) |
| POST | /api/content/:key | Yes | Save site content |
| GET | /api/faq | No | Get all FAQ |
| POST | /api/faq | Yes | Create FAQ item |
| PUT | /api/faq/:id | Yes | Update FAQ item |
| DELETE | /api/faq/:id | Yes | Delete FAQ item |
| POST | /api/contact | No | Submit enquiry (saves to DB + sends email) |
| GET | /api/contact/enquiries | Yes | View all enquiries |
| GET | /api/health | No | Health check |
