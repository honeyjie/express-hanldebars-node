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
exports.getPage = function(str, n) {
    var a = str.replace(/page=(\d)*/, 'page='+ n);
    return '<li><a href="'+ a +'">'+ n + '</a></li>'
}
exports.getString = function(str, n) {
    var a = str.replace(/page=(\d)*/, 'page='+ n);
    return a;
}
// var string = "/school-screen?search=&page=2"
// var a = getPage(string, 3);
// console.log(a);
// var pathname = url.parse(req.url).pathname;//将&page=3&置换
