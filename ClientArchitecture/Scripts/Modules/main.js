var Main = (function (module, utils, hostapi) {
    
    document.getElementById("btTest").addEventListener("click", function () {
        hostapi.initApps();
    }, false);
    return module;
}(Main || {}, Utils, HostApi));