// PostgreSQL tables are already created via migration script
// This file is kept for compatibility but does nothing since we're using PostgreSQL

export async function initVisitorTable() {
  // Tables already exist in PostgreSQL - no action needed
  console.log('Visitor tables already initialized in PostgreSQL');
}
