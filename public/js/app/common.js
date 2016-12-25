define(['jquery','base','iscroll'],function(jquery,base,iscroll){
    var scroll = [];
    // $('.header').load('header.html',function(){  //公共头部 测试用

    //     //userInfo();  获取用户信息

        //关闭所有弹出层
        $(document).on('click',function(){
            //关闭搜索
            closeSearch();
            //关闭登录
            if(!$('.login').hasClass('hidden')){
                closeLogin();
            }
            //关闭下拉
            $('.form-select').removeClass('focus');
            $('.form-select-option').addClass('hidden');
            //关闭弹窗
            if(!$('.point-view').hasClass('hidden')){
                base.closeAll.closePointView();
            }
            //关闭消息
            if(!$('.news-article').hasClass('hidden')){
                base.closeAll.closeNewsArticle();
            }
            //关闭删除
            if(!$('.news-delete').hasClass('hidden')){
                base.closeAll.closeNewsDelete();
            }
        });
        //点击浮层关闭
        $(document).on('click',function(e){
            e.stopPropagation();
            //关闭文章
            if(!$('.view-article').hasClass('hidden')){
                closeArticle();
            }
            //关闭积分详情
            if(!$('.point-list').hasClass('hidden')){
                base.closeAll.closePointList();
            }
        });
        //模拟滚动条
        scroll[0] =  new iscroll('#search-school',{
            mouseWheel : true,
            scrollbars : true
        });
        scroll[1] = new iscroll('#search-article',{
            mouseWheel : true,
            scrollbars : true
        });
        scroll[2] = new iscroll('#view-article-scroll',{
            mouseWheel : true,
            scrollbars : true
        });
        //验证码
        //var captcha = $('#sample-captcha').visualCaptcha({
        //    imgPath: 'img/',
        //    request:'xhrRequest',
        //    url:'http://utuotu.com',
        //    routes:{
        //        start:'/v1/captcha/start.action'
        //    },
        //    captcha: {
        //        numberOfImages: 5,
        //        callbacks: {
        //            loading: function( captcha ){
        //                console.log( 'I am loading.', captcha );
        //            },
        //            loaded: function( captcha ){
        //                console.log( 'I am loaded.', captcha );
        //            }
        //        }
        //    }
        //});
        //选校定位下拉列表
        $('.header-nav-school').on('mouseenter',function(){
            $('.header-nav-select').fadeIn(200);
        });
        $('.header-nav-school').on('mouseleave',function(){
            $('.header-nav-select').fadeOut(200);
        });
        //个人中心下拉列表
        $('.header-user-info').on('mouseenter',function(){
            $('.header-user-info-operation').fadeIn(200);
        });
        $('.header-user-info').on('mouseleave',function(){
            $('.header-user-info-operation').fadeOut(200);
        });
        //站内搜索
        $('.header-search-icon').on('click',function(e){
            e.stopPropagation();
            openSearch();
        });
        $('.header-search input').on('input propertychange',function(){
            search();
        });
        $('.header-search').on('click',function(e){
            e.stopPropagation();
        });
        //打开文章
        $('.header-search-result-article li').on('click',function(e){
            e.stopPropagation();
            openArticle();
        });
        $('.view-article-close').on('click',function(e){
            e.stopPropagation();
            closeArticle();
        });

        //注册登录
        $('.header-user-login-title').on('click',function(e){
            e.stopPropagation();
            $('.login').removeClass('index');
            base.openLogin();
            $.get('/v1/login/opencode.action', function(res) {
                console.log(res);
                var obj = new WxLogin({
                  id: "login_container",
                  appid: res.data.appid,
                  scope: res.data.scope,
                  redirect_uri: encodeURIComponent(res.data.redirect_uri),
                  state: res.data.state,
                  style: "black",
                  href: ""
                });
            })
        });
        $('.login-switch').on('click',function(e){
            e.stopPropagation();
            tabLogin($(this))
        });
        $('.login').on('click',function(e){
            e.stopPropagation();
        });
        //判断登录按钮
        $('.login-box input').on('input propertychange',function(){
            if(!$('.login-username').val()||!$('.login-password').val()){
                return;
            }
            $('.login-submit').removeClass('button-solid-ban').addClass('button-solid');
        });
        $('.login-submit').on('click',function(e){
            e.stopPropagation();
            login();
        });

        //退出登录
        $('.header-user-logout').on('click',function(e){
            e.stopPropagation();
            logout();
        })

    // });

    // $('.footer').load('footer.html');  //公共底部 测试用


    function openSearch(){
        $('.header-search-icon').fadeOut(200);
        $('.header-search input').fadeIn(200);
        $('.header-search input')[0].focus();
    }

    function closeSearch(){
        if($('.header').hasClass('index')){
            $('.header-search-icon2').fadeIn(200);
        }
        else{
            $('.header-search-icon1').fadeIn(200);
        }
        $('.header-search input').fadeOut(200);
        $('.header-search-result').fadeOut(200);
    }

    function search(){
        if(!$('.header-search input').val()){
            $('.header-search-result').fadeOut(200);
        }
        else{
            $('.header-search-result').fadeIn(200);
            scroll[0].refresh();
            scroll[1].refresh();
        }
    }

    function openArticle(){
        closeSearch();
        $('.mask').removeClass('hidden').addClass('animated fadeIn').one(base.animationend,function(){
            $('.mask').removeClass('animated fadeIn');
        });
        $('.view-article').removeClass('hidden').addClass('animated fadeInDown').one(base.animationend,function(){
            scroll[2].refresh();
            $('.view-article').removeClass('animated fadeInDown');
        });
    }

    function closeArticle(){
        $('.mask').addClass('animated fadeOut').one(base.animationend,function(){
            $('.mask').removeClass('animated fadeOut').addClass('hidden');
        });
        $('.view-article').addClass('animated fadeOutUp').one(base.animationend,function(){
            $('.view-article').removeClass('animated fadeOutUp').addClass('hidden');
        });
    }

    function closeLogin(){
        $('.login').addClass('animated fadeOutUp').one(base.animationend,function(){
            $('.login').removeClass('animated fadeOutUp index').addClass('hidden');
        });
    }

    function tabLogin(_this){
        $('.login-box').removeClass('hidden');
        _this.parents('.login-box').addClass('hidden');
    }
    //获取用户信息
    function userInfo(){
        $.ajax({
            url:'/v1/user/cache.action',
            data:{

            },
            type:'get',
            cache:false,
            dataType:'json',
            success:function(data){
                if(data.code==0){
                    base.userInfo.login = true;
                    base.userInfo.id = data.data.id;
                    base.userInfo.username = data.data.name;
                    base.userInfo.headerImg = data.data.headerImg;
                    $('.header-user-info-avatar').attr('src',base.userInfo.headerImg);
                    $('.header-user-login').addClass('hidden');
                    $('.header-user-info').removeClass('hidden');
                }
                else if(data.code==111001006){
                    base.userInfo = {};
                    base.userInfo.login = false;
                    $('.header-user-info').addClass('hidden');
                    $('.header-user-login').removeClass('hidden');
                }
            },
            error : function() {
                base.notice('网络错误');
            }
        });
    }

    //账号密码登录
    function login(){
        base.userInfo.username = $('.login-username').val();
        base.userInfo.password = $('.login-password').val();
        if(!base.userInfo.username){
            $('.login-message').removeClass('hidden').html('用户名不能为空');
            return;
        }
        if(!base.userInfo.password){
            $('.login-message').removeClass('hidden').html('密码不能为空');
            return;
        }
        $.ajax({
            url:'/v1/login/login.action',
            data:{
                name : base.userInfo.username,
                password : base.userInfo.password
            },
            type:'post',
            cache:false,
            dataType:'json',
            success:function(data){
                if(data.code==0){
                    if(data.data.headerImg){
                        userInfo();
                    }
                }
                else if(data.code==111001004){
                    $('.login-message').removeClass('hidden').html('data.data.msg');
                }
                else if(data.code==111001005){
                    $('.login-message').removeClass('hidden').html('data.data.msg');
                    if(data.data.valid){
                        //实例化验证码
                    }
                }
            },
            error : function() {
                base.notice('网络错误');
            }
        });
    }

    //退出登录
    function logout(){
        $.ajax({
            url:'/v1/login/logout.action',
            data:{

            },
            type:'get',
            cache:false,
            dataType:'json',
            success:function(data){
                if(data.code==0){
                    userInfo();
                }
            },
            error : function() {
                base.notice('网络错误');
            }
        });
    }

    return {

    }
});