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
                { model: Categories, as: 'product_category', attributes: ['id', 'catrgory_name', 'description', 'mrp', 'price', 'thumbnail'] }
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

// update usser data with image
exports.edit = async (req, res) => {
    try {
        const id = req.params.id;
        var query = {
            where: { id: id },
            include: { model: Categories, as: 'product_category' }
        }
        var isExist = await Products.findOne(query)
        if (!isExist) {
            return res.status(404).json({ success: false, message: 'Old file not found!' });
        }
        console.log(isExist.product_category[0].thumbnail);

        const oldFileName = isExist.product_category[0].thumbnail; // Get the old file name from URL params
        const oldFilePath = path.join('D:', 'Mayur', 'Codding', 'siridix interview task udhana', 'uploads', 'images', 'product', oldFileName);

        // Check if the old file exists
        if (fs.existsSync(oldFilePath)) {
            // Delete the old file
            fs.unlink(oldFilePath, (err) => {
                if (err) {
                    return res.status(500).json({ success: false, message: 'Error deleting old file', error: err });
                }

                // Check if the new file was uploaded
                if (req.file) {
                    var newFileName = req.file.filename; // Get the new file name
                    const newFilePath = req.file.path; // Get the new file path

                } else {
                    res.status(400).json({ success: false, message: 'No new file uploaded!' });
                }
            });
        } else {
            res.status(404).json({ success: false, message: 'Old file not found!' });
        }
        if (req.file) {
            var newFileName = req.file.filename; // Get the new file name
        }
        const t = await db.sequelize.transaction();
        try {
            var obj = {
                product_name: req.body.product_name,
            }
            var data = await Products.update(obj, { where: { id: id } }, { transaction: t })
            var obj2 = {
                catrgory_name: req.body.catrgory_name,
                thumbnail: newFileName ? newFileName : null,
                description: req.body.description,
                mrp: req.body.mrp,
                price: req.body.price
            }
            const data2 = await Categories.update(obj2, { where: { product_id: id } }, { transaction: t })
            await t.commit()
            return res.status(200).json({ success: true, message: 'Updated successfully!' })

        } catch (error) {
            console.log(error);
            await t.rollback()
        }

    } catch (error) {
        console.log(error);
        res.status(200).json({ success: false, message: error.message })
    }
}