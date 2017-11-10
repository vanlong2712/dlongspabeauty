var express = require('express');
var router = express.Router();

const Category = require('../model/category');

var {
  successToaStr,
  errorToaStr,
  authenticateAdmin,
  priviledgeProduct
} = require('../vendor/admin_script');

router.get('/category-list', (req, res, next) => {
  authenticateAdmin(req, res);
  priviledgeProduct(req, res);

  Category.find({ parent: true })
    .populate('created_by')
    .populate({
      path: 'children',
      populate: { path: 'created_by' }
    })
    .exec()
    .then(categories => {
      res.render('admin/category-list', {
        req: req,
        page: 'category-list',
        categories: categories
      });
    });
});

router
  .route('/category-create')
  .get((req, res, next) => {
    authenticateAdmin(req, res);
    priviledgeProduct(req, res);

    res.render('admin/category-create', {
      req: req,
      page: 'category-create'
    });
  })
  .post((req, res, next) => {
    authenticateAdmin(req, res);
    priviledgeProduct(req, res);

    var obj = {
      name_vn: req.body.txtCategoryNameVN,
      name_en: req.body.txtCategoryNameEN
    };

    Category.findOne({ name_vn: obj.name_vn }).then(data => {
      if (data) {
        req.toastr.warning(`Đã tồn tại tên danh mục ${obj.name_vn}`);
        res.render('admin/category-create', {
          req: req,
          category: obj,
          page: 'category-create'
        });
      } else {
        Category.findOne({ name_en: obj.name_en }).then(data => {
          if (data) {
            req.toastr.warning(`Đã tồn tại tên danh mục ${obj.name_en}`);
            res.render('admin/category-create', {
              req: req,
              category: obj,
              page: 'category-create'
            });
          } else {
            const category = new Category(obj);
            category.parent = true;
            category.created_by = req.user._id;

            category.save().then(() => {
              req.toastr.success(
                `Tạo Thành Công Danh Mục Sản Phẩm Cha ${req.body
                  .txtCategoryNameVN}`
              );
              res.redirect('./category-list');
            });
          }
        });
      }
    });
  });

router
  .route('/category-edit/:id')
  .get(async (req, res, next) => {
    authenticateAdmin(req, res);
    priviledgeProduct(req, res);

    const category = await Category.findById(req.params.id);
    res.render('admin/category-edit', {
      req: req,
      category: category,
      page: 'category-edit'
    });
  })
  .post((req, res, next) => {
    authenticateAdmin(req, res);
    priviledgeProduct(req, res);

    var obj = {
      _id: req.body.categoryId,
      name_vn: req.body.txtCategoryNameVN,
      name_en: req.body.txtCategoryNameEN
    };

    Category.findOne({ name_vn: obj.name_vn }).then(data => {
      if (data) {
        req.toastr.warning(`Đã tồn tại tên danh mục ${obj.name_vn}`);
        res.render('admin/category-edit', {
          req: req,
          category: obj,
          page: 'category-edit'
        });
      } else {
        Category.findOne({ name_en: obj.name_en }).then(data => {
          if (data) {
            req.toastr.warning(`Đã tồn tại tên danh mục ${obj.name_en}`);
            res.render('admin/category-edit', {
              req: req,
              category: obj,
              page: 'category-edit'
            });
          } else {
            Category.findById(obj._id).then(data => {
              if (data) {
                data.name_vn = obj.name_vn;
                data.name_en = obj.name_en;
                data.save().then(() => {
                  console.log(data._id);
                  req.toastr.success(
                    `Thay Đổi Thành Công Danh Mục Sản Phẩm ${data.name_vn}`
                  );
                  res.redirect('/187_admin/category-list');
                });
              }
            });
          }
        });
      }
    });
  });

router
  .route('/category-children-create')
  .get(async (req, res, next) => {
    authenticateAdmin(req, res);
    priviledgeProduct(req, res);

    const categories = await Category.find({ parent: true }).sort({
      created_at: -1
    });

    res.render('admin/category-children-create', {
      req: req,
      page: 'category-children-create',
      categories: categories
    });
  })
  .post(async (req, res, next) => {
    authenticateAdmin(req, res);
    priviledgeProduct(req, res);

    var obj = {
      name_vn: req.body.txtCategoryNameVN,
      name_en: req.body.txtCategoryNameEN
    };

    Category.findById(req.body.parentId, async (err, dataParent) => {
      if (err) {
        res.send(err);
      }
      if (dataParent) {
        Category.findOne({ name_vn: obj.name_vn }).then(async data => {
          if (data) {
            const categories = await Category.find({ parent: true }).sort({
              created_at: -1
            });
            req.toastr.warning(`Đã tồn tại tên danh mục ${obj.name_vn}`);
            res.render('admin/category-children-create', {
              req: req,
              category: obj,
              page: 'category-children-create',
              categories: categories
            });
          } else {
            Category.findOne({ name_en: obj.name_en }).then(async data => {
              if (data) {
                const categories = await Category.find({ parent: true }).sort({
                  created_at: -1
                });
                req.toastr.warning(`Đã tồn tại tên danh mục ${obj.name_en}`);
                res.render('admin/category-children-create', {
                  req: req,
                  category: obj,
                  page: 'category-children-create',
                  categories: categories
                });
              } else {
                const category = new Category(obj);
                category.parent = false;
                category.created_by = req.user._id;

                category.save().then(() => {
                  console.log('dataParent', dataParent);
                  dataParent.children.push(category._id);
                  dataParent.save();
                  req.toastr.success(
                    `Tạo Thành Công Danh Mục Sản Phẩm Con ${req.body
                      .txtCategoryNameVN}`
                  );
                  res.redirect('./category-list');
                });
              }
            });
          }
        });
      }
    });
  });

router
  .route('/category-children-edit/:id')
  .get(async (req, res, next) => {
    authenticateAdmin(req, res);
    priviledgeProduct(req, res);

    const category = await Category.findById(req.params.id);
    const categories = await Category.find({ parent: true }).sort({
      created_at: -1
    });
    res.render('admin/category-children-edit', {
      req: req,
      categories: categories,
      category: category,
      page: 'category-children-edit'
    });
  })
  .post((req, res, next) => {
    authenticateAdmin(req, res);
    priviledgeProduct(req, res);

    var obj = {
      _id: req.body.categoryId,
      name_vn: req.body.txtCategoryNameVN,
      name_en: req.body.txtCategoryNameEN
    };

    Category.findOne({ name_vn: obj.name_vn }).then(async data => {
      if (data && data._id != obj._id) {
        const categories = await Category.find({ parent: true }).sort({
          created_at: -1
        });
        req.toastr.warning(`Đã tồn tại tên danh mục ${obj.name_vn}`);
        res.render('admin/category-children-edit', {
          req: req,
          categories: categories,
          category: obj,
          page: 'category-children-edit'
        });
      } else {
        Category.findOne({ name_en: obj.name_en }).then(async data => {
          if (data && data._id != obj._id) {
            const categories = await Category.find({ parent: true }).sort({
              created_at: -1
            });
            req.toastr.warning(`Đã tồn tại tên danh mục ${obj.name_en}`);
            res.render('admin/category-children-edit', {
              req: req,
              categories: categories,
              category: obj,
              page: 'category-children-edit'
            });
          } else {
            Category.findById(obj._id).then(data => {
              if (data) {
                data.name_vn = obj.name_vn;
                data.name_en = obj.name_en;
                data.save().then(() => {
                  Category.findById(req.body.parentId).then(parent => {
                    if (parent) {
                      console.log(data._id);
                      if (parent.children.indexOf(data._id) == -1) {
                        Category.findOne({
                          children: data._id
                        }).then(oldParent => {
                          if (oldParent) {
                            oldParent.children.splice(
                              oldParent.children.indexOf(data._id),
                              1
                            );
                            oldParent.save().then(() => {
                              parent.children.push(data._id);
                              parent.save();
                            });
                          }
                        });
                      }
                    }
                  });

                  req.toastr.success(
                    `Thay Đổi Thành Công Danh Mục Sản Phẩm ${data.name_vn}`
                  );
                  res.redirect('/187_admin/category-list');
                });
              }
            });
          }
        });
      }
    });
  });

module.exports = router;
