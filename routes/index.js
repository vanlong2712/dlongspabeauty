var express = require('express');
var router = express.Router();
var { checkLanguage, languageService } = require('../vendor/script');

var Service = require('../model/service');

var staticLanguage = require('../vendor/static.json');

var title = 'Beauty Spa';

/* GET home page. */
router.get('/', async (req, res, next) => {
  const static = checkLanguage(req, res, staticLanguage);
  const services = await Service.find();
  services.map((item, index) => {
    languageService(req, item);
  });
  res.render('index', {
    title: title,
    req: req,
    staticLanguage: static,
    services: services
  });
});

/* GET services page. */
router.get('/services', async (req, res, next) => {
  const static = checkLanguage(req, res, staticLanguage);
  var services = await Service.find();

  services.map((item, index) => {
    languageService(req, item);
  });

  res.render('services', {
    title: title,
    req: req,
    staticLanguage: static,
    services: services
  });
});

/* GET service_detail page. */
router.get('/service/:shortid', async (req, res, next) => {
  const static = checkLanguage(req, res, staticLanguage);
  var service = await Service.findOne({ shortid: req.params.shortid });
  res.render('service_details', {
    title: title,
    req: req,
    staticLanguage: static,
    service: service
  });
});

/* GET SHOP PAGE */
router.get('/shop', async (req, res, next) => {
  const static = checkLanguage(req, res, staticLanguage);
  // var service = await Service.findOne({ shortid: req.params.shortid });
  res.render('shop', {
    title: title,
    req: req,
    staticLanguage: static
  });
});

/* GET PRODUCT PAGE */
router.get('/product', async (req, res, next) => {
  const static = checkLanguage(req, res, staticLanguage);
  // var service = await Service.findOne({ shortid: req.params.shortid });
  res.render('product_details', {
    title: title,
    req: req,
    staticLanguage: static
  });
});

/* CHANGE LANGUAGE */
router.get('/changeLanguage/:language', (req, res, next) => {
  var language = req.params.language;
  var url = req.protocol + '://' + req.get('host') + '/' + req.params.url;
  res.cookie('language', language);
  res.end();
});

/* BlOGS */
router.get('/blogs', (req, res, next) => {
  const static = checkLanguage(req, res, staticLanguage);
  // var service = await Service.findOne({ shortid: req.params.shortid });
  res.render('blogs', {
    title: title,
    req: req,
    staticLanguage: static
  });
});

/* BlOGS */
router.get('/blog', (req, res, next) => {
  const static = checkLanguage(req, res, staticLanguage);
  // var service = await Service.findOne({ shortid: req.params.shortid });
  res.render('blog_details', {
    title: title,
    req: req,
    staticLanguage: static
  });
});

/* CONTACT */
router.get('/contact', (req, res, next) => {
  const static = checkLanguage(req, res, staticLanguage);
  // var service = await Service.findOne({ shortid: req.params.shortid });
  res.render('contact', {
    title: title,
    req: req,
    staticLanguage: static
  });
});

module.exports = router;
