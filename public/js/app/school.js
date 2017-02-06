define(['jquery','handlebars','d3','countries','fullpage','iscroll','base','common'],function(jquery,handlebars,d3,countries,fullpage,iscroll,base,common){
    var scroll = []; //滚动条
    var screen = {};
        screen.country = '';
        screen.state = '';
        screen.preference = '';
        screen.major = '';
        screen.degree = '';
    var height = [];//每个模块的高度

    var userMajor = false;
    var major_empty;
    $(function(){
        //模拟滚动条
        if($('#screen-country')[0]){
            scroll[0] =  new iscroll('#screen-country',{
                mouseWheel: true,
                scrollbars: true,
                interactiveScrollbars : true
            });
        }
        if($('#screen-state')[0]){
            scroll[1] =  new iscroll('#screen-state',{
                mouseWheel: true,
                scrollbars: true,
                interactiveScrollbars : true
            });
        }
        if($('#screen-major')[0]){
            scroll[2] =  new iscroll('#screen-major',{
                mouseWheel: true,
                scrollbars: true,
                interactiveScrollbars : true
            });
        }
        if($('#school-brief-describe')[0]){
            scroll[5] =  new iscroll('#school-brief-describe',{
                mouseWheel: true,
                scrollbars: true,
                interactiveScrollbars : true
            });
        }
        //模拟下拉
        $('.screen-form-country').select(scroll[0]);
    
        $('.screen-form-major').select(scroll[2]);

        //下拉选择
        $('.screen-form-country .form-select-option li').on('click',function(){
            screen.country = $(this).attr('short_country');
            var jsonUrl;
            if(screen.country=='US'){
                jsonUrl = 'js/country/US.json';
            }
            else if(screen.country=='CA'){
                jsonUrl = 'js/country/CA.json';
            }
            $.getJSON(jsonUrl,function(data){
                var dom = '';
                for(var i=0;i<data.length;i++){
                    dom = dom+'<li short_state="'+data[i].shortName+'">'+data[i].fullName+'</li>';
                }
                $('.screen-form-state .form-select-option ul').html(dom);
            });
            $('.screen-form-state').select(scroll[1]);
            canSearch();
           
        });


        $('.screen-form-state .form-select-option').on('click','li',function(e){
            if(!screen.country) {
                $('.screen-form-state').removeClass('focus');
            }
            e.stopPropagation();
            screen.state = $(this).attr('short_state');
            $('.screen-form-state .form-select-value').html($(this).html());
            $('.screen-form-state .form-select-option').addClass('hidden');
            $('.screen-form-state').removeClass('focus');
            canSearch();
        });


        //读取特色专业
        if($('.screen-form-major')[0]){
            $.getJSON('js/country/major.json',function(data){
                var dom = '';
                for(var i=0;i<data.length;i++){
                    dom = dom+'<li>'+data[i]+'</li>';
                }
                $('.screen-form-major .form-select-option ul').html(dom);
            });
        }
        $('.screen-form-major .form-select-option').on('click','li',function(e){
            e.stopPropagation();
            screen.major = $(this).html();
            $('.screen-form-major .form-select-value').html($(this).html());
            $('.screen-form-major .form-select-option').addClass('hidden');
            $('.screen-form-major').removeClass('focus');
            canSearch();
        });
        //模拟单选
        $('.screen-form-preference button').on('click',function(){
            $('.screen-form-preference button').removeClass('active');
            $(this).addClass('active');
            screen.preference = $(this).html();
            canSearch();
        });
        $('.screen-form-degree button').on('click',function(){
            $('.screen-form-degree button').removeClass('active');
            $(this).addClass('active');
            screen.degree = $(this).html();
            canSearch();
        });
        //表单搜索院校
        $('.screen-side-form-search').on('click',function(){
            var school = $('.screen-form-school').val();
            searchSchool(school);
        });
        $('.screen-form-school').on('keydown',function(e){
            if(e.keyCode==13){
                var school = $('.screen-form-school').val();
                searchSchool(school);
            }
        });

        var searchquery = window.location.search;
        if (searchquery.slice(1, searchquery.indexOf("=")) === "value") {
            
            $('.screen-form-school').val(decodeURIComponent(searchquery.slice(searchquery.indexOf("=") + 1, searchquery.indexOf("&"))));
            var school = $('.screen-form-school').val();
            searchSchool(school);
        }
        //条件搜索院校
        $('.screen-side-search').on('click',function(){
            // canSearch();
            if(screen.country||screen.state||screen.preference||screen.major||screen.degree){
                searchSchool();
            }
        });

        //重置选项
        $('.screen-side-reset').on('click',function(){
            searchReset();
        });

        $('.school-side').on('click', '.school-recommend-page', function(e){
            //阻止冒泡
            e.stopPropagation();
            var target = e.target;
            var sid = $('.school-side').attr('data-school');
            //未推荐过或推荐结果为空school-box-content major-empty
            //只要在推荐页面出现过为空则标记
            if($('.school-box-content').hasClass('major-empty')) {
                 major_empty = true;
            }
            if(!userMajor || major_empty) {
                //调用重新推荐函数
                var sid = $('.school-side').attr('data-school');
                getRecommendMajor(sid)
            } else {
                //获取推荐专业详情
                getMajor(userMajor, sid);
                major_empty = false;
            }
        });

        $('.school-side').on('click', '.school-side-revise', function(e){
            e.stopPropagation();
            var target = e.target;
            $(target).addClass('active');
            var sid = $('.school-side').attr('data-school');
            //重新推荐
            getRecommendMajor(sid)
        });

        //绑定所有专业列表内容
        $('.school-all-page').on('click',function(e){
            e.stopPropagation();
            var target = e.target;

            //获取学校所有专业
            $.ajax({
                url: '/school-all-partial',
                data: {
                    sid: $('.school-side').attr('data-school')
                },
                type:'get',
                cache:false,
                dataType:'html',
                success:function(data){
                    $('.school-side li').removeClass('active');
                    $(target).addClass('active');
                    $('.school-side-revise').hide();
                    $('.help-icon').addClass('hidden');
                    $("#school-content-page").html(data);
                },
                error : function() {
                    base.notice('网络错误');
                }
            });

            //获取学院排名
            $.ajax({
                url: '/school-academylist-partial',
                data: {
                    sid: $('.school-side').attr('data-school')
                },
                type:'get',
                cache:false,
                dataType:'html',
                success:function(data){
                    $('.school-side li').removeClass('active');
                    $(target).addClass('active');
                    $('.school-side-revise').hide();
                    $('.help-icon').addClass('hidden');
                    $("#academylist").html(data);
                },
                error : function() {
                    base.notice('网络错误');
                }
            });
        });

        //绑定学院专业列表内容
        $('.school-side').on("click", ".school-side-son li", function(e){
            e.stopPropagation();
            var target = e.target;
            $.ajax({
                url: '/school-majorlist-partial',
                data: {
                    sid: $('.school-side').attr('data-school'),
                    academy: $(this).attr("data-academy")
                },
                type:'get',
                cache:false,
                dataType:'html',
                success:function(data){
                    $('.school-side-son li').removeClass('active');
                    $('.school-recommend-page').removeClass('active');
                    $('.school-all-page').addClass('active');
                    $('.school-side-revise').hide();
                    $('.help-icon').addClass('hidden');
                    $(target).addClass('active');
                    $("#school-content-page").html(data);
                },
                error : function() {
                    base.notice('网络错误');
                }
            });
        });

        //绑定专业详情页
        $('#school-content-page').on("click",  ".all-list li", function(e){
            e.stopPropagation();
            var sid =  $('.school-side').attr('data-school');
            var mid = $(this).attr("data-mid");
            var target = e.target;
            $(target).addClass('active');
            getOneMajor(sid, mid)
        });


    //点击热门专业
    $('#school-content-page').on("click",  ".recommend-major-list li", function(e){
        e.stopPropagation();
        var sid =  $('.school-side').attr('data-school');
        var mid = $(this).attr("data-major");
        getOneMajor(sid, mid)
    });

    //获取到某个专业的详情
    function getOneMajor(sid, mid) {
        $.ajax({
            url: '/school-major-partial',
            data: {
               sid: sid,
               mid: mid
            },
            type:'get',
            cache:false,
            dataType:'html',
            success:function(data){
                $("#school-content-page").html(data);
                setTimeout(function() {
                    var academy = $('.school-box-content.major-tab').eq(0).data('academy');
                    $('.school-side-son').removeClass('active');
                    $('.school-side-son li[data-academy="'+ academy+ '"]').addClass('active');

                    $('#school-content-page .major-require-list li:eq(0)').trigger('click');
                }
                ,100)
                
                //列表中含有这个属性值的高亮
                
                $('.help-icon').removeClass('hidden');
                if($('.require-content')[0]){
                    scroll[3] =  new iscroll('.require-content',{
                        mouseWheel: true,
                        scrollbars: true,
                        interactiveScrollbars : true
                    });
                }
                if($('.from-content')[0]){
                    scroll[4] =  new iscroll('.from-content',{
                        mouseWheel: true,
                        scrollbars: true,
                        interactiveScrollbars : true
                    });
                }
                $('.major-info-start').select();
                $('.major-info-direction').select();
                $('.major-info-direction .form-select-option li').on('click',function(){
                    if($(this).html().length>20){
                        $('.major-info-direction .form-select-value').html($(this).html().substring(0,20)+'...');
                    }
                })
            },
            error : function() {
                base.notice('网络错误');
            }
        });
    }

    //推荐填写页面
    function getRecommendMajor(sid) {
        $.ajax({
            url: '/school-recommend-partial',
            data: {
                sid: sid
            },
            type:'get',
            cache:false,
            dataType:'html',
            success:function(data){
                $('.school-side li').removeClass('active');
                $('.school-side-revise').hide();
                $('.school-recommend-page').addClass('active');
                $(".school-side-son").hide();
                $('.help-icon').addClass('hidden');
                $("#school-content-page").html(data);
            },
            error : function() {
                base.notice('网络错误');
            }
        });
    }

    //点击更多
    // $('.header-search').on('click', 'p.searchmore', function(e) {
    //     e.preventDefault();
    //     var val = $('.header-search input').val();
    //     console.log(val);
    //     $('.screen-form-school').val(val);
    //     $('.screen-side-form-search').trigger('click');
    //     $('.screen-form-school').val('');
    // })

        //box展开收缩
        $('.school').on('click','.school-major .school-box-title',function(e){
            e.stopPropagation();
            var content = $(this).parents('.school-box').find('.school-box-content');
            var index = $('.school-box').index($(this).parents('.school-box'));
            if(!height[index]){
                height[index] = content.innerHeight();
            }
            else if(height[index]&&content.innerHeight()!== 0){
                height[index] = content.innerHeight();
            }
            if(content.css('height') == '0px'){
                $(this).find('img').removeClass('animated rotateDown').addClass('animated rotateUp');
                content.animate({height:height[index]},200);
            }
            else{
                $(this).find('img').removeClass('animated rotateUp').addClass('animated rotateDown');
                content.animate({height:0},200);
            }
        });
        $('.school').on('click', '.school-box-title img', function(e){
             e.stopPropagation();
            var content = $(this).parents('.school-box').find('.school-box-content');
            var index = $('.school-box').index($(this).parents('.school-box'));
            if(!height[index]){
                height[index] = content.innerHeight();
            }
            else if(height[index]&&content.innerHeight()!== 0){
                height[index] = content.innerHeight();
            }
            if(content.css('height') == '0px'){
                $(this).removeClass('animated rotateDown').addClass('animated rotateUp');
                content.animate({height:height[index]},200);
            }
            else{
                $(this).removeClass('animated rotateUp').addClass('animated rotateDown');
                content.animate({height:0},200);
            }
        });
        //生成地图
        if($('.school-brief-map')[0]){
            schoolMap();
        }
        //专业输入
        $('#school-content-page').on('input propertychange', '.recommend-major-form input', function(){
            selectMajor($(this).val());
            canGet($(this).val());
        });
        //专业 选择
        $('#school-content-page').on('click','.recommend-major-form .form-select-option li',function(e){
            e.stopPropagation();
            base.testSuccess($('.recommend-major-form input'));
            $('.recommend-major-form input').val($(this).html());
            $('.form-select-option').addClass('hidden');
            $('.recommend-major-get').removeClass('button-solid-ban').addClass('button-solid');
        });
        //专业 失去焦点
        $('#school-content-page').on('blur', '.recommend-major-form input', function(){
            $('.recommend-major-get').removeClass('button-solid').addClass('button-solid-ban');
            var arr = [];
            for(var i=0;i<$('.recommend-major-form .form-select-option li').length;i++){
                arr.push($('.recommend-major-form .form-select-option li').eq(i).html())
            }
            if(arr.indexOf($('.recommend-major-form input').val())==-1){
                userMajor = null;
                base.testFail($(this),'请从下拉列表中选择专业');
                return;
            }
            base.testSuccess($(this));
            userMajor = $(this).val();
        });
        //获取推荐
        $('#school-content-page').on('click', '.recommend-major-get', function(){
            var sid = $('.school-info').attr('data-sid');
            getMajor(userMajor, sid);
            
        });


        //学位宽度
        majorWidth();
        //切换学位 school-major
        $('#school-content-page').on('click', '.major-tab .tab-title li',function(e){
            e.stopPropagation();
            
           
           majorTab($(this));
            // $('.major-require-list li:eq(0)').addClass('active');
            // //重新选择专业(学位)
            var target = e.target;
            $.ajax({
                url: '/school-major-partial',
                data: {
                    sid: $('.school-side').attr('data-school'),
                    mid: $(this).attr("data-mid"),
                    majorDegree: true
                },
                type:'get',
                cache:false,
                dataType:'html',
                success:function(data){
                    //$('.major-tab .tab-title li').removeClass('active');
                    //$(target).addClass('active');
                    $('.help-icon').removeClass('hidden');
                    $(this).parents('.school-box').find('.majorDegree').addClass('animated fadeInDown').html(Math.random());
                    console.log("1")
                    //????
                    if($('.require-content')[0]){
                        scroll[3] =  new iscroll('.require-content',{
                            mouseWheel: true,
                            scrollbars: true,
                            interactiveScrollbars : true
                        });
                    }
                    if($('.from-content')[0]){
                        scroll[4] =  new iscroll('.from-content',{
                            mouseWheel: true,
                            scrollbars: true,
                            interactiveScrollbars : true
                        });
                    }
                    $('.major-info-start').select();
                    $('.major-info-direction').select();
                    $('.major-info-direction .form-select-option li').on('click',function(){
                        if($(this).html().length>20){
                            $('.major-info-direction .form-select-value').html($(this).html().substring(0,20)+'...');
                        }
                    })

                    // console.log($('.major-require-list li:eq(0)'))
                    // requireTab('.major-require-list li:eq(0)');
                },
                error : function() {
                    base.notice('网络错误');
                }
            });
        });

        //查看申请要求 school-major
        

        $('#school-content-page').on('click', '.major-require-list li', function(e){
            e.stopPropagation();
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
    function searchSchool(school){
        if(!school){
            $.ajax({
                url:'/schoolmajor/filterschool.action',
                data:{
                    nation: screen.nation,
                    state: screen.state,
                    location: screen.preference,
                    major_name: screen.major,
                    degree: screen.degree,
                    page: 0
                },
                type:'get',
                cache:false,
                dataType:'html',
                success:function(data){
                    $("#search-result").html(data);
                },
                error : function() {
                    base.notice('网络错误');
                }
            });
            return;
        }
        //表单搜索
        $.ajax({
            url:'/schoolmajor/searchschool.action',
            data:{
                search: school,
                page: 0
            },
            type:'get',
            cache:false,
            dataType:'html',
            success:function(data){
                $("#search-result").html(data);
            },
            error : function() {
                base.notice('网络错误');
            }
        });
    }

    //搜索专业
    function selectMajor(major){
        $.ajax({
            url:'/completeform/chinamajor.action',
            data:{
                majorname: major
            },
            type:'post',
            cache:false,
            dataType:'html',
            success:function(data){
                $('#select-major ul').html(data);
                $('.recommend-major-form').find('.form-select-option').removeClass('hidden');
                if(!scroll[1]){
                    scroll[1] = new iscroll('#select-major',{
                        mouseWheel : true,
                        scrollbars : true,
                        interactiveScrollbars : true
                    });
                }
                else{
                    scroll[1].refresh();
                }
            },
            error : function() {
                base.notice('网络错误');
            }
        });
    }

    function searchReset(){
        screen.country = '';
        screen.state = '';
        screen.preference = '';
        screen.major = '';
        screen.degree = '';
        $('.screen-form-country .form-select-value').html('选择地区');
        $('.screen-form-state .form-select-value').html('选择州');
        $('.screen-form-major .form-select-value').html('选择专业');
        $('.screen-form-radio button').removeClass('active');
        $('.screen-side-search').removeClass('button-solid').addClass('button-solid-ban');
    }

    function schoolMap(){
        var country = $('.school-brief-map').data('nation');
        var state = $('.school-brief-map').data('map');
        var width = 300;
        var height = 200;
        var svg = d3.select('.school-brief-map').append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', 'translate(0,0)');
        var projection;
        var mapJson;
        if(country=='US'){
            projection = d3.geoAlbersUsa()
                .translate([width/2, height/2])
                .scale([350]);
            mapJson = '/js/US.json';
        }
        else if(country=='CA'){
            projection = d3.geoAlbers()
                .center([45.4, 75.5])
                .parallels([45, 70])
                .scale(280)
                .translate([0.65 * width, 0.10 * height]);
            mapJson = '/js/CA.json';
        }
        var path = d3.geoPath()
            .projection(projection);
        d3.json(mapJson, function(error, root) {
            if (error){
                return console.log(error);
            }
            svg.selectAll('path')
                .data(root.features)
                .enter()
                .append('path')
                .attr('stroke','#999999')
                .attr('stroke-width',1)
                .attr('fill', function(d){
                    if(country == 'US'){
                        if(d.properties.name == state){
                            return '#25baf4'
                        }
                        else{
                            return '#cccccc';
                        }
                    }
                    else if(country == 'CA'){
                        if(d.properties.NAME == state){
                            return '#25baf4'
                        }
                        else{
                            return '#cccccc';
                        }
                    }
                })
                .attr('d',path);
        });
    }
    function canGet(value){
        if(!value){
            $('.recommend-major-get').removeClass('button-solid').addClass('button-solid-ban');
            return;
        }
        $('.recommend-major-get').removeClass('button-solid-ban').addClass('button-solid');
    }
    function majorWidth(){
        var n = $('.major-tab .tab-title li').length;
        switch (n){
            case 1:
                $('.major-tab .tab-title li').css('width',150);
                break;
            case 2:
                $('.major-tab .tab-title li').css('width',150);
                break;
            case 3:
                $('.major-tab .tab-title li').css('width',100);
                break;
            case 4:
                $('.major-tab .tab-title li').css('width',100);
                break;
        }
    }
    function majorTab(dom){
        dom.parent('.tab-title').find('li').removeClass('active');
        dom.addClass('active')
    }
    function getMajor(val, id){
        //发送学校id和填写值
        if(!val){
             return;
        }
        $.ajax({
            url:'/school-mjlist-partial',
            data:{
                sid: id,
                value: val
            },
            type:'get',
            cache:false,
            dataType:'html',
            success:function(data){
                $('.school-side-revise').show();
                $('.help-icon').removeClass('hidden');
                $('.school-all-page').removeClass('active');
                $('.school-recommend-page').addClass('active');
                $('#school-content-page').html(data);
                // $('.school-brief-title img').click();
                for(var i= 0;i<$('.school-box').length;i++){
                    // console.log( $('.school-major').eq(i-1).find('.school-box-title img').eq(0))
                    // $('.school-major').eq(i-1).find('.school-box-title img').eq(0).trigger('click');
                    console.log($('.school-box').eq(i).find('.school-box-title img'));
                    // $('.school-box').eq(i).find('.school-box-title img').trigger('click');
                    console.log($('.school-major').eq(i));
                    $('.school-major').eq(i).find('.major-require-list li img').eq(0).trigger('click');
                }
                if($('.require-content')[0]){
                    scroll[3] =  new iscroll('.require-content',{
                        mouseWheel: true,
                        scrollbars: true,
                        interactiveScrollbars : true
                    });
                }
                if($('.from-content')[0]){
                    scroll[4] =  new iscroll('.from-content',{
                        mouseWheel: true,
                        scrollbars: true,
                        interactiveScrollbars : true
                    });
                }
                $('.major-info-start').select();
                $('.major-info-direction').select();
                $('.major-info-direction .form-select-option li').on('click',function(){
                    if($(this).html().length>20){
                        $('.major-info-direction .form-select-value').html($(this).html().substring(0,20)+'...');
                    }
                })
            },
            error : function() {
                base.notice('网络错误');
            }
        });

    }
    function requireTab(_this){
        _this.parents('.major-require-list').find('li').removeClass('active');
        _this.addClass('active');
        _this.parents('.major-require').find('.major-require-content-name').html(_this.find('.major-require-list-name').html());
        _this.parents('.major-require').find('.major-require-content-result').html(_this.find('.major-require-list-result').html());
        // scroll[3].refresh();
    }

    return{

    }
});