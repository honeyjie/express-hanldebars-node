define(['jquery','fullpage','base','common'],function(jquery,fullpage,base,common){
    $(function(){
        console.log(localStorage.getItem("isRegister"), typeof localStorage.getItem("isRegister"))
        if (localStorage.getItem("isRegister") == true) {
            openSend();
            console.log(localStorage.getItem("isRegister"))
        }
        //补全信息验证
        $('.complete-username').on('blur',function(){
            $('.complete-username').testInput({
                rule : base.usernameRule,
                success : function(dom){
                    base.userInfo.username = dom.val();
                    base.testUsername(dom);
                },
                fail : function(dom){
                    base.userInfo.username = '';
                    base.testFail(dom,'请输入3位以上数字或字母');
                }
            });
        });
        $('.complete-password').on('blur',function(){
            $('.complete-password').testInput({
                rule : base.passwordRule,
                success : function(dom){
                    base.userInfo.password = dom.val();
                    base.testSuccess(dom);
                },
                fail : function(dom){
                    base.userInfo.password = '';
                    base.testFail(dom,'请输入8位以上密码且必须含有数字、小写及大写字母');
                }
            });
        });
        $('.complete-repassword').on('blur',function(){
            var dom = $(this);
            if(dom.val() == base.userInfo.password){
                base.userInfo.repassword = dom.val();
                base.testSuccess(dom);
            }
            else{
                base.userInfo.repassword = '';
                base.testFail(dom,'密码不一致');
            }
        });

        $('.complete-email').on('blur',function(){
            //解决：避免值没变时重复发送邮件
            $('.complete-email').testInput({
                rule : base.emailRule,
                success : function(dom){
                    base.userInfo.email = dom.val();
                        base.testEmail(dom);
                },
                fail : function(dom){
                    base.userInfo.email = '';
                    base.testFail(dom,'请输入有效的 Email 地址');
                }
            });
        });
        $('.complete-phone').on('blur',function(){
            $('.complete-phone').testInput({
                rule : base.phoneRule,
                success : function(dom){
                    base.userInfo.phone = dom.val();
                    base.testPhone(dom);
                },
                fail : function(dom){
                    base.userInfo.phone = '';
                    base.testFail(dom,'请输入有效的手机号');
                }
            });
        });
        $('.complete-code').on('blur',function(){
            $('.complete-code').testInput({
                rule : base.codeRule,
                success : function(dom){
                    base.userInfo.code = dom.val();
                    base.testSuccess(dom);
                },
                fail : function(dom){
                    base.userInfo.code = '';
                    base.testFail(dom,'邀请码无效');
                }
            });
        });

        //补全信息判断提交
        $('.register.complete input').on('blur',function(){
            console.log(base.userInfo.username, base.userInfo.password, base.userInfo.repassword, base.userInfo.email)

            if(!base.userInfo.username||!base.userInfo.password||!base.userInfo.repassword||!base.userInfo.email){
                $('.complete-submit').removeClass('button-solid').addClass('button-solid-ban');
                return;
            }
            $('.complete-submit').removeClass('button-solid-ban').addClass('button-solid');
        });


        //提交信息
        $('.complete-submit').on('click',function(){
            register();
        });
        $('.complete-submit').keypress(function(e){
            if(e.witch === 13) {
                 register();
            }
        });

        //未收到邮件
        $(document).on('click',function(e){
            e.stopPropagation();
            //显示未收到页面

        });

        $('.send-noreceive').on('click',function(){
            openNoreceive();
        });

        //修改邮箱地址
        // $('.noreceive-content-change').on('click',function(){
        //     //定位到user-set页面
        //     window.location.href = "/user-set"
        //     //邮箱高亮
            
        //     // openRegister();
        // });

        //重新发送
        $('.noreceive-content-resend').on('click',function(){
            base.sendTestEmail();
            //补充前端代码
            openSend();
            
  
        });

        //忘记密码验证邮箱
        $('.email-email').on('blur',function(){
            $('.email-email').testInput({
                rule : base.emailRule,
                success : function(dom) {
                    base.userInfo.email = dom.val();
                },
                fail : function(dom){
                    base.userInfo.email = '';
                    base.testFail(dom,'请输入有效的 Email 地址');
                }
            });
        });

        //忘记密码判断提交
        $('.email-email').on('keyup', function() {
            canResetpassword();
        })

        function canResetpassword() {
            $('.email-submit').removeClass('button-solid-ban').addClass('button-solid');
        }

        //发送邮箱
        $('.email-submit').on('click',function(){
            var dom = $(this).parent().find('.email-email');
            forgettestEmail(dom);
        });

        //验证新密码
        $('.reset-password').on('blur',function(){
            $('.reset-password').testInput({
                rule : base.passwordRule,
                success : function(dom){
                    base.userInfo.password = dom.val();
                    base.testSuccess(dom);
                },
                fail : function(dom){
                    base.userInfo.password = '';
                    base.testFail(dom);
                }
            });
        });

        $('.reset-repassword').on('blur',function(){
            var dom = $(this);
            if(dom.val() == base.userInfo.password){
                base.userInfo.repassword = dom.val();
                base.testSuccess(dom);
            }
            else{
                base.userInfo.repassword = '';
                base.testFail(dom);
            }
        });

        //重置密码判断提交
        $('.reset input').on('blur',function(){
            if(!base.userInfo.password||!base.userInfo.repassword){
                $('.reset-submit').removeClass('button-solid').addClass('button-solid-ban');
                return;
            }
            $('.reset-submit').removeClass('button-solid-ban').addClass('button-solid');
        });

        //上传新密码
        $('.reset-submit').on('click',function(){
            resetPassword();
        })




    });

    function register(){
        if(!base.userInfo.username||!base.userInfo.password||!base.userInfo.repassword||!base.userInfo.email){
            return;
        }
        $.ajax({
           url:'/v1/login/register.action',
           data:{
               name : base.userInfo.username,
               password : base.userInfo.password,
               email : base.userInfo.email,
               phone : base.userInfo.phone ? base.userInfo.phone : '',
               invite : base.userInfo.code ? base.userInfo.code : ''
           },
           type:'post',
           cache:false,
           dataType:'json',
           success:function(data){
                if (data.code === 0) {
                    localStorage.setItem("isRegister", true)
                    openSend();
                    console.log(localStorage.getItem("isRegister"))
                }
           },
           error : function() {
               base.notice('网络错误');
           }
        });
    }

    function openRegister(){
        $('.noreceive').addClass('animated fadeOutUp').addClass('hidden');
        $('.complete').addClass('animated fadeInDown').removeClass('hidden');
        // $('.noreceive').addClass('animated fadeOutUp').one(base.animationend,function(){
        //     $('.noreceive').removeClass('animated fadeOutUp').addClass('hidden');
        // });
        // $('.complete').removeClass('hidden').addClass('animated fadeInDown').one(base.animationend,function(){
        //     $('.complete').removeClass('animated fadeInDown');
        // });
    }

    function openSend(){
        console.log("1")
        $('.send-button-jump').attr('href',base.jumpEmail(base.userInfo.email));
        // $('.complete').addClass('animated fadeOutUp').one(base.animationend,function(){
        //     $('.complete').removeClass('animated fadeOutUp')
        //     .addClass('hidden');
        // });
        $('.complete').removeClass('animated fadeOutUp').addClass('hidden');
        // $('.send').removeClass('hidden').addClass('animated fadeInDown').one(base.animationend,function(){
        //     $('.send').removeClass('animated fadeInDown');
        // });
        $('.noreceive').addClass('animated fadeOutUp').addClass('hidden');
        $('.send').removeClass('hidden').addClass('animated fadeInDown')
    }

    function openNoreceive(){
        //点击未收到邮件
        // $('.send').addClass('animated fadeOutUp').one(base.animationend,function(){
        //     $('.send').removeClass('animated fadeOutUp')
        //     .addClass('hidden');
        // });
        // $('.noreceive').removeClass('hidden').addClass('animated fadeInDown').one(base.animationend,function(){
        //     $('.noreceive').removeClass('animated fadeInDown');
        // });
        $('.send').removeClass('animated fadeOutUp').addClass('hidden');
        $('.noreceive').removeClass('hidden').removeClass('animated fadeOutUp').addClass('animated fadeInDown')
    }

    //忘记密码邮箱验证
    function forgettestEmail(dom){
        $.ajax({
            url:'/v1/msg/forget.action',
            data:{
                email : base.userInfo.email
            },
            type:'get',
            cache:false,
            dataType:'json',
            success:function(data){
                if(data.code.valid){
                    base.testSuccess(dom);
                    openForgetSend();
                }
                else{
                    base.userInfo.email = '';
                    base.testFail(dom,'该邮箱未注册');
                }
            },
            error : function() {
                notice('网络错误');
            }
        });
    } 

    function openForgetSend(){
        console.log(base.userInfo.email)
        $('.send-content span').html(base.userInfo.email);
        $('.send-jump').attr('href',base.jumpEmail(base.userInfo.email));
        $('.email').addClass('animated fadeOutUp').one(base.animationend,function(){
            $('.email').removeClass('animated fadeOutUp').addClass('hidden');
        });
        $('.send').removeClass('hidden').addClass('animated fadeInDown').one(base.animationend,function(){
            $('.send').removeClass('animated fadeInDown');
        });
    }


    function resetPassword(){
        if(!base.userInfo.password||!base.userInfo.repassword){
            return;
        }
        $.ajax({
           url:'/v1/Msg/validforget.action',
           data:{
               password : base.userInfo.password,
               token: window.location.search.split('=')[1]
           },
           type:'get',
           cache:false,
           dataType:'json',
           success:function(data) {
               if(data.code==0){
                   base.notice('密码重置成功');
                   window.location.href = '/'
               } else if(data.code === 111001012) {
                  base.notice('新密码不能与旧密码相同');
               } else if(data.code === 111001001) {
                    if (data.data.type === 2) {
                        base.notice('密码格式错误');
                    } else {
                        base.notice('无效链接')
                    }
               }
           },
           error : function() {
               base.notice('网络错误');
           }
        });
    }

    return{

    }


    
});