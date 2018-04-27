
import "jquery";
import "angular";
import * as utils from "utils";
import * as Squared from "../model/squared"
import * as Queue from "../../../scripts/base/datastructures/queue"
import * as mathUtils from "../../../scripts/base/common/mathUtils"
export class eightPuzzleP2 {
    //上 左 右 下  置换顺序
    move1: Array<Array<number>> = [[-1, 0], [0, -1], [0, 1], [1, 0]];

    //测试
    map: Array<Array<number>> = [[1, 2, 3, 4], [0, 5, 7, 8], [9, 6, 10, 12], [13, 14, 11, 15]];

    //完成标志
    flag: number = 0;

    //当前步数
    length: number = 0;

    //最小步数
    limit: number = 0;

    //值交换
    swap = (arr: Array<Array<number>>,x1,y1,x2,y2) => {
        var temp = arr[x1][y1];
        arr[x1][y1] = arr[x2][y2];
        arr[x2][y2] = temp;
    }

    //路径
    result: Array<any> = [];

    //行数量
    row: number;

    //列数量
    col: number;

    constructor() {

    }   

    bfs = (sx, sy, len, pre_move) => {
        var i, nx, ny;
        if (this.flag)
            return;
        var dv = mathUtils.squaMDistance(this.map);
        if (len == this.limit) {
            if (dv == 0) {
                this.flag = 1;
                this.length = len;
                return;
            } else {
                return;
            }
        } else if (len < this.limit) {
            if (dv == 0) {
                this.flag = 1;
                this.length = len;
                return;
            }
        }
        for (i = 0; i < 4; i++) {
            if (i + pre_move == 3 && len > 0)//不和上一次移动方向相反，对第二步以后而言  
                continue;
            nx = sx + this.move1[i][0];  //移动的四步
            ny = sy + this.move1[i][1];
            if (0 <= nx && nx < this.row && 0 <= ny && ny < this.col)  //移动合理
            {
                this.swap(this.map, sx, sy, nx, ny);
                var p = mathUtils.squaMDistance(this.map);  //移动后的曼哈顿距离
                if (p + len <= this.limit && !this.flag)  //剪枝判断语句
                {
                    this.result[len] = (utils.clone(this.map));
                    this.bfs(nx, ny, len + 1, i);  //如当前步成功则 递归调用dfs
                    if (this.flag)
                        return;
                }
                this.swap(this.map, sx, sy, nx, ny);//不合理则回退一步
                }
            }
        }


    eightPuzzle = (resource: Array<Array<number>>): Array<Array<Array<number>>> => {
        var re = <Array<Array<number>>>utils.clone(resource)
        this.map = re;
        
        this.limit = mathUtils.squaMDistance(this.map);
        var len1 = this.map.length, len2 = this.map[0].length;
        this.row = len1;
        this.col = len2;
        var x, y;
        for (var i = 0; i < len1; i++) {
            for (var j = 0; j < len2; j++) {
                if (this.map[i][j] == 0) {
                    x = i;
                    y = j;
                }
            }
        }
        this.result.push(utils.clone(resource));
        while (!(this.flag))
        {
            this.bfs(x, y, 0, 0);
            if (!(this.flag))
                this.limit++; //得到的是最小步数  
        }
        return this.result;
    }
}



