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
    if (req.user) {
        // 一登录
    } else {
    }
    // {qs: {id: req.query.id}}
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
            request.qr
            res.render('index', {
              // success: !!(body.code == 0),
              // done: !!(body.code == 111001007),
              // invalid: !!(body.code == 111001003),
            });
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
  // {qs: {id: req.query.id}}
  res.render('register-test')
});

router.get('/register-test', function(req, res, next) {
  console.log(req.query.token);

  request('http://utuotu.com/v1/msg/validemail.action', {qs: {token: eq.query.token}}, function(err, response, body) {
    console.log("获取参数请求");
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

//模板 
router.get('/layouts/main', function(req, res, next) {
  res.render('layouts/main')
});

//院校库
router.get('/email-reset', function(req, res, next) {
  res.render('email-reset')
});

router.get('/email-test', function(req, res, next) {
    request('http://utuotu.com/v1/msg/validemail.action', function(err, response, body) {
      console.log("email-test" + body);
      res.render('email-test', body);
   });
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

module.exports = router;