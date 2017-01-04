define(['jquery','fullpage','base','common'],function(jquery,fullpage,base,common){
    $(function(){
        $('#search-school').on('scroll',function(e){
            e.stopPropagation();
            e.preventDefault();
        });
        //打开登录
        $('.page1-button').on('click',function(e){
            e.stopPropagation();
            openIndexLogin();
        });
        $('.page7-button').on('click',function(e){
            e.stopPropagation();
            openIndexLogin();
        });
        //关闭登录
        $('.index-mask').on('click',function(e){
            e.stopPropagation();
            common.closeLogin();
        });
    });
    var isAnimateRun = [false,false,false,false,false,false,false];
    //首页滚屏
    $('.index-main').fullpage({
        'verticalCentered': true,
        'css3': true,
        'sectionsColor': ['#25BAF4', '#EEF0F3', '#FAFAFA', '#FFFFFF','#FAFAFA','#EEF0F3','#FAFAFA'],
        anchors: ['page1', 'page2', 'page3', 'page4','page5','page6','page7'],
        'navigation': true,
        'navigationPosition': 'right',
        onLeave: function(index, nextIndex, direction){
            if(index == 1){
                $('.header').removeClass('animated toBlue').addClass('animated toWhite');
                $('.footer').removeClass('animated toBlue').addClass('animated toWhite');
                $('.header-search-icon').attr('src','/img/icon-search.png');
            }
            else if(nextIndex == 1){
                $('.header').removeClass('animated toWhite').addClass('animated toBlue');
                $('.footer').removeClass('animated toWhite').addClass('animated toBlue');
                $('.header-search-icon').attr('src','/img/icon-search2.png');
            }
        },
        afterLoad: function(anchorLink,index){
            if(index == 1){
                $('.header').removeClass('animated toWhite').addClass('animated toBlue');
                $('.footer').removeClass('animated toWhite').addClass('animated toBlue');
                $('.header-search-icon').attr('src','/img/icon-search2.png');
                if(isAnimateRun[0]){
                    return;
                }
                page1Animate();
            }
            if(index == 2){
                $('.header').removeClass('animated toBlue').addClass('animated toWhite');
                $('.footer').removeClass('animated toBlue').addClass('animated toWhite');
                $('.header-search-icon').attr('src','/img/icon-search.png');
                if(isAnimateRun[1]){
                    return;
                }
                page2Animate();
            }
            if(index == 3){
                $('.header').removeClass('animated toBlue').addClass('animated toWhite');
                $('.footer').removeClass('animated toBlue').addClass('animated toWhite');
                $('.header-search-icon').attr('src','/img/icon-search.png');
                if(isAnimateRun[2]){
                    return;
                }
                page3Animate();
            }
            if(index == 4){
                $('.header').removeClass('animated toBlue').addClass('animated toWhite');
                $('.footer').removeClass('animated toBlue').addClass('animated toWhite');
                $('.header-search-icon').attr('src','/img/icon-search.png');
                if(isAnimateRun[3]){
                    return;
                }
                page4Animate();
            }
            if(index == 5){
                $('.header').removeClass('animated toBlue').addClass('animated toWhite');
                $('.footer').removeClass('animated toBlue').addClass('animated toWhite');
                $('.header-search-icon').attr('src','/img/icon-search.png');
                if(isAnimateRun[4]){
                    return;
                }
                page5Animate();
            }
            if(index == 6){
                $('.header').removeClass('animated toBlue').addClass('animated toWhite');
                $('.footer').removeClass('animated toBlue').addClass('animated toWhite');
                $('.header-search-icon').attr('src','/img/icon-search.png');
                if(isAnimateRun[5]){
                    return;
                }
                page6Animate();
            }
            if(index == 7){
                $('.header').removeClass('animated toBlue').addClass('animated toWhite');
                $('.footer').removeClass('animated toBlue').addClass('animated toWhite');
                $('.header-search-icon').attr('src','/img/icon-search.png');
                if(isAnimateRun[6]){
                    return;
                }
                page7Animate();
            }
        }
    });
    //首页打开登录弹窗
    function openIndexLogin(){
        $('.app').addClass('filter');
        $('.index-mask').removeClass('hidden');
        $('.login').addClass('index');
        common.openLogin();
    }
    function page1Animate(){
        isAnimateRun[0] = true;
        $('.page1').removeClass('hidden');
        $('.page1-title').removeClass('hidden').addClass('animated time1 fadeInDown').one(base.animationend,function(){
            $('.page1-title').removeClass('animated time1 fadeInDown');
        });
        $('.page1-button').removeClass('hidden').addClass('animated time1 zoomIn').one(base.animationend,function(){
            $('.page1-button').removeClass('animated time1 zoomIn');
        });
        $('.page1-arrow').removeClass('hidden').addClass('animated time1 fadeInDown').one(base.animationend,function(){
            $('.page1-arrow').removeClass('animated time1 fadeInDown').addClass('animated time2 infinite fadeInDown');
        });
    }
    function page2Animate(){
        isAnimateRun[1] = true;
        $('.page2').removeClass('hidden');
        $('.page2-pic-mac').removeClass('hidden').addClass('animated time2 bounceInUp').one(base.animationend,function(){
            $('.page2-pic-mac').removeClass('animated time2 bounceInUp');
        });
        $('.page2-pic-magnifier').removeClass('hidden').addClass('animated time1 bounceInDown delay1').one(base.animationend,function(){
            $('.page2-pic-magnifier').removeClass('animated time1 bounceInDown delay1');
        });
        $('.page2-pic-content').removeClass('hidden').addClass('animated time1 bounceInDown delay1').one(base.animationend,function(){
            $('.page2-pic-content').removeClass('animated time1 bounceInDown delay1');
        });
        $('.page2-words').removeClass('hidden').addClass('animated time1 fadeIn delay2').one(base.animationend,function(){
            $('.page2-words').removeClass('animated time1 fadeIn delay2');
        });
        $('.page2-pic-star1').removeClass('hidden').addClass('animated time1 zoomIn delay2').one(base.animationend,function(){
            $('.page2-pic-star1').removeClass('animated time1 zoomIn delay2');
        });
        $('.page2-pic-star3').removeClass('hidden').addClass('animated time1 fadeIn delay2').one(base.animationend,function(){
            $('.page2-pic-star3').removeClass('animated time1 fadeIn delay2');
        });
        $('.page2-pic-star6').removeClass('hidden').addClass('animated time1 fadeIn delay2').one(base.animationend,function(){
            $('.page2-pic-star6').removeClass('animated time1 fadeIn delay2');
        });
        $('.page2-pic-star7').removeClass('hidden').addClass('animated time1 zoomIn delay2').one(base.animationend,function(){
            $('.page2-pic-star7').removeClass('animated time1 zoomIn delay2');
        });
        setTimeout(function(){
            $('.page2-pic-star2').removeClass('hidden').addClass('animated time1 rotate').one(base.animationend,function(){
                $('.page2-pic-star2').removeClass('animated time1 rotate');
            });
            $('.page2-pic-star4').removeClass('hidden').addClass('animated time1 zoomOut').one(base.animationend,function(){
                $('.page2-pic-star4').removeClass('animated time1 zoomOut');
            });
            $('.page2-pic-star5').removeClass('hidden').addClass('animated time1 rotate').one(base.animationend,function(){
                $('.page2-pic-star5').removeClass('animated time1 rotate');
            });
        },1000);
    }
    function page3Animate(){
        isAnimateRun[2] = true;
        $('.page3').removeClass('hidden');
        setTimeout(function(){
            $('.page3-pic-bg').removeClass('hidden').addClass('animated time1 bounceInDown2').one(base.animationend,function(){
                $('.page3-pic-bg').removeClass('animated time1 bounceInDown2');
            });
        },100);
        $('.page3-pic-people').removeClass('hidden').addClass('animated time1 bounceInDown').one(base.animationend,function(){
            $('.page3-pic-people').removeClass('animated time1 bounceInDown');
        });
        setTimeout(function(){
            $('.page3-pic-cloud1').removeClass('hidden').addClass('animated fadeInLeft').one(base.animationend,function(){
                $('.page3-pic-cloud1').removeClass('animated fadeInLeft');
            });
            $('.page3-pic-cloud2').removeClass('hidden').addClass('animated time1 fadeInRight').one(base.animationend,function(){
                $('.page3-pic-cloud2').removeClass('animated fadeInRight');
            });
            $('.page3-words').removeClass('hidden').addClass('animated time1 fadeIn').one(base.animationend,function(){
                $('.page3-words').removeClass('animated time1 fadeIn');
            });
        },800);
        setTimeout(function(){
            $('.page3-pic-before').addClass('animated fadeOut');
            $('.page3-pic-last').removeClass('hidden').addClass('animated fadeIn').one(base.animationend,function(){
                $('.page3-pic-before').removeClass('animated fadeOut').addClass('hidden');
                $('.page3-pic-last').removeClass('animated fadeIn');
            });
        },1000);
        setTimeout(function(){
            $('.page3-pic-star').removeClass('hidden').addClass('animated time1 zoomInUp').one(base.animationend,function(){
                $('.page3-pic-star').removeClass('animated time1 zoomInUp');
            });
            $('.page3-pic-mark').removeClass('hidden').addClass('animated time1 zoomInBottom').one(base.animationend,function(){
                $('.page3-pic-mark').removeClass('animated time1 zoomInBottom');
            });
        },1000);
    }
    function page4Animate(){
        isAnimateRun[3] = true;
        $('.page4').removeClass('hidden');
        $('.page4-pic-bg').removeClass('hidden').addClass('animated fadeIn').one(base.animationend,function(){
            $('.page4-pic-bg').removeClass('animated fadeIn');
        });
        $('.page4-pic-book').removeClass('hidden').addClass('animated time2 book').one(base.animationend,function(){
            $('.page4-pic-book').removeClass('animated time2 book');
        });
        $('.page4-pic-book img').removeClass('hidden').addClass('animated time2 book2').one(base.animationend,function(){
            $('.page4-pic-book img').removeClass('animated time2 book2');
        });
        setTimeout(function(){
            $('.page4-pic-right').removeClass('hidden').addClass('animated time1 rotateZoomIn').one(base.animationend,function(){
                $('.page4-pic-right').removeClass('animated time1 rotateZoomIn');
            });
            $('.page4-pic-round').removeClass('hidden').addClass('animated time1 zoomIn').one(base.animationend,function(){
                $('.page4-pic-round').removeClass('animated time1 zoomIn');
            });
            $('.page4-pic-cloud1').removeClass('hidden').addClass('animated time1 slideInRight').one(base.animationend,function(){
                $('.page4-pic-cloud1').removeClass('animated time1 slideInRight');
            });
            $('.page4-pic-cloud2').removeClass('hidden').addClass('animated time1 slideInLeft').one(base.animationend,function(){
                $('.page4-pic-cloud2').removeClass('animated time1 slideInLeft');
            });
            $('.page4-pic-star').removeClass('hidden').addClass('animated zoomIn').one(base.animationend,function(){
                $('.page4-pic-star').removeClass('animated zoomIn');
            });
            $('.page4-words').removeClass('hidden').addClass('animated fadeIn').one(base.animationend,function(){
                $('.page4-words').removeClass('animated fadeIn');
            });
        },800);
    }
    function page5Animate(){
        isAnimateRun[4] = true;
        $('.page5').removeClass('hidden');
        $('.page5-pic-round').removeClass('hidden').addClass('animated fadeIn').one(base.animationend,function(){
            $('.page5-pic-round').removeClass('animated fadeIn');
        });
        $('.page5-pic-hat').removeClass('hidden').addClass('animated time1 bounceInDown').one(base.animationend,function(){
            $('.page5-pic-hat').removeClass('animated time1 bounceInDown');
        });
        $('.page5-pic-hole').removeClass('hidden').addClass('animated time1 bounceInDown').one(base.animationend,function(){
            $('.page5-pic-hole').removeClass('animated time1 bounceInDown');
        });
        $('.page5-pic-pen').removeClass('hidden').addClass('animated time1 bounceInDown').one(base.animationend,function(){
            $('.page5-pic-pen').removeClass('animated time1 bounceInDown');
        });
        setTimeout(function(){
            $('.page5-pic-pen img').removeClass('hidden').addClass('animated rotateInDown').one(base.animationend,function(){
                $('.page5-pic-pen img').removeClass('animated rotateInDown');
            });
        },100);
        setTimeout(function(){
            $('.page5-pic-book1').removeClass('hidden').addClass('animated time1 bounceInDown').one(base.animationend,function(){
                $('.page5-pic-book1').removeClass('animated time1 bounceInDown');
            });
        },200);
        setTimeout(function(){
            $('.page5-pic-book2').removeClass('hidden').addClass('animated time1 bounceInDown').one(base.animationend,function(){
                $('.page5-pic-book2').removeClass('animated time1 bounceInDown');
            });
        },100);
        setTimeout(function(){
            $('.page5-pic-ear2').removeClass('hidden').addClass('animated flexRight').one(base.animationend,function(){
                $('.page5-pic-ear2').removeClass('animated flexRight').addClass('hidden');
            });
            $('.page5-words').removeClass('hidden').addClass('animated fadeIn').one(base.animationend,function(){
                $('.page5-words').removeClass('animated fadeIn');
            });
        },800);
        setTimeout(function(){
            $('.page5-pic-ear').removeClass('hidden').addClass('animated fadeInUp').one(base.animationend,function(){
                $('.page5-pic-ear').removeClass('animated fadeInUp');
            });
            $('.page5-pic-star').removeClass('hidden').addClass('animated zoomIn').one(base.animationend,function(){
                $('.page5-pic-star').removeClass('animated zoomIn');
            });
        },1400);
        setTimeout(function(){
            $('.page5-pic-before').addClass('animated fadeOut');
            $('.page5-pic-last').removeClass('hidden').addClass('animated fadeIn').one(base.animationend,function(){
                $('.page5-pic-last').removeClass('animated fadeIn');
                $('.page5-pic-before').removeClass('animated fadeOut').addClass('hidden');
            });
        },1800);
    }
    function page6Animate(){
        isAnimateRun[5] = true;
        $('.page6').removeClass('hidden');
        $('.page6-pic-round').removeClass('hidden').addClass('animated fadeIn').one(base.animationend,function(){
            $('.page6-pic-round').removeClass('animated fadeIn');
        });
        $('.page6-pic-board').removeClass('hidden').addClass('animated time1 bounceInUp').one(base.animationend,function(){
            $('.page6-pic-board').removeClass('animated time1 bounceInUp');
        });
        setTimeout(function(){
            $('.page6-pic-before').addClass('animated fadeOut');
            $('.page6-pic-last').removeClass('hidden').addClass('animated fadeIn').one(base.animationend,function(){
                $('.page6-pic-before').removeClass('animated fadeOut').addClass('hidden');
                $('.page6-pic-board').removeClass('animated fadeIn');
            });
            $('.page6-words').removeClass('hidden').addClass('animated fadeIn').one(base.animationend,function(){
                $('.page6-words').removeClass('hidden').addClass('animated fadeIn')
            });
        },800);
        setTimeout(function(){
            $('.page6-line1').removeClass('hidden').addClass('animated line1').one(base.animationend,function(){
                $('.page6-line1').removeClass('hidden').addClass('animated line1')
            });
            $('.page6-line2').removeClass('hidden').addClass('animated line2').one(base.animationend,function(){
                $('.page6-line2').removeClass('hidden').addClass('animated line2')
            });
            $('.page6-line3').removeClass('hidden').addClass('animated line3').one(base.animationend,function(){
                $('.page6-line3').removeClass('hidden').addClass('animated line3')
            });
            $('.page6-line4').removeClass('hidden').addClass('animated line4').one(base.animationend,function(){
                $('.page6-line4').removeClass('hidden').addClass('animated line4')
            });
            $('.page6-line5').removeClass('hidden').addClass('animated line5').one(base.animationend,function(){
                $('.page6-line5').removeClass('hidden').addClass('animated line5')
            });
            $('.page6-pic-star').removeClass('hidden').addClass('animated zoomIn').one(base.animationend,function(){
                $('.page6-pic-star').removeClass('hidden').addClass('animated zoomIn')
            });
        },1000);
        setTimeout(function(){
            $('.page6-colour').removeClass('hidden').addClass('animated time1 colour').one(base.animationend,function(){
                $('.page6-colour').removeClass('hidden').addClass('animated time1 colour')
            });
        },500);
    }
    function page7Animate(){
        isAnimateRun[6] = true;
        $('.page7').removeClass('hidden');
        $('.page7-bg').removeClass('hidden').addClass('animated time1 fadeIn').one(base.animationend,function(){
            $('.page7-bg').removeClass('hidden').addClass('animated time1 fadeIn')
        });
        $('.page7-button').removeClass('hidden').addClass('animated time1 zoomIn').one(base.animationend,function(){
            $('.page7-button').removeClass('hidden').addClass('animated time1 zoomIn')
        });
    }
    return{

    }
});