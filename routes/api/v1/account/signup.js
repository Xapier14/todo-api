const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Account = require('../../../../models/account');

const router = express.Router();

router.post('/', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const token = "";// req.body.token
  const validity = 0;// database.getTokenValidity(token)

  // check if username or password is not supplied
  if (username === undefined || password === undefined) {
    res.status(400).send({
      token: token,
      valid_till: validity,
      status: 'Invalid data.'
    });
    return;
  }

  // check if username is allowed
  // must be 3 >= and <= 16 characters
  if (username.length < 3 || username.length > 16) {
    res.status(400).send({
      token: token,
      valid_till: validity,
      status: 'Username must be 3 >= and <= 16 characters.'
    });
    return;
  }

  // check if password is allowed
  // must be 8 >= and <= 64 characters
  if (password.length < 8 || password.length > 64) {
    res.status(400).send({
      token: token,
      valid_till: validity,
      status: 'Password must be 8 >= and <= 64 characters.'
    });
    return;
  }

  // check if passsword is strong
  // must contain at least one uppercase letter
  // must contain at least one lowercase letter
  // must contain at least one number
  // must contain at least one special character
  // must contain at least one of each
  const uppercase = /[A-Z]/;
  const lowercase = /[a-z]/;
  const number = /[0-9]/;
  const special = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
  const strong = uppercase.test(password) && lowercase.test(password) && number.test(password) && special.test(password)
  if (!strong) {
    res.status(400).send({
      token: token,
      valid_till: validity,
      status: 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character.'
    });
    return;
  }

  // check if username is taken
  mongoose.connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true
  });
  Account.findOne({ username: username }, (err, acc) => {
    if (err) {
      res.status(500).send({
        token: token,
        validity: validity,
        status: 'Internal server error.'
      })
      return;
    }
    if (acc) {
      res.status(400).send({
        token: token,
        validity: validity,
        status: 'Username is taken.'
      })
      return;
    }
    // hash password
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)

    // create account
    const account = new Account({
      username: username,
      password: hash
    })

    // save account to db
    account.save()
      .then(data => {
        res.status(201).send({
          token: token,
          validity: validity,
          status: 'Account created.'
        })
      })
      .catch(err => {
        res.status(500).send({
          token: token,
          validity: validity,
          status: 'Error creating account.'
        })
      });
  });
});

module.exports = router;