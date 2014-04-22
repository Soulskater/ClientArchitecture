var ServerCommunicator = (function (observable) {

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
        initializeApp: function (appId) {
            var data = {
                _type: _types.initialize,
                id: appId
            };
            var frame = document.getElementById(appId);
            if (!frame) {
                console.log("No Iframe was found with id:" + appId);
                return;
            }
            frame.contentWindow.postMessage(data, "http://localhost");

        },
        on: function (type, handler) {
            if (!_types[type]) return;
            obs.listen(type, handler);
        }
    }
}(Observable));

