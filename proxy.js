var request = require("request")

function Proxy() {
    this.host = "http://www.utuotu.com";
}

Proxy.prototype.request = function(options, callback) {
    var _options = {
        form: this.req.body,
        qs: this.req.query,
        method: this.req.method,
        url: this.host + this.req.path,
        headers: this.req.headers,
    }
    options = options || {};
    for (var k in options) {
        _options[k] = options[k];
    }
    request(_options, callback);
}

exports.proxy = Proxy;
