/**
 * ECP Web开发 基础工具类 接口定义.
 * Copyright(c) 2012-2020 YGSoft.Inc
 * author:wangxingkai
 * date:2018-03-21
 */
interface ECPUtilsObject {
    clone(target: Object): Object;
    notEmpty(target: Object): boolean;
    swap(arr: Array<number>, soruce: number, target: number);
}
declare module "utils" {
    let utils: ECPUtilsObject;
    export =utils;
}