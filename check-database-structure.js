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

async function checkDatabase() {
  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('🔍 Analyzing Database Structure...\n');
    console.log('=' .repeat(80));

    // Get all tables
    const tablesResult = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    console.log(`\n📊 Found ${tablesResult.rows.length} tables:\n`);

    for (const table of tablesResult.rows) {
      const tableName = table.table_name;
      console.log(`\n🔹 TABLE: ${tableName}`);
      console.log('-'.repeat(80));

      // Get columns for this table
      const columnsResult = await pool.query(`
        SELECT
          column_name,
          data_type,
          character_maximum_length,
          is_nullable,
          column_default
        FROM information_schema.columns
        WHERE table_name = $1
        ORDER BY ordinal_position;
      `, [tableName]);

      columnsResult.rows.forEach(col => {
        const type = col.character_maximum_length
          ? `${col.data_type}(${col.character_maximum_length})`
          : col.data_type;
        const nullable = col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL';
        const defaultVal = col.column_default ? ` DEFAULT ${col.column_default}` : '';
        console.log(`  • ${col.column_name.padEnd(30)} ${type.padEnd(20)} ${nullable}${defaultVal}`);
      });

      // Get row count
      try {
        const countResult = await pool.query(`SELECT COUNT(*) as count FROM ${tableName}`);
        console.log(`\n  📈 Rows: ${countResult.rows[0].count}`);
      } catch (e) {
        console.log(`\n  ⚠️  Could not count rows: ${e.message}`);
      }
    }

    // Check for vacation-related tables
    console.log('\n\n');
    console.log('=' .repeat(80));
    console.log('🏝️  VACATION-RELATED ANALYSIS');
    console.log('=' .repeat(80));

    const vacationTables = tablesResult.rows.filter(t =>
      t.table_name.includes('vacation') || t.table_name.includes('urlaub')
    );

    if (vacationTables.length > 0) {
      console.log('\n✅ Found vacation-related tables:');
      vacationTables.forEach(t => console.log(`   - ${t.table_name}`));
    } else {
      console.log('\n❌ No vacation-related tables found!');
    }

    // Check opening_hours for vacation columns
    console.log('\n🕐 Checking opening_hours table for vacation columns...');
    const openingHoursCheck = await pool.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'opening_hours'
      AND column_name LIKE '%vacation%'
    `);

    if (openingHoursCheck.rows.length > 0) {
      console.log('⚠️  Found vacation columns in opening_hours:');
      openingHoursCheck.rows.forEach(col => console.log(`   - ${col.column_name}`));
    } else {
      console.log('✅ No vacation columns in opening_hours (good!)');
    }

    // Check for consent-related tables
    console.log('\n\n');
    console.log('=' .repeat(80));
    console.log('🍪 CONSENT/COOKIE-RELATED ANALYSIS');
    console.log('=' .repeat(80));

    const consentTables = tablesResult.rows.filter(t =>
      t.table_name.includes('consent') || t.table_name.includes('cookie')
    );

    if (consentTables.length > 0) {
      console.log('\n✅ Found consent-related tables:');
      consentTables.forEach(t => console.log(`   - ${t.table_name}`));
    } else {
      console.log('\n❌ No consent-related tables found!');
    }

    console.log('\n\n');
    console.log('=' .repeat(80));
    console.log('✅ Database Analysis Complete!');
    console.log('=' .repeat(80));

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    throw error;
  } finally {
    await pool.end();
  }
}

checkDatabase()
  .then(() => {
    console.log('\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Analysis failed:', error);
    process.exit(1);
  });
