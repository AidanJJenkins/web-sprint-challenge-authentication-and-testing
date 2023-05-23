const db = require ('../../data/dbConfig')

const checkPayload = (req, res, next) => {
  const { username, password } = req.body
  if (!username || !password) {
    res.status(400).json({ message: 'username and password required' })
  } else {
    next()
  }
}

async function checkUsername(req, res, next) {
  const user = await db('users').where("username", req.body.username).first()
  if (!user) {
    next()
  } else {
    next({status: 422, message: "Username taken"})
  }
}

module.exports =  { checkPayload, checkUsername }
