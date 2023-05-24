const router = require('express').Router();
const User = require('./models')
const bcrypt = require('bcryptjs');
const { checkPayload, checkUsername, loginUsername } = require('./middleware')

router.post('/register', checkPayload, checkUsername, (req, res, next) => {
  const user = req.body
  const hash = bcrypt.hashSync(user.password, 8)
  user.password = hash

  User.create(user)
  .then(user => {
    res.status(201).json(user)
  })
  .catch(next)
});


router.post('/login', checkPayload, loginUsername, (req, res, next) => {
  let { username, password } = req.body
  User.findUser({ username })
    .then(user => {
      let userPassword = user.password
      if (user && bcrypt.compareSync(password, userPassword)) {
        const token = User.generateToken(user)
        res.status(200).json({
          message: `welcome ${user.username}`,
          token, 
        })
      } else {
        res.status(401).json({ message: "invalid credentials" })
      }
    })
    .catch(next)
});

module.exports = router;
