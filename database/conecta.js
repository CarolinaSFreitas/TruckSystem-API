import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
  'trucksystem_carol', 'root', 'theo', {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306
});