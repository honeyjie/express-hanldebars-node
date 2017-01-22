var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var multer = require('multer');

var index = require('./routes/index');
var proxy = require("./proxy").proxy;
var helpers = require('./lib/helpers');
var Promise = global.Promise || require('promise');

var app = express();

//设置视图位置
app.set('views', path.join(__dirname, 'views'));
var hbs = exphbs.create({
    defaultLayout: 'main',
    extname: "hbs",
    helpers: helpers,
    partialsDir: [
        'main',
        'views/partials/',
    ]
});


app.set('view engine', 'hbs');
app.engine('hbs', hbs.engine);
app.set('port', process.env.PORT || 3000);

app.set('view cache', false);
app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());

// 文件上传中间件。注意：
// 1. 名字一定为 "file", <input type="file" name="file">
// 2. method一定要为 post
app.use(multer({
    dest: "/tmp/upload"
}).single("file"));

app.use(function(req, res, next) {
    req.proxy = new proxy();
    req.proxy.req = req;
    next();
});

app.use(function(req, res, next) {
    req.proxy.request({
        method: "GET",
        url: "http://api.inner.utuotu.com/v1/schoolinfo/getschoolbase.action",
        qs: req.query
    }, function(err, response, body) {
        console.log(req.headers);
        console.log(body);
      var data = JSON.parse(body);
      if (!res.locals.partials) {
        res.locals.partials = {}
      }
      res.locals.partials.schooldetail = data.data;
      res.locals.partials.schoolid = req.query.sid;
      next();
    });
});

app.use(function(req, res, next) {
    req.proxy.request({
        method: "GET",
        url: "http://api.inner.utuotu.com/v1/user/cache.action",
        qs: req.query
    },function(err, response, body) {
        console.log(body)
      var  data = JSON.parse(body);
      if (!res.locals.partials) {
        res.locals.partials = {}
      }
      res.locals.partials.loginstate = data;
      next();
    });
    
});

//请求消息状态
app.use( function(req, res, next) {
    req.proxy.request({
        method: "GET",
        url: "http://api.inner.utuotu.com/v1/User/getmsgstatus.action",
        qs: req.query
    },function(err, response, body) {
        console.log(body);
        var  data = JSON.parse(body).data;
        if (!res.locals.partials) {
            res.locals.partials = {}
        }
        res.locals.partials.newsCount = data.count;
        res.locals.partials.systemState = data.system;
        res.locals.partials.userState = data.man;
        next();
    });
    
});

app.use('/', index); 

//前端可以通过node向服务器发送请求，格式规定：/v1/login/opencode.action
//前端也可以直接向PHP发送请求（本地服务器会出现跨域），格式规定：http://utuotu.com/v1/login/opencode.action
app.use(function(req, res, next) {
    var f = (/^(\/v1).*action$/).test(req.path);
    if (!f) {
        return;
    }
    req.proxy.request(null, function(err, response, body) {
        if (!!err) {
            next(err)
        } else {
            for (var key in response.headers) {
                res.set(key, response.headers[key])
            }
            // 1. 获取图片内容可能不是body，而是别的参数
            // 2. 读取body没有读取完
            try {
                body = JSON.parse(body)
            } catch(e) {
                // var fs = require("fs");
                // fs.writeFileSync("/tmp/hello.png", body)
                console.log(e);
            }
            res.send(body); 
        }
    });
});

// error handler
app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500)
    res.render('error');
});

app.listen(app.get('port'), function () {
    console.log('express-handlebars example server listening on:' + app.get('port'));
});
