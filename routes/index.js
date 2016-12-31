'use strict';

var Promise = global.Promise || require('promise');

var express = require('express');
var router = express.Router();
var path = require('path');
var request = require('request')
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs  = require('express-handlebars');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(cookieParser());

var helpers = require('../public/js/lib/helpers');

var hbs = exphbs.create({
    defaultLayout: 'main',
    extname: "hbs",
    helpers: helpers,
    partialsDir: [
        'shared/templates',
        'views/partials/',
    ]
});

//渲染页面
router.get('/', function (req, res) {
    res.render('index', {
      show: true
    });
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
    request('http://www.utuotu.com/v1/msg/validemail.action', function(err, response, body) {
      res.render('email-test', body);
   });
});

router.get('/school-all', function(req, res, next) {
  req.proxy.request({method: "GET", url: "http://www.utuotu.com/v1/schoolinfo/getallschoolmajor.action"}, function(err, response, body) {
      var data = JSON.parse(body);
      res.render('school-all', {
        data: data,
        sid: req.query.sid,
        major: true
        });
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
        res.render('school-major', {
            data: data.data,
            major: true,
            sid: req.query.sid
        });
    });
});

router.get('/school-recommend', function(req, res) {
    req.proxy.request({
        method: "GET",
        url: "http://www.utuotu.com/v1/schoolInfo/hot.action",
        qs: req.query
    }, function(err, response, body) {
        var data = JSON.parse(body);
        if (!data) {return}
        res.render('school-recommend', {
              data: data.data,
              total: data.data.Count.master + data.data.Count.doctor,
              sid: req.query.sid,
              button: true
        });
    });
});

router.get('/select-school', function(req, res) {
    res.render('select-school')
});

router.get('/test', function(req, res) {
  res.render('test')
});

router.get("/v1/schoolmajor/filterschool.action", function(req, res) {
    req.proxy.request({
        method: "GET",
        url: "http://www.utuotu.com/v1/schoolmajor/filterschool.action",
    }, function(err, response, body) {
        var data = JSON.parse(body);
        if (!data) {
            return
        }
        res.render('partials/search-result', {
            data: data.data,
            layout: "naked"
        });
    });
});
router.get("/v1/schoolmajor/searchschool.action", function(req, res) {
    req.proxy.request({
        method: "GET",
        url: "http://www.utuotu.com/v1/schoolmajor/searchschool.action",
    }, function(err, response, body) {
        var data = JSON.parse(body);
        if (!data) {
            return
        }
        res.render('partials/search-result', {
            data: data.data,
            layout: "naked"
        });
    });
});
module.exports = router;
