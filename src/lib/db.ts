import { Pool } from 'pg';

// Database connection URL from environment variable
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_wymoGYT8Zs9t@ep-twilight-band-ag8cg6zq-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require';

// Create a connection pool
const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle
  connectionTimeoutMillis: 2000, // How long to wait for a connection
});

// Helper function to get a client from the pool
export async function getDb() {
  const client = await pool.connect();
  return client;
}

// Helper function to execute a query
export async function query(text: string, params?: unknown[]) {
  try {
    const res = await pool.query(text, params);
    return res;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Helper function for transactions
export async function withTransaction<T>(
  callback: (client: unknown) => Promise<T>
): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export default pool;