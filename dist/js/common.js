define(["jquery","base","scrollbar"],function(e,a,n){function o(){$(".header-search-icon").fadeOut(200),$(".header-search input").fadeIn(200),$(".header-search input")[0].focus()}function i(){$(".header-search input").val(""),$(".header-search-icon").fadeIn(200),$(".header-search input").fadeOut(200),$(".header-search-result").fadeOut(200)}function t(e){$(".header-search input").val()?($.ajax({url:"/Help/search.action",data:{value:e},type:"get",cache:!1,dataType:"html",success:function(e){$(".header-search-result-list").html(e),$("#search-scroll").scrollbar(),$("#search-scroll").on("wheel",function(e){e.stopPropagation()})},error:function(){a.notice("网络错误")}}),$(".header-search-result").fadeIn(200)):$(".header-search-result").fadeOut(200)}function s(e){$("body").css("overflow","hidden"),i(),a.openMask(),$(".view-article").removeClass("hidden").addClass("animated fadeInDown").one(a.animationend,function(){$(".view-article").removeClass("animated fadeInDown")}),$.ajax({url:"/v1/Msg/article.action",data:{id:e},type:"get",cache:!1,dataType:"json",success:function(e){$(".view-article-content p").html(e.data.content)},error:function(){a.notice("网络错误")}})}function l(){$("body").css("overflow","auto"),a.closeMask(),$(".view-article").addClass("animated fadeOutUp").one(a.animationend,function(){$(".view-article").removeClass("animated fadeOutUp").addClass("hidden")})}function c(){$.get("/login/opencode.action",{urlpath:window.location.pathname+window.location.search},function(e){new WxLogin({id:"login_container",appid:e.data.appid,scope:e.data.scope,redirect_uri:encodeURIComponent(e.data.redirect_uri),state:e.data.state,style:"black",href:"https://www.utuotu.com/css/wechat.css"});$(".fullpage-wrapper")[0]&&($.fn.fullpage.setMouseWheelScrolling(!1),$.fn.fullpage.setAllowScrolling(!1))}),$(".login").removeClass("hidden").addClass("animated fadeInDown").one(a.animationend,function(){$(".login").removeClass("animated fadeInDown")}),$("body").css("overflow","hidden")}function r(){$(".app").removeClass("filter"),$(".index-mask").addClass("hidden"),$(".login").addClass("animated fadeOutUp").one(a.animationend,function(){$(".login").removeClass("animated fadeOutUp index").addClass("hidden")}),$(".fullpage-wrapper")[0]&&($.fn.fullpage.setMouseWheelScrolling(!0),$.fn.fullpage.setAllowScrolling(!0))}function d(e){$(".login-box").removeClass("hidden"),e.parents(".login-box").addClass("hidden")}function u(){$(".login-captcha").removeClass("hidden"),$(".login-captcha-success").addClass("hidden"),$(".login-captcha-fail").addClass("hidden"),$.ajax({url:"/captcha/start.action",type:"get",cache:!1,dataType:"json",success:function(e){$(".login-captcha-title span").html(e.data.imageName),m=e.data.imageFieldName;for(var a="",n=0;n<5;n++)a+='<img data-value="'+e.data.values[n]+'" src="/captcha/image.action?index='+n+"&_="+Math.random()+'"/>';$(".login-captcha-pics").html(a),$(".login-captcha-pics img").click(m,function(e){e.preventDefault();var a=$(this).data("value");h(a,m)})},error:function(){a.notice("网络错误")}})}function h(e,n){$.ajax({url:"/captcha/try.action",data:{field:n,answer:e},type:"get",cache:!1,dataType:"json",success:function(e){e.data.valid?$(".login-captcha-success").removeClass("hidden"):($(".login-captcha-fail").removeClass("hidden"),u())},error:function(){a.notice("网络错误")}})}function p(){return a.userInfo.username=$(".login-username").val(),a.userInfo.password=$(".login-password").val(),a.userInfo.username?a.userInfo.password?void $.ajax({url:"/v1/login/login.action",data:{name:a.userInfo.username,password:a.userInfo.password},type:"post",cache:!1,dataType:"json",success:function(e){0==e.code?e.data.login&&location.reload():111001004==e.code?($(".login-message").removeClass("hidden").html("用户名不存在"),$(".login-captcha").hasClass("hidden")||u()):111001005==e.code?($(".login-message").removeClass("hidden").html("密码错误"),e.data.valid&&u(),$(".login-captcha").hasClass("hidden")||u()):111001010==e.code&&($(".login-message").removeClass("hidden").html("请点击图标进行验证"),u())},error:function(){a.notice("网络错误")}}):void $(".login-message").removeClass("hidden").html("密码不能为空"):void $(".login-message").removeClass("hidden").html("用户名不能为空")}function f(){$.ajax({url:"/v1/login/logout.action",data:{},type:"get",cache:!1,dataType:"json",success:function(e){0==e.code&&(window.location.href="/")},error:function(){a.notice("网络错误")}})}function g(){$(".app").addClass("filter"),$(".index-mask").removeClass("hidden"),$(".login").addClass("index"),c()}var m;return $(document).on("click",function(e){if(i(),$(".login")[0]&&!$(".login").hasClass("hidden")){if($(".select-form")[0])return void $(".select-form").addClass("disabled");r()}if($(".form-select").removeClass("focus"),$(".form-select-option").addClass("hidden"),$(".point-view")[0]&&!$(".point-view").hasClass("hidden")&&a.closeAll.closePointView(),$(".news-article")[0]&&!$(".news-article").hasClass("hidden")){if(console.log("1",$(e.target).parent().parent().hasClass("view")),$(".user-main").hasClass("disabled")&&!$(e.target).parent().parent().hasClass("view"))return;a.closeAll.closeNewsArticle()}$(".select-form-view")[0]&&!$(".select-form-view").hasClass("hidden")&&a.closeAll.closeSelectView(),$(".help")[0]&&!$(".help").hasClass("hidden")&&a.closeAll.closeHelp()}),$(".mask").on("click",function(e){e.stopPropagation(),$(".view-article")[0]&&!$(".view-article").hasClass("hidden")&&l(),$(".point-list")[0]&&!$(".point-list").hasClass("hidden")&&a.closeAll.closePointList(),$(".select-form-view")[0]&&!$(".select-form-view").hasClass("hidden")&&a.closeAll.closeSelectView()}),$("#view-article-scroll").scrollbar(),$("#view-article-scroll").on("wheel",function(e){e.stopPropagation()}),$(".header-user-info").on("mouseenter",function(){$(".header-user-info-operation").fadeIn(200)}),$(".header-user-info").on("mouseleave",function(){$(".header-user-info-operation").fadeOut(200)}),$(".header-search-icon").on("click",function(e){e.stopPropagation(),o()}),$(".header-search input").on("input propertychange",function(){var e=$(this).val();t(e),setTimeout(function(){$(".searchmore").attr("href","/school-list?value="+e+"&page=0")},500)}),$(".header-search").on("click",function(e){e.stopPropagation()}),$("#search-scroll").on("click",".header-search-result-article ul li",function(e){e.preventDefault(),e.stopPropagation(),s($(this).attr("article-id"))}),$(".view-article-title").on("click",".view-article-close",function(e){e.stopPropagation(),l()}),$(".header-user-login-title").on("click",function(e){e.stopPropagation(),$(".login").removeClass("index"),c()}),$(".login-switch").on("click",function(e){e.stopPropagation(),d($(this))}),$(".login-switch").on("mouseenter",function(){$(".login-switch-notice").fadeIn(200)}),$(".login-switch").on("mouseleave",function(){$(".login-switch-notice").fadeOut(200)}),$(".login-captcha-refresh").on("click",function(){u()}),$(".login").on("click",function(e){e.stopPropagation()}),$(".login-box input").on("input propertychange",function(){return $(".login-username").val()&&$(".login-password").val()?void $(".login-submit").removeClass("button-solid-ban").addClass("button-solid"):void $(".login-submit").removeClass("button-solid").addClass("button-solid-ban")}),$(".login-submit").on("click",function(e){e.stopPropagation(),p()}),$(".login-box").on("keydown",function(e){var e=e||window.event;13===e.keyCode&&p()}),$(".header-user-logout").on("click",function(e){e.stopPropagation(),f()}),$(".footer-agreement a").on("click",function(e){e.stopPropagation(),$("body").css("overflow","hidden"),a.openMask(),$(".view-article").removeClass("hidden").addClass("animated fadeInDown").one(a.animationend,function(){$(".view-article").removeClass("animated fadeInDown")}),$(".view-article-title").text("隐私协议"),$(".view-article-title").append("<img class='view-article-close' src='/img/icon-close.png'>"),$(".view-article-content p").html($(".agreement-content").html())}),{openLogin:c,closeLogin:r,openIndexLogin:g,closeArticle:l}});