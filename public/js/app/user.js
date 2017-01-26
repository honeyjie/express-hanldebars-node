define(['jquery','fullpage','iscroll','clipboard','base','common'],function(jquery,fullpage,iscroll,clipboard,base,common){
    var scroll = [];
    var canSend = true;
    var setTime;
    var imgUrl; 
    var pre_email = $('.set-form-email').val(),
        pre_phone = $('.set-form-phone').val(),
        pre_school = $('.set-form-school').val(),
        pre_major = $('.set-form-major').val(),
        pre_grade = $('.set-form-grade').val(),
        pre_country = $('.set-form-country').val(),
        pre_headering = $('.inputstyle').val();
    $(function(){

        // localStorage.setItem("emailChange", "true");
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


        //七牛上传头像
        if($('.set-avatar-change')[0]){
            var uploader = Qiniu.uploader({
                runtimes: 'html5,flash,html4',    //上传模式,依次退化
                browse_button: 'userAvatar',       //上传选择的点选按钮，**必需**
                uptoken_url: '/v1/help/qiqiuauth.action',            //Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
                domain: 'http://oi7kb12ow.bkt.clouddn.com/',   //bucket 域名，下载资源时用到，**必需**
                get_new_uptoken: false,  //设置上传文件的时候是否每次都重新获取新的token
                max_file_size: '100mb',           //最大文件体积限制
                flash_swf_url: '//cdn.bootcss.com/plupload/2.1.9/Moxie.swf',  //引入flash,相对路径
                max_retries: 3,                   //上传失败最大重试次数
                dragdrop: true,                   //开启可拖曳上传
                drop_element: 'container',        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
                chunk_size: '4mb',                //分块上传时，每片的体积
                auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
                init: {
                    'FilesAdded': function(up, files) {
                        plupload.each(files, function(file) {
                            // 文件添加进队列后,处理相关的事情
                        });
                    },
                    'BeforeUpload': function(up, file) {
                        // 每个文件上传前,处理相关的事情
                    },
                    'UploadProgress': function(up, file) {
                        // 每个文件上传时,处理相关的事情
                    },
                    'FileUploaded': function(up, file, info) {

                        var res = JSON.parse(info);
                        imgUrl = up.getOption('domain') + res.key;
                        base.userInfo.headerimg = imgUrl
                        console.log(imgUrl)
                        canSaveInfo();
                        $('.user-main .set-avatar img').attr('src', imgUrl);
                        // 每个文件上传成功后,处理相关的事情
                        // 其中 info 是文件上传成功后，服务端返回的json，形式如
                        // {
                        //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
                        //    "key": "gogopher.jpg"
                        //  }
                        // 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html

                        // var domain = up.getOption('domain');
                        // var res = parseJSON(info);
                        // var sourceLink = domain + res.key; 获取上传成功后的文件的Url
                    },
                    'Error': function(up, err, errTip) {
                        //上传出错时,处理相关的事情
                    },
                    'UploadComplete': function() {
                        //队列文件处理完毕后,处理相关的事情
                    },
                    'Key': function(up, file) {
                        // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
                        // 该配置必须要在 unique_names: false , save_key: false 时才生效 
                        var key = "/usr/upload/"+up.uid+file.name;
                        // do something with key here
                        return key
                    }
                }
            });

        }


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
                        $(this).removeClass('warning');
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
        var sendEmailClick = true;
        // if (sendEmailClick) {
            $('.set-form-send').on('click',function(){ 
                if(!sendEmailClick) {
                    return;
                }
                sendEmailClick = false;
                console.log("false")
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
                        sendEmailClick = true;
                        console.log("true")
                    } 
                }, 1000) 
            }); 
        // }
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
            if(base.userInfo.email||base.userInfo.phone||base.userInfo.school||base.userInfo.major||base.userInfo.grade||base.userInfo.country || base.userInfo.headerimg){
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

        //消息弹窗阻止冒泡
        $('.news-article').on('click',function(e){
            e.stopPropagation();
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
                    var n = $('.news-system-list li').length;
                    var m = $('.newsCenter .header-news-tab').html();
                    var num ;
                    $('.news-system-list li').removeClass('noread');
                    $('.news-system-read').removeClass('button-hollow').addClass('button-hollow-ban');

                    if (m-n >= 1) {
                        num= m-n
                    } else {
                        num= ""
                    }
                     $('.newsCenter .header-news-tab').html(num);  
                    //去掉tab红点
                    $('.sys-tab span').removeClass('news-user-notice');
                } else {
                    //个人消息
                    var n = $('.news-user-list li').length;
                    var m = $('.newsCenter .header-news-tab').html();
                    var num ;
                    $('.news-user-list li').removeClass('noread');
                    $('.news-user-read').removeClass('button-hollow').addClass('button-hollow-ban');

                    if (m-n >= 1) {
                        num= m-n
                    } else {
                        num= ""
                    }
                     $('.newsCenter .header-news-tab').html(num); 

                    $('.news-user-list li').removeClass('noread');
                    $('.news-user-read').removeClass('button-hollow').addClass('button-hollow-ban')
                    //去掉tab红点
                    $('.user-tab span').removeClass('news-user-notice');
                }
                //清楚数量
                if (!$('.sys-tab span').hasClass('news-user-notice') && !$('.user-tab span').hasClass('news-user-notice')) {
                    $('.newsCenter .header-news-tab').removeClass('header-news-number');
                    $('.newsCenter .header-news-tab').html(""); 
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
                if(data.code===111001013){
                    //未激活
                    $('.set-form-send').removeClass('hidden');
                    console.log(localStorage.getItem('emailChange') === "true")
                    if (!(localStorage.getItem('emailChange') === "true")) {
                        $('.set-form-email').removeClass('warning');
                    } else {
                        $('.set-form-email').addClass('warning');
                        localStorage.removeItem('emailChange')
                    }
                    
                    base.userInfo.isValid = false;  
                    
                }
                else{
                    base.userInfo.isValid = true;
                    $('.set-form-send').addClass('hidden');
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
                headerimg : imgUrl 
            },
            type:'post',
            cache:false,
            dataType:'json',
            success:function(data){
                if(data.code == 0){
                    setTimeout(function() {
                        base.notice('信息已保存');
                    })
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
        var isempty = el.parent().html();
        var parent = el.parent().parent();
        console.log(isempty)
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
                        var isempty = el.parent().html();
                        var parent = el.parent().parent();
                        console.log(isempty)
                        if(!isempty) {
                            console.log("ooo")
                            parent.find('.list-button').addClass('hidden');
                            parent.find('.news-list-none').removeClass('hidden') 
                        }
                        
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
                            $('.sys-tab span').removeClass('news-user-notice');
                             //当为空时
                            var n = $('.news-system-list li').length;
                            var m = $('.newsCenter .header-news-tab').html();
                            var num ;

                            if (m-n >= 1) {
                                num= m-n
                            } else {
                                num= ""
                            }
                             $('.newsCenter .header-news-tab').html(num); 
                            var parent = el.parent().parent();
                                parent.find('.list-button').addClass('hidden');
                                parent.find('.news-list-none').removeClass('hidden') 

                        } else {
                            //去掉tab红点
                            var n = $('.news-user-list li').length;
                            var m = $('.newsCenter .header-news-tab').html();
                            var num ;

                            if (m-n >= 1) {
                                num= m-n
                            } else {
                                num= ""
                            }
                             $('.newsCenter .header-news-tab').html(num); 
                            $('.user-tab span').removeClass('news-user-notice');

                            var parent = el.parent().parent();
                            parent.find('.list-button').addClass('hidden');
                            parent.find('.news-list-none').removeClass('hidden') 

                        }

                        if (!$('.sys-tab span').hasClass('news-user-notice') && !$('.user-tab span').hasClass('news-user-notice')) {
                            
                            $('.newsCenter div.header-news-tab').removeClass('header-news-number');
                        }

                        //显示空消息
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