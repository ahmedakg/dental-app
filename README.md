# 🦷 Abdullah Dental Care Management System v2.0

Complete dental clinic management system built for Dr. Ahmed Abdullah's practice in Peshawar.

## ✨ Features

- **Patient Management** - Complete records with medical history & behavior tags
- **Dual Appointment Calendars** - General + Orthodontist scheduling
- **Treatment Planning** - FDI tooth charts, 70 pre-loaded treatments (USD-pegged)
- **Premium Prescriptions** - 35 conditions, 3-tier protocols, auto medical history checks
- **Billing & Finance** - Professional PDF receipts, expense tracking, reports
- **Lab Work Tracking** - Case management with status tracking
- **Orthodontic Module** - Installment tracking, 50-50 split calculations
- **WhatsApp Reminders** - Free OS Share API integration
- **Gamification** - Retro-style motivation system for staff
- **Google Drive Backup** - Automatic daily backups

## 💰 Cost: Rs. 0/month (Free Forever!)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ ([Download](https://nodejs.org/))
- Git ([Download](https://git-scm.com/))
- GitHub account
- Vercel account (free)

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📦 Deployment to Vercel (FREE Hosting)

### Method 1: Vercel Dashboard (Recommended)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR-USERNAME/abdullah-dental-care.git
   git branch -M main
   git push -u origin main
   ```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/login with GitHub
   - Click "New Project"
   - Import your GitHub repository
   - Configure:
     - Framework: Vite
     - Build Command: `npm run build`
     - Output Directory: `dist`
   - Click "Deploy"
   - **Done!** Your app will be live in 2-3 minutes

3. **Your Live URL:**
   ```
   https://abdullah-dental-care.vercel.app
   ```

### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Production deployment
vercel --prod
```

## 🔐 Google Drive Setup (Optional Backup)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create project: "Abdullah Dental Care"
3. Enable Google Drive API
4. Create OAuth 2.0 Client ID:
   - Type: Web application
   - Authorized origins: `https://your-app.vercel.app`
5. Copy Client ID
6. In Vercel → Settings → Environment Variables:
   ```
   VITE_GOOGLE_CLIENT_ID=your-client-id-here
   ```
7. Redeploy

## 📱 Progressive Web App (PWA)

After deployment, the app can be added to home screen on mobile devices for a native app-like experience.

**iOS:**
1. Open in Safari
2. Tap Share button
3. "Add to Home Screen"

**Android:**
1. Open in Chrome
2. Tap menu (3 dots)
3. "Add to Home screen"

## 🎯 User Accounts

### Primary User (Naveed - Assistant)
- Email: meetmrnaveed@gmail.com
- Role: Daily operations, appointments, billing

### Owner (Dr. Ahmed)
- Email: ahmedakg@gmail.com
- Role: Clinical oversight, reports, settings

## 📖 Documentation

- **Master Architecture Plan**: See `MASTER_ARCHITECTURE_PLAN.md` for complete technical documentation
- **All Features**: 10 complete modules with gamification
- **70 Treatments**: USD-pegged with automatic PKR conversion
- **35 Prescription Conditions**: Evidence-based protocols
- **Zero Operational Cost**: No subscriptions, no paid APIs

## 🛠️ Technology Stack

- **Frontend**: React 18.2 with Hooks
- **Database**: IndexedDB (Dexie.js)
- **Build Tool**: Vite 5.0
- **Hosting**: Vercel (FREE)
- **Backup**: Google Drive API (FREE)
- **PDF Generation**: jsPDF
- **Icons**: Lucide React

## 📊 Project Structure

```
abdullah-dental-complete/
├── public/                 # Static assets
├── src/
│   ├── components/        # React components
│   ├── lib/              # Database & utilities
│   ├── styles/           # CSS files
│   ├── App.jsx           # Main app component
│   └── main.jsx          # Entry point
├── package.json
├── vite.config.js
├── vercel.json
├── MASTER_ARCHITECTURE_PLAN.md  # Complete documentation
└── README.md
```

## 🔧 Development Commands

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to Vercel
vercel --prod
```

## 🌐 Continuous Deployment

Once connected to Vercel:
1. Make changes locally
2. Commit: `git commit -m "Your message"`
3. Push: `git push origin main`
4. Vercel auto-deploys in 2-3 minutes
5. **Live!** No manual deployment needed

## 🎮 Gamification Features

Naveed earns points for:
- Booking appointments: +10 points
- Completing treatments: +20 points
- Filling empty slots same-day: +50 points (QUICK WIN!)
- Sending reminders: +25 points
- Collecting payments: +30 points
- Daily goal achieved: +100 bonus

## 📞 Support

For technical issues, refer to the Master Architecture Plan or contact the development team.

## 📄 License

Proprietary - Abdullah Dental Care

---

**Version**: 2.0.0  
**Last Updated**: November 22, 2025  
**Status**: Production Ready ✅

**Deploy now and start using in minutes!** 🚀
