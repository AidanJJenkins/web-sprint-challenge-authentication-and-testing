const db = require ('../../data/dbConfig')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../secret.js')

module.exports = {
  create,
  findUser,
  generateToken,
}


async function findById(id) {
  return db('users').where('id', id).first()
}

async function create(user) {
  const [id] = await db('users').insert(user)
  return findById(id)

}

async function findUser(username) {
  return db('users').where(username).first()
}

function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
  }

  const options = {
    expiresIn: '1d', 
  }

  return jwt.sign(payload, JWT_SECRET, options)
}
