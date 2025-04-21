
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

- **Frontend**: React with TypeScript and Tailwind CSS
- **Mobile Framework**: Capacitor for cross-platform (iOS/Android) compatibility
- **UI Components**: ShadCN UI components for a consistent design
- **State Management**: React Context API for state management
- **Routing**: React Router for navigation
- **Authentication**: Custom JWT-based authentication (simulated for demo)

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

## Mobile App Structure

### User Flow
1. **Authentication**: Users start at the login/registration screen
2. **Dashboard**: After login, users see their mining overview
3. **Mining Control**: Users can start/manage mining tasks
4. **Statistics**: Users can view their mining performance

### Admin Flow
1. **Admin Dashboard**: Administrators see a comprehensive overview
2. **User Management**: Admins can view and manage users
3. **System Monitoring**: Admins can view system-wide metrics

## Development Notes

### Adding a New Mining Algorithm
To add support for a new mining algorithm:
1. Modify the `MiningContext.tsx` file to include the new algorithm type
2. Update the algorithm selection in the Mining.tsx component
3. Implement algorithm-specific logic in the mining task handlers

### Mobile Optimization
- The app is optimized for mobile with responsive design
- Touch-friendly controls and appropriately sized elements
- Efficient data handling to minimize battery consumption

## Deployment

### Web Version
Build the web version for deployment:
```
npm run build
```

### Native Mobile Apps
For iOS:
```
npx cap sync
npx cap copy ios
```

For Android:
```
npx cap sync
npx cap copy android
```

## License
This project is licensed under the MIT License - see the LICENSE file for details.
