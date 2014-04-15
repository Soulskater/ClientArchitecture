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

    var _isOnline = navigator.onLine || true;
    var _queue = [];
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
        processQueue();
        eventManager.fireEvent(_events.goOnline);
    };

    /*
     * Handler, it triggers when a new item is created in the queue
     */
    var addItemToQueue = function (dowork, rollback) {
        _queue.push({ id: Utils.getGuid(), dowork: dowork, rollback: rollback });
        if (!_processing) processQueue();
    }

    var processQueue = function () {
        if (_isOnline != true) return;
        if (!_processing) _processing = true;

        var akt = _queue.shift();
        console.log("Queue item process started, id:" + akt.id);

        if (akt.dowork && typeof akt.dowork == 'function')
            akt.dowork()
                .done(function () {

                })
                .fail(function () {
                    if (akt.rollback && typeof akt.rollback == 'function') akt.rollback();
                });

        if (_queue.length > 0)
            processQueue();
        else
            _processing = false;
    }

    var _initialize = function () {
        window.addEventListener('online', goOnline);
        window.addEventListener('offline', goOffline);
    }

    _initialize();

    return {
        isOnline: function () { return _isOnline; },
        /*
         * Creates a new item in the queue and it will get processed
         * -handler parameter function will be called when the queue start to process it, returns with a promise
         * -rollback function called if the process fails
         */
        addToQueue: function (handler, rollback) {
            addItemToQueue(handler, rollback);
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

        dispose: function () {
            window.removeEventListener('online', goOnline);
            window.removeEventListener('offline', goOffline);
            for (var event in _events)
                eventManager.dispatch(event);
        }
    }
}(Observable));