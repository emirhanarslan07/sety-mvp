# SETY MVP - Creator Revenue Clarity Tool

A validation MVP for helping creators (1K-50K followers) plan their revenue before launching products.

## 🎯 Project Overview

**Value Proposition:** "Plan your revenue before you launch"

SETY provides simple revenue simulation, pricing clarity, and goal feasibility checks based on audience data.

**Product Philosophy:** Clarity over complexity. Transparency over AI mystery. Structured thinking over hype.

## 🚀 Tech Stack

- **Frontend:** Next.js 14+ (App Router), TypeScript, Tailwind CSS, Shadcn/ui
- **Backend:** Supabase (Auth + PostgreSQL)
- **Analytics:** PostHog
- **Hosting:** Vercel

## 📦 Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (`.env.local`):
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
NEXT_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Set up Supabase database:
   - Run the SQL schema in `supabase/schema.sql` in your Supabase SQL Editor
   - This creates tables: `user_profiles`, `waitlist`, `analytics_events`
   - Enables Row Level Security (RLS) policies

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## 📄 Pages

- `/` - Landing page with hero, how it works, example projection, testimonials, FAQ
- `/auth` - Login/Signup with Supabase Auth
- `/onboarding` - 3-step form to collect audience data
- `/dashboard` - Main app with 4 revenue intelligence tools
- `/settings` - Profile settings and account management
- `/privacy` - Privacy policy
- `/terms` - Terms of service

## 🧮 Revenue Clarity Tools

### 1. Revenue Breakdown
- Active audience calculation
- Conversion rate estimation
- Monthly revenue projection
- Formula explanation

### 2. Smart Pricing Optimizer
- Market average comparison
- Recommended pricing
- Potential revenue increase

### 3. Income Goal Calculator
- Reverse engineering from goal
- 3 pricing strategy options
- Feasibility ratings (Easy/Possible/Challenging)

### 4. Break-Even Timeline
- Monthly cost tracking
- Break-even point calculation
- 6-month profit projection

## 🔒 Security

- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Passwords hashed by Supabase Auth
- Security headers configured in `next.config.js`

## 📊 Analytics Events

10 core events tracked:
1. `page_view`
2. `waitlist_submit`
3. `signup`
4. `email_confirmed`
5. `onboarding_start`
6. `onboarding_complete`
7. `calc_start`
8. `calc_complete`
9. `upgrade_click`
10. `referral_click`

## 🧪 Testing

Run the development server and test:
1. Landing page loads
2. Signup flow completes
3. Onboarding saves data
4. Dashboard shows calculations
5. Settings allows updates

## 🚀 Deployment

Deploy to Vercel:
```bash
vercel
```

Set environment variables in Vercel dashboard.

## 📝 License

This is a validation MVP project.

## 🎯 Success Metrics

**Pass Criteria (3 months):**
- ✅ 30+ paid users (when payment launches)
- ✅ Signup rate >5%
- ✅ Onboarding completion >70%
- ✅ Churn <12%
- ✅ 10+ positive testimonials

**Fail Criteria:**
- ❌ <15 users after 3 months
- ❌ Signup rate <3%
- ❌ Onboarding completion <50%
- ❌ Churn >15%
- ❌ Zero organic growth
