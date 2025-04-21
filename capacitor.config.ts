
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.e67a8e8f055b466aab8e419533c4b576',
  appName: 'crypto-mine-control',
  webDir: 'dist',
  server: {
    url: 'https://e67a8e8f-055b-466a-ab8e-419533c4b576.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  // Ensure dark mode content doesn't shift
  ios: {
    contentInset: 'always',
  },
  android: {
    // Add any Android specific settings
  }
};

export default config;
