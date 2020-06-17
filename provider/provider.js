const mysql = require('mysql')

const con = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'fSncS4Zjuv',
  password: 'c9sFrq5RGN',
  database: 'fSncS4Zjuv',
})
con.connect(function (err) {
  if (err) throw err
})

module.exports = con
