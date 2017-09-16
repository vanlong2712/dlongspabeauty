var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const dbUser = require('../model/user');
var {successToaStr, errorToaStr} = require('../vendor/admin_script');

const Passport=require('Passport');
const LocalStrategy=require('Passport-local').Strategy;

/* START LOGIN */
router.route('/login')
  .get((req, res, next) => {
    if(req.isAuthenticated() && req.user.role === 1) {
      res.redirect('./');
    } else if (req.isAuthenticated() && req.user.role !== 1) {
      res.redirect('/');
    }
    res.render('admin/login', {req: req});
  })
  .post(Passport.authenticate('local-login', {failureRedirect: './login',successRedirect:'./'}));

router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('./login');
})

// Passport.use('local-signup', new LocalStrategy({
//     // by default, local strategy uses username and password, we will override with email
//     usernameField : 'email',
//     passwordField : 'password',
//     passReqToCallback : true // allows us to pass back the entire request to the callback
// }, (req, email, password, done) => {
// 	console.log('chay vo local-signup');
// 	 dbUser.findOne({'email': req.body.email},function(err,user) {
//       if(err){
//         return done(err);
//       }
//       if (user) {
//         errorToaStr(req, 'Email đã tồn tại.');
//         return done(null, false);
//       } else if (req.body.password.trim() !== req.body.txtRePass.trim()) {
//         errorToaStr(req, 'Xác nhận mật khẩu không đúng!');
//         return done(null, false);
//       } else {
//         const dates = req.body.txtDate.split('/');
//         console.log(dates);
//           const newUser   = new dbUser({
//            	email     :     req.body.email,
//            	password  :     req.body.password.trim(),
//             lastName  :     req.body.txtLastName.trim(),
//             firstName :     req.body.txtFirstName.trim(),
//             sex       :     req.body.txtSex,
//             CMND      :     req.body.txtCMND.trim(),
//             birthdate :     {
//               date: dates[0],
//               month: dates[1],
//               year: dates[2]
//             },
//             role      :     "Admin"
//          });
//           newUser.save().then((err) => {
//             successToaStr(req, 'Đăng Ký admin thành công');
//             done(null,newUser);
//           });
//       }
//     })
// }));

Passport.use('local-login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, (req, email, password, done) => {
  dbUser.findOne({'email': email}).then((user) => {
    if (!user) {
      errorToaStr(req, 'Không tìm thấy email này');
      return done(null,false);
    }
    if(user.role !== 1) {
      errorToaStr(req, 'Không tìm thấy email này');
      return done(null,false);
    }


    bcrypt.compare(password, user.password, (err, res) => {
      if (res) {
        if(!user.isActive) {
          errorToaStr(req, 'Tài khoản này đang tạm khóa');
          return done(null,false);
        }
        successToaStr(req, 'Bạn đã đăng nhập thành công', `Xin chào ${user.firstName}`);
        return done(null,user);
      } else {
        errorToaStr(req, 'Sai mật khẩu hoặc tài khoản');
        return done(null, false);
      }
    })
  }).catch((e) => {
    errorToaStr('Đăng nhập không thành công');
    return done(e);
  });

}));

Passport.serializeUser((user, done) => {
  done(null, user.email)
});

Passport.deserializeUser((email, done) => {
  dbUser.findOne({email},(err,user) => {
		done(null,user);
	})
});
/* END LOGIN */

module.exports = router;
