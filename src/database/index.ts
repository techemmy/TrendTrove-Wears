import { dbConfig } from "../config";
import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  dbConfig.DATABASE,
  dbConfig.USERNAME,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    dialect: dbConfig.DIALECT,
    pool: {
      min: dbConfig.pool.min,
      max: dbConfig.pool.max,
      idle: dbConfig.pool.idle,
      acquire: dbConfig.pool.acquire,
    },
    define: {
      freezeTableName: true // prevents Sequelize from auto-pluralization of model names
    }
  }
);

const dbConnection = { sequelize };

export default dbConnection;
