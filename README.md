# Aurixly Investment Platform (Beta v1.0.0-beta.1)

A modern, secure investment platform built with React, TypeScript, Supabase, and Clerk authentication.

## 🚀 Features

- **Secure Authentication** - Powered by Clerk with email/password and social login
- **Investment Plans** - Multiple investment options with different risk/reward profiles
- **Real-time Dashboard** - Track investments, earnings, and portfolio performance
- **Transaction Management** - Deposit, withdraw, and view transaction history
- **Admin Panel** - Comprehensive admin tools for platform management
- **Mobile Responsive** - Optimized for all device sizes
- **Bank-level Security** - Row-level security with Supabase

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

## 🎯 Investment Plans

### Starter Plan
- **Rate**: 0.5% per hour
- **Duration**: 10 days
- **Min/Max**: $10 - $500
- **Total Return**: 120%

### Premium Plan (Featured)
- **Rate**: 0.75% per hour
- **Duration**: 7 days
- **Min/Max**: $500 - $2,000
- **Total Return**: 126%

### VIP Plan
- **Rate**: 1.2% per hour
- **Duration**: 5 days
- **Min/Max**: $2,000 - $10,000
- **Total Return**: 144%

## 📱 Features Overview

### User Features
- **Dashboard** - Overview of investments and earnings
- **Investment Plans** - Browse and invest in different plans
- **Exchange** - Deposit and withdraw funds
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

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support, email support@aurixly.com or create an issue in the repository.

## ⚠️ Disclaimer

This is a beta version. All investments carry risk. Past performance does not guarantee future results. Please invest responsibly and only invest what you can afford to lose.

---

**Version**: 1.0.0-beta.1  
**Last Updated**: January 2025  
**Status**: Beta Release