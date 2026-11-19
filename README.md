# AuraTune

A mobile-first music discovery and listening app built with Next.js 15, React 19, Firebase, and Capacitor. The web app stays server-rendered so AI features can use Next.js server actions; the Android WebView points at a deployed AuraTune URL rather than pretending those server features work offline.

## Develop

```bash
npm ci
npm run dev
```

Open [http://localhost:9002](http://localhost:9002). The development app uses the Firebase project configured in `src/firebase/config.ts`. AI features also need the provider credentials used by the Genkit flows in the server environment.

Useful checks:

```bash
npm run typecheck
npm run build
```

## Android APK

Requirements: a deployed HTTPS AuraTune site, Node.js, Java 17+, and the Android SDK/Gradle tools. Capacitor loads the deployed site so Firebase authentication and server-backed AI routes remain available. Music and app features that depend on a network connection are not available offline.

1. Install Android Studio and its Android SDK, then configure `ANDROID_HOME` (or `ANDROID_SDK_ROOT`) and Java.
2. Add the native Android project once:

   ```bash
   npm run mobile:init
   ```

3. Set `CAPACITOR_SERVER_URL` to the public HTTPS origin of the deployed app and sync/build the APK:

   ```bash
   export CAPACITOR_SERVER_URL=https://your-auratune-domain.example
   npm run mobile:apk
   ```

   The release APK is produced under `android/app/build/outputs/apk/release/`. A release build without a configured signing key is unsigned; sign it with your own private Android keystore before distributing it. Never commit a keystore or its passwords.

To refresh the native WebView after deploying a new web version, rerun `npm run mobile:build` (with `CAPACITOR_SERVER_URL` set). The native package itself does not contain a copy of the Next.js server or AI credentials.

## Architecture notes

- `npm run build` is the normal server deployment build. Do not enable Next.js static export: the app uses Server Actions for AI flows.
- `capacitor.config.ts` accepts `CAPACITOR_SERVER_URL` and keeps cleartext HTTP disabled.
- The PWA manifest and app icon are local assets under `src/app/manifest.ts` and `public/icons/`.
- `src/components/layout/mobile-nav.tsx` and the persistent player account for mobile safe areas so the primary controls do not overlap.
