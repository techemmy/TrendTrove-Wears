import { dbConfig } from "../config";
import { Sequelize } from "sequelize";
import { User, Role } from "../models";

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
      freezeTableName: true, // prevents Sequelize from auto-pluralization of model names
    },
  }
);

const db = { sequelize, users: User(sequelize), roles: Role(sequelize) };

export default db;