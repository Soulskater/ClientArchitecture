var ClientApplication = function (id, previewUrl, url) {
    var obs = new Observable();
    var _initialized = false;

    var _types = {
        notification: "notification",
    }

    function receiveMessage(event) {
        if (event.origin !== "http://ClientArchitecture:8080")
            return;
        var data = event.data;
        switch (data._type) {
            case _types.notification:
                obs.fireEvent(_types.notification);
                break;
            default:
        }
    }

    return {
        id: id,
        previewUrl: previewUrl,
        url: url,
        initialize: function () {
            if (_initialized) return;
            document.getElementById(id).addEventListener("message", receiveMessage, false);
            _initialized = true;
        }
    }
}