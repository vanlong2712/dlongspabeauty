var checkLanguage = (req, res, staticLanguage) => {
  // console.log('checkLanguage', req.cookies.language);
  if (!req.cookies.language) {
    res.cookie('language', 'vn');
    return staticLanguage.vn;
  } else if (req.cookies.language == 'vn') {
    return staticLanguage.vn;
  } else {
    return staticLanguage.en;
  }
};

var languageService = (req, item) => {
  if (req.cookies.language == 'vn') {
    item.name = item.content_vn.name;
    item.title = item.content_vn.title;
    item.time = item.content_vn.time;
    item.price = item.content_vn.price;
    item.duration = item.content_vn.duration;
    item.description = item.content_vn.description;
    item.content = item.content_vn.content;
    item.keywords = item.content_vn.keywords;
  } else {
    item.name = item.content_en.name;
    item.title = item.content_en.title;
    item.time = item.content_en.time;
    item.price = item.content_en.price;
    item.duration = item.content_en.duration;
    item.description = item.content_en.description;
    item.content = item.content_en.content;
    item.keywords = item.content_en.keywords;
  }
};

module.exports = {
  checkLanguage,
  languageService
};
