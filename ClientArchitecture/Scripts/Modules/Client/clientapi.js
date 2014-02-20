var Client = function (id) {
    var obs = new Observable();

    return {
        id: id,
        listen: function (type, handler, scope) {
            ops.listen(type, handler, scope);
        }
    }
}