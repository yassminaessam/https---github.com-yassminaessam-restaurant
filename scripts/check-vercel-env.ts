#!/usr/bin/env tsx
/**
 * Vercel Environment Variables Checker
 * Checks if required environment variables are set in Vercel
 * 
 * Usage:
 *   pnpm check-vercel-env
 * 
 * Note: This checks what SHOULD be set, not what IS set remotely
 *       To check actual Vercel env vars, use: vercel env ls
 */

import 'dotenv/config';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

const requiredEnvVars = [
  {
    name: 'DATABASE_URL',
    description: 'Neon PostgreSQL connection string (pooled)',
    required: true,
    example: 'postgresql://user:pass@host-pooler.neon.tech/db?sslmode=require',
  },
];

const optionalEnvVars = [
  {
    name: 'PING_MESSAGE',
    description: 'Custom message for /api/ping endpoint',
    required: false,
    example: 'pong',
  },
];

console.log(`${colors.cyan}${colors.bold}========================================${colors.reset}`);
console.log(`${colors.cyan}${colors.bold}  Vercel Environment Variables Check${colors.reset}`);
console.log(`${colors.cyan}${colors.bold}========================================${colors.reset}\n`);

console.log('📋 Local Environment Status:\n');

let hasErrors = false;

// Check required variables
console.log(`${colors.bold}Required Variables:${colors.reset}`);
requiredEnvVars.forEach(envVar => {
  const value = process.env[envVar.name];
  if (value) {
    // Mask sensitive data
    const maskedValue = envVar.name.includes('DATABASE') 
      ? value.replace(/:([^@]+)@/, ':****@').substring(0, 60) + '...'
      : value.substring(0, 20) + '...';
    
    console.log(`${colors.green}✅ ${envVar.name}${colors.reset}`);
    console.log(`   ${colors.blue}${maskedValue}${colors.reset}`);
  } else {
    console.log(`${colors.red}❌ ${envVar.name} - NOT SET${colors.reset}`);
    console.log(`   ${envVar.description}`);
    hasErrors = true;
  }
  console.log();
});

// Check optional variables
console.log(`${colors.bold}Optional Variables:${colors.reset}`);
optionalEnvVars.forEach(envVar => {
  const value = process.env[envVar.name];
  if (value) {
    console.log(`${colors.green}✅ ${envVar.name}${colors.reset}: ${value}`);
  } else {
    console.log(`${colors.yellow}⚠️  ${envVar.name} - Not set${colors.reset}`);
    console.log(`   ${envVar.description}`);
  }
  console.log();
});

console.log(`${colors.cyan}========================================${colors.reset}\n`);

// Instructions for Vercel
console.log(`${colors.bold}📝 To add/check environment variables in Vercel:${colors.reset}\n`);
console.log('1. Using Vercel CLI (recommended):');
console.log(`   ${colors.blue}vercel env ls${colors.reset}                    # List all env vars`);
console.log(`   ${colors.blue}vercel env add DATABASE_URL${colors.reset}      # Add DATABASE_URL`);
console.log(`   ${colors.blue}vercel env pull .env.local${colors.reset}       # Pull env vars to local\n`);

console.log('2. Using Vercel Dashboard:');
console.log('   • Go to: https://vercel.com/dashboard');
console.log('   • Select your project');
console.log('   • Settings → Environment Variables');
console.log('   • Add each required variable for Production, Preview, Development\n');

console.log('3. After adding variables:');
console.log(`   ${colors.blue}git commit --allow-empty -m "trigger redeploy"${colors.reset}`);
console.log(`   ${colors.blue}git push${colors.reset}\n`);

console.log(`${colors.cyan}========================================${colors.reset}\n`);

console.log(`${colors.bold}🔍 Required Environment Variables for Vercel:${colors.reset}\n`);
requiredEnvVars.forEach(envVar => {
  console.log(`${colors.bold}${envVar.name}:${colors.reset}`);
  console.log(`  Description: ${envVar.description}`);
  console.log(`  Example: ${colors.blue}${envVar.example}${colors.reset}`);
  console.log();
});

if (hasErrors) {
  console.log(`${colors.red}❌ Some required variables are missing locally${colors.reset}`);
  console.log(`${colors.yellow}⚠️  Make sure these are also set in Vercel Dashboard${colors.reset}\n`);
  process.exit(1);
} else {
  console.log(`${colors.green}✅ All required variables are set locally${colors.reset}`);
  console.log(`${colors.yellow}⚠️  Remember to also set them in Vercel Dashboard${colors.reset}\n`);
}
