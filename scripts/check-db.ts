#!/usr/bin/env tsx
/**
 * Database Health Check Script
 * Tests connection to Neon PostgreSQL database
 * 
 * Usage:
 *   pnpm check-db
 */

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

async function checkDatabase() {
  console.log(`${colors.cyan}==================================${colors.reset}`);
  console.log(`${colors.cyan}   Database Health Check${colors.reset}`);
  console.log(`${colors.cyan}==================================${colors.reset}\n`);

  // Check DATABASE_URL
  const dbUrl = process.env.DATABASE_URL;
  
  console.log('📋 Environment Check:');
  if (!dbUrl) {
    console.log(`${colors.red}❌ DATABASE_URL is NOT set${colors.reset}`);
    console.log(`${colors.yellow}⚠️  Add DATABASE_URL to your .env file or environment${colors.reset}\n`);
    process.exit(1);
  }
  
  // Mask password for display
  const maskedUrl = dbUrl.replace(/:([^@]+)@/, ':****@');
  console.log(`${colors.green}✅ DATABASE_URL is set${colors.reset}`);
  console.log(`   ${colors.blue}${maskedUrl}${colors.reset}\n`);

  // Check connection parameters
  console.log('🔍 Connection Parameters:');
  try {
    const url = new URL(dbUrl.replace('postgresql://', 'http://'));
    console.log(`   Host: ${url.hostname}`);
    console.log(`   Database: ${url.pathname.substring(1)}`);
    console.log(`   User: ${url.username}`);
    
    const params = new URLSearchParams(url.search);
    if (params.has('sslmode')) {
      console.log(`   SSL Mode: ${params.get('sslmode')}`);
    }
    if (params.has('connect_timeout')) {
      console.log(`   Timeout: ${params.get('connect_timeout')}s`);
    }
    console.log();
  } catch (e) {
    console.log(`${colors.yellow}⚠️  Could not parse DATABASE_URL${colors.reset}\n`);
  }

  // Test Prisma connection
  console.log('🔌 Testing Database Connection...');
  const prisma = new PrismaClient({
    log: ['error'],
  });

  try {
    const startTime = Date.now();
    
    // Test basic query
    await prisma.$queryRaw`SELECT 1 as test`;
    const queryTime = Date.now() - startTime;
    
    console.log(`${colors.green}✅ Database connection successful${colors.reset}`);
    console.log(`   Response time: ${queryTime}ms\n`);

    // Get database info
    console.log('📊 Database Information:');
    const dbInfo: any = await prisma.$queryRaw`
      SELECT 
        current_database() as database,
        current_user as user,
        version() as version
    `;
    
    if (dbInfo && dbInfo.length > 0) {
      console.log(`   Database: ${dbInfo[0].database}`);
      console.log(`   User: ${dbInfo[0].user}`);
      console.log(`   Version: ${dbInfo[0].version.split(',')[0]}\n`);
    }

    // Check tables
    console.log('📋 Checking Tables:');
    const tables: any = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `;
    
    if (tables && tables.length > 0) {
      console.log(`${colors.green}✅ Found ${tables.length} tables:${colors.reset}`);
      tables.slice(0, 10).forEach((t: any) => {
        console.log(`   - ${t.table_name}`);
      });
      if (tables.length > 10) {
        console.log(`   ... and ${tables.length - 10} more`);
      }
    } else {
      console.log(`${colors.yellow}⚠️  No tables found - run migrations:${colors.reset}`);
      console.log(`   pnpm prisma migrate deploy\n`);
    }

    console.log();
    console.log(`${colors.green}==================================${colors.reset}`);
    console.log(`${colors.green}✅ All checks passed!${colors.reset}`);
    console.log(`${colors.green}==================================${colors.reset}`);

  } catch (error: any) {
    console.log(`${colors.red}❌ Database connection failed${colors.reset}`);
    console.log(`${colors.red}Error: ${error.message}${colors.reset}\n`);
    
    // Provide helpful hints
    console.log('💡 Troubleshooting:');
    if (error.code === 'P1001') {
      console.log('   • Check if DATABASE_URL is correct');
      console.log('   • Verify network connectivity');
      console.log('   • Ensure Neon database is running');
    } else if (error.code === 'P1017') {
      console.log('   • Database server closed the connection');
      console.log('   • Try adding/adjusting connect_timeout parameter');
    }
    console.log();
    
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase().catch(console.error);
