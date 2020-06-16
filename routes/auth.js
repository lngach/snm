var express = require('express')
var router = express.Router()
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const con = require('../provider/provider')
const smtpTransport = require('nodemailer-smtp-transport')
const mailtemplate = require('../views/mail-template')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('login', { title: 'Express' })
})
router.get('/signup', function (req, res, next) {
  res.render('signup', { title: 'Express' })
})
router.get('/forgotpassword', function (req, res) {
  res.render('forgotpassword', { title: 'Express' })
})
router.post('/signup', function (req, res) {
  const email = req.body.email
  const name = req.body.name
  const password = req.body.password
  let result = { success: true, message: 'Sign up complete!' }

  con.query(`SELECT * FROM users WHERE email = '${email}'`, (err, rows) => {
    if (err) {
      result.success = false
      result.message = 'Error while query!'
      return res.json(result)
    }
    if (rows.length > 0) {
      result.success = false
      result.message = 'Email already existed!'
      return res.json(result)
    }
    const salt = bcrypt.genSaltSync(8)
    const hash = bcrypt.hashSync(password, salt)
    con.query(
      `INSERT INTO users(name, email, password) VALUES('${name}','${email}','${hash}')`,
      (err) => {
        if (err) {
          result.success = false
          result.message = 'Error while query!'
        }
      }
    )
    res.json(result)
  })
})
router.post('', function (req, res) {
  const email = req.body.email
  const password = req.body.password
  let result = { success: true, message: 'Login complete!' }
  con.query(`SELECT * FROM users WHERE email = '${email}'`, (err, rows) => {
    if (err) {
      result.success = false
      result.message = 'Error while query!'
      return res.json(result)
    }
    if (rows.length !== 1) {
      result.success = false
      result.message = 'User not found!'
      return res.json(result)
    }
    if (!bcrypt.compareSync(password, rows[0].password)) {
      result.success = false
      result.message = 'Password not match!'
      return res.json(result)
    }
    res.json({ ...result, user: rows[0] })
  })
})
router.post('/forgotpassword', function (req, res) {
  const email = req.body.email
  let result = {
    success: true,
    message: `An email has been sent to ${email} please check!`,
  }
  con.query(`SELECT * FROM user WHERE email = '${email}'`, (err, rows) => {
    if (err) {
      result.success = false
      result.message = 'Error while query!'
      return res.json(result)
    }
    if (rows.length < 1) {
      result.success = false
      result.message = 'User not found, please try again!'
      return res.json(result)
    } else {
    }
    res.json(result)
  })
})
function genToken(length) {
  var result = ''
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  var charactersLength = characters.length
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}
module.exports = router
