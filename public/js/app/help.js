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
                        $('.help-icon-pic').addClass('animated flash');
                    },5000);
                });
            },3000);
            //打开帮助
            $(document).on("click", function(e) {
                console.log("1" + e.target);
            })
            $('.help-icon-pic').on('click',function(e){
                openHelp();
            });
            //关闭帮助
            $('.help-close').on('click',function(){
                closeHelp();
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
        $('.help-icon-notice').addClass('hidden');
        $('.help').removeClass('hidden').addClass('animated slideInRight').one(base.animationend,function(){
            $('.help').removeClass('animated slideInRight');
        });
    }
    function closeHelp(){
        $('.help-icon').removeClass('hidden');
        $('.help').addClass('animated slideOutRight').one(base.animationend,function(){
            $('.help').removeClass('animated slideOutRight').addClass('hidden');
        });
    }

    function openArticle(){
        $('.help-list').addClass('hidden');
        $('.help-back').removeClass('hidden');
        $('.help-article').removeClass('hidden').addClass('animated fadeIn').one(base.animationend,function(){
            $('.help-article').removeClass('animated fadeIn');
            scroll[1].refresh();
        });
    }
    function closeArticle(){
        $('.help-list').removeClass('hidden');
        $('.help-back').addClass('hidden');
        $('.help-article').addClass('animated fadeOut').one(base.animationend,function(){
            $('.help-article').removeClass('animated fadeOut').addClass('hidden');
        });
    }

    function selectType(_this){
        type = _this.html();
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
});