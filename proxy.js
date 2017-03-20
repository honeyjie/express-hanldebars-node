var request = require("request");
var fs = require("fs");

function Proxy() {
    this.protocol = "http://";
    this.host = "api.inner.utuotu.com";
}

//拦截信息的转发逻辑,将浏览器传给node的参数，头部，方法，路径等信息原封不动转给request
Proxy.prototype.request = function(options, callback) {
    var _options = {
        form: this.req.body,
        qs: this.req.query,
        method: this.req.method,
        url: this.protocol + this.host + this.req.path,
        headers: this.req.headers,
    }

    options = options || {};
    for (var k in options) {
        _options[k] = options[k];
    }
    _options.headers.host = this.host;
    // 自动转发文件
    if (!!this.req.file) {
        _options.attachments = [
            fs.createReadStream(this.req.file.path)
        ]
    }

    request(_options, callback);
}

exports.proxy = Proxy;
