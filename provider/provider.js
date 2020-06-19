const mysql = require('mysql')

const con = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: "Fuckin'damn113",
  database: 'cms',
})
con.connect(function (err) {
  if (err) throw err
})

module.exports = con
