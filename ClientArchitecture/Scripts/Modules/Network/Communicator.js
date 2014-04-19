var ServerCommunicator = (function (observable) {

    var _types = {
        notification: "notification",
        register: "register"
    }

    function receiveMessage(event) {
        if (event.origin !== "http://ClientArchitecture:8080")
            return;
        var data = event.data;
        switch (data._type) {
            case _types.notification:
                observable.fireEvent(_types.notification);
                break;
            default:
        }
    }

    return {
        addlistener: function () {
            window.addEventListener("message", receiveMessage, false);
        },
        pushNotification: function (handler) {
            observable.listen(_types.notification, handler);
        },
        registerApp: function (handler) {
            observable.listen(_types.register, handler);
        }
    }
}(Observable));