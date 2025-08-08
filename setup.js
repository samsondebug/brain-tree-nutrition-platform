const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Brain Tree Nutrition - One Click Setup');

try {
  console.log('\n📦 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  console.log('\n🔧 Configuring environment...');
  const envPath = path.join(__dirname, '.env');
  const examplePath = path.join(__dirname, 'env.example');
  if (!fs.existsSync(envPath) && fs.existsSync(examplePath)) {
    fs.copyFileSync(examplePath, envPath);
    console.log('✅ Created .env file from env.example');
  } else if (fs.existsSync(envPath)) {
    console.log('✅ .env file already exists');
  } else {
    console.warn('⚠️ env.example not found, skipping .env creation');
  }

  console.log('\n🚀 Starting server (Ctrl+C to stop)...');
  execSync('npm start', { stdio: 'inherit' });
} catch (err) {
  console.error('❌ Setup failed:', err.message);
  process.exit(1);
}
