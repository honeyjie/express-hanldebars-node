define(["jquery"],function(e){function a(e){e.removeClass("error"),e.parent(".form-item").find(".form-item-notice").fadeOut(200)}function o(e,a){e.addClass("error"),a&&e.parent(".form-item").find(".form-item-notice span").html(a),e.parent(".form-item").find(".form-item-notice").fadeIn(200)}function n(e){$.ajax({url:"/v1/login/validname.action",data:{value:h.username},type:"post",cache:!1,dataType:"json",success:function(n){n.data.valid?(h.username="",o(e,"该用户名已注册")):a(e)},error:function(){d("网络错误")}})}function t(e){$.ajax({url:" /v1/account/check_email_valid.action",data:{email:h.email},type:"get",cache:!1,dataType:"json",success:function(n){n.data.valid?a(e):(h.email="",o(e,"该邮箱已注册"))},error:function(){d("网络错误")}})}function s(e){$.ajax({url:"/v1/login/validphone.action",data:{value:h.phone},type:"post",cache:!1,dataType:"json",success:function(n){n.valid?(h.phone="",o(e,"该手机号已注册")):a(e)},error:function(){d("网络错误")}})}function i(e){$.ajax({url:"/v1/User/saveuserbase.action",data:{password:h.oldpassword},type:"post",cache:!1,dataType:"json",success:function(n){0===n.code?a(e):(h.oldpassword="",o(e,"密码不正确"))},error:function(){d("网络错误")}})}function c(e){var a,o=e.split("@");switch(o[o.length-1]){case"sina.com":a="mail.sina.com.cn";break;case"qq.com":a="mail.qq.com";break;case"163.com":a="email.163.com";break;case"126.com":a="email.163.com";break;case"yeah.net":a="email.163.com";break;case"sohu.com":a="mail.sohu.com";break;case"gmail.com":a="www.gmail.com";break;case"hotmail.com":a="www.outlook.com";break;case"outlook.com":a="www.outlook.com";break;case"live.com":a="www.outlook.com";break;case"icloud.com":a="www.icloud.com";break;case"me.com":a="www.icloud.com";break;case"yahoo.com":a="mail.yahoo.com";break;default:a="www."+o[o.length-1]}return"http://"+a}function d(e,a){$(".notice").html(e),$(".notice").removeClass("hidden").addClass("animated fadeInDown").one(v,function(){$(".notice").removeClass("animated fadeInDown"),setTimeout(function(){$(".notice").addClass("animated fadeOutUp").one(v,function(){$(".notice").removeClass("animated fadeOutUp").addClass("hidden"),$(".notice").html(""),a&&a()})},3e3)})}function l(e,a){$(".notice").html(e),$(".notice").removeClass("hidden").addClass("animated fadeInDown").one(v,function(){$(".notice").removeClass("animated fadeInDown"),setTimeout(function(){$(".notice").addClass("animated fadeOutUp").one(v,function(){$(".notice").removeClass("animated fadeOutUp").addClass("hidden"),$(".notice").html(""),a&&a()})},200)})}function r(){$(".mask").removeClass("hidden").addClass("animated fadeIn").one(v,function(){$(".mask").removeClass("animated fadeIn")}),$(".fullpage-wrapper")[0]&&($.fn.fullpage.setAllowScrolling(!1),$.fn.fullpage.setKeyboardScrolling(!1))}function m(){$(".mask").addClass("animated fadeOut").one(v,function(){$(".mask").removeClass("animated fadeOut").addClass("hidden")}),$(".fullpage-wrapper")[0]&&($.fn.fullpage.setAllowScrolling(!0),$.fn.fullpage.setKeyboardScrolling(!0)),$(".fullpage-wrapper")[0]&&$("body").css("overflow","hidden")}function u(){base.openMask(),$(".login").addClass("index"),common.openLogin()}function f(){$.ajax({url:"/v1/account/send_register_valid_email.action",data:{},type:"post",cache:!1,dataType:"json",success:function(e){0==e.code?d("已向"+h.email+"发送了一封验证邮件，请查收"):console.log(e.msg)},error:function(){d("网络错误")}})}var h={};h.login=!1,h.username="",h.oldpassword="",h.password="",h.repassword="",h.email="",h.phone="",h.code="",h.school="",h.major="",h.grade="",h.country="",h.totalCredit=3e3;var p={},v="webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend";return $.fn.extend({testInput:function(e){e.rule.test($(this).val())?e.success($(this)):e.fail($(this))},tab:function(e,a){var o=$(this),n=o.find(".tab-title li"),t=o.find(".tab-box");n.on("click",function(){if(!$(this).hasClass("none")){var o=$(this).index();n.removeClass("active"),$(this).addClass("active"),t.addClass("hidden"),t.eq(o).removeClass("hidden"),0==o?e&&e():1==o&&a&&a()}})},select:function(e){var a=$(this),o=$(this).find(".form-select-value"),n=$(this).find(".form-select-option");a.on("click",function(e){e.stopPropagation(),$(".form-select-option").addClass("hidden"),n.hasClass("hidden")&&n.find("li").length?(a.addClass("focus"),n.removeClass("hidden")):(a.removeClass("focus"),n.addClass("hidden"))}),n.find("li").on("click",function(e){e.stopPropagation(),o.html($(this).html()),$(".form-select-option").addClass("hidden"),$(".form-select").removeClass("focus")})},radio:function(){$(this).find(".form-radio").on("click",function(){$(this).parents(".form-item").find(".form-radio").removeClass("selected"),$(this).addClass("selected")})},check:function(){_this=$(this),_this.find(".form-check").on("click",function(){$(this).hasClass("selected")?$(this).removeClass("selected"):$(this).addClass("selected")})}}),{userInfo:h,closeAll:p,animationend:v,usernameRule:/^[0-9a-zA-Z]{3,}$/,passwordRule:/^(?![a-zA-Z]+$)(?![a-z\d]+$)(?![A-Z\d]+$)(?![!#$%^&.?*@]+$)(?![!#$%^&*@.?\d]+$)(?![!#$%^&*@.?\da-z]+$)(?![!#$%^&*@.?\dA-Z]+$)[\da-zA-Z!#$%^&*@.?]{8,}$/,emailRule:/^[\w\.\_\-]+@(\w-?)+(\.\w{2,})$/,phoneRule:/^(|1\d{10})$/,codeRule:/^(|[0-9a-zA-Z]{4})$/,isDouble:/^[0-9]+([.]{1}[0-9]{1,2})?$/,onlyFloat:/^([0-9][.]{1}[0-9]{1})?$/,isInt:/^[0-9]*[0-9][0-9]*$/,isFloat:/^[0-9]+([.]{1}[0-9]{1})?$/,isOtherInput:/[^\a-\z\A-Z\u4E00-\u9FA5]/g,testSuccess:a,testFail:o,testUsername:n,testEmail:t,testPhone:s,testOldpassword:i,jumpEmail:c,notice:d,noticeShort:l,openMask:r,closeMask:m,sendTestEmail:f,openIndexLogin:u}});