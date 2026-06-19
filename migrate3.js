import mysql from 'mysql2/promise';

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'mortuary_db'
};

async function migrate() {
  const pool = mysql.createPool(dbConfig);

  // 1. Add serviceId to billing_services
  try {
    const [cols] = await pool.execute("SHOW COLUMNS FROM billing_services LIKE 'serviceId'");
    if (cols.length === 0) {
      await pool.execute("ALTER TABLE billing_services ADD COLUMN serviceId VARCHAR(36) DEFAULT NULL AFTER billingId");
      console.log('✔ Added serviceId column to billing_services');
    } else {
      console.log('✔ serviceId column already exists in billing_services');
    }
  } catch (e) {
    console.log('✘ billing_services migration error:', e.message);
  }

  // 2. Create service_master if not exists
  try {
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS service_master (
        id VARCHAR(36) PRIMARY KEY,
        service_name VARCHAR(255) NOT NULL,
        tariff DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✔ service_master table ready');
  } catch (e) {
    console.log('✘ service_master migration error:', e.message);
  }

  await pool.end();
  console.log('Migration complete.');
  process.exit(0);
}

migrate();
