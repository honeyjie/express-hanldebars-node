define(['jquery','fullpage','iscroll','base','common','d3'], function(jquery,fullpage,iscroll,base,common,d3){
    //图表测试数据开始
    function random(){
        var randomData = [];
        randomData[0] = {
            score:0,
            number:0
        };
        for(var i=1;i<=25;i++){
            randomData[i] = {};
            randomData[i].score = (0.2*i).toFixed(1);
            randomData[i].number = Math.floor(Math.random()*40+10);
        }
        return randomData;
    }
    //图表测试数据结束

    var gpaDate = {
        before : null ,
        now : {
            data : random(),  //测试数据
            myScore : 2.4     //测试数据
        }
    };
    var tofelDate = {
        before : null ,
        now : {
            data : random(),  //测试数据
            myScore : 3.2     //测试数据
        }
    };
    var greDate = {
        before : null ,
        now : {
            data : random(),  //测试数据
            myScore : 1.2     //测试数据
        }
    };
    var learningDate = {
        before : null ,
        now : {
            ratio : '30%'   //测试数据
        }
    };
    var recommendDate = {
        before : null ,
        now : {
            ratio : '50%'  //测试数据
        }
    };
    var prizeDate = {
        before : null ,
        now : {
            ratio : '80%'  //测试数据
        }
    };


    var select = {};
        select.nation = [];                     //国家
        select.locatioin = [];                  //地区
        select.pre_school = '';                 //之前学校
        select.pre_major = '';                  //之前专业1
        select.pre_major2 = '';                 //之前专业2
        select.school_type = null;                 //学校类别
        select.major_only = null;                  //是否接受相关专业
        select.degree = '';               //学位
        select.gpa = null;                             //GPA
        select.language = {};
        select.exam_score = {};
        select.last = null;
        select.exchange = [];
        select.science_experience = [];
        select.recommend = [];
        select.science_paper = [];
        select.experience = [];
        select.prize = [];
    var language = {}; //语言考试子类
        language.overall = null;
        language.R = null;
        language.L = null;
        language.S = null;
        language.W = null;
    var exam = {};     //标准化考试子类
        exam.overall = null;
        exam.V = null;
        exam.Q = null;
        exam.AW = null;
    var height = [];  //每个模块的高度
    var scroll = []; //模拟滚动条
    $(function(){

        chart();

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
                content.animate({height:height[index]},200);
            }
            else{
                $(this).removeClass('animated rotateUp').addClass('animated rotateDown');
                content.animate({height:0},200);
            }
        });
        //选择国家
        $('.select-country .select-preference-radio').on('click',function(){
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
        });
        //毕业学校 鼠标移出
        $('.select-school').on('mouseleave',function(){
            if(!$(this).is(':focus')){
                return;
            }
            var arr = [];
            for(var i=0;i<$('.select-info-school .form-select-option li').length;i++){
                arr.push($('.select-info-school .form-select-option li').eq(i).html())
            }
            if(arr.indexOf($('.select-school').val())==-1){
                base.testFail($(this),'请从下拉列表中选择学校');
                return;
            }
            base.testSuccess($(this));
            select.pre_school = $(this).val();
            if(select.pre_school){
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
        //毕业专业1 鼠标移出
        $('.select-major').on('mouseleave',function(){
            if(!$(this).is(':focus')){
                return;
            }
            var arr = [];
            for(var i=0;i<$('.select-info-major .form-select-option li').length;i++){
                arr.push($('.select-info-major .form-select-option li').eq(i).html())
            }
            if(arr.indexOf($('.select-major').val())==-1){
                base.testFail($(this),'请从下拉列表中选择专业');
                return;
            }
            base.testSuccess($(this));
            select.pre_major = $(this).val();
            if(select.pre_major=='法学'){
                $('.select-form-last').removeClass('hidden');
                $('.select-exam').addClass('hidden');
            }
            else{
                $('.select-form-last').addClass('hidden');
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
        //毕业专业2 鼠标移出
        $('.select-major2').on('mouseleave',function(){
            if(!$(this).is(':focus')){
                return;
            }
            var arr = [];
            for(var i=0;i<$('.select-info-major2 .form-select-option li').length;i++){
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
            select.school_type = $(this).data('value');
            $('.select-school-type .form-item-name').removeClass('red');
            infoFinished();
        });
        //申请专业
        $('.select-major-only .form-radio').on('click',function(){
            if($(this).data('value')==2){
                $('.select-info-major2').removeClass('hidden');
            }
            else if($(this).data('value')==1){
                $('.select-info-major2').addClass('hidden');
            }
            select.major_only = $(this).data('value');
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
                rule : base.isScore,
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
                select.language = {toefl:{}};
            }
            else if($(this).find('.form-radio-value').html()=='IELTS'){
                select.language = {ielts:{}};
            }
            $('.select-language-input input').removeClass('error').val('');
            language.overall = null;
            language.R = null;
            language.L = null;
            language.S = null;
            language.W = null;
        });
        //语言考试 overall
        $('.select-language-overall').on('input propertychange',function(){
            $(this).testInput({
                rule : base.isScore,
                success : function(dom){
                    if(select.language.toefl){
                        if(dom.val()<0||dom.val()>120){
                            language.overall = null;
                            base.testFail(dom,'TOFEL有效分值为0~120分');
                            return;
                        }
                    }
                    else if(select.language.ielts){
                        if(dom.val()<0||dom.val()>9){
                            exam.V = null;
                            base.testFail(dom,'IELTS有效分值为0~9分');
                            return;
                        }
                    }
                    language.overall = dom.val();
                    base.testSuccess(dom);
                },
                fail : function(dom){
                    language.overall = null;
                    if(select.language.toefl){
                        base.testFail(dom,'TOFEL有效分值为0~120分');
                    }
                    else if(select.language.ielts){
                        base.testFail(dom,'IELTS有效分值为0~9分');
                    }
                }
            });
        });
        //语言考试 R
        $('.select-language-r').on('input propertychange',function(){
            $(this).testInput({
                rule : base.isScore,
                success : function(dom){
                    if(select.language.toefl){
                        if(dom.val()<0||dom.val()>30){
                            language.R = null;
                            base.testFail(dom,'TOFEL分项成绩有效分值为0~30分');
                            return;
                        }
                    }
                    else if(select.language.ielts){
                        if(dom.val()<0||dom.val()>9){
                            exam.V = null;
                            base.testFail(dom,'IELTS分项成绩有效分值为0~9');
                            return;
                        }
                    }
                    language.R = dom.val();
                    base.testSuccess(dom);
                },
                fail : function(dom){
                    language.R = null;
                    if(select.language.toefl){
                        base.testFail(dom,'TOFEL分项成绩有效分值为0~30分');
                    }
                    else if(select.language.ielts){
                        base.testFail(dom,'IELTS分项成绩有效分值为0~9');
                    }
                }
            });
        });
        //语言考试 L
        $('.select-language-l').on('input propertychange',function(){
            $(this).testInput({
                rule : base.isScore,
                success : function(dom){
                    if(select.language.toefl){
                        if(dom.val()<0||dom.val()>30){
                            language.R = null;
                            base.testFail(dom,'TOFEL分项成绩有效分值为0~30分');
                            return;
                        }
                    }
                    else if(select.language.ielts){
                        if(dom.val()<0||dom.val()>9){
                            exam.V = null;
                            base.testFail(dom,'IELTS分项成绩有效分值为0~9');
                            return;
                        }
                    }
                    language.L = dom.val();
                    base.testSuccess(dom);
                },
                fail : function(dom){
                    language.L = null;
                    if(select.language.toefl){
                        base.testFail(dom,'TOFEL分项成绩有效分值为0~30分');
                    }
                    else if(select.language.ielts){
                        base.testFail(dom,'IELTS分项成绩有效分值为0~9');
                    }
                }
            });
        });
        //语言考试 S
        $('.select-language-s').on('input propertychange',function(){
            $(this).testInput({
                rule : base.isScore,
                success : function(dom){
                    if(select.language.toefl){
                        if(dom.val()<0||dom.val()>30){
                            language.R = null;
                            base.testFail(dom,'TOFEL分项成绩有效分值为0~30分');
                            return;
                        }
                    }
                    else if(select.language.ielts){
                        if(dom.val()<0||dom.val()>9){
                            exam.V = null;
                            base.testFail(dom,'IELTS分项成绩有效分值为0~9');
                            return;
                        }
                    }
                    language.S = dom.val();
                    base.testSuccess(dom);
                },
                fail : function(dom){
                    language.S = null;
                    if(select.language.toefl){
                        base.testFail(dom,'TOFEL分项成绩有效分值为0~30分');
                    }
                    else if(select.language.ielts){
                        base.testFail(dom,'IELTS分项成绩有效分值为0~9');
                    }
                }
            });
        });
        //语言考试 W
        $('.select-language-w').on('input propertychange',function(){
            $(this).testInput({
                rule : base.isScore,
                success : function(dom){
                    if(select.language.toefl){
                        if(dom.val()<0||dom.val()>30){
                            language.R = null;
                            base.testFail(dom,'TOFEL分项成绩有效分值为0~30分');
                            return;
                        }
                    }
                    else if(select.language.ielts){
                        if(dom.val()<0||dom.val()>9){
                            exam.V = null;
                            base.testFail(dom,'IELTS分项成绩有效分值为0~9');
                            return;
                        }
                    }
                    language.W = dom.val();
                    base.testSuccess(dom);
                },
                fail : function(dom){
                    language.W = null;
                    if(select.language.toefl){
                        base.testFail(dom,'TOFEL分项成绩有效分值为0~30分');
                    }
                    else if(select.language.ielts){
                        base.testFail(dom,'IELTS分项成绩有效分值为0~9');
                    }
                }
            });
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
            if(!$.isEmptyObject(select.language)&&language.overall&&language.R&&language.L&&language.S&&language.W){
                $('.select-language .form-item-name').removeClass('red');
            }
            scoreFinished();
        });
        //标准化考试 单选
        $('.select-exam .form-radio').on('click',function(){
            if($('.select-exam-input').hasClass('hidden')){
                height[2] = parseInt(height[2]+$('.select-exam-input').innerHeight()+'px');
                console.log(height[2])
                $('.select-score').css('height',height[2]);
            }
            $('.select-exam-input').removeClass('hidden');
            if($(this).find('.form-radio-value').html()=='GMAT'){
                select.exam_score = {gmat:{}};
                $('.select-gresub').addClass('hidden');
            }
            else if($(this).find('.form-radio-value').html()=='GRE'){
                select.exam_score = {gre:{}};
                $('.select-gresub').removeClass('hidden');
            }
            $('.select-exam-input input').removeClass('error').val('');
            exam.overall = null;
            exam.V = null;
            exam.Q = null;
            exam.AW = null;
        });
        //标准化考试 overall
        $('.select-exam-overall').on('input propertychange',function(){
            $(this).testInput({
                rule : base.isScore,
                success : function(dom){
                    if(select.exam_score.gre){
                        if(dom.val()<0||dom.val()>340){
                            exam.overall = null;
                            base.testFail(dom,'GRE有效分值为0~340');
                            return;
                        }
                    }
                    else if(select.exam_score.gmat){
                        if(dom.val()<200||dom.val()>800){
                            exam.overall = null;
                            base.testFail(dom,'GMAT有效分值为200~800');
                            return;
                        }
                    }
                    exam.overall = dom.val();
                    base.testSuccess(dom);
                },
                fail : function(dom){
                    exam.overall = null;
                    if(select.exam_score.gre){
                        base.testFail(dom,'GRE有效分值为0~340');
                    }
                    else if(select.exam_score.gmat){
                        base.testFail(dom,'GMAT有效分值为200~800');
                    }
                }
            });
        });

        //标准化考试 V
        $('.select-exam-v').on('input propertychange',function(){
            $(this).testInput({
                rule : base.isScore,
                success : function(dom){
                    if(select.exam_score.gre){
                        if(dom.val()<0||dom.val()>170){
                            exam.V = null;
                            base.testFail(dom,'GRE分项（V、Q ）成绩有效分值为0~170');
                            return;
                        }
                    }
                    else if(select.exam_score.gmat){
                        if(dom.val()<0||dom.val()>60){
                            exam.V = null;
                            base.testFail(dom,'GMAT分项（V、Q) 有效成绩分值为0~60');
                            return;
                        }
                    }
                    exam.V = dom.val();
                    base.testSuccess(dom);
                },
                fail : function(dom){
                    exam.V = null;
                    if(select.exam_score.gre){
                        base.testFail(dom,'GRE分项（V、Q ）成绩有效分值为0~170');
                    }
                    else if(select.exam_score.gmat){
                        base.testFail(dom,'GMAT分项（V、Q) 有效成绩分值为0~60');
                    }
                }
            });
        });

        //标准化考试 Q
        $('.select-exam-q').on('input propertychange',function(){
            $(this).testInput({
                rule : base.isScore,
                success : function(dom){
                    if(select.exam_score.gre){
                        if(dom.val()<0||dom.val()>170){
                            exam.Q = null;
                            base.testFail(dom,'GRE分项（V、Q ）成绩有效分值为0~170');
                            return;
                        }
                    }
                    else if(select.exam_score.gmat){
                        if(dom.val()<0||dom.val()>60){
                            exam.Q = null;
                            base.testFail(dom,'GMAT分项（V、Q) 有效成绩分值为0~60');
                            return;
                        }
                    }
                    exam.Q = dom.val();
                    base.testSuccess(dom);
                },
                fail : function(dom){
                    exam.Q = null;
                    if(select.exam_score.gre){
                        base.testFail(dom,'GRE分项（V、Q ）成绩有效分值为0~170');
                    }
                    else if(select.exam_score.gmat){
                        base.testFail(dom,'GMAT分项（V、Q) 有效成绩分值为0~60');
                    }
                }
            });
        });

        //标准化考试 AW
        $('.select-exam-aw').on('input propertychange',function(){
            $(this).testInput({
                rule : base.isScore,
                success : function(dom){
                    if(select.exam_score.gre){
                        if(dom.val()<0||dom.val()>6){
                            exam.AW = null;
                            base.testFail(dom,'AW有效成绩分值为0~6');
                            return;
                        }
                    }
                    else if(select.exam_score.gmat){
                        if(dom.val()<0||dom.val()>6){
                            exam.AW = null;
                            base.testFail(dom,'AW有效成绩分值为0~6');
                            return;
                        }
                    }
                    exam.AW = dom.val();
                    base.testSuccess(dom);
                },
                fail : function(dom){
                    exam.AW = null;
                    if(select.exam_score.gre){
                        base.testFail(dom,'AW有效成绩分值为0~6');
                    }
                    else if(select.exam_score.gmat){
                        base.testFail(dom,'AW有效成绩分值为0~6');
                    }
                }
            });
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
            if(!$.isEmptyObject(select.exam_score)&&exam.overall&&exam.V&&exam.Q&&exam.AW){
                $('.select-exam .form-item-name').removeClass('red');
            }
            scoreFinished();
        });

        //LAST
        $('.select-last').on('blur',function(){
            $(this).testInput({
                rule : base.isScore,
                success : function(dom){
                    if(dom.val()>180||dom.val()<120){
                        select.last = null;
                        base.testFail(dom,'LAST有效分值为120~180');
                        return;
                    }
                    select.last = dom.val();
                    base.testSuccess(dom);
                },
                fail : function(dom){
                    select.last = null;
                    base.testFail(dom,'LAST有效分值为120~180');
                }
            });
            if(select.last){
                $('.select-form-last .form-item-name').removeClass('red');
            }
            scoreFinished();
        });
        //海外学习
        $('.select-exchange .form-check').on('click',function(){
            var n = $(this).parents('.select-exchange').find('.form-check').index($(this))+1;
            if(select.exchange.indexOf(n)==-1){
                select.exchange.push(n);
            }
            else{
                select.exchange.splice(select.exchange.indexOf(n),1);
            }
        });
        //科研经历 选择
        $('.select-science .form-check').on('click',function(){
            var n = $(this).parents('.select-science').find('.form-check').index($(this))+1;
            var arr = [];
            var val = $(this).find('.form-select-option li').eq(0).data('value')?$(this).find('.form-select-option li').eq(0).data('value'):0;
            $.each(select.science_experience,function(index,value){
                arr.push(value.name)
            });
            if(arr.indexOf(n)==-1){
                $(this).find('.form-select').removeClass('hidden');
                select.science_experience.push({name:n,value:val});
                height[3] = parseInt(height[3])+$(this).find('.form-select').innerHeight()+'px';
                $('.select-other').css('height',height[3]);
            }
            else{
                $(this).find('.form-select').addClass('hidden');
                $(this).find('.form-select-value').html($(this).find('.form-select-option li').eq(0).html());
                select.science_experience.splice(arr.indexOf(n),1);
                height[3] = parseInt(height[3])-$(this).find('.form-select').innerHeight()+'px';
                $('.select-other').css('height',height[3]);
            }
        });
        //科研经历 下拉
        $('.select-science .form-select').on('click',function(e){
            e.stopPropagation();
        });
        $('.select-science .form-select-option li').on('click',function(e){
            e.stopPropagation();
            var val = $(this).data('value');
            var n = $(this).parents('.form-item').find('.form-select').index($(this).parents('.form-select'));
            $.each(select.science_experience,function(index,value){
                if(value.name == n+1){
                    value.value = val;
                }
            });
        });
        //推荐信
        $('.select-recommend .form-check').on('click',function(){
            var n = $(this).parents('.select-recommend').find('.form-check').index($(this))+1;
            if(select.recommend.indexOf(n)==-1){
                select.recommend.push(n);
            }
            else{
                select.recommend.splice(select.recommend.indexOf(n),1);
            }
        });
        //学术成就
        $('.select-achievement .form-check').on('click',function(){
            var n = $(this).parents('.select-achievement').find('.form-check').index($(this))+1;
            var arr = [];
            $.each(select.science_paper,function(index,value){
                arr.push(value.name);
            });
            if(arr.indexOf(n)==-1){
                $(this).find('.form-check-input').removeClass('hidden');
                $(this).find('.form-check-input input').each(function(){
                    select.science_paper.push({name:n,value:$(this).data('value'),num:0});
                });
                height[3] = parseInt(height[3])+$(this).find('.form-check-input').innerHeight()+'px';
                $('.select-other').css('height',height[3]);
            }
            else{
                $(this).find('.form-check-input').addClass('hidden');
                $(this).find('.form-check-input input').val('');
                $.each(select.science_paper,function(){
                    select.science_paper.splice(arr.indexOf(n),1);
                });
                if(select.science_paper.length == 0){
                    $('.select-box').eq(3).find('.select-title').removeClass('error');
                    $('.select-achievement .form-item-name').eq(0).removeClass('red');
                }
                height[3] = parseInt(height[3])-$(this).find('.form-check-input').innerHeight()+'px';
                $('.select-other').css('height',height[3]);
                base.testSuccess($(this).find('input'));
            }
        });
        //学术成就 input
        $('.select-achievement .form-check-input').on('click',function(e){
            e.stopPropagation();
        });
        $('.select-achievement .form-check-input input').on('blur',function(){
            $(this).testInput({
                rule : base.isScore,
                success : function(dom){
                    var val = dom.data('value');
                    var num = parseInt(dom.val());
                    var n = dom.parents('.form-item').find('.form-check').index(dom.parents('.form-check'));
                    $.each(select.science_paper,function(index,value){
                        if(value.name == n+1&&value.value == val){
                            value.num = num;
                        }
                    });
                    base.testSuccess(dom);
                },
                fail : function(dom){
                    var val = dom.data('value');
                    var num = parseInt(dom.val());
                    var n = dom.parents('.form-item').find('.form-check').index(dom.parents('.form-check'));
                    $.each(select.science_paper,function(index,value){
                        if(value.name == n+1&&value.value == val){
                            value.num = 0;
                        }
                    });
                    base.testFail(dom,'请输入整数数字');
                }
            });
            if($(this).val()>0){
                $('.select-box').eq(3).find('.select-title').removeClass('error');
                $('.select-achievement .form-item-name').eq(0).removeClass('red');
            }
        });

        //工作/实习经历 选择
        $('.select-work .form-check').on('click',function(){
            var n = $(this).parents('.select-work').find('.form-check').index($(this))+1;
            var arr = [];
            var val = $(this).find('.form-select-option li').eq(0).data('value')?$(this).find('.form-select-option li').eq(0).data('value'):0;
            $.each(select.experience,function(index,value){
                arr.push(value.name)
            });
            if(arr.indexOf(n)==-1){
                $(this).find('.form-select').removeClass('hidden');
                select.experience.push({name:n,value:val});
                height[3] = parseInt(height[3])+$(this).find('.form-select').innerHeight()+'px';
                $('.select-other').css('height',height[3]);
            }
            else{
                $(this).find('.form-select').addClass('hidden');
                $(this).find('.form-select-value').html($(this).find('.form-select-option li').eq(0).html());
                select.experience.splice(arr.indexOf(n),1);
                height[3] = parseInt(height[3])-$(this).find('.form-select').innerHeight()+'px';
                $('.select-other').css('height',height[3]);
            }
        });
        //工作/实习经历 下拉
        $('.select-work .form-select').on('click',function(e){
            e.stopPropagation();
        });
        $('.select-work .form-select-option li').on('click',function(e){
            e.stopPropagation();
            var val = $(this).data('value');
            var n = $(this).parents('.form-item').find('.form-select').index($(this).parents('.form-select'));
            $.each(select.experience,function(index,value){
                if(value.name == n+1){
                    value.value = val;
                }
            });
        });

        //获奖情况 选择
        $('.select-prize .form-check').on('click',function(){
            var n = $(this).parents('.select-prize').find('.form-check').index($(this))+1;
            var arr = [];
            var val = $(this).find('.form-select-option li').eq(0).data('value')?$(this).find('.form-select-option li').eq(0).data('value'):0;
            $.each(select.prize,function(index,value){
                arr.push(value.name)
            });
            if(arr.indexOf(n)==-1){
                $(this).find('.form-select').removeClass('hidden');
                select.prize.push({name:n,value:val});
                height[3] = parseInt(height[3])+$(this).find('.form-select').innerHeight()+'px';
                $('.select-other').css('height',height[3]);
            }
            else{
                $(this).find('.form-select').addClass('hidden');
                $(this).find('.form-select-value').html($(this).find('.form-select-option li').eq(0).html());
                select.prize.splice(arr.indexOf(n),1);
                height[3] = parseInt(height[3])-$(this).find('.form-select').innerHeight()+'px';
                $('.select-other').css('height',height[3]);
            }
        });
        //获奖情况 下拉
        $('.select-prize .form-select').on('click',function(e){
            e.stopPropagation();
        });
        $('.select-prize .form-select-option li').on('click',function(e){
            e.stopPropagation();
            var val = $(this).data('value');
            var n = $(this).parents('.form-item').find('.form-select').index($(this).parents('.form-select'));
            $.each(select.prize,function(index,value){
                if(value.name == n+1){
                    value.value = val;
                }
            });
        });

        $('.select-submit').on('click',function(){
            submitSelect();
        });


        //切换学校类型
        $('.select-school').tab();
        //切换学校图表
        $('.select-school-list li').on('click',function(){
            $('.select-school-list li').removeClass('active');
            $(this).addClass('active');
            gpaDate.now = {
                data : random(),  //测试数据
                myScore : 2.0     //测试数据
            };
            tofelDate.now = {
                data : random(),  //测试数据
                myScore : 3.2     //测试数据
            };
            greDate.now = {
                data : random(),  //测试数据
                myScore : 2.4     //测试数据
            };
            learningDate.now = {
                ratio : '70%'   //测试数据
            };
            recommendDate.now = {
                ratio : '0'   //测试数据
            };
            prizeDate.now = {
                ratio : '20%'   //测试数据
            };
            chart();
        });
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
    //基本情况填写完毕
    function infoFinished(){
        if(select.pre_school&&select.pre_major&&select.school_type&&select.major_only&&select.degree){
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
        if(select.gpa&&!$.isEmptyObject(select.language)&&language.overall&&language.R&&language.L&&language.S&&language.W){
            if(select.pre_major=='法学'){
                if(select.last){
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
            else{
                if(!$.isEmptyObject(select.exam_score)&&exam.overall&&exam.V&&exam.Q&&exam.AW){
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
                        scrollbars : true
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
                            scrollbars : true
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
                            scrollbars : true
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
                $('.select-box').eq(0).find('.select-title-control').click();
            }
        }
        if(!select.pre_school||!select.pre_major||!select.school_type||!select.major_only||!select.degree){
            $('.select-box').eq(1).find('.select-title').addClass('error');
            if(parseInt($('.select-box').eq(1).find('.select-content').css('height'))==0){
                $('.select-box').eq(1).find('.select-title-control').click();
            }
            if(!select.pre_school){
                $('.select-info-school .form-item-name').addClass('red');
            }
            if(!select.pre_major){
                $('.select-info-major .form-item-name').addClass('red');
            }
            if(!select.school_type){
                $('.select-school-type .form-item-name').addClass('red');
            }
            if(!select.major_only){
                $('.select-major-only .form-item-name').addClass('red');
            }
            if(!select.degree){
                $('.select-degree .form-item-name').addClass('red');
            }
        }
        else{
            if(parseInt($('.select-box').eq(1).find('.select-content').css('height'))>0){
                $('.select-box').eq(1).find('.select-title-control').click();
            }
        }
        if(select.pre_major=='法学'){
            if(!select.gpa||$.isEmptyObject(select.language)||!language.overall||!language.R||!language.L||!language.S||!language.W||!select.last){
                $('.select-box').eq(2).find('.select-title').addClass('error');
                if(parseInt($('.select-box').eq(2).find('.select-content').css('height'))==0){
                    $('.select-box').eq(2).find('.select-title-control').click();
                }
                if(!select.gpa){
                    $('.select-score-gpa .form-item-name').addClass('red');
                }
                if($.isEmptyObject(select.language)||!language.overall||!language.R||!language.L||!language.S||!language.W){
                    $('.select-language .form-item-name').addClass('red');
                }
                if(!select.last){
                    $('.select-form-last .form-item-name').addClass('red');
                }
            }
            else{
                if(parseInt($('.select-box').eq(2).find('.select-content').css('height'))>0){
                    $('.select-box').eq(2).find('.select-title-control').click();
                }
            }
        }
        else{
            if(!select.gpa||$.isEmptyObject(select.language)||!language.overall||!language.R||!language.L||!language.S||!language.W||$.isEmptyObject(select.exam_score)||!exam.overall||!exam.V||!exam.Q||!exam.AW){
                $('.select-box').eq(2).find('.select-title').addClass('error');
                if(parseInt($('.select-box').eq(2).find('.select-content').css('height'))==0){
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
                    $('.select-box').eq(2).find('.select-title-control').click();
                }
            }
        }
        if(select.science_paper.length>0){
            var arr = [];
            var num = 0;
            $.each(select.science_paper,function(index,value){
                arr.push(value.num);
                if(value.num>0){
                    num++;
                }
            });
            if(num>0){
                if(parseInt($('.select-box').eq(3).find('.select-content').css('height'))>0){
                    $('.select-box').eq(3).find('.select-title-control').click();
                }
            }
            else{
                $('.select-box').eq(3).find('.select-title').addClass('error');
                $('.select-achievement .form-item-name').eq(0).addClass('red');
                if(parseInt($('.select-box').eq(3).find('.select-content').css('height'))==0){
                    $('.select-box').eq(3).find('.select-title-control').click();
                }
            }
        }

        if($('.select-title').hasClass('error')){
            $('.notice').addClass('red');
            base.notice('页面中有必填项未填，请检查',function(){
                $('.notice').removeClass('red');
            });
            return;
        }

        if(select.language.toefl){
            select.language.toefl = language;
        }
        if(select.language.ielts){
            select.language.ielts = language;
        }
        if(select.exam_score.gre){
            select.exam_score.gre = exam;
        }
        if(select.exam_score.gmat){
            select.exam_score.gmat = exam;
        }

        $.ajax({
            url:'/v1/completeform/saveform.action',
            data:{
                token : '',
                nation : select.nation,
                locatioin : select.locatioin,
                pre_school : select.pre_school,
                pre_major : select.pre_major,
                pre_major2 : select.pre_major2,
                school_type : select.school_type,
                major_only : select.major_only,
                degree : select.degree,
                gpa : select.gpa,
                language : select.language,
                exam_score : select.exam_score,
                exchange : select.exchange,
                science_experience : select.science_experience,
                recommend : select.recommend,
                science_paper : select.science_paper,
                experience : select.experience,
                prize : select.prize,
                enter_date : new Date().getTime()
            },
            type:'post',
            cache:false,
            dataType:'json',
            success:function(data){
                console.log(data);
                window.location.href = "/select-school";
            },
            error : function() {
                base.notice('网络错误');
            }
        });


    }
    //生成图表
    function chart(){
        chartArea('.select-svg-gpa',gpaDate.before,gpaDate.now,5,50,function(){
            gpaDate.before = gpaDate.now;
        });
        chartArea('.select-svg-tofel',tofelDate.before,tofelDate.now,5,50,function(){
            tofelDate.before = tofelDate.now;
        });
        chartArea('.select-svg-gre',greDate.before,greDate.now,5,50,function(){
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
        if($(dom).find('svg')){
            $(dom).find('svg').remove();
        }
        if(!data1){
            data1 = {};
            data1.data = [];
            data1.lessMe = [];
            data1.dotMax = {};
            data1.dotMe = {};
            data1.dotMax.score = 0;
            data1.dotMax.number = 0;
            data1.dotMe.score = 0;
            data1.dotMe.number = 0;
            data1.color = {
                stroke : '#ffffff',
                fill : '#ffffff'
            };
            for(var i=0;i<data2.data.length;i++){
                data1.data.push({
                    score : 0,
                    number : 0
                });
                data1.lessMe.push({
                    score : 0,
                    number : 0
                })
            }
        }
        else{
            data1.lessMe = lessArr(data1);
            data1.dotMax = maxObj(data1);
            data1.dotMe = meObj(data1);
            data1.color = color(data1);
        }
        data2.lessMe = lessArr(data2);
        data2.dotMax = maxObj(data2);
        data2.dotMe = meObj(data2);
        data2.color = color(data2);


        //得分小于我的数据
        function lessArr(data){
            var less = [];
            for(var i=0;i<data.data.length;i++){
                if(data.data[i].score<=data.myScore){
                    less.push(data.data[i])
                }
            }
            return less;
        }
        //最高分数据
        function maxObj(data){
            var max = [];
            for(var i=0;i<data.data.length;i++){
                max.push(data.data[i].number)
            }
            var maxY = d3.max(max);
            for(var n=0;n<data.data.length;n++){
                if(data.data[n].number==maxY){
                    return data.data[n];
                }
            }
        }
        //我的得分数据
        function meObj(data){
            for(var i=0;i<data.data.length;i++){
                if(data.data[i].score==data.myScore){
                    return data.data[i];
                }
            }
        }

        //颜色
        function color(data){
            var color = {
                stroke : '',
                fill : ''
            };
            if(data.myScore>parseInt(data.dotMax.score)+parseInt((maxScore-data.dotMax.score)/2)){
                color.stroke = '#55ccff';
                color.fill = '#bdeafc';
            }
            else if(data.myScore>data.dotMax.score&&data.myScore<=parseInt(data.dotMax.score)+parseInt((maxScore-data.dotMax.score)/2)){
                color.stroke = '#72d38a';
                color.fill = '#c7f6d5';
            }
            else if(data.myScore<=data.dotMax.score){
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
            .domain([0,maxScore])
            .range([0,g_width]);
        var y = d3.scaleLinear()
            .domain([0,maxNumber])
            .range([g_height,0]);
        //面积生成器
        var area = d3.area()
            .x(function(d){
                return x(d.score);
            })
            .y0(g_height)
            .y1(function(d){
                return y(d.number);
            })
            .curve(d3.curveCatmullRom.alpha(0.5));
        //线条生成器
        var line = d3.line()
            .x(function(d){
                return x(d.score);
            })
            .y(function(d) {
                return y(d.number)-1;
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
            .attr('cx', x(data1.dotMax.score))
            .attr('cy', y(data1.dotMax.number))
            .transition()
            .duration(1000)
            .style('fill',data2.color.fill)
            .attr('cx', x(data2.dotMax.score))
            .attr('cy', y(data2.dotMax.number))
            .attr('r', 5);
        svg     //自己
            .append('g')
            .append('circle')
            .attr('class','svg-dot')
            .style('stroke',data1.color.stroke)
            .attr('cx', x(data1.dotMe.score))
            .attr('cy', y(data1.dotMe.number))
            .transition()
            .duration(1000)
            .style('stroke',data2.color.stroke)
            .attr('cx', x(data2.dotMe.score))
            .attr('cy', y(data2.dotMe.number))
            .attr('r', 4);
        svg     //最高点线
            .append('g')
            .append('line')
            .style('stroke','#ffffff')
            .style('stroke-width',1)
            .attr('x1', x(data1.dotMax.score))
            .attr('y1', y(data1.dotMax.number)+5)
            .attr('x2', x(data1.dotMax.score))
            .transition()
            .duration(1000)
            .attr('x1', x(data2.dotMax.score))
            .attr('y1', y(data2.dotMax.number)+5)
            .attr('x2', x(data2.dotMax.score))
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
            .attr('x', x(data1.dotMax.score)-36)
            .attr('y', y(data1.dotMax.number)-15)
            .transition()
            .duration(1000)
            .attr('x', x(data2.dotMax.score)-36)
            .attr('y', y(data2.dotMax.number)-15)
            .text('大多数人得分');
        svg     //我的得分文字
            .append('g')
            .append('text')
            .attr('x', x(data1.dotMe.score)-24)
            .attr('y', y(data1.dotMe.number)-15)
            .transition()
            .duration(1000)
            .attr('x', x(data2.dotMe.score)-24)
            .attr('y', y(data2.dotMe.number)-15)
            .text('我的得分');
        svg     //大多数人得分
            .append('g')
            .append('text')
            .attr('x', x(data1.dotMax.score)-8)
            .attr('y', g_height-5)
            .text(data1.dotMax.score)
            .transition()
            .duration(1000)
            .attr('x', x(data2.dotMax.score)-8)
            .attr('y', g_height-5)
            .text(data2.dotMax.score);
        svg     //我的得分
            .append('g')
            .append('text')
            .attr('x', x(data1.dotMe.score)-8)
            .attr('y', g_height-5)
            .text(data1.dotMax.score)
            .transition()
            .duration(1000)
            .attr('x', x(data2.dotMe.score)-8)
            .attr('y', g_height-5)
            .text(data2.dotMe.score);

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
            .text(maxScore);
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
            var str = percent.replace("%","")/100;
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