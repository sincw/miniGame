export class Queue {
    arr: Array<any>;

    constructor() {
        this.arr = [];
    }

    //将x压入队列的末端
    push = (data: any) => {
        this.arr.push(data);
    }

    //弹出队列的第一个元素(队顶元素) ，注意此函数并不返回任何值
    pop = () => {
        this.arr.shift();
    }

    front = (): any => {
        return this.arr[0];
    }

    rear = () => {
        return this.arr[this.arr.length - 1];
    }

    empty = () => {
        return this.arr.length == 0;
    }

    size = () => {
        return this.arr.length;
    }
    
}

export class PriorityQueue extends Queue{ 

    constructor(operator?: Function) {
        super();
        this.foperator = operator;
    }

    foperator: Function;

    //setOpertor = (op: Function) => {
    //    this.foperator = op;
    //}

    push = (node: any) => {
        var arrList = this.arr;
        if (!this.foperator) {
            this.foperator = node.operator;
        }
        if (this.empty()) {
            this.arr.push(node);
        } else {
            var len = this.size();
            var added = false;
            //二分可优化
            for (var i = 0; i < len; i++) {
                if (this.foperator(node, this.arr[i])) {
                    arrList.splice(i, 0, node);
                    added = true;
                    break;
                }
            }
            if (!added) {
                arrList.push(node);
            } 
        }
    }
}

