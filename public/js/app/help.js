define(['jquery','fullpage','scrollbar','base','common'],function(jquery,fullpage,scrollbar,base,common){
    var type;
    var question;
    var helpTimer;
    var fileUrl;
    if($('.help')[0]){
        //阻止冒泡
        $('.help').on('click',function(e){
            e.stopPropagation();
            $('.form-select-option').addClass('hidden');
            $('.form-select').removeClass('focus');
        });
        //tab切换
        $('.help-tab').tab(function(){
            console.log("1")
            $('.help-send').addClass('hidden');
            $('.help-file').addClass('hidden');
            $('.help-close').removeClass('hidden');
            // restoreIntialHelp();
            // $('.help-ask').removeClass('hidden');
            // $('.help-file').addClass('hidden');
            // $('.help-result').addClass('hidden');
        },function(){
            console.log("2")
            $('.help-send').removeClass('hidden');
            $('.help-file').removeClass('hidden');
            $('.help-close').addClass('hidden');
            restoreIntialHelp();
            $('.help-ask').removeClass('hidden');
            $('.help-result').addClass('hidden');

        });
        //模拟滚动条
        if($('#help-list')[0]){
            $('#help-list').scrollbar();
        }
        if($('#help-article')[0]){
            $('#help-article').scrollbar();
        }

        //七牛上传头像
        // var canLoad = false;
        // $('.help-file img').eq(0).click(function() {
        //     if (!$('.help-file img').eq(0).hasClass('hidden')) {
        //         console.log(canLoad)
        //         canLoad = true;

        //     }
        // })
        if($('.help-file-icon')){
            var uploader = Qiniu.uploader({
                runtimes: 'html5,flash,html4',    //上传模式,依次退化
                browse_button: 'helpFile',       //上传选择的点选按钮，**必需**
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
                // filters : {
                //     prevent_duplicates: true,
                //     // Specify what files to browse for
                //     // mime_types: [
                //     //     {title : "Image files", extensions : "jpg,gif,png"}, // 限定jpg,gif,png后缀上传
                //     // ]
                // },
                init: {
                    'FilesAdded': function(up, files) {
                            plupload.each(files, function(file) {
                            // 文件添加进队列后,处理相关的事情
                            });

                    },
                    'BeforeUpload': function(up, file) {
                        console.log(file.size, file.size > 5e6)
                        if (file.size > 5e6) {
                            base.notice('上传文件大小不得超过5MB');
                            return;
                        }
                        // 每个文件上传前,处理相关的事情
                    },
                    'UploadProgress': function(up, file) {
                        // 每个文件上传时,处理相关的事情
                    },
                    'FileUploaded': function(up, file, info) {
                        var res = JSON.parse(info);
                        var imgUrl = up.getOption('domain') + res.key;
                        console.log(imgUrl, file, file.name);
                        // base.userInfo.headerimg = imgUrl
                        upLoadFile();
                        $('.help-question .help-upload span').html(file.name);
                        $('.help-question .help-upload span').attr('data-href', imgUrl);
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
            $('.help').removeClass('hidden');
            console.log("1");
            e.stopPropagation();
            openHelp();
        });
        //关闭帮助
        $('.help-close').on('click',function(e){
            e.stopPropagation();
            base.closeAll.closeHelp();
        });
        //打开文章
        $('.help-list').on('click','li', function(e){
            e.stopPropagation();
            console.log($(this))
            $('.help').removeClass('hidden');
            openArticle($(this));
        });
        //关闭文章
        $('.help-back').on('click',function(e){
            e.stopPropagation();
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
            if(!type && type !== 0){
                return;
            }
            $(this).find('img').addClass('hidden');
            $(this).find('img').eq(1).removeClass('hidden');
        }).on('mouseleave',function(){
            if(!type && type !== 0){
                return;
            }
            $(this).find('img').addClass('hidden');
            $(this).find('img').eq(0).removeClass('hidden');
        });
        // $('.help-file').on('mouseenter',function(){
        //     if(!type){
        //         return;
        //     }
        //     $(this).find('img').addClass('hidden');
        //     $(this).find('img').eq(1).removeClass('hidden');
        // }).on('mouseleave',function(){
        //     if(!type){
        //         return;
        //     }
        //     $(this).find('img').addClass('hidden');
        //     $(this).find('img').eq(0).removeClass('hidden');
        // });
        //提交问题

        $('.help-send').click(function(e){
            var imgUrl = $('.help-question .help-upload span').attr('data-href');
            console.log(imgUrl)
              var imgUrl = imgUrl || ""
            sendQuestion(imgUrl); 
        });
        //删除附件
        $('.help-upload-delete').click(function() {
            //清空span中内容
            $('.help-question .help-upload span').html('');
            $('.help-question .help-upload span').attr('data-href', '');
            $('.help-upload').addClass('hidden');
        })
    }

    //智能选校结果页和院校详情页
    function openHelp(){
        $('body').css('overflow','hidden');
        clearTimeout(helpTimer);
        $('.help-icon').addClass('hidden');
        // $('.help-icon-pic').removeClass('animated infinite jump');
        // $('.help-icon-notice').addClass('hidden');
        // $('.help').removeClass('hidden').addClass('animated fadeInUp').one(base.animationend,function(){
        //     $('.help').removeClass('animated fadeInUp');
        // });
        $('.help').removeClass('hidden');
        //请求推荐文章
        var school_id = $('.school-info').data('sid');
        if (school_id) {
            $.ajax({
                url:'/schoolinfo/ad.action',
                data:{
                    sid: school_id
                },
                type:'get',
                cache:false,
                dataType:'html',
                success:function(data){
                    //补充内容
                    $('#help-list').html(data);
                    $('.help-send img').eq(1).addClass('hidden');
                    $('.help-list').removeClass('hidden');
                    return;

                },
                error : function() {
                    base.notice('网络错误');
                }
            });
        }else{
            console.log("1")
            //智能选校结果页
            $.ajax({
                url:'/Help/selectschoolad.action',
                data:{
                },
                type:'get',
                cache:false,
                dataType:'html',
                success:function(data){
                    console.log(data);
                    //补充内容
                    $('#help-list').html(data);
                    $('.help-list').removeClass('hidden');
                    return;
                },
                error : function() {
                    base.notice('网络错误');
                }
            });
        }
    }
    base.closeAll.closeHelp = function(){
        console.log("2")
        $('body').css('overflow','auto');
        

        $('.help-tab .tab-box:eq(0)').removeClass('hidden');
        $('.help-tab .tab-box:eq(1)').addClass('hidden');
        $('.help-tab .tab-box:eq(1) .help-ask').removeClass('hidden');
        $('.help-tab .tab-box:eq(1) .help-result').addClass('hidden');

        $('.help-tab .tab-title li:eq(0)').addClass('active');
        $('.help-tab .tab-title li:eq(1)').removeClass('active');

        // $('.help-tab textarea').val('');
        $('.help-list').addClass('hidden');
        // $('.help').addClass('hidden');
        $('.help').addClass('animated fadeOutDown').one(base.animationend,function(){
            $('.help').removeClass('animated fadeOutDown').addClass('hidden');
        });

        $('.help-article').addClass('hidden');
        $('.help-icon').removeClass('hidden');
    }

    //回到提问初始状态

    function openArticle(dom){
        console.log("1")
        $('.help-back').removeClass('hidden');
        $('.help-article').removeClass('hidden').addClass('animated slideInLeft').one(base.animationend,function(){
            $('.help-article').removeClass('animated slideInLeft');
            $('.help-list').addClass('hidden');
        });

        //填写内容和标题
        $('.help-article-title').html(dom.find('p').eq(0).html());
        $('.help-article-content').html(dom.find('.help-article-content-hid').html())
    }
    function closeArticle(){
        $('.help-list').removeClass('hidden');
        $('.help-back').addClass('hidden');
        $('.help-article').addClass('animated slideOutLeft').one(base.animationend,function(){
            $('.help-article').removeClass('animated slideOutLeft').addClass('hidden');
        });
        // $('.help-icon').removeClass('hidden');
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
        //id="helpFile" 
        $('.help-file-icon').attr('id', "helpFile");
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
        
        question = $('.help-question textarea').val() + urlImg;
        console.log(urlImg, question)
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


    //发送消息
    function sendMessage(msg, type){
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
                    // $('.help-select .form-select-value').text('选择问题类型');
                    // $('.help-file img').eq(0).addClass('hidden');
                    // $('.help-file img').eq(1).removeClass('hidden');
                    // $('.help-question').removeClass('focus');
                    // $('.help-ask').addClass('hidden');
                    // $('.help-result').removeClass('hidden');
                    // $('.help-upload').addClass('hidden');
                    // console.log($('.help-send'), $('.help-file'))
                    // $('.help .help-send').addClass('hidden');
                    // $('.help-send img').addClass('hidden');
                    // $('.help-send img').eq(1).addClass('hidden');
                    // $('.help-send img').eq(2).removeClass('hidden');
                    restoreIntialHelp()
                    
                   
                    $('.help-ask').addClass('hidden');
                    
                    $('.help .help-send').addClass('hidden');
                    $('.help .help-file').addClass('hidden');
                    $('.help-close').removeClass('hidden');
                    $('.help-result').removeClass('hidden');
                }

            },
            error : function() {
                base.notice('网络错误');
            }
        });
    }

    function restoreIntialHelp() {
        $('.help-select .form-select-value').text('选择问题类型');
        $('.help-question').removeClass('hidden');
        $('.help-result').addClass('hidden');
        $('.help-question textarea').attr('disabled',true).val('');
        $('.help-question-placeholder').removeClass('hidden');
        $('.help-question').removeClass('focus');

        $('.help-file img').addClass('hidden');
        $('.help-file img').eq(1).removeClass('hidden');
        $('.help-send img').addClass('hidden');
        $('.help-send img').eq(2).removeClass('hidden');

        $('.help-question .help-upload span').html('');
        $('.help-question .help-upload span').attr('data-href', '');
        $('.help-upload').addClass('hidden');
        $('.help-file-icon').attr('id', '');
    }
});