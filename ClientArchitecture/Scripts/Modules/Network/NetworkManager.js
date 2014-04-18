/*
 * Network Manager can manage the communications between server and client
 * Offline-Online support
 * 
 * 
 */
var networkManager = (function (observable) {
    var eventManager = new observable();

    var _events = {
        goOffline: 'goOffline',
        goOnline: 'goOnline',
        itemAdded: 'itemAdded'
    };

    var PARALELL = 'paralell', TRANSACTION = 'transaction';

    var _isOnline = false; //navigator.onLine || true;
    var _transactionQueue = [];
    var _processing = false;

    /*
     * Handler, it triggers when the browser goes to offline
     */
    var goOffline = function () {
        _isOnline = false;
        eventManager.fireEvent(_events.goOffline);
    };

    /*
     * Handler, it triggers when the browser goes to online
     */
    var goOnline = function () {
        _isOnline = true;
        processTransaction();
        eventManager.fireEvent(_events.goOnline);
    };

    /*
     * Handler, it triggers when a new item is created in the queue
     */
    var addToQueue = function (dowork, rollback) {
        _transactionQueue.push({ id: Utils.getGuid(), dowork: dowork, rollback: rollback });
        console.log("New transaction is queued", _transactionQueue);
        if (!_processing) processTransaction();
    }

    var processTransaction = function () {
        if (_isOnline != true) return;
        if (!_processing) _processing = true;

        var akt = _transactionQueue.shift();
        console.log("Transaction queue process started, id:" + akt.id);

        if (akt.dowork && typeof akt.dowork == 'function')
            akt.dowork()
                .fail(function () {
                    if (akt.rollback && typeof akt.rollback == 'function') akt.rollback();
                })
                .final(function () {
                    if (_transactionQueue.length > 0)
                        processTransaction();
                    else
                        _processing = false;
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
        withTransaction: function (handler, rollback) {
            addToQueue(handler, rollback);
        },
        /*
         * Subscribe to an event
         */
        on: function (type, handler) {
            if (_events[type] == undefined) return;

            eventManager.listen(_events[type], handler, networkManager);
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
        dispose: function () {
            window.removeEventListener('online', goOnline);
            window.removeEventListener('offline', goOffline);
            for (var event in _events)
                eventManager.dispatch(event);
        }
    }
}(Observable));