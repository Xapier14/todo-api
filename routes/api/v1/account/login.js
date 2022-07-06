const express = require('express');
const bcrypt = require('bcrypt');
const Account = require('../../../../models/account');
const Token = require('../../../../models/token');

const validDays = 3;

const router = express.Router();

router.post('/', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const token = "";// req.body.token
  const validity = 0;// database.getTokenValidity(token)

  const uppercase = /[A-Z]/;
  const lowercase = /[a-z]/;
  const number = /[0-9]/;
  const special = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

  // check if data is invalid
  if (username === undefined
    || password === undefined
    || username.length < 3 || username.length > 16
    || password.length < 8 || password.length > 64
    || !(uppercase.test(password) && lowercase.test(password) && number.test(password) && special.test(password))) {
    res.status(400).send({
      token: token,
      valid_till: validity,
      status: 'Invalid data.'
    });
    return;
  }

  Account.findOne({username: username}, (err, acc) => {
    if (err) {
      res.status(500).send({
        token: token,
        valid_till: validity,
        status: 'Internal server error.'
      })
      return;
    }
    if (acc) {
      if (bcrypt.compareSync(password, acc.password)){
        // generate token
        newToken = bcrypt.genSaltSync(32);
        newValidity = new Date(Date.now());
        newValidity.setDate(newValidity.getDate() + validDays);
        const token = new Token({
          username: username,
          token: newToken,
          valid_till: newValidity
        })
        token.save()
        .then(data => {
          // send success response
          res.status(200).send({
            token: newToken,
            valid_till: newValidity,
            status: 'Login successful.'
          });
          return;
        })
        .catch(err => {
          res.status(500).send({
            token: token,
            valid_till: validity,
            status: 'Internal server error.'
          });
          return;
        });
      } else {
        res.status(400).send({
          token: token,
          valid_till: validity,
          status: 'Invalid credentials.'
        });
        return;
      }
    }
  });
});

module.exports = router;