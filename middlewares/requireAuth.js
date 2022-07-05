const requireAuth = (req, res, next) => {
  const token = req.body.token;
  if (token === undefined) {
    res.status(401).send({
      status: 'Unauthorized.'
    });
    return;
  }
  console.log('authenticated.');
  next();
};

module.exports = requireAuth;