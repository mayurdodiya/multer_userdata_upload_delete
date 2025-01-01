var slugify = require("slugify");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const imageStorage = multer.diskStorage({
  // Destination to store image
  destination: "uploads/images/product",
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
    // file.fieldname is name of the field (image)
    // path.extname get the uploaded file extension
  },
});

module.exports = {
  generateSlug: (name) => {
    var r = Math.ceil(Math.random() * 100000);
    var slug = slugify(`${name}-${r}`);
    return slug;
  },

  imageUpload: multer({
    storage: imageStorage,
    limits: {
      fileSize: 2000000, // 1000000 Bytes = 2 MB
    },
    fileFilter(req, file, cb, next) {
      if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
        // upload only png and jpg format
        return cb(new Error("Please upload a Image"));
      }
      cb(undefined, true);
    },
  }),

  create: async (model, data, additional = undefined) => {
    return model.create(data, additional || undefined);
  },
  update: async (model, query, data, additional = undefined) => {
    return model.update(data, query, additional || undefined);
  },
  delete: async (model, query, additional = undefined) => {
    return model.destroy(query, additional || undefined);
  },
  get: async (model, query, additional = undefined) => {
    return model.findOne(query, additional || undefined);
  },
  checkFlag: async (model, query) => {
    return model.count(query);
  },
  getAll: async (model, query) => {
    return model.findAll({ ...query });
  },
  getById: async (model, id) => {
    return model.findByPk(id);
  },
  getAndCountAll: async (model, query, limit, offset) => {
    return model.findAndCountAll({ ...query, limit, offset });
  },
  generateHashPassword: async (myPassword, salt) => {
    return await bcrypt.hashSync(myPassword, salt);
  },
  passwordCompare: async (myPassword, hash, additional = undefined) => {
    return await bcrypt.compareSync(myPassword, hash, additional || undefined);
  },
  generateToken: (user_id, role_id) => {
    let token = jwt.sign(
      { user_id: user_id, role_id: role_id },
      config.SECRET_KEY,
      { expiresIn: config.EXPIRES_IN }
    );
    return token;
  },
  getPagination: (page, size) => {
    const limit = size ? +size : 10;
    const offset = page ? page * limit : 0;
    return { limit, offset };
  },
  getPagingData: (alldata, page, limit) => {
    const { count: totalItems, rows: data } = alldata;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);
    return { totalItems, data, totalPages, currentPage };
  },
};
