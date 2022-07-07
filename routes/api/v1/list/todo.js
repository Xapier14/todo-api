const express = require('express');
const bcrypt = require('bcrypt');
const Token = require('../../../../models/token');
const Todo = require('../../../../models/todo');

const router = express.Router();
router.get('/:id', (req, res) => {
  const token = req.get('Auth-Token');
  const id = req.params.id;
  Token.findOne({ token: token }, (err, tok) => {
    if (err || !tok) {
      res.status(500).send({
        status: 'Internal server error.'
      });
      return;
    }
    Todo.findOne({ id: id, username: tok.username }, (err, todo) => {
      if (err) {
        res.status(500).send({
          token: token,
          valid_till: tok.valid_till,
          status: 'Internal server error.'
        });
        return;
      }
      if (!todo) {
        res.status(404).send({
          token: token,
          valid_till: tok.valid_till,
          status: 'Todo entry not found.'
        });
        return;
      }
      res.status(200).send({
        token: token,
        valid_till: tok.valid_till,
        status: 'Found.',
        todo: {
          id: todo.id,
          username: todo.username,
          title: todo.title,
          content: todo.content,
          contentType: todo.contentType,
          isCompleted: todo.isCompleted,
          createdOn: todo.createdOn,
          lastModified: todo.lastModified
        }
      });
      return;
    });
  });
});
router.patch('/:id', (req, res) => {
  res.send(req.params.id)
});
router.delete('/:id', (req, res) => {
  const token = req.get('Auth-Token');
  const id = req.params.id;
  Token.findOne({ token: token }, (err, tok) => {
    if (err || !tok) {
      res.status(500).send({
        status: 'Internal server error.'
      });
      return;
    }
    Todo.findOne({ id: id, username: tok.username }, (err, todo) => {
      if (err) {
        res.status(500).send({
          token: token,
          valid_till: tok.valid_till,
          status: 'Internal server error.'
        });
        return;
      }
      if (!todo) {
        res.status(404).send({
          token: token,
          valid_till: tok.valid_till,
          status: 'Todo entry not found.'
        });
        return;
      }
      todo.remove((err) => {
        if (err) {
          res.status(500).send({
            token: token,
            valid_till: tok.valid_till,
            status: 'Internal server error.'
          });
          return;
        }
        res.status(200).send({
          token: token,
          valid_till: tok.valid_till,
          status: 'Success.'
        });
      });
    });
  });
});
router.post('/', (req, res) => {
  const token = req.get('Auth-Token');
  const title = req.body.title;
  const content = req.body.content;
  const contentType = req.body.contentType;
  
  Token.findOne({ token: token }, (err, tok) => {
    if (err) {
      res.status(500).send({
        token: token,
        valid_till: tok.valid_till,
        status: 'Internal server error.'
      });
      return;
    }

    if (title === undefined || content === undefined || contentType === undefined) {
      res.status(400).send({
        token: token,
        valid_till: tok.valid_till,
        status: 'Invalid data.'
      });
      return;
    }

    const createdDate = Date.now();
    const idHash = bcrypt.hashSync(createdDate.toString() + tok.username, 2);
    const pattern = /[\.\$\/\?\!\:=]/;
    var id = '';
    for (var i = 0; i < idHash.length; i++) {
      const char = idHash.charAt(i);
      if (!pattern.test(char)) {
        id += char;
      }
    }

    const todo = new Todo({
      username: tok.username,
      id: id,
      title: title,
      content: content,
      contentType: contentType,
      createdOn: createdDate,
      lastModified: createdDate
    });
    todo.save().then((data) => {
      res.status(201).send({
        token: token,
        valid_till: tok.valid_till,
        status: 'Success.'
      });
    }).catch((err) => {
      res.status(500).send({
        token: token,
        valid_till: tok.valid_till,
        status: 'Internal server error.'
      });
    });
  });

  
});

module.exports = router;