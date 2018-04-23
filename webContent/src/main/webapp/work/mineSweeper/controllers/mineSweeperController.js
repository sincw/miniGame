define(["require", "exports", "../../../scripts/base/datastructures/queue", "jquery", "angular"], function (require, exports, queue_1) {
    "use strict";
    var mineSweeperController = (function () {
        function mineSweeperController($scope, filter, $interval) {
            var _this = this;
            //存放待处理节点
            this.openList = new queue_1.Queue();
            //存放已处理节点
            this.closeList = {};
            //翻开的数量
            this.openNum = 0;
            //上 上左 左 左下 下 下右 右 右上   置换顺序
            this.move = [[0, -1], [-1, -1], [-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1]];
            //上  左  下  右    置换顺序
            this.move2 = [[-1, 0], [0, -1], [1, 0], [0, 1]];
            //创建地图
            this.createMap2 = function (row, col, value) {
                _this.row = row;
                _this.col = col;
                var matrix = [];
                for (var i = 0; i < row; i++) {
                    var arr = Array(col).fill(value);
                    matrix.push(arr);
                }
                return matrix;
            };
            //创建地图 低版本浏览器没有fill方法
            this.createMap = function (row, col, value) {
                _this.row = row;
                _this.col = col;
                var matrix = [];
                for (var i = 0; i < row; i++) {
                    var arr = [];
                    for (var j = 0; j < col; j++) {
                        arr.push(value);
                    }
                    matrix.push(arr);
                }
                return matrix;
            };
            this.signArea = function (row, col, value) {
                var that = _this;
                that.changeColor(row, col, 2);
            };
            //生成地雷
            this.createLandMine = function (matrix) {
                var that = _this;
                var len = Math.ceil(_this.row * _this.col / 10);
                that.$scope.landMineNum = len;
                for (var i = 0; i < len; i++) {
                    var x = Math.floor(Math.random() * _this.col);
                    var y = Math.floor(Math.random() * _this.row);
                    //防止重复雷
                    if (matrix[y][x] == -1) {
                        len++;
                    }
                    matrix[y][x] = -1;
                    that.fillEdge(matrix, [x, y]);
                }
            };
            //填充地图边缘数字
            this.fillEdge = function (matrix, loc) {
                var move = _this.move;
                for (var i = 0; i < 8; i++) {
                    var x = loc[0] + move[i][0];
                    var y = loc[1] + move[i][1];
                    if (x < 0 || y < 0 || x >= _this.col || y >= _this.row || matrix[y][x] == -1) {
                        continue;
                    }
                    matrix[y][x] += 1;
                }
            };
            //点击事件
            this.open = function (row, col, value) {
                var that = _this;
                if (that.$scope.openmap[row][col] == true) {
                    return;
                }
                else if (that.$scope.squaredData[row][col] != 0) {
                    that.$scope.openmap[row][col] = true;
                }
                switch (value) {
                    case -1:
                        alert("失败");
                        break;
                    case 0:
                        that.openSafeArea(row, col);
                        break;
                    default:
                        that.openNum++;
                        _this.changeColor(row, col, 1);
                        break;
                }
                console.info(that.openNum);
                if (that.openNum == that.col * that.row - that.$scope.landMineNum) {
                    alert("胜利");
                }
            };
            this.openSafeArea = function (row, col) {
                var that = _this;
                var move = _this.move2;
                that.openList.push([row, col]);
                that.closeList[row + '-' + col] = true;
                while (!that.openList.empty()) {
                    var node = that.openList.front();
                    that.openList.pop();
                    that.openNum++;
                    if (that.map[node[0]][node[1]] >= 1) {
                        that.changeColor(node[0], node[1], 1);
                        that.$scope.openmap[node[0]][node[1]] = true;
                        continue;
                    }
                    else {
                        that.changeColor(node[0], node[1], 0);
                    }
                    for (var i = 0; i < 4; i++) {
                        var nrow = node[0] + move[i][0];
                        var ncol = node[1] + move[i][1];
                        if (nrow < 0 || ncol < 0 || ncol >= _this.col || nrow >= _this.row) {
                            continue;
                        }
                        if (that.closeList[nrow + "-" + ncol]) {
                            continue;
                        }
                        that.openList.push([nrow, ncol]);
                        that.closeList[nrow + '-' + ncol] = true;
                    }
                }
            };
            //0 无雷区 1 警示区 2 标志雷区
            this.changeColor = function (row, col, flag) {
                var that = _this;
                if (flag == 1) {
                    $(".block" + row + '-' + col).css("background-color", "coral");
                }
                else if (flag == 0) {
                    $(".block" + row + '-' + col).css("background-color", "aqua");
                }
                else {
                    $(".block" + row + '-' + col).css("background-color", "red");
                }
            };
            console.info("mineSweeperController start");
            this.$scope = $scope;
            this.filter = filter;
            var map = this.createMap(20, 20, 0);
            this.createLandMine(map);
            this.map = map;
            this.$scope.squaredData = map;
            this.$scope.open = this.open;
            this.$scope.openmap = this.createMap(20, 20, false);
            this.$scope.signArea = this.signArea;
        }
        return mineSweeperController;
    }());
    exports.mineSweeperController = mineSweeperController;
});
//# sourceMappingURL=mineSweeperController.js.map