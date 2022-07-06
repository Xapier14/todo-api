var requests = [];
const MAX_REQUESTS = 1000;
const TIME_PERIOD = 1000 * 60;

function isSessionInRequests(identifier) {
}

function addOrIncrement(identifier, isIp) {
  let req;
  let found = false;
  requests.forEach(request => {
    if (isIp) {
      if (request.ip === identifier) {
        req = request;
        found = true;
      }
    } else {
      if (request.token === identifier) {
        req = request;
        found = true;
      }
    }
  });
  if (!found) {
    req = {
      ip: isIp ? identifier : null,
      token: !isIp ? identifier : null,
      lastRequested: Date.now(),
      count: 1
    }
    requests.push(req);
  } else {
    if (req.ip == identifier || req.token == identifier) {
      //console.log(`last requested: ${req.lastRequested}`);
      if (req.lastRequested < Date.now() - TIME_PERIOD) {
        req.lastRequested = Date.now();
        req.count = 1;
      } else {
        req.count++;
      }
      //console.log(`request counts: ${req.count}`);
      return req.count > MAX_REQUESTS;
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