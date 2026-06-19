import mysql from 'mysql2/promise';

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'mortuary_db'
};

async function migrate() {
  const pool = mysql.createPool(dbConfig);
  try {
    await pool.query('DROP TRIGGER IF EXISTS trg_after_invoice_settled;');
    console.log('Trigger dropped successfully');
  } catch (e) {
    console.log('Drop trigger error:', e.message);
  }
  process.exit(0);
}

migrate();
