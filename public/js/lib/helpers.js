var register = function(Handlebars) {
    var helpers = {
        foo: function() {
            return "Foo";
        },
        bar: function() {
            return "BAR";
        },
        section: function(name, block){
            if(!this._sections) this._sections = {};
            this._sections[name] = block.fn(this);
            return null;
        },
        yell: function (msg) {
            return msg.toUpperCase();
        },
        raw: function(options) {
            return options.fn();
        },
        msg: function(msg) {
        return !!msg
        },
        ifNews: function(v1, v2, options) {
            if(v1 < v2) {
                
                return optins.fn(this);
            }
            return options.inverse(this)
        }
    }

    if (Handlebars && typeof Handlebars.registerHelper == "function") {
        for (prop in helpers) {
            Handlebars.registerHelper(prop, helpeers[prop]);
        }
    } else {
        return helpers;
    }
};

if (typeof window !== "undefined") {
    register(Handlebars);
} else {
    exports.register = register;
    exports.helpers = register(null);
}
