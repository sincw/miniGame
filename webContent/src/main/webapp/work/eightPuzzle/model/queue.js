var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    var Queue = (function () {
        function Queue() {
            var _this = this;
            this.push = function (data) {
                _this.arr.push(data);
            };
            this.pop = function () {
                _this.arr.shift();
            };
            this.front = function () {
                return _this.arr[0];
            };
            this.rear = function () {
                return _this.arr[_this.arr.length - 1];
            };
            this.empty = function () {
                return _this.arr.length == 0;
            };
            this.size = function () {
                return _this.arr.length;
            };
            this.arr = [];
        }
        return Queue;
    }());
    exports.Queue = Queue;
    var PriorityQueue = (function (_super) {
        __extends(PriorityQueue, _super);
        function PriorityQueue() {
            var _this = this;
            _super.call(this);
            this.push = function (node) {
                var arrList = _this.arr;
                if (_this.empty()) {
                    _this.arr.push(node);
                }
                else {
                    var len = _this.size();
                    var added = false;
                    for (var i = 0; i < len; i++) {
                        if (!_this.operator(node, _this.arr[i])) {
                            arrList.splice(i, 0, node);
                            added = true;
                            break;
                        }
                    }
                    if (!added) {
                        arrList.push(node);
                    }
                }
            };
            this.operator = function (a, b) {
                if (a.f == b.f)
                    return a.g < b.g;
                return a.f > b.f;
            };
        }
        return PriorityQueue;
    }(Queue));
    exports.PriorityQueue = PriorityQueue;
});
