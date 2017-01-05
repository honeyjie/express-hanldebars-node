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
  //系统消息
  //个人消息
  //utuotu.com/v1/User/getmsg.action
    //   console.log("1")
    // console.log(req.query)
    // console.log("2")
  req.proxy.request({
      method: "GET",
      url: "http://www.utuotu.com/v1/User/getmsg.action",
      qs: req.query
  }, function(err, response, body) {
    // console.log("1")
    console.log(body)

      var getmsg = JSON.parse(body);
         // console.log("2")
    // console.log(getmsg.data[0].read)
    // console.log(!!(getmsg.data[0].read))
                // console.log(getmsg);
        res.render('user-news', {
          getmsg: getmsg
        })
  })
});

router.get('/user-point', function(req, res, next) {
  var currnetcredit,
      creditlog,
      mission,
      invitenum;
    req.proxy.request({
        method: "GET",
        url: "http://www.utuotu.com/v1/User/currnetcredit.action",
        qs: req.query
    }, function(err, response, body) {
        currnetcredit = JSON.parse(body);
        return currnetcredit;
    })
    req.proxy.request({
        method: "GET",
        url: "http://www.utuotu.com/v1/User/creditlog.action",
        qs: req.query
    }, function(err, response, body) {
        creditlog = JSON.parse(body);
        return creditlog;
    })
    req.proxy.request({
        method: "GET",
        url: "http://www.utuotu.com/v1/User/mission.action",
        qs: req.query
    }, function(err, response, body) {
        mission = JSON.parse(body);
        return mission;

    })
    req.proxy.request({
        method: "GET",
        url: "http://www.utuotu.com/v1/User/invitenum.action",
        qs: req.query
    }, function(err, response, body) {
          invitenum = JSON.parse(body);
          setTimeout(function(res) {//异步执行，传递参数
            res.render('user-point', {
              currnetcredit: currnetcredit,
              creditlog: creditlog,
              mission: mission,
              invitenum: invitenum
        })
      },1000, res)
    })
});

//查看
router.get('/v1/User/msganswer.action', function(req, res, next) {
  req.proxy.request({
      method: "GET",
      url: "http://www.utuotu.com/v1/User/msganswer.action",
      qs: req.query
  }, function(err, response, body) {
      var getmsg = JSON.parse(body);
        res.render('partials/msganswer', {
          data: getmsg.data,
          layout: "naked"
        })
  })
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
      var major, sid;
      res.render('school-all', {
        data: data.data,
        sid: req.query.sid,
        allmajors: true
        });
  });
});
// router.get('/school-majorlist', function(req, res, next) {
//   req.proxy.request({method: "GET", url: "http://www.utuotu.com/v1/schoolinfo/getallschoolmajor.action"}, function(err, response, body) {
//       var data = JSON.parse(body);
//       var major, sid;
//       console.log(data);
//       res.render('school-all', {
//         data: data.data,
//         sid: req.query.sid,
//         allmajors: false,
//         help: function(academy) {
//           for (var i in data.data.majors) {
//             if (academy == data.data.majors[i].academy) {
//                 return '{{#each data.majors[i].major}}'+
//                             '<li class="all-list-type">{{@key}}</li>'+
//                                 '{{#each this}}'+
//                                   '<li><a href="/school-major?sid={{@root.sid}}&mid={{major_id}}">{{major_name}}</a></li>'+
//                                 '{{/each}}'+       
//                       '{{/each}}'
//             }
//           }
//         }
//         });
//   });
// });
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
router.get('/select-form', function(req, res) {
    res.render('select-form')
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

//填写学校
router.post("/v1/completeform/chinaschool.action", function(req, res) {
    req.proxy.request({
        method: "POST",
        url: "http://www.utuotu.com/v1/completeform/chinaschool.action",
    }, function(err, response, body) {
      // console.log(req.params);
      // console.log(body);
        var data = JSON.parse(body);
        if (!data) {
            return
        }
        res.render('partials/school-list', {
            data: data.data,
            layout: "naked"
        });
    });
});

//填写专业
router.post("/v1/completeform/chinamajor.action", function(req, res) {
    req.proxy.request({
        method: "POST",
        url: "http://utuotu.com/v1/completeform/chinamajor.action",
    }, function(err, response, body) {
      // console.log(req.params);
      // console.log(body);
        var data = JSON.parse(body);
        if (!data) {
            return
        }
        res.render('partials/major-list', {
            data: data.data,
            layout: "naked"
        });
    });
});

router.post("/v1/completeform/saveform.action", function(req, res) {
    req.proxy.request({
        method: "POST",
        url: "http://utuotu.com/v1/completeform/saveform.action",
    }, function(err, response, body) {
      // console.log(req.query);
      // console.log(body);
      // token=&nation=&location=&pre_school=&pre_major=&pre_major2=&school_type=&major_only=&degree=&gpa=&language=&exam_score=&exchange=&science_experience=&recommend=&science_paper=&experience=&prize=&enter_date=
        // var data = JSON.parse(body);
        // if (!data) {
        //     return
        // }
        // res.render('select-school', {
        //     data: data
        // });
    });
});

router.get("/v1/completeform/saveform.action", function(req, res) {
    req.proxy.request({
        method: "GET",
        url: "http://utuotu.com/v1/completeform/form.action",
    }, function(err, response, body) {
      // console.log(req.query);
      // console.log(body);
      // token=&nation=&location=&pre_school=&pre_major=&pre_major2=&school_type=&major_only=&degree=&gpa=&language=&exam_score=&exchange=&science_experience=&recommend=&science_paper=&experience=&prize=&enter_date=
        // var data = JSON.parse(body);
        // if (!data) {
        //     return
        // }
        // res.render('select-school', {
        //     data: data
        // });
    });
});

module.exports = router;
