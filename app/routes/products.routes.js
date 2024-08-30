const controller = require('./../controller/products/products.contorller')
const commonServices = require('./../services/common')
const multer = require('multer');
const path = require('path');
const fs = require('fs');

module.exports = (app) => {
    app.post('/upload-product', commonServices.imageUpload.single('image'), controller.add)
    app.get('/api/products', controller.getAll)
    app.delete('/delete/:id', controller.removeData)
    app.put('/update-file/:id', commonServices.imageUpload.single('image'), controller.edit)
}