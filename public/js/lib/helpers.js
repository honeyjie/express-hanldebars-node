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
