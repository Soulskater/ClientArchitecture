var RenderCanvas = function (canvas, buffer) {
    var self = this;

    var _FPS = 50;
    var _invalid = true;
    var _objects = []
    var _buffers = [canvas, buffer]

    var getContext = (function () {
        var aktBuffer = 0;

        return function () {
            _buffers[1 - aktBuffer].style.visibility = 'hidden';
            _buffers[aktBuffer].style.visibility = 'visible';

            aktBuffer = 1 - aktBuffer;

            return _buffers[aktBuffer].getContext("2d");
        }
    }());

    this.invalidate = function () {
        if (!_invalid) return;
        var ctx = getContext();
        ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

        for (var i = 0; i < _objects.length; i++) {
            _objects[i].draw(ctx);
        }
        _invalid = false;
    };

    this.setInvalid = function () {
        _invalid = true;
    };

    this.addObject = function (obj) {
        if (!(obj instanceof CanvasObject)) {
            console.log("An object on the canvas should be inherited from CanvasObject!");
            return;
        }
        _objects.push(obj);
        _invalid = true;
    };

    setInterval(function () {
        self.setInvalid();
        self.invalidate();
    }, 1000 / _FPS);
}

function Point(x, y) {
    return {
        x: x || 0,
        y: y || 0
    };
}

function CanvasObject() {
    this.draw = function (ctx) {
    }

    this.destroy = function (ctx) {
    }
}

function Line(start, end, color, lineWidth) {
    var self = this;

    this.start = start || Point(0, 0);
    this.end = end || Point(0, 0);
    this.color = color || "black";
    this.lineWidth = lineWidth;

    this.draw = function (ctx) {
        ctx.beginPath();

        ctx.moveTo(self.start.x, self.start.y);
        ctx.lineTo(self.end.x, self.end.y);
        ctx.lineWidth = self.lineWidth;
        ctx.strokeStyle = self.color;
        ctx.closePath();
        ctx.stroke();
    }
}

Line.prototype = new CanvasObject();
Line.prototype.constructor = Line;