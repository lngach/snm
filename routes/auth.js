var express = require('express')
var router = express.Router()
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const con = require('../provider/provider')
const smtpTransport = require('nodemailer-smtp-transport')
const mailTemplate = require('../views/mail-template')

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
  con.query(`SELECT * FROM users WHERE email = '${email}'`, (err, rows) => {
    if (err) {
      result.success = false
      result.message = 'Error while query!'
      return res.json(result)
    }
    if (rows.length < 1) {
      result.success = false
      result.message = 'User not found, please try again!'
      return res.json(result)
    }
    const token = genToken(20)
    var transporter = nodemailer.createTransport(
      smtpTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
          user: 'iklearn2018@gmail.com',
          pass: 'tobeanIT',
        },
      })
    )

    var mailOptions = {
      from: 'iklearn2018@gmail.com',
      to: email,
      subject: 'RESET PASSWORD',
      text: `Click on the link below to update your password`,
      html: mailTemplate.replace('dataToReplace', token),
    }
    transporter.sendMail(mailOptions, function (error) {
      if (error) {
        result.success = false
        result.message = 'Error while sending reset password token!'
        console.log(error)
        return res.json(result)
      } else {
        con.query(
          `UPDATE users SET reset_password_token = '${token}', reset_password_sent_at = '${new Date()}'
              WHERE email = '${email}'`,
          (err) => {
            if (err) {
              result.success = false
              result.message = 'Error while query!'
              return res.json(result)
            }
          }
        )
        res.json(result)
      }
    })
  })
})
router.get('/resetPassword', function (req, res) {
  const token = req.query.token
  con.query(
    `SELECT * FROM users WHERE reset_password_token = '${token}'`,
    (err, rows) => {
      if (err) {
        return res.render('resetPassword', {
          success: false,
          message: 'Error while query!',
        })
      }
      if (rows.length < 1) {
        return res.render('resetPassword', {
          success: false,
          message: 'token not valid!',
        })
      }
      if (
        (new Date().getTime() -
          new Date(rows[0].reset_password_sent_at).getTime()) /
          (1000 * 60) >
        5
      ) {
        return res.render('resetPassword', {
          success: false,
          message: 'Token expired!',
        })
      }
      res.render('resetPassword', { success: true })
    }
  )
})
router.post('/resetpassword', function (req, res) {
  const newpassword = req.body.newpassword
  const token = req.body.token

  const salt = bcrypt.genSaltSync(8)
  const hash = bcrypt.hashSync(newpassword, salt)
  let result = {
    success: true,
    message: 'reset password complete, you can now login with new password!',
  }
  con.query(
    `UPDATE users SET reset_password_token = null, reset_password_sent_at = null, password = '${hash}', failed_attempts = 0, locked_at = null WHERE reset_password_token = '${token}'`,
    (err) => {
      if (err) {
        result.success = false
        result.message = 'Error while query!'
        return res.json(result)
      }
    }
  )
  res.json(result)
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
