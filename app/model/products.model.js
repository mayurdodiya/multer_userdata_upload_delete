module.exports = (sequelize, Sequelize) => {

    const Products = sequelize.define('products',
        {
            product_name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            slug: {
                type: Sequelize.STRING,
            },
            createdAt: {
                type: Sequelize.DATE,
                default: 'CURRENT_TIMESTAMP'
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
    return Products
}