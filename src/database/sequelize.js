const { Sequelize } = require("sequelize");

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL não definida no .env");
}

const sequelize = new Sequelize(
  process.env.DATABASE_URL,
  {
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl:{
        require: true,
        rejectUnauthorized: false,
      }
    }
  }
);

module.exports = sequelize;