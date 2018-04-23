var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./controllers/mineSweeperController", "../../scripts/base/common/baseBuild", "./mineSweeperConst", "angular", "jquery"], function (require, exports, main, base, constance) {
    "use strict";
    var mineSweeper = (function (_super) {
        __extends(mineSweeper, _super);
        function mineSweeper() {
            _super.call(this, constance.APPNAME);
            //注册控制器 到app
            this
                .addController(constance.ControllerName.MAIN, ["$scope", "$filter", "$interval", main.mineSweeperController])
                .addDirective('ngRightClick', function ($parse) {
                return function (scope, element, attrs) {
                    var fn = $parse(attrs.ngRightClick);
                    element.bind('contextmenu', function (event) {
                        scope.$apply(function () {
                            event.preventDefault();
                            fn(scope, { $event: event });
                        });
                    });
                };
            });
            ////UI初始化
            new InitUI();
        }
        return mineSweeper;
    }(base.BasePage));
    var InitUI = (function () {
        function InitUI() {
            /**
             * jquery事件绑定事件
            */
            this.addJqueryEvent = function () {
            };
            this.addJqueryEvent();
        }
        return InitUI;
    }());
    //启动应用
    new mineSweeper().start();
});
//# sourceMappingURL=mineSweeper.js.map