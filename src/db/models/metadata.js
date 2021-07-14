'use strict';
const uuidv4 = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {
  const Metadata = sequelize.define('Metadata', {
    version: DataTypes.STRING,
    defaultMsgPrefix: DataTypes.STRING,
    defaultMsgSuffix: DataTypes.STRING,
    secret: DataTypes.STRING
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
