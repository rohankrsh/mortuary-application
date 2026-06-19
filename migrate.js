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
    await pool.execute(`
      ALTER TABLE body_releases
      ADD COLUMN bodyTakenBy VARCHAR(150) NOT NULL DEFAULT '' AFTER id,
      ADD COLUMN relationship VARCHAR(100) NULL,
      ADD COLUMN address TEXT NULL,
      ADD COLUMN contactNumber VARCHAR(20) NOT NULL DEFAULT '',
      ADD COLUMN policeStationName VARCHAR(150) NULL COMMENT 'MLC only',
      ADD COLUMN siName VARCHAR(150) NULL COMMENT 'MLC only',
      ADD COLUMN nocCertificateUrl TEXT NULL,
      ADD COLUMN legalDocumentsUrl TEXT NULL,
      ADD COLUMN caseType ENUM('NON_MLC', 'MLC') NOT NULL DEFAULT 'NON_MLC',
      ADD COLUMN releasedAt DATETIME NULL;
    `);
    console.log('Columns added successfully');
  } catch (e) {
    console.log('Add columns error:', e.message);
  }

  try {
    await pool.execute('DROP TRIGGER IF EXISTS trg_after_invoice_settled;');
    console.log('Trigger dropped successfully');
  } catch (e) {
    console.log('Drop trigger error:', e.message);
  }
  process.exit(0);
}

migrate();
