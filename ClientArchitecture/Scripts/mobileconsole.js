var mobileConsole = (function ($) {

    var messageType = { INFO: 'info', ERROR: 'error', LOG: 'log' };

    var styles = {
        clear: 'clear',
        expression: 'immediate-box',
        minimize: 'minimize',
        console: 'console',
        consoleWindow: 'console-window',
        messages: "messages",
        message: "message",
        title: "title",
        separator: "separator",
        observables: "observables",
        observable: "observable",
        obsName: "name",
        obsValue: "value"
    };

    var _initialized = false;

    var $console = $("." + styles.console);
    var $clear = $("." + styles.clear, $console);
    var $expression = $("." + styles.expression, $console);
    var $minimize = $("." + styles.minimize, $console);
    var $consoleWindow = $("." + styles.consoleWindow, $console);
    var $messages = $("." + styles.messages, $console);
    var $observables = $("." + styles.observables, $console);

    var createMessage = function (title, message, type) {
        if (!_initialized) {
            if (console) console.log("The mobileConsole is not initialized, call initialize(options) method first!");
            return;
        }

        $("<div>").addClass(styles.message + " " + type)
                    .append($("<span>").text(title).addClass(styles.title))
                    .append($("<span>").text(">").addClass(styles.separator))
                    .append($("<span>").text(message))
                    .prependTo($messages);
    }

    var clearConsole = function () {
        $messages.empty();
    }

    return {
        info: function (title, message) {
            createMessage(title, message, messageType.INFO);
        },
        log: function (title, message) {
            createMessage(title, message, messageType.LOG);
        },
        error: function (message) {
            createMessage("Error", message, messageType.ERROR);
        },
        openConsole: function () {
            if (!_initialized) {
                if (console) console.log("The mobileConsole is not initialized, call initialize(options) method first!");
                return;
            }
            $console.css({ display: "block" });
        },
        observable: function (name, value) {
            if (!_initialized) {
                if (console) console.log("The mobileConsole is not initialized, call initialize(options) method first!");
                return;
            }

            var obs = $("#" + name, $observables);

            if (obs.length == 0) {
                obs = $("<div>").attr("id", name).addClass(styles.observable)
                    .append($("<span>").text(name).addClass(styles.obsName))
                    .append($("<span>").text(">").addClass(styles.separator))
                    .append($("<span>").text(value).addClass(styles.obsValue))
                    .appendTo($observables);
            }
            else
                $("." + styles.obsValue, obs).text(value);
        },

        initialize: function (options) {
            if (_initialized) return;

            if ($console.length <= 0) {
                if (console) console.log("Couldn't initialize mobile console because of missing html template!");
                return;
            }

            var options = options || {};
            var visible = options.visibleOnLoad || false;
            var collapsed = options.collapsedOnLoad || true;

            $console.css({ display: visible ? "block" : "none" });
            $consoleWindow.css({ display: collapsed ? "none" : "block" });

            //
            //Clear
            $clear.click(function () { clearConsole(); });

            $expression.bind('keypress', function (event) {
                if (event.keyCode === 13) {
                    createMessage($(this).val(), eval($(this).val()), messageType.LOG);
                }
            });

            $minimize.bind("click touchstart", function (event) {
                $consoleWindow.slideToggle(300);
            });

            window.onerror = function (e) {
                createMessage(e + ", LineNo:" + event.lineno, "Error", messageType.ERROR);
            };

            _initialized = true;
        }
    }
}(jQuery));