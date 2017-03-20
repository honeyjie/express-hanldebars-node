'use strict';

var express = require('express');
var app = express();
var router = express.Router();
var url = require('url');
var path = require('path');
var request = require('request')
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(cookieParser());

var helpers = require('../lib/helpers');

//渲染页面
router.get('/', function (req, res, next) {
    res.render('index');
});
router.get('/error', function (req, res, next) {
    res.render('error');
});


/* 
局部渲染,模板将需要重构的部分建立局部文件，
当浏览器通过ajax请求接口时，无需拼接字符串，达到前后端共享模板目的
*/
router.get('前端请求地址', function(req, res, next) {
    req.proxy.request({
        method: "GET",
        url: "...",
        qs: req.query
    }, function(err, response, body) {
        var data = getParse(res, body, next);
        res.render('partials/局部文件名', {
            data: data,
            layout: null,
        });
    });
});

module.exports = router;