# 🚀 Refeir Pioneers Recruitment Landing Page

> **"Don't Just Join Refeir. Help Build It."**
> **"Build the Network. Shape the Future."**

A standalone, premium recruitment landing page for **Refeir Pioneers** — the early contributor and builder community shaping Africa's first referral-powered freelance marketplace.

---

## 🎯 Purpose & Product Boundary

- **Public Front Door**: Introduces Refeir, explains the Pioneer program, and recruits high-caliber builders across Africa.
- **Approval-First Workflow**: Applicants submit an application, receive a secure Application ID (`RP-2026-XXXXXX`), and undergo admissions review before gaining access to the official Refeir Pioneers WhatsApp Community.
- **Dual Deployment Architecture**:
  1. **Standalone Deployment**: Independently deployable to Vercel, Netlify, Cloudflare Pages, or AWS Amplify.
  2. **Integrated Route**: Native integration at `/pioneers`, `/refeir-pioneers`, and `/join-pioneers` in the main Refeir Marketplace codebase.

---

## 🧭 The Pioneer Admissions Flow

```
LANDING PAGE (Learn about Refeir & Pioneers)
   ↓
MULTI-STEP APPLICATION (Profile, Skills, Division, Motivation, Agreements)
   ↓
APPLICATION SUBMITTED (Application ID: RP-2026-XXXXXX, Status: PENDING REVIEW)
   ↓
ADMISSIONS REVIEW (Admin Portal: Division Assignment, Founding 100 Check)
   ↓
ACCEPTED (Status Portal Unlocks Official WhatsApp Community Invite)
   ↓
JOIN WHATSAPP COMMUNITY & PIONEER ONBOARDING
   ↓
PIONEER ACCOUNT & MISSIONS DASHBOARD
```

---

## ✨ Features & Architecture

- **Canvas Network Graph**: Interactive, lightweight HTML5 canvas rendering the living growth flow: `PERSON → REFERRAL → OPPORTUNITY → TALENT → WORK → REWARD → GROWTH`.
- **The Founding 100 Counter**: Dynamic admissions counter tracking real progress toward the initial 100 Founding Pioneer spots.
- **6 Pioneer Divisions**:
  1. 🛠️ **Tech & Product** (Developers, Engineers, QA, AI Specialists, Product Thinkers)
  2. 🎨 **Creative** (UI/UX Designers, Graphic Designers, Writers, Content Creators)
  3. 📈 **Growth** (Digital Marketers, SEO Specialists, Growth Strategists)
  4. 💼 **Business** (Business Developers, Sales Professionals, Partnership Builders)
  5. 🌍 **Community** (Community Managers, Campus & Regional Ambassadors)
  6. 🔬 **Research & Testing** (Researchers, Product Testers, Analysts)
- **Application Status Portal**: Secure lookup modal enabling applicants to check their admissions decision with their Application ID or Email.
- **Admissions Admin Suite**: Built directly into `AdminPortalPage.tsx` with filtering by Division, Country, and Status, internal note-taking, Pioneer ID generation, Founding 100 designation, and one-click WhatsApp onboarding triggers.

---

## 🛠️ Tech Stack

- **Framework**: React 18 + TypeScript
- **Bundler**: Vite 6
- **Styling**: Pure CSS Design System & Custom Properties
- **Icons**: Lucide React
- **Backend / Database**: Supabase (PostgreSQL with Row Level Security)
- **Delight**: Canvas Confetti

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory (refer to `.env.example`):

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://ddjcnhumxdsuzxcbjgxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Official Refeir Pioneers WhatsApp Community (Unlocked upon acceptance)
VITE_WHATSAPP_INVITE_URL=https://chat.whatsapp.com/RefeirPioneersOfficial
```

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```

### 3. Production Build
```bash
npm run build
```

---

## 🗄️ Database Schema & Supabase Migration

The Supabase migration is located in `supabase/migrations/20260826000001_pioneer_applications.sql`:

```sql
CREATE TABLE IF NOT EXISTS pioneer_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_number TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL,
  country TEXT NOT NULL,
  city TEXT,
  roles TEXT[] NOT NULL DEFAULT '{}',
  skills TEXT,
  portfolio_url TEXT,
  primary_division TEXT,
  contribution TEXT,
  availability TEXT,
  motivation TEXT,
  learning_goals TEXT,
  discovery_source TEXT,
  status TEXT NOT NULL DEFAULT 'PENDING',
  is_founding_100 BOOLEAN NOT NULL DEFAULT FALSE,
  pioneer_id TEXT UNIQUE,
  internal_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## 🌐 Deploying Standalone to Production

### Vercel
```bash
npx vercel
```
*Set `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and `VITE_WHATSAPP_INVITE_URL` in the Vercel Project Settings.*

### Netlify
```bash
npx netlify deploy --prod
```

---

© 2026 Refeir. All rights reserved.
