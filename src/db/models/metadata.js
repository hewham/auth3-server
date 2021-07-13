'use strict';
const uuidv4 = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {
  const Metadata = sequelize.define('Metadata', {
    isMetadataHere: DataTypes.STRING,
    adminVersion: DataTypes.STRING,
    expressVersion: DataTypes.STRING,
    webappVersion: DataTypes.STRING,
    mobileVersion: DataTypes.STRING
  }, {
    freezeTableName: true,
    timestamps: true,
    paranoid: true,
    tableName: 'metadata'
  });
  Metadata.associate = (models) => {
    // associations can be defined here
  };
  Metadata.beforeCreate((metadata, _) => {
    metadata.id = uuidv4();
  });
  return Metadata;
};
