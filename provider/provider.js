const mysql = require('mysql')

const con = mysql.createConnection({
  host: 'remotemysql.com',
  port: 3306,
  user: 'root',
  password: '',
  database: 'cms',
})
con.connect(function (err) {
  if (err) throw err
})

module.exports = con
