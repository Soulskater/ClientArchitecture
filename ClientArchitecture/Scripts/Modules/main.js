var Main = (function (module, utils, hostapi) {

    module.getApps = function () {
        $.get("/api/app").done(function (apps) {
            module.applications = apps.map(function (app) { return hostapi.registerApp(app.PreviewUrl, app.Url); });
        });
    };

    module.applications = [];

    return module;
}(Main || {}, Utils, HostApi));