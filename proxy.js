var request = require("request")
var j = request.jar();

function Proxy() {
    this.host = "http://www.utuotu.com";
}

Proxy.prototype.request = function(options, callback) {
    _options = {
        form: this.req.body,
        qs: this.req.query,
        method: this.req.method,
        url: this.host + this.req.path,
        headers: this.req.headers,
        jar: j
    }
    options = options || {};
    for (var k in options) {
        _options[k] = options[k];
    }
    request(_options, callback);
}

exports.proxy = Proxy;
