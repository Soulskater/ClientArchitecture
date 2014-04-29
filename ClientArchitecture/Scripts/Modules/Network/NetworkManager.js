/*
 * Network Manager can manage the communications between server and client
 * Offline-Online support
 * 
 * 
 */
var networkManager = (function (eventManager, deferred) {
    var eventman = new eventManager();

    var _events = {
        offline: 'offline',
        online: 'online',
        onRequest: 'onRequest'
    };

    var _executionType = { IMMEDIATE: 'immediate', TRANSACTION: 'transaction' };

    var _isOnline = navigator.onLine || true;
    var _transactionQueue = [];
    var _processing = false;
    var _registeredTypes = [];


    /*
     * Handler, it triggers when the browser goes to offline
     */
    var offline = function () {
        _isOnline = false;
        eventman.trigger(_events.offline);
    };

    /*
     * Handler, it triggers when the browser goes to online
     */
    var online = function () {
        _isOnline = true;
        processTransaction();
        eventman.trigger(_events.online);
    };

    /*
     * Handler, it triggers when a new item is created in the queue
     */
    var _registerRequest = function (options) {
        var request = {
            id: options.id,
            version: options.version,
            formatter: options.formatter,
            executionType: options.executionType,
            onBefore: options.onBefore,
            onSuccess: options.onSuccess,
            onFail: options.onFail
        };
        _registeredTypes.push(request);
    }

    /*
     * Execution on the queue
     */
    var processTransaction = function () {
        if (_isOnline != true) return;
        if (!_processing) _processing = true;
        if (_transactionQueue.length <= 0) {
            _processing = false;
            return;
        }

        var request = _transactionQueue.shift();
        console.log("Request process started, id: " + request.id);
        _processRequest(request).done(function (result) {
            if (request.onSuccess && typeof request.onSuccess == 'function')
                request.onSuccess(result);
        }).fail(function (ex) {
            if (request.onFail && typeof request.onFail == 'function')
                request.onFail();
        }).final(function () {
            if (request.executionType == _executionType.TRANSACTION)
                processTransaction();
        });
        if (request.executionType == _executionType.IMMEDIATE)
            processTransaction();
    }

    /*
     * Creates the real ajax call based on the options
     */
    var _processRequest = function (options) {
        var defer = deferred();
        $.ajax({
            url: options.url,
            type: options.type,
            data: options.data
        }).done(function (result) {
            defer.resolve(result);
        }).fail(function (ex) {
            defer.reject(ex);
        });

        return defer.promise;
    }

    var _initialize = function () {
        window.addEventListener('online', online);
        window.addEventListener('offline', offline);
    }

    _initialize();

    return {
        isOnline: function () { return _isOnline; },
        /*
         * Creates a new item in the transaction queue and it will get processed
         * -handler parameter function will be called when the queue start to process it, returns with a promise
         * -rollback function called if the process fails
         */
        registerRequest: function (options) {
            _registerRequest(options);
        },
        /*
         * Subscribe to an event
         */
        on: function (type, handler) {
            if (_events[type] == undefined) return;

            eventman.subscribe(_events[type], handler, networkManager);
        },
        /*
         * Unsubscribe to an event
         */
        off: function (type) {
            if (_events[type] == undefined) return;
            eventManager.dispatch(_events[type]);
        },

        /*
         * TEST FUNCTION
         */
        emulate: function (goOnline) {
            if (goOnline == true)
                online();
            else
                offline();
        },
        /*
         * Dispose, unsubscribe from events
         */
        dispose: function () {
            window.removeEventListener('online', online);
            window.removeEventListener('offline', offline);
            for (var event in _events)
                eventManager.unsubscribe(event);
        }
    }
}(EventManager, Deferred));