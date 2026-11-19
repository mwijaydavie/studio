import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const serverUrl = process.env.CAPACITOR_SERVER_URL?.trim();
if (!serverUrl) {
  console.error('Set CAPACITOR_SERVER_URL to the HTTPS URL of your deployed AuraTune app before building the Android package.');
  process.exit(1);
}

let parsedUrl;
try {
  parsedUrl = new URL(serverUrl);
} catch {
  console.error(`CAPACITOR_SERVER_URL is not a valid URL: ${serverUrl}`);
  process.exit(1);
}
if (parsedUrl.protocol !== 'https:' || parsedUrl.username || parsedUrl.password) {
  console.error('CAPACITOR_SERVER_URL must be an HTTPS URL and must not include credentials.');
  process.exit(1);
}

if (!existsSync('android')) {
  console.error('Android platform is not initialized. Run "npm run mobile:init" first (requires the Android SDK).');
  process.exit(1);
}

const result = spawnSync('npx', ['cap', 'sync', 'android'], {
  stdio: 'inherit',
  env: { ...process.env, CAPACITOR_SERVER_URL: parsedUrl.toString().replace(/\/$/, '') },
  shell: process.platform === 'win32',
});
process.exit(result.status ?? 1);
