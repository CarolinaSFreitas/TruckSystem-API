import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
  'trab3-carol-api', 'root', 'senacrs', {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306
});