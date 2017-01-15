exports.section = function(name, block){
    if(!this._sections) this._sections = {};
    this._sections[name] = block.fn(this);
    return null;
};
exports.ifNews = function(v1, v2, options) {
    if(v1 < v2) {
        return options.fn(this);
    }
    return options.inverse(this)
}
exports.ifEq = function(v1, v2, options) {
    if(v1 === v2) {
        return options.fn(this);
    }
    return options.inverse(this)
}
exports.ifNotEq = function(v1, v2, options) {
    if(v1 == v2) {
        return options.inverse(this);
    }
    return options.fn(this);
}
exports.ifShowLogic = function(v1, v2, v3, str, options) {
    if(v1 == v2) {//-1
        return options.inverse(this);
    } else if(v1 == v3) {//0
        return str
    } else {
        return options.fn(this);
    }
}
exports.getPage = function(str, n) {
    var a = str.replace(/page=(\d)*/, 'page='+ n);
    return '<li><a href="'+ a +'">'+ n + '</a></li>'
}
exports.getString = function(str, n) {
    var a = str.replace(/page=(\d)*/, 'page='+ n);
    return a;
}
exports.showRequest = function(n, str1, str2, str3) {
    if (n == 0) {
        return str1
    } else if (n == -1) {
        return ''
    } else if (typeof n == 'string') {
        str3 = str3 || '';
        str2 = str2 || '';
        return str2 + n + str3;
    }
}
exports.bothNot = function(m, n, options) {
    if (m || n) {
        return options.inverse(this);
    } else {
        return options.fn(this);
    }
}
exports.showDate = function(time) {

    //2017-01-05 '10:21:07'.slice(0, 5)
    //今天 + 时：分, 当年，月，日和今天相同时
    //昨天 + 时：分，当年，月相同，日小一天时
    //年、月、日，其他显示
    var isYest = false;

    var now = new Date();
    var yearN = now.getFullYear();
    var monthN = now.getMonth();
    var date = now.getDate();

    var old = Date.parse(time);

    if (now - old <= 24*60*60) {
        isYest = true;
    }
    var arr0 = time.split(' ');
    var ymd = arr0[0].split('-');
    var hms = arr0[1].slice(0, 5)
    var yearO = ymd[0];
    var monthO = ymd[1];
    var dateO = ymd[2];

    //毫秒差小于24h

    if (yearN == ymd[0] && monthN == monthO && date == dateO) {
        return "今天"+ hms[0].slice(0,5);
    } else if (yearN == ymd[0] && monthN == monthO && isYest) {
        return "昨天"+ hms[0].slice(0,5);
    } else if(yearN == ymd[0]) {
        return  monthO + "月" + dateO + "日";
    }
    else {
        return yearO + "年"+ monthO + "月";
    }

}
exports.https = function(w) {
   if(w.slice(0, 7) === 'http://') {
        return w;
   } else {
    return 'https://'+ w;
   }
}