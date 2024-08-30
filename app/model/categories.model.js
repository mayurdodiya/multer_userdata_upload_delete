module.exports = (sequelize, Sequelize) => {

    const Categories = sequelize.define('categories',
        {
            product_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            catrgory_name: {
                type: Sequelize.STRING,
            },
            thumbnail: {
                type: Sequelize.STRING,
            },
            description: {
                type: Sequelize.STRING,
            },
            mrp: {
                type: Sequelize.INTEGER,
            },
            price: {
                type: Sequelize.INTEGER,
            },
            createdAt: {
                type: Sequelize.DATE,
            },
            updatedAt: {
                type: Sequelize.DATE,
                // defaultValue: 'CURRENT_TIMESTAMP'
            },
            deletedAt: {
                type: Sequelize.DATE,
                // defaultValue: 'CURRENT_TIMESTAMP'
            },
        }, { paranoid: true }
    );
    return Categories
}