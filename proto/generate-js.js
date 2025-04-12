const pbjs = require('protobufjs-cli/pbjs');
const pbts = require('protobufjs-cli/pbts');
const fs = require('fs');
const path = require('path');

// Create output directories if they don't exist
const outputDir = path.join(__dirname, 'generated');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Generate JavaScript code from proto
pbjs.main([
  '--target', 'static-module',
  '--wrap', 'commonjs',
  '--out', path.join(outputDir, 'orbitrace.js'),
  path.join(__dirname, 'orbitrace.proto')
], function(err) {
  if (err) {
    console.error('Error generating JavaScript:', err);
    process.exit(1);
  }

  console.log('Successfully generated JavaScript from proto');

  // Generate TypeScript definitions
  pbts.main([
    '--out', path.join(outputDir, 'orbitrace.d.ts'),
    path.join(outputDir, 'orbitrace.js')
  ], function(err) {
    if (err) {
      console.error('Error generating TypeScript definitions:', err);
      process.exit(1);
    }

    console.log('Successfully generated TypeScript definitions');
  });
});