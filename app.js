var express = require('express');
var path = require('path');//路径
var favicon = require('serve-favicon');//图标
var logger = require('morgan');//日志
var cookieParser = require('cookie-parser');//cookie
var bodyParser = require('body-parser');//解析
var exphbs = require('express-handlebars');//模板
var request = require('request');//与服务器交换数据模块
var index = require('./routes/index');
var proxy = require("./proxy").proxy;
var newProxy = require('express-http-proxy');
var helpers = require('./lib/helpers');//模板中使用的帮助器函数
var errorhandler = require('errorhandler');//错误处理模块
var app = express();

//设置视图文件位置
app.set('views', path.join(__dirname, 'views'));

//设置模板,默认的布局,帮助器位置，局部文件位置
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

//设定端口
app.set('port', process.env.PORT || 8000);

//是否缓存，在开发环境下设置false
app.set('view cache', false);

//中间件
app.use(favicon(__dirname + '/public/img/favicon.ico'));//图标
app.use(express.static(path.join(__dirname, 'public')));//在每个静态文件请求前加上"public"，以便指向正确的地址
app.use(logger('dev'));//记录日志

//指定某种特征接口请求而非静态文件采用自动转发
// apps

app.use(bodyParser.json());//解析json
app.use(bodyParser.urlencoded({
    extended: false
}));

//拦截转发中携带头部信息的处理
app.use(function (req, res, next) {
    req.proxy = new proxy();
    req.proxy.req = req;
    next();
});

//全局变量
// app.use(function (req, res, next) {
//     request({
//         method: "GET",
//         url: "...",
//         qs: req.query
//     }, function (err, response, body) {
//         var data = body;
//         try {
//             data = JSON.parse(body);
//         } catch (e) {
//             next(e)
//         }

//         if (!res.locals.partials) {
//             res.locals.partials = {}
//         }
//         res.locals.partials.schooldetail = data.data;
//         res.locals.partials.schoolid = req.query.sid;
//         next();
//     });
// });

app.use('/', index);

// app.use(function (err, req, res, next) {
//     res.render('error', {
//         err: err,
//         url: req.originalUrl
//     });

// })

//监听端口
app.listen(app.get('port'), function () {
    console.log('express-handlebars example server listening on:' + app.get('port'));
});

