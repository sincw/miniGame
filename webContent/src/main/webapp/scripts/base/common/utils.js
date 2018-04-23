/**
 *  Web开发 基础工具类.
 * Copyright(c) www.sincw.com
 * author:wangxingkai
 * date:2018-3-24
 */
define([], function () {
    var service = {
        clone: function (target) {
            var objClone;
            if (target) {
                if (target.constructor == Object || target.constructor == Array) {
                    objClone = new target.constructor();
                }
                else {
                    objClone = new target.constructor(target.valueOf());
                }
                for (var key in target) {
                    if (objClone[key] != target[key]) {
                        if (typeof (target[key]) == 'object') {
                            objClone[key] = arguments.callee(target[key]);
                        }
                        else {
                            objClone[key] = target[key];
                        }
                    }
                }
                objClone.toString = target.toString;
                objClone.valueOf = target.valueOf;
            }
            return objClone;
        },

        notEmpty: function (target, a) {
            //当o是undefined或者null或者"" 时返回false,
            if (target == null || target === "") {
                return false;
            }
            var to = typeof target;
            var _this = this;
            switch (to) {
                case "string":
                    //当o是字符串时,去首尾空（' ','\r','\n','\t'）后，结果为空串则认为是空
                    if (target.replace(/^\s+|\s+$/, "") === "") {
                        return false;
                    }
                    break;
                case "object":
                    //当o是数组/对象,并且有元素
                    function __notEmpty(o, a) {
                        if (a == null || a === "") {
                            //没有属性参数a,结束判断，并返回true(不空)
                            return true;
                        } else {
                            //有属性参数a, 继续递归判断

                            function __cut(src, sep, index, callback) {
                                var ret;
                                //当src为空时返回null
                                if (src == null) {
                                    ret = null;
                                } else if (src == "" || (sep == null || sep == "")) {
                                    //当src为空串时，或者sep为空时返回[src]
                                    ret = [src];
                                } else {
                                    var ret = src.split(sep);
                                    if (!(index == null || index == 0)) {
                                        //非贪婪模式下,只分割到第index个分隔符
                                        var aa = ret.splice(index, ret.length);
                                        ret = [ret.join(sep), aa.join(sep)];
                                    }
                                    //贪婪模式下,各个分割
                                }
                                //对返回结果做进一步处理
                                if (!!ret && typeof callback === "function") {
                                    ret = callback(ret);
                                }
                                return ret;
                            }

                            var aa = __cut(a, '.', 1),
                                k1 = aa[0],
                                k2 = aa[1],
                                p1 = k1.indexOf("("),
                                p2 = k1.indexOf(")"),
                                _target;

                            if (p1 < 0 && p2 < 0) {
                                _target = o[k1];
                            } else if (p1 >= 0 && p2 >= 0) {//函数
                                var args = k1.substring(p1 + 1, p2);
                                k1 = k1.substring(0, p1);
                                _target = eval('o["' + k1 + '"](' + args + ')');
                            } else {
                                throw new Error("表达式错误：" + a);
                            }
                            return _this.notEmpty(_target, k2);
                        }
                    };
                    if (target instanceof Array) {
                        //当o是数组,但没有元素，认为是空
                        if (target.length == 0) {
                            return false;
                        } else {
                            return __notEmpty(target, a);
                        }
                    } else {
                        //当o是对象
                        for (var k in target) {
                            return __notEmpty(target, a);
                        }
                        //没有任何元素，认为是空
                        return false;
                    }
                    break;
            }
            return true;
        },

        swap: function (arr, soruce, target) {
            if (!this.notEmpty(arr) || target >= arr.length || soruce >= arr.length) {
                return;
            }
            arr[soruce] = arr.splice(target, 1, arr[soruce])[0];
        }

    };
    return service;
});
