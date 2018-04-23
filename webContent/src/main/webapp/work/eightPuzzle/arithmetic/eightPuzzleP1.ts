
import "jquery";
import "angular";
import * as utils from "utils";
import * as Squared from "../model/squared"
import * as Queue from "../../../scripts/base/datastructures/queue"
import * as mathUtils from "../../../scripts/base/common/mathUtils"
export class eightPuzzleP1 {

    //上下左右
    private to: Array<Array<number>> = [[0, -1], [0, 1], [-1, 0], [1, 0]];



    constructor() {

    }

    //值交换
    private swap = (arr: Array<Array<number>>, x1, y1, x2, y2) => {
        var temp = arr[x1][y1];
        arr[x1][y1] = arr[x2][y2];
        arr[x2][y2] = temp;
    }

    //比较器
    private operator = (a: any, b: any) => {
        if (a.f == b.f) return !(a.g < b.g);
        return !(a.f > b.f);
    }

    //具体方法
    eightPuzzle = (resource: Array<Array<number>>): Array<Array<Array<number>>> => {
        var h = mathUtils.squaMDistance(resource);
        var x,y;
        for (var i = 0; i < resource.length; i++) {
            for (var j = 0; j < resource[i].length; j++) {
                if (resource[i][j] == 0) {
                    x = i;
                    y = j;
                }
            }
        }
        var node: ISquaredNode = {
            'g': 0,
            'h': h,
            'f': h,
            'parent': undefined,
            'x': x,
            'y': y,
            'map': resource
        };
        var lastnode = this.bfs(node);
        var nodelist = [];
        this.outOpResult(lastnode, nodelist);
        console.info(nodelist);
        return nodelist.reverse();
    }

    //获取正确位置的康托展开
    getTargetContor = (arr: Array<Array<any>>) => {
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
    }

    //A*算法
    private bfs = (node: ISquaredNode): ISquaredNode => {       
        var that = this;
        var que = new Queue.PriorityQueue(this.operator);
        var vis = [];
        var sx = node.map[0].length-1;
        var sy = node.map.length-1;
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
                var next = <ISquaredNode>utils.clone(a);
                next.parent = a;
                next.x += that.to[i][0];
                next.y += that.to[i][1];
                if (next.x < 0 || next.y < 0 || next.x > sx || next.y > sy) continue;
                next.map[a.x][a.y] = a.map[next.x][next.y];
                next.map[next.x][next.y] = 0;
                next.g += 1;
                next.h = mathUtils.squaMDistance(next.map);
                next.f = next.g + next.h;
                var v_n = that.MatrixCantor(next.map);
                if (v_n == rightContro )
                    return next;
                if (vis[v_n]) continue;
                que.push(next);
            }
        }
    }

    private outOpResult = (node: any, arr: Array<any>) => {
        arr.push(node.map);
        if (node.parent) {
            this.outOpResult(node.parent, arr);
        }
    }

    private MatrixCantor = (map: Array<Array<number>>) => {
        var arr: Array<number> = [];
        var len1 = map.length;
        for (var i = 0; i < len1; i++) {
            var len2 = map[i].length;
            for (var j = 0; j < len2; j++) {
                arr.push(map[i][j]);
            }
        }
        return mathUtils.cantor(arr);
    }

}

interface ISquaredNode  {
    map: Array<Array<number>>;
    g: number;
    f: number;
    h: number;
    x: number;
    y: number;
    parent: ISquaredNode;
}



