const db = require ('../../data/dbConfig')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../secret.js')

module.exports = {
  create,
  findUser,
  generateToken
}


async function findById(id) {
  return db('users').where('id', id).first()
}

async function create(user) {
  try {
    const hash = bcrypt.hashSync(user.password, 14);
    user.password = hash;

    const id = await db('users').insert(user)
    return await findById(id)
  } catch (err) {
    console.log(err)
  }
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
