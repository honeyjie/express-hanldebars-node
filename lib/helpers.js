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
    //年、月、日，其他显示 2017-01-17 20:41:27 Date.parse('2017-01-17 20:41:27')
    var isYest = false;

    var now = new Date();
    var yearN = now.getFullYear();
    var monthN = now.getMonth() + 1;
    var date = now.getDate();

    var old = Date.parse(time);


    if (now - old <= 24*60*60*1000) {
        isYest = true;

    }
    var arr0 = time.split(' ');
    var ymd = arr0[0].split('-');
    var hms = arr0[1].slice(0, 5)
    var yearO = ymd[0];
    var monthO = ymd[1];
    var dateO = ymd[2].slice(0,1) == 0 ? ymd[2].slice(-1) : ymd[2];

    //毫秒差小于24h

    if (yearN == ymd[0] && monthN == monthO && date == dateO) {
        return "今天 "+ hms.slice(0,5);
    } else if (yearN == ymd[0] && monthN == monthO && isYest && date !== dateO) {
        return "昨天 "+ hms.slice(0,5);
    } else if(yearN == ymd[0] && (monthN == !monthO || date !== dateO)) {
        return  monthO + "月" + dateO + "日";
    }
    else {
        return yearO + "年"+ monthO + "月";
    }

}
exports.noneShow = function(m, options) {
    //遍历m对象的全部属性，当都返回-1时，不展示
    for (i in m) {
        if(!m.hasOwnProperty(i)) {
            continue;
        }
        if(m[i] !== -1) {
            return options.fn(this);
        } else {
            continue;
        }
        return options.inverse(this);
    }
    // if (m || n) {
    //     return options.inverse(this);
    // } else {
    //     return options.fn(this);
    // }
}
// exports.https = function(w) {
//    if(w.slice(0, 7) === 'http://') {
//         return w;
//    } else {
//     return 'https://'+ w;
//    }
// }
