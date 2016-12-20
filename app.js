var express = require('express');
var path = require('path');
var index = require('./routes/index');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs  = require('express-handlebars');

var app = express();

//设置视图位置
app.set('views', path.join(__dirname, 'views'));
var hbs = exphbs.create({
    defaultLayout: 'main',
    extname:      "hbs",
    partialsDir: [
        'shared/templates/',
        'views/partials/'
    ]
});

app.set('view engine', 'hbs');
app.engine('hbs', hbs.engine);
app.set('port', process.env.PORT || 3000);

app.use(express.static(path.join(__dirname, 'public')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


app.use('/', index);

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  console.log(err)
  res.render('error.hbs');
});

app.listen(app.get('port'), function () {
  console.log('express-handlebars example server listening on:' + app.get('port'));
});
