var request = require("request")

function Proxy() {
    this.host = "http://www.utuotu.com";
}

Proxy.prototype.request = function(options, callback) {
    // console.log(this.req.query);
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
    // console.log(_options);
    request(_options, callback);
}

exports.proxy = Proxy;
