define(['jquery','fullpage','iscroll','clipboard','base','common'],function(jquery,fullpage,iscroll,clipboard,base,common){
    var scroll = [];
    var canSend = true;
    var setTime;
    var pre_email = $('.set-form-email').val(),
        pre_phone = $('.set-form-phone').val(),
        pre_school = $('.set-form-school').val(),
        pre_major = $('.set-form-major').val(),
        pre_grade = $('.set-form-grade').val(),
        pre_country = $('.set-form-country').val(),
        pre_headering = $('.inputstyle').val();
    $(function(){
        //获取积分并初始化积分条
        // base.userInfo.credit = 0;; //测试数据
        // getCredit();
        creditLine();

        // 判断邮箱是否验证
        isTestEmail();

        // 获取邀请码
        // getCode();

        //模拟滚动条
        if($('#news-content')[0]){
            scroll[0] =  new iscroll('#news-content',{
                mouseWheel: true,
                scrollbars: true,
                interactiveScrollbars : true
            });
        }
        if($('#grade-option')[0]){
            scroll[1] =  new iscroll('#grade-option',{
                mouseWheel: true,
                scrollbars: true,
                interactiveScrollbars : true
            });
        }
        if($('#country-option')[0]){
            scroll[2] =  new iscroll('#country-option',{
                mouseWheel: true,
                scrollbars: true,
                interactiveScrollbars : true
            });
        }
        //tab切换
        $('.set-tab').tab();
        $('.news-tab').tab();

        //下拉
        $('.set-form-grade').select(scroll[1]);
        $('.set-form-country').select(scroll[2]);

        //邮箱验证
        //keyup时验证邮箱有效性
        // base.userInfo.email = 
        $('.set-form-email').on('blur',function(){
            $('.set-form-email').testInput({
                rule : base.emailRule,
                success : function(dom){
                    base.userInfo.email = dom.val();
                    if(base.userInfo.email !== pre_email) {
                        base.testEmail(dom);
                        clearInterval(setTime);
                        isTestEmail();
                        $('.set-form-send').text('验证') ;
                        $(this).addClass('warning');
                        canSend = true;
                        canSaveInfo();
                    }
                },
                fail : function(dom){
                    base.userInfo.email = '';
                    base.testFail(dom,'请输入有效的 Email 地址');
                }
            });
        });

        //发送验证邮件
        $('.set-form-send').on('click',function(){
            if(!base.userInfo.email && !pre_email) {
                return;
            }
            $(this).addClass('focus');
            $('.set-form-email').removeClass('warning');
            if(canSend) {
                base.sendTestEmail();
                canSend = false;
            }
            var time = 60;
            setTime = setInterval(function() {
                time = time -1;
                $('.set-form-send').text(time + '秒可重发'); 
                if (time <= 0) {
                    clearInterval(setTime);
                    $('.set-form-send').text('验证') ;
                    $(this).addClass('warning');
                    $(this).removeClass('focus');
                    canSend = true;  
                } 
            }, 1000) 

            
        });

        //手机号验证
        $('.set-form-phone').on('blur',function(){
            $('.set-form-phone').testInput({
                rule : base.phoneRule,
                success : function(dom){
                    base.userInfo.phone = dom.val();
                    if(base.userInfo.phone !== pre_phone) {
                        base.testPhone(dom);
                        canSaveInfo();
                    }
                },
                fail : function(dom){
                    base.userInfo.phone = '';
                    base.testFail(dom,'请输入有效的手机号');
                }
            });
        });

        //学校验证
        $('.set-form-school').on('blur',function(){
            base.userInfo.school = $('.set-form-school').val();
            if (base.userInfo.school !== pre_school) {
                canSaveInfo();
            }
        });

        //专业验证
        $('.set-form-major').on('blur',function(){
            base.userInfo.major = $('.set-form-major').val();
            if (base.userInfo.major !== pre_major) {
                canSaveInfo();
            }
        });

        //个人信息判断提交
        $('.set-form-info input').on('blur',function(){
            //表单失去焦点后判断，如果修改信息且符合判断，则显示保存按钮
            //当表单数据发生变化
            canSaveInfo();
        });
        $('.set-form-grade .form-select-option li').on('click',function(){
            base.userInfo.grade = $(this).html();
            if (base.userInfo.grade !== pre_grade) {
                canSaveInfo();
            } 
        });

        $('.set-form-country .form-select-option li').on('click',function(){
            base.userInfo.country = $(this).html();
            if (base.userInfo.country !== pre_country) {
                canSaveInfo();
            }
        });


        //将之前的信息保存下来，当所填内容符合格式，且不相同时，可以保存
        function canSaveInfo(){
            if(base.userInfo.email||base.userInfo.phone||base.userInfo.school||base.userInfo.major||base.userInfo.grade||base.userInfo.country){
                $('.set-info-save').removeClass('button-solid-ban').addClass('button-solid');
                return;
            }
            
            $('.set-info-save').removeClass('button-solid').addClass('button-solid-ban');
        };

        //保存个人信息
        $('.set-info-save').on('click',function(){
            saveInfo();
        });


        //原密码验证
        $('.set-form-oldpassword').on('blur',function(){
            $('.set-form-oldpassword').testInput({
                rule : base.passwordRule,
                success : function(dom){
                    base.userInfo.oldpassword = dom.val();
                    //验证密码是否正确，如果不正确则清空密码
                },
                fail : function(dom){
                    base.userInfo.oldpassword = '';
                    base.testFail(dom,'请输入8位以上密码且必须含有数字、小写及大写字母');
                }
            });
        });
        //密码验证
        $('.set-form-password').on('blur',function(){
            $('.set-form-password').testInput({
                rule : base.passwordRule,
                success : function(dom){
                    base.userInfo.password = dom.val();
                    if(base.userInfo.password === base.userInfo.oldpassword) {
                        base.testFail(dom,'新密码不能和原始密码相同');
                        return;
                    }
                    base.testSuccess(dom);
                },
                fail : function(dom){
                    base.userInfo.password = '';
                    base.testFail(dom,'请输入8位以上密码且必须含有数字、小写及大写字母');
                }
            });
        });
        //重复密码验证
        $('.set-form-repassword').on('blur',function(){
            var dom = $(this);
            if(!base.userInfo.password) {
                return;
            }

            if(dom.val() == base.userInfo.password){
                base.userInfo.repassword = dom.val();
                base.testSuccess(dom);
            }
            else{
                base.userInfo.repassword = '';
                base.testFail(dom,'密码不一致');
            }
        });

        //密码判断提交
        $('.set-tab-password input').on('blur',function(){
            if(!base.userInfo.oldpassword||!base.userInfo.password||!base.userInfo.repassword){
                $('.set-password-save').removeClass('button-solid').addClass('button-solid-ban');
                return;
            }
            $('.set-password-save').removeClass('button-solid-ban').addClass('button-solid');
        });

        $('.set-password-save').on('click',function(){
            if(!base.userInfo.oldpassword||!base.userInfo.password||!base.userInfo.repassword){
                return;
            }
            savePassword();
        });
        //弹窗阻止冒泡
        $('.point-view').on('click',function(e){
            e.stopPropagation();
        });
        //复制地址
        var link = new clipboard('[data-clipboard-link]');
        link.on('success',function(e){
            $('.point-view-title').html('链接地址');
            $('.point-result-code')[0].style.display = "none";
            $('.point-result-site')[0].style.display = "block";
            openPointView();
        });
        //复制邀请码
        var code = new clipboard('[data-clipboard-code]');
        code.on('success',function(e){
            $('.point-view-title').html('邀请码');
            $('.point-result-code').removeClass('hidden');
            $('.point-result-site').addClass('hidden');
            $('.point-result-site')[0].style.display = "none";
            $('.point-result-code')[0].style.display = "block";
            openPointView();
        });

        //关闭弹窗
        $('.point-view-close').on('click',function(e){
            e.stopPropagation();
            closePointView();
        });
        base.closeAll.closePointView = closePointView;
        //积分详情阻止冒泡
        $('.point-list').on('click',function(e){
            e.stopPropagation();
        });
        //打开积分详情
        $('.point-title a').on('click',function(e){
            e.stopPropagation();
            openPointList();
        });

        //关闭积分详情
        $('.point-list-close').on('click',function(e){
            e.stopPropagation();
            closePointList();
        });
        base.closeAll.closePointList = closePointList;

        //邀请朋友显示
        $('.point-title-share').on('mouseenter',function(){
            $('.point-share-notice').fadeIn(200);
        });
        //邀请朋友隐藏
        $('.point-title-share').on('mouseleave',function(){
            $('.point-share-notice').fadeOut(200);
        });

        //查看消息
        $('.news-list li a').on('click',function(e){
            e.stopPropagation();
            var msg_id = $(this).parent().attr('data-msg_id')
            isRead(msg_id, $(this).parent());
        });

        //单击查看
        $('.news-list li .news-operation a').on('click',function(e){
            e.stopPropagation();
            var msg_id = $(this).parent().parent().attr('data-msg_id')
            isRead(msg_id, $(this).parent().parent());
        });


        //标记全部已读
        $('.news-system-read').on('click', function(e) {
            e.stopPropagation();
            //1表示系统消息
            isAllread(1)
        })
        $('.news-user-read').on('click', function(e) {
            console.log("1");
            e.stopPropagation();
            //无参数表示个人消息
            isAllread(0)
        })

        //关闭消息
        $('.news-article-close').on('click',function(e){
            e.stopPropagation();
            closeNewsArticle();
        });
        base.closeAll.closeNewsArticle = closeNewsArticle;
        //删除弹窗阻止冒泡
        $('.news-delete').on('click',function(e){
            e.stopPropagation();
        });
        //打开删除
        $('.news-list-delete').on('click',function(e){
            e.stopPropagation();
            $('.news-delete-content p').html('是否删除此消息');
            var $parent = $(this).parent().parent();
            var msgid = $parent.attr('data-msg_id');
            openNewsDelete(msgid, $parent);
            
        });
        //删除系统消息
        $('.news-system-delete').on('click',function(e){
            e.stopPropagation();
            $('.news-delete-content p').html('是否清空系统消息？<br/><span>此删除不可恢复，请谨慎操作</span>');
            //1代表系统消息
            var list = $('.news-system-list')
            openNewsAllDelete(1, list);
           
        });
        //删除个人消息
        $('.news-user-delete').on('click',function(e){
            e.stopPropagation();
            $('.news-delete-content p').html('是否清空个人消息？<br/><span>此删除不可恢复，请谨慎操作</span>');
            //0代表个人消息
            var list = $('.news-user-list')
            openNewsAllDelete(0, list);
        });
        //关闭删除
        $('.news-delete-cancel').on('click',function(e){
            e.stopPropagation();
            closeNewsDelete();
        });
        $('.news-delete-close').on('click',function(e){
            e.stopPropagation();
            closeNewsDelete();
        });
        base.closeAll.closeNewsDelete = closeNewsDelete;

    });
    
    //标记全部已读
    function isAllread(sts) {
        $.ajax({
            url:'/v1/User/allread.action',
            data:{
                system: sts
            },
            type:'get',
            cache:false,
            dataType:'json',
            success:function(data) {
                if(sts) {
                    //系统消息
                    $('.news-system-list li').removeClass('noread');
                    $('.news-system-read').removeClass('button-hollow').addClass('button-hollow-ban');
    
                    //去掉tab红点
                    $('.sys-tab span').remove('news-system-notice');
                } else {
                    //个人消息
                    $('.news-user-list li').removeClass('noread');
                    $('.news-user-read').removeClass('button-hollow').addClass('button-hollow-ban')
                    //去掉tab红点
                    $('.user-tab span').removeClass('news-user-notice');
                }

                if (!$('.sys-tab span').hasClass('news-user-notice') && !$('.user-tab span').hasClass('news-user-notice')) {
                    $('.newsCenter').removeClass('header-news-number');
                }
            },
            error : function() {
                base.notice('网络错误');
            }
        });


    }

    function isRead(msg_id, dom) {
        $.ajax({
            url:'/v1/User/isread.action',
            data:{
                msgid: msg_id
            },
            type:'get',
            cache:false,
            dataType:'json',
            success:function(data) {
                if (dom.hasClass('noread')) {
                    var num = $('.header-news-number').html()*1;
                    if (num >=2) {
                       num = num -1; 
                   } else {
                        num = ""
                   }
                    
                   $('.header-news-number').html(num);
                }
                //当前全部消息都已读时
                canEveryCancel(dom)
                return;
            },
            error : function() {
                base.notice('网络错误');
            }
        });

        //当获取当消息类型小于2000时，打开弹窗
        var openNum = dom.attr('data-type_id');

        if (openNum < 20000) {
            var msg_id = dom.attr('data-msg_id');
            openNewsArticle(msg_id);
        }
    }

    function canEveryCancel(dom) {
        var sysCannotCancel = false;
        var userCannotCancel = false;
        if (!dom.hasClass('noread')) {
            return;
        }
        dom.removeClass('noread');

        if (dom.parent().hasClass('news-user-list')) {
            //个人消息，都已读时
            var lists = dom.parent().children('li');
            var list = Array.prototype.slice.call(lists)

            userCannotCancel = list.some(function(el, i, arr){//当每一个都返回真值时
                return $(el).hasClass('noread');
            })
            console.log(userCannotCancel);

            if(!userCannotCancel) {
                $('.news-user-read').removeClass('button-hollow').addClass('button-hollow-ban')
                //去掉tab红点
                $('.user-tab span').removeClass('news-user-notice');
            }

        } else if(dom.parent().hasClass('news-system-list')) {
            //系统消息，都已读时
            var lists = dom.parent().children('li');
            var list = Array.prototype.slice.call(lists)

            sysCannotCancel = list.some(function(i, el, arr){//当每一个都返回真值时
                return $(el).hasClass('noread')
            })

            if(!sysCannotCancel) {
                $('.news-system-read').removeClass('button-hollow').addClass('button-hollow-ban')
                //去掉tab红点
                $('.sys-tab span').removeClass('news-system-notice');
            }

        }

        console.log(sysCannotCancel, userCannotCancel)
        if (!sysCannotCancel && !userCannotCancel) {
            console.log("1");
            $('.newsCenter .header-news-tab').removeClass('header-news-number');
        }
    }
    //邮件是否验证
    function isTestEmail(){
        $.ajax({
            url:'/v1/user/isvalid.action',
            data:{

            },
            type:'get',
            cache:false,
            dataType:'json',
            success:function(data) {
                console.log("邮箱是否验证", data);
                if(data.code===111001013){
                    //未激活
                    $('.set-form-send').removeClass('hidden');
                    $('.set-form-email').addClass('warning');
                    base.userInfo.isValid = false;  
                    
                }
                else{
                    base.userInfo.isValid = true;
                }

            },
            error : function() {
                base.notice('网络错误');
            }
        });
    }

    //保存个人信息
    function saveInfo(){
        $.ajax({
            url:'/v1/User/saveuser.action',
            data:{
                email : base.userInfo.email || pre_email,
                phone : base.userInfo.phone || pre_phone,
                school : base.userInfo.school || pre_school,
                major : base.userInfo.major || pre_major,
                nianji : base.userInfo.grade || pre_grade,
                country : base.userInfo.country || pre_country,
                file : base.userInfo.headerimg || pre_headering
            },
            type:'post',
            cache:false,
            dataType:'json',
            success:function(data){
                if(data.code == 0){
                    base.notice('信息已保存');
                   $('.set-info-save').removeClass('button-solid').addClass('button-solid-ban'); 
                }
            },
            error : function() {
                base.notice('网络错误');
            }
        });
    }

    //保存密码
    function savePassword(){
        console.log(base.userInfo.password, base.userInfo.oldpassword);
        $.ajax({
            url:'/v1/User/saveuserbase.action',
            data:{
                password : base.userInfo.password,
                old_password: base.userInfo.oldpassword
            },
            type:'post',
            cache:false,
            dataType:'json',
            success:function(data){
                if(data.code === 0){
                    $('.set-password-save').removeClass('button-solid').addClass('button-solid-ban');
                    base.notice('信息已保存');
                }
            },
            error : function() {
                base.notice('网络错误');
            }
        });
    }

    // //获取用户积分 无需单独请求获取，当不为0时，会添加到html中
    // function getCredit(){
    //     creditLine();
    //     $.ajax({
    //        url:'/v1/User/currnetcredit.action',
    //        data:{
        
    //        },
    //        type:'get',
    //        cache:false,
    //        dataType:'json',
    //        success:function(data) {
    //            if(data.code==0){
    //                base.userInfo.credit = data.data.credit;  //base.userInfo.credit 积分
    //                creditLine();
    //            }
    //        },
    //        error : function() {
    //            base.notice('网络错误');
    //        }
    //     });
    // }
//初始化积分条
    
    function creditLine(){
        //渲染时将当前积分自动填充，仅当不为0时才显示
        base.userInfo.credit = $('.point-line-number2').html() || 0;
        // base.userInfo.totalCredit = $('.point-line-number3').html();
        var tw = $('.point-line').innerWidth();
        var nw = tw*base.userInfo.credit/base.userInfo.totalCredit;
        $('.point-line-now').css('width',nw);
        $('.point-line-arrow').css('left',nw);
        $('.point-line-number2').css('left',nw);
    }

//获取邀请码
    function getCode(){
        $.ajax({
            url:'/v1/User/invite.action',
            data:{

            },
            type:'get',
            cache:false,
            dataType:'json',
            success:function(data) {
                if(data.code==0){
                    base.userInfo.code = data.data.code;
                }
            },
            error : function() {
                base.notice('网络错误');
            }
        });
    }

//打开弹窗
    function openPointView(){
        $('.point-view').removeClass('hidden').addClass('animated fadeInDown').one(base.animationend,function(){
            $('.point-view').removeClass('animated fadeInDown');
        });
    }
//关闭弹窗
    function closePointView(){
        $('.point-view').addClass('animated fadeOutUp').one(base.animationend,function(){
            $('.point-view').removeClass('animated fadeOutUp').addClass('hidden');
        });
    }
//打开积分列表
    function openPointList(){
        $('.mask').removeClass('hidden').addClass('animated fadeIn').one(base.animationend,function(){
            $('.mask').removeClass('animated fadeIn');
        });
        $('.point-list').removeClass('hidden').addClass('animated fadeInDown').one(base.animationend,function(){
            $('.point-list').removeClass('animated fadeInDown');
        });
    }
//关闭积分列表
    function closePointList(){
        $('.mask').addClass('animated fadeOut').one(base.animationend,function(){
            $('.mask').removeClass('animated fadeOut').addClass('hidden');
        });
        $('.point-list').addClass('animated fadeOutUp').one(base.animationend,function(){
            $('.point-list').removeClass('animated fadeOutUp').addClass('hidden');
        });
    }
//打开消息
    function openNewsArticle(id){
        $('.news-article').removeClass('hidden').addClass('animated fadeInDown').one(base.animationend,function(){
            $('.news-article').removeClass('animated fadeInDown');
        });
        $.ajax({
            url:'/v1/User/msganswer.action',
            data:{
                msg_id: id
            },
            type:'get',
            cache:false,
            dataType:'html',
            success:function(data) {
                $('#msganswer').html(data);

            },
            error : function() {
                base.notice('网络错误');
            }
        });
    }
//关闭消息
    function closeNewsArticle(){
        $('.news-article').addClass('animated fadeOutUp').one(base.animationend,function(){
            $('.news-article').removeClass('animated fadeOutUp').addClass('hidden');
        });
    }
//打开删除
    function openNewsDelete(id, el){
        $('.news-delete').removeClass('hidden').addClass('animated fadeInDown').one(base.animationend,function(){
            $('.news-delete').removeClass('animated fadeInDown');
        });
        $('.news-delete-ensure').on('click', function(e) {
            //删除单个消息
            $.ajax({
               url:'/v1/User/delmsg.action',
               data:{
                    msgid: id
               },
               type:'get',
               cache:false,
               dataType:'json',
               success:function(data) {
                    if (data.code === 0 ) {
                        el.remove();
                        closeNewsDelete()
                        if (el.hasClass('noread')) {
                            var num = $('.header-news-tab').html()*1;
                            if (num >=2) {
                               num = num -1  
                            } else {
                                num ="";
                            }
                           $('.header-news-tab').html(num);
                        }
                        canEveryCancel(el);
                        //当为空时
                        // if($('.news-list li')) {
                        //     $('.list-button').addClass('hidden');
                        //     $('.news-list-none').removeClass('hidden') 
                        // }
                        
                    }
               },
               error : function() {
                   base.notice('网络错误');
               }
            });
        })
    }


//打开全部删除
    function openNewsAllDelete(system, el){
        $('.news-delete').removeClass('hidden').addClass('animated fadeInDown').one(base.animationend,function(){
            $('.news-delete').removeClass('animated fadeInDown');
        });
        //当点击了确认删除后再发送删除请求
        $('.news-delete-ensure').on('click', function(e) {
            //删除消息
            $.ajax({
               url:'/v1/User/delallmsg.action',
               data:{
                system: system
               },
               type:'get',
               cache:false,
               dataType:'json',
               success:function(data) {
                    if (data.code === 0) {
                        //清空该消息列表
                        el.empty();
                        $('.list-button').addClass('hidden');
                        $('.news-list-none').removeClass('hidden')
                        closeNewsDelete();
                        if(system) {
                            //去掉tab红点
                            $('.sys-tab span').remove('news-user-notice');
                        } else {
                            //去掉tab红点
                            $('.user-tab span').remove('news-user-notice');

                        }

                        if (!$('.sys-tab span').hasClass('news-user-notice') && !$('.user-tab span').hasClass('news-user-notice')) {
                            console.log("消息清空")
                            $('.newsCenter div.header-news-tab').removeClass('header-news-number');
                        }
                        return;
                    }
                },
               error : function() {
                   base.notice('网络错误');
               }
            });

        })

    }

//关闭删除
    function closeNewsDelete(){
        $('.news-delete').addClass('animated fadeOutUp').one(base.animationend,function(){
            $('.news-delete').removeClass('animated fadeOutUp').addClass('hidden');
        });
    }
    return{
        
    }
});