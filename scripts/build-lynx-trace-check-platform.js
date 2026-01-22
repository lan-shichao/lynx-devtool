#!/usr/bin/env node

/**
 * Platform-aware build strategy selector for lynx-trace
 * - Windows: Uses prebuilt binaries (downloaded from GitHub)
 * - macOS/Linux: Builds from source locally
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const isWindows = process.platform === 'win32';

console.log('');
console.log('═══════════════════════════════════════════════');
console.log('  Lynx Trace Build Script');
console.log('═══════════════════════════════════════════════');
console.log(`Platform: ${process.platform}`);
console.log('');

if (isWindows) {
  console.log('📦 Windows platform detected, using prebuilt binaries...\n');
  console.log('ℹ️  Reason: Perfetto does not officially support building UI on Windows');
  console.log('ℹ️  Solution: Downloading prebuilt artifacts from lynx-family/lynx-trace\n');
  
  try {
    // Check if prebuilt binary already exists
    const resourcePath = path.join(__dirname, '..', 'packages', 'lynx-devtool-cli', 'resources', 'lynx-trace.tar.gz');
    
    if (fs.existsSync(resourcePath)) {
      const stats = fs.statSync(resourcePath);
      const size = (stats.size / 1024 / 1024).toFixed(2);
      console.log(`✅ Found existing prebuilt binary:`);
      console.log(`   Path: ${resourcePath}`);
      console.log(`   Size: ${size} MB`);
      console.log(`   Modified: ${stats.mtime.toLocaleString()}`);
      console.log('');
      console.log('💡 Using existing binary. To update, run:');
      console.log('   pnpm run download:lynx-trace');
      console.log('');
      process.exit(0);
    }
    
    // Download prebuilt binary
    console.log('⬇️  Downloading prebuilt binary...\n');
    const downloadScript = path.join(__dirname, 'download-lynx-trace-prebuilt.js');
    execSync(`node "${downloadScript}"`, { stdio: 'inherit' });
    
    console.log('');
    console.log('✅ Lynx-trace setup completed for Windows platform!');
    console.log('');
    
  } catch (error) {
    console.error('');
    console.error('❌ Failed to download prebuilt binary!');
    console.error('');
    console.error('🔧 Manual resolution steps:');
    console.error('   1. Visit https://github.com/lynx-family/lynx-trace/releases');
    console.error('   2. Download the latest perfetto-ui-release-*.tar.gz');
    console.error('   3. Rename it to lynx-trace.tar.gz');
    console.error('   4. Place it in packages/lynx-devtool-cli/resources/');
    console.error('');
    console.error('Alternative: Build locally using WSL2:');
    console.error('   wsl');
    console.error('   cd /mnt/e/lynx/lynx-devtool');
    console.error('   pnpm run build:lynx-trace');
    console.error('');
    process.exit(error.status || 1);
  }
  
} else {
  // macOS or Linux - build from source
  console.log('🔨 macOS/Linux platform detected, building from source...\n');
  
  try {
    const buildScript = path.join(__dirname, 'build-lynx-trace-output.js');
    execSync(`node "${buildScript}"`, { stdio: 'inherit' });
    
    console.log('');
    console.log('✅ Lynx-trace build completed successfully!');
    console.log('');
    
  } catch (error) {
    console.error('');
    console.error('❌ Build failed!');
    console.error('');
    console.error('Please check the error messages above and retry.');
    console.error('');
    process.exit(error.status || 1);
  }
}

console.log('═══════════════════════════════════════════════');
console.log('');
