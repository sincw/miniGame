var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./controllers/eightPuzzleController", "../../scripts/base/common/baseBuild", "./eightPuzzleConst", "angular", "jquery"], function (require, exports, main, base, aa) {
    "use strict";
    var eightPuzzle = (function (_super) {
        __extends(eightPuzzle, _super);
        function eightPuzzle() {
            _super.call(this, main.APPNAME);
            //注册控制器 到app
            this
                .addController(aa.ControllerName.MAIN, ["$scope", "$filter", "$interval", main.eightPuzzleController]);
            ////UI初始化
            new ScheduleQueryLowerUI();
        }
        return eightPuzzle;
    }(base.BasePage));
    var ScheduleQueryLowerUI = (function () {
        function ScheduleQueryLowerUI() {
            /**
             * jquery事件绑定事件
            */
            this.addJqueryEvent = function () {
            };
            this.addJqueryEvent();
        }
        return ScheduleQueryLowerUI;
    }());
    //启动应用
    new eightPuzzle().start();
});
//# sourceMappingURL=eightPuzzle.js.map