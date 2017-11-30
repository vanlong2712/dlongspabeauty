var express = require('express');
var router = express.Router();

const Category = require('../model/category');
const Product = require('../model/product');

var {
  successToaStr,
  errorToaStr,
  authenticateAdmin,
  priviledgeProduct
} = require('../vendor/admin_script');

router.get('/create-product', async (req, res, next) => {
  authenticateAdmin(req, res);
  priviledgeProduct(req, res);
  const categories = await Category.find({ parent: true })
    .populate('created_by')
    .populate({
      path: 'children',
      populate: { path: 'created_by' }
    })
    .exec();
  res.render('admin/product-create', {
    categories: categories,
    req: req,
    page: 'create-product'
  });
});

router.get('/create-product/:categoryId', (req, res, next) => {
  res.render('admin/product-create', {});
});

module.exports = router;
