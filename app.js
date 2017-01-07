var express = require('express');
var path = require('path');
var url = require('url');
var index = require('./routes/index');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs  = require('express-handlebars');
var proxy = require("./proxy").proxy;
var request = require('request');
var app = express();
var helpers = require('./lib/helpers');
var Promise = global.Promise || require('promise');

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

app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(function(req, res, next) {
    req.proxy = new proxy();
    req.proxy.req = req;
    next();
});


app.use(function(req, res, next) {
    req.proxy.request({
        method: "GET",
        url: "http://www.utuotu.com/v1/schoolinfo/getschoolbase.action",
        qs: req.query
    }, function(err, response, body) {
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
        url: "http://www.utuotu.com/v1/user/cache.action",
        qs: req.query
    },function(err, response, body) {
      var  data = JSON.parse(body);
      if (!res.locals.partials) {
        res.locals.partials = {}
      }
      res.locals.partials.loginstate = data;
      next();
    });
    
});
app.use(function(req, res, next) {
  var sys_state = false;
  var  user_state = false;

  req.proxy.request({
      method: "GET",
      url: "http://www.utuotu.com/v1/User/getmsgstatus.action"
  }, function(err, response, body) {
      var data = JSON.parse(body);
      if (!res.locals.partials) {
        res.locals.partials = {}
      }
    res.locals.partials.newsstate = data.data;
    next();
  }); 
})


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

            try {
                body = JSON.parse(body);
            } catch(e) {
                console.log(e)
            }
            res.send(body)
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
