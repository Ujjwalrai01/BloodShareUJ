module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirecturl) {
    res.locals.redirecturl = req.session.redirecturl;
  }
  console.log(res.locals.redirecturl);
  next();
}
