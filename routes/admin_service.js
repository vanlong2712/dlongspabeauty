var express = require('express');
var router = express.Router();
var multer = require('multer');
var fs = require('fs');
const bcrypt = require('bcryptjs');

const Service = require('../model/service');

var {image_service_handle, delete_img, successToaStr, errorToaStr, authenticateAdmin, priviledgeService,
priviledgeAdmin} = require('../vendor/admin_script');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads');
    },
    filename: function (req, file, cb) {
      if(!req.session.non_images_service) {
        req.session.non_images_service =  ["fImage1","fImage2"];
      }
      if(!req.session.images) {
        req.session.images = [];
      }
      req.session.non_images_service.splice( req.session.non_images_service.indexOf(file.fieldname), 1 );
      var filename = Date.now() + '-' +  file.originalname;
      cb(null, filename);
      req.session.images.push(filename);
    }
})

var upload = multer({ storage: storage });

/* START SERVICES */
router.get('/service-list', (req, res, next) => {
  authenticateAdmin(req,res);
  priviledgeService(req,res);
    Service.find(function(err,data) {
        if(err) throw err;
        else {
            res.render('admin/service-list', {services: data, req: req});
        }
    });
});

router.route('/service-create')
  .get((req,res,next) => {
    authenticateAdmin(req,res);
    priviledgeService(req,res);
    res.render('admin/service-create', { title: 'Beauty Spa', req: req});
  })
  .post(upload.any(), (req, res, next) => {
    authenticateAdmin(req,res);
    priviledgeService(req,res);

    var isEnabled = false;
    if(req.body.txtEnable) {
        isEnabled = true;
    }
    if(req.session.non_images_service.indexOf('fImage1') !== -1 && req.session.non_images_service.indexOf('fImage2')) { // có hình fImage1 và ko có hình fImage2
        var text = "";
        images.unshift(text);
    }else if(req.session.non_images_service.indexOf('fImage1') && req.session.non_images_service.indexOf('fImage2') !== -1) { // ko có fImage1 và có fImage2
        var text = "";
        images.push(text);
    }
    if(req.session.images.length === 0) {
        images = ["",""];
    }
    var service = new Service ({
        name:               req.body.txtName,
        title:              req.body.txtTitle,
        title_SEO:          req.body.txtTitleSEO,
        time:               req.body.txtTime,
        price:              req.body.txtPrice,
        duration:           req.body.txtDuration,
        description:        req.body.txtDescription,
        content:            req.body.txtContent,
        isEnabled:          isEnabled,
        icon:               req.body.txtIcon,
        images:             req.session.images,
        keywords:           req.body.txtKeyWord,
        created_by:         req.user._id
    });
    service.save().then(() => {
      Service.find(function(err,data) {
          if(err) throw err;
          req.session.images = [];
          req.session.non_images_service = ["fImage1","fImage2"];
          req.toastr.success(`Tạo Thành Công Dịch Vụ ${req.body.txtName}`);
          res.redirect('./service-list');
      });
    });
  });

router.get('/service-edit', (req, res, next) => {
  authenticateAdmin(req,res);
  priviledgeService(req,res);
  res.redirect('./service-list');
});

router.get('/service-edit/:id', (req, res, next) => {
  authenticateAdmin(req,res);
  priviledgeService(req,res);
  Service.findById(req.params.id, (err, data) => {
      if (err) {
          res.send(err);
      }
      if (data) {
          console.log(data);
          res.render('admin/service-edit', {service: data, req: req});
      } else {
          res.send("Không có sản phẩm này.")
      }
  });
});

router.post('/service-edit',upload.any(), (req, res, next) => {
  if(!req.isAuthenticated() || req.user.role !== 1) {
    res.redirect('./login');
  }
  if(!req.user.isPriviledge.includes('service')) {
    req.toastr.warning('Bạn chưa có quyền truy cập vào Dịch Vụ');
    res.redirect('./');
  }
  Service.findById(req.body.serviceId, (err, service) => {
    if(err) throw err;
    // console.log(service);
    service.name            = req.body.txtName;
    service.title           = req.body.txtTitle;
    service.title_SEO       = req.body.txtTitleSEO;
    service.time            = req.body.txtTime;
    service.price           = req.body.txtPrice;
    service.duration        = req.body.txtDuration;
    service.description     = req.body.txtDescription;
    service.content         = req.body.txtContent;
    service.icon            = req.body.txtIcon;
    service.keywords        = req.body.txtKeyWord;

    if(!req.session.non_images_service) {
      req.session.non_images_service = ["fImage1","fImage2"];
    }
    if(req.session.non_images_service.indexOf('fImage1') === 0 && req.session.non_images_service.indexOf('fImage2') === 0) { // có hình fImage1 và ko có hình fImage2
        req.session.images = ["", ""];
    }
    if(req.session.non_images_service.indexOf('fImage2') === 0 && req.session.non_images_service.indexOf('fImage1') == -1) { // có hình fImage1 và ko có hình fImage2
        req.session.images = [req.session.images[0], ""];
    }
    if(req.session.non_images_service.indexOf('fImage1') === 0 && req.session.non_images_service.indexOf('fImage2') == -1) { // ko có fImage1 và có fImage2
        req.session.images = ["", req.session.images[0]];
    }

    // console.log('IMAGES: ',req.session.images);
    // console.log('SERVICE_IMG: ',service.images);
    req.session.input_images = [];
    if(req.session.images) {
      image_service_handle(req.session.images[0], service.images[0],req.session.input_images);
      image_service_handle(req.session.images[1],service.images[1],req.session.input_images);
      service.images = req.session.input_images;
    }
    // console.log('input_images: ',req.session.input_images);
    service.save().then(() => {
      req.session.images = [];
      req.session.non_images_service = ["fImage1", "fImage2"];
      req.toastr.success(`Thay Đổi Thành Công Nội Dung Dịch Vụ ${req.body.txtName}`);
      res.redirect('./service-list');
    });
  });
});

router.get("/service-enable/:id/:boolean", function(req, res, next) {
  if(!req.isAuthenticated() || req.user.role !== 1) {
    res.redirect('./login');
  }
  if(!req.user.isPriviledge.includes('service')) {
    req.toastr.warning('Bạn chưa có quyền truy cập vào Dịch Vụ');
    res.redirect('./');
  }
   var id = req.params.id;
   var boolean = req.params.boolean;
   console.log(req.params);

   Service.findOneAndUpdate({_id : id}, {$set:{isEnabled: boolean}}, {new: true}, function(err, doc){
       if(err){
           console.log("Something wrong when updating data!");
       }

       console.log(doc);
       res.end();
   });
});

router.get("/service-delete/:id", function(req, res, next) {
  authenticateAdmin(req,res);
  priviledgeService(req,res);
  var id = req.params.id;
  Service.findByIdAndRemove(id, (err, doc) => {
      if(err){
          console.log("Something wrong when deleting data!");
      }
      console.log('findByIdAndRemove doc: ', doc);
      for(var i in doc.images) {
        delete_img(doc.images[i]);
      }
      successToaStr(req, `Đã xóa dịch vụ ${doc.name}`);
      res.redirect('../service-list');
  });
});
/* END SERVICES */

module.exports = router;
