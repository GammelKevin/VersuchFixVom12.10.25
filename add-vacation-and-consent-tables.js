const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Read .env.local
let DATABASE_URL;
try {
  const envContent = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf-8');
  const match = envContent.match(/DATABASE_URL="(.+?)"/);
  if (match) {
    DATABASE_URL = match[1];
  }
} catch (error) {
  console.error('Error reading .env.local:', error.message);
  process.exit(1);
}

if (!DATABASE_URL) {
  console.error('DATABASE_URL not found in .env.local');
  process.exit(1);
}

async function addTables() {
  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('Connecting to Neon database...\n');

    // 1. Check/Create user_consents table
    console.log('Checking user_consents table...');
    const consentTableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = 'user_consents'
      );
    `);

    if (!consentTableCheck.rows[0].exists) {
      await pool.query(`
        CREATE TABLE user_consents (
          id SERIAL PRIMARY KEY,
          consent_id VARCHAR(255) UNIQUE NOT NULL,
          consent_given JSONB NOT NULL,
          consent_timestamp TIMESTAMP NOT NULL,
          banner_version VARCHAR(50) NOT NULL,
          user_agent TEXT,
          ip_hash VARCHAR(64),
          created_at TIMESTAMP DEFAULT NOW()
        );
      `);
      console.log('✅ user_consents table created');
    } else {
      console.log('ℹ️  user_consents table already exists');
    }

    // 2. Check vacation_settings table
    console.log('\nChecking vacation_settings table...');
    const vacationTableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = 'vacation_settings'
      );
    `);

    if (vacationTableCheck.rows[0].exists) {
      console.log('ℹ️  vacation_settings table already exists');
    } else {
      await pool.query(`
        CREATE TABLE vacation_settings (
          id SERIAL PRIMARY KEY,
          is_active BOOLEAN DEFAULT FALSE,
          start_date DATE,
          end_date DATE,
          message TEXT,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `);
      console.log('✅ vacation_settings table created');

      await pool.query(`
        INSERT INTO vacation_settings (is_active, message)
        VALUES (FALSE, 'Wir sind im Urlaub und bald wieder für Sie da!')
      `);
      console.log('✅ Default vacation settings inserted');
    }

    // 4. Remove vacation columns from opening_hours (if they exist)
    console.log('\nChecking opening_hours table for old vacation columns...');
    const checkColumns = await pool.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'opening_hours'
      AND column_name IN ('vacation_start', 'vacation_end', 'vacation_active')
    `);

    if (checkColumns.rows.length > 0) {
      console.log('Found old vacation columns, removing them...');
      await pool.query(`
        ALTER TABLE opening_hours
        DROP COLUMN IF EXISTS vacation_start,
        DROP COLUMN IF EXISTS vacation_end,
        DROP COLUMN IF EXISTS vacation_active
      `);
      console.log('✅ Old vacation columns removed from opening_hours');
    } else {
      console.log('ℹ️  No old vacation columns found');
    }

    console.log('\n✅ All database migrations completed successfully!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    throw error;
  } finally {
    await pool.end();
    console.log('\nDatabase connection closed.');
  }
}

addTables()
  .then(() => {
    console.log('\n🎉 Database setup complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Database setup failed:', error);
    process.exit(1);
  });
