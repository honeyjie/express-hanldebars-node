var express = require('express');
var router = express.Router();
var request = require('request');
var handlebars = require('handlebars');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//定义proxy
var proxy = require("../proxy").proxy;
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(cookieParser());

router.get('/', function (req, res) {
    res.render("index");
});

router.get("/opencode", function(req, res) {
    proxy.request("/opencode", null, function(err, response, body) {
        if (!!err) {
            res.send("server error")
            return;
        }

        res.send(JSON.parse(body));
    });
});

router.get('/user-news', function(req, res, next) {
  res.render('user-news')
});

router.get('/user-point', function(req, res, next) {
  res.render('user-point')
});

router.get('/user-set', function(req, res, next) {
  res.render('user-set')
});

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

router.get('/help', function(req, res, next) {
  res.render('help')
});

module.exports = router
