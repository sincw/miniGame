define(["require", "exports", "utils", "../../../scripts/base/common/mathUtils", "jquery", "angular"], function (require, exports, utils, mathUtils) {
    "use strict";
    var eightPuzzleP2 = (function () {
        function eightPuzzleP2() {
            var _this = this;
            //上 左 右 下  置换顺序
            this.move1 = [[-1, 0], [0, -1], [0, 1], [1, 0]];
            //测试
            this.map = [[1, 2, 3, 4], [0, 5, 7, 8], [9, 6, 10, 12], [13, 14, 11, 15]];
            //完成标志
            this.flag = 0;
            //当前步数
            this.length = 0;
            //最小步数
            this.limit = 0;
            //值交换
            this.swap = function (arr, x1, y1, x2, y2) {
                var temp = arr[x1][y1];
                arr[x1][y1] = arr[x2][y2];
                arr[x2][y2] = temp;
            };
            //路径
            this.result = [];
            this.bfs = function (sx, sy, len, pre_move) {
                var i, nx, ny;
                if (_this.flag)
                    return;
                var dv = mathUtils.squaMDistance(_this.map);
                if (len == _this.limit) {
                    if (dv == 0) {
                        _this.flag = 1;
                        _this.length = len;
                        return;
                    }
                    else {
                        return;
                    }
                }
                else if (len < _this.limit) {
                    if (dv == 0) {
                        _this.flag = 1;
                        _this.length = len;
                        return;
                    }
                }
                for (i = 0; i < 4; i++) {
                    if (i + pre_move == 3 && len > 0)
                        continue;
                    nx = sx + _this.move1[i][0]; //移动的四步
                    ny = sy + _this.move1[i][1];
                    if (0 <= nx && nx < _this.row && 0 <= ny && ny < _this.col) {
                        _this.swap(_this.map, sx, sy, nx, ny);
                        var p = mathUtils.squaMDistance(_this.map); //移动后的曼哈顿距离
                        if (p + len <= _this.limit && !_this.flag) {
                            _this.result[len] = (utils.clone(_this.map));
                            _this.bfs(nx, ny, len + 1, i); //如当前步成功则 递归调用dfs
                            if (_this.flag)
                                return;
                        }
                        _this.swap(_this.map, sx, sy, nx, ny); //不合理则回退一步
                    }
                }
            };
            this.eightPuzzle = function (resource) {
                var re = utils.clone(resource);
                _this.map = re;
                _this.limit = mathUtils.squaMDistance(_this.map);
                var len1 = _this.map.length, len2 = _this.map[0].length;
                _this.row = len1;
                _this.col = len2;
                var x, y;
                for (var i = 0; i < len1; i++) {
                    for (var j = 0; j < len2; j++) {
                        if (_this.map[i][j] == 0) {
                            x = i;
                            y = j;
                        }
                    }
                }
                _this.result.push(utils.clone(resource));
                while (!(_this.flag) && _this.length <= 50) {
                    _this.bfs(x, y, 0, 0);
                    if (!(_this.flag))
                        _this.limit++; //得到的是最小步数  
                }
                return _this.result;
            };
        }
        return eightPuzzleP2;
    }());
    exports.eightPuzzleP2 = eightPuzzleP2;
});
//# sourceMappingURL=eightPuzzleP2.js.map