var ClientCommunicator = (function (observable) {

    var obs = new Observable();
    var _types = {
        notification: "notification",
        initialize: "initialize",
        start: "start"
    }

    var _server = null;

    function receiveMessage(event) {
        if (event.origin !== "http://localhost")
            return;
        var data = event.data;
        switch (data._type) {
            case _types.initialize:
                if (!_server) _server = event.source;
                obs.fireEvent(_types.initialize, data);
                break;
            case _types.start:
                if (!_server) _server = event.source;
                obs.fireEvent(_types.start, data);
                break;
            default:
        }
    }

    var sendNotification = function (id, notification) {
        var data = {
            _type: _types.notification,
            id: id,
            notification: notification
        };
        _server.postMessage(data, "http://localhost");
    }

    window.addEventListener("message", receiveMessage, false);

    return {
        pushNotification: function (id, notification) {
            if (!_server) {
                console.log("The communication is not established.");
                return;
            }
            sendNotification(id, notification);
        },
        on: function (type, handler) {
            if (!_types[type]) return;
            obs.listen(type, handler);
        }
    }
}(Observable));