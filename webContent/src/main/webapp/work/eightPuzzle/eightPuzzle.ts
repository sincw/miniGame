/*
 * @author:wangxingkai
 * @date:2016.05.15
 * @version:1.0.0
 */
import "angular";
import "jquery"
import * as main from "./controllers/eightPuzzleController";
import * as base from "../../scripts/base/common/baseBuild";
import * as aa from "./eightPuzzleConst";



class eightPuzzle extends base.BasePage {

    constructor() {
        super(main.APPNAME);
        //注册控制器 到app
        this
            .addController(aa.ControllerName.MAIN, ["$scope", "$filter","$interval", main.eightPuzzleController])
        ////UI初始化
        new ScheduleQueryLowerUI();
    }

}

class ScheduleQueryLowerUI {
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
new eightPuzzle().start();





