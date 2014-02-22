var App = (function (module, hostapi) {

    module.client = hostapi.registerApp();
    module.client.onInit(function () {
        alert("Test App initialized!");
    });
    module.client.onStart(function () {
        alert("Test App started!");
    });

    document.addEventListener("DOMContentLoaded", function () {
        document.getElementById("btStart").addEventListener("click", function () {
            hostapi.startApp(module.client.id);
        }, false);
    }, false);

    return module;
}(App || {}, window.parent.HostApi));