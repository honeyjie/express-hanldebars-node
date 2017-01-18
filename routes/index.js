'use strict';

var Promise = global.Promise || require('promise');

var express = require('express');
var app = express();
var router = express.Router();
var url = require('url');
var path = require('path');
var request = require('request')
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs  = require('express-handlebars');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(cookieParser());

var helpers = require('../lib/helpers');

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
router.get('/', function (req, res, next) {
    res.locals.partials.code = req.query.code;
    res.render('index', {
      show: true
    });
    next();
});

router.get('/testindex', function (req, res, next) {
  req.proxy.request({
      method: "GET",
      url: "http://www.utuotu.com/v1/Login/redicturl.action",
      qs: req.query
  }, function(err, response, body) {
      
      var data = JSON.parse(body);
      for (var key in response.headers) {
          res.set(key, response.headers[key])
      }
      if (data.code === 0) {
        //从cookie中获取微信图像和昵称
        if(!!data.data.login) {
            //已经注册
            res.redirect(req.cookies.wechatPath)
        }else {
            //未注册
            res.redirect('/register-complete?headImg='+ data.data.headImg +'&nickname='+data.data.nickname)
        }
      } else {
        res.render("testindex", {
            body: body
        })
      }
  })
    
});


//用户
router.get('/user-news', function(req, res, next) {
  var newsstate;
  req.proxy.request({
      method: "GET",
      url: "http://www.utuotu.com/v1/User/getmsgstatus.action"
  }, function(err, response, body) {
      var data = JSON.parse(body);
      newsstate = data.data;
  }); 

  req.proxy.request({
      method: "GET",
      qs: {system: req.query.system},
      url: "http://www.utuotu.com/v1/User/getmsg.action"
  }, function(err, response, body) {
      var getmsg = JSON.parse(body);
      console.log(getmsg, newsstate, "_______", getmsg.data.page.page_count, !!getmsg.data.page.page_count);

      var urlPath = url.parse(req.url).path;
      var query = url.parse(req.url).query;

      if (!query) {
        urlPath = urlPath + "?page="
      } else {
        var query = query.page;
        if (!query) {
          urlPath = urlPath + "?page="
        }
      }
      setTimeout(function(res) {
        res.render('user-news', {
                data: getmsg.data,
                system: req.query.system,
                urlPath :urlPath,
                newsstate: newsstate,
                usernews:true
              })
      }, 500, res);
  })
});

router.get('/user-point', function(req, res, next) {
  var currnetcredit,
      creditlog,
      mission,
      invitenum,
      inviteCode;
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
        creditlog = JSON.parse(body).data;
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
    //有效邀请
    req.proxy.request({
        method: "GET",
        url: "http://www.utuotu.com/v1/User/invite.action",
        qs: req.query
    }, function(err, response, body) {
        inviteCode = JSON.parse(body).data;
        return inviteCode;
    })


    req.proxy.request({
        method: "GET",
        url: "http://www.utuotu.com/v1/User/invitenum.action",
        qs: req.query
    }, function(err, response, body) {
          invitenum = JSON.parse(body);
          var urlPath = url.parse(req.url).path;
          var query = url.parse(req.url).query;

          if (!query) {
            urlPath = urlPath + "?page="
          }
          setTimeout(function(res) {//异步执行，传递参数
            res.render('user-point', {
              currnetcredit: currnetcredit,
              creditlog: creditlog,
              mission: mission,
              invitenum: invitenum,
              userpoint: true,
              inviteCode: inviteCode
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
      console.log(getmsg, data.data.list, "====")
        res.render('partials/msganswer', {
          data: getmsg.data,
          layout: "naked"
        })
  })
});

router.get('/user-set', function(req, res, next) {
  var data = "";
  var emailvalid = "";
    req.proxy.request({
        method: "get",
        url: "http://www.utuotu.com/v1/user/userinfo.action"
    }, function(err, response, body) {
        data = JSON.parse(body);
        console.log('http://www.utuotu.com/v1/user/userinfo.action', data)
        res.render('user-set', {
            data: data.data,
            userset: true
        });
    })
});

//注册
router.get('/register-complete', function(req, res, next) {
    res.render('register-complete', {
      headImg: req.query.headImg,
      nickname: req.query.nickname
    })
});

router.get('/register-forget', function(req, res, next) {
  res.render('register-forget')
});

router.get('/register-reset', function(req, res, next) {
    req.proxy.request({
        method: "get",
        url: "http://www.utuotu.com/v1/Msg/validforgetgetemail.action",
        qs: req.query
    }, function(err, response, body) {
        var data = JSON.parse(body);
        res.render('register-reset', {
          email: data.data.email
        });
    })
});

router.get('/register-test', function(req, res, next) {
  req.proxy.request({
    url: 'http://www.utuotu.com/v1/msg/validemail.action', 
    qs: req.query
  }, function(err, response, body) {
    console.log('http://www.utuotu.com/v1/msg/validemail.action', body);
    var data = JSON.parse(body);
    var success = false,
        done = false,
        invalid = false;

    if (data.code == 0) {

      success = true;
      console.log('http://www.utuotu.com/v1/msg/validemail.action', success)
    } else if (data.code === 111001007) {
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
    req.proxy.request('http://www.utuotu.com/v1/msg/validemail.action', function(err, response, body) {
      res.render('email-test', body);
   });
});

router.get('/school-all-partial', function(req, res, next) {
  req.proxy.request({method: "GET", url: "http://www.utuotu.com/v1/schoolinfo/getallschoolmajor.action"}, function(err, response, body) {
      var data = JSON.parse(body);
      var major, sid;
      res.render('partials/Inslibrary/school-all', {
        data: data.data,
        sid: req.query.sid,
        showAll: true, 
        layout: "naked" 
        });
  });
});

router.get('/school-academylist-partial', function(req, res, next) {
  req.proxy.request({method: "GET", url: "http://www.utuotu.com/v1/schoolinfo/getallschoolmajor.action"}, function(err, response, body) {
      var data = JSON.parse(body);
      var major, sid;
      res.render('partials/Inslibrary/school-academylist', {
        data: data.data,
        sid: req.query.sid,
        showAll: true, 
        layout: "naked" 
        });
  });
});

router.get('/school-majorlist-partial', function(req, res, next) {
  req.proxy.request({method: "GET", url: "http://www.utuotu.com/v1/schoolinfo/getallschoolmajor.action"}, function(err, response, body) {
      var data = JSON.parse(body);

      var major, sid;
      //取出对应学院的数据
      var academies = data.data.majors;
      var acMajors;
      var string = req.query.academy;
      for (var i in academies) {
        if (string == academies[i].academy ) {
          acMajors = academies[i].major;
          break;
        }
      }
      res.render('partials/Inslibrary/school-all', {
        data: data.data,
        isAcademy: true,
        acMajors: acMajors,
        sid: req.query.sid,
        showAll: false, 
        layout: "naked"
      });
  });
});


router.get('/school-screen', function (req, res) {
  //初始页面渲染, 模糊接口，给一个默认路径
    //将&page=3&置换
    req.proxy.request({
        method: "GET",
        url: "http://www.utuotu.com/v1/schoolmajor/searchschool.action",
        qs: req.query
    }, function(err, response, body) {
      var urlPath = url.parse(req.url).path;
      var query = url.parse(req.url).query;

      if (!query) {
        urlPath = urlPath + "?search=&page="
      }
        var data = JSON.parse(body);
        res.render('school-screen', {
            data: data.data,
            urlPath: urlPath
        });
    })
});

//sid=2439&mid=1791
router.get('/school-major-partial', function(req, res, next) {
    req.proxy.request({
        method: "GET",
        url: "http://www.utuotu.com/v1/schoolinfo/getschoolmajorinfo.action",
        qs: req.query
    }, function(err, response, body) {
        var data = JSON.parse(body);
        res.render('partials/Inslibrary/school-major', {
            data: data.data,
            sid: req.query.sid,
            layout: "naked",
            modifyMajor: true,
            majorDegree: req.query.majorDegree,
            mid: req.query.mid
        });
    });
});

router.get('/school-mjlist-partial', function(req, res, next) {
  //通过输入值和学校id,请求推荐专业接口
  //获得推荐专业的的mid信息后分别去请求相应的专业接口，将获取到的数字组成数组。
  // var majorList = {mid: [1, 2, 3], sid: 2446};
  // var dataList = []

  var majorList = []
  var dataList = [];
  var sid = req.query.sid;
    req.proxy.request({
        method: "GET",
        url: "http://www.utuotu.com/v1/schoolinfo/getrecommend.action",
        qs: req.query
    }, function(err, response, body) {
        var data = JSON.parse(body).data;
        var len = data.length;
        
        for(var i = 0; i < len; i++) {
          req.proxy.request({
              method: "GET",
              url: "http://www.utuotu.com/v1/schoolinfo/getschoolmajorinfo.action",
              qs: {sid: sid, mid: data[i].mid}
          }, function(err, response, body) {
              var result = JSON.parse(body).data;
              dataList.push(result);
          })
        }; 

        setTimeout(function() {
          res.render('partials/Inslibrary/school-majorlist', {
                dataList: dataList,
                sid: req.query.sid,
                layout: "naked",
                modifyMajor: true,
                value: req.query.value
          }) }, 1000) 
    });
        
});

router.get('/school-recommend-partial', function(req, res) {
    req.proxy.request({
        method: "GET",
        url: "http://www.utuotu.com/v1/schoolInfo/hot.action",
        qs: req.query
    }, function(err, response, body) {

        var data = JSON.parse(body);
        if (!data) {return}
        res.render('partials/Inslibrary/school-recommend', {
              data: data.data,
              total: data.data.Count.master + data.data.Count.doctor,
              sid: req.query.sid,
              button: true,
              layout: "naked"
        });
    });
});

//直接进入到推荐专业
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
    //请求推荐学校
    var schoollist;
    req.proxy.request({
        method: "GET",
        url: "http://www.utuotu.com/v1/completeform/intelligentselection.action",
    }, function(err, response, body) {
        schoollist = JSON.parse(body).data;
    });
    //请求图表
    setTimeout(function(res) {
      req.proxy.request({
          method: "GET",
          url: "http://www.utuotu.com/v1/Completeform/historyoffer.action"
      }, function(err, response, body) {
          var formResult = JSON.parse(body).data;
          res.render('select-school',{
            formResult: formResult,
            schoollist: schoollist
          })
      });
    }, 500, res)
    

    
});
router.get('/select-form', function(req, res) {
    var year =  (new Date()).getFullYear() + 1;
    res.render('select-form', {
      year: year
    })
});

router.get('/test', function(req, res) {
  res.render('test')
});

router.get("/schoolmajor/filterschool.action", function(req, res) {
    req.proxy.request({
        method: "GET",
        url: "http://www.utuotu.com/v1/schoolmajor/filterschool.action",
    }, function(err, response, body) {
        var data = JSON.parse(body);
        if (!data) {
            return
        }
        var urlPath = '/school-screen?search=&page=';
        res.render('partials/search-result', {
            data: data.data,
            layout: "naked",
            urlPath: urlPath
        });
    });
});
router.get("/schoolmajor/searchschool.action", function(req, res) {
    req.proxy.request({
        method: "GET",
        url: "http://www.utuotu.com/v1/schoolmajor/searchschool.action",
    }, function(err, response, body) {
        var data = JSON.parse(body);
        if (!data) {
            return
        }
        var urlPath = '/school-screen?search=&page=';
        res.render('partials/search-result', {
            data: data.data,
            urlPath: urlPath,
            layout: "naked"
        });
    });
});

//填写学校
router.post("/completeform/chinaschool.action", function(req, res) {
    req.proxy.request({
        method: "POST",
        url: "http://www.utuotu.com/v1/completeform/chinaschool.action",
    }, function(err, response, body) {
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
router.post("/completeform/chinamajor.action", function(req, res) {
    req.proxy.request({
        method: "POST",
        url: "http://www.utuotu.com/v1/completeform/chinamajor.action",
    }, function(err, response, body) {
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

router.get("/Help/search.action", function(req, res) {
    req.proxy.request({
        method: "GET",
        url: "http://www.utuotu.com/v1/Help/search.action",
    }, function(err, response, body) {
      var data = JSON.parse(body);
      res.render('partials/searchlist', {
            data: data.data,
            layout: "naked"
      });
    });
});

router.get("/refelink", function(req, res) {
    req.proxy.request({
        method: "GET",
        url: "http://www.utuotu.com/v1/help/redirect.action",
        qs: {url: req.query.hash}
    }, function(err, response, body) {

      var data = JSON.parse(body).data;
      res.redirect(data.url)
    });
});

// encoding: null 显示为buffer格式
router.get("/captcha/image.action", function(req, res) {
    req.proxy.request({
        encoding: null,
        method: "GET",
        url: "http://www.utuotu.com/v1/captcha/image.action",
        qs: req.query
    }, function(err, response, body) {
      res.send(body);
    });
});

//captcha/start.action
router.get("/captcha/start.action", function(req, res) {
    req.proxy.request({
        method: "GET",
        url: "http://www.utuotu.com/v1/captcha/start.action",
        qs: req.query
    }, function(err, response, body) {
      for (var key in response.headers) {
                res.set(key, response.headers[key])
            }
      var data = JSON.parse(body);
      res.send(data);
    });
});
//captcha/try.action
router.get("/captcha/try.action", function(req, res) {
    req.proxy.request({
        method: "GET",
        url: "http://www.utuotu.com/v1/captcha/try.action",
        qs: req.query
    }, function(err, response, body) {
      for (var key in response.headers) {
          res.set(key, response.headers[key])
      }
      var data = JSON.parse(body);
      res.send(data);
    });
});
//login/opencode.action
router.get("/login/opencode.action", function(req, res) {
    req.proxy.request({
        method: "GET",
        url: "http://www.utuotu.com/v1/login/opencode.action",
        qs: req.query
    }, function(err, response, body) {
      for (var key in response.headers) {
          res.set(key, response.headers[key])
      }
      var data = JSON.parse(body);
      if (!res.locals.storage) {
        res.locals.storage = {}
      }

      //保存用户当前页路径，通过前端获得
      res.cookie('wechatPath', req.query.urlpath);
      res.send(data);
    });
});
module.exports = router;