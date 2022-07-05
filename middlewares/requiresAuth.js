const Token = require("../models/Token");

const requiresAuth = (req, res, next) => {
  const token = req.get('Auth-Token');
  if (token === undefined) {
    res.status(401).send({
      status: 'Unauthorized.'
    });
    return;
  }
  Token.findOne({ token: token }, (err, tok) => {
    if (err) {
      res.status(500).send({
        status: 'Internal server error.'
      });
      return;
    }
    if (tok) {
      if (tok.valid_till < Date.now()) {
        res.status(401).send({
          status: 'Token expired.'
        });
        return;
      } else {
        next();
      }
    } else {
      res.status(401).send({
        status: 'Unauthorized.'
      });
      return;
    }
  });
};

module.exports = requiresAuth;