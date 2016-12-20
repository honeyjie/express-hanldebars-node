var request = require("request");
var path = require("path");

function Proxy() {
    this.config = require("./config.json");
}
Proxy.prototype.request = function(apiName, options, callback) {
    var item = this.config[apiName];
    if (!item) {
        callback("'api " + apiName + " not exist'", null, null);
        return;
    }
    
    options = options || {}
    Object.assign(options, item);
    options.url = this.config["host"] + options.url;

    request(options, callback);
}

exports.proxy = new Proxy();
