
# Crypto Mining Control Mobile App

A full-featured mobile application for managing cryptocurrency mining operations, featuring both user and admin interfaces. This app allows users to control mining tasks remotely and administrators to manage the entire mining infrastructure.

## Features

### User Side
- **Authentication**: Secure login/registration system with role-based access control
- **Mining Task Management**: Start, pause, resume, and stop mining tasks
- **Performance Monitoring**: Track hashrates, rewards, and mining progress in real-time
- **Statistics**: View historical performance data and earnings

### Admin Side
- **User Management**: View and manage all users of the platform
- **System Overview**: Monitor overall system performance and health
- **Task Management**: Control all mining operations across the platform
- **Analytics Dashboard**: View comprehensive metrics about mining operations

## Technology Stack

### A. Mobile App
- **Framework**: React with Capacitor for cross-platform (iOS/Android) support
- **UI Libraries**: ShadCN UI components for consistent design
- **State Management**: React Context API for state management

### B. Back End (Mining Controller & API)
- **Server Language**: Node.js (with Express.js)
- **Mining Daemons**:
  - XMRig for Monero
  - T-Rex or Gminer for ETC, RVN, VTC
  - Litecoin pool API for DOGE
- **API**: REST API
- **Real-time**: WebSocket for mining stats

### C. Admin Dashboard
- **Frontend**: React with TypeScript
- **Backend**: Same as mobile (Node.js API)
- **Auth**: JWT authentication

### D. Database
- **Main DB**: PostgreSQL
- **Cache**: Redis (for quick stats, sessions)

### E. DevOps & Hosting
- **Server Hosting**: AWS EC2 / DigitalOcean (GPU-capable)
- **Load Balancer**: Nginx
- **CI/CD**: GitHub Actions
- **Push Notifications**: Firebase Cloud Messaging (FCM)

## Security
- HTTPS for all data traffic
- JWT-based authentication
- Bcrypt password hashing
- Server resource limits per user
- Role-based access control (RBAC) for admins
- Abuse protection (mining task throttling)

## Monetization Options
- In-app purchases (extra hashpower, faster payouts)
- Ad integration (rewarded ads for boosts)
- Subscription tiers (Pro users get better rewards)
- Token launch: Gamified reward model with custom coin

## Roadmap / Development Phases

### Phase 1: Planning & Design
- Define UI/UX for both mobile and admin
- Choose coins and finalize back-end mining tools
- Map out server infrastructure

### Phase 2: MVP Build
- Build mobile app with mining control UI
- Create basic API and mining job queue system
- Integrate Monero (XMR) mining only
- Admin dashboard with user view

### Phase 3: Multi-Coin Support & Scaling
- Add ETC, RVN, VTC, DOGE mining support
- Expand mining server infrastructure
- Add analytics, wallet management, and real-time updates

### Phase 4: Payouts & Security
- Enable crypto wallet withdrawals
- Set up anti-abuse systems
- Conduct penetration testing

### Phase 5: Launch & Monetization
- Release to Google Play / App Store
- Run marketing campaigns
- Add monetization features

## Supported Coins for Mining

| Coin | Algorithm | Hardware |
|------|-----------|----------|
| Monero (XMR) | RandomX | CPU |
| Ethereum Classic (ETC) | Etchash | GPU |
| Ravencoin (RVN) | KawPow | GPU |
| Vertcoin (VTC) | Verthash | CPU/GPU |
| Dogecoin (DOGE) | Scrypt (via Litecoin) | GPU |
| Custom Token | Internal | N/A |

## Getting Started

### Prerequisites
- Node.js and npm

### Installation

1. Clone the repository
```
git clone [repository-url]
cd crypto-mining-control
```

2. Install dependencies
```
npm install
```

3. Run the development server
```
npm run dev
```

4. Build for production
```
npm run build
```

### Mobile Setup

This project uses Capacitor to enable mobile functionality.

1. After building the project, sync with Capacitor
```
npx cap sync
```

2. Add platforms
```
npx cap add ios
npx cap add android
```

3. Open in native IDEs
```
npx cap open ios     # Opens Xcode for iOS
npx cap open android # Opens Android Studio
```

## License
This project is licensed under the MIT License - see the LICENSE file for details.
