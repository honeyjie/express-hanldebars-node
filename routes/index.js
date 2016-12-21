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

//渲染页面
router.get('/', function (req, res) {
    res.render("index");
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

//ajax请求
router.get("/login/try", function(req, res) {
    proxy.request("login/try", null, function(err, response, body) {
        res.send(JSON.parse(body));
    });
});

router.get("/login/image", function(req, res) {
    proxy.request("/login/image", null, function(err, response, body) {
        res.send(JSON.parse(body));
    });
});

router.get("/login/start", function(req, res) {
    proxy.request("l/ogin/start", null, function(err, response, body) {
        res.send(JSON.parse(body));
    });
});



router.post("/login/logout", function(req, res) {
    proxy.request("/login/logout", null, function(err, response, body) {
        res.send(JSON.parse(body));
    });
});

router.post("/login/validphone", function(req, res) {
    proxy.request("/login/validphone", null, function(err, response, body) {
        res.send(JSON.parse(body));
    });
});

router.post("/login/validmail", function(req, res) {
    proxy.request("/login/validmail", null, function(err, response, body) {
        res.send(JSON.parse(body));
    });
});

router.get("/login/opencode", function(req, res) {
    proxy.request("/login/opencode", null, function(err, response, body) {
        if (!!err) {
            res.send("server error")
            return;
        }
        res.send(JSON.parse(body));
        
    });
});
router.post("/login/login", function(req, res) {//name:liuyang; password: 6636562214
    proxy.request("/login/login", {method: "POST", form: {name: req.body.name, password: req.body.password}}, function(err, response, body) {
        if (!!err) {
            res.send("server error")
            return;
        }
        res.send(JSON.parse(body));
    });
});
router.post("/login/register", function(req, res) {
    proxy.request("/login/register", null, function(err, response, body) {
        res.send(JSON.parse(body));
    });
});

//全局API
router.get("/help/qiqiuauth", function(req, res) {
    proxy.request("/help/qiqiuauth", null, function(err, response, body) {
        if (!!err) {
            res.send("server error")
            return;
        }
        res.send(JSON.parse(body))
    });
});
router.get("/help/redirect", function(req, res) {
    proxy.request("/help/redirect", null, function(err, response, body) {
        if (!!err) {
            res.send("server error")
            return;
        }
        res.send(JSON.parse(body))
    });
});
router.get("/help/encode", function(req, res) {
    proxy.request("/help/encode", null, function(err, response, body) {
        if (!!err) {
            res.send("server error")
            return;
        }
        res.send(JSON.parse(body))
    });
});
router.get("/user/cache", function(req, res) {
    proxy.request("/user/cache", null, function(err, response, body) {
        if (!!err) {
            res.send("server error")
            return;
        }
        res.send(JSON.parse(body))
    });
});

//用户中心
router.get("/User/invitenum", function(req, res) {
    proxy.request("/User/invitenum", null, function(err, response, body) {
        if (!!err) {
            res.send("server error")
            return;
        }
        res.send(JSON.parse(body))
    });
});
router.get("/User/mission", function(req, res) {
    proxy.request("/User/mission", null, function(err, response, body) {
        if (!!err) {
            res.send("server error")
            return;
        }
        res.send(JSON.parse(body))
    });
});
router.post("/user/userinfo", function(req, res) {
    proxy.request("/user/userinfo", {method: "POST"}, function(err, response, body) {
        if (!!err) {
            res.send("server error")
            return;
        }
        res.send(JSON.parse(body))
    });
});
router.get("/sendvaildemail", function(req, res) {
    proxy.request("/sendvaildemail", null, function(err, response, body) {
        if (!!err) {
            res.send("server error")
            return;
        }
        res.send(JSON.parse(body))
    });
});
router.get("/User/user/isvalid", function(req, res) {
    proxy.request("/User/user/isvalid", null, function(err, response, body) {
        if (!!err) {
            res.send("server error")
            return;
        }
        res.send(JSON.parse(body))
    });
});
router.get("/User/delallmsg", function(req, res) {
    proxy.request("/User/delallmsg", null, function(err, response, body) {
        if (!!err) {
            res.send("server error")
            return;
        }
        res.send(JSON.parse(body))
    });
});
router.get("/msg/forget", function(req, res) {
    proxy.request("/msg/forget", null, function(err, response, body) {
        if (!!err) {
            res.send("server error")
            return;
        }
        res.send(JSON.parse(body))
    });
});
router.post("/User/saveuserbase", function(req, res) {
    proxy.request("/User/saveuserbase", {method: "POST", password: req.body.password}, function(err, response, body) {
        if (!!err) {
            res.send("server error")
            return;
        }
        res.send(JSON.parse(body))
    });
});
router.post("/User/saveuser", function(req, res) {
    proxy.request("/User/saveuser", {method: "POST"}, function(err, response, body) {
        if (!!err) {
            res.send("server error")
            return;
        }
        res.send(JSON.parse(body))
    });
});
router.get("/User/User/invite", function(req, res) {
    proxy.request("/User/User/invite", null, function(err, response, body) {
        if (!!err) {
            res.send("server error")
            return;
        }
        res.send(JSON.parse(body))
    });
});
router.get("/User/feedback", function(req, res) {
    proxy.request("/User/feedback", null, function(err, response, body) {
        if (!!err) {
            res.send("server error")
            return;
        }
        res.send(JSON.parse(body))
    });
});
router.get("/User/delmsg", function(req, res) {
    proxy.request("/User/delmsg", null, function(err, response, body) {
        if (!!err) {
            res.send("server error")
            return;
        }
        res.send(JSON.parse(body))
    });
});
router.get("/User/isread", function(req, res) {
    proxy.request("/User/isread", null, function(err, response, body) {
        if (!!err) {
            res.send("server error")
            return;
        }
        res.send(JSON.parse(body))
    });
});
router.get("/User/getsendmsg", function(req, res) {
    proxy.request("/User/getsendmsg", null, function(err, response, body) {
        if (!!err) {
            res.send("server error")
            return;
        }
        res.send(JSON.parse(body))
    });
});
router.get("/User/getmsg", function(req, res) {
    proxy.request("/User/getmsg", null, function(err, response, body) {
        if (!!err) {
            res.send("server error")
            return;
        }
        res.send(JSON.parse(body))
    });
});
router.get("/User/sendmsg", function(req, res) {
    proxy.request("/User/sendmsg", null, function(err, response, body) {
        if (!!err) {
            res.send("server error")
            return;
        }
        res.send(JSON.parse(body))
    });
});
router.get("/User/creditlog", function(req, res) {
    proxy.request("/User/creditlog", null, function(err, response, body) {
        if (!!err) {
            res.send("server error")
            return;
        }
        res.send(JSON.parse(body))
    });
});
router.get("/User/currnetcredit", function(req, res) {
    proxy.request("/User/currnetcredit", null, function(err, response, body) {
        if (!!err) {
            res.send("server error")
            return;
        }
        res.send(JSON.parse(body))
    });
});

//院校库
router.get("/schoolmajor/filterschool", function(req, res) {
    proxy.request("/schoolmajor/filterschool", null, function(err, response, body) {
        if (!!err) {
            res.send("server error")
            return;
        }
        res.send(JSON.parse(body))
    });
});
router.get("schoolmajor/searchschool", function(req, res) {
    proxy.request("schoolmajor/searchschool", null, function(err, response, body) {
        if (!!err) {
            res.send("server error")
            return;
        }
        res.send(JSON.parse(body))
    });
});

//智能选校
router.get("/completeform/intelligentselection", function(req, res) {
    proxy.request("/completeform/intelligentselection", null, function(err, response, body) {
        if (!!err) {
            res.send("server error")
            return;
        }
        res.send(JSON.parse(body))
    });
});
router.get("/schoolmajor/getrank", function(req, res) {
    proxy.request("/schoolmajor/getrank", null, function(err, response, body) {
        if (!!err) {
            res.send("server error")
            return;
        }
        res.send(JSON.parse(body))
    });
});
router.get("/schoolmajor/historyoffer", function(req, res) {
    proxy.request("/schoolmajor/historyoffer", null, function(err, response, body) {
        if (!!err) {
            res.send("server error")
            return;
        }
        res.send(JSON.parse(body))
    });
});
router.post("/completeform/saveform", function(req, res) {
    proxy.request("/completeform/saveform", {method: "POST"}, function(err, response, body) {
        if (!!err) {
            res.send("server error")
            return;
        }
        res.send(JSON.parse(body))
    });
});
router.get("/completeform/form", function(req, res) {
    proxy.request("/completeform/form", null, function(err, response, body) {
        if (!!err) {
            res.send("server error")
            return;
        }
        res.send(JSON.parse(body))
    });
});
router.post("/completeform/form", function(req, res) {
    proxy.request("/completeform/form", {method: "POST"}, function(err, response, body) {
        if (!!err) {
            res.send("server error")
            return;
        }
        res.send(JSON.parse(body))
    });
});
router.post("/completeform/chinaschool", function(req, res) {
    proxy.request("/completeform/chinaschool", {method: "POST"}, function(err, response, body) {
        if (!!err) {
            res.send("server error")
            return;
        }
        res.send(JSON.parse(body))
    });
});

//院校详情
router.get("/SchoolInfo/add_group", function(req, res) {
    proxy.request("/SchoolInfo/add_group", null, function(err, response, body) {
        if (!!err) {
            res.send("server error")
            return;
        }
        res.send(JSON.parse(body))
    });
});
router.get("/schoolinfo/getschoolmajorinfo", function(req, res) {
    proxy.request("/schoolinfo/getschoolmajorinfo", null, function(err, response, body) {
        if (!!err) {
            res.send("server error")
            return;
        }
        res.send(JSON.parse(body))
    });
});
router.get("/schoolinfo/getallschoolmajor", function(req, res) {
    proxy.request("/schoolinfo/getallschoolmajor", null, function(err, response, body) {
        if (!!err) {
            res.send("server error")
            return;
        }
        res.send(JSON.parse(body))
    });
});
router.get("/schoolinfo/getschoolbase", function(req, res) {
    proxy.request("/schoolinfo/getschoolbase", null, function(err, response, body) {
        if (!!err) {
            res.send("server error")
            return;
        }
        res.send(JSON.parse(body))
    });
});
module.exports = router
