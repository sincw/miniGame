define(["require", "exports", "../arithmetic/eightPuzzleP2", "../model/squared", "jquery", "angular"], function (require, exports, eightPuzzleP2_1, Squared) {
    "use strict";
    var eightPuzzleController = (function () {
        function eightPuzzleController($scope, filter, $interval) {
            var _this = this;
            this.move = function (row, col, value) {
                if (_this.$scope.buttonstatus != 1) {
                    return;
                }
                console.info('row=' + row + 'col=' + col + 'value=' + value);
                _this.squaredObject.moveCoordinate(row, col, value);
                _this.$scope.squaredData = _this.squaredObject.getMatrix();
            };
            //P1为A*求解，P2为IDA*求解
            this.theBestPath = function () {
                var that = _this;
                //var p = new eightPuzzleP1();
                var p = new eightPuzzleP2_1.eightPuzzleP2();
                var sdate = new Date().getTime();
                var result = p.eightPuzzle(_this.squaredObject.getMatrix());
                var edate = new Date().getTime();
                console.info(edate - sdate);
                console.info(result);
                var timer = _this.$interval(function () {
                    if (result.length == 0) {
                        that.$interval.cancel(timer);
                        that.$scope.buttonstatus = 1;
                    }
                    else {
                        that.$scope.squaredData = result.shift();
                    }
                }, 500);
                timer.then(function () {
                    console.log('创建成功');
                }, function () {
                    console.log('定时结束');
                });
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
        return eightPuzzleController;
    }());
    exports.eightPuzzleController = eightPuzzleController;
    exports.APPNAME = 'eightPuzzle';
});
//# sourceMappingURL=eightPuzzleController.js.map