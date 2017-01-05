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
exports.yell = function (msg) {
    return msg.toUpperCase();
};
exports.raw = function(options) {
    return options.fn();
};
exports.ifNews = function(v1, v2, options) {
    if(v1 < v2) {
        return options.fn(this);
    }
    return options.inverse(this)
}
