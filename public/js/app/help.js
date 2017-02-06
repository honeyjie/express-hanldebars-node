define(['jquery','fullpage','iscroll','base','common'],function(jquery,fullpage,iscroll,base,common){
    var scroll = [];
    var type;
    var question;
    var helpTimer;
    var imgUrl;
    if($('.help')[0]){
        //阻止冒泡
        $('.help').on('click',function(e){
            e.stopPropagation();
            $('.form-select-option').addClass('hidden');
            $('.form-select').removeClass('focus');
        });
        //tab切换
        $('.help-tab').tab(function(){
            $('.help-send').addClass('hidden');
            $('.help-file').addClass('hidden');
            $('.help-close').removeClass('hidden');
        },function(){
            $('.help-send').removeClass('hidden');
            $('.help-file').removeClass('hidden');
            $('.help-close').addClass('hidden');
        });
        //模拟滚动条
        if($('#help-list')[0]){
            scroll[0] =  new iscroll('#help-list',{
                mouseWheel : true,
                scrollbars : true,
                interactiveScrollbars : true
            });
        }
        if($('#help-article')[0]){
            scroll[1] =  new iscroll('#help-article',{
                mouseWheel : true,
                scrollbars : true,
                interactiveScrollbars : true
            });
        }

        //七牛上传头像
        if($('.help-file-icon')[0]){
            console.log("---")
            var uploader = Qiniu.uploader({
                runtimes: 'html5,flash,html4',    //上传模式,依次退化
                browse_button: 'helpFile',       //上传选择的点选按钮，**必需**
                uptoken_url: '/v1/help/qiqiuauth.action',            //Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
                domain: 'http://oi7kb12ow.bkt.clouddn.com/',   //bucket 域名，下载资源时用到，**必需**
                get_new_uptoken: false,  //设置上传文件的时候是否每次都重新获取新的token
                max_file_size: '5mb',           //最大文件体积限制
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
                        // base.userInfo.headerimg = imgUrl
                        upLoadFile();
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
                        var key = "/usr/upload/"+up.uid;
                        // do something with key here
                        return key
                    }
                }
            });

        }


        //帮助提示显示
        helpTimer = setTimeout(function(){
            $('.help-icon-notice').removeClass('hidden').addClass('animated fadeInUp').one(base.animationend,function(){
                $('.help-icon-notice').removeClass('animated fadeInUp');
                setTimeout(function(){
                    $('.help-icon-pic').addClass('animated infinite jump');
                    setTimeout(function(){
                        $('.help-icon-pic').removeClass('animated infinite jump');
                    },3000);
                },5000);
            });
        },3000);

        //$(document).on("click", function(e) {
        //    console.log("1" + e.target);
        //})
        //打开帮助
        $('.help-icon-pic').on('click',function(e){
            e.stopPropagation();
            openHelp();
            scroll[0].refresh();
        });
        //关闭帮助
        $('.help-close').on('click',function(){
            base.closeAll.closeHelp();
        });
        //打开文章
        $('.help-list').on('click',function(){
            openArticle();
        });
        //关闭文章
        $('.help-back').on('click',function(){
            closeArticle();
        });
        //打开登录框
        $('.help-login-button').on('click',function(e){
            e.stopPropagation();
            $('.login').removeClass('hidden');
            // base.openLogin();
            common.openIndexLogin();
        });
       
        //下拉
        $('.help-select').select();
        //选择问题类型
        $('.help .form-select-option li').on('click',function(){
            selectType($(this));
        });
        $('.help-send').on('mouseenter',function(){
            if(!type){
                return;
            }
            $(this).find('img').addClass('hidden');
            $(this).find('img').eq(1).removeClass('hidden');
        }).on('mouseleave',function(){
            if(!type){
                return;
            }
            $(this).find('img').addClass('hidden');
            $(this).find('img').eq(0).removeClass('hidden');
        });
        $('.help-file').on('mouseenter',function(){
            if(!type){
                return;
            }
            $(this).find('img').addClass('hidden');
            $(this).find('img').eq(1).removeClass('hidden');
        }).on('mouseleave',function(){
            if(!type){
                return;
            }
            $(this).find('img').addClass('hidden');
            $(this).find('img').eq(0).removeClass('hidden');
        });
        //提交问题
        $('.help-send').on('click',function(){
              var urlImg = urlImg || ""
              console.log(urlImg)
               sendQuestion(urlImg); 
            
        });
        //添加附件
        $('.help-file').on('click',function(){
            if(!type){
                return;
            }
            // $('#help-file')[0].click();
        });
        // if($('#help-file')[0]){
        //     $('#help-file')[0].addEventListener('change',function(){
        //         upLoadFile();
        //     },false)
        // }
    }

    //智能选校结果页和院校详情页
    function openHelp(){
        clearTimeout(helpTimer);
        $('.help-icon').addClass('hidden');
        $('.help-icon-pic').removeClass('animated infinite jump');
        $('.help-icon-notice').addClass('hidden');
        $('.help').removeClass('hidden').addClass('animated fadeInUp').one(base.animationend,function(){
            $('.help').removeClass('animated fadeInUp');
        });
        //请求推荐文章
        $.ajax({
            url:'/v1/schoolinfo/ad.action',
            data:{
                // sid: ,
                // mid: 
            },
            type:'get',
            cache:false,
            dataType:'json',
            success:function(data){
                console.log(data);
                if (data.code === 0) {
                }
                return;

            },
            error : function() {
                base.notice('网络错误');
            }
        });
    }
    base.closeAll.closeHelp = function(){
        $('.help-icon').removeClass('hidden');
        $('.help').addClass('animated fadeOutDown').one(base.animationend,function(){
            $('.help').removeClass('animated fadeOutDown').addClass('hidden');
        });
        $('.help-tab .tab-box:eq(0)').removeClass('hidden');
        $('.help-tab .tab-box:eq(1)').addClass('hidden');
        $('.help-tab .tab-box:eq(1) .help-ask').removeClass('hidden');
        $('.help-tab .tab-box:eq(1) .help-result').addClass('hidden');

        $('.help-tab .tab-title li:eq(0)').addClass('active');
        $('.help-tab .tab-title li:eq(1)').removeClass('active');

        $('.help-tab textarea').val('');
    }

    function openArticle(){
        $('.help-back').removeClass('hidden');
        $('.help-article').removeClass('hidden').addClass('animated slideInLeft').one(base.animationend,function(){
            $('.help-article').removeClass('animated slideInLeft');
            $('.help-list').addClass('hidden');
            scroll[1].refresh();
        });
    }
    function closeArticle(){
        $('.help-list').removeClass('hidden');
        $('.help-back').addClass('hidden');
        $('.help-article').addClass('animated slideOutLeft').one(base.animationend,function(){
            $('.help-article').removeClass('animated slideOutLeft').addClass('hidden');
        });
    }

    function selectType(_this){
        type = _this.attr('data-type')*1;
        console.log(type)
        $('.help-question textarea').attr('disabled',false);
        $('.help-question-placeholder').addClass('hidden');
        $('.help-question').addClass('focus');
        $('.help-question textarea')[0].focus();

        $('.help-file img').addClass('hidden');
        $('.help-file img').eq(0).removeClass('hidden');
        $('.help-send img').addClass('hidden');
        $('.help-send img').eq(0).removeClass('hidden');
    }

    function notice(content){
        $('.help-notice').html(content);
        $('.help-notice').removeClass('hidden').addClass('animated fadeInDown').one(base.animationend,function(){
            $('.help-notice').removeClass('animated fadeInDown');
            setTimeout(function(){
                $('.help-notice').addClass('animated fadeOutUp').one(base.animationend,function(){
                    $('.help-notice').removeClass('animated fadeOutUp').addClass('hidden');
                    $('.help-notice').html('');
                });
            },1000);
        });
    }

    function sendQuestion(urlImg){
        console.log(urlImg)
        question = $('.help-question textarea').val() + "<br/>"+ urlImg;
        if(!question){
            notice('您还没有录入问题');
            return;
        }
        console.log(question)
        sendMessage(question, type);
        
    }

    function upLoadFile(){
        $('.help-upload').removeClass('hidden');
    }

    return{
        
    }

    //发送消息
    function sendMessage(msg, type){
        console.log(msg, type)
        $.ajax({
            url:'/v1/User/feedback.action',
            data:{
                msg: msg,
                type: type
            },
            type:'get',
            cache:false,
            dataType:'json',
            success:function(data){
                console.log(data);
                if (data.code === 0) {
                    //弹出登录框
                    $('.help-ask').addClass('hidden');
                    $('.help-result').removeClass('hidden');
                    $('.help-send').addClass('hidden');
                    $('.help-file').addClass('hidden');
                    $('.help-close').removeClass('hidden');
                }
                return;

            },
            error : function() {
                base.notice('网络错误');
            }
        });
    }
});