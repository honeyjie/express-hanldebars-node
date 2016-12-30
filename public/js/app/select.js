define(['jquery','fullpage','iscroll','base','common'],function(jquery,fullpage,iscroll,base,common){

    var select = {};
        select.nation = 'US';                   //国家
        select.locatioin = 1;                   //地区
        select.pre_school = '';                 //之前学校
        select.pre_major = '';                  //之前专业1
        select.pre_major2 = '';                 //之前专业2
        select.school_type = 1;                 //学校类别
        select.major_only = 1;                  //是否接受相关专业
        select.degree = 'master';               //学位
        select.gpa = null;                             //GPA
        select.language = {toefl:{}};
        select.exam_score = {gre:{}};
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

    $(function(){
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
                content.animate({minHeight:height[index]},200);
            }
            else{
                content.animate({height:0},200);
            }
        });
        //选择国家
        $('.select-country .select-preference-radio').on('click',function(){
            $('.select-country .select-preference-radio').removeClass('active');
            $(this).addClass('active');
            select.nation = $(this).data('value');
        });
        //选择地区
        $('.select-position .select-preference-radio').on('click',function(){
            $('.select-position .select-preference-radio').removeClass('active');
            $(this).addClass('active');
            select.locatioin = $(this).data('value');
        });
        //毕业学校 输入
        $('.select-school').on('input propertychange',function(){
            $('.select-info-school').find('.form-select-option').removeClass('hidden');  //测试
            selectSchool($(this).val());
        });
        //毕业学校 选择
        $('.select-info-school .form-select-option li').on('click',function(){
            $('.select-school').val($(this).html());
            select.pre_school = $(this).html();
        });
        //毕业学校 失去焦点
        $('.select-school').on('blur',function(){
            select.pre_school = $(this).val();
        });
        //毕业专业1 输入
        $('.select-major').on('input propertychange',function(){
            $('.select-info-major').find('.form-select-option').removeClass('hidden');  //测试
            selectMajor($(this).val(),1);
        });
        //毕业专业1 选择
        $('.select-info-major .form-select-option li').on('click',function(){
            $('.select-major').val($(this).html());
            select.pre_major = $(this).html();
            if(select.pre_major=='法学类'){
                $('.select-form-last').removeClass('hidden');
            }
            else{
                $('.select-form-last').addClass('hidden');
            }
        });
        //毕业专业1 失去焦点
        $('.select-major').on('blur',function(){
            select.pre_major = $(this).val();
            if(select.pre_major=='法学类'){
                $('.select-form-last').removeClass('hidden');
            }
            else{
                $('.select-form-last').addClass('hidden');
            }
        });
        //毕业专业2 输入
        $('.select-major2').on('input propertychange',function(){
            $('.select-info-major2').find('.form-select-option').removeClass('hidden');  //测试
            selectMajor($(this).val(),2);
        });
        //毕业专业2 选择
        $('.select-info-major2 .form-select-option li').on('click',function(){
            $('.select-major2').val($(this).html());
            select.pre_major2 = $(this).html();

        });
        //毕业专业2 失去焦点
        $('.select-major2').on('blur',function(){
            select.pre_major2 = $(this).val();
        });
        //毕业时间
        $('.select-school-type .form-radio').on('click',function(){
            select.school_type = $(this).data('value');
        });
        //申请专业
        $('.select-major-only .form-radio').on('click',function(){
            if($(this).data('value')==0){
                $('.select-info-major2').removeClass('hidden');
            }
            else if($(this).data('value')==1){
                $('.select-info-major2').addClass('hidden');
            }
            select.major_only = $(this).data('value');
        });
        //申请学位
        $('.select-degree .form-radio').on('click',function(){
            select.degree = $(this).data('value');
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
        });
        //语言考试 单选
        $('.select-language .form-radio').on('click',function(){
            if($(this).find('.form-radio-value').html()=='TOEFL'){
                select.language = {toefl:{}};
            }
            else if($(this).find('.form-radio-value').html()=='IELTS'){
                select.language = {ielts:{}};
            }
            $('.select-language-input input')[0].focus();
            $('.select-language-input input')[0].blur();
        });
        //语言考试 overall
        $('.select-language-overall').on('blur',function(){
            $(this).testInput({
                rule : base.isScore,
                success : function(dom){
                    if(dom.val()<0||dom.val()>100){
                        language.overall = null;
                        base.testFail(dom,'TOFEL有效分值为0~120分');
                        return;
                    }
                    language.overall = dom.val();
                    base.testSuccess(dom);
                },
                fail : function(dom){
                    language.overall = null;
                    base.testFail(dom,'TOFEL有效分值为0~120分');
                }
            });
        });
        //语言考试 R
        $('.select-language-r').on('blur',function(){
            $(this).testInput({
                rule : base.isScore,
                success : function(dom){
                    if(dom.val()<0||dom.val()>30){
                        language.R = null;
                        base.testFail(dom,'TOFEL分项成绩有效分值为0~30分');
                        return;
                    }
                    language.R = dom.val();
                    base.testSuccess(dom);
                },
                fail : function(dom){
                    language.R = null;
                    base.testFail(dom,'TOFEL分项成绩有效分值为0~30分');
                }
            });
        });
        //语言考试 L
        $('.select-language-l').on('blur',function(){
            $(this).testInput({
                rule : base.isScore,
                success : function(dom){
                    if(dom.val()<0||dom.val()>30){
                        language.L = null;
                        base.testFail(dom,'TOFEL分项成绩有效分值为0~30分');
                        return;
                    }
                    language.L = dom.val();
                    base.testSuccess(dom);
                },
                fail : function(dom){
                    language.L = null;
                    base.testFail(dom,'TOFEL分项成绩有效分值为0~30分');
                }
            });
        });
        //语言考试 S
        $('.select-language-s').on('blur',function(){
            $(this).testInput({
                rule : base.isScore,
                success : function(dom){
                    if(dom.val()<0||dom.val()>30){
                        language.S = null;
                        base.testFail(dom,'TOFEL分项成绩有效分值为0~30分');
                        return;
                    }
                    language.S = dom.val();
                    base.testSuccess(dom);
                },
                fail : function(dom){
                    language.S = null;
                    base.testFail(dom,'TOFEL分项成绩有效分值为0~30分');
                }
            });
        });
        //语言考试 W
        $('.select-language-w').on('blur',function(){
            $(this).testInput({
                rule : base.isScore,
                success : function(dom){
                    if(dom.val()<0||dom.val()>30){
                        language.W = null;
                        base.testFail(dom,'TOFEL分项成绩有效分值为0~30分');
                        return;
                    }
                    language.W = dom.val();
                    base.testSuccess(dom);
                },
                fail : function(dom){
                    language.W = null;
                    base.testFail(dom,'TOFEL分项成绩有效分值为0~30分');
                }
            });
        });
        //标准化考试 单选
        $('.select-exam .form-radio').on('click',function(){
            if($(this).find('.form-radio-value').html()=='GMAT'){
                select.exam_score = {gmat:{}};
                $('.select-gresub').addClass('hidden');
            }
            else if($(this).find('.form-radio-value').html()=='GRE'){
                select.exam_score = {gre:{}};
                $('.select-gresub').removeClass('hidden');
            }
            $('.select-exam-input input')[0].focus();
            $('.select-exam-input input')[0].blur();
        });
        //标准化考试 overall
        $('.select-exam-overall').on('blur',function(){
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
        $('.select-exam-v').on('blur',function(){
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
        $('.select-exam-q').on('blur',function(){
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
        $('.select-exam-aw').on('blur',function(){
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
            }
            else{
                $(this).find('.form-select').addClass('hidden');
                $(this).find('.form-select-value').html('1年以下');
                select.science_experience.splice(arr.indexOf(n),1);
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
                arr.push(value.name)
            });
            if(arr.indexOf(n)==-1){
                $(this).find('.form-check-input').removeClass('hidden');
                $(this).find('.form-check-input input').each(function(){
                    select.science_paper.push({name:n,value:$(this).data('value'),num:0});
                })
            }
            else{
                $(this).find('.form-check-input').addClass('hidden');
                $(this).find('.form-check-input input').val('');
                $.each(select.science_paper,function(){
                    select.science_paper.splice(arr.indexOf(n),1);
                });
            }
        });
        //学术成就 input
        $('.select-achievement .form-check-input').on('click',function(e){
            e.stopPropagation();
        });
        $('.select-achievement .form-check-input input').on('blur',function(){
            var val = $(this).data('value');
            var num = parseInt($(this).val());
            var n = $(this).parents('.form-item').find('.form-check').index($(this).parents('.form-check'));
            $.each(select.science_paper,function(index,value){
                if(value.name == n+1&&value.value == val){
                    value.num = num;
                }
            });
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
            }
            else{
                $(this).find('.form-select').addClass('hidden');
                $(this).find('.form-select-value').html('1年以下');
                select.experience.splice(arr.indexOf(n),1);
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
            }
            else{
                $(this).find('.form-select').addClass('hidden');
                $(this).find('.form-select-value').html('1年以下');
                select.prize.splice(arr.indexOf(n),1);
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

    });

    function selectSchool(school){
        $.ajax({
            url:'/v1/completeform/chinaschool.action',
            data:{
                schoolname : school
            },
            type:'post',
            cache:false,
            dataType:'json',
            success:function(data){
                $('.select-info-school').find('.form-select-option').removeClass('hidden');
            },
            error : function() {
                base.notice('网络错误');
            }
        });
    }

    function selectMajor(major,n){
        $.ajax({
            url:'/v1/completeform/chinamajor.action',
            data:{
                majorname : major
            },
            type:'post',
            cache:false,
            dataType:'json',
            success:function(data){
                if(n==1){
                    $('.select-info-major').find('.form-select-option').removeClass('hidden');
                }
                else if(n==2){
                    $('.select-info-major2').find('.form-select-option').removeClass('hidden');
                }
            },
            error : function() {
                base.notice('网络错误');
            }
        });
    }

    function submitSelect(){
        if(!select.pre_school||!select.pre_major){
            var dom1 = [$('.select-school'),$('.select-major')];
            for(var i=0;i<dom1.length;i++){
                if(!dom1[i].val()){
                    dom1[i][0].focus();
                    break;
                }
            }
            $('.select-title').eq(1).addClass('error');
            return;
        }
        $('.select-title').eq(1).removeClass('error');
        if(!select.gpa||!language.overall||!language.R||!language.L||!language.S||!language.W||!language.overall||!exam.overall||!exam.V||!exam.Q||!exam.AW){
            var dom2 = [$('.select-gpa'),$('.select-language-overall'),$('.select-language-r'),$('.select-language-l'),$('.select-language-s'),$('.select-language-w'),$('.select-exam-overall'),$('.select-exam-v'),$('.select-exam-q'),$('.select-exam-aw')];
            for(var n=0;n<dom2.length;i++){
                if(!dom2[n].val()){
                    dom2[n][0].focus();
                    break;
                }
            }
            $('.select-title').eq(2).addClass('error');
            return;
        }
        $('.select-title').eq(2).removeClass('error');
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
            url:'/v1/completeform/chinamajor.action',
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

            },
            error : function() {
                base.notice('网络错误');
            }
        });
    }

    return{

    }
});