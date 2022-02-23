
const sequelize = require('sequelize');

const connection = new sequelize('blogpress', 'root', 'passWord2022', {
    host: 'localhost',
    dialect: 'mysql',
    timezone: '-03:00'
});

module.exports = connection;