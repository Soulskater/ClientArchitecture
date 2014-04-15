var Main = (function (module, utils, hostapi) {

    module.getApps = function () {
        $.get("api/app").done(function (apps) {
            module.applications = apps.map(function (app) { return hostapi.registerApp(app.PreviewUrl, app.Url); });
        });
    };

    module.testNetworkManager = function () {
        networkManager.addToQueue(function () {
            var deferred = Deferred();
            setTimeout(function () {
                deferred.resolve();
                console.log("Finished Item 1");
            }, 5000);

            return deferred.promise;
        });
        networkManager.addToQueue(function () {
            var deferred = Deferred();
            setTimeout(function () {
                deferred.resolve();
                console.log("Finished Item 2");
            }, 2000);

            return deferred.promise;
        });
        networkManager.addToQueue(function () {
            var deferred = Deferred();
            setTimeout(function () {
                deferred.resolve();
                console.log("Finished Item 3");
            }, 3000);

            return deferred.promise;
        });
        networkManager.addToQueue(function () {
            var deferred = Deferred();
            setTimeout(function () {
                deferred.reject();
                return;
                console.log("Finished Item 4");
            }, 4000);

            return deferred.promise;
        }, function () {
            alert("Item 4 has been rejected!");
        });
    };

    module.applications = [];
    module.getApps();

    return module;
}(Main || {}, Utils, HostApi));