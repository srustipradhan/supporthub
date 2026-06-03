
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const path = join(root, 'firebase-service-account.json');

if (!existsSync(path)) {
  console.error(`
Missing: backend/firebase-service-account.json

Download it from Firebase Console:
  1. https://console.firebase.google.com/ → project supporthub-69074
  2. Project settings (gear) → Service accounts
  3. "Generate new private key" (NOT google-services.json)

Save the downloaded file as:
  ${path}

Then run this script again.
`);
  process.exit(1);
}

const json = readFileSync(path, 'utf8');
const parsed = JSON.parse(json);

if (parsed.configuration_version && parsed.project_info) {
  console.error(`
This file is google-services.json (Android app config), NOT a service account key.

It has "project_info" and "client" — the server needs a different file with:
  "type": "service_account"
  "private_key": "-----BEGIN PRIVATE KEY-----..."
  "client_email": "...@supporthub-69074.iam.gserviceaccount.com"

Firebase Console → supporthub-69074 → Project settings → Service accounts
→ "Generate new private key" → save as firebase-service-account.json
`);
  process.exit(1);
}

if (parsed.type !== 'service_account') {
  console.error('Expected a service account JSON (type: "service_account").');
  process.exit(1);
}

console.log('\nCopy this entire line into Render → Environment → FIREBASE_SERVICE_ACCOUNT_JSON:\n');
console.log(JSON.stringify(parsed));
console.log('\nThen redeploy the Render service.\n');
