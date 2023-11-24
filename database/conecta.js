import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
  'trucksystem-carol', 'root', 'senacrs', {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306
});