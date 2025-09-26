#!/usr/bin/env node

/**
 * NexaFlow Health Check Script
 * Verifies that the Supabase setup is working correctly
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 NexaFlow Health Check\n');

let hasErrors = false;

// Check if .env.local exists
if (!fs.existsSync('.env.local')) {
  console.log('❌ .env.local file not found');
  console.log('   Run "npm run setup" to create it\n');
  hasErrors = true;
} else {
  console.log('✅ .env.local file exists');
  
  // Check environment variables
  const envContent = fs.readFileSync('.env.local', 'utf-8');
  
  if (!envContent.includes('VITE_SUPABASE_URL=')) {
    console.log('❌ VITE_SUPABASE_URL not set in .env.local');
    hasErrors = true;
  } else {
    console.log('✅ VITE_SUPABASE_URL configured');
  }
  
  if (!envContent.includes('VITE_SUPABASE_ANON_KEY=')) {
    console.log('❌ VITE_SUPABASE_ANON_KEY not set in .env.local');
    hasErrors = true;
  } else {
    console.log('✅ VITE_SUPABASE_ANON_KEY configured');
  }
}

// Check required files
const requiredFiles = [
  'supabase-schema.sql',
  'supabase-sample-data.sql',
  'src/lib/supabase.ts',
  'src/context/SupabaseAuthContext.tsx',
  'src/components/Auth/SupabaseLoginForm.tsx'
];

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} missing`);
    hasErrors = true;
  }
});

// Check node_modules
if (!fs.existsSync('node_modules')) {
  console.log('❌ node_modules not found');
  console.log('   Run "npm install" to install dependencies\n');
  hasErrors = true;
} else {
  console.log('✅ Dependencies installed');
}

// Check Supabase packages
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
  const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  if (dependencies['@supabase/supabase-js']) {
    console.log('✅ Supabase client installed');
  } else {
    console.log('❌ @supabase/supabase-js not installed');
    console.log('   Run "npm install @supabase/supabase-js"');
    hasErrors = true;
  }
} catch (error) {
  console.log('❌ Error reading package.json');
  hasErrors = true;
}

console.log('\n' + '='.repeat(50));

if (hasErrors) {
  console.log('❌ Setup incomplete. Please fix the issues above.\n');
  console.log('Quick fix commands:');
  console.log('1. npm install');
  console.log('2. npm run setup');
  console.log('3. Follow the setup instructions in DEPLOYMENT.md\n');
  process.exit(1);
} else {
  console.log('🎉 All checks passed! Your NexaFlow setup looks good.\n');
  console.log('Next steps:');
  console.log('1. Make sure you\'ve run the Supabase SQL scripts');
  console.log('2. Created the demo users in Supabase Auth');
  console.log('3. Start the app with: npm run dev\n');
  console.log('📖 See DEPLOYMENT.md for complete instructions');
}

console.log('\n💡 Tips:');
console.log('• Test login with admin@nexaflow.com / demo123');
console.log('• Check browser console for any errors');
console.log('• Verify Supabase RLS policies are working');
console.log('• Monitor Supabase Dashboard for API usage\n');