define(['jquery','handlebars','d3','countries','fullpage','iscroll','base','common'],function(jquery,handlebars,d3,countries,fullpage,iscroll,base,common){
    var scroll = []; //滚动条
    var screen = {};
        screen.country = '';
        screen.state = '';
        screen.preference = '';
        screen.major = '';
        screen.degree = '';
    var height = [];//每个模块的高度
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
        if($('#require-content')[0]){
            scroll[3] =  new iscroll('#require-content',{
                mouseWheel: true,
                scrollbars: true
            });
        }
        if($('#from-content')[0]){
            scroll[4] =  new iscroll('#from-content',{
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
        //判断是否能获取推荐
        $('.recommend-major-form input').on('input propertychange',function(){
            screen.major = $('.recommend-major-form input').val();
            canGet();
        });
        //获取推荐
        $('.recommend-major-get').on('click',function(){
            var value = $(this).prev('input').val();
            var sid = $('.school-info').attr('data-sid');
            getMajor(value, sid);
        });

        //学位宽度
        majorWidth();
        //切换学位 school-major
        $('.major-tab .tab-title li').on('click',function(){
            majorTab($(this));
        });
        //查看申请要求 school-major
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
    function searchSchool(school){
        if(!school){
            $.ajax({
                url:'/v1/schoolmajor/filterschool.action',
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
            url:'/v1/schoolmajor/searchschool.action',
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
                return console.error(error);
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
        if(!screen.major){
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
        // if(!screen.major){
        //     return;
        // }
        $.ajax({
            url:'/v1/schoolinfo/getrecommend.action',
            data:{
                sid: id,
                value: val
            },
            type:'get',
            cache:false,
            dataType:'json',
            success:function(){
                window.location.href = "/school-mjlist?sid="+id+"&value="+val;
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
    // $('.school-side-son li').on("click", function() {
    //     $.ajax({
    //         url:'/school-majorlist',
    //         data:{
    //             academy: $(this).find('a').html()
    //         },
    //         type:'get',
    //         cache:false,
    //         dataType:'html',
    //         success:function(data){
    //             console.log(data);
    //             // $("#search-result").html(data);
    //         },
    //         error : function() {
    //             base.notice('网络错误');
    //         }
    //     });
    // })
});