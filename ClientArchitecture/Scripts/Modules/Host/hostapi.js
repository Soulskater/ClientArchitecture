﻿var HostApi = (function (module, utils) {

    var apps = [];
    
    module.initApps = function () {
        apps.forEach(function (app) {
            app.init();
        });
    }

    module.startApp = function (id) {
        apps.filter(function (app) {
            return app.id = id;
        })[0].start();
    }

    module.registerApp = function () {
        var client = new Client(utils.getGuid());
        apps.push(client);
        return client;
    }

    return module;
}(HostApi || {}, Utils));