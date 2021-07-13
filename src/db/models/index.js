'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const db = {};


const figures = require("figures");
const colors = require("colors");
const log = require('../../log');

const connectionInfo = {
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT),
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  environment: process.env.ENVIRONMENT
};

const sequelize = new Sequelize(connectionInfo.database, connectionInfo.user, connectionInfo.password, {
  host: connectionInfo.host,
  dialect: 'mysql',
  pool: {
    max: connectionInfo.connectionLimit,
    min: 0
  },
  logging: false
});

log.info(colors.cyan(figures.tick, " Connected to ") + colors.blue(connectionInfo.environment + " " + connectionInfo.database));

fs
  .readdirSync(__dirname)
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.Sequelize = Sequelize;

module.exports = db;
