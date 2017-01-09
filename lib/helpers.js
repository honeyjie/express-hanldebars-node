exports.ifNews = function(v1, v2, options) {
    if(v1 < v2) {
        return optins.fn(this);
    }
    return options.inverse(this)
}
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
// var string = "/school-screen?search=&page=2"
// var a = getPage(string, 3);
// console.log(a);
// var pathname = url.parse(req.url).pathname;//将&page=3&置换
