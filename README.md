# AuraTune

AuraTune is a music discovery and listening product. The existing web app uses Next.js 15, React 19, Firebase, and Genkit. The Android client is being migrated to Flutter/Dart so audio playback can use Android's native media session, background service, notification, headset buttons, and lock-screen controls.

## Web app

```bash
npm ci
npm run dev
```

Open [http://localhost:9002](http://localhost:9002). The web app uses the Firebase project configured in `src/firebase/config.ts`; AI features also need their provider credentials in the server environment.

## Flutter Android app

The first native slice lives in [`mobile/`](mobile/README.md). It provides a native Flutter audio player with a queue and Android background/media controls. Firebase catalog and account integration are not migrated yet; the Next.js site remains the web edition during the staged migration.

Requirements: Flutter SDK, Java 17+, and Android Studio/Android SDK. From the repository root:

```bash
npm run mobile:init
```

The setup script also registers the Android media service and its permissions. Then run:

```bash
npm run mobile:build  # debug APK
npm run mobile:apk    # release APK
```

Release APK output is `mobile/build/app/outputs/flutter-apk/app-release.apk`. Configure signing in the generated Gradle project before distributing a release. Do not commit a keystore or passwords.

## Migration scope

The new mobile player accepts direct HTTPS audio/stream URLs. It is a working native-audio foundation, not yet a full port of the web app's Firebase catalog, login, playlists, discovery, AI tools, or settings. Those will need to move into Flutter and connect to the existing Firebase/Next.js backend in later steps.
