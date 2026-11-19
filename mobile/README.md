# AuraTune Flutter app (Android-first)

This folder starts the native Flutter migration. The first vertical slice is a native audio player: it accepts direct HTTPS audio URLs, builds a queue, and uses `audio_service` + `just_audio` to expose play/pause/skip/seek through Android's media session, notification, headset buttons, and lock screen while audio continues in the background.

The current Flutter slice is not yet feature-parity with the Next.js app: it does not yet connect Firebase, import the existing catalog/playlists, or implement sign-in. The Next.js site remains the web app while the Android experience is migrated incrementally.

## Generate the Android host once

Flutter and Android Studio (Java 17+ and Android SDK) are required. From the repository root run once:

```bash
npm run mobile:init
```

The setup script generates `mobile/android/` with app ID `com.auratune.app` and installs the foreground media service, media-button receiver, and required internet/wake/foreground-service permissions in the Android manifest. The generated Android project is source and should be committed.

The playback URLs must be direct HTTPS audio or radio-stream endpoints; a normal webpage or video page is not playable. The player validates HTTPS before starting playback.

## Run and build

```bash
cd mobile
flutter pub get
flutter run
```

Or from the repository root:

```bash
npm run mobile:build  # debug APK
npm run mobile:apk    # release APK
```

Release output: `mobile/build/app/outputs/flutter-apk/app-release.apk`. Configure Android signing in the generated Gradle project before distributing a release. Do not commit a keystore or passwords.

## Native playback smoke test

1. Add a direct HTTPS MP3/AAC or radio-stream URL and metadata.
2. Start playback; confirm the notification and lock screen show title/artist/artwork.
3. Test notification play/pause/next/previous, wired/Bluetooth headset buttons, seeking, an incoming audio interruption, and swiping the app away while audio continues.
4. Test loss of network and a URL that returns an HTML page; the UI should show a useful playback error rather than imply it played.
