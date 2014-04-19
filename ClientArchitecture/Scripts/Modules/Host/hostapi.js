var ServerApplication = (function (module, utils) {

    var obs = new Observable();
    var applications = [];

    module.initApp = function (id) {
        applications.filter(function (app) {
            return app.id = id;
        })[0].init();
    }

    module.startApp = function (id) {
        applications.filter(function (app) {
            return app.id = id;
        })[0].start();
    }

    module.getApplications = function () {
        return applications;
    }

    module.fetchApplications = function () {
        var deferred = Deferred();

        $.get("api/app").done(function (apps) {
            applications = apps.map(function (app) {
                return new ClientApplication(utils.getGuid(),app.PreviewUrl, app.Url);
            });
            deferred.resolve(applications);
        })
        .fail(function (ex) {
            deferred.reject(ex);
        });

        return deferred.promise;
    }

    module.onAppAdded = function (handler) {
        obs.listen("appAdded", handler, this);
    }

    return module;
}(ServerApplication || {}, Utils));