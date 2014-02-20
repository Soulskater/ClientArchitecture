var Main = (function (module, utils, hostapi, clientapi) {
    
    document.getElementById("btTest").addEventListener("click", function () {
        hostapi.obs.fireEvent("start");
    }, false);
    return module;
}(Main || {}, Utils, HostApi, ClientApi));