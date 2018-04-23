/*
 * @author:wangxingkai
 * @date:2016.05.15
 * @version:1.0.0
 */
import "angular";
import "jquery"
import * as main from "./controllers/mineSweeperController";
import * as base from "../../scripts/base/common/baseBuild";
import * as constance from "./mineSweeperConst";



class mineSweeper extends base.BasePage {

    constructor() {
        super(constance.APPNAME);
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

}

class InitUI {
    constructor() {
        this.addJqueryEvent();
    }

    /**
	 * jquery事件绑定事件
	*/
    private addJqueryEvent = () => {

    }
}

//启动应用
new mineSweeper().start();





