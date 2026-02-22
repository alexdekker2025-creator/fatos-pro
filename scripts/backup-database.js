/**
 * Database Backup Script
 * 
 * Creates a backup of the PostgreSQL database
 * Usage: node scripts/backup-database.js
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const DATABASE_URL = process.env.DATABASE_URL;
const BACKUP_DIR = path.join(__dirname, '..', 'backups');

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL not found in environment variables');
  process.exit(1);
}

// Create backups directory if it doesn't exist
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
  console.log('📁 Created backups directory');
}

// Generate backup filename with timestamp
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T').join('-').split('.')[0];
const backupFile = path.join(BACKUP_DIR, `backup-${timestamp}.sql`);

console.log('🔄 Starting database backup...');
console.log(`📝 Backup file: ${backupFile}`);

// Use pg_dump to create backup
const command = `pg_dump "${DATABASE_URL}" > "${backupFile}"`;

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Backup failed:', error.message);
    
    // Check if pg_dump is installed
    exec('pg_dump --version', (versionError) => {
      if (versionError) {
        console.error('\n⚠️  pg_dump is not installed or not in PATH');
        console.error('Install PostgreSQL client tools:');
        console.error('  - Windows: https://www.postgresql.org/download/windows/');
        console.error('  - Mac: brew install postgresql');
        console.error('  - Linux: sudo apt-get install postgresql-client');
      }
    });
    
    process.exit(1);
  }

  if (stderr) {
    console.warn('⚠️  Warnings:', stderr);
  }

  // Check if backup file was created and has content
  if (fs.existsSync(backupFile)) {
    const stats = fs.statSync(backupFile);
    const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
    
    console.log('✅ Backup completed successfully!');
    console.log(`📊 Backup size: ${fileSizeInMB} MB`);
    console.log(`📁 Location: ${backupFile}`);
    
    // Clean up old backups (keep last 7 days)
    cleanOldBackups();
  } else {
    console.error('❌ Backup file was not created');
    process.exit(1);
  }
});

function cleanOldBackups() {
  const files = fs.readdirSync(BACKUP_DIR);
  const backupFiles = files.filter(f => f.startsWith('backup-') && f.endsWith('.sql'));
  
  if (backupFiles.length > 7) {
    // Sort by date (oldest first)
    backupFiles.sort();
    
    // Delete oldest backups
    const toDelete = backupFiles.slice(0, backupFiles.length - 7);
    toDelete.forEach(file => {
      const filePath = path.join(BACKUP_DIR, file);
      fs.unlinkSync(filePath);
      console.log(`🗑️  Deleted old backup: ${file}`);
    });
  }
}
