var express = require('express');
var router = express.Router();

var Service = require('../model/service');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Beauty Spa'});
});

/* GET services page. */
router.get('/services', function(req, res, next) {
  Service.find(function(err,data) {
      if(err) console.log (err);
      else {
          res.render('services', { services: data });
      }
  });
});

/* GET service_detail page. */
router.get('/service/:shortid', function(req, res, next) {
  Service.findOne({shortid: req.params.shortid}, (err, doc) => {
    if(err) console.log(err);
    console.log(doc);
    res.render('service_details', {service: doc});
  })

});

module.exports = router;
