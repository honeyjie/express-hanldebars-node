'use strict';

var Promise = global.Promise || require('promise');

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
    res.render('index');  
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

router.get('/register-test', function(req, res, next) {
  request('http://www.utuotu.com/v1/msg/validemail.action', {qs: {token: req.query.token}}, function(err, response, body) {
    var success = false,
        done = false,
        invalid = false;
    if (body.code == 0) {
      success = true;
    } else if (body.code == 111001007) {
      done = true;
    } else {
      invalid = true;
    }
    res.render('register-test', {
      success: success,
      done: done,
      invalid : invalid
    })
  })


});

//帮助
router.get('/help', function(req, res, next) {
  res.render('help')
});

//院校库
router.get('/email-reset', function(req, res, next) {
  res.render('email-reset')
});

router.get('/email-test', function(req, res, next) {
    request('http://utuotu.com/v1/msg/validemail.action', function(err, response, body) {
      res.render('email-test', body);
   });
});

router.get('/school-all', function(req, res, next) {
  req.proxy.request({method: "GET", qs: {sid: req.query.sid}, url: "http://www.utuotu.com/v1/schoolinfo/getallschoolmajor.action"}, function(err, response, body) {
      var data = JSON.parse(body);
      res.render('school-all', data.data);
  });
});

router.get('/school-screen', function (req, res) {
    req.proxy.request({
        method: "GET",
        url: "http://www.utuotu.com/v1/schoolmajor/searchschool.action",
        qs: req.query
    }, function(err, response, body) {
        var data = JSON.parse(body); 
        res.render('school-screen', {
            data: data.data
        });
    })
});

router.get('/school-major', function(req, res, next) {
  req.proxy.request({
      method: "GET",
      url: "http://www.utuotu.com/v1/schoolinfo/getschoolmajorinfo.action",
      qs: req.query
  }, function(err, response, body) {
    var data = JSON.parse(body);
    console.log(data.data);
      res.render('school-major', {
            data: data.data
      });
  });
});

router.get('/school-recommend', function(req, res, next) {
    req.proxy.request({
        method: "GET",
        url: "http://www.utuotu.com/v1/schoolinfo/getrecommend.action",
        qs: req.query
    }, function(err, response, body) {
      var data = JSON.parse(body);
        res.render('school-recommend', {
              data: data
        });
    });
});

router.get('/select', function(req, res) {
  res.render('select')
});

router.get('/test', function(req, res) {
  res.render('test')
});

module.exports = router;