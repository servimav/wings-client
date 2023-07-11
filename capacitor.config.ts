import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.servimav.wings',
  appName: 'Wings',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
