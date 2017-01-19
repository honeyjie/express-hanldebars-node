define(['jquery','base','iscroll'],function(jquery,base,iscroll){
    var scroll = [];
    var imageFieldName;
        //关闭所有弹出层
        $(document).on('click',function(){
            //关闭搜索
            closeSearch();
            //关闭登录
            if($('.login')[0]&&!$('.login').hasClass('hidden')){
                closeLogin();
            }
            //关闭下拉
            $('.form-select').removeClass('focus');
            $('.form-select-option').addClass('hidden');
            //关闭弹窗
            if($('.point-view')[0]&&!$('.point-view').hasClass('hidden')){
                 base.closeAll.closePointView();
            }
            //关闭消息
            if($('.news-article')[0]&&!$('.news-article').hasClass('hidden')){
                base.closeAll.closeNewsArticle();
            }
            //关闭删除
            if($('.select-form-view')[0]&&!$('.select-form-view').hasClass('hidden')){
                base.closeAll.closeSelectView();
            }
            //关闭帮助
            if($('.help')[0]&&!$('.help').hasClass('hidden')){
                base.closeAll.closeHelp();
            }
        });
        //点击浮层关闭
        $('.mask').on('click',function(e){
            e.stopPropagation();
            //关闭文章
            if($('.view-article')[0]&&!$('.view-article').hasClass('hidden')){
                closeArticle();
            }
            //关闭积分详情
            if($('.point-list')[0]&&!$('.point-list').hasClass('hidden')){
                base.closeAll.closePointList();
            }
            //关闭选校样例
            if($('.select-form-view')[0]&&!$('.select-form-view').hasClass('hidden')){
                base.closeAll.closeSelectView();
            }
        });
        //模拟滚动条
        scroll[2] = new iscroll('#view-article-scroll',{
            mouseWheel : true,
            scrollbars : true,
            interactiveScrollbars : true
        });
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
        //打开站内搜索
        $('.header-search-icon').on('click',function(e){
            e.stopPropagation();
            openSearch();
        });
        //搜索输入
        $('.header-search input').on('input propertychange',function(){
            var searchVal = $(this).val();
            search(searchVal);
            console.log(searchVal)
            setTimeout(function() {
                $('.searchmore').attr('href', '/school-screen?value='+ searchVal + '&page=0'); 
                console.log($('.searchmore'), $('.searchmore').attr('href'));
            }, 500);

            //跳转到school-screen 页面，将选中值填入，并搜索
   
        });



        // $('.screen-side-form-search').on('click',function(){
        //     var school = $('.screen-form-school').val();
        //     searchSchool(school);
        // });

        //搜索框阻止冒泡
        $('.header-search').on('click',function(e){
            e.stopPropagation();
        });
        //打开文章
        $('.header-search-result-article li').on('click',function(e){
            e.stopPropagation();
            openArticle();
        });
        //关闭文章
        $('.view-article-close').on('click',function(e){
            e.stopPropagation();
            closeArticle();
        });

        //打开登录
        $('.header-user-login-title').on('click',function(e){
            e.stopPropagation();
            $('.login').removeClass('index');
            openLogin();
        });
        //切换登录方式
        $('.login-switch').on('click',function(e){
            e.stopPropagation();
            tabLogin($(this))
        });
        //登录方式提示
        $('.login-switch').on('mouseenter',function(){
           $('.login-switch-notice').fadeIn(200);
        });
        $('.login-switch').on('mouseleave',function(){
            $('.login-switch-notice').fadeOut(200);
        });
        //刷新验证码
        $('.login-captcha-refresh').on('click',function(){
            captchaStart();
        });
        //验证码验证
        // $('.login-captcha-pics').on('click','img',function( e, imageFiledName){
        //     console.log($(this).data('value'));
        //     captchaTry($(this).data('value'), imageFiledName);
        // });


        //登录
        $('.login').on('click',function(e){
            e.stopPropagation();
        });
        //判断登录按钮
        $('.login-box input').on('input propertychange',function(){
            if(!$('.login-username').val()||!$('.login-password').val()){
                $('.login-submit').removeClass('button-solid').addClass('button-solid-ban');
                return;
            }
            $('.login-submit').removeClass('button-solid-ban').addClass('button-solid');
        });
        $('.login-submit').on('click',function(e){
            e.stopPropagation();
            login();
        });

        $('.login-submit').on('keydown', function(e) {
            if (e.witch === 13) {
                $(this).trigger('click');
                 console.log("111")
            }
        })
        //退出登录
        $('.header-user-logout').on('click',function(e){
            e.stopPropagation();
            logout();
        });

    function openSearch(){
        $('.header-search-icon').fadeOut(200);
        $('.header-search input').fadeIn(200);
        $('.header-search input')[0].focus();
    }

    function closeSearch(){
        $('.header-search input').val('');
        $('.header-search-icon').fadeIn(200);
        $('.header-search input').fadeOut(200);
        $('.header-search-result').fadeOut(200);
    }

    function search(val){
        if(!$('.header-search input').val()){
            $('.header-search-result').fadeOut(200);
        }
        else{
            $.ajax({
                url:'/Help/search.action',
                data:{
                    value : val
                },
                type:'get',
                cache:false,
                dataType:'html',
                success:function(data){
                    $('.header-search-result').html(data);
                    console.log(data);
                    //模拟滚动条
                    scroll[0] =  new iscroll('#search-scroll',{
                        mouseWheel : true,
                        scrollbars : true,
                        interactiveScrollbars : true
                    });
                },
                error : function() {
                    base.notice('网络错误');
                }
            });
            $('.header-search-result').fadeIn(200);
        }
    }

    function openArticle(){
        closeSearch();
        base.openMask();
        $('.view-article').removeClass('hidden').addClass('animated fadeInDown').one(base.animationend,function(){
            scroll[2].refresh();
            $('.view-article').removeClass('animated fadeInDown');
        });
    }
    function closeArticle(){
        base.closeMask()
        $('.view-article').addClass('animated fadeOutUp').one(base.animationend,function(){
            $('.view-article').removeClass('animated fadeOutUp').addClass('hidden');
        });
    }
    //打开登录
    function openLogin(){
        $.get('/login/opencode.action', {urlpath: window.location.pathname + window.location.search }, function(res){
            var obj = new WxLogin({
                id: "login_container",
                appid: res.data.appid,
                scope: res.data.scope,
                redirect_uri: encodeURIComponent(res.data.redirect_uri),
                state: res.data.state,
                style: "black",
                href: "https://www.utuotu.com/css/wechat.css"
            });
        });
        $('.login').removeClass('hidden').addClass('animated fadeInDown').one(base.animationend,function(){
            $('.login').removeClass('animated fadeInDown');
        });
    }
    //关闭登录
    function closeLogin(){
        $('.app').removeClass('filter');
        $('.index-mask').addClass('hidden');
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
                    // $('.header-user-info-avatar').attr('src',base.userInfo.headerImg);
                    // $('.header-user-login').addClass('hidden');
                    // $('.header-user-info').removeClass('hidden');
                }
                else if(data.code==111001006){
                    base.userInfo = {};
                    base.userInfo.login = false;
                    // $('.header-user-info').addClass('hidden');
                    // $('.header-user-login').removeClass('hidden');
                }
                $('.impowerBox .title').remove();
            },
            error : function() {
                base.notice('网络错误');
            }
        });
    }
    //验证码start
    function captchaStart(){
        $('.login-captcha').removeClass('hidden');
        $('.login-captcha-success').addClass('hidden');
        $('.login-captcha-fail').addClass('hidden');
        $.ajax({
            url:'/captcha/start.action',
            type:'get',
            cache:false,
            dataType:'json',
            success:function(data){
                $('.login-captcha-title span').html(data.data.imageName);
                imageFieldName = data.data.imageFieldName
                var dom = '';
   
                for(var i=0;i<5;i++){
                    dom += '<img data-value="' + data.data.values[i] + '" src="/captcha/image.action?index=' + i + '&_=' + Math.random() + '"/>';
                }
                $('.login-captcha-pics').html(dom);
                $('.login-captcha-pics img').click( imageFieldName, function(e) {
                    e.preventDefault();
                    var answer = $(this).data('value');
                    captchaTry(answer, imageFieldName)
                });
            },
            error : function() {
                base.notice('网络错误');
            }
        });
    }
    //验证码try
    function captchaTry(ans, FiledName){
        $.ajax({
            url:'/captcha/try.action',
            data: {
                field: FiledName,
                answer: ans
            },
            type:'get',
            cache:false,
            dataType:'json',
            success:function(data){
                if(data.data.valid){
                    $('.login-captcha-success').removeClass('hidden');  //成功
                }
                else{
                    $('.login-captcha-fail').removeClass('hidden');  //失败
                    captchaStart();
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
                console.log(data.code)
                if(data.code==0){
                    if(data.data.headerImg){
                        //成功登陆后记录用户信息
                        userInfo();
                        window.location.href = "/";
                    }

                }else if(data.code==111001004){
                    $('.login-message').removeClass('hidden').html('用户名不存在');
                    if(!$('.login-captcha').hasClass('hidden')){
                        captchaStart();
                    }
                }else if(data.code==111001005){
                    $('.login-message').removeClass('hidden').html('密码错误');
                    if(data.data.valid){
                        captchaStart();
                    }
                    if(!$('.login-captcha').hasClass('hidden')){
                        captchaStart();
                    }
                }else if(data.code==111001010){
                    //验证失败
                    $('.login-message').removeClass('hidden').html('请点击图标进行验证');
                    captchaStart();
                }else{
                    console.log('登陆出错');
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
                    window.location.href = "/";
                }
            },
            error : function() {
                base.notice('网络错误');
            }
        });
    }

    function openIndexLogin(){
        $('.app').addClass('filter');
        $('.index-mask').removeClass('hidden');
        $('.login').addClass('index');
        openLogin();
    }
    return {
        openLogin : openLogin,
        closeLogin : closeLogin,
        openIndexLogin: openIndexLogin
    }
});