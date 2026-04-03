# ProjectReady4U

Student lead collection platform with public landing page and admin dashboard.

## Tech Stack
- Frontend: React + Vite + Tailwind CSS + Framer Motion + React Hook Form
- Backend: Node.js + Express.js + JWT Auth + bcryptjs
- Database: Supabase (PostgreSQL via @supabase/supabase-js)
- Deployment: Frontend → Vercel, Backend → Render

## Project Structure

projectready4u/
- client/       # React frontend
- server/       # Node.js backend
- README.md

## Setup

### 1. Supabase Table Creation
Run the following SQL in your Supabase project:

```sql
-- students table
create table if not exists students (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  whatsapp text not null,
  email text not null,
  college text not null,
  project_title text,
  city text not null,
  reached boolean default false,
  student_code text,
  created_at timestamptz default now()
);

-- admins table
create table if not exists admins (
  id uuid primary key,
  username text unique,
  password_hash text
);

-- site_content table
create table if not exists site_content (
  key text primary key,
  value text
);
```

### 2. Add Missing Columns (if table already exists)
If you already created the table without the new columns, run these ALTER statements:

```sql
-- Add project_title column
alter table students add column if not exists project_title text;

-- Add student_code column
alter table students add column if not exists student_code text;

-- Add reached column
alter table students add column if not exists reached boolean default false;
```

-- If your students table already exists, run this to add new fields:
-- alter table students add column if not exists project_title text;
-- alter table students add column if not exists reached boolean default false;
```

### 1.1 Website editable content keys
The admin dashboard can edit the following keys (and more if added):

- `hero_title`
- `hero_subtitle`
- `cta_text`
- `what_included_title`
- `what_included_text` (newline-separated bullets)
- `contact_phone`
- `contact_email`
- `contact_whatsapp`
- `footer_text`


### 2. Seed Default Data

In `server/.env`, set the Supabase and JWT variables, then run:

```bash
cd server
npm install
npm run seed
```

### 3. Run Locally

#### Backend
```bash
cd server
npm install
npm run dev
```

#### Frontend
```bash
cd client
npm install
npm run dev
```

Open front-end at `http://localhost:5173`.

## Env Files

### server/.env
```
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_role_key
JWT_SECRET=your_jwt_secret_here
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
CLIENT_URL=http://localhost:5173
```

### client/.env
```
VITE_API_URL=http://localhost:5000
```

## Auth
- Admin login endpoint: `POST /api/auth/login` (username/password)
- JWT token saved in `localStorage.adminToken`

## API Endpoints
- POST `/api/leads`: submit student lead
- GET `/api/leads`: protected, requires JWT
- GET `/api/content`: public
- PUT `/api/content`: protected, requires JWT

## Deployment

### Frontend (Vercel)
1. Connect GitHub repo to Vercel
2. Set root directory to `client`
3. Framework preset: `Vite`
4. Build command: `npm run build`
5. Output directory: `dist`
6. Set environment variable: `VITE_API_URL=https://your-backend-url.onrender.com`

### Backend (Render)
1. Connect GitHub repo to Render
2. Set root directory to `server`
3. Runtime: `Node`
4. Build command: `npm install`
5. Start command: `npm run start`
6. Environment variables:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_KEY`
   - `JWT_SECRET`
   - `CLIENT_URL` (set to your Vercel frontend URL)

### Pre-deployment Checklist
- [ ] Supabase database created with required tables
- [ ] Admin user seeded with `npm run seed`
- [ ] Environment variables configured
- [ ] Frontend builds successfully (`npm run build` in client/)
- [ ] Backend starts successfully (`npm run start` in server/)
- [ ] CORS allows production frontend URL

## Notes
- Protected admin route: `/admin/dashboard`.
- `site_content` is editable via dashboard and used on the landing page.
- `StudentForm` has validations: 10-digit phone and WhatsApp, valid email.
