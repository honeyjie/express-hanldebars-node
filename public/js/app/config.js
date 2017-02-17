requirejs.config({
    //urlArgs: "bust=" +  (new Date()).getTime(), //禁止缓存
    baseUrl : 'js/lib',
    waitSeconds: 0,
    paths : {
        app : '../app',
        jquery : 'jquery-3.1.1.min',
        handlebars: 'handlebars',           //handlebar
        d3 : 'd3.min',                      //d3
        fullpage : 'jquery.fullPage.min',   //全屏滚动插件
        scrollbar : 'jquery.scrollbar.min', //滚动条插件
        clipboard : 'clipboard',            //复制插件
        base : '../app/base',               //基础模块
        common : '../app/common',           //公共模块
        index : '../app/index',
        register : '../app/register',
        user : '../app/user',
        school : '../app/school',
        select : '../app/select',
        help : '../app/help'
    },
    shim : {
        fullpage : ['jquery'],
        scrollbar : ['jquery'],
        captcha : ['jquery'],
        base : ['jquery'],
        common : ['jquery','base'],
        index : ['jquery','base','common'],
        register : ['jquery','base','common'],
        user : ['jquery','base','common'],
        school : ['jquery','handlebars','d3','base','common'],
        select : ['jquery','base','common','d3'],
        help : ['jquery','base','common']
    }

});
requirejs(['jquery','fullpage','scrollbar','d3','clipboard','base','common','index','register','user','school','select','help','handlebars'],function(jquery,fullpage,scrollbar,d3,clipboard,base,common,index,register,user,school,select,help,handlebars){

});