define(['jquery'],function(jquery){
    var userInfo = {}; //用户信息
        userInfo.login = false;     //是否登录
        userInfo.username = '';     //用户名
        userInfo.oldpassword = '';  //原密码
        userInfo.password = '';     //密码
        userInfo.repassword = '';   //重复密码
        userInfo.email = '';        //邮箱
        userInfo.phone = '';        //手机号
        userInfo.code = '';         //邀请码
        userInfo.school = '';       //学校
        userInfo.major = '';        //专业
        userInfo.grade = '';        //年级
        userInfo.country = '';      //地区
        userInfo.totalCredit = 3000;         //总积分

    //关闭所有弹窗
    var closeAll = {};
    //动画结束判断
    var animationend = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
    //inoput验证成功
    function testSuccess(dom){
        dom.removeClass('error');
        dom.parent('.form-item').find('.form-item-notice').fadeOut(200);
    }
    //input验证失败
    function testFail(dom,text){
        dom.addClass('error');
        if(text){
            dom.parent('.form-item').find('.form-item-notice span').html(text);
        }
        dom.parent('.form-item').find('.form-item-notice').fadeIn(200);
    }
    //检查用户名是否重复
    function testUsername(dom){
        $.ajax({
            url:'/v1/login/validname.action',
            data:{
                value : userInfo.username
            },
            type:'post',
            cache:false,
            dataType:'json',
            success:function(data){
                if(data.data.valid){
                    userInfo.username = '';
                    testFail(dom,'该用户名已注册');
                }
                else{
                    testSuccess(dom);
                }
                // if(!data.data.valid){
                //     testSuccess(dom);
                // }
                // else{
                //     userInfo.username = '';
                //     testFail(dom,'该用户名已注册');
                // }
            },
            error : function() {
                notice('网络错误');
            }
        });
    }
    //检查邮箱是否重复
    function testEmail(dom){
        $.ajax({
            url:'/v1/account/valid_email.action',
            data:{
                value : userInfo.email
            },
            type:'post',
            cache:false,
            dataType:'json',
            success:function(data){
                if(!data.data.valid){//返回true表示系统已存在，不可以被注册
                   testSuccess(dom);
                }
                else{
                    userInfo.email = '';
                    testFail(dom,'该邮箱已注册'); 
                }
            },
            error : function() {
                notice('网络错误');
            }
        });
    }



    //检查手机号是否重复
    function testPhone(dom){
        $.ajax({
            url:'/v1/login/validphone.action',
            data:{
                value : userInfo.phone
            },
            type:'post',
            cache:false,
            dataType:'json',
            success:function(data){
                console.log("手机验证成功" + data)
                if(data.valid){
                    userInfo.phone = '';
                    testFail(dom,'该手机号已注册'); 
                }
                else{
                    testSuccess(dom);
                }
            },
            error : function() {
                notice('网络错误');
            }
        });
    }
    //验证密码是否正确
    function testOldpassword(dom){
        $.ajax({
            url:'/v1/User/saveuserbase.action',
            data:{
                password : userInfo.oldpassword
            },
            type:'post',
            cache:false,
            dataType:'json',
            success:function(data){
                console.log(data);
                if(data.code === 0){
                    testSuccess(dom);
                }
                else{
                    userInfo.oldpassword = '';
                    testFail(dom,'密码不正确');
                }
            },
            error : function() {
                notice('网络错误');
            }
        });
    }

    //邮箱跳转
    function jumpEmail(email){
        var emailArr = email.split('@');
        var jumpLink;
        switch (emailArr[emailArr.length-1]){
            case 'sina.com':
                jumpLink = 'mail.sina.com.cn';
                break;
            case 'qq.com':
                jumpLink = 'mail.qq.com';
                break;
            case '163.com':
                jumpLink = 'email.163.com';
                break;
            case '126.com':
                jumpLink = 'email.163.com';
                break;
            case 'yeah.net':
                jumpLink = 'email.163.com';
                break;
            case 'sohu.com':
                jumpLink = 'mail.sohu.com';
                break;
            case 'gmail.com':
                jumpLink = 'www.gmail.com';
                break;
            case 'hotmail.com':
                jumpLink = 'www.outlook.com';
                break;
            case 'outlook.com':
                jumpLink = 'www.outlook.com';
                break;
            case 'live.com':
                jumpLink = 'www.outlook.com';
                break;
            case 'icloud.com':
                jumpLink = 'www.icloud.com';
                break;
            case 'me.com':
                jumpLink = 'www.icloud.com';
                break;
            case 'yahoo.com':
                jumpLink = 'mail.yahoo.com';
                break;
            default: 
                jumpLink = 'www.'+ emailArr[emailArr.length-1];
        }
        return 'http://'+jumpLink;
    }
    //显示消息
    function notice(content,cb){
        $('.notice').html(content);
        $('.notice').removeClass('hidden').addClass('animated fadeInDown').one(animationend,function(){
            $('.notice').removeClass('animated fadeInDown');
            setTimeout(function(){
                $('.notice').addClass('animated fadeOutUp').one(animationend,function(){
                    $('.notice').removeClass('animated fadeOutUp').addClass('hidden');
                    $('.notice').html('');
                    if(cb){
                        cb();
                    }
                });
            },2000);
        });
    }

    //显示消息
    function noticeShort(content,cb){
        $('.notice').html(content);
        $('.notice').removeClass('hidden').addClass('animated fadeInDown').one(animationend,function(){
            $('.notice').removeClass('animated fadeInDown');
            setTimeout(function(){
                $('.notice').addClass('animated fadeOutUp').one(animationend,function(){
                    $('.notice').removeClass('animated fadeOutUp').addClass('hidden');
                    $('.notice').html('');
                    if(cb){
                        cb();
                    }
                });
            },200);
        });
    }


    //打开遮罩层
    function openMask(){
        $('.mask').removeClass('hidden').addClass('animated fadeIn').one(animationend,function(){
            $('.mask').removeClass('animated fadeIn');
        });
    }
    //关闭遮罩层
    function closeMask(){
        $('.mask').addClass('animated fadeOut').one(animationend,function(){
            $('.mask').removeClass('animated fadeOut').addClass('hidden');
        });
    }


    //发送验证邮件
    function sendTestEmail(){
        $.ajax({
            url:'/v1/user/sendvaildemail.action',
            data:{

            },
            type:'get',
            cache:false,
            dataType:'json',
            success:function(data){
                console.log("发送邮件成功：" + data);
                if(data.code==0){
                    console.log("发送邮件成功编码" + data.code);
                    notice('已向'+ userInfo.email+'发送了一封验证邮件，请查收');
                }
            },
            error : function() {
                notice('网络错误');
            }
        });
    }
    //jquery方法扩展
    $.fn.extend({
        testInput:function(config){
            if(config.rule.test($(this).val())){
                config.success($(this));
            }
            else{
                config.fail($(this));
            }
        },
        tab:function(cb1,cb2){
            var tab = $(this);
            var title = tab.find('.tab-title li');
            var box = tab.find('.tab-box');
            title.on('click',function(){
                console.log($(this));
                if ($(this).hasClass('none')) {
                    return;
                }
                var n = $(this).index();
                title.removeClass('active');
                $(this).addClass('active');
                box.addClass('hidden');
                box.eq(n).removeClass('hidden');
                if(n==0){
                    if(cb1){
                        cb1();
                    }
                }
                else if(n==1){
                    if(cb2){
                        cb2();
                    }
                }
            })
        },
        select:function(scroll){
            var select = $(this);
            var value = $(this).find('.form-select-value');
            var option = $(this).find('.form-select-option');
            select.on('click',function(e){
                e.stopPropagation();
                $('.form-select-option').addClass('hidden');
                console.log(option.find('li').length);
                if(option.hasClass('hidden') && option.find('li').length){
                    select.addClass('focus');
                    option.removeClass('hidden');
                    if(scroll){
                        scroll.refresh();
                    }
                }
                else{
                    select.removeClass('focus');
                    option.addClass('hidden');
                }
            });
            option.find('li').on('click',function(e){
                e.stopPropagation();
                value.html($(this).html());
                $('.form-select-option').addClass('hidden');
                $('.form-select').removeClass('focus');
            });
        },
        radio:function(){
            $(this).find('.form-radio').on('click',function(){
                $(this).parents('.form-item').find('.form-radio').removeClass('selected');
                $(this).addClass('selected');
            });
        },
        check:function(){
            _this = $(this);
            _this.find('.form-check').on('click',function(){
                if($(this).hasClass('selected')){
                    $(this).removeClass('selected');
                }
                else{
                    $(this).addClass('selected');
                }
            })
        }
    });
    return {
        userInfo : userInfo,
        closeAll : closeAll,
        animationend : animationend,
        usernameRule : /^[0-9a-zA-Z]{3,}$/,   //用户名正则
        // passwordRule : /^(?![a-zA-Z]+$)(?![a-z\d]+$)(?![A-Z\d]+$)(?![!#$%^&*]+$)(?![!#$%^&*\d]+$)(?![!#$%^&*\da-z]+$)(?![!#$%^&*\dA-Z]+$)[\da-zA-Z!#$%^&*]{8,}$/, //密码正则
        passwordRule : /^(?![a-zA-Z]+$)(?![a-z\d]+$)(?![A-Z\d]+$)(?![!#$%^&.?*@]+$)(?![!#$%^&*@.?\d]+$)(?![!#$%^&*@.?\da-z]+$)(?![!#$%^&*@.?\dA-Z]+$)[\da-zA-Z!#$%^&*@.?]{8,}$/, //密码正则
        // passwordRule: /^([\w]?.?[A-Z]+[\w]?.?[a-z]+[\w]?.?[\d]+[\w]?.?){8}$/
        emailRule : /^[\w\.\_\-]+@(\w-?)+(\.\w{2,})$/, //邮箱正则
        phoneRule : /^(|1\d{10})$/,  //手机号正则
        codeRule : /^(|[0-9a-zA-Z]{4})$/,  //邀请码正则
        isDouble: /^[0-9]+([.]{1}[0-9]{1,2})?$/ ,  //最多两位小数
        onlyFloat: /^([0-9][.]{1}[0-9]{1})?$/ ,  //只能一位小数
        isInt: /^[0-9]*[1-9][0-9]*$/ ,  //不能有小数
        isFloat:  /^[0-9]+([.]{1}[0-9]{1})?$/ ,  //最多一位小数
        testSuccess : testSuccess,
        testFail : testFail,
        testUsername : testUsername,
        testEmail : testEmail,
        testPhone : testPhone,
        testOldpassword : testOldpassword,
        jumpEmail : jumpEmail,
        notice : notice,
        noticeShort: noticeShort,
        openMask : openMask,
        closeMask : closeMask,
        sendTestEmail : sendTestEmail
    }
});