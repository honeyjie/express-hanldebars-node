define(['jquery','fullpage','iscroll','base','common'],function(jquery,fullpage,iscroll,base,common){
    var scroll = [];
    var type;
    var question;
    var helpTimer;
    
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
                $('.help-close').addClass('hidden');
                $('.help-send').removeClass('hidden');
                $('.help-file').removeClass('hidden');
            });
            //模拟滚动条
            if($('#help-list')[0]){
                scroll[0] =  new iscroll('#help-list',{
                    mouseWheel : true,
                    scrollbars : true
                });
            }
            if($('#help-article')[0]){
                scroll[1] =  new iscroll('#help-article',{
                    mouseWheel : true,
                    scrollbars : true
                });
            }
            //帮助提示显示
            helpTimer = setTimeout(function(){
                $('.help-icon-notice').removeClass('hidden').addClass('animated fadeInUp').one(base.animationend,function(){
                    $('.help-icon-notice').removeClass('animated fadeInUp');
                    setTimeout(function(){
                        $('.help-icon-pic').addClass('animated infinite jump');
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
                $('.login').addClass('index');
                base.openLogin();
            });
            //下拉
            $('.help-select').select();
            //选择问题类型
            $('.help .form-select-option li').on('click',function(){
                selectType($(this));
            });
            $('.help-send').on('click',function(){
                sendQuestion();
            });
            $('.help-file').on('click',function(){
                $('#help-file')[0].click();
            });
            if($('#help-file')[0]){
                $('#help-file')[0].addEventListener('change',function(){
                    upLoadFile();
                },false)
            }
    }


    function openHelp(){
        clearTimeout(helpTimer);
        $('.help-icon').addClass('hidden');
        $('.help-icon-pic').removeClass('animated infinite jump');
        $('.help-icon-notice').addClass('hidden');
        $('.help').removeClass('hidden').addClass('animated fadeInUp').one(base.animationend,function(){
            $('.help').removeClass('animated fadeInUp');
        });
    }
    base.closeAll.closeHelp = function(){
        $('.help-icon').removeClass('hidden');
        $('.help').addClass('animated fadeOutDown').one(base.animationend,function(){
            $('.help').removeClass('animated fadeOutDown').addClass('hidden');
        });
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

    function sendQuestion(){
        question = $('.help-question textarea').val();
        if(!type||!question){
            notice('您还没有录入问题');
            return;
        }

        sendMessage(question, type);
        $('.help-ask').addClass('hidden');
        $('.help-result').removeClass('hidden');
        $('.help-send').addClass('hidden');
        $('.help-file').addClass('hidden');
        $('.help-close').removeClass('hidden');
    }

    function upLoadFile(){
        $('.help-upload').removeClass('hidden');
    }

    return{
        
    }

    //发送消息
    function sendMessage(msg, type){
        console.log(msg, type);
        console.log(typeof msg, typeof type)
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
                // if (data.code === 111001006) {
                //     //弹出登录框
                // }
            },
            error : function() {
                base.notice('网络错误');
            }
        });
    }
});