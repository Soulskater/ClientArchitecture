var UtilityModule = (function (module) {

    module.showMessage = function (message) { alert(message); };
    module.isNumber = function (value) { return !isNaN(value); }

    return module;
}(UtilityModule || {}));