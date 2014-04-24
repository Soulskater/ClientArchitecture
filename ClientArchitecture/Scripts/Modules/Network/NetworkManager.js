/*
 * Network Manager can manage the communications between server and client
 * Offline-Online support
 * 
 * 
 */
var networkManager = (function (eventManager) {
    var eventman = new eventManager();

    var _events = {
        goOffline: 'goOffline',
        goOnline: 'goOnline',
        onRequest: 'onRequest'
    };

    var _executionType = { IMMEDIATE: 'immediate', TRANSACTION: 'transaction' };

    var _isOnline = navigator.onLine || true;
    var _transactionQueue = [];
    var _processing = false;

    /*
     * Handler, it triggers when the browser goes to offline
     */
    var goOffline = function () {
        _isOnline = false;
        eventman.trigger(_events.goOffline);
    };

    /*
     * Handler, it triggers when the browser goes to online
     */
    var goOnline = function () {
        _isOnline = true;
        processTransaction();
        eventman.trigger(_events.goOnline);
    };

    /*
     * Handler, it triggers when a new item is created in the queue
     */
    var registerRequest = function (options) {
        var request = {
            id: options.id,
            url: options.url,
            executionType: options.executionType,
            data: options.data,
            onBefore: options.onBefore,
            onSuccess: options.onSuccess,
            onFail: options.onFail
        };
        _transactionQueue.push(request);

        if (options.onBefore && typeof options.onBefore == "function") {
            options.onBefore({
                isOnline: _isOnline
            });
        }
        eventman.trigger(_events.onRequest, request);
        console.log("New transaction is queued", _transactionQueue);
        if (!_processing) processTransaction();
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
        console.log("Transaction queue process started, id:" + request.id);
        processRequest(request)
            .done(function (result) {
                if (options.onSuccess && typeof options.onSuccess == 'function')
                    options.onSuccess(result);
                if (request.executionType == _executionType.TRANSACTION)
                    processTransaction();
            })
            .fail(function (ex) {
                if (options.onFail && typeof options.onFail == 'function')
                    options.onFail();
                if (request.executionType == _executionType.TRANSACTION)
                    processTransaction();
            });
        if (request.executionType == _executionType.IMMEDIATE)
            processTransaction();
    }

    var processRequest = function (options) {
        return $.ajax({
            url: options.url,
            type: options.type,
            data: options.data
        });
    }

    var _initialize = function () {
        window.addEventListener('online', goOnline);
        window.addEventListener('offline', goOffline);
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

        emulate: function (online) {
            if (online == true)
                goOnline();
            else
                goOffline();
        },
        /*
         * Unsubscribe from events
         */
        dispose: function () {
            window.removeEventListener('online', goOnline);
            window.removeEventListener('offline', goOffline);
            for (var event in _events)
                eventManager.unsubscribe(event);
        }
    }
}(EventManager));