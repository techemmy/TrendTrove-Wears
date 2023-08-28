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
  }
);

const db = { sequelize, Sequelize };

export default db;
