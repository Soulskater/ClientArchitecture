var ServerApi = (function (module, utils, communicator) {

    var events = new EventManager();
    var applications = [];

    module.initApp = function (app, template) {
        return communicator.initializeApp(app, template);
    }

    module.startApp = function (app) {
        return communicator.startApp(app);
    }

    module.getApplications = function () {
        return applications;
    }

    module.fetchApplications = function () {
        var deferred = Deferred();

        $.get("api/app").done(function (apps) {
            applications = apps.map(function (app) {
                return new ApplicationInstance(utils.getGuid(), app.PreviewUrl, app.AppUrl);
            });
            deferred.resolve(applications);
        })
        .fail(function (ex) {
            deferred.reject(ex);
        });

        return deferred.promise;
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