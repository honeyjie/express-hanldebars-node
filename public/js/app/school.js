define(['jquery','fullpage','iscroll','base','common'],function(jquery,fullpage,iscroll,base,common){
    var scroll = []; //滚动条
    var screen = {};
        screen.country = '';
        screen.state = '';
        screen.preference = '';
        screen.major = '';
        screen.degree = '';
    $(function(){
        //模拟滚动条
        if($('#select-country')[0]){
            scroll[0] =  new iscroll('#select-country',{
                mouseWheel: true,
                scrollbars: true
            });
        }
        if($('#select-state')[0]){
            scroll[1] =  new iscroll('#select-state',{
                mouseWheel: true,
                scrollbars: true
            });
        }
        if($('#select-major')[0]){
            scroll[2] =  new iscroll('#select-major',{
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
        $('.select-form-country').select(scroll[0]);
        $('.select-form-state').select(scroll[1]);
        $('.select-form-major').select(scroll[2]);
        $('.major-info-start').select();
        $('.major-info-direction').select();
        //tab切换
        $('.major-tab').tab();
        //下拉选择
        $('.select-form-country .form-select-option li').on('click',function(){
            screen.country = $(this).html();
            canSearch();
        });
        $('.select-form-state .form-select-option li').on('click',function(){
            screen.state = $(this).html();
            canSearch();
        });
        $('.select-form-major .form-select-option li').on('click',function(){
            screen.major = $(this).html();
            canSearch();
        });
        //模拟单选
        $('.select-form-preference button').on('click',function(){
            $('.select-form-preference button').removeClass('button-hollow').addClass('button-hollow-ban');
            $(this).removeClass('button-hollow-ban').addClass('button-hollow');
            screen.preference = $(this).html();
            canSearch();
        });
        $('.select-form-degree button').on('click',function(){
            $('.select-form-degree button').removeClass('button-hollow').addClass('button-hollow-ban');
            $(this).removeClass('button-hollow-ban').addClass('button-hollow');
            screen.degree = $(this).html();
            canSearch();
        });
        //表单搜索院校
        $('.screen-side-form-search').on('click',function(){
            var school = $('.select-form-school').val();
            searchSchool(school);
        });
        //条件搜索院校
        $('.screen-side-search').on('click',function(){
            canSearch();
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
        if(!screen.country||!screen.state||!screen.preference||!screen.major||!screen.degree){
            return;
        }
        $('.screen-side-search').removeClass('button-solid-ban').addClass('button-solid');
    }

    //搜索院校
    function searchSchool(school){
        if(!school){
            //条件搜索
            return;
        }
        //表单搜索
    }

    function searchReset(){
        screen.country = '';
        screen.state = '';
        screen.preference = '';
        screen.major = '';
        screen.degree = '';
        $('.select-form-country .form-select-value').html('选择地区');
        $('.select-form-state .form-select-value').html('选择州');
        $('.select-form-major .form-select-value').html('选择专业');
        $('.select-form-radio button').removeClass('button-hollow').addClass('button-hollow-ban');
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