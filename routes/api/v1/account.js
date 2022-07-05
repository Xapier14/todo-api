const express = require('express')
const router = express.Router();
const Account = require('../../../models/Account');
const requireAuth = require('../../../middlewares/requireAuth');

// router.get('/', (req, res) => {
//   res.send('We are on posts');
// });

router.use('/signup', requireAuth);
router.post('/signup', (req, res) => {
  console.log(req.body);
  const username = req.body.username
  const password = req.body.password
  const token = ""// req.body.token
  const validity = 0// database.getTokenValidity(token)

  // check if username or password is not supplied
  if (username === undefined || password === undefined) {
    res.status(400).send({
      token: token,
      validity: validity,
      status: 'Invalid data.'
    })
    return
  }

  // check if username is allowed
  // must be 3 >= and <= 16 characters
  if (username.length < 3 || username.length > 16) {
    res.status(400).send({
      token: token,
      validity: validity,
      status: 'Username must be 3 >= and <= 16 characters.'
    })
    return
  }

  // check if username is taken
  // if (database.checkUsernameTaken(username)) {
  //   res.status(400).send({
  //     token: token,
  //     validity: validity,
  //     status: 'Username is taken.'
  //   })
  //   return
  // }

  // check if password is allowed
  // must be 8 >= and <= 64 characters
  if (password.length < 8 || password.length > 64) {
    res.status(400).send({
      token: token,
      validity: validity,
      status: 'Password must be 8 >= and <= 64 characters.'
    })
    return
  }

  // check if passsword is strong
  // must contain at least one uppercase letter
  // must contain at least one lowercase letter
  // must contain at least one number
  // must contain at least one special character
  // must contain at least one of each
  const uppercase = /[A-Z]/
  const lowercase = /[a-z]/
  const number = /[0-9]/
  const special = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/
  const strong = uppercase.test(password) && lowercase.test(password) && number.test(password) && special.test(password)
  if (!strong) {
    res.status(400).send({
      token: token,
      validity: validity,
      status: 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character.'
    })
    return
  }

  res.status(200).send({
    token: token,
    validity: validity,
    status: 'Account created.'
  })
});

module.exports = router;