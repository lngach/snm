var express = require('express')
var router = express.Router()
var path = require('path')
/* GET home page. */
router.get('/', function (_, res) {
  res.render('index', { title: 'SNM Technology' })
})

router.get('/about', function (_, res) {
  res.render('index', { title: 'SNM Technology' })
})

router.get('/privacy', function (_, res) {
  res.render('index', { title: 'SNM Technology' })
})

router.get('/sitemap.xml', (_, res) => {
  res.sendFile(path.resolve('sitemap.xml'))
})

module.exports = router
