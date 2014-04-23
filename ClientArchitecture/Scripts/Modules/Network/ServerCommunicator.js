var ServerCommunicator = (function (observable, utils) {

    var obs = new Observable();

    var _types = {
        notification: "notification",
        initialize: "initialize",
        start: "start"
    }

    function receiveMessage(event) {
        if (event.origin !== "http://localhost")
            return;
        var data = event.data;
        switch (data._type) {
            case _types.notification:
                obs.fireEvent(_types.notification, data);
                break;
            default:
        }
    }

    window.addEventListener("message", receiveMessage, false);

    return {
        initializeApp: function (app, template) {
            var data = {
                _type: _types.initialize,
                id: app.id
            };
            var template = template ? $(template) : document.createElement("iframe");
            var frame = $("iframe", $(template))[0];

            frame.src = app.previewUrl;
            frame.id = app.id;
            frame.onload = function () {
                var url = utils.parseUrl(app.previewUrl);
                frame.contentWindow.postMessage(data, url.protocol + "//" + url.host);
            };

            return template ? $(template) : frame;
        },
        startApp: function (app) {
            var data = {
                _type: _types.start,
                id: app.id
            };

            var appFrame = document.getElementById("app");
            if (!appFrame)
                appFrame = document.createElement("iframe");

            appFrame.id = "app";
            appFrame.src = app.url
            if (!appFrame) {
                console.log("No App Iframe was found!");
                return;
            }
            appFrame.onload = function () {
                var url = utils.parseUrl(app.url);
                appFrame.contentWindow.postMessage(data, url.protocol + "//" + url.host);
            };

            return appFrame;
        },
        on: function (type, handler) {
            if (!_types[type]) return;
            obs.listen(type, handler);
        }
    }
}(Observable, Utils));

