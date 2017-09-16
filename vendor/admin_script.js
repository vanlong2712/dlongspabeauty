var fs = require('fs');

var image_service_handle = async (image, service_img,array=[]) => {
  if(image !== '') {
    await array.push(image);
    if(service_img && service_img !== '') {
      await fs.unlink('./public/uploads/'+service_img, (err) => {
        if (err) {
            console.log(err);
        }
      });
    }
  }else {
    await array.push(service_img)
  }
}

var delete_img = async (image) => {
  await fs.unlink('./public/uploads/'+image, (err) => {
    if (err) {
        console.log(err);
    }
  });
}

var errorToaStr = async (req,msg) => {
  console.log('errorToaStr');
  await req.toastr.error(msg);
}

var successToaStr = async (req,msg) => {
  console.log('successToaStr');
  await req.toastr.success(msg);
}

var successToaStr = async (req,msg,title) => {
  console.log('successToaStr');
  await req.toastr.success(msg,title);
}

var authenticateAdmin = (req, res) => {
  if(!req.isAuthenticated() || req.user.role !== 1) {
    res.redirect('/187_admin/login');
  } else if (!req.user.isActive) {
    req.logout();
    res.redirect('/187_admin/login');
  }
}

var priviledgeService = (req, res) => {
  if(!req.user.isPriviledge.includes('service')) {
    req.toastr.warning('Bạn chưa có quyền truy cập vào Dịch Vụ');
    res.redirect('/187_admin/');
  }
}

var priviledgeAdmin = (req, res) => {
  if(!req.user.isPriviledge.includes('admin')) {
    req.toastr.warning('Bạn chưa có quyền truy cập vào Quản Lý Admin');
    res.redirect('/187_admin/');
  }
}

// var image_service_handle = (image, service_img,array=[]) => {
//   return new Promise((resolve, reject) => {
//     if(image !== '') {
//       array.push(image);
//       if(service_img && service_img !== '') {
//         fs.unlink('./public/uploads/'+service_img, (err) => {
//           if (err) {
//               reject(err);
//           }
//           resolve();
//         });
//         resolve();
//       }
//     }else {
//       array.push(service_img)
//       resolve();
//     }
//   });
// }

module.exports = {
  image_service_handle,
  delete_img,
  successToaStr,
  errorToaStr,
  authenticateAdmin,
  priviledgeService,
  priviledgeAdmin
}
