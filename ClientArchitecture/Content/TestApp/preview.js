var App = (function (module, hostapi) {

    module.init = function () {
        alert("Test App initialized!");
    }
    module.start = function () {
        alert("Test App started!");
    }

    module.client = hostapi.registerApp();
    module.client.onInit(module.init);
    module.client.onStart(module.start);

    document.addEventListener("DOMContentLoaded", function () {
        document.getElementById("btStart").addEventListener("click", function () {
            hostapi.startApp(module.client.id);
        }, false);
    }, false);

    return module;
}(App || {}, window.parent.HostApi));