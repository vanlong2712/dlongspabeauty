var express = require('express');
var router = express.Router();

var Service = require('../model/service');


/* GET home page. */
router.get('/', async function(req, res, next) {
  var services = await Service.find();
  res.render('index', { title: 'Beauty Spa', services: services});
})
// router.get('/', async (req, res, next) => {
//   var services = await Service.find();
//   res.render('index', { title: 'Beauty Spa', services: services});
// })


/* GET services page. */
router.get('/services', async (req, res, next) => {
  var services = await Service.find();
  res.render('services', { services: services });
})

/* GET service_detail page. */
router.get('/service/:shortid', async (req, res, next) => {
  var service = await Service.findOne({shortid: req.params.shortid});
  res.render('service_details', {service: service});
})

module.exports = router;
