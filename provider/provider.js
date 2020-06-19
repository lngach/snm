const mysql = require('mysql')

const con = mysql.createConnection({
  host: 'snmtechnology.ccdwok0hcezk.ap-southeast-1.rds.amazonaws.com',
  port: 3306,
  user: 'snm',
  password: "Fuckin'damn113",
  database: 'snmtechnology',
})
con.connect(function (err) {
  if (err) throw err
})

module.exports = con
