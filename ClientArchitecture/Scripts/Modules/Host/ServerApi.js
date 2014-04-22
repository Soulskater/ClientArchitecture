var ServerApi = (function (module, utils, communicator) {

    var obs = new Observable();
    var applications = [];

    module.initApp = function (id) {
        var app = applications.filter(function (app) {
            return app.id = id;
        })[0];
        communicator.initializeApp(app.id);
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
                return new ApplicationInstance(utils.getGuid(), app.PreviewUrl, app.Url);
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

    communicator.on("notification", function (data) {
        console.log(data);
    });

    return module;
}(ServerApi || {}, Utils, ServerCommunicator));

/*
 * Representation of an application
 * -id: generated guid
 * -previewUrl string url for preview(initialize)
 * -url string url for the site
 */
var ApplicationInstance = function (id, previewUrl, url) {
    var _initialized = false;

    var _types = {
        notification: "notification",
    }

    return {
        id: id,
        previewUrl: previewUrl,
        url: url,
        initialize: function () {
            if (_initialized) return;
            _initialized = true;
        }
    }
}