define(["jquery","fullpage","base","common"],function(e,o,n,s){function t(){if(n.userInfo.username&&n.userInfo.password&&n.userInfo.repassword&&n.userInfo.email){if($(".agreeBox img").eq(1).hasClass("hidden"))return void n.notice("请阅读并同意网站隐私协议");console.log(n.userInfo.username,n.userInfo.password,n.userInfo.email,n.userInfo.phone,n.userInfo.code),$.ajax({url:"/v1/login/register.action",data:{name:n.userInfo.username,password:n.userInfo.password,email:n.userInfo.email,phone:n.userInfo.phone?n.userInfo.phone:"",invite:n.userInfo.code?n.userInfo.code:""},type:"post",cache:!1,dataType:"json",success:function(e){console.log(e),0===e.code&&(a(),console.log("已注册"),localStorage.setItem("registerEmail",n.userInfo.email),console.log(localStorage.getItem("registerEmail")),$(".send-email").text(n.userInfo.email),$(".noreceive-email").text(n.userInfo.email))},error:function(){n.notice("网络错误")}})}}function a(){$(".send-button-jump").attr("href",n.jumpEmail(n.userInfo.email)),$(".complete").removeClass("animated fadeOutUp").addClass("hidden"),$(".noreceive").addClass("animated fadeOutUp").addClass("hidden"),$(".send").removeClass("hidden").addClass("animated fadeInDown")}function i(){$(".send").removeClass("animated fadeOutUp").addClass("hidden"),$(".noreceive").removeClass("hidden").removeClass("animated fadeOutUp").addClass("animated fadeInDown")}function l(e){console.log("+++"),$.ajax({url:"/v1/account/forget.action",data:{email:n.userInfo.email},type:"get",cache:!1,dataType:"json",success:function(o){console.log(o),0===o.code?(n.testSuccess(e),n.notice("已向"+n.userInfo.email+"发送了一封验证邮件，请查收"),setTimeout(function(){r()},3e3)):(n.userInfo.email="",n.testFail(e,"该邮箱未注册"))},error:function(){n.notice("网络错误")}})}function r(){console.log(n.userInfo.email),$(".send-content span").html(n.userInfo.email),$(".send-jump").attr("href",n.jumpEmail(n.userInfo.email)),$(".email").addClass("animated fadeOutUp").one(n.animationend,function(){$(".email").removeClass("animated fadeOutUp").addClass("hidden")}),$(".send").removeClass("hidden").addClass("animated fadeInDown").one(n.animationend,function(){$(".send").removeClass("animated fadeInDown")})}function c(){n.userInfo.password&&n.userInfo.repassword&&$.ajax({url:"/v1/account/forget_reset_pwd.action",data:{password:n.userInfo.password,token:window.location.search.split("=")[1]},type:"POST",cache:!1,dataType:"json",success:function(e){console.log(e),0==e.code?(n.notice("密码重置成功"),window.location.href="/"):111001012===e.code?n.notice("新密码不能与旧密码相同"):111002002===e.code?n.notice("链接已失效"):n.notice(e.msg)},error:function(){n.notice("网络错误")}})}return $(function(){function e(){return $(".email-email").val()?void $(".email-submit").removeClass("button-solid-ban").addClass("button-solid"):void $(".email-submit").removeClass("button-solid").addClass("button-solid-ban")}$(".complete-username").on("blur",function(){$(".complete-username").testInput({rule:n.usernameRule,success:function(e){n.userInfo.username=e.val(),n.testUsername(e)},fail:function(e){n.userInfo.username="",n.testFail(e,"请输入3位以上数字或字母")}})}),$(".complete-password").on("blur",function(){$(".complete-password").testInput({rule:n.passwordRule,success:function(e){n.userInfo.password=e.val(),n.testSuccess(e)},fail:function(e){n.userInfo.password="",n.testFail(e,"请输入8位以上密码且必须含有数字、小写及大写字母")}})}),$(".complete-repassword").on("blur",function(){var e=$(this);e.val()==n.userInfo.password?(n.userInfo.repassword=e.val(),n.testSuccess(e)):(n.userInfo.repassword="",n.testFail(e,"密码不一致"))}),$(".complete-email").on("blur",function(){$(".complete-email").testInput({rule:n.emailRule,success:function(e){n.userInfo.email=e.val(),n.testEmail(e)},fail:function(e){n.userInfo.email="",n.testFail(e,"请输入有效的 Email 地址")}})}),$(".complete-phone").on("blur",function(){$(".complete-phone").testInput({rule:n.phoneRule,success:function(e){n.userInfo.phone=e.val(),n.testPhone(e)},fail:function(e){n.userInfo.phone="",n.testFail(e,"请输入有效的手机号")}})}),$(".complete-code").on("blur",function(){$(".complete-code").testInput({rule:n.codeRule,success:function(e){n.userInfo.code=e.val(),n.testSuccess(e)},fail:function(e){n.userInfo.code="",n.testFail(e,"邀请码无效")}})}),$(".register.complete input").on("input propertychange",function(){return $(".complete-username").val()&&$(".complete-password").val()&&$(".complete-repassword").val()&&$(".complete-email").val()?void $(".complete-submit").removeClass("button-solid-ban").addClass("button-solid"):void $(".complete-submit").removeClass("button-solid").addClass("button-solid-ban")}),$(".complete-submit").on("click",function(){t()}),$(".complete-submit").on("keydown",function(e){13===e.witch&&(console.log("1"),$(this).trigger("click"))}),$(document).on("click",function(e){e.stopPropagation()}),$(".send-noreceive").on("click",function(){i()}),$(".noreceive-content-change").on("click",function(){localStorage.setItem("emailChange","true"),console.log(localStorage.getItem("emailChange"))}),$(".noreceive-content-resend").on("click",function(){n.sendTestEmail(),a()}),$(".email-email").on("blur",function(){$(".email-email").testInput({rule:n.emailRule,success:function(e){n.userInfo.email=e.val(),n.testSuccess(e)},fail:function(e){n.userInfo.email="",n.testFail(e,"请输入有效的 Email 地址")}})}),$(".email-email").on("input propertychange",function(){e()}),$(".email-submit").on("click",function(){var e=$(this).parent().find(".email-email");console.log(e.text(),e.text()),e.hasClass("error")||e.text()||l(e)}),$(".reset-password").on("blur",function(){$(".reset-password").testInput({rule:n.passwordRule,success:function(e){n.userInfo.password=e.val(),n.testSuccess(e)},fail:function(e){n.userInfo.password="",n.testFail(e)}})}),$(".reset-repassword").on("blur",function(){var e=$(this);e.val()==n.userInfo.password?(n.userInfo.repassword=e.val(),n.testSuccess(e)):(n.userInfo.repassword="",n.testFail(e))}),$(".reset input").on("input propertychange",function(){return console.log("1"),console.log($(".reset-password").val(),$(".reset-repassword").val()),$(".reset-password").val()&&$(".reset-repassword").val()?void $(".reset-submit").removeClass("button-solid-ban").addClass("button-solid"):void $(".reset-submit").removeClass("button-solid").addClass("button-solid-ban")}),$(".reset-submit").on("click",function(){c()})}),$(".agreeBox img").on("click",function(e){e.stopPropagation(),$(".agreeBox img").removeClass("hidden"),$(this).addClass("hidden")}),$(".agreeBox label span").on("click",function(e){e.stopPropagation(),$("body").css("overflow","hidden"),n.openMask(),$(".view-article").removeClass("hidden").addClass("animated fadeInDown").one(n.animationend,function(){$(".view-article").removeClass("animated fadeInDown")}),$(".view-article-title").text("隐私协议"),$(".view-article-title").append("<img class='view-article-close' src='/img/icon-close.png'>"),$(".view-article-content p").html($(".agreement-content").html())}),$(".view-article-title").on("click",".view-article-close",function(e){e.stopPropagation(),s.closeArticle(),$(".view-article-title").text("文章"),$(".view-article-content p").html(""),$(".view-article-title").append("<img class='view-article-close' src='/img/icon-close.png'>")}),{}});