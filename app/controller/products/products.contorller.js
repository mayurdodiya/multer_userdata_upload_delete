const db = require('./../../model')
const commonServices = require('./../../services/common')
const multer = require('multer');
const path = require('path');
const fs = require('fs');


const Products = db.products
const Categories = db.categories



// add image with user data in uploads folder
exports.add = async (req, res) => {
    if (!req.file) {
        return res.status(200).json({ success: false, message: 'No file uploaded!' })
    }
    console.log(req.files);
    try {
        var slug = await commonServices.generateSlug(req.body.product_name)
        const t = await db.sequelize.transaction();
        try {
            var obj = {
                product_name: req.body.product_name,
                slug: slug,
                description: req.body.description
            }
            var data = await Products.create(obj, { transaction: t })
            var obj2 = {
                product_id: data.id,
                catrgory_name: req.body.catrgory_name,
                thumbnail: req.file.filename,
                description: req.body.description,
                mrp: req.body.mrp,
                price: req.body.price
            }
            var data2 = await Categories.create(obj2, { transaction: t })

            await t.commit();
            res.status(200).json({ success: true, message: 'successfully loaded!' })

        } catch (error) {
            console.log(error);
            await t.rollback();
        }

    } catch (error) {
        console.log(error);
        res.status(200).json({ success: false, message: error.message })
    }
}

// get all
exports.getAll = async (req, res) => {
    try {
        const query = {
            where: [],
            attributes: ['id', 'product_name', 'slug'],
            include: [
                { model: Categories, as: 'product_category', attributes: ['id', 'catrgory_name'] }
            ]
        }
        const data = await Products.findAll(query)
        return res.status(200).json({ success: true, message: 'successfully loaded!', data: data })

    } catch (error) {
        console.log(error);
        res.status(200).json({ success: false, message: error.message })
    }
}

// delete image file and user data 
exports.removeData = async (req, res) => {
    try {
        const id = req.params.id;
        const fileNames = await Categories.findOne({ where: { product_id: id } })
        console.log(fileNames);
        
        if (fileNames) {
            const fileName = fileNames.thumbnail;
            const filePath = path.join('D:', 'Mayur', 'Codding', 'siridix interview task udhana', 'uploads', 'images', 'product', fileName);

            fs.unlinkSync(filePath);
        }

        const t = await db.sequelize.transaction();
        try {
            const query = {
                where: { id: id }
            }
            const data = await Products.destroy(query, { transaction: t })
            const data2 = await Categories.destroy({ where: { product_id: id } }, { transaction: t })
            await t.commit()
            return res.status(200).json({ success: true, message: 'Deleted successfully!' })

        } catch (error) {
            console.log(error);
            await t.rollback()
        }

    } catch (error) {
        console.log(error);
        res.status(200).json({ success: false, message: error.message })
    }
}