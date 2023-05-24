const db = require ('../../data/dbConfig')

async function checkPayload (req, res, next){
  const { username, password } = req.body
  if (!username || !password) {
    res.status(401).json({ message: "username and password required" })
  } else {
    next()
  }
}

async function checkUsername(req, res, next) {
  const user = await db('users').where("username", req.body.username).first()
  if (!user) {
    next()
  } else {
    next({status: 422, message: "username taken"})
  }
}

async function loginUsername(req, res, next) {
  const user = await db('users').where("username", req.body.username).first()
  if (!user) {
    next({status: 401, message: "invalid credentials"})
  } else {
    next()
  }
}

module.exports =  { checkPayload, checkUsername, loginUsername }
