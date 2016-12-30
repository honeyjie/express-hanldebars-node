exports.yell = function (msg) {
    return msg.toUpperCase();
};
exports.raw = function(options) {
    return options.fn();
}
