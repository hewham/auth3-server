'use strict';
const uuidv4 = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {
  const Nonce = sequelize.define('Nonce', {
    userID: {
      type: DataTypes.UUIDV4,
      allowNull: true
    },
    address: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true
    },
    nonce: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    prefix: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    suffix: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    expiresAt: DataTypes.DATE
    }, {
    freezeTableName: true,
    timestamps: true,
    paranoid: true,
    tableName: 'nonce'
  });
  Nonce.associate = (models) => {
    Nonce.belongsTo(models.User, { as: "user", foreignKey: 'userID' });
  };
  Nonce.beforeCreate((nonce, _) => {
    nonce.id = uuidv4();
  });
  return Nonce;
};
