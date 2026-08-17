# Slipper Shop — Full Stack E-commerce Catalog

MERN stack catalog site: browse slippers/sweeper/tea-powder products, single admin
can add products (with photo upload via Cloudinary) and delete them.

## Structure
```
slipper-shop/
├── server/   Express + MongoDB backend
└── client/   React + Vite + Tailwind frontend
```

## 1. Prerequisites
- Node.js 18+
- A MongoDB Atlas cluster (connection string)
- A free Cloudinary account

## 2. Cloudinary setup (do this first)
1. Sign up at cloudinary.com, note your **Cloud name**, **API key**, **API secret** (Dashboard).
2. Go to Settings → Upload → Upload presets → "Add upload preset".
3. Set **Signing Mode = Unsigned**, save, note the preset name.

## 3. Backend setup
```bash
cd server
npm install
cp .env.example .env
# fill in MONGO_URI, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD, CLOUDINARY_*
npm run dev
```
Runs on http://localhost:5000

MongoDB Atlas: whitelist `0.0.0.0/0` under Network Access so Render's dynamic
IPs can connect once deployed.

## 4. Frontend setup
```bash
cd client
npm install
cp .env.example .env
# fill in VITE_API_URL, VITE_CLOUDINARY_CLOUD_NAME, VITE_CLOUDINARY_UPLOAD_PRESET
npm run dev
```
Runs on http://localhost:5173

## 5. Using it
- Visit `/admin/login`, log in with the ADMIN_EMAIL / ADMIN_PASSWORD from your `.env`.
- Add products with photo, price, category, and sizes (slippers only).
- Delete removes both the MongoDB record and the Cloudinary image.
- Anyone visiting `/` or `/category/:category` can browse — no login needed for shoppers.

## 6. Deployment

**Backend → Render**
1. Push `server/` to GitHub.
2. New Web Service on Render, connect the repo, root directory `server`.
3. Build command: `npm install` | Start command: `npm start`.
4. Add all `.env` variables in Render's Environment tab.
5. Note the deployed URL, e.g. `https://slipper-shop-api.onrender.com`.

**Frontend → Netlify**
1. Push `client/` to GitHub (or same repo, different root).
2. New site from Git on Netlify, base directory `client`.
3. Build command: `npm run build` | Publish directory: `dist`.
4. Add env vars: `VITE_API_URL` (your Render URL), `VITE_CLOUDINARY_CLOUD_NAME`, `VITE_CLOUDINARY_UPLOAD_PRESET`.

**Database → MongoDB Atlas**
Already cloud-hosted — just make sure Network Access allows `0.0.0.0/0`.

## Notes
- Admin auth is a single hardcoded account via `.env` + JWT (7 day expiry) — no signup flow, matches a single-admin shop.
- Categories are enum-restricted in the schema: `slippers`, `sweeper`, `tea-powder`. Add more by editing `Product.js`.
- To add a "mark out of stock" toggle instead of hard delete, use the existing `PUT /api/products/:id` route with `{ inStock: false }`.
