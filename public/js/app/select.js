define(['jquery','fullpage','iscroll','base','common','d3'], function(jquery,fullpage,iscroll,base,common,d3){
    console.log($('.select-school-list:first li:first').attr('school-id'));
    getChartData($('.select-school-list:first li:first').attr('school-id'));



    var gpaDate,tofelDate,greDate,learningDate,recommendDate,prizeDate;

    function getChartData(id) {
        $.ajax({
            url: '/v1/Completeform/historyoffer.action',
            data: {
                id: id
            },
            type:'get',
            cache:false,
            dataType:'json',
            success:function(data){
                console.log(data);
                chartData = data.data;
                gpaDate = {
                    before : null,
                    now : {
                        data : chartData.gpa.data,  
                        myScore : chartData.gpa.user_data.x,
                        user_data: {
                            x: chartData.gpa.user_data.x,
                            y: chartData.gpa.user_data.y
                        },
                        max: {
                            x: chartData.gpa.max.x,
                            y: chartData.gpa.max.y
                        }  
                    }
                };

                tofelDate = {
                    before : null,
                    now : {
                        data : chartData.toefl.data,  
                        myScore : chartData.toefl.user_data.x,
                        user_data: {
                            x: chartData.toefl.user_data.x,
                            y: chartData.toefl.user_data.y
                        },
                        max: {
                            x: chartData.toefl.max.x,
                            y: chartData.toefl.max.y
                        }  
                    }

                };

                greDate = {
                    before : null,
                    now : {
                        data : chartData.gre.data,  
                        myScore : chartData.gre.user_data.x,
                        user_data: {
                            x: chartData.gre.user_data.x,
                            y: chartData.gre.user_data.y
                        },
                        max: {
                            x: chartData.gre.max.x,
                            y: chartData.gre.max.y 
                        },
                    }
                };

                learningDate = {
                    before : null,
                    now : {
                        ratio : chartData.science_paper
                    }
                };

                recommendDate = {
                    before : null,
                    now : {
                        ratio : chartData.recommend
                    }
                };

                prizeDate = {
                    before : null,
                    now: {
                        ratio : chartData.prize
                    }
                };

                chart();
                $('.select-dis-gpa span').html(getRatio(chartData.gpa.user_data.y));
                $('.select-dis-tofel span').html(getRatio(chartData.toefl.user_data.y));
                $('.select-dis-gre span').html(getRatio(chartData.gre.user_data.y));

                console.log(chartData.hard, chartData.soft, chartData.count)
                $('.select-school-chart .hardrate span').html(getRatio(chartData.hard));
                $('.select-school-chart .softrate span').html(getRatio(chartData.soft));
                $('.select-chart-summary li.countrate span').html(getRatio(chartData.count));
                $('.select-chart-summary span').html(getRatio(chartData.count));

            },
            error : function() {
                base.notice('网络错误');
            }
        })
    }


    //转换百分比
    function getRatio(num) {
        var str =  num*100
        console.log(str)
        var dot = str.toString().indexOf(".") ;
        if (dot !== -1) {
            return str.toString().slice(0, dot) + "%";
        } else {
            return str + "%";
        }
    }


    var select = {};
        select.nation = [];                                //国家
        select.locatioin = [];                             //地区
        select.pre_school = null;                          //之前学校
        select.school_type = null;                         //学校类别
        select.pre_major = null;                           //之前专业1
        select.pre_major2 = null;                          //之前专业2
        select.grade = null;                               //毕业时间
        select.related_major = null;                       //申请专业
        select.degree = null;                          //申请学位
        select.gpa = null;                                 //GPA
        select.language = null;                            //语言考试类型(前端判断用)
        select.toefl = null;                               //toefl overall
        select.toefl_r = null;                             //toefl r
        select.toefl_l = null;                             //toefl l
        select.toefl_s = null;                             //toefl s
        select.toefl_w = null;                             //toefl w
        select.ielts = null;                               //ielts overall
        select.ielts_r = null;                             //ielts r
        select.ielts_l = null;                             //ielts l
        select.ielts_s = null;                             //ielts s
        select.ielts_w = null;                             //ielts w
        select.exam = null;                                //标准化开始类型(前端判断用)
        select.gre = null;                                 //gre overall
        select.gre_v = null;                               //gre v
        select.gre_q = null;                               //gre q
        select.gre_aw = null;                              //gre aw
        select.gmat = null;                                //gmat overall
        select.gmat_v = null;                              //gmat v
        select.gmat_q = null;                              //gmat q
        select.gmat_aw = null;                             //gmat aw
        select.lsat = null;                                //lsat
        select.exchange = [0,0,0];                         //海外学习经历
        select.science_rank = [0,0,0];                     //科研经历
        select.science_rank_time = [0,0,0];                //科研经历子类
        select.recommend_rank = [0,0,0];                   //推荐信
        select.achievement = [0,0,0];                      //学术成就(前端判断用)
        select.international_paper_rank = [0,0,0];         //学术成就第一项
        select.international_paper_num = [0,0,0];          //学术成就第一项子类
        select.chinese_paper_rank = [0,0,0];               //学术成就第二项
        select.chinese_paper_num = [0,0,0];                //学术成就第二项子类
        select.meeting_paper_rank = [0,0];                 //学术成就第三项
        select.meeting_paper_num = [0,0];                  //学术成就第三项子类
        select.work_rank = [0,0,0];                        //工作学习经历
        select.work_time = [0,0,0];                        //工作学习经历子类
        select.prize = 0;                                  //获奖情况第一项
        select.match = 0;                                  //获奖情况第二项



    var boxCanClick = true;
    var height = [];  //每个模块的高度
    var scroll = []; //模拟滚动条
    $(function(){

        // chart();

        //模拟下拉
        $('.select-special').select();
        $('.science-select1').select();
        $('.science-select2').select();
        $('.work-select1').select();
        $('.work-select2').select();
        $('.prize-select1').select();
        $('.prize-select2').select();
        //模拟单选
        $('.select-school-type').radio();
        $('.select-major-only').radio();
        $('.select-degree').radio();
        $('.select-language').radio();
        $('.select-exam').radio();
        //模拟复选
        $('.select-exchange').check();
        $('.select-science').check();
        $('.select-recommend').check();
        $('.select-achievement').check();
        $('.select-work').check();
        $('.select-prize').check();

        //浮层
        if($('.select-form-view')[0]){
            openSelectView();
        }
        $('.select-form-view').on('click',function(e){
            e.stopPropagation();
        });
        $('.select-form-view button').on('click',function(){
            base.closeAll.closeSelectView();
        });
        //模块收缩初始化
        boxSlideUp();
        //模块展开/收缩
        $('.select-title-control').on('click',function(){
            if(!boxCanClick){
                return;
            }
            boxCanClick = false;
            var content = $(this).parents('.select-box').find('.select-content');
            var index = $('.select-box').index($(this).parents('.select-box'));
            if(!height[index]){
                height[index] = content.innerHeight();
            }
            else if(height[index]&&content.innerHeight()!== 0){
                height[index] = content.innerHeight();
            }
            if(content.css('height') == '0px'){
                $(this).removeClass('animated rotateDown').addClass('animated rotateUp');
                content.animate({height:height[index]},200,function(){
                    boxCanClick = true;
                });
            }
            else{
                $(this).removeClass('animated rotateUp').addClass('animated rotateDown');
                content.animate({height:0},200,function(){
                    boxCanClick = true;
                });
            }
        });
        //选择国家
        $('.select-country .select-preference-radio').on('click',function(){
            //已经选择
            if($(this).hasClass('active')){
                select.nation.splice(select.nation.indexOf($(this).data('value')),1);
                $(this).removeClass('active');
            }
            else{
                select.nation.push($(this).data('value'));
                $(this).addClass('active');
                $('.select-country .select-preference-title').removeClass('red');
            }
            preferenceFinished();
        });
        //选择地区
        $('.select-position .select-preference-radio').on('click',function(){
            if($(this).hasClass('active')){
                select.locatioin.splice(select.locatioin.indexOf($(this).data('value')),1);
                $(this).removeClass('active');
            }
            else{
                select.locatioin.push($(this).data('value'));
                $(this).addClass('active');
                $('.select-position .select-preference-title').removeClass('red');
            }
            preferenceFinished();
        });
        //毕业学校 输入
        $('.select-school').on('input propertychange',function(){
            selectSchool($(this).val());
        });
        //毕业学校 选择
        $('.select-info-school .form-select-option').on('click','li',function(){
            base.testSuccess($('.select-school'));
            $('.select-school').val($(this).html());
            $('.select-school').data('type',$(this).data('type'));
        });
        //毕业学校 失去焦点
        $('.select-school').on('blur',function(){
            var arr = [];
            for(var i=0;i<$('.select-info-school .form-select-option li').length;i++){
                arr.push($('.select-info-school .form-select-option li').eq(i).html())
            }
            if(arr.indexOf($('.select-school').val())==-1){
                select.pre_school = null;
                select.school_type = null;
                base.testFail($(this),'请从下拉列表中选择学校');
                return;
            }
            base.testSuccess($(this));
            select.pre_school = $(this).val();
            select.school_type = $(this).data('type');
            if(select.pre_school&&select.school_type){
                $('.select-info-school .form-item-name').removeClass('red');
            }
            infoFinished();
        });
        //毕业专业1 输入
        $('.select-major').on('input propertychange',function(){
            selectMajor($(this).val(),1);
        });
        //毕业专业1 选择
        $('.select-info-major .form-select-option').on('click','li',function(){
            base.testSuccess($('.select-major'));
            $('.select-major').val($(this).html());
        });
        //毕业专业1 失去焦点
        $('.select-major').on('blur',function(){
            var arr = [];
            for(var i=0;i<$('.select-info-major .form-select-option li').length;i++){
                arr.push($('.select-info-major .form-select-option li').eq(i).html())
            }
            if(arr.indexOf($('.select-major').val())==-1){
                select.pre_major = null;
                base.testFail($(this),'请从下拉列表中选择专业');
                return;
            }
            base.testSuccess($(this));
            select.pre_major = $(this).val();
            if(select.pre_major=='法学'){
                $('.select-form-lsat').removeClass('hidden');
                $('.select-exam').addClass('hidden');
            }
            else{
                $('.select-form-lsat').addClass('hidden');
                $('.select-exam').removeClass('hidden');
            }
            if(select.pre_major){
                $('.select-info-major .form-item-name').removeClass('red');
            }
            infoFinished();
        });
        //毕业专业2 输入
        $('.select-major2').on('input propertychange',function(){
            // $('.select-info-major2').find('.form-select-option').removeClass('hidden');  //测试
            selectMajor($(this).val(),2);
        });
        //毕业专业2 失去焦点
        $('.select-major2').on('blur',function(){
            var arr = [];
            for(var i=0;i<$('.select-info-major2 .form-select-option li').length;i++){
                select.pre_major2 = null;
                arr.push($('.select-info-major2 .form-select-option li').eq(i).html())
            }
            if(arr.indexOf($('.select-major2').val())==-1){
                base.testFail($(this),'请从下拉列表中选择专业');
                return;
            }
            base.testSuccess($(this));
            select.pre_major2 = $(this).val();
        });
        //毕业专业2 选择
        $('.select-info-major2 .form-select-option').on('click','li',function(){
            base.testSuccess($('.select-major2'));
            $('.select-major2').val($(this).html());

        });
        //毕业时间
        $('.select-school-type .form-radio').on('click',function(){
            select.grade = $(this).find('.form-radio-value').html();
            $('.select-school-type .form-item-name').removeClass('red');
            infoFinished();
        });
        //申请专业
        $('.select-major-only .form-radio').on('click',function(){
            if($(this).data('value')==1){
                $('.select-info-major2').removeClass('hidden');
            }
            else if($(this).data('value')==0){
                $('.select-info-major2').addClass('hidden');
            }
            select.related_major = $(this).data('value');
            $('.select-major-only .form-item-name').removeClass('red');
            infoFinished();
        });
        //申请学位
        $('.select-degree .form-radio').on('click',function(){
            select.degree = $(this).data('value');
            $('.select-degree .form-item-name').removeClass('red');
            infoFinished();
        });
        //GPA 强制两位小数
        $('.select-gpa').on('input propertychange',function(){
            var value = $(this).val();
            var reg = /.*\..*/;
            if(reg.test(value)){
                $(this).val(value.substring(0,value.indexOf(".") + 3));
            }
        });
        //GPA 失去焦点
        $('.select-gpa').on('blur',function(){
            $(this).testInput({
                rule : base.isDouble,
                success : function(dom){
                    if(dom.val()>100){
                        select.gpa = null;
                        base.testFail(dom,'您输入的分数有误');
                        return;
                    }
                    base.testSuccess(dom);
                    select.gpa = dom.val();
                },
                fail : function(dom){
                    select.gpa = null;
                    base.testFail(dom,'您输入的分数有误');
                }
            });
            if(select.gpa){
                $('.select-score-gpa .form-item-name').removeClass('red');
            }
            scoreFinished();
        });
        //语言考试 单选
        $('.select-language .form-radio').on('click',function(){
            if($('.select-language-input').hasClass('hidden')){
                height[2] = parseInt(height[2]+$('.select-language-input').innerHeight()+'px');
                $('.select-score').css('height',height[2]);
            }
            $('.select-language-input').removeClass('hidden');
            if($(this).find('.form-radio-value').html()=='TOEFL'){
                select.language = 'toefl';
                select.ielts = null;
                select.ielts_r = null;
                select.ielts_l = null;
                select.ielts_s = null;
                select.ielts_w = null;
            }
            else if($(this).find('.form-radio-value').html()=='IELTS'){
                select.language = 'ielts';
                select.toefl = null;
                select.toefl_r = null;
                select.toefl_l = null;
                select.toefl_s = null;
                select.toefl_w = null;
            }
            $('.select-language-input input').removeClass('error').val('');
        });
        //语言考试 overall
        $('.select-language-overall').on('input propertychange',function(){
            if(select.language=='toefl'){
                $(this).testInput({
                    rule : base.isInt,
                    success : function(dom){
                        if(dom.val()<0||dom.val()>120){
                            select.toefl = null;
                            base.testFail(dom,'TOFEL有效分值为0~120分');
                            return;
                        }
                        select.toefl = dom.val();
                        base.testSuccess(dom);
                    },
                    fail : function(dom){
                        select.toefl = null;
                        base.testFail(dom,'TOFEL有效分值为0~120分');
                    }
                });
            }
            else if(select.language=='ielts'){
                $(this).testInput({
                    rule : base.isFloat,
                    success : function(dom){
                        if(dom.val()<0||dom.val()>9){
                            select.ielts = null;
                            base.testFail(dom,'IELTS有效分值为0~9分');
                            return;
                        }
                        select.ielts = dom.val();
                        base.testSuccess(dom);
                    },
                    fail : function(dom){
                        select.ielts = null;
                        base.testFail(dom,'IELTS有效分值为0~9分');
                    }
                });
            }
        });
        //语言考试 R
        $('.select-language-r').on('input propertychange',function(){
            if(select.language=='toefl'){
                $(this).testInput({
                    rule : base.isInt,
                    success : function(dom){
                        if(dom.val()<0||dom.val()>30){
                            select.toefl_r = null;
                            base.testFail(dom,'TOFEL分项成绩有效分值为0~30分');
                            return;
                        }
                        select.toefl_r = dom.val();
                        base.testSuccess(dom);
                    },
                    fail : function(dom){
                        select.toefl_r = null;
                        base.testFail(dom,'TOFEL分项成绩有效分值为0~30分');
                    }
                });
            }
            else if(select.language=='ielts'){
                $(this).testInput({
                    rule : base.isFloat,
                    success : function(dom){
                        if(dom.val()<0||dom.val()>9){
                            select.ielts_r = null;
                            base.testFail(dom,'IELTS分项成绩有效分值为0~9');
                            return;
                        }
                        select.ielts_r = dom.val();
                        base.testSuccess(dom);
                    },
                    fail : function(dom){
                        select.ielts_r = null;
                        base.testFail(dom,'IELTS分项成绩有效分值为0~9');
                    }
                });
            }
        });
        //语言考试 L
        $('.select-language-l').on('input propertychange',function(){
            if(select.language=='toefl'){
                $(this).testInput({
                    rule : base.isInt,
                    success : function(dom){
                        if(dom.val()<0||dom.val()>30){
                            select.toefl_l = null;
                            base.testFail(dom,'TOFEL分项成绩有效分值为0~30分');
                            return;
                        }
                        select.toefl_l = dom.val();
                        base.testSuccess(dom);
                    },
                    fail : function(dom){
                        select.toefl_l = null;
                        base.testFail(dom,'TOFEL分项成绩有效分值为0~30分');
                    }
                });
            }
            else if(select.language=='ielts'){
                $(this).testInput({
                    rule : base.isFloat,
                    success : function(dom){
                        if(dom.val()<0||dom.val()>9){
                            select.ielts_l = null;
                            base.testFail(dom,'IELTS分项成绩有效分值为0~9');
                            return;
                        }
                        select.ielts_l = dom.val();
                        base.testSuccess(dom);
                    },
                    fail : function(dom){
                        select.ielts_l = null;
                        base.testFail(dom,'IELTS分项成绩有效分值为0~9');
                    }
                });
            }
        });
        //语言考试 S
        $('.select-language-s').on('input propertychange',function(){
            if(select.language=='toefl'){
                $(this).testInput({
                    rule : base.isInt,
                    success : function(dom){
                        if(dom.val()<0||dom.val()>30){
                            select.toefl_s = null;
                            base.testFail(dom,'TOFEL分项成绩有效分值为0~30分');
                            return;
                        }
                        select.toefl_s = dom.val();
                        base.testSuccess(dom);
                    },
                    fail : function(dom){
                        select.toefl_s = null;
                        base.testFail(dom,'TOFEL分项成绩有效分值为0~30分');
                    }
                });
            }
            else if(select.language=='ielts'){
                $(this).testInput({
                    rule : base.isFloat,
                    success : function(dom){
                        if(dom.val()<0||dom.val()>9){
                            select.ielts_s = null;
                            base.testFail(dom,'IELTS分项成绩有效分值为0~9');
                            return;
                        }
                        select.ielts_s = dom.val();
                        base.testSuccess(dom);
                    },
                    fail : function(dom){
                        select.ielts_s = null;
                        base.testFail(dom,'IELTS分项成绩有效分值为0~9');
                    }
                });
            }
        });
        //语言考试 W
        $('.select-language-w').on('input propertychange',function(){
            if(select.language=='toefl'){
                $(this).testInput({
                    rule : base.isInt,
                    success : function(dom){
                        if(dom.val()<0||dom.val()>30){
                            select.toefl_w = null;
                            base.testFail(dom,'TOFEL分项成绩有效分值为0~30分');
                            return;
                        }
                        select.toefl_w = dom.val();
                        base.testSuccess(dom);
                    },
                    fail : function(dom){
                        select.toefl_w = null;
                        base.testFail(dom,'TOFEL分项成绩有效分值为0~30分');
                    }
                });
            }
            else if(select.language=='ielts'){
                $(this).testInput({
                    rule : base.isFloat,
                    success : function(dom){
                        if(dom.val()<0||dom.val()>9){
                            select.ielts_w = null;
                            base.testFail(dom,'IELTS分项成绩有效分值为0~9');
                            return;
                        }
                        select.ielts_w = dom.val();
                        base.testSuccess(dom);
                    },
                    fail : function(dom){
                        select.ielts_w = null;
                        base.testFail(dom,'IELTS分项成绩有效分值为0~9');
                    }
                });
            }
        });
        //语言考试input显示错误提示
        $('.select-language-input input').on('focus',function(){
            if($(this).hasClass('error')){
                $(this).parent('.form-item').find('.form-item-notice').css('display','block');
            }
        });
        //语言考试input隐藏错误提示
        $('.select-language-input input').on('blur',function(){
            $(this).parent('.form-item').find('.form-item-notice').css('display','none');
            if(select.language=='toefl'){
                if(select.toefl&&select.toefl_r&&select.toefl_l&&select.toefl_s&&select.toefl_w){
                    $('.select-language .form-item-name').removeClass('red');
                }
            }
            else if(select.language=='ielts'){
                if(select.ielts&&select.ielts_r&&select.ielts_l&&select.ielts_s&&select.ielts_w){
                    $('.select-language .form-item-name').removeClass('red');
                }
            }
            scoreFinished();
        });

        //标准化考试 单选
        $('.select-exam .form-radio').on('click',function(){
            if($('.select-exam-input').hasClass('hidden')){
                height[2] = parseInt(height[2]+$('.select-exam-input').innerHeight()+'px');
                $('.select-score').css('height',height[2]);
            }
            $('.select-exam-input').removeClass('hidden');
            if($(this).find('.form-radio-value').html()=='GRE'){
                select.exam = 'gre';
                select.gmat = null;
                select.gmat_v = null;
                select.gmat_q = null;
                select.gmat_aw = null;
            }
            else if($(this).find('.form-radio-value').html()=='GMAT'){
                select.exam = 'gmat';
                select.gre = null;
                select.gre_v = null;
                select.gre_q = null;
                select.gre_aw = null;
            }
            $('.select-exam-input input').removeClass('error').val('');
        });
        //标准化考试 overall
        $('.select-exam-overall').on('input propertychange',function(){
            if(select.exam=='gre'){
                $(this).testInput({
                    rule : base.isInt,
                    success : function(dom){
                        if(dom.val()<0||dom.val()>340){
                            select.gre = null;
                            base.testFail(dom,'GRE有效分值为0~340');
                            return;
                        }
                        select.gre = dom.val();
                        base.testSuccess(dom);
                    },
                    fail : function(dom){
                        select.gre = null;
                        base.testFail(dom,'GRE有效分值为0~340');
                    }
                });
            }
            else if(select.exam=='gmat'){
                $(this).testInput({
                    rule : base.isInt,
                    success : function(dom){
                        if(dom.val()<200||dom.val()>800){
                            select.gmat = null;
                            base.testFail(dom,'GMAT有效分值为200~800');
                            return;
                        }
                        select.gmat = dom.val();
                        base.testSuccess(dom);
                    },
                    fail : function(dom){
                        select.gmat = null;
                        base.testFail(dom,'GMAT有效分值为200~800');
                    }
                });
            }
        });

        //标准化考试 V
        $('.select-exam-v').on('input propertychange',function(){
            if(select.exam=='gre'){
                $(this).testInput({
                    rule : base.isInt,
                    success : function(dom){
                        if(dom.val()<0||dom.val()>170){
                            select.gre_v = null;
                            base.testFail(dom,'GRE分项（V、Q ）成绩有效分值为0~170');
                            return;
                        }
                        select.gre_v = dom.val();
                        base.testSuccess(dom);
                    },
                    fail : function(dom){
                        select.gre_v = null;
                        base.testFail(dom,'GRE分项（V、Q ）成绩有效分值为0~170');
                    }
                });
            }
            else if(select.exam=='gmat'){
                $(this).testInput({
                    rule : base.isInt,
                    success : function(dom){
                        if(dom.val()<0||dom.val()>60){
                            select.gmat_v = null;
                            base.testFail(dom,'GMAT分项（V、Q) 有效成绩分值为0~60');
                            return;
                        }
                        select.gmat_v = dom.val();
                        base.testSuccess(dom);
                    },
                    fail : function(dom){
                        select.gmat_v = null;
                        base.testFail(dom,'GMAT分项（V、Q) 有效成绩分值为0~60');
                    }
                });
            }
        });

        //标准化考试 Q
        $('.select-exam-q').on('input propertychange',function(){
            if(select.exam=='gre'){
                $(this).testInput({
                    rule : base.isInt,
                    success : function(dom){
                        if(dom.val()<0||dom.val()>170){
                            select.gre_q = null;
                            base.testFail(dom,'GRE分项（V、Q ）成绩有效分值为0~170');
                            return;
                        }
                        select.gre_q = dom.val();
                        base.testSuccess(dom);
                    },
                    fail : function(dom){
                        select.gre_q = null;
                        base.testFail(dom,'GRE分项（V、Q ）成绩有效分值为0~170');
                    }
                });
            }
            else if(select.exam=='gmat'){
                $(this).testInput({
                    rule : base.isInt,
                    success : function(dom){
                        if(dom.val()<0||dom.val()>60){
                            select.gmat_q = null;
                            base.testFail(dom,'GMAT分项（V、Q) 有效成绩分值为0~60');
                            return;
                        }
                        select.gmat_q = dom.val();
                        base.testSuccess(dom);
                    },
                    fail : function(dom){
                        select.gmat_q = null;
                        base.testFail(dom,'GMAT分项（V、Q) 有效成绩分值为0~60');
                    }
                });
            }
        });

        //标准化考试 AW
        $('.select-exam-aw').on('input propertychange',function(){
            if(select.exam=='gre'){
                $(this).testInput({
                    rule : base.isFloat,
                    success : function(dom){
                        if(dom.val()<0||dom.val()>6){
                            select.gre_aw = null;
                            base.testFail(dom,'AW有效成绩分值为0~6');
                            return;
                        }
                        select.gre_aw = dom.val();
                        base.testSuccess(dom);
                    },
                    fail : function(dom){
                        select.gre_aw = null;
                        base.testFail(dom,'AW有效成绩分值为0~6');
                    }
                });
            }
            else if(select.exam=='gmat'){
                $(this).testInput({
                    rule : base.isFloat,
                    success : function(dom){
                        if(dom.val()<0||dom.val()>6){
                            select.gmat_aw = null;
                            base.testFail(dom,'AW有效成绩分值为0~6');
                            return;
                        }
                        select.gmat_aw = dom.val();
                        base.testSuccess(dom);
                    },
                    fail : function(dom){
                        select.gmat_aw = null;
                        base.testFail(dom,'AW有效成绩分值为0~6');
                    }
                });
            }
        });
        //标准化考试input显示错误提示
        $('.select-exam-input input').on('focus',function(){
            if($(this).hasClass('error')){
                $(this).parent('.form-item').find('.form-item-notice').css('display','block');
            }
        });
        //标准化考试input隐藏错误提示
        $('.select-exam-input input').on('blur',function(){
            $(this).parent('.form-item').find('.form-item-notice').css('display','none');
            if(select.exam=='gre'){
                if(select.gre&&select.gre_v&&select.gre_q&&select.gre_aw){
                    $('.select-exam .form-item-name').removeClass('red');
                }
            }
            else if(select.exam=='gmat'){
                if(select.gmat&&select.gmat_v&&select.gmat_q&&select.gmat_aw){
                    $('.select-exam .form-item-name').removeClass('red');
                }
            }
            scoreFinished();
        });

        //LSAT
        $('.select-lsat').on('blur',function(){
            if($('.select-lsat').val()==0){
                select.lsat = 0;
                base.testSuccess($(this));
            }
            else{
                $(this).testInput({
                    rule : base.isInt,
                    success : function(dom){
                        if(dom.val()>180||dom.val()<120){
                            select.lsat = null;
                            base.testFail(dom,'LAST有效分值为120~180');
                            return;
                        }
                        select.lsat = dom.val();
                        base.testSuccess(dom);
                    },
                    fail : function(dom){
                        select.lsat = null;
                        base.testFail(dom,'LAST有效分值为120~180');
                    }
                });
            }
            console.log(select.lsat!==null)
            if(select.lsat!==null){
                $('.select-form-lsat .form-item-name').removeClass('red');
            }
            scoreFinished();
        });
        //海外学习
        $('.select-exchange .form-check').on('click',function(){
            var n = $(this).parents('.select-exchange').find('.form-check').index($(this));
            if(select.exchange[n]==0){
                select.exchange[n] = $(this).data('value');
            }
            else{
                select.exchange[n] = 0;
            }
        });
        //科研经历 选择
        $('.select-science .form-check').on('click',function(){
            var n = $(this).parents('.select-science').find('.form-check').index($(this));
            if(select.science_rank[n]==0){
                $(this).find('.form-select').removeClass('hidden');
                if($(this).find('.form-select')[0]){
                    height[3] = parseInt(height[3])+$(this).find('.form-select').innerHeight()+'px';
                }
                select.science_rank[n] = $(this).data('value');
                if(n==2){
                    select.science_rank_time[n] = 1;
                }
                else{
                    select.science_rank_time[n] = $(this).find('.form-select-option li').eq(0).data('value');
                }
            }
            else{
                $(this).find('.form-select').addClass('hidden');
                if($(this).find('.form-select')[0]){
                    height[3] = parseInt(height[3])-$(this).find('.form-select').innerHeight()+'px';
                }
                select.science_rank[n] = 0;
                select.science_rank_time[n] = 0;
            }
            $('.select-other').css('height',height[3]);
        });
        //科研经历 下拉
        $('.select-science .form-select').on('click',function(e){
            e.stopPropagation();
        });
        $('.select-science .form-select-option li').on('click',function(e){
            e.stopPropagation();
            var val = $(this).data('value');
            var n = $(this).parents('.form-item').find('.form-select').index($(this).parents('.form-select'));
            select.science_rank_time[n] = val;
        });
        //推荐信
        $('.select-recommend .form-check').on('click',function(){
            var n = $(this).parents('.select-recommend').find('.form-check').index($(this));
            if(select.recommend_rank[n]==0){
                select.recommend_rank[n] = $(this).data('value');
            }
            else{
                select.recommend_rank[n] = 0;
            }
            console.log(select.recommend_rank)
        });
        //学术成就
        $('.select-achievement .form-check').on('click',function(){
            var n = $(this).parents('.select-achievement').find('.form-check').index($(this));
            switch (n){
                case 0:
                    if($(this).find('.form-check-input').hasClass('hidden')){
                        $(this).find('.form-check-input').removeClass('hidden');
                        height[3] = parseInt(height[3])+$(this).find('.form-check-input').innerHeight()+'px';
                        $('.select-other').css('height',height[3]);
                        select.achievement[n] = 1;
                    }
                    else{
                        $(this).find('.form-check-input').addClass('hidden');
                        height[3] = parseInt(height[3])-$(this).find('.form-check-input').innerHeight()+'px';
                        $('.select-other').css('height',height[3]);
                        $(this).find('.form-check-input input').val('');
                        base.testSuccess($(this).find('input'));
                        select.achievement[n] = 0;
                        select.international_paper_rank = [0,0,0];
                        select.international_paper_num = [0,0,0];
                    }
                    break;
                case 1:
                    if($(this).find('.form-check-input').hasClass('hidden')){
                        $(this).find('.form-check-input').removeClass('hidden');
                        height[3] = parseInt(height[3])+$(this).find('.form-check-input').innerHeight()+'px';
                        $('.select-other').css('height',height[3]);
                        select.achievement[n] = 1;
                    }
                    else{
                        $(this).find('.form-check-input').addClass('hidden');
                        height[3] = parseInt(height[3])-$(this).find('.form-check-input').innerHeight()+'px';
                        $('.select-other').css('height',height[3]);
                        $(this).find('.form-check-input input').val('');
                        base.testSuccess($(this).find('input'));
                        select.achievement[n] = 0;
                        select.chinese_paper_rank = [0,0,0];
                        select.chinese_paper_num = [0,0,0];
                    }
                    break;
                case 2:
                    if($(this).find('.form-check-input').hasClass('hidden')){
                        $(this).find('.form-check-input').removeClass('hidden');
                        height[3] = parseInt(height[3])+$(this).find('.form-check-input').innerHeight()+'px';
                        $('.select-other').css('height',height[3]);
                        select.achievement[n] = 1;
                    }
                    else{
                        $(this).find('.form-check-input').addClass('hidden');
                        height[3] = parseInt(height[3])-$(this).find('.form-check-input').innerHeight()+'px';
                        $('.select-other').css('height',height[3]);
                        $(this).find('.form-check-input input').val('');
                        base.testSuccess($(this).find('input'));
                        select.achievement[n] = 0;
                        select.meeting_paper_rank = [0,0];
                        select.meeting_paper_num = [0,0];
                    }
                    break;
            }
            if(select.achievement[n]==0&&select.achievement[1]==0&&select.achievement[2]==0){
                $('.select-box').eq(3).find('.select-title').removeClass('error');
                $('.select-achievement .form-item-name').eq(0).removeClass('red');
            }
        });
        //学术成就 input
        $('.select-achievement .form-check-input').on('click',function(e){
            e.stopPropagation();
        });
        $('.select-achievement .form-check-input input').on('blur',function(){
            $(this).testInput({
                rule : base.isInt,
                success : function(dom){
                    var val = parseInt(dom.val());
                    var n = dom.parents('.form-check-input').find('input').index(dom);
                    var num = dom.parents('.select-achievement').find('.form-check').index(dom.parents('.form-check'));
                    switch (num){
                        case 0:
                            select.international_paper_rank[n] = dom.data('value');
                            select.international_paper_num[n] = val;
                            break;
                        case 1:
                            select.chinese_paper_rank[n] = dom.data('value');
                            select.chinese_paper_num[n] = val;
                            break;
                        case 2:
                            select.meeting_paper_rank[n] = dom.data('value');
                            select.meeting_paper_num[n] = val;
                            break;
                    }
                    base.testSuccess(dom);
                },
                fail : function(dom){
                    var n = dom.parents('.form-check-input').find('input').index(dom);
                    var num = dom.parents('.select-achievement').find('.form-check').index(dom.parents('.form-check'));
                    switch (num){
                        case 0:
                            select.international_paper_rank[n] = 0;
                            select.international_paper_num[n] = 0;
                            break;
                        case 1:
                            select.chinese_paper_rank[n] = 0;
                            select.chinese_paper_num[n] = 0;
                            break;
                        case 2:
                            select.meeting_paper_rank[n] = 0;
                            select.meeting_paper_num[n] = 0;
                            break;
                    }
                    base.testFail(dom,'请输入整数数字');
                }
            });
            function isRight(arr){
                for(var i=0;i<arr.length;i++){
                    if(arr[i]>0){
                        return true;
                    }
                }
                return false;
            }
            if(select.achievement[0]==1&&!isRight(select.international_paper_num)){
                return;
            }
            if(select.achievement[1]==1&&!isRight(select.chinese_paper_num)){
                return;
            }
            if(select.achievement[2]==1&&!isRight(select.meeting_paper_num)){
                return;
            }
            $('.select-box').eq(3).find('.select-title').removeClass('error');
            $('.select-achievement .form-item-name').eq(0).removeClass('red');
        });

        //工作/实习经历 选择
        $('.select-work .form-check').on('click',function(){
            var n = $(this).parents('.select-work').find('.form-check').index($(this));
            if(select.work_rank[n]==0){
                $(this).find('.form-select').removeClass('hidden');
                if($(this).find('.form-select')[0]){
                    height[3] = parseInt(height[3])+$(this).find('.form-select').innerHeight()+'px';
                }
                select.work_rank[n] = $(this).data('value');
                if(n==2){
                    select.work_time[n] = 1;
                }
                else{
                    select.work_time[n] = $(this).find('.form-select-option li').eq(0).data('value');
                }
            }
            else{
                $(this).find('.form-select').addClass('hidden');
                if($(this).find('.form-select')[0]){
                    height[3] = parseInt(height[3])-$(this).find('.form-select').innerHeight()+'px';
                }
                select.work_rank[n] = 0;
                select.work_time[n] = 0;
            }
            $('.select-other').css('height',height[3]);
        });
        //工作/实习经历 下拉
        $('.select-work .form-select').on('click',function(e){
            e.stopPropagation();
        });
        $('.select-work .form-select-option li').on('click',function(e){
            e.stopPropagation();
            var val = $(this).index()+1;
            var n = $(this).parents('.form-item').find('.form-select').index($(this).parents('.form-select'));
            select.work_time[n] = val;
        });

        //获奖情况 选择
        $('.select-prize .form-check').on('click',function(){
            var n = $(this).parents('.select-prize').find('.form-check').index($(this));
            switch(n){
                case 0:
                    if($(this).find('.form-select').hasClass('hidden')){
                        $(this).find('.form-select').removeClass('hidden');
                        height[3] = parseInt(height[3])+$(this).find('.form-select').innerHeight()+'px';
                        $('.select-other').css('height',height[3]);
                    }
                    else{
                        $(this).find('.form-select').addClass('hidden');
                        height[3] = parseInt(height[3])-$(this).find('.form-select').innerHeight()+'px';
                        $('.select-other').css('height',height[3]);
                        select.prize = 0;
                    }
                    break;
                case 1:
                    if($(this).find('.form-select').hasClass('hidden')){
                        $(this).find('.form-select').removeClass('hidden');
                        height[3] = parseInt(height[3])+$(this).find('.form-select').innerHeight()+'px';
                        $('.select-other').css('height',height[3]);
                    }
                    else{
                        $(this).find('.form-select').addClass('hidden');
                        height[3] = parseInt(height[3])-$(this).find('.form-select').innerHeight()+'px';
                        $('.select-other').css('height',height[3]);
                        select.match = 0;
                    }
                    break;
            }
        });
        //获奖情况 下拉
        $('.select-prize .form-select').on('click',function(e){
            e.stopPropagation();
        });
        $('.select-prize .form-select-option li').on('click',function(e){
            e.stopPropagation();
            var val = $(this).data('value');
            var num = $(this).parents('.form-item').find('.form-select').index($(this).parents('.form-select'));
            switch(num){
                case 0:
                    select.prize = $(this).data('value');
                    break;
                case 1:
                    select.match = $(this).data('value');
                    break;
            }
            console.log(select.prize)
            console.log(select.match)
        });

        $('.select-submit').on('click',function(){
            submitSelect();
        });


        //切换学校类型
        $('.select-school').tab();
        //学校鼠标移入
        $('.school-list-main').on('mouseenter',function(){
            if($(this).parent('li').hasClass('active')){
                return;
            }
            $(this).animate({marginTop:0},200);
            $(this).find('.school-list-info').animate({height:40},200);
            $(this).find('.school-list-mask').fadeIn(200);
        }).on('mouseleave',function(){
            if($(this).parent('li').hasClass('active')){
                $(this).find('.school-list-mask').fadeOut(200);
                return;
            }
            $(this).animate({marginTop:40},200);
            $(this).find('.school-list-info').animate({height:0},200);
            $(this).find('.school-list-mask').fadeOut(200);
        });
        //加入取消申请
        $('.switch-box').on('click',function(){
            if($(this).hasClass('on')){
                $(this).find('img').animate({left:0},100);
                $(this).removeClass('on').addClass('off');
                $(this).parent('.school-list-switch').find('span').html('点击加入申请');
            }
            else if($(this).hasClass('off')){
                $(this).find('img').animate({left:26},100);
                $(this).removeClass('off').addClass('on');
                $(this).parent('.school-list-switch').find('span').html('点击取消申请');
            }
        });
        //切换学校图表
        $('.school-list-main').on('click',function(){
            if($(this).parent('li').hasClass('active')){
                return;
            }
            $('.select-school-list li.active').find('.school-list-main').animate({marginTop:40},200);
            $('.select-school-list li.active').find('.school-list-info').animate({height:0},200);
            $('.select-school-list li').removeClass('active');
            $(this).parent('li').addClass('active');
            console.log($(this).find('.school-list-rank').html())
            $(this).parents('.tab-box').find('.select-school-rank').html($(this).parent('li').find('.school-list-rank').html());
            //请求接口获取图表

            var id = $(this).parent('li').attr('school-id');
            console.log(id);
            // getChartData(id)
            // function getChartData(id) {
                $.ajax({
                    url: '/v1/Completeform/historyoffer.action',
                    data: {
                        id: id
                    },
                    type:'get',
                    cache:false,
                    dataType:'json',
                    success:function(data){
                        console.log(data);
                        chartData = data.data;
                        gpaDate = {
                            now : {
                                data : chartData.gpa.data,  
                                myScore : chartData.gpa.user_data.x,
                                user_data: {
                                    x: chartData.gpa.user_data.x,
                                    y: chartData.gpa.user_data.y
                                },
                                max: {
                                    x: chartData.gpa.max.x,
                                    y: chartData.gpa.max.y
                                }  
                            }
                        };

                        tofelDate = {
                            now : {
                                data : chartData.toefl.data,  
                                myScore : chartData.toefl.user_data.x,
                                user_data: {
                                    x: chartData.toefl.user_data.x,
                                    y: chartData.toefl.user_data.y
                                },
                                max: {
                                    x: chartData.toefl.max.x,
                                    y: chartData.toefl.max.y
                                }  
                            }

                        };

                        greDate = {
                            now : {
                                data : chartData.gre.data,  
                                myScore : chartData.gre.user_data.x,
                                user_data: {
                                    x: chartData.gre.user_data.x,
                                    y: chartData.gre.user_data.y
                                },
                                max: {
                                    x: chartData.gre.max.x,
                                    y: chartData.gre.max.y 
                                },
                            }
                        };

                        learningDate = {
                            now : {
                                ratio : chartData.science_paper
                            }
                        };

                        recommendDate = {
                            now : {
                                ratio : chartData.recommend
                            }
                        };

                        prizeDate = {
                            now: {
                                ratio : chartData.prize
                            }
                        };

                        chart();
                        $('.select-dis-gpa span').html(getRatio(chartData.gpa.user_data.y));
                        $('.select-dis-tofel span').html(getRatio(chartData.toefl.user_data.y));
                        $('.select-dis-gre span').html(getRatio(chartData.gre.user_data.y));

                        console.log(chartData.hard, chartData.soft, chartData.count)
                        $('.select-school-chart .hardrate span').html(getRatio(chartData.hard));
                        $('.select-school-chart .softrate span').html(getRatio(chartData.soft));
                        $('.select-chart-summary li.countrate span').html(getRatio(chartData.count));
                        $('.select-chart-summary span').html(getRatio(chartData.count));

                    },
                    error : function() {
                        base.notice('网络错误');
                    }
                })
            })


        // });
        //加入申请
        $('.select-school-switch').on('click',function(e){
            e.stopPropagation();
            if($(this).hasClass('active')){
                $(this).removeClass('active');
            }
            else{
                $(this).addClass('active');
            }
        })

    });

    //打开预览
    function openSelectView(){
        base.openMask();
        $('body').css('overflow','hidden');
        $('.select-form-view').removeClass('hidden').addClass('animated fadeInDown').one(base.animationend,function(){
            $('.select-form-view').removeClass('animated fadeInDown');
        });
    }
    //关闭预览
    base.closeAll.closeSelectView = function(){
        base.closeMask();
        $('body').css('overflow','auto');
        $('.select-form-view').addClass('animated fadeOutUp').one(base.animationend,function(){
            $('.select-form-view').removeClass('animated fadeOutUp').addClass('hidden');
        });
    };
    //模块收缩初始化
    function boxSlideUp(){
        var content = $('.select-box .select-content');
        for(var i=1;i<content.length;i++){
            height[i] = content.eq(i).innerHeight();
            content.eq(i).css('height',0);
            content.eq(i).parents('.select-box').find('.select-title-control').addClass('animated rotateDown');
        }
    }

    //申请偏好填写完毕
    function preferenceFinished(){
        if(select.nation.length>0&&select.locatioin.length>0){
            if($('.select-box').eq(0).find('.select-title').hasClass('error')){
                $('.select-box').eq(0).find('.select-title').removeClass('error');
            }
            else{
                if($('.select-box').eq(1).find('.select-content').css('height')=='0px'){
                    $('.select-box').eq(1).find('.select-title-control').click();
                }
            }
        }
    }
    function infoFinished(){
        if(select.pre_school&&select.school_type&&select.pre_major&&select.grade&&select.related_major!==null&&select.degree){
            if($('.select-box').eq(1).find('.select-title').hasClass('error')){
                $('.select-box').eq(1).find('.select-title').removeClass('error');
            }
            else{
                if($('.select-box').eq(2).find('.select-content').css('height')=='0px'){
                    $('.select-box').eq(2).find('.select-title-control').click();
                }
            }
        }
    }
    //考试成绩填写完毕

    function scoreFinished(){
        if(select.pre_major=='法学'){
            if(select.language=='toefl'){
                if(select.gpa&&select.toefl&&select.toefl_r&&select.toefl_l&&select.toefl_s&&select.toefl_w&&(select.lsat!==null)){
                    if($('.select-box').eq(2).find('.select-title').hasClass('error')){
                        $('.select-box').eq(2).find('.select-title').removeClass('error');
                    }
                    else{
                        if($('.select-box').eq(3).find('.select-content').css('height')=='0px'){
                            $('.select-box').eq(3).find('.select-title-control').click();
                        }
                    }
                }
            }
            else if(select.language=='ielts'){
                if(select.gpa&&select.ielts&&select.ielts_r&&select.ielts_l&&select.ielts_s&&select.ielts_w&&select.lsat!==null){
                    if($('.select-box').eq(2).find('.select-title').hasClass('error')){
                        $('.select-box').eq(2).find('.select-title').removeClass('error');
                    }
                    else{
                        if($('.select-box').eq(3).find('.select-content').css('height')=='0px'){
                            $('.select-box').eq(3).find('.select-title-control').click();
                        }
                    }
                }
            }
        }
        else{
            if(select.language=='toefl'){
                if(select.exam=='gre'){
                    if(select.gpa&&select.toefl&&select.toefl_r&&select.toefl_l&&select.toefl_s&&select.toefl_w&&select.gre&&select.gre_v&&select.gre_q&&select.gre_aw){
                        if($('.select-box').eq(2).find('.select-title').hasClass('error')){
                            $('.select-box').eq(2).find('.select-title').removeClass('error');
                        }
                        else{
                            if($('.select-box').eq(3).find('.select-content').css('height')=='0px'){
                                $('.select-box').eq(3).find('.select-title-control').click();
                            }
                        }
                    }
                }
                else if(select.exam=='gmat'){
                    if(select.gpa&&select.toefl&&select.toefl_r&&select.toefl_l&&select.toefl_s&&select.toefl_w&&select.gmat&&select.gmat_v&&select.gmat_q&&select.gmat_aw){
                        if($('.select-box').eq(2).find('.select-title').hasClass('error')){
                            $('.select-box').eq(2).find('.select-title').removeClass('error');
                        }
                        else{
                            if($('.select-box').eq(3).find('.select-content').css('height')=='0px'){
                                $('.select-box').eq(3).find('.select-title-control').click();
                            }
                        }
                    }
                }
            }
            else if(select.language=='ielts'){
                if(select.exam=='gre'){
                    if(select.gpa&&select.ielts&&select.ielts_r&&select.ielts_l&&select.ielts_s&&select.ielts_w&&select.gre&&select.gre_v&&select.gre_q&&select.gre_aw){
                        if($('.select-box').eq(2).find('.select-title').hasClass('error')){
                            $('.select-box').eq(2).find('.select-title').removeClass('error');
                        }
                        else{
                            if($('.select-box').eq(3).find('.select-content').css('height')=='0px'){
                                $('.select-box').eq(3).find('.select-title-control').click();
                            }
                        }
                    }
                }
                else if(select.exam=='gmat'){
                    if(select.gpa&&select.ielts&&select.ielts_r&&select.ielts_l&&select.ielts_s&&select.ielts_w&&select.gmat&&select.gmat_v&&select.gmat_q&&select.gmat_aw){
                        if($('.select-box').eq(2).find('.select-title').hasClass('error')){
                            $('.select-box').eq(2).find('.select-title').removeClass('error');
                        }
                        else{
                            if($('.select-box').eq(3).find('.select-content').css('height')=='0px'){
                                $('.select-box').eq(3).find('.select-title-control').click();
                            }
                        }
                    }
                }
            }
        }
    }

    function selectSchool(school){
        $.ajax({
            url:'/completeform/chinaschool.action',
            data:{
                schoolname : school
            },
            type:'post',
            cache:false,
            dataType:'html',
            success:function(data){
                $('#select-school ul').html(data);
                $('.select-info-school').find('.form-select-option').removeClass('hidden');
                if(!scroll[0]){
                    scroll[0] = new iscroll('#select-school',{
                        mouseWheel : true,
                        scrollbars : true,
                        interactiveScrollbars : true
                    });
                }
                else{
                    scroll[0].refresh();
                }
            },
            error : function() {
                base.notice('网络错误');
            }
        });
    }

    function selectMajor(major,n){
        $.ajax({
            url:'/completeform/chinamajor.action',
            data:{
                majorname: major
            },
            type:'post',
            cache:false,
            dataType:'html',
            success:function(data){
                if( n==1 ) {
                    $('#select-major ul').html(data);
                    $('.select-info-major').find('.form-select-option').removeClass('hidden');
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
                } else if(n==2) {
                    $('#select-major2 ul').html(data);
                    $('.select-info-major2').find('.form-select-option').removeClass('hidden');
                    if(!scroll[2]){
                        scroll[2] = new iscroll('#select-major2',{
                            mouseWheel : true,
                            scrollbars : true,
                            interactiveScrollbars : true
                        });
                    }
                    else{
                        scroll[2].refresh();
                    }
                }
            },
            error : function() {
                base.notice('网络错误');
            }
        });
    }

    function submitSelect(){
        if(select.nation.length<=0||select.locatioin<=0){
            $('.select-box').eq(0).find('.select-title').addClass('error');
            if(parseInt($('.select-box').eq(0).find('.select-content').css('height'))==0){
                boxCanClick = true;
                $('.select-box').eq(0).find('.select-title-control').click();
            }
            if(select.nation.length<=0){
                $('.select-country .select-preference-title').addClass('red');
            }
            if(select.locatioin.length<=0){
                $('.select-position .select-preference-title').addClass('red');
            }
        }
        else{
            if(parseInt($('.select-box').eq(0).find('.select-content').css('height'))>0){
                boxCanClick = true;
                $('.select-box').eq(0).find('.select-title-control').click();
            }
        }
        if(!select.pre_school||!select.school_type||!select.pre_major||!select.grade||select.related_major==null||!select.degree){
            $('.select-box').eq(1).find('.select-title').addClass('error');
            if(parseInt($('.select-box').eq(1).find('.select-content').css('height'))==0){
                boxCanClick = true;
                $('.select-box').eq(1).find('.select-title-control').click();
            }
            if(!select.pre_school||!select.school_type){
                $('.select-info-school .form-item-name').addClass('red');
            }
            if(!select.pre_major){
                $('.select-info-major .form-item-name').addClass('red');
            }
            if(!select.grade){
                $('.select-school-type .form-item-name').addClass('red');
            }
            if(!select.related_major){
                $('.select-major-only .form-item-name').addClass('red');
            }
            if(!select.degree){
                $('.select-degree .form-item-name').addClass('red');
            }
        }
        else{
            if(parseInt($('.select-box').eq(1).find('.select-content').css('height'))>0){
                boxCanClick = true;
                $('.select-box').eq(1).find('.select-title-control').click();
            }
        }
        var language = {};
        language.overall = null;
        language.R = null;
        language.L = null;
        language.S = null;
        language.W = null;
        var exam = {};
        exam.overall = null;
        exam.V = null;
        exam.Q = null;
        exam.AW = null;
        if(select.language == 'toefl'){
            language.overall = select.toefl;
            language.R = select.toefl_r;
            language.L = select.toefl_l;
            language.S = select.toefl_s;
            language.W = select.toefl_w;
        }
        else if(select.language == 'ielts'){
            language.overall = select.ielts;
            language.R = select.ielts_r;
            language.L = select.ielts_l;
            language.S = select.ielts_s;
            language.W = select.ielts_w;
        }
        if(select.exam == 'gre'){
            exam.overall = select.gre;
            exam.V = select.gre_v;
            exam.Q = select.gre_q;
            exam.AW = select.gre_aw;
        }
        else if(select.exam == 'gmat'){
            exam.overall = select.gmat;
            exam.V = select.gmat_v;
            exam.Q = select.gmat_q;
            exam.AW = select.gmat_aw;
        }
        if(select.pre_major=='法学'){
            if(!select.gpa||!select.language||!language.overall||!language.R||!language.L||!language.S||!language.W||select.lsat==null){
                $('.select-box').eq(2).find('.select-title').addClass('error');
                if(parseInt($('.select-box').eq(2).find('.select-content').css('height'))==0){
                    boxCanClick = true;
                    $('.select-box').eq(2).find('.select-title-control').click();
                }
                if(!select.gpa){
                    $('.select-score-gpa .form-item-name').addClass('red');
                }
                if($.isEmptyObject(select.language)||!language.overall||!language.R||!language.L||!language.S||!language.W){
                    $('.select-language .form-item-name').addClass('red');
                }
                if(select.lsat==null){
                    $('.select-form-lsat .form-item-name').addClass('red');
                }
            }
            else{
                if(parseInt($('.select-box').eq(2).find('.select-content').css('height'))>0){
                    boxCanClick = true;
                    $('.select-box').eq(2).find('.select-title-control').click();
                }
            }
        }
        else{
            if(!select.gpa||!select.language||!language.overall||!language.R||!language.L||!language.S||!language.W||!select.exam||!exam.overall||!exam.V||!exam.Q||!exam.AW){
                $('.select-box').eq(2).find('.select-title').addClass('error');
                if(parseInt($('.select-box').eq(2).find('.select-content').css('height'))==0){
                    boxCanClick = true;
                    $('.select-box').eq(2).find('.select-title-control').click();
                }
                if(!select.gpa){
                    $('.select-score-gpa .form-item-name').addClass('red');
                }
                if($.isEmptyObject(select.language)||!language.overall||!language.R||!language.L||!language.S||!language.W){
                    $('.select-language .form-item-name').addClass('red');
                }
                if($.isEmptyObject(select.exam_score)||!exam.overall||!exam.V||!exam.Q||!exam.AW){
                    $('.select-exam .form-item-name').addClass('red');
                }
            }
            else{
                if(parseInt($('.select-box').eq(2).find('.select-content').css('height'))>0){
                    boxCanClick = true;
                    $('.select-box').eq(2).find('.select-title-control').click();
                }
            }
        }

        function isRight(arr){
            for(var i=0;i<arr.length;i++){
                if(arr[i]>0){
                    return true;
                }
            }
            return false;
        }
        var achievement = [0,0,0];
        if(select.achievement[0]==1&&!isRight(select.international_paper_num)){
            achievement[0] = 0;
        }
        else{
            achievement[0] = 1;
        }
        if(select.achievement[1]==1&&!isRight(select.chinese_paper_num)){
            achievement[1] = 0;
        }
        else{
            achievement[1] = 1;
        }
        if(select.achievement[2]==1&&!isRight(select.meeting_paper_num)){
            achievement[2] = 0;
        }
        else{
            achievement[2] = 1;
        }
        if(achievement[0]==1&&achievement[1]==1&&achievement[2]==1){
            if(parseInt($('.select-box').eq(3).find('.select-content').css('height'))>0){
                boxCanClick = true;
                $('.select-box').eq(3).find('.select-title-control').click();
            }
        }
        else{
            $('.select-box').eq(3).find('.select-title').addClass('error');
            $('.select-achievement .form-item-name').eq(0).addClass('red');
            if(parseInt($('.select-box').eq(3).find('.select-content').css('height'))==0){
                boxCanClick = true;
                $('.select-box').eq(3).find('.select-title-control').click();
            }
        }

        if($('.select-title').hasClass('error')){
            $('.notice').addClass('red');
            base.notice('页面中有必填项未填，请检查',function(){
                $('.notice').removeClass('red');
            });
            return;
        }

        $.ajax({
            url:'/v1/completeform/saveform.action',
            data:{
                nation : select.nation,
                locatioin : select.locatioin,
                pre_school : select.pre_school,
                school_type : select.school_type,
                pre_major : select.pre_major,
                pre_major2 : select.pre_major2,
                grade : select.grade,
                related_major : select.related_major,
                degree : select.degree,
                gpa : select.gpa,
                toefl : select.toefl,
                toefl_r : select.toefl_r,
                toefl_l : select.toefl_l,
                toefl_s : select.toefl_s,
                toefl_w : select.toefl_w,
                ielts : select.ielts,
                ielts_r : select.ielts_r,
                ielts_l : select.ielts_l,
                ielts_s : select.ielts_s,
                ielts_w : select.ielts_w,
                gre : select.gre,
                gre_v : select.gre_v,
                gre_q : select.gre_q,
                gre_aw : select.gre_aw,
                gmat : select.gmat,
                gmat_v : select.gmat_v,
                gmat_q : select.gmat_q,
                gmat_aw : select.gmat_aw,
                lsat : select.lsat,
                exchange : select.exchange,
                science_rank : select.science_rank,
                science_rank_time : select.science_rank_time,
                recommend_rank : select.recommend_rank,
                international_paper_rank : select.international_paper_rank,
                international_paper_num : select.international_paper_num,
                chinese_paper_rank : select.chinese_paper_rank,
                chinese_paper_num : select.chinese_paper_num,
                meeting_paper_rank : select.meeting_paper_rank,
                meeting_paper_num : select.meeting_paper_num,
                work_rank : select.work_rank,
                work_time : select.work_time,
                prize : select.prize,
                match : select.match
    },
            type:'post',
            cache:false,
            dataType:'json',
            success:function(data){
                console.log(data);
                //window.location.href = "/select-school";
            },
            error : function() {
                base.notice('网络错误');
            }
        });

    }
    //生成图表
    function chart(){
        console.log(gpaDate.now);
        chartArea('.select-svg-gpa',gpaDate.before,gpaDate.now,4,gpaDate.now.max.y,function(){
            gpaDate.before = gpaDate.now;
        });
        chartArea('.select-svg-tofel',tofelDate.before,tofelDate.now,120,tofelDate.now.max.y,function(){
            tofelDate.before = tofelDate.now;
        });
        chartArea('.select-svg-gre',greDate.before,greDate.now,340,greDate.now.max.y,function(){
            greDate.before = greDate.now;
        });

        chartRound('.select-svg-learning',learningDate.before,learningDate.now,function(){
            learningDate.before = learningDate.now;
        });
        chartRound('.select-svg-recommend',recommendDate.before,recommendDate.now,function(){
            recommendDate.before = recommendDate.now;
        });
        chartRound('.select-svg-prize',prizeDate.before,prizeDate.now,function(){
            prizeDate.before = prizeDate.now;
        });
    }


    function chartArea(dom,data1,data2,maxScore,maxNumber,cb){  //dom 数据1 数据2 满分 最多人数 cb
        console.log(data1, data2, maxScore, maxNumber)
        if($(dom).find('svg')){
            $(dom).find('svg').remove();
        }
        if(!data1){
            data1 = {};
            data1.data = [];
            data1.lessMe = [];
            data1.max = {};
            data1.user_data = {};
            data1.max.x = 0;
            data1.max.y = 0;
            data1.user_data.x = 0;
            data1.user_data.y = 0;
            data1.color = {
                stroke : '#ffffff',
                fill : '#ffffff'
            };
            for(var i=0;i<data2.data.length;i++){
                data1.data.push({
                    x : 0,
                    y : 0
                });
                data1.lessMe.push({
                    x : 0,
                    y : 0
                })
            }
        }
        else{
            data1.lessMe = lessArr(data1);
            data1.max = maxObj(data1);//最大处
            data1.user_data = meObj(data1);//我的得分
            data1.color = color(data1);
            data1.min = minObj(data1);
            data1.maxScorex = maxScoreObj(data1);
        }
        data2.lessMe = lessArr(data2);
        data2.max = maxObj(data2);
        data2.user_data = meObj(data2);
        data2.color = color(data2);
        data2.min = minObj(data2)
        data2.maxScorex = maxScoreObj(data2);

        //最小的x和最小的y(0)
        var minX;
        var minNumber;
        var maxX;
        //得分小于我的数据
        function lessArr(data){
            var less = [];
            for(var i=0;i<data.data.length;i++){
                if(data.data[i].x<=data.myScore){
                    less.push(data.data[i])
                }
            }
            return less;
        }
        //最多人数的数据,峰值
        function maxObj(data){
            var max = [];
            for(var i=0;i<data.data.length;i++){
                max.push(data.data[i].y)
            }
            var maxY = d3.max(max);
            for(var n=0;n<data.data.length;n++){
                if(data.data[n].y==maxY){
                    return data.data[n];
                }
            }
        }
        //我的得分数据
        function meObj(data){
            for(var i=0;i<data.data.length;i++){
                if(data.data[i].x==data.myScore){
                    return data.data[i];
                }
            }
        }
        //最低得分
        function minObj(data){
            var min = [];
            for(var i=0;i<data.data.length;i++){
                min.push(data.data[i].x)
            }
            minX = d3.min(min);//最少得分
            for(var n=0;n<data.data.length;n++){
                if(data.data[n].x==minX){
                    return data.data[n];
                }
            }
        }
        //最高得分
        function maxScoreObj(data){
            var maxScorex = [];
            for(var i=0;i<data.data.length;i++){
                maxScorex.push(data.data[i].x)
            }
            maxX = d3.max(maxScorex);//最少得分
            for(var n=0;n<data.data.length;n++){
                if(data.data[n].x==maxX){
                    return data.data[n];
                }
            }
        }
        //颜色
        function color(data){
            console.log(data)
            var color = {
                stroke : '',
                fill : ''
            };
            if(data.myScore>parseInt(data.max.x)+parseInt((maxScore-data.max.x)/2)){
                color.stroke = '#55ccff';
                color.fill = '#bdeafc';
            }
            else if(data.myScore>data.max.x&&data.myScore<=parseInt(data.max.x)+parseInt((maxScore-data.max.x)/2)){
                color.stroke = '#72d38a';
                color.fill = '#c7f6d5';
            }
            else if(data.myScore<=data.max.x){
                color.stroke = '#f14141';
                color.fill = '#ffcccc';
            }
            return color;
        }

        var width = 500;
        var height = 250;
        var margin = {left:50,top:50,right:50,bottom:25};
        var g_width = width - margin.left - margin.right;
        var g_height = height - margin.top - margin.bottom;

        var svg = d3.select(dom).append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform','translate('+margin.left+','+margin.top+')');
        //缩放比例
        var x = d3.scaleLinear()
            .domain([data2.min.x,data2.maxScorex.x])
            .range([0,g_width]);
        var y = d3.scaleLinear()
            .domain([0,maxNumber])
            .range([g_height,0]);
        //面积生成器
        var area = d3.area()
            .x(function(d){
                return x(d.x);
            })
            .y0(g_height)
            .y1(function(d){
                return y(d.y);
            })
            .curve(d3.curveCatmullRom.alpha(0.5));
        //线条生成器
        var line = d3.line()
            .x(function(d){
                return x(d.x);
            })
            .y(function(d) {
                return y(d.y)-1;
            })
            .curve(d3.curveCatmullRom.alpha(0.5));

        svg.append('path')  //画面
            .attr('class','svg-area')
            .style('fill',data1.color.fill)
            .attr('d',area(data1.lessMe))
            .transition()
            .duration(1000)
            .style('fill',data2.color.fill)
            .attr('d',area(data2.lessMe));
        svg.append('path')  //画线
            .attr('class','svg-line')
            .style('stroke',data1.color.stroke)
            .attr('d',line(data1.data))
            .transition()
            .duration(1000)
            .style('stroke',data2.color.stroke)
            .attr('d',line(data2.data));
        svg    //最高点
            .append('g')
            .append('circle')
            .style('fill',data1.color.fill)
            .attr('cx', x(data1.max.x))
            .attr('cy', y(data1.max.y))
            .transition()
            .duration(1000)
            .style('fill',data2.color.fill)
            .attr('cx', x(data2.max.x))
            .attr('cy', y(data2.max.y))
            .attr('r', 5);
        svg     //自己
            .append('g')
            .append('circle')
            .attr('class','svg-dot')
            .style('stroke',data1.color.stroke)
            .attr('cx', x(data1.user_data.x))
            .attr('cy', y(data1.user_data.y))
            .transition()
            .duration(1000)
            .style('stroke',data2.color.stroke)
            .attr('cx', x(data2.user_data.x))
            .attr('cy', y(data2.user_data.y))
            .attr('r', 4);
        svg     //最高点线
            .append('g')
            .append('line')
            .style('stroke','#ffffff')
            .style('stroke-width',1)
            .attr('x1', x(data1.max.x))
            .attr('y1', y(data1.max.y)+5)
            .attr('x2', x(data1.max.x))
            .transition()
            .duration(1000)
            .attr('x1', x(data2.max.x))
            .attr('y1', y(data2.max.y)+5)
            .attr('x2', x(data2.max.x))
            .attr('y2', g_height);
        svg     //底线
            .append('g')
            .append('line')
            .style('stroke','#dcdcdc')
            .style('stroke-width',1)
            .attr('x1', 0)
            .attr('y1', g_height+2)
            .attr('x2', g_width)
            .attr('y2', g_height+2);
        svg     //大多数人得分文字
            .append('g')
            .append('text')
            .attr('x', x(data1.max.x)-36)
            .attr('y', y(data1.max.y)-15)
            .transition()
            .duration(1000)
            .attr('x', x(data2.max.x)-36)
            .attr('y', y(data2.max.y)-15)
            .text('大多数人得分');
        svg     //我的得分文字
            .append('g')
            .append('text')
            .attr('x', x(data1.user_data.x)-24)
            .attr('y', y(data1.user_data.y)-15)
            .transition()
            .duration(1000)
            .attr('x', x(data2.user_data.x)-24)
            .attr('y', y(data2.user_data.y)-15)
            .text('我的得分');
        svg     //大多数人得分
            .append('g')
            .append('text')
            .attr('x', x(data1.max.x)-8)
            .attr('y', g_height-5)
            .text(data1.max.x)
            .transition()
            .duration(1000)
            .attr('x', x(data2.max.x)-8)
            .attr('y', g_height-5)
            .text(data2.max.x);
        svg     //我的得分
            .append('g')
            .append('text')
            .attr('x', x(data1.user_data.x)-8)
            .attr('y', g_height-5)
            .text(data1.max.x)
            .transition()
            .duration(1000)
            .attr('x', x(data2.user_data.x)-8)
            .attr('y', g_height-5)
            .text(data2.user_data.x);

        svg     //最低分文字
            .append('g')
            .append('text')
            .attr('x', 0)
            .attr('y', g_height+20)
            .text('最低分');
        svg     //最高分文字
            .append('g')
            .append('text')
            .attr('x', g_width-36)
            .attr('y', g_height+20)
            .text('最高分');
        svg     //最高分
            .append('g')
            .append('text')
            .attr('x', g_width-8)
            .attr('y', g_height-5)
            .text(data2.maxScorex.x);
        if(cb){
            cb();
        }
    }

    function chartRound(dom,data1,data2,cb){
        if($(dom).find('svg')){
            $(dom).find('svg').remove();
        }
        var width = 500;
        var height = 250;
        var r_width = 180;
        var r_height = 180;
        var center_x = width/2;
        var center_y = height/2+20;
        if(!data1){
            data1 = {
                angle : 0,
                color : '#f2f2f2'
            }
        }
        else{
            data1.angle = 2*Math.PI*toPoint(data1.ratio);
            data1.color = color(toPoint(data1.ratio));
        }
        data2.angle = 2*Math.PI*toPoint(data2.ratio);
        data2.color = color(toPoint(data2.ratio));

        var chartNumber = parseInt(toPoint(data1.ratio)*100);
        var numberTimer = setInterval(function(){
            if(data2.angle>data1.angle){
                chartNumber = chartNumber+5;
            }
            else if(data2.angle<data1.angle){
                chartNumber = chartNumber-5;
            }
            $(dom).find('.select-svg-number').html(chartNumber+'%');
            if(chartNumber>=parseInt(toPoint(data2.ratio)*100)){
                clearInterval(numberTimer);
                chartNumber = parseInt(toPoint(data2.ratio)*100);
            }
            $(dom).find('.select-svg-number').html(chartNumber+'%');
            if(chartNumber<=0){
                clearInterval(numberTimer);
                $(dom).find('.select-svg-number').html('有待提升');
            }
            $(dom).find('.select-svg-number').css('color',color(toPoint(data2.ratio)));
        },100);

        function toPoint(percent){
            if(percent=='0'){
                return  0;
            }
            if(!percent){
                return 0;
            }
            var str = percent;
            return str;
        }

        function color(ratio){
            if(ratio==0){
                return '#999999';
            }
            else if(ratio>0.5){
                return '#25baf4';
            }
            else if(ratio<=0.5){
                return '#ff5555';
            }
        }

        var svg = d3.select(dom).append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform','translate('+center_x+','+center_y+')');
        var arc1 = d3.arc()
            .innerRadius(r_width/2-2)
            .outerRadius(r_width/2+2)
            .startAngle(0)
            .endAngle(2*Math.PI);
        var arc2 = d3.arc()
            .innerRadius(r_width/2-4)
            .outerRadius(r_width/2+4)
            .startAngle(0)
            .endAngle(function(d){
                return d;
            });
        svg.append('path')  //画面
            .style('fill','#f2f2f2')
            .attr('d',arc1);
        svg.append('path')  //画面
            .style('fill',data1.color)
            .attr('d',arc2(data1.angle))
            .transition()
            .duration(1000)
            .style('fill',data2.color)
            .attrTween('d',function(){
                return function(t){
                    return arc2(t*data2.angle);
                };
            });
        if(cb){
            cb();
        }
    }

}) ;