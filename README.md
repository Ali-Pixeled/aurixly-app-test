# Aurixly Investment Platform (BETA v1.0.0-beta.1)

🚀 **BETA VERSION** - A modern, secure investment platform built with React, TypeScript, Supabase, and Clerk authentication.

> ⚠️ **BETA SOFTWARE**: This is beta software intended for testing and demonstration purposes only. Not recommended for production use with real financial transactions.

## 🌟 Features

- **🔐 Secure Authentication** - Powered by Clerk with email/password and social login
- **📈 Investment Plans** - Three tier investment options with guaranteed returns
- **📊 Real-time Dashboard** - Track investments, earnings, and portfolio performance
- **💰 Transaction Management** - Deposit, withdraw, and view transaction history
- **👨‍💼 Admin Panel** - Comprehensive admin tools for platform management
- **📱 Mobile Responsive** - Optimized for all device sizes
- **🔒 Bank-level Security** - Row-level security with Supabase

## 💎 Investment Plans

### 🥉 Starter Plan
- **Investment Range**: $2 - $20
- **Return**: 20% profit after 2 weeks
- **Perfect for**: New investors

### 🥈 Premium Plan (Featured)
- **Investment Range**: $20 - $100
- **Return**: 30% profit after 2 weeks
- **Perfect for**: Regular investors

### 🥇 VIP Plan
- **Investment Range**: $100 - $10,000
- **Return**: 40% profit after 2 weeks
- **Perfect for**: High-value investors

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Authentication**: Clerk
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Deployment**: Ready for Netlify/Vercel

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd aurixly-investment-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your environment variables:
   - `VITE_SUPABASE_URL` - Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` - Your Supabase anon key
   - `VITE_CLERK_PUBLISHABLE_KEY` - Your Clerk publishable key

4. **Database Setup**
   - Create a new Supabase project
   - Run the migration files in `supabase/migrations/` in order
   - The database schema will be automatically created

5. **Start Development Server**
   ```bash
   npm run dev
   ```

## 🗄️ Database Schema

The platform uses the following main tables:

- **users** - User profiles and balances
- **investment_plans** - Available investment options
- **investments** - User investments and earnings
- **transactions** - All financial transactions

## 🔐 Security Features

- Row Level Security (RLS) enabled on all tables
- Secure authentication with Clerk
- Encrypted data transmission
- Input validation and sanitization
- CSRF protection

## 📱 Features Overview

### User Features
- **Dashboard** - Overview of investments and earnings
- **Investment Plans** - Browse and invest in different plans
- **Exchange** - Deposit (min $1) and withdraw (min $10) funds
- **Portfolio** - Track active and completed investments
- **Transaction History** - View all account activity
- **Profile Management** - Update account settings

### Admin Features
- **User Management** - View and manage all users
- **Investment Oversight** - Monitor all platform investments
- **Transaction Monitoring** - Track all financial activity
- **Analytics Dashboard** - Platform performance metrics

## 🚀 Deployment

### Netlify
1. Connect your repository to Netlify
2. Set environment variables in Netlify dashboard
3. Deploy with build command: `npm run build`

### Vercel
1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

### Project Structure

```
src/
├── components/          # React components
├── contexts/           # React contexts
├── services/           # API services
├── types/              # TypeScript types
├── lib/                # Utilities and configurations
└── main.tsx           # Application entry point
```

## ⚠️ BETA Disclaimer

**This is BETA software for demonstration and testing purposes only.**

- All investment features are simulated
- Do not use with real financial transactions
- Not recommended for production environments
- Features may change without notice
- No warranty or guarantee provided

## 🤝 Contributing

This is currently a private beta project. Contributing guidelines will be provided when the project moves to a stable release.

## 📞 Support

For support during the beta period, please contact the development team directly.

## 📄 Copyright

© 2025 Aurixly Investment Platform. All rights reserved.

This software is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

---

**Version**: 1.0.0-beta.1  
**Last Updated**: January 2025  
**Status**: Private Beta Release  
**License**: Proprietary (All Rights Reserved)