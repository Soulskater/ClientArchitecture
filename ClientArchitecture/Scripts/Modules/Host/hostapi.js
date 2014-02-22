var HostApi = (function (module, utils) {

    var obs = new Observable();
    var apps = [];

    module.initApp = function (id) {
        apps.filter(function (app) {
            return app.id = id;
        })[0].init();
    }

    module.startApp = function (id) {
        apps.filter(function (app) {
            return app.id = id;
        })[0].start();
    }

    module.getApps = function () {
        return apps;
    }

    module.onAppAdded = function (handler) {
        obs.listen("appAdded", handler, this);
    }

    module.registerApp = function (previewUrl, url) {
        var client = new Client(utils.getGuid(), previewUrl, url);
        apps.push(client);
        client.init();
        obs.fireEvent("appAdded");
        return client;
    }

    return module;
}(HostApi || {}, Utils));