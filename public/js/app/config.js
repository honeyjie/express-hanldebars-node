requirejs.config({
    //urlArgs: "bust=" +  (new Date()).getTime(), //禁止缓存
    baseUrl : 'js/lib',
    paths : {
        app : '../app',
        jquery : 'jquery-3.1.1.min',
        handlebars: 'handlebars',           //handlebar
        d3 : 'd3.min',                      //d3
        fullpage : 'jquery.fullPage.min',   //全屏滚动插件
        iscroll : 'iscroll',                //滚动条插件
        captcha : 'visualcaptcha.jquery',   //验证码插件
        base : '../app/base',               //基础模块
        common : '../app/common',           //公共模块
        index : '../app/index',
        register : '../app/register',
        user : '../app/user',
        school : '../app/school',
        select : '../app/select',
        help : '../app/help',
        countries: '../countries'
    },
    shim : {
        fullpage : ['jquery'],
        iscroll : ['jquery'],
        captcha : ['jquery'],
        base : ['jquery'],
        countries: ['jquery'],
        common : ['jquery','base'],
        index : ['jquery','base','common'],
        register : ['jquery','base','common'],
        user : ['jquery','base','common'],
        school : ['jquery','handlebars','d3','countries','base','common'],
        select : ['jquery','base','common','d3'],
        help : ['jquery','base','common']
    }

});
requirejs(['jquery','fullpage','iscroll','d3','captcha','base','common','index','register','user','school','select','help','countries','handlebars'],function(jquery,fullpage,iscroll,d3,captcha,base,common,index,register,user,school,select,help,countries,handlebars){

});