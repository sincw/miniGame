define(["require", "exports", "utils", "../model/squared", "../../../scripts/base/datastructures/queue", "../../../scripts/base/common/mathUtils", "jquery", "angular"], function (require, exports, utils, Squared, Queue, mathUtils) {
    "use strict";
    var eightPuzzleP1 = (function () {
        function eightPuzzleP1($scope, filter, $interval) {
            var _this = this;
            this.step = 0;
            this.to = [[0, -1], [0, 1], [-1, 0], [1, 0]];
            this.move1 = [[-1, 0], [0, -1], [0, 1], [1, 0]];
            this.op = ['U', 'L', 'R', 'D'];
            this.goal = [[3, 3], [0, 0], [0, 1], [0, 2], [0, 3], [1, 0], [1, 1], [1, 2],
                [1, 3], [2, 0], [2, 1], [2, 2], [2, 3], [3, 0], [3, 1], [3, 2]];
            this.map = [[1, 2, 3, 4], [0, 5, 7, 8], [9, 6, 10, 12], [13, 14, 11, 15]];
            this.flag = 0;
            this.length = 0;
            this.limit = 0;
            this.path = [];
            this.swap = function (arr, x1, y1, x2, y2) {
                var temp = arr[x1][y1];
                arr[x1][y1] = arr[x2][y2];
                arr[x2][y2] = temp;
            };
            this.move = function (row, col, value) {
                if (_this.$scope.buttonstatus != 1) {
                    return;
                }
                console.info('row=' + row + 'col=' + col + 'value=' + value + 'step=' + (_this.step++));
                _this.squaredObject.moveCoordinate(row, col, value);
                _this.$scope.squaredData = _this.squaredObject.getMatrix();
            };
            this.theBestPath = function () {
                var that = _this;
                var buttonstatus = 0;
                var a = [[8, 13, 1, 3], [14, 2, 4, 15], [10, 12, 9, 5], [7, 6, 11, 0]];
                that.$scope.buttonstatus = 0;
                var start = new Date();
                _this.map = a;
                if (_this.nixu(_this.squaredObject.getArray()) == 1) {
                    _this.eightPuzzle2();
                }
                else {
                    console.info("error");
                }
                var end = new Date();
                console.info("end " + (end.getTime() - start.getTime()));
            };
            this.operator = function (a, b) {
                if (a.f == b.f)
                    return !(a.g < b.g);
                return !(a.f > b.f);
            };
            this.nixu = function (a) {
                var i, j, ni, w, x, y;
                ni = 0;
                for (i = 0; i < 4 * 4; i++) {
                    if (a[i] == 0)
                        w = i;
                    for (j = i + 1; j < 4 * 4; j++) {
                        if (a[i] > a[j])
                            ni++;
                    }
                }
                x = Math.floor(w / 4);
                y = w % 4;
                ni += Math.abs(x - 3) + Math.abs(y - 3);
                if (ni % 2 == 1)
                    return 1;
                else
                    return 0;
            };
            this.eightPuzzle = function (resource) {
                var h = mathUtils.squaMDistance(resource);
                var x, y;
                for (var i = 0; i < resource.length; i++) {
                    for (var j = 0; j < resource[i].length; j++) {
                        if (resource[i][j] == 0) {
                            x = i;
                            y = j;
                        }
                    }
                }
                var node = {
                    'g': 0,
                    'h': h,
                    'f': h + 0,
                    'parent': undefined,
                    'x': x,
                    'y': y,
                    'map': resource
                };
                var lastnode = _this.bfs(node);
                console.info(lastnode);
                var nodelist = [];
                _this.outOpResult(lastnode, nodelist);
                console.info(nodelist);
                return nodelist.reverse();
            };
            this.getTargetContor = function (arr) {
                var result = [], len = arr.length;
                for (var i = 1; i < len; i++) {
                    result.push(i);
                }
                result.push(0);
                return mathUtils.cantor(result);
            };
            this.bfs = function (node) {
                var that = _this;
                var que = new Queue.PriorityQueue(_this.operator);
                var vis = [];
                var sx = node.map[0].length - 1;
                var sy = node.map.length - 1;
                que.push(node);
                var x = 1;
                var rightContro = that.getTargetContor(that.squaredObject.getArray());
                while (!(que.empty())) {
                    var a = que.front();
                    que.pop();
                    x++;
                    var k_s = that.MatrixCantor(a.map);
                    vis[k_s] = true;
                    for (var i = 0; i < 4; i++) {
                        var next = utils.clone(a);
                        next.parent = a;
                        next.x += that.to[i][0];
                        next.y += that.to[i][1];
                        if (next.x < 0 || next.y < 0 || next.x > sx || next.y > sy)
                            continue;
                        next.map[a.x][a.y] = a.map[next.x][next.y];
                        next.map[next.x][next.y] = 0;
                        next.g += 1;
                        next.h = mathUtils.squaMDistance(next.map);
                        next.f = next.g + next.h;
                        if (x % 100000 == 0) {
                            console.info(next);
                        }
                        var v_n = that.MatrixCantor(next.map);
                        if (v_n == rightContro)
                            return next;
                        if (vis[v_n])
                            continue;
                        que.push(next);
                    }
                }
            };
            this.hv = function (a) {
                return mathUtils.squaMDistance(a);
            };
            this.bfs2 = function (sx, sy, len, pre_move) {
                var i, nx, ny;
                if (_this.flag)
                    return;
                var dv = _this.hv(_this.map);
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
                    nx = sx + _this.move1[i][0];
                    ny = sy + _this.move1[i][1];
                    if (0 <= nx && nx < 4 && 0 <= ny && ny < 4) {
                        _this.swap(_this.map, sx, sy, nx, ny);
                        var p = _this.hv(_this.map);
                        if (p + len <= _this.limit && !_this.flag) {
                            _this.path[len] = i;
                            _this.bfs2(nx, ny, len + 1, i);
                            if (_this.flag)
                                return;
                        }
                        _this.swap(_this.map, sx, sy, nx, ny);
                    }
                }
            };
            this.eightPuzzle2 = function () {
                console.info("resource");
                console.info(utils.clone(_this.map));
                _this.limit = _this.hv(_this.map);
                var x, y;
                for (var i = 0; i < _this.map.length; i++) {
                    for (var j = 0; j < _this.map[i].length; j++) {
                        if (_this.map[i][j] == 0) {
                            x = i;
                            y = j;
                        }
                    }
                }
                while (!_this.flag && _this.length <= 60) {
                    _this.bfs2(x, y, 0, 0);
                    if (!_this.flag)
                        _this.limit++;
                }
                if (_this.flag) {
                    var end = new Date();
                    console.info("target");
                    console.info(_this.map);
                    console.info("len" + _this.length);
                }
            };
            this.outOpResult = function (node, arr) {
                arr.push(node.map);
                if (node.parent) {
                    _this.outOpResult(node.parent, arr);
                }
            };
            this.MatrixCantor = function (map) {
                var arr = [];
                var len1 = map.length;
                for (var i = 0; i < len1; i++) {
                    var len2 = map[i].length;
                    for (var j = 0; j < len2; j++) {
                        arr.push(map[i][j]);
                    }
                }
                return mathUtils.cantor(arr);
            };
            this.$scope = $scope;
            this.$interval = $interval;
            console.info("eightPuzzleController start");
            var squared = new Squared.Squared(4, 4);
            this.squaredObject = squared;
            $scope.squaredData = squared.getMatrix();
            $scope.move = this.move.bind(this);
            $scope.theBestPath = this.theBestPath.bind(this);
            $scope.buttonstatus = 1;
        }
        return eightPuzzleP1;
    }());
    exports.eightPuzzleP1 = eightPuzzleP1;
    exports.APPNAME = 'eightPuzzle';
});
