const router = require('express').Router();
const User = require('./models')
const bcrypt = require('bcryptjs');
const { checkPayload, checkUsername } = require('./middleware')
//const db = require ('../../data/dbConfig')

router.post('/register', checkPayload, checkUsername, async (req, res, next) => {
    User.create(req.body)
      .then(user => {
        res.status(201).json(user)
      })
      .catch(next)
});

router.post('/login', checkPayload, (req, res) => {
  let { username, password } = req.body
  User.findUser({ username })
    .then(user => {
      let userPassword = user.password
      if (user && bcrypt.compareSync(password, userPassword)) {
        const token = User.generateToken(user)
        res.status(200).json({
          message: `Welcome ${user.username}!`,
          token, 
        })
      } else {
        res.status(401).json({ message: 'Invalid Credentials' })
      }
    })
    .catch(error => {
      console.log(error)
      res.status(500).json(error)
    })
});

module.exports = router;
