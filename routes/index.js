var express = require('express')
var router = express.Router()
var path = require('path')
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' })
})

router.get('/sitemap.xml', (_, res) => {
  res.sendFile(path.resolve('sitemap.xml'))
})

module.exports = router
