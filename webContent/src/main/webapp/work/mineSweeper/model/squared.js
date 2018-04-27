define(["require", "exports"], function (require, exports) {
    "use strict";
    var Squared = (function () {
        function Squared(row, col) {
            var _this = this;
            this.val = function (arr) {
                var that = _this;
                _this.array = arr;
                _this.matrix = _this.sliceArr(arr, that.col);
            };
            this.getZeroLocation = function () {
                return _this.array.indexOf(0);
            };
            this.getArray = function () {
                return _this.array;
            };
            this.getMatrix = function () {
                return _this.matrix;
            };
            //将数组等份切割
            //arr 数组
            //size 每组的大小
            this.sliceArr = function (arr, size) {
                var result = [], len = Math.ceil(arr.length / size);
                for (var i = 0; i < len; i++) {
                    var start = i * size;
                    var end = start + size;
                    result.push(arr.slice(start, end));
                }
                return result;
            };
            this.createSquaredUpSeq = function (row, col) {
                var num = row * col;
                var seq = [];
                for (var i = 1; i < num; i++) {
                    seq.push(i);
                }
                ;
                seq = _this.shuffle(seq);
                seq.push(0);
                //0在偶位置时，当是奇排列,换成偶排列
                if (num % 2 == 1) {
                    if (_this.isOddSeq(seq)) {
                        _this.swap(seq, 0, 1);
                    }
                }
                else {
                    //当是qi排列，0在偶位置，换成奇排列
                    if (!_this.isOddSeq(seq)) {
                        _this.swap(seq, 0, 1);
                    }
                }
                //[1, 2, 3, 4, 0, 5, 7, 8, 9, 6, 10, 12, 13, 14, 11, 15]
                return seq;
            };
            this.swap = function (arr, soruce, target) {
                arr[soruce] = arr.splice(target, 1, arr[soruce])[0];
            };
            this.swapArray = function (soruce, target) {
                var arr = _this.array;
                arr[soruce] = arr.splice(target, 1, arr[soruce])[0];
            };
            this.shuffle = function (arr) {
                var len = arr.length, randomIndex, temp;
                while (len) {
                    randomIndex = Math.floor(Math.random() * len--);
                    _this.swap(arr, len, randomIndex);
                }
                return arr;
            };
            this.isOddSeq = function (arr) {
                var len = arr.length, i = 0, cnt = 0;
                for (; i < len - 1; i++) {
                    for (var j = i + 1; j < len; j++) {
                        if (arr[i] > arr[j]) {
                            cnt++;
                        }
                    }
                }
                return (cnt % 2) != 0;
            };
            this.moveCoordinate = function (row, col, value) {
                var that = _this;
                var zeroIndex = that.getZeroLocation();
                var curIndex = (row * _this.col) + (col);
                var len = _this.array.length;
                if (_this.moveUp(zeroIndex, curIndex)) {
                    _this.swapArray(zeroIndex, curIndex);
                }
                if (_this.moveDown(zeroIndex, curIndex)) {
                    _this.swapArray(zeroIndex, curIndex);
                }
                if (_this.moveLeft(zeroIndex, curIndex)) {
                    _this.swapArray(zeroIndex, curIndex);
                }
                if (_this.moveRight(zeroIndex, curIndex)) {
                    _this.swapArray(zeroIndex, curIndex);
                }
                _this.val(_this.array);
            };
            this.moveUp = function (zeroIndex, curIndex) {
                var value = curIndex - _this.col;
                if (value >= 0 && zeroIndex == value) {
                    return true;
                }
                return false;
            };
            this.moveDown = function (zeroIndex, curIndex) {
                var value = curIndex + _this.col;
                if (value <= _this.array.length && zeroIndex == value) {
                    return true;
                }
                return false;
            };
            this.moveLeft = function (zeroIndex, curIndex) {
                var value = curIndex - zeroIndex;
                if ((curIndex % _this.col != 0) && 1 == value) {
                    return true;
                }
                return false;
            };
            this.moveRight = function (zeroIndex, curIndex) {
                var value = zeroIndex - curIndex;
                if ((curIndex % _this.col != _this.col - 1) && 1 == value) {
                    return true;
                }
                return false;
            };
            if (!col) {
                col = row;
            }
            this.array = this.createSquaredUpSeq(row, col);
            this.row = row;
            this.col = col;
            this.matrix = this.sliceArr(this.array, col);
        }
        return Squared;
    }());
    exports.Squared = Squared;
});
//# sourceMappingURL=squared.js.map