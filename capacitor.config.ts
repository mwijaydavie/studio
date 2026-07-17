
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.auratune.app',
  appName: 'AuraTune',
  webDir: 'out',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https',
    cleartext: true
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystorePassword: '',
      keystoreAlias: undefined,
      keystoreAliasPassword: '',
      releaseType: 'AAB',
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
