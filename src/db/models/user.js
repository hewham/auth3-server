'use strict';
const uuidv4 = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      unique: true
    },
    address: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true
    }
  }, {
    freezeTableName: true,
    timestamps: true,
    paranoid: true,
    tableName: 'user'
  });
  User.associate = (models) => {
    // associations can be defined here
  };
  User.beforeCreate((user, _) => {
    user.id = uuidv4();
  });
  return User;
};
