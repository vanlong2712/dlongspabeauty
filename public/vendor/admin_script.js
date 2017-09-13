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
  delete_img
}
