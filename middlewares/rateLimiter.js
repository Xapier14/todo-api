var requests = [];
const MAX_UNAUTHORIZED_REQUESTS = 100;
const MAX_AUTHORIZED_REQUESTS = 1000;
const TIME_PERIOD = 1000 * 60;

function addOrIncrement(identifier, isIp) {
  let req;
  let found = false;
  requests.forEach(request => {
    if (request.id === identifier) {
      req = request;
      found = true;
    }
  });
  if (!found) {
    req = {
      ip: identifier,
      lastRequested: Date.now(),
      count: 1
    }
    requests.push(req);
  } else {
    if (req.id == identifier) {
      //console.log(`last requested: ${req.lastRequested}`);
      if (req.lastRequested < Date.now() - TIME_PERIOD) {
        req.lastRequested = Date.now();
        req.count = 1;
      } else {
        req.count++;
      }
      const max_requests = isIp ? MAX_UNAUTHORIZED_REQUESTS : MAX_AUTHORIZED_REQUESTS;
      return req.count > max_requests;
    }
  }
  return false;
}

const rateLimiter = (req, res, next) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const token = req.get('Auth-Token');
  const status = addOrIncrement(token ?? ip, token === undefined);
  if (status) {
    res.status(429).send({
      status: 'Too many requests.'
    });
    return;
  }
  next();
}

module.exports = rateLimiter;