define(['jquery','fullpage','iscroll','base','common','countries','handlebars'],function(jquery,fullpage,iscroll,base,common,countries,handlebars){
    var scroll = []; //滚动条
    var screen = {};
        screen.country = '';
        screen.state = '';
        screen.preference = '';
        screen.major = '';
        screen.degree = '';
    $(function(){
        //模拟滚动条
        if($('#screen-country')[0]){
            scroll[0] =  new iscroll('#screen-country',{
                mouseWheel: true,
                scrollbars: true
            });
        }
        if($('#screen-state')[0]){
            scroll[1] =  new iscroll('#screen-state',{
                mouseWheel: true,
                scrollbars: true
            });
        }
        if($('#screen-major')[0]){
            scroll[2] =  new iscroll('#screen-major',{
                mouseWheel: true,
                scrollbars: true
            });
        }
        if($('#require-content1')[0]){
            scroll[3] =  new iscroll('#require-content1',{
                mouseWheel: true,
                scrollbars: true
            });
        }
        if($('#require-content2')[0]){
            scroll[4] =  new iscroll('#require-content2',{
                mouseWheel: true,
                scrollbars: true
            });
        }
        //模拟下拉
        $('.screen-form-country').select(scroll[0]);
        $('.screen-form-state').select(scroll[1]);
        $('.screen-form-major').select(scroll[2]);
        $('.major-info-start').select();
        $('.major-info-direction').select();
        //tab切换
        $('.major-tab').tab();

        // (function a() {
        //     var allmajor = countries.category;
        //     console.log(allmajor);
        //     var source = $('#template-major').html();
        //     var template = Handlebars.compile(source);
        //     var html = template({allmajor: allmajor});
        //     $('#screen-major ul').html(html);
        // }())
        //下拉选择
        $('.screen-form-country .form-select-option li').on('click',function(){
            screen.country = $(this).html();
            screen.country = $(this).attr('short_country');

            console.log(screen.country);

            var coutries = countries.countries;
            console.log(countries.countries);
            for(var i = 0; i< coutries.length; i++) {
                if(coutries[i].en ==screen.country) {
                    allstate = coutries[i].allstate;
                    
                    var source = $('#template-state').html();
                    var template = Handlebars.compile(source);
                    var html = template({allstate: allstate});
                    console.log(allstate);
                    console.log(html);
                    $('#screen-state ul').html(html);
                    return;
                }
            }
            canSearch();
        });
        $('.screen-form-state .form-select-option li').on('click',function(){
            screen.state = $(this).attr('short_state');
            canSearch();
        });
        $('.screen-form-major .form-select-option li').on('click',function(){
            screen.major = $(this).html();
            canSearch();
        });
        //模拟单选
        $('.screen-form-preference button').on('click',function(){
            $('.screen-form-preference button').removeClass('button-hollow').addClass('button-hollow-ban');
            $(this).removeClass('button-hollow-ban').addClass('button-hollow');
            screen.preference = $(this).html();
            canSearch();
        });
        $('.screen-form-degree button').on('click',function(){
            $('.screen-form-degree button').removeClass('button-hollow').addClass('button-hollow-ban');
            $(this).removeClass('button-hollow-ban').addClass('button-hollow');
            screen.degree = $(this).html();
            canSearch();
        });
        //表单搜索院校
        $('.screen-side-form-search').on('click',function(){
            var school = $('.screen-form-school').val();
            searchSchool(school);
        });
        //条件搜索院校
        $('.screen-side-search').on('click',function(){
            // canSearch();
            if(screen.country||screen.state||screen.preference||screen.major||screen.degree){
                console.log("开始搜索")
                searchSchool();
            }

        });
        //重置选项
        $('.screen-side-reset').on('click',function(){
            searchReset();
        });

        //box展开收缩
        $('.school-box-title img').on('click',function(){
            boxShowAndHidden($(this));
        });
        //判断是否能获取推荐
        $('.recommend-major-form input').on('input propertychange',function(){
            screen.major = $('.recommend-major-form input').val();
            canGet();
        });
        //获取推荐
        $('.recommend-major-get').on('click',function(){
            getMajor();
        });
        //查看申请要求
        $('.major-require-list li').on('click',function(){
            requireTab($(this));
        });
    });

    //判断是否能搜索
    function canSearch(){
        // if(!screen.country||!screen.state||!screen.preference||!screen.major||!screen.degree){
        //     return;
        // }
        $('.screen-side-search').removeClass('button-solid-ban').addClass('button-solid');
    }

    //搜索院校
    // function searchSchool(school){
    //     if(!school){
    //         $.ajax({
    //             url:'/v1/schoolmajor/filterschool.action',
    //             data:{
    //                 nation: screen.nation,
    //                 state: screen.state,
    //                 location: screen.location,
    //                 major_name: screen.major,
    //                 degree: screen.degree,
    //                 page: 0
    //             },
    //             type:'get',
    //             cache:false,
    //             dataType:'json',
    //             success:function(data){
    //                 var source = $('#template-school').html();
    //                 var template = Handlebars.compile(source);
    //                 var html = template(data.data);
    //                 console.log(data.data);
    //                 $('#screen-state ul').html(html);
    //             },
    //             error : function() {
    //                 base.notice('网络错误');
    //             }
    //         });
    //         return;
    //     }
    //     //表单搜索
    //     $.ajax({
    //         url:'/v1/schoolmajor/searchschool.action',
    //         data:{
    //             search: school,
    //             page: 0
    //         },
    //         type:'get',
    //         cache:false,
    //         dataType:'json',
    //         success:function(data){
    //             var source = $('#screen-school').html();
    //             var template = Handlebars.compile(source);
    //             var html = template(data.data);
    //             console.log(data.data);
    //             $('#screen-state ul').html(html);
    //         },
    //         error : function() {
    //             base.notice('网络错误');
    //         }
    //     });
    // }

    function searchReset(){
        screen.country = '';
        screen.state = '';
        screen.preference = '';
        screen.major = '';
        screen.degree = '';
        $('.screen-form-country .form-select-value').html('选择地区');
        $('.screen-form-state .form-select-value').html('选择州');
        $('.screen-form-major .form-select-value').html('选择专业');
        $('.screen-form-radio button').removeClass('button-hollow').addClass('button-hollow-ban');
        $('.screen-side-search').removeClass('button-solid').addClass('button-solid-ban');
    }

    function boxShowAndHidden(_this){
        var title = _this.parents('.school-box').find('.school-box-title');
        var content = _this.parents('.school-box').find('.school-box-content');
        console.log(_this.parents('.school-box').find('.school-box-title'))
        if(content.hasClass('hidden')){
            content.removeClass('hidden').addClass('animated fadeInDown').one(base.animationend,function(){
                content.removeClass('animated fadeInDown');
                title.find('.school-box-up').removeClass('hidden');
                title.find('.school-box-down').addClass('hidden');

            });
        }
        else{
            content.addClass('animated fadeOutUp').one(base.animationend,function(){
                content.removeClass('animated fadeOutUp').addClass('hidden');
                title.find('.school-box-up').addClass('hidden');
                title.find('.school-box-down').removeClass('hidden');
            });
        }
    }

    function canGet(){
        if(!screen.major){
            return;
        }
        $('.recommend-major-get').removeClass('button-solid-ban').addClass('button-solid');
    }

    function getMajor(){
        if(!screen.major){
            return;
        }
    }

    function requireTab(_this){
        _this.parents('.major-require-list').find('li').removeClass('active');
        _this.addClass('active');
        _this.parents('.major-require').find('.major-require-content-name').html(_this.find('.major-require-list-name').html());
        scroll[3].refresh();
        scroll[4].refresh();
    }

    return{
        
    }
});