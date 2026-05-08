/**
 * Test Room AI upload with a synthetic white/empty room image.
 * Uses only built-in Node.js modules — no form-data package needed.
 */
const sharp = require('sharp');
const http = require('http');
const fs = require('fs');
const path = require('path');

const BOUNDARY = '----FormDataBoundary' + Date.now();
const TEST_IMG = path.join(__dirname, 'test_white_room.jpg');

function buildBody(filePath) {
  const file = fs.readFileSync(filePath);
  return Buffer.concat([
    Buffer.from(
      `--${BOUNDARY}\r\n` +
      `Content-Disposition: form-data; name="image"; filename="test_room.jpg"\r\n` +
      `Content-Type: image/jpeg\r\n\r\n`
    ),
    file,
    Buffer.from(`\r\n--${BOUNDARY}--\r\n`),
  ]);
}

async function run() {
  // Create a near-white 200×200 image (empty room simulation)
  await sharp({
    create: { width: 200, height: 200, channels: 3, background: { r: 238, g: 238, b: 238 } }
  }).jpeg().toFile(TEST_IMG);
  console.log('✔ Test image created');

  const body = buildBody(TEST_IMG);

  await new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/room-ai/upload',
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${BOUNDARY}`,
        'Content-Length': body.length,
      },
    }, (res) => {
      let raw = '';
      res.on('data', c => raw += c);
      res.on('end', () => {
        console.log('\nHTTP Status:', res.statusCode);
        try {
          const json = JSON.parse(raw);
          if (json.success) {
            console.log('✅ Room AI SUCCESS');
            console.log('   detectedColor :', json.analysis.detectedColor);
            console.log('   detectedStyle :', json.analysis.detectedStyle);
            console.log('   roomType      :', json.analysis.roomType);
            console.log('   harmonyScore  :', json.analysis.harmonyScore);
            console.log('   isEmptyRoom   :', json.analysis.isEmptyRoom);
            console.log('   recommendations:', json.recommendations.length, 'products');
            if (json.recommendations[0]) {
              console.log('   First product :', json.recommendations[0].name);
            }
            console.log('\n   Explanation:', json.analysis.explanation);
          } else {
            console.log('❌ API returned error:', json.error);
          }
        } catch {
          console.log('Raw response:', raw);
        }
        resolve();
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });

  fs.unlinkSync(TEST_IMG);
  console.log('\n✔ Temp image cleaned up');
}

run().then(() => process.exit(0)).catch(err => {
  console.error('Test failed:', err.message);
  process.exit(1);
});
