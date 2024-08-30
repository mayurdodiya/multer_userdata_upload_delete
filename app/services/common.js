var slugify = require('slugify');
const multer = require('multer');
const path = require('path');
const fs = require('fs');


const imageStorage = multer.diskStorage({
    // Destination to store image     
    destination: 'uploads/images/product',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now()
            + path.extname(file.originalname))
        // file.fieldname is name of the field (image)
        // path.extname get the uploaded file extension
    }
});

module.exports = {
    generateSlug: (name) => {
        var r = Math.ceil(Math.random() * 100000);
        var slug = slugify(`${name}-${r}`)
        return slug
    },

    imageUpload: multer({
        storage: imageStorage,
        limits: {
            fileSize: 1000000 // 1000000 Bytes = 1 MB
        },
        fileFilter(req, file, cb, next) {
            if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
                // upload only png and jpg format
                return cb(new Error('Please upload a Image'))
            }
            cb(undefined, true)
        }
    })
}
