var express = require('express');
var router = express.Router();
var {successToaStr, errorToaStr, authenticateAdmin, priviledgeService,
  priviledgeAdmin} = require('../vendor/admin_script');
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
  .post((req, res, next) => {
    authenticateAdmin(req,res);
    priviledgeAdmin(req,res);
  	 dbUser.findOne({'email': req.body.email},function(err,user) {
        if(err){
          console.log(err);
        }
        if (user) {
          errorToaStr(req, 'Email đã tồn tại.');
          res.redirect('./admin-create');
        } else if (req.body.password.trim() !== req.body.txtRePass.trim()) {
          errorToaStr(req, 'Xác nhận mật khẩu không đúng!');
          res.redirect('./admin-create');
        } else {
          const dates = req.body.txtDate.split('/');
            const newUser   = new dbUser({
             	email         :     req.body.email,
             	password      :     req.body.password.trim(),
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
              isPriviledge  :     req.body.Priviledge
           });
            newUser.save().then((err) => {
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
})

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
  })

router.get('/admin-edit/:id',(req, res, next) => {
    authenticateAdmin(req,res);
    priviledgeAdmin(req,res);

    dbUser.findOne({shortid: req.params.id}, (err, data) => {
      if(err) {
        console.log(err);
      }
      res.render('admin/admin-edit', {data: data, req: req});
    })
  })
/* END USER/ADMIN */





module.exports = router;
