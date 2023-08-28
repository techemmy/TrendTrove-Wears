import { type Dialect } from "sequelize";

export default {
  DATABASE: process.env.DATABASE_NAME ?? "",
  USERNAME: process.env.DATABASE_USERNAME ?? "",
  PASSWORD: process.env.DATABASE_PASSWORD ?? "",
  HOST: process.env.DATABASE_HOST ?? "",
  DIALECT: process.env.DATABASE_DIALECT as Dialect,
  pool: {
    min: parseInt(process.env.DATABASE_POOL_MIN ?? "0"),
    max: parseInt(process.env.DATABASE_POOL_MAX ?? "5"),
    idle: parseInt(process.env.DATABASE_POOL_IDLE ?? "30000"),
    acquire: parseInt(process.env.DATABASE_POOL_ACQUIRE ?? "10000"),
  },
};
