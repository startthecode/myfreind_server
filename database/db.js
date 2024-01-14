import { Sequelize } from "sequelize";

export let db_Credentials = {
  user: "root",
  password: "ashugola",
  database: "myfriend",
  host: "localhost",
};


export const sequelize = new Sequelize('myfriend', 'root', 'ashugola', {
  host: 'localhost',
  dialect: 'mysql'
});



