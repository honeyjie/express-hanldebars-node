define(['jquery','fullpage','base','common'],function(jquery,fullpage,base,common){
    $(function(){
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
            $('.complete-email').testInput({
                rule : base.emailRule,
                success : function(dom){
                    base.userInfo.email = dom.val();
                    base.testEmail();
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
                    base.testPhone();
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
            if(!base.userInfo.username||!base.userInfo.password||!base.userInfo.repassword||!base.userInfo.email){
                return;
            }
            $('.complete-submit').removeClass('button-solid-ban').addClass('button-solid');
        });

        //提交信息
        $('.register-submit').on('click',function(){
            register();
        });

        //未收到邮件
        $('.send-noreceive').on('click',function(){
            openNoreceive();
        });

        //修改邮箱地址
        $('.noreceive-content-change').on('click',function(){
            openRegister();
        });

        //重新发送
        $('.noreceive-content-resend').on('click',function(){
            base.sendTestEmail();
        });

        //忘记密码验证邮箱
        $('.email-email').on('blur',function(){
            $('.email-email').testInput({
                rule : base.emailRule,
                success : function(dom){
                    base.userInfo.email = dom.val();
                    base.testEmail();
                },
                fail : function(dom){
                    base.userInfo.email = '';
                    base.testFail(dom,'请输入有效的 Email 地址');
                }
            });
        });

        //忘记密码判断提交
        $('.register.email input').on('blur',function(){
            if(!base.userInfo.email){
                return;
            }
            $('.email-submit').removeClass('button-solid-ban').addClass('button-solid');
        });

        //发送邮箱
        $('.email-submit').on('click',function(){
            forgetPassword();
        });

        //验证新密码
        $('.reset-password').on('blur',function(){
            console.log('123')
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
        $('.register.reset input').on('blur',function(){
            if(!base.userInfo.password||!base.userInfo.password){
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
        openSend(); //测试
        //$.ajax({
        //    url:'http://utuotu.com/v1/login/register.action',
        //    data:{
        //        name : base.userInfo.username,
        //        password : base.userInfo.password,
        //        email : base.userInfo.email,
        //        phone : base.userInfo.phone?base.userInfo.phone:'',
        //        invite : base.userInfo.code?base.userInfo.phone:''
        //    },
        //    type:'post',
        //    cache:false,
        //    dataType:'json',
        //    success:function(data){
        //       base.sendTestEmail();
        //       openSend();
        //    },
        //    error : function() {
        //        base.notice('网络错误');
        //    }
        //});
    }

    function openRegister(){
        $('.noreceive').addClass('animated fadeOutUp').one(base.animationend,function(){
            $('.noreceive').removeClass('animated fadeOutUp').addClass('hidden');
        });
        $('.complete').removeClass('hidden').addClass('animated fadeInDown').one(base.animationend,function(){
            $('.complete').removeClass('animated fadeInDown');
        });
    }

    function openSend(){
        $('.send-button-jump').attr('href',base.jumpEmail(base.userInfo.email));
        $('.complete').addClass('animated fadeOutUp').one(base.animationend,function(){
            $('.complete').removeClass('animated fadeOutUp').addClass('hidden');
        });
        $('.send').removeClass('hidden').addClass('animated fadeInDown').one(base.animationend,function(){
            $('.send').removeClass('animated fadeInDown');
        });
    }

    function openNoreceive(){
        $('.send').addClass('animated fadeOutUp').one(base.animationend,function(){
            $('.send').removeClass('animated fadeOutUp').addClass('hidden');
        });
        $('.noreceive').removeClass('hidden').addClass('animated fadeInDown').one(base.animationend,function(){
            $('.noreceive').removeClass('animated fadeInDown');
        });
    }

    function forgetPassword(){
        if(!base.userInfo.email){
            return;
        }
        openForgetSend(); //测试
        //$.ajax({
        //    url:'',
        //    data:{
        //        email : base.userInfo.email
        //    },
        //    type:'post',
        //    cache:false,
        //    dataType:'json',
        //    success:function(data) {
        //        if(data.status==200){
        //            openSend();
        //        }
        //    },
        //    error : function() {
        //        alert('网络错误');
        //    }
        //});
    }

    function openForgetSend(){
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
        //$.ajax({
        //    url:'http://utuotu.com/v1/User/saveuserbase.action',
        //    data:{
        //        password : base.userInfo.password
        //    },
        //    type:'post',
        //    cache:false,
        //    dataType:'json',
        //    success:function(data) {
        //        if(data.code==0){
        //            base.notice('密码重置成功');
        //        }
        //    },
        //    error : function() {
        //        base.notice('网络错误');
        //    }
        //});
    }

    return{

    }


    
});