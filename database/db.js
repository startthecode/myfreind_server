import "dotenv/config";
import { Sequelize } from "sequelize";

export let db_Credentials = {
  user: process.env.SQL_USER_NAME,
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_DATABASE_NAME,
  host: process.env.SQL_HOST,
};

export const sequelize = new Sequelize(
  process.env.SQL_DATABASE_NAME,
  process.env.SQL_USER_NAME,
  process.env.SQL_PASSWORD,
  {
    host: process.env.SQL_HOST,
    dialect: "mysql",
  }
);
