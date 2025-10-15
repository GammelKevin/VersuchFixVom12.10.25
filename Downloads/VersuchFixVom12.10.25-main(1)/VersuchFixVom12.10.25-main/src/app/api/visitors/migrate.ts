import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

const DB_PATH = path.resolve(process.cwd(), '../restaurant.db');

export async function migrateVisitorTables() {
  const db = await open({
    filename: DB_PATH,
    driver: sqlite3.Database,
  });

  try {
    // Check if gallery_views column exists
    const tableInfo = await db.all("PRAGMA table_info(daily_stats)");
    const hasGalleryViews = tableInfo.some((col: { name: string }) => col.name === 'gallery_views');

    if (!hasGalleryViews) {
      console.log('Adding gallery_views column to daily_stats table...');
      await db.run('ALTER TABLE daily_stats ADD COLUMN gallery_views INTEGER DEFAULT 0');
      console.log('Migration completed successfully');
    }
  } catch (error) {
    console.error('Migration error:', error);
    // If table doesn't exist, create it
    await db.exec(`
      CREATE TABLE IF NOT EXISTS daily_stats (
        date DATE PRIMARY KEY,
        total_visits INTEGER DEFAULT 0,
        unique_visitors INTEGER DEFAULT 0,
        gallery_views INTEGER DEFAULT 0
      )
    `);
  }

  await db.close();
}

// Auto-run migration
migrateVisitorTables().catch(console.error);

