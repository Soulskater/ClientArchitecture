var App = (function (module, communicator) {
    module.id = null;

    communicator.on("initialize", function (data) {
        module.id = data.id;
        var i = 0;
        setInterval(function () {
            var now = new Date();
            document.getElementById("date").innerText = now.getMonth() + "/" + now.getDate() + "/" + now.getFullYear();
            document.getElementById("time").innerText = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
            //communicator.pushNotification(module.id, i++);
        }, 1000);
    });

    return module;
}(App || {}, ClientCommunicator));