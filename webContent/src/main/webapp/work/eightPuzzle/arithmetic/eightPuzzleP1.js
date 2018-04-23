define(["require", "exports", "utils", "../../../scripts/base/datastructures/queue", "../../../scripts/base/common/mathUtils", "jquery", "angular"], function (require, exports, utils, Queue, mathUtils) {
    "use strict";
    var eightPuzzleP1 = (function () {
        function eightPuzzleP1() {
            var _this = this;
            //上下左右
            this.to = [[0, -1], [0, 1], [-1, 0], [1, 0]];
            //值交换
            this.swap = function (arr, x1, y1, x2, y2) {
                var temp = arr[x1][y1];
                arr[x1][y1] = arr[x2][y2];
                arr[x2][y2] = temp;
            };
            //比较器
            this.operator = function (a, b) {
                if (a.f == b.f)
                    return !(a.g < b.g);
                return !(a.f > b.f);
            };
            //具体方法
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
                    'f': h,
                    'parent': undefined,
                    'x': x,
                    'y': y,
                    'map': resource
                };
                var lastnode = _this.bfs(node);
                var nodelist = [];
                _this.outOpResult(lastnode, nodelist);
                console.info(nodelist);
                return nodelist.reverse();
            };
            //获取正确位置的康托展开
            this.getTargetContor = function (arr) {
                if (!utils.notEmpty(arr)) {
                    return -1;
                }
                var result = [], len = arr.length, len2 = arr[0].length;
                var len = len * len2;
                for (var i = 1; i < len; i++) {
                    result.push(i);
                }
                result.push(0);
                return mathUtils.cantor(result);
            };
            //A*算法
            this.bfs = function (node) {
                var that = _this;
                var que = new Queue.PriorityQueue(_this.operator);
                var vis = [];
                var sx = node.map[0].length - 1;
                var sy = node.map.length - 1;
                que.push(node);
                var x = 1;
                var rightContro = that.getTargetContor(node.map);
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
                        var v_n = that.MatrixCantor(next.map);
                        if (v_n == rightContro)
                            return next;
                        if (vis[v_n])
                            continue;
                        que.push(next);
                    }
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
        }
        return eightPuzzleP1;
    }());
    exports.eightPuzzleP1 = eightPuzzleP1;
});
//# sourceMappingURL=eightPuzzleP1.js.map