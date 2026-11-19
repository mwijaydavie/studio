import { readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const mobileDir = resolve(repoRoot, 'mobile');
const create = spawnSync('flutter', [
  'create',
  '--platforms=android',
  '--org',
  'com.auratune',
  '--project-name',
  'app',
  '.',
], {
  cwd: mobileDir,
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

if (create.error || create.status !== 0) {
  console.error('Flutter Android project generation failed. Install Flutter and Android Studio, then retry.');
  process.exit(create.status ?? 1);
}

const manifestPath = resolve(mobileDir, 'android/app/src/main/AndroidManifest.xml');
let manifest = readFileSync(manifestPath, 'utf8');
const permissions = [
  'android.permission.INTERNET',
  'android.permission.WAKE_LOCK',
  'android.permission.FOREGROUND_SERVICE',
  'android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK',
];
for (const permission of permissions) {
  if (!manifest.includes(`android:name="${permission}"`)) {
    manifest = manifest.replace(
      '</manifest>',
      `    <uses-permission android:name="${permission}" />\n</manifest>`,
    );
  }
}

// AudioServiceActivity shares the Flutter engine with notification launch intents.
manifest = manifest.replace(
  /(<activity\b[^>]*android:name=")[^"]+/,
  '$1com.ryanheise.audioservice.AudioServiceActivity',
);
if (!manifest.includes('android:name="com.ryanheise.audioservice.AudioServiceActivity"')) {
  throw new Error('Could not find Flutter launch activity in the generated Android manifest.');
}

const serviceEntry = `
        <service
            android:name="com.ryanheise.audioservice.AudioService"
            android:exported="true"
            android:foregroundServiceType="mediaPlayback"
            android:stopWithTask="false">
            <intent-filter>
                <action android:name="android.media.browse.MediaBrowserService" />
            </intent-filter>
        </service>`;
const receiverEntry = `
        <receiver
            android:name="com.ryanheise.audioservice.MediaButtonReceiver"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MEDIA_BUTTON" />
            </intent-filter>
        </receiver>`;
if (!manifest.includes('android:name="com.ryanheise.audioservice.AudioService"')) {
  manifest = manifest.replace('</application>', `${serviceEntry}\n    </application>`);
}
if (!manifest.includes('android:name="com.ryanheise.audioservice.MediaButtonReceiver"')) {
  manifest = manifest.replace('</application>', `${receiverEntry}\n    </application>`);
}

writeFileSync(manifestPath, manifest);
console.log(`Configured Android media playback service in ${manifestPath}`);
