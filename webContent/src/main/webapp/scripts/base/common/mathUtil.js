define([], function () {
    var service = {};
    service.clone = function (target) {
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
    };
    return service;
});
