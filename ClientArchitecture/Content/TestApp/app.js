var App = (function (module, communicator) {

    communicator.on("start", function (data) {
        module.id = data.id;
        console.log("App started!");
    });

    return module;
}(App || {}, ClientCommunicator));