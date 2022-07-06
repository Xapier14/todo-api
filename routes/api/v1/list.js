const express = require('express');
const bcrypt = require('bcrypt');
const requiresAuth = require('../../../middlewares/requiresAuth');
const Token = require('../../../models/token');
const Todo = require('../../../models/todo');

const router = express.Router();
router.use('*', requiresAuth);
router.use('/todo', require('./list/todo'));

router.get('/:username', (req, res) => {
  const token = req.get('Auth-Token');
  const username = req.params.username;

  Token.findOne({ token: token }, (err, tok) => {
    if (err) {
      res.status(500).send({
        status: 'Internal server error.'
      });
      return;
    }
    if (tok.username != username) {
      res.status(401).send({
        token: token,
        valid_till: tok.valid_till,
        status: 'Unauthorized.'
      });
      return;
    }
    Todo.find({ username: username }, (err, todos) => {
      if (err) {
        res.status(500).send({
          token: token,
          valid_till: tok.valid_till,
          status: 'Internal server error.'
        });
        return;
      }
      const returnTodos = [];
      for (let i = 0; i < todos.length; i++) {
        returnTodos.push({
          id: todos[i].id,
          username: todos[i].username,
          title: todos[i].title,
          content: todos[i].content,
          contentType: todos[i].contentType,
          isCompleted: todos[i].isCompleted,
          createdOn: todos[i].createdOn,
          lastModified: todos[i].lastModified
        });
      }
      res.status(200).send({
        token: token,
        valid_till: tok.valid_till,
        status: 'Success.',
        todos: returnTodos
      });
    });
  });
});

module.exports = router;