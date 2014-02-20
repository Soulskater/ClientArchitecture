var HostApi = (function (module, utils) {

    var apps = [];
    
    module.registerApp = function () {
        var client = new Client(utils.getGuid());
        apps.push(client);
        return client;
    }

    module.onInit = function (id, handler) {
        var selected = apps.filter(function (app) { return app.id == id; });
        if (selected.length == 0) console.error("Application with id '" + id + "' not registered!");
        selected[0].listen("init", handler, this);
    }
    module.onStart = function (id, handler) {
        var selected = apps.filter(function (app) { return app.id == id; });
        if (selected.length == 0) console.error("Application with id '" + id + "' not registered!");
        selected[0].listen("start", handler, this);
    }
    module.onClose = function (id, handler) {
        var selected = apps.filter(function (app) { return app.id == id; });
        if (selected.length == 0) console.error("Application with id '" + id + "' not registered!");
        selected[0].listen("close", handler, this);
    }

    return module;
}(HostApi || {}, Utils));