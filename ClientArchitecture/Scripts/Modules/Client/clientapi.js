var Client = function (id, previewUrl, url) {
    var obs = new Observable();
    var initialized = false;

    return {
        id: id,
        previewUrl: previewUrl,
        url: url,
        init: function () {
            if (initialized) return;
            obs.fireEvent("init");
            initialized = true;
        },
        start: function () { obs.fireEvent("start"); },
        close: function () { obs.fireEvent("close"); },
        onInit: function (handler) {
            obs.listen("init", handler, this);
        },
        onStart: function (handler) {
            obs.listen("start", handler, this);
        },
        onClose: function (handler) {
            obs.listen("close", handler, this);
        }
    }
}