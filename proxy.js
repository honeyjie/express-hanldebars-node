var request = require("request");  //这个才是request

var path = require("path");

function Proxy() {
    this.config = require("./config.json");
}

//这个request只不过把request库封装了一下
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
