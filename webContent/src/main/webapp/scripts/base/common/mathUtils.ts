import * as utils from "utils";
import "jquery"
//常用阶乘数据
export const cantorConst = [1, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880];

        /**
        * 返回阶乘
        * @exapmle
        * require(["mathUtils"],function(utils){
        * utils.factorial(3); //
        * });
        * @param 3 数字
        * @return 6
        * @author wangxingkai
        * @date 2018-03-24
        */
export function factorial(num: number): number {
        var sum = 1;
        for (var i = 1; i <= num; i++) {
            sum *= i;
        }
        return sum;
    }

        /**
        * 返回阶乘数组.
        * @exapmle
        * require(["mathUtils"],function(utils){
        * utils.cantor(3); //
        * });
        * @param 3 数字
        * @return [1,1,2,6]
        * @author wangxingkai
        * @date 2018-03-24
        */
export function factorialArr(num: number): Array<number> {
        var f = [], sum = 1;
        if (typeof num != 'number' || num < 0 || num > 1000) {
            return f;
        }
        f[0] = 1;

        for (var i = 1; i <= num; i++) {
            sum *= i;
            f[i] = sum;
        }
        return f;
    }

        /**
        * 获取康托展开.
        * @exapmle
        * require(["mathUtils"],function(utils){
        * utils.cantor([1,2,3]); //
        * });
        * @param 3 数字数组
        * @return 康托展开
        * @author wangxingkai
        * @date 2018-03-24
        */
export function cantor(arr: Array<number>): number {
        var fconst = cantorConst;
        if (!utils.notEmpty(arr)) {
            return -1;
        }
        if (arr.length >= 10) {
            fconst = factorialArr(arr.length);
        }
        var x = 0;
        var n = arr.length;
        for (var i = 0; i < n; i++) {
            var smaller = 0;  // 在当前位之后小于其的个数
            for (var j = i + 1; j < n; j++) {
                if (arr[j] < arr[i])
                    smaller++;
            }
            x += fconst[n - i - 1] * smaller; // 康托展开累加
        }
        return x;  // 康托展开值
}

        /**
        * 将数组等份切割
        * @param  1数组 列数量
        * @return 0切割后的数组
        * @author wangxingkai
        * @date 2018-03-24
        */
export function sliceArr(arr: Array<any>, colsize: number) {
        var result = [], rowlen = Math.ceil(arr.length / colsize), arrlen = arr.length;
        if (rowlen * colsize != arrlen) {
            return [];
        }
            for (var i = 0; i < rowlen; i++) {
            var start = i * colsize;
            var end = start + colsize;
            result.push(arr.slice(start, end));
        }
        return result;
}

        /**
        * 返回矩形的曼哈顿距离.
        * @exapmle
        * require(["mathUtils"],function(utils){
        * utils.squaMDistance([[1,2,3],[4,5,6],[7,8,0]); //
        * });
        * @param 3 矩阵数组
        * @return 0
        * @author wangxingkai
        * @date 2018-03-24
        */
export function squaMDistance(s1: Array<Array<number>>): number {
        if (!utils.notEmpty(s1)) {
            return -1;
        }
        var row = s1.length, sum = 0, i, k, targetRow, targetcol;
        var col = s1[0].length,j;
        for (i = 0; i < row; i++) {
            for (j = 0; j < col; j++){
                if (s1[i][j] == 0) continue;
                k = s1[i][j] - 1;
                targetRow = Math.floor(k / col);
                targetcol = k % row;
                sum += Math.abs(targetRow - i) + Math.abs(targetcol - j);
            }
        }
        return sum;
}

        /**
        * 返回矩形的曼哈顿距离.
        * @exapmle
        * require(["mathUtils"],function(utils){
        * utils.squaArrMDistance([1,2,3,4,5,6,7,8,9,0],3); //
        * });
        * @param 3 矩阵数组
        * @return 0
        * @author wangxingkai
        * @date 2018-03-24
        */
export function squaArrMDistance(s1: Array<number>, colsize: number): number {
    var arr = sliceArr(s1, colsize);
    return squaMDistance(arr);
}

        /**
        * 将数组用洗牌算法随机打乱.
        * @exapmle
        * require(["mathUtils"],function(utils){
        * utils.shuffle([1,2,3,4,5,6,7,8,9,0]); //
        * });
        * @param 3 数组
        * @return 打乱之后数组
        * @author wangxingkai
        * @date 2018-03-24
        */
export function shuffle(arr: Array<number>): Array<number> {
    var len = arr.length,
        randomIndex,
        temp;
    while (len) {
        randomIndex = Math.floor(Math.random() * len--);
        utils.swap(arr, len, randomIndex);
    }
    return arr;
}

        /**
        * 判断数组是否是奇数列
        * @exapmle
        * require(["mathUtils"],function(utils){
        * utils.shuffle([1,2,3,4,5,6,7,8,9,0]); //
        * });
        * @param 3 数组
        * @return 打乱之后数组
        * @author wangxingkai
        * @date 2018-03-24
        */
export function isOddSeq(arr: Array<number>):boolean{
    var len = arr.length,
        i = 0,
        cnt = 0;
    for (; i < len - 1; i++) {
        for (var j = i + 1; j < len; j++) {
            if (arr[i] > arr[j]) {
                cnt++;
            }
        }
    }
    return (cnt % 2) == 0;
}
//int cal_h(int * s1) {  
//    int ans = 0;
//    for (int i = 0; i < 9; i++) {
//        if (s1[i] == 9) continue;
//        int x = (s1[i] - 1) / 3, y = (s1[i] - 1) % 3;
//        int nx = i / 3, ny = i % 3;
//        ans += abs(x - nx) + abs(y - ny);
//    }
//    return ans;
//}
