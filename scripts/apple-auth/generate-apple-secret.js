const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

/**
 * GENERATE APPLE CLIENT SECRET (JWT)
 * 
 * 1. Place your downloaded Apple .p8 key file in this same folder.
 * 2. Update the constants below with your actual values from the Apple Developer Portal.
 * 3. Run: npm install jsonwebtoken
 * 4. Run: node generate-apple-secret.js
 */

// --- FILL THESE IN ---
const TEAM_ID = '2787685448'; // 10-character Team ID
const KEY_ID = '6X789MF2A6';   // 10-character Key ID from the .p8 file
const CLIENT_ID = 'com.nicearley.projectathlete.web'; // Your Services ID (Identifier)
const P8_FILE_NAME = 'AuthKey_6X789MF2A6.p8'; // Exactly as the file is named in this folder
// ---------------------

const p8Path = path.join(__dirname, P8_FILE_NAME);

try {
  if (!fs.existsSync(p8Path)) {
    console.error(`ERROR: File not found at ${p8Path}`);
    console.log('Please make sure you have copied your Apple .p8 file into this folder and updated the P8_FILE_NAME variable.');
    process.exit(1);
  }

  const privateKey = fs.readFileSync(p8Path);

  const token = jwt.sign({}, privateKey, {
    algorithm: 'ES256',
    expiresIn: '180d', // Apple allows a maximum of 6 months (180 days)
    audience: 'https://appleid.apple.com',
    issuer: TEAM_ID,
    subject: CLIENT_ID,
    keyid: KEY_ID,
  });

  console.log('\n✅ YOUR SECRET JWT GENERATED SUCCESSFULLY:');
  console.log('-------------------------------------------');
  console.log(token);
  console.log('-------------------------------------------');
  console.log('Copy the long string above (ey...) and paste it into the "Secret Key" field in Supabase.\n');
  console.log('⚠️  REMINDER: This key will expire in 180 days. You will need to re-run this script and update Supabase then.');

} catch (err) {
  console.error('\n❌ FAILED TO GENERATE TOKEN:');
  console.error(err.message);
}

