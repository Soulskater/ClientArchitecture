var Deferred = function () {

    var _deferManager = (function () {
        var _tasks = [];

        return {
            add: function (promise) {
                _tasks.push(promise);
            }
        }
    })();

    var _promise = {
        map: function (f) {
            if (_promise.result && !_promise.hasError)
                _promise.result = f(_promise.result);
            else
                _map = f;
            return _promise;
        },
        done: function (f) {
            if (_promise.result && !_promise.hasError)
                f(_promise.result);
            else
                _success = f;
            return _promise;
        },
        fail: function (f) {
            if (_promise.result && _promise.hasError)
                f(_promise.result);
            else
                _fail = f;
            return _promise;
        },
        combine: function (promise) {
            promise.then(function () {

            });
            _promise.combined.push(promise);
        },
        result: undefined,
        loaded: false,
        hasError: false
    }

    var _map = function (data) { _promise.result = data; return data; };
    var _success = undefined;
    var _fail = undefined;

    var _resolve = function (data) {
        _promise.result = _map(data);
        _promise.loaded = true;
        if (_success) _success(_promise.result);
    }

    var _reject = function (error) {
        _promise.result = error;
        _promise.loaded = true;
        _promise.hasError = true;
        if (_fail) _fail(error);
    }

    return {
        promise: _promise,
        resolve: _resolve,
        reject: _reject
    }
};



var Synchronizer = function () {
    var _async = (function () {
        var _result = null;
        var _loaded = false;
        return {
            $resolve: function (result) {
                _result = result;
                _loaded = true;
                _manager.trigger();
            },
            $reject: function (error) {
            },
            $isLoaded: function () { return _loaded; },
            result: function () { return _result; },
            then: function (f) {
                _manager.onSuccess(f);
                if (_result)
                    _manager.trigger();
            },
            combine: function (async) {
                _manager.add(async);
                return _async;
            },
            bind: function (f) {
                _manager.onBind(f);

            }
        }
    })();

    var _manager = (function () {
        var _tasks = [_async];

        var _success = [];

        var _binds = [];

        var _trigger = function () {
            var done = true;

            for (var i = 0; i < _tasks.length; i++)
                if (!_tasks[i].$isLoaded())
                    done = false;
            if (done) {
                for (var i = 0; i < _success.length; i++)
                    _success[i](_tasks.map(function (async) { return async.result(); }));
            }
        }

        return {
            add: function (async) {
                _tasks.push(async);
                async.then(function () {
                    _triggerSuccess();
                });
            },
            onSuccess: function (success) {
                _success.push(success);
            },
            onBind: function (map) {
                _binds.push(map);
            },
            offSuccess: function (success) {
                _success.remove(success);
            },
            trigger: _trigger
        }
    })();

    return _async;
};



function TestAsync1() {
    var async1 = Synchronizer();
    setTimeout(function () {
        async1.$resolve("Data");
        async1.$resolve("Data2");
    }, 4000);
    return async1;
}

function TestAsync2() {
    var async2 = Synchronizer();
    async2.$resolve("Data2");
    return async2;
}

function TestAsync3() {
    var async3 = Synchronizer();
    async3.$resolve("Data3");
    return async3;
}

function TestAsync4() {
    var async4 = Synchronizer();
    async4.$resolve("Data4");
    return async4;
}

