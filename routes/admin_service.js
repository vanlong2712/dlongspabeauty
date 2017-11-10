var express = require('express');
var router = express.Router();
var multer = require('multer');
var fs = require('fs');
const bcrypt = require('bcryptjs');

const Service = require('../model/service');

var {
  image_service_handle,
  delete_img,
  successToaStr,
  errorToaStr,
  authenticateAdmin,
  priviledgeService,
  priviledgeAdmin
} = require('../vendor/admin_script');

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './public/uploads');
  },
  filename: function(req, file, cb) {
    if (!req.session.non_images_service) {
      req.session.non_images_service = ['fImage1', 'fImage2'];
    }
    if (!req.session.images) {
      req.session.images = [];
    }
    req.session.non_images_service.splice(
      req.session.non_images_service.indexOf(file.fieldname),
      1
    );
    var filename = Date.now() + '-' + file.originalname;
    cb(null, filename);
    req.session.images.push(filename);
  }
});

var upload = multer({ storage: storage });

/* START SERVICES */
router.get('/service-list', (req, res, next) => {
  authenticateAdmin(req, res);
  priviledgeService(req, res);
  Service.find(function(err, data) {
    if (err) throw err;
    else {
      res.render('admin/service-list', {
        services: data,
        req: req,
        page: 'service-list'
      });
    }
  });
});

router
  .route('/service-create')
  .get((req, res, next) => {
    authenticateAdmin(req, res);
    priviledgeService(req, res);
    res.render('admin/service-create', {
      title: 'Beauty Spa',
      req: req,
      page: 'service-create'
    });
  })
  .post(upload.any(), (req, res, next) => {
    authenticateAdmin(req, res);
    priviledgeService(req, res);

    var isEnabled = false;
    if (req.body.txtEnable) {
      isEnabled = true;
    }
    if (
      req.session.non_images_service.indexOf('fImage1') !== -1 &&
      req.session.non_images_service.indexOf('fImage2')
    ) {
      // có hình fImage1 và ko có hình fImage2
      var text = '';
      images.unshift(text);
    } else if (
      req.session.non_images_service.indexOf('fImage1') &&
      req.session.non_images_service.indexOf('fImage2') !== -1
    ) {
      // ko có fImage1 và có fImage2
      var text = '';
      images.push(text);
    }
    if (req.session.images.length === 0) {
      images = ['', ''];
    }
    var obj = {
      name_url: req.body.txtNameURL,
      title_SEO: req.body.txtTitleSEO,
      isEnabled: isEnabled,
      icon: req.body.txtIcon,
      content_vn: {
        name: req.body.txtNameVN,
        title: req.body.txtTitleVN,
        time: req.body.txtTimeVN,
        price: req.body.txtPriceVN,
        duration: req.body.txtDurationVN,
        description: req.body.txtDescriptionVN,
        content: req.body.txtContentVN,
        keywords: req.body.txtKeyWordVN
      },
      content_en: {
        name: req.body.txtNameEN,
        title: req.body.txtTitleEN,
        time: req.body.txtTimeEN,
        price: req.body.txtPriceEN,
        duration: req.body.txtDurationEN,
        description: req.body.txtDescriptionEN,
        content: req.body.txtContentEN,
        keywords: req.body.txtKeyWordEN
      },
      images: req.session.images,
      created_by: req.user._id
    };

    Service.find({ name_url: obj.name_url }).then(data => {
      if (data.length > 0) {
        if (obj.images.length > 0) {
          for (var i in obj.images) {
            delete_img(obj.images[i]);
          }
        }
        req.session.images = [];
        req.session.non_images_service = ['fImage1', 'fImage2'];
        req.toastr.warning(`Đã tồn tại ${obj.name_url}`);
        res.render('admin/service-create', {
          title: 'Beauty Spa',
          service: obj,
          req: req
        });
      } else {
        var service = new Service(obj);
        service.save().then(() => {
          Service.find(function(err, data) {
            if (err) throw err;
            req.session.images = [];
            req.session.non_images_service = ['fImage1', 'fImage2'];
            req.toastr.success(`Tạo Thành Công Dịch Vụ ${req.body.txtName}`);
            res.redirect('./service-list');
          });
        });
      }
    });
  });

router.get('/service-edit', (req, res, next) => {
  authenticateAdmin(req, res);
  priviledgeService(req, res);
  res.redirect('./service-list');
});

router.get('/service-edit/:id', (req, res, next) => {
  authenticateAdmin(req, res);
  priviledgeService(req, res);
  Service.findById(req.params.id, (err, data) => {
    if (err) {
      res.send(err);
    }
    if (data) {
      console.log(data);
      res.render('admin/service-edit', {
        service: data,
        req: req,
        page: 'service-edit'
      });
    } else {
      res.send('Không có sản phẩm này.');
    }
  });
});

router.post('/service-edit', upload.any(), (req, res, next) => {
  authenticateAdmin(req, res);
  priviledgeService(req, res);

  var obj = {
    name_url: req.body.txtNameURL,
    title_SEO: req.body.txtTitleSEO,
    icon: req.body.txtIcon,
    content_vn: {
      name: req.body.txtNameVN,
      title: req.body.txtTitleVN,
      time: req.body.txtTimeVN,
      price: req.body.txtPriceVN,
      duration: req.body.txtDurationVN,
      description: req.body.txtDescriptionVN,
      content: req.body.txtContentVN,
      keywords: req.body.txtKeyWordVN
    },
    content_en: {
      name: req.body.txtNameEN,
      title: req.body.txtTitleEN,
      time: req.body.txtTimeEN,
      price: req.body.txtPriceEN,
      duration: req.body.txtDurationEN,
      description: req.body.txtDescriptionEN,
      content: req.body.txtContentEN,
      keywords: req.body.txtKeyWordEN
    },
    images: req.session.images
  };

  Service.findOne({ name_url: obj.name_url }).then(data => {
    console.log('DATA', data);
    if (data && data._id != req.body.serviceId) {
      console.log('here');
      console.log(obj.images);
      console.log(req.session.images);
      if (typeof obj.images != 'undefined' && obj.images.length > 0) {
        console.log('there');
        for (var i in obj.images) {
          delete_img(obj.images[i]);
        }
      }
      req.session.images = [];
      req.session.non_images_service = ['fImage1', 'fImage2'];
      req.toastr.warning(`Đã tồn tại ${obj.name_url}`);
      res.render('admin/service-edit', {
        title: 'Beauty Spa',
        service: obj,
        req: req
      });
    } else {
      Service.findById(req.body.serviceId, (err, service) => {
        if (err) throw err;
        // console.log(service);
        service.content_vn.name = req.body.txtNameVN;
        service.content_vn.title = req.body.txtTitleVN;
        service.content_vn.time = req.body.txtTimeVN;
        service.content_vn.price = req.body.txtPriceVN;
        service.content_vn.duration = req.body.txtDurationVN;
        service.content_vn.description = req.body.txtDescriptionVN;
        service.content_vn.content = req.body.txtContentVN;
        service.content_vn.keywords = req.body.txtKeyWordVN;
        service.content_en.name = req.body.txtNameEN;
        service.content_en.title = req.body.txtTitleEN;
        service.content_en.time = req.body.txtTimeEN;
        service.content_en.price = req.body.txtPriceEN;
        service.content_en.duration = req.body.txtDurationEN;
        service.content_en.description = req.body.txtDescriptionEN;
        service.content_en.content = req.body.txtContentEN;
        service.content_en.keywords = req.body.txtKeyWordEN;
        service.icon = req.body.txtIcon;
        service.title_SEO = req.body.txtTitleSEO;

        if (!req.session.non_images_service) {
          req.session.non_images_service = ['fImage1', 'fImage2'];
        }
        if (
          req.session.non_images_service.indexOf('fImage1') === 0 &&
          req.session.non_images_service.indexOf('fImage2') === 1
        ) {
          // ko có hình fImage1 và ko có hình fImage2
          req.session.images = ['', ''];
        }
        if (
          req.session.non_images_service.indexOf('fImage2') === 0 &&
          req.session.non_images_service.indexOf('fImage1') == -1
        ) {
          // có hình fImage1 và ko có hình fImage2
          req.session.images = [req.session.images[0], ''];
        }
        if (
          req.session.non_images_service.indexOf('fImage1') === 0 &&
          req.session.non_images_service.indexOf('fImage2') == -1
        ) {
          // ko có fImage1 và có fImage2
          req.session.images = ['', req.session.images[0]];
        }

        // console.log('IMAGES: ',req.session.images);
        // console.log('SERVICE_IMG: ',service.images);
        req.session.input_images = [];
        if (req.session.images) {
          image_service_handle(
            req.session.images[0],
            service.images[0],
            req.session.input_images
          );
          image_service_handle(
            req.session.images[1],
            service.images[1],
            req.session.input_images
          );
          service.images = req.session.input_images;
        }
        // console.log('input_images: ',req.session.input_images);
        service.save().then(() => {
          req.session.images = [];
          req.session.non_images_service = ['fImage1', 'fImage2'];
          req.toastr.success(
            `Thay Đổi Thành Công Nội Dung Dịch Vụ ${req.body.txtName}`
          );
          res.redirect('./service-list');
        });
      });
    }
  });
});

router.get('/service-enable/:id/:boolean', function(req, res, next) {
  authenticateAdmin(req, res);
  priviledgeService(req, res);

  var id = req.params.id;
  var boolean = req.params.boolean;

  Service.findOneAndUpdate(
    { _id: id },
    { $set: { isEnabled: boolean } },
    { new: true },
    function(err, doc) {
      if (err) {
        console.log('Something wrong when updating data!');
      }

      console.log(doc);
      res.end();
    }
  );
});

router.get('/service-delete/:id', function(req, res, next) {
  authenticateAdmin(req, res);
  priviledgeService(req, res);
  var id = req.params.id;
  Service.findByIdAndRemove(id, (err, doc) => {
    if (err) {
      console.log('Something wrong when deleting data!');
    }
    console.log('findByIdAndRemove doc: ', doc);
    for (var i in doc.images) {
      delete_img(doc.images[i]);
    }
    successToaStr(req, `Đã xóa dịch vụ ${doc.name}`);
    res.redirect('../service-list');
  });
});
/* END SERVICES */

module.exports = router;
