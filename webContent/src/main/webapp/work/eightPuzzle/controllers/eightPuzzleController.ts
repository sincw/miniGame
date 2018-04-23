
import "jquery";
import "angular";
import {eightPuzzleP1} from "../arithmetic/eightPuzzleP1"
import {eightPuzzleP2} from "../arithmetic/eightPuzzleP2"
import * as Squared from "../model/squared"
export class eightPuzzleController {


    $scope: eightPuzzleScope;
    $interval: any;
    squaredObject: Squared.Isquared;
    
    constructor($scope: eightPuzzleScope, filter: any, $interval: any) {
        this.$scope = $scope;
        this.$interval = $interval;
        console.info("eightPuzzleController start");
        var squared = new Squared.Squared(4,4);
        this.squaredObject = squared;
        $scope.squaredData = squared.getMatrix();
        $scope.move = this.move.bind(this);
        $scope.theBestPath = this.theBestPath.bind(this);
        $scope.buttonstatus = 1;    
    }

    move = (row: number, col: number, value: number) => {
        if (this.$scope.buttonstatus != 1) {
            return;
        }
        console.info('row=' + row + 'col=' + col + 'value=' + value);
        this.squaredObject.moveCoordinate(row, col, value);
        this.$scope.squaredData = this.squaredObject.getMatrix();
    }

    //P1为A*求解，P2为IDA*求解
    theBestPath = () => {
        var that = this;
        //var p = new eightPuzzleP1();
        var p = new eightPuzzleP2();
        var sdate = new Date().getTime();

        var result = p.eightPuzzle(this.squaredObject.getMatrix());
        var edate = new Date().getTime();
        console.info(edate - sdate);
        console.info(result);

        
        
        var timer = this.$interval(function () {
            if (result.length == 0) {
                that.$interval.cancel(timer);
                that.$scope.buttonstatus = 1; 
            } else {
                that.$scope.squaredData = (<Array<any>>result).shift();
            }
        }, 500); 
        timer.then(function () {
                console.log('创建成功')
        },
            function () {
                console.log('定时结束')
            });

    }

    

}

export const APPNAME = 'eightPuzzle'

interface eightPuzzleScope extends ng.IScope{
    squaredData: Array<Array<number>>;
    move: Function;
    theBestPath: Function;
    buttonstatus: number;
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



