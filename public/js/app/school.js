define(['jquery','handlebars','d3','countries','fullpage','iscroll','base','common'],function(jquery,handlebars,d3,countries,fullpage,iscroll,base,common){
    var scroll = []; //滚动条
    var screen = {};
        screen.country = '';
        screen.state = '';
        screen.preference = '';
        screen.major = '';
        screen.degree = '';
    var height = [];//每个模块的高度
    var userMajor;
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
        if($('#require-content')[0]){
            scroll[3] =  new iscroll('#require-content',{
                mouseWheel: true,
                scrollbars: true,
                interactiveScrollbars : true
            });
        }
        if($('#from-content')[0]){
            scroll[4] =  new iscroll('#from-content',{
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
        $('.screen-form-state').select(scroll[1]);
        $('.screen-form-major').select(scroll[2]);
        $('.major-info-start').select();
        $('.major-info-direction').select();

        //下拉选择
        $('.screen-form-country .form-select-option li').on('click',function(){
            screen.country = $(this).html();
            screen.country = $(this).attr('short_country');


            var coutries = countries.countries;
            for(var i = 0; i< coutries.length; i++) {
                if(coutries[i].en ==screen.country) {
                    allstate = coutries[i].allstate;
                    
                    var source = $('#template-state').html();
                    var template = Handlebars.compile(source);
                    var html = template({allstate: allstate});
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

        //同时绑定到推荐页面的事件.school-recommend-page,  .school-side-revise[0]
        $(document).on('click', '.school-recommend-page', function(e){
            var target = e.target;

            //获取推荐内容
            $.ajax({
                url: '/school-recommend-partial',
                data: {
                    sid: $('.school-side').attr('data-school')
                },
                type:'get',
                cache:false,
                dataType:'html',
                success:function(data){
                    console.log(data)
                    $('.school-side li').removeClass('active');
                    $(this).addClass('active')
                    $(target).addClass('active');
                    $('.school-side-revise').hide();
                    $('.help-icon').addClass('hidden');
                    $(".school-side-son").hide();
                    $("#school-content-page").html(data);
                },
                error : function() {
                    base.notice('网络错误');
                }
            });
        });

        $(document).on('click', '.school-side-revise', function(e){
            var target = e.target;

            //获取推荐内容
            $.ajax({
                url: '/school-recommend-partial',
                data: {
                    sid: $('.school-side').attr('data-school')
                },
                type:'get',
                cache:false,
                dataType:'html',
                success:function(data){
                    $('.school-side li').removeClass('active');
                    $(this).addClass('active')
                    $(target).addClass('active');
                    $('.school-side-revise').hide();
                    $(".school-side-son").hide();
                    $('.help-icon').addClass('hidden');

                    
                    $("#school-content-page").html(data);
                },
                error : function() {
                    base.notice('网络错误');
                }
            });
        });

        //绑定所有专业列表内容
        $('.school-all-page').on('click',function(e){
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
        $(document).on("click", ".school-side-son li", function(e){
            var target = e.target;
            console.log($(this).attr("data-academy"))
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
        $(document).on("click",  ".all-list li", function(e){
             var target = e.target;
            //获取院校
            $.ajax({
                url: '/school-major-partial',
                data: {
                    sid: $('.school-side').attr('data-school'),
                    mid: $(this).attr("data-mid")
                },
                type:'get',
                cache:false,
                dataType:'html',
                success:function(data){
                    $(target).addClass('active');
                     $('.school-side-revise').show();
                     $(".school-side-son").hide();
                     $('.help-icon').removeClass('hidden');
                    $("#school-content-page").html(data);
                },
                error : function() {
                    base.notice('网络错误');
                }
            });
        });

        // //重新选择专业(学位)
        // $(document).on("click",  ".major-tab .tab-title li", function(e){
        //      var target = e.target;
        //     //获取院校
        //     $.ajax({
        //         url: '/school-major-partial',
        //         data: {
        //             sid: $('.school-side').attr('data-school'),
        //             mid: $(this).attr("data-mid"),
        //             majorDegree: true
        //         },
        //         type:'get',
        //         cache:false,
        //         dataType:'html',
        //         success:function(data){
        //             $('.major-tab .tab-title li').removeClass('active');
        //             $(target).addClass('active');
        //             $("#majorDegree").html(data);
        //         },
        //         error : function() {
        //             base.notice('网络错误');
        //         }
        //     });
        // });


    //点击热门专业
        $(document).on("click",  ".recommend-major-list li", function(e){
            //获取院校
            $.ajax({
                url: '/school-major-partial',
                data: {
                    sid: $('.school-side').attr('data-school'),
                    mid: $(this).attr("data-major")
                },
                type:'get',
                cache:false,
                dataType:'html',
                success:function(data){
                    $("#school-content-page").html(data);
                    $('.help-icon').removeClass('hidden');
                },
                error : function() {
                    base.notice('网络错误');
                }
            });
        });
        //box展开收缩
        $(document).on('click', '.school-box-title img', function(){
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
        schoolMap();
        //专业输入
        $(document).on('input propertychange', '.recommend-major-form input', function(){
            console.log("1", $(this).val())
            selectMajor($(this).val());
        });
        //专业 选择
        $(document).on('click','.recommend-major-form .form-select-option li',function(){

            base.testSuccess($('.recommend-major-form input'));
            $('.recommend-major-form input').val($(this).html());
            $('.recommend-major-get').removeClass('button-solid-ban').addClass('button-solid');
        });
        //专业 失去焦点
        $(document).on('blur', '.recommend-major-form input', function(){
            $('.recommend-major-get').removeClass('button-solid').addClass('button-solid-ban');
            var arr = [];
            for(var i=0;i<$('.recommend-major-form .form-select-option li').length;i++){
                arr.push($('.recommend-major-form .form-select-option li').eq(i).html())
            }
            if(arr.indexOf($('.recommend-major-form input').val())==-1){
                userMajor = null;
                base.testFail($(this),'请用中文输入所就读专业');
                return;
            }
            base.testSuccess($(this));
            userMajor = $(this).val();
            canGet();
        });
        //获取推荐
        $(document).on('click', '.recommend-major-get', function(){
            var sid = $('.school-info').attr('data-sid');
            getMajor(userMajor, sid);
        });


        //学位宽度
        majorWidth();
        //切换学位 school-major
        $(document).on('click', '.major-tab .tab-title li',function(e){
            majorTab($(this));
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
                    $('.major-tab .tab-title li').removeClass('active');
                    $(target).addClass('active');
                    $('.help-icon').removeClass('hidden');
                    $("#majorDegree").html(data);
                },
                error : function() {
                    base.notice('网络错误');
                }
            });
        });

        //查看申请要求 school-major
        $(document).on('click', '.major-require-list li', function(){
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
                    location: screen.location,
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
    function canGet(){
        if(!userMajor){
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
        $('.major-tab .tab-title li').removeClass('active');
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
                $('#school-content-page').html(data);
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
        scroll[3].refresh();
    }
    return{
        
    }
});