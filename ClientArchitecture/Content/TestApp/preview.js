var App = (function (module, communicator) {

    

    document.addEventListener("DOMContentLoaded", function () {
        document.getElementById("btStart").addEventListener("click", function () {
            hostapi.startApp(module.client.id);
        }, false);
    }, false);

    return module;
}(App || {}, ClientCommunicator));