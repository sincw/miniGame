﻿export class Squared {

    array: Array<number>;
    matrix: Array<Array<number>>;


    row: number;
    col: number;

    constructor(row: number, col?: number) {
        if (!col) {
            col = row;
        }
        this.array = this.createSquaredUpSeq(row, col);
        this.row = row;
        this.col = col;

        this.matrix = this.sliceArr(this.array, col);
    }

    val = (arr: Array<number>) => {
        var that = this;
        this.array = arr;
        this.matrix = this.sliceArr(arr, that.col);
    }

    getZeroLocation = (): number => {
        return this.array.indexOf(0);
    }

    getArray = (): Array<number> => {
        return this.array;
    }

    getMatrix = (): Array<Array<number>> => {
        return this.matrix;
    }
    //将数组等份切割
    //arr 数组
    //size 每组的大小
    private sliceArr = (arr: Array<any>, size: number) => {
        var result = [], len = Math.ceil(arr.length / size);
        for (var i = 0; i < len; i++) {
            var start = i * size;
            var end = start + size;
            result.push(arr.slice(start, end));
        }
        return result;
    }

    private createSquaredUpSeq = (row: number, col: number): Array<number> => {
        var num = row * col;
        var seq = [];
        for (var i = 1; i < num; i++) {
            seq.push(i);
        };
        seq = this.shuffle(seq);
        seq.push(0);
            if (this.isOddSeq(seq)) {
                this.swap(seq, 0, 1);
            }
            if (num % 2 == 0) {
                this.swap(seq, 0, 1);
            }
            var a = [5, 1, 2, 4, 9, 6, 3, 8, 13, 15, 10, 11, 14, 7, 12, 0];//16步
            var b = [14, 10, 1, 8, 3, 15, 7, 9, 5, 12, 11, 4, 13, 2, 6, 0];//48步
            this.isOddSeq(a);
            return seq;
    }



    swap = (arr, soruce, target) => {
        arr[soruce] = arr.splice(target, 1, arr[soruce])[0];
    }

    swapArray = (soruce, target) => {
        var arr = this.array;
        arr[soruce] = arr.splice(target, 1, arr[soruce])[0];
    }

    shuffle = (arr) => {
        var len = arr.length,
            randomIndex,
            temp;
        while (len) {
            randomIndex = Math.floor(Math.random() * len--);
            this.swap(arr, len, randomIndex);
        }
        return arr;
    }

    isOddSeq = (arr) => {
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
        return (cnt % 2) != 0;
    }

    moveCoordinate = (row: number, col: number, value: number) => {
        var that = this;
        var zeroIndex = that.getZeroLocation();
        var curIndex = (row * this.col) + (col);
        var len = this.array.length;
        if (this.moveUp(zeroIndex, curIndex)) {
            this.swapArray(zeroIndex, curIndex);
        }
        if (this.moveDown(zeroIndex, curIndex)) {
            this.swapArray(zeroIndex, curIndex);
        }
        if (this.moveLeft(zeroIndex, curIndex)) {
            this.swapArray(zeroIndex, curIndex);
        }
        if (this.moveRight(zeroIndex, curIndex)) {
            this.swapArray(zeroIndex, curIndex);
        }
        this.val(this.array);
    }

    moveUp = (zeroIndex: number, curIndex: number) => {
        var value = curIndex - this.col;
        if (value >= 0 && zeroIndex == value) {
            return true;
        }
        return false;
    }

    moveDown = (zeroIndex: number, curIndex: number) => {
        var value = curIndex + this.col;
        if (value <= this.array.length && zeroIndex == value) {
            return true;
        }
        return false;
    }

    moveLeft = (zeroIndex: number, curIndex: number) => {
        var value = curIndex - zeroIndex;
        if ((curIndex % this.col != 0) && 1 == value) {
            return true;
        }
        return false;
    }

    moveRight = (zeroIndex: number, curIndex: number) => {
        var value = zeroIndex - curIndex;
        if ((curIndex % this.col != this.col - 1) && 1 == value) {
            return true;
        }
        return false;
    }
}

export interface Isquared {
    array: Array<number>;
    matrix: Array<Array<number>>;
    row: number;
    val: Function;
    getZeroLocation: Function;
    getArray: Function;
    getMatrix: Function;
    moveCoordinate: Function;
    moveRight: Function;
    moveLeft: Function;
    moveUp: Function;
    moveDown: Function;
}