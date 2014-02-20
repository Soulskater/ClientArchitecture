var App = (function (module, hostapi) {

    module.init = function () {
        alert("Test App initialized!");
    }

    module.start = function () {
        alert("Test App started!");
    }
    module.client = hostapi.registerApi();
    hostapi.onInit(module.client.id, module.init);
    hostapi.onStart(module.client.id, module.start);

    return module;
}(App || {}, window.parent.HostApi));