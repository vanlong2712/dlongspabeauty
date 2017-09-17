var express = require('express');
var router = express.Router();
var randomstring = require("randomstring");
var {successToaStr, errorToaStr, authenticateAdmin, priviledgeService,
  priviledgeAdmin} = require('../vendor/admin_script');
var {justSendAEmail} = require('../vendor/nodemailer');


const dbUser = require('../model/user');

/* GET home page. */
router.get('/', (req, res, next) => {
  authenticateAdmin(req,res);

  res.render('admin/index', { title: 'Beauty Spa', req: req });
});


/* START USER/ADMIN */
router.route('/admin-create')
  .get((req, res, next) => {
    authenticateAdmin(req,res);
    priviledgeAdmin(req,res);
    res.render('admin/admin-create', {req: req});
  })
  .post( async (req, res, next) => {
    authenticateAdmin(req,res);
    priviledgeAdmin(req,res);
  	 dbUser.findOne({'email': req.body.email},function(err,user) {
        if(err){
          console.log(err);
        }
        if (user) {
          errorToaStr(req, 'Email đã tồn tại.');
          res.redirect('./admin-create');
        } else {
          var passwordGenerated = randomstring.generate(7);
          var activeCodeGenerated = randomstring.generate();
          const dates = req.body.txtDate.split('/');
            const newUser   = new dbUser({
             	email         :     req.body.email.trim(),
             	password      :     passwordGenerated.trim(),
              lastName      :     req.body.txtLastName.trim(),
              firstName     :     req.body.txtFirstName.trim(),
              sex           :     req.body.txtSex,
              CMND          :     req.body.txtCMND.trim(),
              birthdate     :     {
                date        :     dates[0],
                month       :     dates[1],
                year        :     dates[2]
              },
              role          :     1,
              isPriviledge  :     req.body.Priviledge,
              activeCode    :     activeCodeGenerated
           });
            newUser.save().then( async (user) => {
              console.log('USERRRRRRRRRRR:', user);
              console.log('USEEERRRRRRRRR:', user._id);
              var text = `XinhXinhSalon cung cấp tài khoản truy cập quyền quản trị:
                          Tài khoản: ${user.email}
                          Mật khẩu : ${passwordGenerated.trim()}
                          Vui lòng nhấn vào đây để khởi động tài khoản.`;
              var html = `XinhXinhSalon cung cấp tài khoản truy cập quyền quản trị: <br /><br />
                          Tài khoản: ${user.email} <br />
                          Mật khẩu : ${passwordGenerated.trim()} <br /><br />
                          Vui lòng nhấn vào <a href='https://spabeauty.herokuapp.com/187_admin/admin-activeCode/${user._id}/${user.activeCode}' >đây</a> để khởi động tài khoản.`;
              var object = {
                toEmail: user.email,
                subject: "XinhXinhSalon: Cung cấp tài khoản truy cập quyền quản trị",
                text: text,
                html: html
              };
              await justSendAEmail(object);
              successToaStr(req, 'Đăng Ký admin mới thành công');
              res.redirect('./');
            });
        }
      })
  });

router.get('/admin-list', (req, res, next) => {
  authenticateAdmin(req,res);
  priviledgeAdmin(req,res);

  dbUser.find({'role': 1}).then((data) => {
    res.render('admin/admin-list', { data: data, req: req} );
  });
});

router.route('/admin-edit')
  .get((req, res, next) => {
    authenticateAdmin(req,res);
    priviledgeAdmin(req,res);
    res.redirect('./admin-list');
  })
  .post(async (req, res, next) => {
    authenticateAdmin(req,res);
    priviledgeAdmin(req,res);

    var admin = await dbUser.findById(req.body.adminId);
    admin.isPriviledge = req.body.Priviledge;
    admin.save().then((admin) => {
      successToaStr(req, `Thiết lập phân quyền cho ${admin.email} thành công`);
      res.redirect('/187_admin/admin-list');
    });
  });

router.get('/admin-edit/:id', (req, res, next) => {
  authenticateAdmin(req,res);
  priviledgeAdmin(req,res);

  dbUser.findOne({shortid: req.params.id}, (err, data) => {
    if(err) {
      console.log(err);
    }
    res.render('admin/admin-edit', {data: data, req: req});
  })
});

router.get("/admin-active/:id/:boolean", async (req, res, next) => {
  authenticateAdmin(req,res);
  priviledgeAdmin(req,res);

   var id = req.params.id;
   var boolean = req.params.boolean;
   var doc = await dbUser.findOneAndUpdate({_id : id}, {$set:{isActive: boolean}}, {new: true});
   console.log(doc);
   res.end();
});

router.get('/admin-delete/:id', async (req, res, next) => {
  authenticateAdmin(req,res);
  priviledgeAdmin(req,res);

  var admin = await dbUser.findByIdAndRemove(req.params.id);
  console.log('Delete: ',admin);
  successToaStr(req, `Đã xóa admin '${admin.email}' thành công`);
  res.redirect('/187_admin/admin-list');
});

router.get('/admin-activeCode/:id/:activeCode', (req, res, next) => {
  dbUser.findById(req.params.id, (err, user) => {
    if (err) res.redirect('/187_admin/login');
    if(user && user.role === 1 && user.activeCode === req.params.activeCode) {
      user.isActive = true;
      user.activeCode = 'mysecret';
      user.save().then(() => res.redirect('/187_admin/login'));
    }
    res.redirect('/187_admin/login');
  });
});
/* END USER/ADMIN */





module.exports = router;
