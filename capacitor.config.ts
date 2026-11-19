
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.auratune.app',
  appName: 'AuraTune',
  // The hybrid app streams the deployed Next.js frontend so Firebase and
  // server-backed AI routes are available inside the native WebView.
  webDir: 'mobile-shell',
  server: {
    androidScheme: 'https',
    cleartext: false,
    ...(process.env.CAPACITOR_SERVER_URL
      ? { url: process.env.CAPACITOR_SERVER_URL }
      : {}),
  },
  android: {
    buildOptions: {
      releaseType: 'APK',
    }
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#09080A",
      showSpinner: false,
      androidScaleType: "CENTER_CROP"
    }
  }
};

export default config;
