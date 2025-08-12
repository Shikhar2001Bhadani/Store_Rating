const { Sequelize } = require("sequelize");
require("dotenv").config();

let sequelize;

// This checks for Render's database URL first
if (process.env.DB_URL) {
  sequelize = new Sequelize(process.env.DB_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // Required for Render connections
      }
    }
  });
} else {
  // This is your local setup from your .env file
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: "postgres",
      logging: false
    }
  );
}

module.exports = sequelize;