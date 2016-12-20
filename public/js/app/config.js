requirejs.config({
    urlArgs: "bust=" +  (new Date()).getTime(), //禁止缓存
    baseUrl : 'js/lib',
    paths : {
        app : '../app',
        jquery : 'jquery-2.1.3.min',
        fullpage : 'jquery.fullPage.min',   //全屏滚动插件
        iscroll : 'iscroll',                //滚动条插件
        captcha : 'visualcaptcha.jquery',   //验证码插件
        base : '../app/base',               //基础模块
        common : '../app/common',           //公共模块
        index : '../app/index',
        register : '../app/register',
        user : '../app/user',
        help : '../app/help'
    },
    shim : {
        fullpage : ['jquery'],
        iscroll : ['jquery'],
        captcha : ['jquery'],
        base : ['jquery'],
        common : ['jquery','base'],
        index : ['jquery','base','common'],
        register : ['jquery','base','common'],
        user : ['jquery','base','common'],
        help : ['jquery','base','common']
    }

});
requirejs(['jquery','fullpage','iscroll','captcha','base','common','index','register','user','help'],function(jquery,fullpage,iscroll,captcha,base,common,index,register,user,help){

});
