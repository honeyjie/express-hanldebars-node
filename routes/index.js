var express = require('express');
var router = express.Router();
var path = require('path');
var request = require('request')
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(cookieParser());

//渲染页面
router.get('/', function (req, res) {
    request('http://www.utuotu.com/v1/user/cache.action', function(err, response, body) {
          if (!!err) {
              next(err)
          } else {
              var header = response.headers;
              res.headers = header;
              try {
                  var body = JSON.parse(body);
              } catch(e) {
                  console.log(e)
              }
              res.render('index', body);
          }
    })   
});

//用户
router.get('/user-news', function(req, res, next) {
  res.render('user-news')
});

router.get('/user-point', function(req, res, next) {
  res.render('user-point')
});

router.get('/user-set', function(req, res, next) {
  res.render('user-set')
});

//注册
router.get('/register-complete', function(req, res, next) {
  res.render('register-complete')
});

router.get('/register-forget', function(req, res, next) {
  res.render('register-forget')
});

router.get('/register-reset', function(req, res, next) {
  res.render('register-reset')
});

router.get('/register-test', function(req, res, next) {
  res.render('register-test')
});

//帮助
router.get('/help', function(req, res, next) {
  res.render('help')
});

//模板 
router.get('/layouts/main', function(req, res, next) {
  res.render('layouts/main')
});

//院校库
router.get('/email-reset', function(req, res, next) {

  res.render('email-reset')
});
router.get('/email-test', function(req, res, next) {
  res.render('email-test')
});
router.get('/school-all', function(req, res, next) {
  res.render('school-all')
});
router.get('/school-major', function(req, res, next) {
  request('http://www.utuotu.com/v1/user/cache.action', function(err, response, body) {
          if (!!err) {
              next(err)
          } else {
              var header = response.headers;
              res.headers = header;
              try {
                  var body = JSON.parse(body);
              } catch(e) {
                  console.log(e)
              }
              res.render('school-major', body)
          }
    })   
  
});
router.get('/school-recommend', function(req, res, next) {
  res.render('school-recommend')
});
router.get('/school-screen', function(req, res, next) {
  res.render('school-screen')
});
router.get('/test', function(req, res, next) {
  res.render('test')
});

module.exports = router
