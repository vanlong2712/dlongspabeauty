var checkLanguage = (req, res, staticLanguage) => {
  console.log('checkLanguage', req.cookies.language);
  if (!req.cookies.language) {
    res.cookie('language', 'vn');
    return staticLanguage.vn;
  } else if (req.cookies.language == 'vn') {
    return staticLanguage.vn;
  } else {
    return staticLanguage.en;
  }
};

module.exports = {
  checkLanguage
};
