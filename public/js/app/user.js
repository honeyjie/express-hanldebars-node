define(['jquery','fullpage','iscroll','base','common'],function(jquery,fullpage,iscroll,base,common){
    var scroll = [];
    $(function(){
        //获取积分并初始化积分条
        // base.userInfo.credit = 0;; //测试数据
        // getCredit();
        creditLine();

        //判断邮箱是否验证
        //isTestEmail();

        //获取邀请码
        //getCode();

        //模拟滚动条
        if($('#news-content')[0]){
            scroll[0] =  new iscroll('#news-content',{
                mouseWheel: true,
                scrollbars: true
            });
        }
        if($('#grade-option')[0]){
            scroll[1] =  new iscroll('#grade-option',{
                mouseWheel: true,
                scrollbars: true
            });
        }
        if($('#country-option')[0]){
            scroll[2] =  new iscroll('#country-option',{
                mouseWheel: true,
                scrollbars: true
            });
        }
        //tab切换
        $('.set-tab').tab();
        $('.news-tab').tab();

        //下拉
        $('.set-form-grade').select(scroll[1]);
        $('.set-form-country').select(scroll[2]);


        //邮箱验证
        $('.set-form-email').on('blur',function(){
            $('.set-form-email').testInput({
                rule : base.emailRule,
                success : function(dom){
                    base.userInfo.email = dom.val();
                    base.testEmail(dom);
                },
                fail : function(dom){
                    base.userInfo.email = '';
                    base.testFail(dom,'请输入有效的 Email 地址');
                }
            });
        });

        //发送验证邮件
        $('.set-form-send').on('click',function(){
            base.sendTestEmail();
        });

        //手机号验证
        $('.set-form-phone').on('blur',function(){
            $('.set-form-phone').testInput({
                rule : base.phoneRule,
                success : function(dom){
                    base.userInfo.phone = dom.val();
                    base.testPhone(dom);
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
            base.testSchool($(this));
        });

        //专业验证
        $('.set-form-major').on('blur',function(){
            base.userInfo.school = $('.set-form-major').val();
            base.testMajor($(this));
        });

        //个人信息判断提交
        $('.set-form-info input').on('blur',function(){
            if(!base.userInfo.email||!base.userInfo.phone||!base.userInfo.school||!base.userInfo.major||!base.userInfo.grade||!base.userInfo.country){
                $('.set-info-save').removeClass('button-solid').addClass('button-solid-ban');
                return;
            }
            $('.set-info-save').removeClass('button-solid-ban').addClass('button-solid');
        });
        $('.set-form-grade .form-select-option li').on('click',function(){
            base.userInfo.grade = $(this).html();
            if(!base.userInfo.email||!base.userInfo.phone||!base.userInfo.school||!base.userInfo.major||!base.userInfo.grade||!base.userInfo.country){
                $('.set-info-save').removeClass('button-solid').addClass('button-solid-ban');
                return;
            }
            $('.set-info-save').removeClass('button-solid-ban').addClass('button-solid');
        });
        $('.set-form-country .form-select-option li').on('click',function(){
            base.userInfo.country = $(this).html();
            if(!base.userInfo.email||!base.userInfo.phone||!base.userInfo.school||!base.userInfo.major||!base.userInfo.grade||!base.userInfo.country){
                $('.set-info-save').removeClass('button-solid').addClass('button-solid-ban');
                return;
            }
            $('.set-info-save').removeClass('button-solid-ban').addClass('button-solid');
        });

        //保存个人信息
        $('.set-info-save').on('click',function(){
            if(!base.userInfo.email||!base.userInfo.phone||!base.userInfo.school||!base.userInfo.major||!base.userInfo.grade||!base.userInfo.country){
                return;
            }
            if(!base.userInfo.isValid){
                base.sendTestEmail();
            }
            saveInfo();
        });


        //原密码验证
        $('.set-form-oldpassword').on('blur',function(){
            $('.set-form-oldpassword').testInput({
                rule : base.passwordRule,
                success : function(dom){
                    base.userInfo.oldpassword = dom.val();
                    base.testOldpassword(dom);
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
        $('.set-form-password input').on('blur',function(){
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
        //打开弹窗
        $('.point-address').on('click',function(e){
            e.stopPropagation();
            $('.point-view-title').html('链接地址');
            // $('.point-result-code').addClass('hidden');
            // $('.point-result-site').removeClass('hidden');
            $('.point-result-code')[0].style.display = "none";
             $('.point-result-site')[0].style.display = "block";
            // $('.point-result-site').r
            openPointView();
        });
        $('.point-code').on('click',function(e){
            e.stopPropagation();
            $('.point-view-title').html('邀请码');
            $('.point-result-code').removeClass('hidden');
            $('.point-result-site').addClass('hidden');
            $('.point-result-site')[0].style.display = "none";
            $('.point-result-code')[0].style.display = "block";
            // $('.point-result-code')
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
            //标记该条消息已读
            $.ajax({
                url:'/v1/User/isread.action',
                data:{
                    msg_id: msg_id
                },
                type:'get',
                cache:false,
                dataType:'json',
                success:function(data) {
                    console.log(data)
                    if(data.data.result == 1) {
                        $(this).parent().removeClass('noread');
                    }
                    return;
                    //去掉noread标记
                },
                error : function() {
                    base.notice('网络错误');
                }
            });
            //当获取当消息类型小于2000时，打开弹窗
            var openNum = $(this).parent().attr('data-type_id');

            if (openNum < 20000) {
                console.log("打开")
                var parent = $(this).parent('li');
                var msg_id = parent.attr('data-msg_id');
                openNewsArticle(msg_id);
            }
        });
        //标记全部已读
        $('.news-system-read').on('click', function(e) {
            //1表示系统消息
            isAllread(1)
        })
        $('.news-user-read').on('click', function(e) {
            //无参数表示个人消息
            isAllread()
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
            var system = 1;//1代表系统消息
            var list = $('.news-system-list')
            openNewsAllDelete(system, list);
           
        });
        //删除个人消息
        $('.news-user-delete').on('click',function(e){
            e.stopPropagation();
            $('.news-delete-content p').html('是否清空个人消息？<br/><span>此删除不可恢复，请谨慎操作</span>');
            var system = 0;//0代表个人消息
            var list = $('.news-user-list')
            openNewsAllDelete(system, list);
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
            },
            error : function() {
                base.notice('网络错误');
            }
        });
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
                if(data.code==111001003){
                    base.userInfo.isValid = false;  //base.userInfo.isvalid 邮箱验证情况 true：验证 false：未验证
                    $('.set-form-send').removeClass('hidden');
                    $('.set-form-email').addClass('warning');
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
                email : info.user.email,
                phone : info.user.phone,
                school : info.user.school,
                major : info.user.major,
                nianji : info.user.grade,
                country : info.user.country,
                headerimg : info.user.headerimg
            },
            type:'post',
            cache:false,
            dataType:'json',
            success:function(data){
                if(data.code == 0){
                    base.notice('信息已保存');
                }
            },
            error : function() {
                base.notice('网络错误');
            }
        });
    }

    //保存密码
    function savePassword(){
        $.ajax({
            url:'/v1/User/saveuserbase.action',
            data:{
                password : info.user.password
            },
            type:'post',
            cache:false,
            dataType:'json',
            success:function(data){
                if(data.code == 0){
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
        console.log(base.userInfo.credit);
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
            //删除个人消息
            $.ajax({
               url:'/v1/User/delmsg.action',
               data:{
                    msgid: id
               },
               type:'get',
               cache:false,
               dataType:'json',
               success:function(data) {
                console.log('/v1/User/delmsg.action',data);
                    if (data.data.delete === 0 ) {
                        
                        el.remove();
                        //不显示该条数据
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
        $('.news-delete-ensure').on('click', function(system, el) {
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
                    console.log('/v1/User/delallmsg.action', data)
                    closeNewsDelete();
                    if (data.data.delete === 0) {
                        //弹窗消失

                        //清空该消息列表
                        el.remove();

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