const { Sequelize } = require('sequelize');
const Config = require('../config/config')



const sequelize = new Sequelize(Config.database, Config.username, Config.password, {
    host: Config.host,
    dialect: 'mysql'
});


try {
    sequelize.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

// model intialization
const db = {}
db.products = require('./products.model')(sequelize, Sequelize)
db.categories = require('./categories.model')(sequelize, Sequelize)


// join relation
db.products.hasMany(db.categories, { foreignKey: 'product_id', as: 'product_category' })

db.sequelize = sequelize;
db.Sequelize = Sequelize;
module.exports = db;