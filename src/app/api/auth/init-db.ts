import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function initAuthTables() {
  try {
    // Create users table
    await query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP,
        is_active BOOLEAN DEFAULT true
      )
    `);

    // Create sessions table
    await query(`
      CREATE TABLE IF NOT EXISTS user_sessions (
        id VARCHAR(255) PRIMARY KEY,
        user_id INTEGER NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES admin_users(id) ON DELETE CASCADE
      )
    `);

    // Check if default admin exists
    const adminExists = await query(
      'SELECT id FROM admin_users WHERE email = $1',
      ['admin@restaurant-alas.de']
    );

    if (adminExists.rows.length === 0) {
      // Create default admin user
      const defaultPassword = 'Admin2024!';
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);

      await query(
        `INSERT INTO admin_users (email, password_hash, name, role)
         VALUES ($1, $2, $3, $4)`,
        ['admin@restaurant-alas.de', hashedPassword, 'Administrator', 'super_admin']
      );

      console.log('Default admin created:');
      console.log('Email: admin@restaurant-alas.de');
      console.log('Password: Admin2024!');
      console.log('⚠️ PLEASE CHANGE THIS PASSWORD IMMEDIATELY!');
    }
  } catch (error) {
    console.error('Error initializing auth tables:', error);
  }
}

// Initialize tables on module load
initAuthTables().catch(console.error);
