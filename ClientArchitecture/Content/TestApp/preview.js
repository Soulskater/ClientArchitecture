var App = (function (module, communicator) {

    document.addEventListener("DOMContentLoaded", function () {
        document.getElementById("btStart").addEventListener("click", function () {
            communicator.pushNotification(module.id, "Foo Notify");
        }, false);
    }, false);

    module.id = null;

    communicator.on("initialize", function (data) {
        module.id = data.id;
    });

    return module;
}(App || {}, ClientCommunicator));