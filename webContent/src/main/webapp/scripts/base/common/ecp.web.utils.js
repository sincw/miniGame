/**
 * ECP Web开发 基础工具类.
 * date:2015-5-28
 */
define(['jquery', "jquery.migrate","ecp.const","ecp.utils.hz2py","ecp.utils.des","ecp.utils.i18n","sugar","ecp.extender.indigenous","bs-notify"], function ($, migrate, cst,hzUtil,desUitls,i18n) {
    //自动消失提醒框对象
    var notifyMsgEle;
    var utils= {
        /**
         * 格式化字符串
         * @exapmle
         * require(["ecp.utils"],function(utils){
         * utils.format("{0} is a { 1 }.","YWY","man"); //YWY is a man.
         * });
         * @param {String} strtmpl 字符串模板,用{n}表示参数位置，n从0开始计数
         * @return {String}
         * @author yangwenyi@ygsoft.com
         * @date 2014-9-20
         */
        format: function (strtmpl) {
            var alen = arguments.length;
            if (alen == 0) {
                return;
            } else if (alen == 1) {
                return strtmpl;
            }
            var args = arguments[1];
            if (typeof args == "string") {
                args = Array.prototype.slice.call(arguments, 1);
            }
            alen = args.length;
            var ret = strtmpl;
            for (var i = 0; i < alen; i++) {
                ret = ret.replace(new RegExp("\\{\\s*" + i + "\\s*\\}", "g"), args[i]);
            }
            return ret;
        },
        /**
         * 转换成原始的尖括号
         * @exapmle
         * require(["ecp.utils"],function(utils){
         * 		utils.originalAngleBrackets("&lt;script&gt;"); //<script>
         * });
         * @param {String} '&lt;' or '&gt;'
         * @return {String} '<' or '>'
         * @author yinshanpeng@ygsoft.com
         * @date 2015.4.15
         */
        originalAngleBrackets: function (s) {
            if (!this.notEmpty(s) || (typeof(s) !== "string") || $.isNumeric(s)) {
                return s;
            }
            if (s.indexOf("&lt;") >= 0) {
                s = s.replaceAll("&lt;", "<");
            }
            if (s.indexOf("&gt;") >= 0) {
                s = s.replaceAll("&gt;", ">");
            }
            return s;
        },
        /**
         * 原始的尖括号转换成编码尖括号
         * @exapmle
         * require(["ecp.utils"],function(utils){
         * 		utils.originalAngleBrackets("<script>"); //&lt;script&gt;
         * });
         * @param {String} '<' or '>'
         * @return {String} '&lt;' or '&gt;'
         * @author yinshanpeng@ygsoft.com
         * @date 2015.4.15
         */
        escapeAngleBrackets: function (s) {
            if (!this.notEmpty(s) || (typeof(s) !== "string") || $.isNumeric(s)) {
                return s;
            }
            if (s.indexOf("<") >= 0) {
                s = s.replaceAll("<", "&lt;");
            }
            if (s.indexOf(">") >= 0) {
                s = s.replaceAll(">", "&gt;");
            }
            return s;
        },
        /**
         * 转换<script></script>为编码形式
         *
         * @param {String} '<script></script>'
         * @returns {String} '&lt;script&gt;&lt;/script&gt;'
         * @author yinshanpeng@ygsoft.com
         * @date 2015.4.15
         */
        escapeScriptTag: function (s) {
            if (!this.notEmpty(s) || (typeof(s) !== "string") || $.isNumeric(s)) {
                return s;
            }
            var st = "" + s;
            st = st.toLowerCase();
            if (st.indexOf("<script") > -1 && st.indexOf("</script") > -1) {
                s = s.replace(/<(script)([^>]*)>/gi, "&lt;$1$2&gt;").replace(/<\/(script)([^>]*)>/gi, "&lt;/$1$2&gt;");
            }
            return s;
        },
        /**
         * 转义字符
         * @param {String}  transFerred 要转义的值
         * @example 1
         *    transFerred=“珠海&远光” //返回 珠海&amp;远光
         * @example 2
         *    transFerred=“珠海<远光” //返回 珠海&lt;远光      > 大于号这个可以解析
         * @example 3
         *    transFerred=“珠海&远光&共创” //返回 珠海&amp;远光&amp;共创>
         * @example 4
         *    transFerred=“珠海&<远光>” //返回 珠海&amp;&lt;远光>
         * <p>
         * 目前只支持3种常用的,1种组合出现例如：example 4
         * </p>
         */
        transFerredString: function (transFerred) {
            if (transFerred && transFerred.length > 0) {
                var transFerredString = "";
                if (transFerred.indexOf("&") >= 0 || transFerred.indexOf("<") >= 0) {
                    transFerredString = transFerred.replace(/&/g, "&amp;");
                    transFerredString = transFerredString.replace(/</g, "&lt;");
                } else {
                    transFerredString = transFerred;
                }
                return transFerredString;
            }
        },
        /**
         * jquery选择器中".","[","]",":"都是关键字，需要转义
         * @param {String} str 待替换的字符串
         * @return {String} 替换后的字符串
         * @author yinshanpeng@ygsoft.com
         * @date 2015.4.15
         */
        replaceJquerySelecter: function (str) {
            return str && str.replace(/[\[,\],\.,\:]/g, function (word) {
                    return "\\" + word;
                });
        },
        /**
         * 将字段路径字符串分隔成数组
         * @example
         *   var spath = "a.list[0].b.list[1].c";
         *   var apath = utils.splitStr(spath); // apath = ["a", "list", "0", "b", "list", "1", "c"]
         *
         * @param {String} str 字段路径字符串，例如： "a.list[0].b.list[1].c"
         * @return {String[]} 字段路径数组
         */
        splitStr: function (str) {
            str = str.replace(/\[(\d*)\]/g, ".$1");
            //如果以.开头，则去除
            if (str.indexOf(".") === 0) {
                str = str.replace(/(\.*)(.*)/, "$2");
            }
            return str.split(".");
        },
        /**
         * 字符串、数字大小比较
         * <p>
         *     1.参数1 或 参数2 中任意一个类型为“object”时，返回 -1
         *     2.大于返回数值 1 ，等于返回数值 0 ，小于返回数值 -1
         * </p>
         * @param {String | Number} a
         * @param {String | Number} b
         * @retrun {Number}
         * @author yinshanpeng@ygsoft.com
         * @date 2014.12.03
         */
        compare: function (a, b, cashJson) {
            var apy = bpy = null;
            if ($.type(a) === "object" || $.type(b) === "object") {
                return -1;
            } else if ($.isNumeric(a) && $.isNumeric(b)) {
                return a - b > 0 ? 1 : (a === b ? 0 : -1);
            } else {
                if (cashJson != null) {
                    apy = cashJson[a];
                    if (apy == null) {
                        apy = hzUtil.transToPinYin(a);
                        cashJson[a] = apy;
                    }
                    bpy = cashJson[b];
                    if (bpy == null) {
                        bpy = hzUtil.transToPinYin(b);
                        cashJson[b] = bpy;
                    }
                } else {
                    apy = hzUtil.transToPinYin(a);
                    bpy = hzUtil.transToPinYin(b);
                    if (cashJson != null) {
                        cashJson[a] = apy;
                        cashJson[b] = bpy;
                    }
                }
                return apy.localeCompare(bpy);
            }
        },
        /**
         * 用分割符分割字符串,返回字符串数组
         * <p>
         *   首先，用sep字符串去分割src字符串得到数组ret，如果index不为undefined并且不是0，将index前后的元素用sep连接起来的左右两个元素作为新数组ret;
         *   然后，如果给定了有效的callback函数，对ret的每个元素执行callback,得到新ret,返回。
         *
         * 分割全部:
         * @example 1
         *  utils.split("x.y.z.w",".");        //返回["x","y","z","w"]
         *
         * 分割到第一个分隔符
         * @example 2
         *   utils.split("x.y.z.w",".",1);    //返回["x","y.z.w"]
         *   utils.split("x.y.z.w",".",-3);    //返回["x","y.z.w"]
         * 分割到第二个分隔符
         * @example 3
         *   utils.split("x.y.z.w",".",2);    //返回["x.y","z.w"]
         *   utils.split("x.y.z.w",".",-2);    //返回["x.y","z.w"]
         *
         * 分割到最后个分隔符
         * @example 3
         *   utils.split("x.y.z.w",".",-1);    //返回["x.y.z","w"]
         *
         * 有回调函数的例子
         * @example 4
         *   var aa = utils.split("x .y.z . w",".",-1,function(arr){
		 *     for(var i=0;i<arr.length;i++){
		 *       arr[i] = arr[i].replace(/^\s+|\s+$/,"");
		 *     }
		 *     return arr;
		 *   });    //返回["x .y.z","w"]
         *
         * 单元测试：
         * @unittest webtest.cases.ecp.utils
         *
         * </p>
         *
         * @param {String} src 被分割的目标字符串
         * @param {String} sep 分割符，单或多个字符串
         * @param {Number} index 分割到第几个（1表示第1个，-1表示倒数第几个）分隔符，即将src分割成左右两部分；当为0或者没有定义时，表示全部分割
         * @param {Function} callback 回调函数，对结果数组做进一步处理
         * @returns {Array}    字符串数组
         *
         * @author yangwenyi
         * @version 1.0
         * @date 2014-4-25
         */
        split: function (src, sep, index, callback) {
            var ret;
            //当src为空时返回null
            if (src == null) {
                ret = null;
            } else if (src == "" || ( sep == null || sep == "")) {
                //当src为空串时，或者sep为空时返回[src]
                ret = [src];
            } else {
                var ret = src.split(sep);
                if (!(  index == null || index == 0 )) {
                    //非贪婪模式下,只分割到第index个分隔符
                    var aa = ret.splice(index, ret.length);
                    ret = [ret.join(sep), aa.join(sep)];
                }
                //贪婪模式下,各个分割
            }
            //对返回结果做进一步处理
            if (!(ret == null) && typeof callback === "function") {
                ret = callback(ret);
            }
            return ret;
        },
        /**
         * 移除result中包含的zero或者zerozero(内部方法)
         * @ignore
         */
        removeZero: function (src, zero) {
            while (src.length > 1 && src.endsWith(zero)) {
                src = src.substring(0, src.length - 1);
            }
            var index = src.indexOf(zero + zero);
            if (index != -1) {
                src = src.substring(0, index) + src.substring(index + 1);
                return this.removeZero(src, zero);
            }
            return src;
        },
                
        /**
		 * 数字转为金额大写
		 * <p>
		 * 此方法原有瑕疵(零的有无),例如：
		 *  var m = utils.transferNumToMoney(1001);//壹仟零壹元整
		 *  var m = utils.transferNumToMoney(1000101); //壹佰萬壹佰壹元整
		 *  var m = utils.transferNumToMoney(1000101.011);//壹佰萬壹佰壹圆零角壹分壹厘
		 * 已经修正：
		 *  var m = utils.transferNumToMoney(1001);//壹仟零壹元整
		 *  var m = utils.transferNumToMoney(1000101); //壹佰萬零壹佰零壹元整
		 *  var m = utils.transferNumToMoney(1000101.011);//壹佰萬零壹佰零壹圆零壹分壹厘
		 * </p> 
		 * 
		 *  @param {Number} num 金额数字
		 *  @return {String} 大写的金额字符串
		 *  
		 */
		transferNumToMoney : function(num){
            return this.formartToZh(num,"um");
		},
        
        /**
		 * 小写数字转换为大写
		 * 此方法原有瑕疵，例如：
		 * utils.transferNumToChUpper(123456000101.011) //壹千贰百叁十肆亿伍千陆百万零壹百零壹点零壹十壹
		 * 已经修正：
		 * utils.transferNumToChUpper(123456000101.011) //壹千贰百叁十肆亿伍千陆百万零壹百零壹点零壹壹
		 * 
         * @deprecated 请使用 @link{utils.formartToZh}
		 */
		transferNumToChUpper : function(num){
            return this.formartToZh(num,"u");
		},
		/**
		 * 小写数字转换为小写
		 * 此方法原有瑕疵，例如：
		 * var d = utils.transferNumToChLower(120345600101.011);//一千二百〇三亿四千五百六十万〇一百〇一点〇一十一
		 * 已经修正：
		 * var d = utils.transferNumToChLower(120345600101.011);//一千二百〇三亿四千五百六十万〇一百〇一点〇一一
         * @deprecated 请使用 @link{utils.formartToZh}
		 */
		transferNumToChLower : function(num){
             return this.formartToZh(num,"l");
		},
        
        /**
         * 将阿拉伯数字转换成中文数字(为金额，日期，数字共用的方法)
         *  @example
         *   utils.formartToZh("1234567800056509.3","lm") //一千二百三十四万五千六百七十八亿〇五万六千五百〇九元三角
         *   utils.formartToZh("1234567800056509.3","um") //壹仟贰佰叁拾肆萬伍仟陆佰柒拾捌億零伍萬陆仟伍佰零玖圆叁角
         *   utils.formartToZh("1234567800056509.3","l") //一千二百三十四万五千六百七十八亿〇五万六千五百〇九点三
         *   utils.formartToZh("1234567800056509.3","u")  //壹仟贰佰叁拾肆萬伍仟陆佰柒拾捌億零伍萬陆仟伍佰零玖点叁
         *   utils.formartToZh("-1234567800056509.3","u")  //-壹仟贰佰叁拾肆萬伍仟陆佰柒拾捌億零伍萬陆仟伍佰零玖点叁
         *
         *   utils.formartToZh("2014","ly");  //二〇一四
         *   utils.formartToZh("10","ld");  //十
         *   utils.formartToZh("11","ld");  //十一
         *   utils.formartToZh("20","ld");  //二十
         *   utils.formartToZh("2014","uy");  //贰零壹肆
         *   utils.formartToZh("10","ud");  //拾
         *   utils.formartToZh("21","ud");  //贰拾壹
         *
         * @param {Number} num
         * @param {String} u  "u"表示转换成中文大写，否则("l")表示转换成中文小写;
         第2位(如果有) m表示金额,y表示年份（2014拼读“二〇一四”）,d表示月/日（10拼读“十”）
         * @param {Boolean} [dot=undefined] 表示有无小数部分，true表示纯小数，false表示纯整数，undefined表示不确定
         * @return {String} 中文数字
         */
        formartToZh: function (num, u, dot) {

            function __isUpper(u) {
                return u = u.toLowerCase().startsWith("u");
            }

            function __isMoney(u) {
                return u.toLowerCase().endsWith("m");
            }

            function __isYear(u) {
                return u.toLowerCase().endsWith("y");
            }

            function __isDay(u) {
                return u.toLowerCase().endsWith("d");
            }

            function __toChNum(num, chDigits) {
                num = "" + num;
                for (var l = num.length, r = "", i = 0; i < l; i++) {
                    r += chDigits[num.charAt(i)];
                }
                return r;
            }

            function __toChJfl(num, chDigits) { //角分厘
                num = num.substring(0, 3);

                for (var d, r = "", i = 0, len = num.length; i < len; i++) {
                    d = +num[i];
                    r += chDigits[d] + (d == 0 ? "" : (cst.CHINESE_CURRENCY[i + 2]) );
                }
                return r;
            }

            function __makeGrp4(num) {
                var group4 = []; //4维组，每4位组成1组，从低位开始
                for (var g = "", i = num.length, c = 1; i--; c++) {
                    g = num[i] + g;
                    if (c % 4 == 0 || i == 0) {
                        group4.push(g);
                        g = "";
                    }
                }
                return group4;
            }

            //拼读4维组，如1234读作一千二百三十四, 1020读作一千〇二十
            function __spellGrp4(num, chDigits) {

                for (var d, r = "", len = num.length, i = 0; i < len; i++) {
                    d = +num[i];
                    if (isYear) {
                        r += chDigits[d];
                    } else if (isDay) {
                        r += (d > 1 || i == len - 1 ? chDigits[d] : "") + ( d == 0 ? "" : ( i < len - 1 ? chDigits[9 + len - i - 1] : "") );
                    } else {
                        r += chDigits[d] + ( d == 0 ? "" : ( i < len - 1 ? chDigits[9 + len - i - 1] : "") );
                    }

                }
                return r;
            }

            var di = "", //整数部分
                dd = "", //小数部分
                toUpper = __isUpper(u),
                isMoney = __isMoney(u),
                isYear = __isYear(u),
                isDay = __isDay(u),
                currency;
            if (isMoney) {
                currency = toUpper ? cst.CHINESE_CURRENCY[0] : cst.CHINESE_CURRENCY[1];
            }
            num = ("" + num).trim();

            if (dot !== true && dot !== false) {
                num = num.split(".");
                var sign = "";
                if (num[0] && num[0] != "") {
                    if (num[0].startsWith("-") || num[0].startsWith("+")) {
                        sign = num[0].substring(0, 1);
                        num[0] = num[0].from(1);
                    }
                    di = this.formartToZh(num[0], u, false);
                }
                if (num[1] && num[1] != "") {
                    dd = (!isMoney ? "点" : "") + this.formartToZh(num[1], u, true);
                }
                return sign + (!isMoney ? (di + dd) : (di + currency + (dd == "" ? "整" : dd) ));
            } else {
                var chDigits = toUpper ? cst.CHINESE_U_NUMBER : cst.CHINESE_L_NUMBER;
                var zero = chDigits[0];
                if (dot === false) {//整数部分
                    var g4 = __makeGrp4(num); //4维组，每4位组成1组，从低位开始
                    for (var d4, i = 0, len = g4.length; i < len; i++) {
                        d4 = __spellGrp4(g4[i], chDigits);
                        d4 = this.removeZero(d4, zero);
                        if (i > 0) d4 += chDigits[12 + i];
                        di = d4 + di;
                    }
                    return di;
                } else if (dot === true) {//小数部分
                    dd = !isMoney ? __toChNum(num, chDigits) : __toChJfl(num, chDigits);
                    if (isMoney) dd = this.removeZero(dd, zero);
                    return dd;
                }
            }

        },
        /**
         * 获取浏览器URL中传入的参数,包括#和?后跟随的参数，如果没有该参数或者该参数没有定义值，则返回undefined。
         * <p>此方法有瑕疵（当存在#参数时）（已经修正）
         * 注意与utils.getArguments的区别。
         * 如果一次要获取多个参数，不建议使用该方法，而使用utils.getArguments。
         * </p>
         * @example
         *  var url = "http://ip:port/example.html?arg1=123&arg2=456#arg3=789#arg4";
         *  var arg1 = utils.getArgments("arg1"); //arg1 = 123
         *  var arg2 = utils.getArgments(url,"arg2"); //arg2 = 456
         *  var arg3 = utils.getArgments(url,"arg3"); //arg3 = 789
         *  var arg4 = utils.getArgments(url,"arg4"); //arg4 = undefined
         *  var arg5 = utils.getArgments(url,"arg5"); //arg5 = undefined
         *
         * @param {String} url URL串
         * @param {String} argName 参数名称,不区分大小写
         * @return {String}  url中指定参数名称的值,如果没有该参数，则返回undefined
         * @date 2015.8.2
         */
        getArguments: function (url, argName) {
            if (arguments.length === 1) {
                argName = url;
                url = location.href;
            }

            //以上方法无法处理如果参数中存在#号的情况
            var reg = new RegExp("(^|\\?|&|#)" + argName + "=([^&]*)(\\s|&|$)", "ig");
            //url = this.decodeSearch(url);
            if (reg.test(url)) {
                var ret = unescape(RegExp.$2.replace(/\+/g, " ")),
                    p = ret.indexOf("#");
                if (p > -1) {
                    ret = ret.substring(0, p);
                }
                return ret;
            }
        },

        /**
         * 获取url的所有参数(Object)
         * @example
         var url1 = "abc.com/index.html?A=123&b=456#c=789";
         var url2 = "abc.com/index.html?a=123&b=456#c=789#d=000";
         var url3 = "abc.com/index.html?a=123&b=456#c=789#d";
         utils.getArguments(url1);//{A: "123", b: "456", c: "789", url: "abc.com/index.html"}
         utils.getArguments(url1,true);//{a: "123", b: "456", c: "789", url: "abc.com/index.html"}
         utils.getArguments(true);//{a: "123", b: "456", c: "789", url: "abc.com/index.html"},如果location.href=url1
         utils.getArguments( );//{A: "123", b: "456", c: "789", url: "abc.com/index.html"},如果location.href=url1
         utils.getArguments(url2);//{a: "123", b: "456", c: "789", d:"000" ,url: "abc.com/index.html"}
         utils.getArguments(url3);//{a: "123", b: "456", c: "789", d:undefined ,url: "abc.com/index.html"}
         *
         *  @param {String} [url=location.href] URL格式字符串
         *  @param {Boolean} [argName2Lower=false] ，结果对象中参数名是否转化为小写
         *  @return {Object} 以参数为键值的对象，包含url,其值为去掉参数(?前)的字符串
         *  @modify urlSplit[1].replace("#","&").split("&") 修正为 urlSplit[1].split(/[#&]/)
         */
        getAllArgument: function (url,argName2Lower) {
            var argObj = {};
            if(url === null){ return argObj };

            if (arguments.length === 0) {
                url = location.href;
            }else if (arguments.length === 1 && typeof url == "boolean") {
                argName2Lower = url;
                url = location.href;
            }else if( typeof url == "object" && typeof url.href =="string"){
                url = url.href;
            }
            argName2Lower = !!argName2Lower;

            if(url==null || url === ""){ return argObj;}

            var urlSplit = url.split("?");
            if (urlSplit.length > 1) {
                urlSplit[1] = this.decodeSearch(urlSplit[1]);
                var args = urlSplit[1].split(/[#&]/);
                for (var i = 0; i < args.length; i++) {
                    var arg = args[i].split("=");
                    if(argName2Lower){
                        arg[0] = arg[0].toLowerCase();
                    }
                    argObj[arg[0]] = arg[1];
                }
            }
            argObj.url=urlSplit[0];
            return argObj;
        },
        /**
         * 在url中增加参数
         * @param {string} url url字符串，可能包含? #
         * @param {string|object} name 参数名,如果是对象类型，表示参数map,且后面的val表示是否放最后
         * @param {string} val 参数值
         * @param {boolean} [atLast=true] 是否放最后,false表示放最前面，true表示放最后面
         * @return {string} 增加了参数后的URL串
         * @author yangenyi@ygsoft.com
         * @date 2014-10-11
         */
        addArguments: function(url,name,val,atLast){
            var p1 = url.indexOf("?"),
                path,
                params="";
            if(p1 > -1){
                path = url.substring(0,p1);
                url = url.substring(p1+1);
            }
            if(typeof name === "object"){
                params = $.param(name);
                atLast = val;
            }else{
                params = name + "=" + val;
            }
            if(atLast != null && !atLast){
                url = params+"&"+url;
            }else{
                var p2 = url.indexOf("#");
                if(p2 > -1){
                    url = url.substring(0,p2) +"&"+ params + url.substring(p2);
                }else{
                    url = url +"&"+ params;
                }
            }
            url = (p1>-1 ? (path+"?") : "")+ url;
            return url;
        },
        /**
         * 判断是否为空
         * @param str
         * @returns {boolean}
         */
        isNullOrEmpty: function (str) {
            return str == undefined || str == null || str == "" || str.length == 0;
        },
        /**
         * 递归判断目标或目标的属性为非空.
         * <p>
         *   将undefined,null,空串,空数组[],空对象{}认为是空,其他则认为非空.
         *
         * 给定条件
         * @example
         * var obj = { "a": "1", "b": "", "c": null, "d": [], "e":{"f": ['a','b',""] } },
         *     s1 = '  ',
         *     s2,
         *     o1 = {},
         *     a1 =[];
         *
         * @example 1
         *   !utils.BaseUtil.notEmpty(s1);	//true
         *   !utils.BaseUtil.notEmpty(s2);	//true
         *   !utils.BaseUtil.notEmpty(o1);	//true
         *   !utils.BaseUtil.notEmpty(a1);	//true
         *
         * @example 2
         * 	 utils.BaseUtil.notEmpty(obj);	//true
         *   utils.BaseUtil.notEmpty(obj,'a');	//true
         *   utils.BaseUtil.notEmpty(obj,'b');	//false
         *   utils.BaseUtil.notEmpty(obj,'c');	//false
         *   utils.BaseUtil.notEmpty(obj,'d');	//false,[]为空
         *
         * @example 3
         *  utils.BaseUtil.notEmpty(obj,'e.f');	//true,{f:['a','b','']}不空
         *  utils.BaseUtil.notEmpty(obj,'e.f.1');	//true,'b'不空
         *  utils.BaseUtil.notEmpty(obj,'e.f.2');	//false, ''为空
         *
         *</p>
         *
         * @param {Object} target 目标
         * @param {String} a 用.分表示的属性
         * @returns {Boolean} 非空true,空false
         *
         * @author yangwenyi
         * @version 1.0
         * @date 2014-4-25
         * utils.base
         */
        notEmpty: function(target,a){
            //当o是undefined或者null或者"" 时返回false,
            if( target == null || target === "" ){
                return false;
            }
            var to = typeof target;
            var _this = this;
            switch (to){
                case  "string":
                    //当o是字符串时,去首尾空（' ','\r','\n','\t'）后，结果为空串则认为是空
                    if(target.replace(/^\s+|\s+$/,"") === ""){
                        return false;
                    }
                    break;
                case "object":
                    //当o是数组/对象,并且有元素
                function __notEmpty(o,a){
                    if( a == null || a === ""){
                        //没有属性参数a,结束判断，并返回true(不空)
                        return true;
                    }else{
                        //有属性参数a, 继续递归判断

                        function __cut(src,sep,index,callback){
                            var ret;
                            //当src为空时返回null
                            if( src == null){
                                ret = null;
                            }else if( src == "" || ( sep == null || sep == "") ){
                                //当src为空串时，或者sep为空时返回[src]
                                ret = [src];
                            }else{
                                var ret = src.split(sep);
                                if( !(  index == null || index == 0 ) ){
                                    //非贪婪模式下,只分割到第index个分隔符
                                    var aa = ret.splice(index,ret.length);
                                    ret = [ret.join(sep),aa.join(sep)];
                                }
                                //贪婪模式下,各个分割
                            }
                            //对返回结果做进一步处理
                            if( !!ret && typeof callback === "function"){
                                ret = callback(ret);
                            }
                            return ret;
                        }

                        var aa = __cut(a ,'.' ,1),
                            k1 = aa[0],
                            k2 = aa[1],
                            p1 = k1.indexOf("("),
                            p2 = k1.indexOf(")"),
                            _target;

                        if(p1 <0 && p2 <0) {
                            _target = o[k1];
                        }else  if(p1 >=0 && p2 >=0){//函数
                            var args = k1.substring(p1+1,p2);
                            k1 = k1.substring(0,p1);
                            _target = eval( 'o["'+k1+'"]('+args+')' );
                        }else{
                            throw new Error("表达式错误："+a);
                        }
                        return _this.notEmpty(_target,k2);
                    }
                };
                    if(target instanceof Array){
                        //当o是数组,但没有元素，认为是空
                        if(target.length == 0){
                            return false;
                        }else{
                            return __notEmpty(target,a);
                        }
                    }else{
                        //当o是对象
                        for(var k in target){
                            return  __notEmpty(target,a);
                        }
                        //没有任何元素，认为是空
                        return false;
                    }
                    break;
            }
            return true;
        },
        /**
         * 深度克隆对象
         * @example
         *   var aa= {a:1,b:2,c:{cc:123},fn:function(){alert(this.c.cc);}};
         *   var  bb=utils.BaseUtil.clone(aa); // bb={a:1,b:2,c:{cc:123},fn:function(){alert(this.c.cc);},toString:function(){native},valueOf:function(){native}}
         *
         * @param {Object}  target 被克隆的对象
         * @return {Object} target的克隆对象
         * @author yangwenyi@ygsoft.com
         * @date 2014.8.6
         */
        clone: function (target) {
            var objClone;
            if (target){
                if (target.constructor == Object || target.constructor == Array) {
                    objClone = new target.constructor();
                } else {
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
        /**
         * 一个对象的属性覆盖到另外一个对象的同名属性上.
         *<p>
         * 对于基础数据类型，这个方法相当于$.extend(base,opt)，但是对于引用类型，这个方法不会整个对象直接覆盖
         * 导致base里在opt中没有的字段丢失。另外，这个方法不处理数组叠加的情况，遇到数组将直接忽略opt中的内容.
         *</p>
         *@example
         * require("ecp.utils",function(utils){
         *  var aa={a:1,b:2};
         *  utils.override(aa,{c:2,d:{e:1}}); //aa = {a: 1, b: 2, c: 2, d:{e:1}}
         *  utils.override(aa,{c:3,d:{e:2}}); //aa = {a: 1, b: 2, c: 3, d:{e:2}}
         *  utils.override(aa,{c:3,d:4});     //aa = {a: 1, b: 2, c: 3, d:4}
         *  utils.override(aa,{c:5,d:{e:2}});  //aa = {a: 1, b: 2, c: 5, d:4}
         * });
         *
         * @param {Object} base 原对象，被income叠加
         * @param {Object} opt 把自身的数据叠加到base对象上
         * @return {Object}
         * @author yangwenyi@ygsoft.com
         * @date 2014.8.6
         */
        override : function (base, opt) {
            if(base == undefined ) {
                return opt;
            }
            for (var i in opt) {
                if ($.isPlainObject(opt[i])) {
                    if (!base[i]) {
                        base[i] = {};
                    }
                    arguments.callee(base[i], opt[i]);
                } else {
                    base[i] = opt[i];
                }
            }
            return base;
        },
        /**
         * 获取字符串的哈希值
         * @param  {String} str 求HashCode的字符串
         * @param  {Boolean} [caseSensitive=false] 是否大小写敏感
         * @return {Number} 字符串的哈希值
         */
        getHashCode: function (str, caseSensitive) {
            if (str){
                if (!caseSensitive) {
                    str = str.toLowerCase();
                }
                var hash = 1315423911, //0x4E67C6A7
                    i, ch;
                for (i = str.length - 1; i >= 0; i--) {
                    ch = str.charCodeAt(i);
                    hash ^= ((hash << 5) + ch + (hash >> 2));
                }
            }
            return (hash & 0x7FFFFFFF);
        },
        /**
         * 测试函数的性能
         * <p>通过执行指定次数的函数所用的时间进行分析。其中第三个参数之后可作为测试函数的参数。</p>
         * @example
         * #执行函数abc()10000次所用的时间
         function fn(a){var b = (a+10)*this.N;};
         var t = utils.BaseUtil.speedTest(fn,10000000,{N: 2},5);//t ->400
         *
         * @example
         *  //执行数组函数delAllRepeat()10000次所用的时间
         *  var abc = [2,3,1,{a:32}];
         *  var time =utils.BaseUtil.speedTest(Array.prototype.delAllRepeat,10000,abc,false);//结果10024ms
         *
         * @param {Function} fn 要执行的函数名称
         * @param {Number} count 执行的次数
         * @param {object} context 函数上下文
         * @return {Number} 执行函数所用时间的毫秒数
         *
         * @author zhengxianwei@ygsoft.com
         * @version 1.0
         * @date 2014-07-04
         */
        speedTest : function(fn ,count ,context){
            if(!$.isFunction(fn)){return;}
            if(typeof(count) !== "number" || count <= 0){ return;}
            var args = Array.prototype.slice.call(arguments ,3);
            var startTime = new Date().getTime();
            for(var i = 0; i < count; i++){
                fn.apply(context ,args);
            }
            var endTime = new Date().getTime();
            return endTime - startTime;
        },
        formatEcpDate : function(str, fmt){
            var reg = /\d+/;
            if (str === "" || str === null || str === undefined) {
                return this.formatDate(new Date(), fmt);
            }
            var t = str.match(reg)[0];
            return this.formatDate(new Date(parseInt(t, 10)), fmt);;
        },
        /**
         * 数字转千分位.
         * @param
         */
        formatNumber : function (s, n) {
            n = n >= 0 && n <= 20 ? n: 2;
            s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
            if (s != '' && !isNaN(s)) {
                re = /(\d{1,3})(?=(\d{3})+(?:$|\.))/g;
                s = s.replace(re, "$1,");
            }
            return s;
        },
        setCookie:function(name, value) {
            var exp = new Date();
            document.cookie = name+"="+value;
        },
        /**
         * 获取kookie.
         */
        getCookie: function(name){
            var ss = "";
            var cookies = document.cookie.split(";")
            for(var i=0;i<cookies.length;i++){
                if(cookies[i] && cookies[i].indexOf(name+"=")!=-1){
                    ss = cookies[i].split("=");
                    if(ss instanceof Array && ss.length > 0) {
                        ss = ss[1];
                    }
                    break;
                }
            }
            return ss;
        },
        /**
         * 获取ecp类型.
         */
        getLanguage:function() {
            return this.getCookie("ecp_locale");
        },
        /**
         * 将 Date 转化为指定格式的String
         * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
         * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
         * 例子： formatDate(new Date(),"yyyy-MM-dd hh:mm:ss")
         */
        formatDate : function(date, fmt) {
            if(typeof date === "string") {
                date = new Date(date);
            }
            if(fmt == null) {
                var cy = date.getFullYear();
                var cm = date.getMonth();
                var cd = date.getDate();
                var lan = this.getLanguage();
                if(/en-us/.test(lan)) {
                    var cms = ['Jan', 'Feb','Mar','Apr','May','Jun', 'Jul','Aug','Sep', 'Oct','Nov', 'Dec'];
                    cm = cms[cm];
                    return cm + " " + cd + "," + cy;
                } else {
                    return cy + "年" + (cm + 1) + "月" + cd + "日"
                }
            } else {
                var o = {
                    "M+" : date.getMonth()+1,                 //月份
                    "d+" : date.getDate(),                    //日
                    "h+" : date.getHours(),                   //小时
                    "m+" : date.getMinutes(),                 //分
                    "s+" : date.getSeconds(),                 //秒
                    "q+" : Math.floor((date.getMonth()+3)/3), //季度
                    "S"  : date.getMilliseconds()             //毫秒
                };
                if(/(y+)/.test(fmt))
                    fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
                for(var k in o)
                    if(new RegExp("("+ k +")").test(fmt))
                        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
                return fmt;
            }
        },
        /**
         * 把字符串转成JSON格式日期（2012-02-03 转成 /Date(1328198400000+0800)/）
         */
        parseEcpDate:function(date) {
        	//IE浏览器Date对象不支持毫秒构造对象
        	//"2010-09-10 00:00:00.000"
        	var index = date.lastIndexOf(".000")
    		if(index !== -1){
    			date = date.substring(0, index);
    		}
            var dateStr = +new Date(date.replace(/\-/g,"/"));
            return '/Date(' + dateStr + '+0800)/';
        },
        /**
         * 判断校验是否为ECP日期格式
         */
        isEcpDate:function(date){
            if(!this.notEmpty(date) || typeof(date) !== "string"){
                return false;
            }
            var reg = /^(\/Date\(){1}[0-9]+(\+0800\)\/)/;
            return reg.test(date);
        },
        /**
         * 将string转换成日期
         */
        strToTime: function (str, showSecond) {
            if (str === undefined || str ===null || str ==="") {
                return "";
            }
            str = this.parseDate(str);
            var d = !isNaN(str) ? new Date(+str) : new Date(),
                hours = d.getHours(),
                minutes = d.getMinutes(),
                seconds = d.getSeconds();
            return (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + (showSecond ? ":" + (seconds < 10 ? "0" + seconds : seconds) : "")
        },
        /**
         * 对传入的时间毫秒数转换成日期格式 2000-01-01
         * @param {String} str 要转换的日期字符串
         * @param {Boolean} showTime 显示时间 ，小时和分
         * @param {String}  showType 显示类型，Y表示年，M和S表示月，X表示旬
         * @param {Boolean} showSeconds 显示秒
         */
        strToDate: function (str, showTime, showType,showSeconds) {
            if (str === undefined || str ===null || str ==="") {
                return "";
            }
            str = this.parseDate(str);
            var d = !isNaN(str) ? new Date(+str) : new Date(),
                month = d.getMonth() + 1,
                year = d.getFullYear(),
                day = d.getDate(),
                hours = d.getHours(),
                minutes = d.getMinutes(),
                seconds = d.getSeconds(),
                time = (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes);
          //服务器和客户端时区不一样时d.getDate拿的不对
            var tzos = new Date().getTimezoneOffset()* 60 * 1000;
			if(tzos > 0){
				if(Math.abs(day - d.getUTCDate()) > 1){
					month += 1;
				}
				day = d.getUTCDate();
			}
            if(showSeconds) {
                time += ":" + (seconds < 10 ? "0" + seconds : seconds);
            }
            switch(showType) {
                case "Y" :
                    return year;
                case "M" : case "S" :
                return year + "-" + (month < 10 ? "0" + month : month);
                case "X" :
                    return year + "-" + (month < 10 ? "0" + month : month) + "-" + DATE_XUN[day];
            }
            return year + "-" + (month < 10 ? "0" + month : month) + "-" + (day < 10 ? "0" + day : day) + (showTime ? " " + time : "");
        },
        /**
         * 把JSON格式转成日期.
         * /Date(1328198400000+0800) to Date
         */
        jsonStrToDate:function(date) {
            if (utils.isNullOrEmpty(date)) {
                return "";
            }

            var longtime = date.split("(")[1].split("+")[0];
            var result = new Date();
            result.setTime(longtime);
            return result;
        },
        /**
         * 对字符串进行格式转换，返回毫秒数。 如果字符串是数值，则返回本身，若格式不符合要求，则返回当前日期。
         *
         * @param {String} str 需转换的字符串
         * @param {RegExp} [reg] 正则转换格式
         *@return {Number} 1970-1-1 0:0:0以来的毫秒数
         */
        parseDate: function(str, reg){
            if(str === "" || str === null || str === undefined){
                return +new Date();
            }
            //modify by yinshanpeng on 2014.8.14 F568330
            if(typeof str === "number" || $.type(str) === "date"){
                return +str;
            }
            if (typeof str === "string"){
                var dt = this.invalidDate(str);
                if(typeof dt === "string") {
                    return +new Date(dt);
                }
            }
            var d = this.strToTimeMillis(str);
            // 判断字符串是否为数值
            if (!isNaN(d)){
                return d;
            }
            var reg = reg ? reg : /\b\((\-*\d*)\+\b/,
                arr = str.toString().match(reg);
            return arr ? arr[1] : +new Date();
        },
        /**
         * 校验是否是无效的日期格式,并返回true或有效的日期格式字符串
         * <p>
         *   以下格式被认为是一个有效的日期字符串 ：
         *     1. dateStr 的值为 "2011" ;
         *     2. dateStr 的值为 "201101";
         *     3. dateStr 的值为 "20110101"
         *   可被认为是日期字符串的长度只可能为 ： 4 ，6 ，8 .
         *   传入其他非数值字符串或其他长度数值字符串和字符串中存在非数值字符都将返回 true;
         *   传入被认为合法的日期字符串将返回 "2014-08-14" 格式日期
         * </p>
         * @param {String} dateStr 日期字符串
         * @return {Boolean | String}
         * @example
         *  this.invalidDate("2010"); // return "2010-01-01"
         *  this.invalidDate("201010"); // return "2010-10-01"
         *  this.invalidDate("20101230"); // return "2010-12-30"
         *  this.invalidDate("201013"); // return true
         *  this.invalidDate("20101233"); // return true
         *  this.invalidDate("2064454545"); // return true（长度大于8）
         *  this.invalidDate("2010123"); // return true (长度为 4--8 之间的奇数)
         *  this.invalidDate("code"); // return true
         *  this.invalidDate("2hello"); // return true
         * @author yinshanpeng@ygsoft.com
         * @date 2014.8.13
         */
        invalidDate : function(dateStr) {
            var ds = dateStr.replace(/^(\d{4})(\d{2})?(\d{2})?$/g, function(){
                var y = RegExp.$1,
                    m = RegExp.$2,
                    d = RegExp.$3;

                return   y + "-" + (m ? m : "01" ) + "-" + (d ? d : "01" );
            });

            var dt = new Date(ds);
            return (dt).valueOf().toString() === "NaN" ? true : ds;
        },
        /**
         * 将日期转为毫秒数，传入格式为"2001-01-01"或"2001/01/01"
         *@example
         *   utils.strToTimeMillis("2014-8-6 12:00:00"); //1407297600000
         *   utils.strToTimeMillis("2014");// 1388505600000 (2014-01-01)
         *   utils.strToTimeMillis("2014-1");// 1388505600000 (2014-01-01)
         *   utils.strToTimeMillis("2014-1-01");// 1388505600000 (2014-01-01)
         *
         * @param {String}  str  日期字符串
         * @return {Number} 日期对应的毫秒数
         */
        strToTimeMillis : function(str){
            if(!str){
                return 0;
            }else if(str.indexOf(".")!==-1){
                //此方法不支持毫秒，去掉毫秒部分
                str = str.substring(0,str.indexOf("."));
            }
            return +new Date(this.formatDate(str,"yyyy/MM/dd"));
        },
        /**
		 * 调用com+控件.
		 * @param {string} name 传处com+的ole字符串，如'AutoUpdate.WebUpdate'(包括对象+接口) 或 应用程序如 FT_reg.exe,当执行exe时，默认只运行与dllAdapter.dll同目录的exe文件
		 * @param {string} method 方法名 如果是运行exe文件，可传入空
		 * @param {Array} params 传入参数数组，可不传
		 * @param {Array} property 传入属性数组格式[{name:'p1',value:'v1'},{name:'p2', value:'v2'}] 可不传
		 * @param {Boolean} ret 是否需要返回值 可不传，默认是true
		 * @param {string} 可传入类型 type如 dll, exe等，建议不传，目前默认解析dll和exe，
		 * @example 
		 *    var res = utils.activeInvoke('AutoUpdate.WebUpdate','GetMudVersion', [], []);
		 *    utils.activeInvoke('FT_reg.exe');
		 */
		activeInvoke:function(name, method, params, property, ret, type) {
		      var str = 'name:' + name + '\n';
		      if(method !== '') {
		        str += 'method:'  + method + '\n';
		      }
		      //解析参数
		      if(params instanceof Array && params.length > 0) {
		          var len = params.length;          
		          for(var i = 0; i < len; i++) {
		              str += 'params:';
		              var tp = typeof params[i];
		              if(tp  === 'number') {
		                  str += 'number\n';
		              } else if (tp === 'boolean') {
		                  str += 'boolean\n';
		              } else if (/^[0-9]+\-[0-9]+\-[0-9]+ [0-9]+:[0-9]+:[0-9]+(.[0-9]+)?$/.test(params[i])) {
		                  str += 'datetime\n';
		              } else if (/^[0-9]+\-[0-9]+\-[0-9]+$/.test(params[i])) {
		                  str += 'datetime\n';
		              } else {
		                  str += 'string\n'
		              }
		              str += params[i] + "\n";
		          }
		      }   
		      //解析属性   
		      if(property instanceof Array && property.length > 0) {
		          var len = property.length;          
		          for(var i = 0; i < len; i++) {
		              str += 'property:';               
		              str += property[i].name;  
		              var tp = typeof property[i].value;
		              if(tp  === 'number') {
		                  str += ':number\n';
		              } else if (tp === 'boolean') {
		                  str += ':boolean\n';
		              } else {
		                  str += ':string\n';
		              }
		              str += property[i].value + '\n';          
		          }
		      }
		      if(ret != false) {
		          str += 'return:true\n';
		      }
		      if(type !== '' && type != null) {
		          str = 'type:' + type + '\n' + str;
		      }
		      str += '\0';
		      //创建npapi的对象
		      var dllToolObj = this.getObj();
		      var res = dllToolObj.caller(str);
		      dllToolObj = null;
		      return res;
		},
        /**
         * 获取IE版本.
         */
        getIEVersion : function(){
            var ua = navigator.userAgent.toLowerCase();
            var msie = parseInt((/msie (\d+)/.exec(ua) || [])[1],10);
            if (isNaN(msie)) {
                msie = parseInt((/trident\/.*; rv:(\d+)/.exec(ua) || [])[1],10);
            }
            return msie;
        },
        /**
		 * 创建dlltool对象.
		 */
		getObj : function() {
			var dllToolObj = null;
			if (/msie/i.test(window.navigator.appVersion) === false) {
				dllToolObj = document.getElementById("dlltool");
				if(dllToolObj == null) {
					dllToolObj = document.createElement("embed");
				}
				dllToolObj.id = "dlltool";
				dllToolObj.type = "application/rpygtooljs";
				dllToolObj.width = 1;
				dllToolObj.height = 1;
				
				var ddd = document.getElementsByTagName("BODY");
				var hdiv = document.createElement("DIV");
				hdiv.style.position = "absolute";
				hdiv.style.top = "0px";
				hdiv.style.left = "0px";
				hdiv.style.width = "1px";
				hdiv.style.height = "1px";
				hdiv.style.overflow = "hidden";
				ddd[0].appendChild(hdiv);
				hdiv.appendChild(dllToolObj);
			} else {
				dllToolObj = new ActiveXObject('dllAdapter.dllAdapter');
				dllToolObj.utf8 = 0;
			}
			return dllToolObj;
		},
		/**
		 * 运行cmd命令
		 */
		runExe : function (fieldName, params) {
		    if(params == null){
		        params = "";
		    }
		    var obj = this.getObj();
		    obj.runExe(fieldName + "\0", params + "\0");
		},
        /**
         * 通过A标签，打开IE窗口.
         */
        openWindowInIE : function(url) {
            if (!this.isIE()) {
        		var isGcf = this.getArguments(url, "gcf");
        		//chromeframe模式打开url
        		if (window.externalHost || isGcf) {
        			try {
        				var topDoc = window.document;
        		    	var tagA = topDoc.createElement("a");
        		    	tagA.id = "ecp_chrome_open_in_ie";
        		    	tagA.style.display = "none";
        		    	tagA.setAttribute("rel","noreferrer");
        		    	topDoc.body.appendChild(tagA);
        		    	tagA.setAttribute("target","_blank");
        		    	tagA.setAttribute("href",url);
        		    	tagA.click();
        		    	topDoc.body.removeChild(tagA);
        			} catch(e) {
        				this.notify("跨域访问错误。");
        				window.console && console.error("跨域访问错误。")
        			}
            	} else {
            		try {
            			if (!url.startsWith("http://")) {
            				if (url.startsWith("/")) {
            					url = location.protocol + "//" + location.host + url;
            				} else {
            					url = location.protocol + "//" + location.host + "/" + url;
            				}
            			}
            			this.runExe("iexplore.exe",url);
            		} catch(e) {
            			this.notify("未注册npygtool插件。");
            		}
            	}
        	}else{
				var tagA = window.document.createElement("a");
				tagA.id = "ecp_chrome_open_in_ie";
				tagA.style.display = "none";
				tagA.setAttribute("rel","noreferrer");
				document.body.appendChild(tagA);
				tagA.setAttribute("target","_blank");
				tagA.setAttribute("href",url);
				tagA.click();
				document.body.removeChild(tagA);
        	}
        },

        /**
         * 自动消失提醒
         * @example 1
         * 		utils.notify("保存成功。");
         * @example 2
         * 		utils.notify({
         * 			message:"保存成功。",
         * 			delay:3000,//延迟3秒关闭
         * 			container:"#divDemo" //在id为divDemo的容器中显示
         * 		});
         * @param {String | Object} message 消息参数，可以是字符串，也可以是对象.
         * 			如果为object时有三个属性：delay（延迟时间，单位微秒）、container（容器）、message（要提示的内容）
         * @return void;
         */
        notify : function (message) {
            if($(".alert.alert-info").length !== 0 && notifyMsgEle && notifyMsgEle.$ele && notifyMsgEle.$ele.length !== 0){
                var span = notifyMsgEle.$ele.find("span"),
                	_msg = typeof(message) ==="object" ? message.message : message,
                	divid = "notifyMsgEle13676010686",
                	$div = $("#"+divid);
                if($div.length === 0){
                	$("body").append("<div id='"+divid+"' style='display:none;'>");
                	$div = $("#"+divid);
                }
                $div.html(_msg);
                if(span && span.length !== 0 && span.text() === $div.text()){
                    return;
                }
            }
            var delay,container,msg;
            if(typeof(message) === "object"){
                delay = message.delay;
                container = message.container;
                msg = message.message;
            }
            if(typeof(message) === "string"){
                msg = message;
            }
            delay = delay || 5000;
            container = container || 'body';

            notifyMsgEle = $.notify({
                icon: 'glyphicon glyphicon-warning-sign',
                message: msg
            },{
                element: container,
                position: null,
                type: "info",
                allow_dismiss: true,
                newest_on_top: false,
                placement: {from: "top", align: "right"},
                offset: { x: 30,y: 30},
                spacing: 10,
                z_index: 999999,
                delay: delay,
                timer: 1000,
                url_target: '_blank',
                mouse_over: "pause",
                animate: {enter: 'animated fadeInDown', exit: 'animated fadeOutUp'},
                onShow: null,
                onShown: null,
                onClose: null,
                onClosed: null,
                icon_type: 'class',
                template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">' +
                '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
                '<span data-notify="message">{2}</span>' +
                '</div>'
            });
        },

        /**
         * 获取剪切板的内容，兼容IE和firefox等浏览器
         * @return str 剪贴板的内容
         */
        doGetClipboard : function() {

            try {
                var temp = window;
                if (window.clipboardData) {
                    return window.clipboardData.getData("Text");
                } else if (window.netscape) {
                    try {
                        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
                    } catch (ex) { }
                    var clip = Components.classes["@mozilla.org/widget/clipboard;1"].createInstance(Components.interfaces.nsIClipboard);
                    if (!clip) return;

                    var trans = Components.classes["@mozilla.org/widget/transferable;1"].createInstance(Components.interfaces.nsITransferable);
                    if (!trans) return;

                    trans.addDataFlavor("text/unicode");
                    clip.getData(trans, clip.kGlobalClipboard);
                    var str = new Object();
                    var len = new Object();
                    try {
                        trans.getTransferData("text/unicode", str, len);
                    }
                    catch (error) {
                        return null;
                    }
                }
                if (str) {
                    if (Components.interfaces.nsISupportsWString) {
                        str = str.value.QueryInterface(Components.interfaces.nsISupportsWString);
                    } else if (Components.interfaces.nsISupportsString) {
                        str = str.value.QueryInterface(Components.interfaces.nsISupportsString);
                    } else {
                        str = null;
                    }
                    if (str) {
                        return str.data.substring(0, len.value / 2);
                    }
                }
                return null;
            } catch (ex) {}
        },

        /**
         * 获得光标所在文本框中的位置
         * @param e 必选项，元素的事件名称
         * @return position 位置对象，由开始和结束位置组成
         */
        getCursorPosition : function (e) {

            var evt = e || window.event,
                obj = evt.srcElement || evt.target,
                v = obj.value,
                position = {},
                curStratPosition = -1,
                curEndPosition = -1;
            if (v == null || v.length === 0) {
                curStratPosition = 0;
                curEndPosition = 0;
            } else {
                if ($.browser.msie) {//IE
                    var rngSel = document.selection.createRange(),//建立选择域
                        rngTxt = obj.createTextRange(),//建立文本域
                        newText = rngSel.text,
                        flag = rngSel.getBookmark();//用选择域建立书签
                    rngTxt.collapse();//瓦解文本域到开始位,以便使标志位移动
                    rngTxt.moveToBookmark(flag);//使文本域移动到书签位
                    rngTxt.moveStart('character',-obj.value.length);//获得文本域左侧文本
                    curStratPosition = rngTxt.text.replace(/\r\n/g,'').length;//替换回车换行符
                    curEndPosition = curStratPosition - newText.length;
                } else {//非IE浏览器
                    curEndPosition = obj.selectionStart;
                    curStratPosition = obj.selectionEnd;
                }
            }
            position.start = curEndPosition;
            position.end = curStratPosition;

            return position;
        },

        /**
         * 设置光标所在文本框中的位置
         * @param o 必选项，dom元素对象
         * @param pos 必选项，光标位置，从0开始
         * @return void
         */
        setCursorPosition : function(o, pos) {//设置光标位置函数

            if (o.setSelectionRange) {
                o.focus();
                o.setSelectionRange(pos, pos);
            } else if (o.createTextRange) {
                var r = o.createTextRange();
                r.collapse(true);
                r.moveEnd('character', pos);
                r.moveStart('character', pos);
                r.select();
            }
        },

        /**
         * 获得截取的字符串，将字符串截取到指定长度字符，中文作为两个字符处理
         * @param v 要截取的字符串
         * @param len 要截取的字符长度
         * @return res 截取后的字符串
         */
        getSubstring : function(v,len) {

            if(v == null || v.length === 0)return;
            if(typeof len === "undefined" )return v;
            var _len=0,res="";
            for (var i=0,j=v.length; i<j; i++) {
                if (v.charCodeAt(i) > 256) {
                    _len += 2;
                } else {
                    _len ++;
                }
                if (_len > len) break;
                res += v.charAt(i);
            }
            return res;
        },

        /**
         * 颜色RGB转换成十六进制
         * @param rgb RGB格式的颜色表示
         * @return hexColor 返回十六进制的颜色表示
         */
        fromRGBToHex : function(rgb){

            var regexp = /^rgb\(([0-9]{0,3})\,\s([0-9]{0,3})\,\s([0-9]{0,3})\)/g,
                re = rgb.replace(regexp, "$1 $2 $3").split(" "),//利用正则表达式去掉多余的部分
                hexColor = "#",
                hex = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
            for (var i = 0; i < 3; i++) {
                var r = null,
                    c = re[i],
                    hexAr = [];
                while (c > 16) {
                    r = c % 16;
                    c = (c / 16) >> 0;
                    hexAr.push(hex[r]);
                }
                hexAr.push(hex[c]);
                hexColor += hexAr.reverse().join('');
            }

            return hexColor;
        },

        /**
         * 计算字符串中字符长度，中文表示2个字符
         * @param v 字符串的值
         * @return len 字符串长度
         */
        getCharsSize : function(v) {

            var len  = 0;
            if (typeof v !== "undefined" && $.trim(v).length !== 0) {
                for (i=0,j=v.length; i<j; i++) {
                    if (v.charCodeAt(i) > 256) {
                        len += 2;
                    } else {
                        len++;
                    }
                }
            }
            return len;
        },

        /**
         * 获得元素的HTML格式
         * @return 返回该元素的HTML格式
         */
        getOuterHtml : function(control){

            return $("<p>").append(control.eq(0).clone()).html();
        },

        /**
         * 浮点数精度处理
         * @param v 必选项，数值类型(Number)的值，不能为空
         * @return v或处理浮点精度的值
         */
        getFloatRoundVal : function(v) {

            if (typeof v === "undefined" || $.trim(v).length === 0) {
                return v;
            } else {
                return Math.round(v*10000000)/10000000;
            }
        },

        /**
         * 字符串调转位置即取反
         * @param v 必选项，要调转位置的字符串
         * @return res 返回调转位置后的字符串
         */
        stringReverse : function(v) {

            if (typeof v === "undefined" || $.trim(v).length === 0) return v;
            var res = "";
            for (var i=v.length-1; i>=0; i--) {
                res += v.charAt(i);
            }

            return res;
        },

        /**
         * 数组是否包含某值
         * @param array 数组
         * @param v 值
         */
        arrayContainVal : function(array,v){
            if(array == null || array.length === 0){
                return false;
            }
            for(var i=0,j=array.length; i<j; i++){
                if(array[i] == v){
                    return true;
                }
            }
            return false;
        },

        /**
         * @author zxw 20130815
         *
         * 判断是否为常用的数据类型，常用的数据类型有：字符串、数值、日期或大文本四种，不包括含实体的类型
         *
         */
        usualDataType : function(dataType){
            if(typeof dataType === "undefined" || $.trim(dataType).length === 0){return false;}
            dataType = dataType.toLowerCase();
            var udt = this.uDataType;
            for(var i=0,j=udt.length; i<j; i++){
                if(udt[i] == dataType){return true;}
            }
            return false;
        },

        /**
         * @author zxw 20130828
         *
         * 从属性字符串中获得属性数组
         *
         * @param attrStr 属性字符串
         */
        getAttrsFromAttrStr : function(attrStr){
            if(typeof attrStr === "undefined" || attrStr.length === 0){return;}
            var result=[],	attrMark=false,	attrEnd=false,	cStr="";
            for(var i=0,j=attrStr.length; i<j; i++){
                var c = attrStr.charAt(i);
                if($.trim(c).length != 0){
                    cStr += c;
                    if(c == "'" && attrEnd){
                        result[result.length] = cStr;
                        cStr = "";	attrMark = false;	attrEnd = false;
                    }else{		attrMark = true;	}
                    if(c == "'" && !attrEnd && attrMark){	attrEnd = true;	}
                }else{
                    if(attrMark){	cStr += c;	}
                }
            }
            return result;
        },
        /**
         * 设置和获取角标的显示数值
         * @param {Object} jqEle jquery对象
         * @param {Number} val 需要显示的值 可选
         * @return {Number} retVal 角标的值
         * @author wugang5
         */
        angleVal : function(jqEle,val){
            if(!jqEle && jqEle.length === 0){return;}
            if(arguments.length > 1){
                if($.isNumeric(val)){
                    if(val >= 100){
                        jqEle.attr("title",val).text("...");
                    } else {
                        jqEle.html(val);
                    }
                }
            } else {
                var _val = jqEle.attr("title") || jqEle.text(),
                    retVal = parseInt(_val,10);
                if($.isNumeric(retVal)){
                    return retVal;
                }
            }
        },
        /**
         * 判断是否为number类型
         * @param t
         * @returns {boolean}
         * @author wugang5@ygsoft.com
         */
        isNumber : function(t){
            //过滤NaN 和无穷大
            return typeof  t === 'number' && !isNaN(t) && isFinite(t);
        },
        /**
         * 设置dom元素的样式,jquery的css方法的代替方法。
         *
         * @example
         * utils.setDomCss($div,"color","green")
         *
         * @param {Object} $dom jquery对象
         * @param {String} cssName 样式名称
         * @param {String} val 样式值
         *
         */
        setDomCss : function($dom,cssName,val){
            if(!$dom || $dom.length === 0){return;}
            for(var i=0,j=$dom.length; i<j; i++){
                $dom[i].style[cssName] = val;
            }
        },
        /**
         * 删除一个或者多个dom节点，但不删除事件
         * @example
         *  utils.removeElement($("div"));
         * @param {Object|Array} elem jquery对象、dom对象或者数组
         */
        removeElement : function(elem){
            if(!elem){return;}
            var len = elem.length;
            if(!len && elem.parentNode){
                elem.parentNode.removeChild( elem );
            }else{
                var _elem;
                for(var i = 0; i<len; i++){
                    _elem = elem[i].parentNode;
                    if(_elem){
                        _elem.removeChild( elem[i] );
                    }
                }
            }
        },
        /**
         * 解密url参数
         * @param {String} url 参数部分被加密后的url
         * @return {String} 返回参数部分被解密后的url
         * @author yangenyi@ygsoft.com
         * @date 2014-10-11
         */
        decodeSearch: function(url){
            if(!(/^\s*_d\s*=|[?&]\s*_d\s*=/.test(url))){
                return url;
            }
            var  p = url.indexOf("?"),
                s = p >= 0 ? url.substring(p+1) : url,
                p1 = s.indexOf("_d"), //加密的查询串内容
                p2 =  s.indexOf("=",p1+2),
                p3 = s.indexOf("&",p2+1),
                _d=s;

            if(p3<0){
                p3 = s.indexOf("#",p2+1);
            }
            if( p1 >-1 && p2 >-1 ){
                _d = p3 < 0 ? s.substring(p2+1) : s.substring(p2+1,p3);
                //_d = unescape(_d);
                _d = _d.replace(/%3D/g,"=").replace(/%2B/g,"+").replace(/%2F/g,"/");
                _d = desUitls.decodeBase64(_d);
            }
            if(p >= 0){//说明?之前有uri内容
                _d = url.substring(0,p+1)+_d;
            }
            if(p3>0){ //说明_d参数后还有参数
                _d += s.substring(p3);
            }

            return _d;
        },
        /**
         * 加密URL参数,先对参数计算hash,附加于参数后(&_h=hash...),然后对新参数做base64编码，再对特殊的+/做encodeURI
         * @param {String} url 有?是完整的url,否则认为是参数部分
         * @return {String} 返回参数部分被加密后的url
         * @author yangenyi@ygsoft.com
         * @date 2014-10-11
         */
        encodeSearch: function(url){
            url = url.trim();
            var s,
                hc,
                _d,
                p = url.indexOf("?");
            s = p >= 0 ? url.substring(p+1) : url;

            hc = desUitls.hashCode(s);
            s = s+"&_h="+hc;
            _d = desUitls.encodeBase64(s);
            _d = _d.replace(/\=/g,"%3D").replace(/\+/g,"%2B").replace(/\//g,"%2F");
            _d = "_d=" +_d;
            if(p >= 0){	//说明_d参数后还有参数
                _d = url.substring(0,p+1)+_d;
            }
            return _d;
        },
        /**
         * 一个对象的属性覆盖到另外一个对象的同名属性上.
         *<p>
         * 对于基础数据类型，这个方法相当于$.extend(base,opt)，但是对于引用类型，这个方法不会整个对象直接覆盖
         * 导致base里在opt中没有的字段丢失。另外，这个方法不处理数组叠加的情况，遇到数组将直接忽略opt中的内容.
         *</p>
         *@example
         *  var aa={a:1,b:2};
         *  utils.cascading(aa,{c:2,d:{e:1}}); //aa = {a: 1, b: 2, c: 2, d:{e:1}}
         *  utils.cascading(aa,{c:3,d:{e:2}}); //aa = {a: 1, b: 2, c: 3, d:{e:2}}
         *  utils.cascading(aa,{c:3,d:4});     //aa = {a: 1, b: 2, c: 3, d:4}
         *  utils.cascading(aa,{c:5,d:{e:2}});  //aa = {a: 1, b: 2, c: 5, d:4}
         *
         * @param {Object} base 原对象，被income叠加
         * @param {Object} opt 把自身的数据叠加到base对象上
         * @return {Object}
         * @author yangwenyi@ygsoft.com
         * @date 2014.8.6
         */
        cascading: function (base, opt) {
            if(base == undefined ) {
                return opt;
            }
            for (var i in opt) {
                if ($.isPlainObject(opt[i])) {
                    if (!base[i]) {
                        base[i] = {};
                    }
                    arguments.callee(base[i], opt[i]);
                } else {
                    base[i] = opt[i];
                }
            }
            return base;
        },
        /**
         * 获取HTML标签的属性，如果匹配失败，返回undefined
         *@example
         *#体标签
         *  htmlCode='<a href="xxx.jsp">TEST</a>';
         *  utils.getHTMLAttribute(htmlCode,"a","href"); // xxx.jsp
         *#非体标签
         *  htmlCode='<input name="fullanme" />';
         *  utils.getHTMLAttribute(htmlCode,"input","name"); //fullanme

         * @param {String} htmlCode HTML的内容reibut
         * @param {String} tagName HTML标签的名称
         * @param {String} attrName HTML属性的名称
         * @return {String} 指定标签的指定属性的值
         * @author yangwenyi@ygsoft.com
         * @date 2014.8.6
         *@modify 修正一个bug，取非体标签的属性值返回undefined
         */
        getHTMLAttribute: function (htmlCode, tagName, attrName) {
            /*
             * 此段代码存在性能问题
             * if(tagName==="body"){ //对于body，jq有特殊处理
             tagName = "body1";
             htmlCode = htmlCode.replace(/body/gi,tagName);
             }
             return  $("<div>"+htmlCode+"</div>").find(tagName).attr(attrName);
             */

            /*
             * 原来代码多此一举，还有bug(当标签没有体时，取属性值全为undefined)
             * 加上/?基本修正 ,但依然有bug
             */
            var pattern = new RegExp("<" + tagName + "(\\s*\\w*?=[\"\'].+?[\"\'])*\\s*" + attrName + "=[\"\'](.*?)[\"\'](\\s*\\w*?=[\"\'].+?[\"\'])*\\s*/?>", "im");
            var matches = pattern.exec(htmlCode);
            return matches ? matches[2] : undefined;

        },
        /**
         * 一次性从字符串中获取指定标签的所有属性
         * @example
         var htmlCode = '<body VERSION="2.0"\r\n  code="../script/sourceChooseProjectPropSet.controler.js"\n  style="font-size: 12px; overflow: hidden;"> \n\r<div>\r\nabcd\r\n</div>\n\r</body>';
         var attrs = utils.getXMLAttributes(htmlCode,'body',true); //attrs 返回如下(注意version大小写)：
         {
           version: "2.0",
           code: "../script/sourceChooseProjectPropSet.controler.js",
           style: "font-size: 12px; overflow: hidden;"
         }

         * @param {String} htmlCode
         * @param {String} tagName
         * @param {Boolean} [name2Lower=false] 结果中的属性名是否转换成小写,默认不转换
         * @author yangwenyi@ygsoft.com
         * @date 2014.8.13
         */
        getXMLAttributes: function(htmlCode,tagName,name2Lower){
            var res1,
            //ps1 = "<" + tagName + "([\\s\\S]+)/?>";
                ps1 = "<" + tagName + "([^<]*)/?>";

            res1 = new RegExp(ps1,"im").exec(htmlCode);


            if(res1){
                res1 = res1[1];
                var attrName,
                    ret={},
                    res2,
                    ps2 = /\s+(['"]?)([\w\.]*)(\1)\s*=\s*((\w+)|((['])([^']+|\s*)([\']))|((["])([^"]+|\s*)(["])))/gim;

                name2Lower = !!name2Lower;
                while( (res2=ps2.exec(res1))!=null){
                    attrName = res2[2];
                    attrName = name2Lower ? attrName.toLowerCase() : attrName;
                    ret[ attrName ] =  res2[5] || res2[8] || res2[12];
                }
                return ret;
            }
        },
        /**
         * 获取HTML标签的内容，如果匹配失败，返回htmlCode
         *@example
         *   htmlCode='<a href="xxx.jsp">TEST</a';
         *   utils.getHTMLContent(htmlCode, "a"); //返回TEST
         *
         * @param {String} htmlCode HTML的内容
         * @param {String} tagName HTML标签的名称
         * @return {String} HTML标签的内容
         */
        getHTMLContent: function (htmlCode, tagName) {
            var pattern = new RegExp("<" + tagName + "[^>]*>((.|[\n\r])*)<\/" + tagName + ">", "im");
            var matches = pattern.exec(htmlCode);
            return matches ? matches[1] : htmlCode;
        },
        /**
         * 寄生式原型继承. 通过浅克隆方式生成superType的prototype克隆对象，并赋给subType，避免继承过程中重复调用父类构造函数.
         *@example
         function superType(a,b){this.a=a;this.b=b;}
         superType.prototype.say=function(){alert(this.a+","+this.b);};
         function subType(a,b,c){superType.call(this,a,b);this.c=c;}
         utils.inheritPrototype(subType,superType);
         var aa = new subType(1,2,3);
         aa.say(); //1,2
         aa instanceof subType; //true
         aa instanceof superType; //true

         * @param {Function} subType 派生的子类
         * @param {Function} superType 被继承的父类
         * @author yangwenyi@ygsoft.com
         * @date 2014.8.6
         */
        inheritPrototype: function (subType, superType) {
            // 浅克隆临时函数
            function object(o) {
                function _() { };
                _.prototype = o;
                return new _();
            }
            // 原型继承
            var prototype = object(superType.prototype);
            prototype.constructor = subType;
            subType.prototype = prototype;
        },
        /*
         * 对传入的对象，自动生成setter以及getter方法 @参数 target 需要增强的目标对象 @参数 getterMethod
         * 增强的getter方法，如果不传入，返回为“target[attr]” @参数 setterMethod
         * 增强的setter方法，如果不传入，返回为“target[attr] = value;”
         */
        advicePlainObject: function (target, getterMethod, setterMethod, flag) {
            var _arr = [];
            // 迭代出所有对象，将立体的对象结构放入线性的数组里
            (function recursion(parent, value, attr, dataField, index) {
                if (index !== undefined) {
                    dataField += "[" + index + "]";
                }
                if (attr) {
                    if (flag) {
                        if (dataField) {
                            dataField += '.' + attr;
                        } else {
                            dataField = attr;
                        }
                    }
                    _arr.push({ "target": parent, "attr": attr, "dataField": dataField });
                }
                if ($.isArray(value)) {
                    for (var i = 0, j = value.length; i < j; i++) {
                        arguments.callee(undefined, value[i], undefined, dataField, i);
                    }
                } else if ($.type(value) === "object") {
                    for (var attr in value) {
                        arguments.callee(value, value[attr], attr, dataField);
                    }
                }
            })(undefined, target, undefined);

            for (var i = _arr.length; i--; ) {
                /*
                 * var obj = _arr[i], attr = obj.attr, target = obj.target,
                 * dataField = obj.dataField; // getter/setter后面首个字母大写 var str =
                 * attr.substring(0, 1).toUpperCase() + (attr.length > 1 ?
                 * attr.substring(1) : ""); //构造set,get函数字符串 var setter = "set" +
                 * str; var getter = "get" + str;
                 *
                 * //创建setter方法 if (setterMethod) { target[setter] =
                 * setterMethod(null, attr, dataField); } else { target[setter] =
                 * function (target, attr) { return function (value) {
                 * target[attr] = value; } } (target, attr); }
                 *
                 * //创建getter方法 if (getterMethod) { target[getter] =
                 * getterMethod(target, attr); } else { target[getter] =
                 * function (target, attr) { return function () { return
                 * target[attr]; } } (target, attr); }
                 */

            }
            _arr = null;
            _arr = [];
        },
        /**
         * 数组中对象的属性值匹配指定值得元素对应的索引位置
         *@example
         *  var aa =[{a:1,b:2},{a:3,b:4}];
         *  utils.arraySearch(aa,"a",3); //1
         *  utils.arraySearch(aa,"a",0); //-1

         * @param {Object[]} arr 被查找的数组
         * @param {String} field 对象的查找字段
         * @param value 查找值,只能是基本类型
         * @return {Integer} 匹配元素在数组中的索引位置
         */
        arraySearch: function (arr, field, value) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i][field] == value) {
                    return i;
                }
            }
            return -1;
        },
        /**
         * 替换字符串
         *@example
         *   utils.replaceAll("aaabbaa","a{2}","cc"); //"ccabbcc"
         *   utils.replaceAll("aaabbaa","aaa","ccc"); //"cccbbaa"
         *
         * @param {String} oriStr  目标字符串
         * @param {String} findStr  目标字符串中需替换的字符串,可以正则表达式字符串
         * @param {String}  replaceStr  需替换成的字符串
         * @return {String} 替换后的字符串
         */
        replaceAll: function (oriStr, findStr, replaceStr) {
            if(typeof oriStr === "string"){
                return oriStr.replace(new RegExp(findStr, "g"), replaceStr);
            }
            return oriStr;
        },
        /**
         * 判断v是否为空, 将null,undefined,空串,[],{},0,false认为是 "空"
         * 该函数名不符实(将0,false认为是空)，不建议使用，推荐实用 utils.notEmpty  by yangwenyi.2014-5-13
         * @deprecated 请使用utils.notEmpty
         *@param v
         *@return {Boolean} 为空返回true,否则返回false
         */
        isEmpty:function(v){
            switch (typeof v){
                case 'undefined' : return true;
                case 'string' :
                    if(v.replace(/^\s+|\s+$/g,"").length == 0){
                        return true;
                    }
                    break;
                case 'boolean' :
                    if(v){
                        return true;
                    }
                    break;
                case 'number' : if(0 === v){
                    return true;
                }
                    break;
                case 'object' :
                    if(null === v){
                        return true;
                    }else	if(undefined !== v.length && v.length==0){
                        return true;
                    }else{
                        for(var k in v){
                            return false;
                        }
                        return true;
                    }
                    break;
            }
            return false;
        },
        /**
         * 绑定关闭window窗口前事件，给予提示是否需要关闭
         */
        bindBeforeunload : function(){
            //处理webkit客户端问题
        	var me = this;
            try{
                var req = window.require, gui;
                if(req && !req("nw.gui")){
                    gui = req("nw.gui");
                }else{
                    if (typeof nwDispatcher !== 'undefined' && $.isFunction(nwDispatcher.requireNwGui)) {
                        gui = nwDispatcher.requireNwGui();
                    }
                }
                if (gui) {
                    var win = gui.Window.get();
                    if (win) {
                        win.on("close",function(){
                            var bunloadFun = window.onbeforeunloadFun;
                            if($.isFunction(bunloadFun) && !window.notBeforeWinFun){
                                var res = bunloadFun();
                                if(me.notEmpty(res) && res){
                                	require(["ecp.component.dialog"], function(dialog){
                                		dialog.show({
                                    		title: '提示',
                                    		content: res,
                                    		isTip: true,
                                    		showCloseButton : false,
                                    		otherButtons: ["取消", "确定"],
                                    		otherButtonStyles: ["btn-default", "btn-primary"],
                                    		clickButton: function(sender, modal, index){
                                    			if(index === "0"){
                                    				modal.modal('hide');
                                    			} else if (index === "1"){
                                    				 //添加关闭后事件
                                                    if(typeof window.onAfterClose === "function") {
                                                        window.onAfterClose();
                                                    }
                                    			}
                                    		}
                                    	});
                                	});
                                }
                            }
                            this.close(true);
                        });
                        return;
                    }
                }
            }catch(e){
                //无需处理
            }
            //绑定关闭window窗口前事件，给予提示是否需要关闭
            window.onbeforeunload = function(){
                //onbeforeunloadFun回调函数，如果返回空或者false都不给提示
                //notBeforeWinFun表示执行dialog.js的关闭不执行window的onbeforeunloadFun回调
                var bunloadFun = window.onbeforeunloadFun;
                if($.isFunction(bunloadFun) && !window.notBeforeWinFun){
                    var res = bunloadFun();
                    if(me.notEmpty(res) && res){
                        return res;
                    }
                }else{
                    window.notBeforeWinFun = false;
                }
            }
        },
        /**
         * 判断是否为webkit的小客户端
         * return true表示是，false表示否
         */
        webKitClient : function(){
            if(this.isWebkit!=null){//缓存，只判断一次。
                return this.isWebkit;
            }
            this.isWebkit = false;
            try{
                var req = window.require,gui;
                if(req && !req("nw.gui")){
                    gui = req("nw.gui");
                }else{
                    if (typeof nwDispatcher !== 'undefined' && $.isFunction(nwDispatcher.requireNwGui)) {
                        gui = nwDispatcher.requireNwGui();
                    }
                }
                if(gui && gui.Window && gui.Window.get() && this.notEmpty(gui.Window.get().zoomLevel)){
                    this.isWebkit = true;
                }
            }catch(e){
                //不处理异常
            }
            return this.isWebkit;
        },
		/**
    	 * 是否webkit运行环境.
    	 */
    	isWebkit: function() {
    		var isWebkit = false;
    		if (typeof require !== 'undefined') {
    			try {
    				require('nw.gui');
    				isWebkit = true;
    			} catch (e) {
    			}
    			// 补偿判断
    			if (typeof nwDispatcher !== 'undefined' && $.isFunction(nwDispatcher.requireNwGui)) {
    				isWebkit = true;
    			}
    		} else if (typeof nwDispatcher !== 'undefined' && $.isFunction(nwDispatcher.requireNwGui)) {
    			isWebkit = true;
    		}
    		return isWebkit;
    	},
        /**
         * 在数组中查找指定元素的索引,第一个元素的索引为0
         * @example
         *   var i=utils.getIndex({list:[{name:"ycy",height:125},{name:"ywy",height:165}],key:"name",value:"ywy"}); //i=1
         *
         * @param {Object}  opt 参数对象
         * @param {Object[]} opt.list 被查找对象数组
         * @param {String} opt.key 要查找的键名称
         * @param   opt.value 要查找的值 ,value与被查找对象的键值用==比较（不是===)
         * @return {Integer} 匹配元素的索引
         * @author yangwenyi@ygsoft.com
         * @date 2014.8.7
         */
        getIndex : function (opt){
            var list = opt.list,
                key = opt.key,
                value = opt.value;
            return (function(par){
                for (var i = list.length; i--;) {
                    if (list[i][key] == par){
                        return i;
                    }
                }
                list = null;
                return -1;
            })(value);
        },
        
        /**
         * 格式化JSON
         */
        formatJSON: function(json, fillStringUnit) {
            function getToken(json) {
                var buf = "";
                var isInYinHao = false;
                while (json.length > 0) {
                    var token = json.substring(0, 1);
                    json = json.substring(1);
                    if (!isInYinHao
                        && (token === ":" || token === "{" || token === "}"
                        || token === "[" || token === "]" || token === ",")) {
                        if (buf.toString().trim().length == 0) {
                            buf += token;
                        }
                        break;
                    }

                    if (token === "\\") {
                        buf += token;
                        buf += json.substring(0, 1);
                        json = json.substring(1);
                        continue;
                    }
                    if (token === "\"") {
                        buf += token;
                        if (isInYinHao) {
                            break;
                        } else {
                            isInYinHao = true;
                            continue;
                        }
                    }
                    buf += token;
                }
                return buf.toString();
            }

            function doFill(buf, count, fillStringUnit) {
                buf += "<br/>";
                for ( var i = 0; i < count; i++) {
                    buf += fillStringUnit;
                }
            }

            if (json == null || json.length == 0) {
                return null;
            }

            var fixedLenth = 0;
            var tokenList = [];
            {
                var jsonTemp = json;
                //预读取
                while (jsonTemp.length > 0) {
                    var token = getToken(jsonTemp);
                    jsonTemp = jsonTemp.substring(token.length);
                    token = token.trim();
                    tokenList.push(token);
                }
            }

            for ( var i = 0; i < tokenList.length; i++) {
                var token = tokenList[i];
                var length = token.length;
                if (length > fixedLenth && i < tokenList.length - 1
                    && tokenList[i + 1] === ":") {
                    fixedLenth = length;
                }
            }

            var buf = '';
            var count = 0;
            var args_b = 0;
            var args_e = 0;
            var spaceStr = "";
            for ( var i = 0; i < tokenList.length; i++) {
                var token = tokenList[i];
                if (token === ",") {
                    var lastToken = tokenList[i - 1];
                    buf += token + "<br/>" + spaceStr;
                    doFill(buf, count, fillStringUnit);
                    continue;
                }
                if (token === ":") {
                    buf += token;
                    continue;
                }
                if (token === "{") {
                    spaceStr += "    ";
                    args_b++;
                    var nextToken = tokenList[i + 1];
                    var lastToken = tokenList[i - 1];
                    if (nextToken === "}") {
                        buf += "{ ";
                    } else {
                        count++;
                        buf += token + "<br/>" + spaceStr;
                        doFill(buf, count, fillStringUnit);
                    }
                    continue;
                }
                if (token === "}") {
                    var nextToken = tokenList[i + 1];
                    //args_e++ ;
                    count--;
                    args_b--;
                    spaceStr = spaceStr.substring(0, spaceStr.length - 4);
                    doFill(buf, count, fillStringUnit);
                    if (nextToken === ",") {
                        buf += token;
                    } else {
                        buf += token + "<br/>";
                    }
                    continue;
                }
                if (token === "[") {
                    var nextToken = tokenList[i + 1];
                    if (nextToken === "]") {
                        i++;
                        buf += "[ ]";
                    } else {
                        count++;
                        buf += token;
                        doFill(buf, count, fillStringUnit);
                    }
                    continue;
                }
                if (token === "]") {
                    count--;
                    doFill(buf, count, fillStringUnit);
                    buf += token;
                    continue;
                }
                buf += token;
            }
            return buf.toString();
        },
        /**
         * 将html串中的 "&"和"<" 转义成 "&amp;"和"&lt;"
         * @example
         utils.convertHtmlChar("a<1 && b <10"); // "a&lt;1 &amp;&amp; b &lt;10"

         * @param {string} html HTML字符串
         * @return {string} 转义后的HTML字符串
         * @author yagnwenyi@ygsoft.com
         * @date 2014.8.11
         */
        convertHtmlChar: function(html){
            html = this.replaceAll(html, "&", "&amp;");
            html = this.replaceAll(html, "<", "&lt;");
            return html;
        },
        /**
         * @see utils.convertHtmlChar
         * @param {string} html HTML字符串
         * @return {string} 转义后的HTML字符串
         * @author yagnwenyi@ygsoft.com
         * @date 2014.8.11
         */

        escapeHtml: function(html){
            return this.convertHtmlChar(html);
        },
        /**
         * 将html串中的 "&amp;" ,"&lt;","&nbsp;" 逆转成 "&" , "<" ,""
         * @example
         utils.convertHtmlChar("a&lt;1 &amp;&amp; b &lt;10"); // "a<1 && b <10"

         * @param {string} html 含有转义（如  "&lt;"，"&amp;"）的HTML字符串
         * @return {string} 逆转后的HTML字符串
         * @author yagnwenyi@ygsoft.com
         * @date 2014.8.11
         */
        restoreHtmlChar: function(html){
            // jqgrid可能会返回&nbsp;的值，这里返回空字符串
            if(html === '&nbsp;' || html === '&#160;'){
                return "";
            }
            html = this.replaceAll(html, "&lt;", "<");
            html = this.replaceAll(html, "&amp;", "&");
            return html;
        },
        /**
         * @see utils.restoreHtmlChar
         * @param {string} html 含有转义（如  "&lt;"，"&amp;"）的HTML字符串
         * @return {string} 逆转后的HTML字符串
         * @author yagnwenyi@ygsoft.com
         * @date 2014.8.11
         */
        unescapeHtml: function(html){
            return this.restoreHtmlChar(html);

        },
        /**
         * 布尔类型转换函数.
         utils.getBooleanValue(true);// ->true
         utils.getBooleanValue(false);// ->false
         utils.getBooleanValue("yes");// ->true
         utils.getBooleanValue("true");// ->true
         utils.getBooleanValue("y");// ->true
         utils.getBooleanValue("1");// ->true
         utils.getBooleanValue("2");// ->true
         utils.getBooleanValue("no");// ->false
         utils.getBooleanValue("false");// ->false
         utils.getBooleanValue("n");// ->false
         utils.getBooleanValue("0");// ->false
         utils.getBooleanValue(1);// ->true
         utils.getBooleanValue(50);// ->true
         utils.getBooleanValue(0);// ->false
         utils.getBooleanValue({a:1},true); // ->true 这个场景有问题
         utils.getBooleanValue({a:1},false);// ->false 这个场景有问题
         utils.getBooleanValue(null,true); // ->true
         utils.getBooleanValue(null,false);// ->false
         utils.getBooleanValue(undefined,true); // ->true
         utils.getBooleanValue(undefined,false);// ->false

         * @param {String | Number | Boolean}  value 表示真假的数据（字符串，数值，布尔值等）
         * @param {boolean} def 默认值
         * @return {boolean} 返回布尔值
         */
        getBooleanValue : function(value, def) {
            if(typeof value == "boolean") {
                return value;
            } else if(typeof value == "string") {
                //处理各种布尔情况
                value = value.toUpperCase();
                return value === "TRUE"
                    || value === "YES"
                    || value === "Y"
                    || (!isNaN(value) && value !== "0");
            } else if(typeof value == "number") {
                return value != 0;
            } else if(typeof value == "date") {
                return false;
            } else if(typeof def == "boolean") {
                return def;
            } else {
                return false;
            }
        },
        /**
         * 将指定对象转换为数组对象
         * <p>
         *  当 src == "undefined" 时， 返回 def <br>
         * </p>
         * @param {Object} src 要转换的源对象
         * @param {Object} def 缺省值(当src不足以满足转换为数组对象的情况下，返回该值)
         * @return {Array} 转换后的数组对象
         */
        toArray : function(src, def) {
            var target;
            if(typeof src != "undefined") {
                if(src instanceof Array) {
                    target = src;
                } else {
                    target = [src];
                }
            } else {
                target = def;
            }
            return target;
        },
        /**
         *判断是否是ie10及以上版本,避免ie11版本去掉mise  避免$.browser.mise失效！
         *旧门户IE11开启兼容模式时，当前版本是IE7，修正该方法无法判断的问题
         *@example
         utils.isIE();

         *@return {Boolean}   ie返回true
         *@modify yinshanpeng@ygsoft.com
         *@lastdate 2014.7.16
         */
        isIE : function(){ //ie?
            //如果ie11以下版本直接返回$.browser.msie
            if($.browser.msie){return true;}
            var res =false,
                ver = /(msie\s|trident.*rv:)([\w.]+)/.exec(navigator.userAgent.toLowerCase());
            if (ver != null) {
                if (parseInt(ver[2]) > 7) {
                    res = true;
                }
            }
            return res;
        },
        /**
         * 测试函数的性能
         * <p>通过执行指定次数的函数所用的时间进行分析。其中第三个参数之后可作为测试函数的参数。</p>
         * @example
         * #执行函数abc()10000次所用的时间
         function fn(a){var b = (a+10)*this.N;};
         var t = utils.speedTest(fn,10000000,{N: 2},5);//t ->400
         *
         * @example
         *  //执行数组函数delAllRepeat()10000次所用的时间
         *  var abc = [2,3,1,{a:32}];
         *  var time = utils.speedTest(Array.prototype.delAllRepeat,10000,abc,false);//结果10024ms
         *
         * @param {Function} fn 要执行的函数名称
         * @param {Number} count 执行的次数
         * @param {object} context 函数上下文
         * @return {Number} 执行函数所用时间的毫秒数
         *
         * @author zhengxianwei@ygsoft.com
         * @version 1.0
         * @date 2014-07-04
         */
        speedTest : function(fn,count,context){
            if(!$.isFunction(fn)){return;}
            if(typeof(count) !== "number" || count <= 0){ return;}
            var args = Array.prototype.slice.call(arguments,3);
            var startTime = new Date().getTime();
            for(var i = 0; i < count; i++){
                fn.apply(context,args);
            }
            var endTime = new Date().getTime();
            return endTime - startTime;
        },
        /**
         * 发送流程已传递的消息.
         * <p>
         * 待办流程传递后发送流程已经传递的消息，目前用于支持旧门户中打开ECP待办单据，传递后，待办未刷新的情况.
         * </p>
         * @example
         * utils.sendWfTransferedMsg();
         * @author pengxiao
         * @date 2014-8-06
         */
        sendWfTransferedMsg : function() {
            // 目前以写cookie方式传递消息。
            document.cookie = "_RWF=1;path=/";
            var val = this.getCookie("_ERWF");
            if (val) {
                val = parseInt(val, 10);
                val = (val >= 0x7fffffff) ? 1 : (val+1);
            } else {
                val = 1;
            }
            document.cookie = "_ERWF=" + val +";path=/";
        },
        /**
         * 发送流程工作项消息.
         * <p>
         * 待办流程传递或保存写工作项信息，第一个参数是当前工作项ID，第二个参数是新工作项ID，
         * 保存时两个参数传当前工作项ID，传递时，第二个参数传新工作项ID，第二个参数不传认为流程完成.
         * </p>
         * @example
         * utils.sendWfWorkInfoMsg(oldWorkItemId, newWorkItemId);
         * @author pengxiao
         * @date 2015-12-09
         */
        sendWfWorkInfoMsg : function(oldWorkItemId, newWorkItemId) {
            if (!oldWorkItemId) return;
            var str = oldWorkItemId + "_";
            if (newWorkItemId) {
                str = str + newWorkItemId;
            }
            document.cookie = "_WKI=" + str + ";path=/";
        },
        appliedCF: function(win){
            if(arguments.length==0){
                return arguments.callee.call(null,window);
            }else if(win==null){
                return false;
            }else if(win.externalHost){//externalHost是IE内嵌的ChromeFrame特有的属性
                return true;
            }else{
                var pW = null;
                try {
                    pW = win.opener;
                    var d = document.domain;
                    if (pW && pW.document.domain == d) {
                        return arguments.callee.call(null,pW);
                    } else {
                        return false;
                    }
                } catch(e) {
                    return false;
                }
            }
        },
        /**
         * 正规(格式)化json字符串，即在键的前后加双引号，如果原来是单引号的则代之以双引号
         * @example
         *  var jsonstr = '{name: "ywy", married: true ,weight: 54.5, \'sex\':"m"}';
         *
         *  utils.normalizeJson(jsonstr); //返回：{"name": "ywy", "married": true, "weight": 54.5, "sex": "m"}
         * @param {String}  jsonstr 非正规化的json串
         * @return {String} 正规化的json串
         *  @author yangwenyi@ygosft.com
         *  @date 2014.8.2
         */
        normalizeJson: function(jsonstr){
            var sep = " ",
                quato= '"',
                comma = ": ",
                reg = /(\s*)([{,])(\s*)(['"]?)(\w+)\4(\s*)(:)(\s*)/gm;
            var result =jsonstr.replace(reg,"$2"+sep+ quato + "$5" + quato + comma);
            //第二个参数不能用函数形式(函数中用RegExp.$2,RegExp.$5),在IE中如IE8中结果不正确，因为IE8只RegExp.$2保存最新值
            // var result =jsonstr.replace(reg,function(mstr){return RegExp.$2 +sep+ quato + RegExp.$5 + quato + comma;};
            return result ;
        },
        ecpPathInfo : function(){
            var pp, rp, wcp,
                ss = "ScriptServlet";
            if (location.protocol.substr(0, 4) != "http") {
                // 本地模式时，默认JS在上级目录，即测试的HTML文件都放到demo目录中
                pp = rp = wcp = ss = "";
            } else {
                var pn = window.location.pathname;
                // 项目路径,如/grm/component.ef/bcp/
                if(pn && pn.indexOf("/") !==0){//兼容处理ie模态窗口下获取的pathname为grm/ecp
                    pn = "/" + pn;
                }
                pp = pn.substring(0,pn.lastIndexOf("/") + 1);
                //路径中第一段，如/grm/， /YGFMISWeb/，/YGFMISWebRes/
                wcp = pn.substring(0,pn.indexOf("/",1)+1);
                // 平台路径
                rp = wcp + "ecp/"; // 例如 /grm/ecp/
                //脚本管理Servlet
                ss = rp+ss;
            }
            return {
                rootPath: rp,		//为了兼容，暂不要移除
                ecpRootPath: rp, 	//取名ecpRootPath更名副其实,yangwenyi 2014-9-26增加
                projectPath: pp, 	//项目路径，即url中从ip:port后第一个/到最后一个/之间的内容
                webCtxPath: wcp,   	//web上下文路径，即url中从ip:port后第一个/到第二个/之间的内容,yangwenyi 2014-9-26增加
                scriptServlet: ss 	//脚本加载Servlet的路径,yangwenyi 2014-9-26增加
            }
        }(),
        getEcpUrl : function(url){
            if(this.ecpPathInfo.rootPath==""){//file:
                return url;
            }else{ //http:
                return this.ecpPathInfo.rootPath + (url.startsWith("/") ? url.substring(1) : url);
            }
        },
        getRootPath : function(){
            if(this.ecpPathInfo.rootPath==""){//file:
                return $.ecpPathInfo.rootPath;
            }else{ //http:
                var rootPath = this.ecpPathInfo.rootPath;
                //检验$.ecpPathInfo.rootPath是否以"/"开头，不以"/"开头则在开头补上"/"
                rootPath  = rootPath.startsWith("/") ? rootPath : "/" + rootPath;
                //检验$.ecpPathInfo.rootPath是否以"/"结尾，不以"/"结尾则在结尾补上"/"
                rootPath  = rootPath.endsWith("/") ? rootPath : rootPath + "/";
                return rootPath.substring(0,rootPath.indexOf("/",1)+1);
            }
        },
        addCookie: function(name,value,expiresHours){
            var cookieString = name+"="+escape(value);
            if(expiresHours>0){
                var date=new Date();
                date.setTime(date.getTime()+expiresHours*3600*1000);
                cookieString=cookieString+"; expires="+date.toGMTString();
            }
            document.cookie=cookieString;
        },
        deleteCookie: function(name){
            var date=new Date();
            date.setTime(date.getTime()-10000);
            document.cookie=name+"=v; expires="+date.toGMTString();
        },
        domAttrI18n: function(locale, container, attr) {
    		var titleAry = $("[ng-"+attr+"]", container);
    		for(var i = 0, len = titleAry.length; i < len; i++) {
    			var dom = titleAry[i];
    			var key = dom.getAttribute("ng-"+attr);
    			var keyAry = key.split(".");
    			var cobj = locale;
    			for(var j = 1, klen = keyAry.length; j < klen && cobj != null; j++) {
    				cobj = cobj[keyAry[j]];
    			}
    			if(cobj != null) {
    				dom.setAttribute(attr, cobj);
    			}			
    		}
    	},
    	/**
    	 * 更新页面含有ng-bind属性的组件
    	 */
    	loadLocale: function(curLocal, ctrl) {
    		if(!ctrl) ctrl= $(document);
    		var me = this;
            if (curLocal) {
                 var ng = [];
                 if (ctrl) {
                     ng = ctrl.find("*[ng-bind]");
                 } else {
                     ng = $("[ng-bind]");
                 }
                 $.each(ng, function (i, el) {
                     var localeName = el.attributes["ng-bind"];
                     if (localeName) {
                         if ("INPUT".toLowerCase() == el.nodeName.toLowerCase()) {
                             el.value = me._getModelValue(curLocal, localeName.value);
                         } else {
                             el.innerText = me._getModelValue(curLocal, localeName.value) || el.innerText;
                         }
                     }
                 });
             }
        },
    	_getModelValue: function(model, path,text) {
        	if(!model || !path){
        		return "";
        	}
            var exists = path in model;
            if (exists) {
                return model[path];
            } else {
                var props = path.split(".");
                var exists = props[0] in model;
                var i = 0;
                //兼容key中增加了主key
                if (exists==false) {
                    i=1;
                }
                var value;
                if(props.length>i){
                	 var len = props.length;
                     var deep = true;
                     do {
                         value = model[props[i]];
                         if (value) {
                             i++;
                             model = value;
                         } else {
                        	 value= text;
                             deep = false;
                         }
                     } while (i < len && deep)
                }
                return value || text;
            }
        },
        
        /**
         * 解析出json path指向的值，主要读写数据模型。
         * @example
         *   var obj = {a:1,b:2,c:{d:[3,4]}};
         *   var r = utils.evalPath(obj,"c.d"); // r=[3,4]
         *   var r = utils.evalPath(obj,"c.d",[5,6]); // r=[5,6],obj={a:1,b:2,c:{d:[5,6]}}
         *   
         * @param {Object} obj JSON对象
         * @param {String} path 指向的路径
         * @param value  字段值
         * @return obj中path所对应的值，如果没有定义path，返回obj;如果obj为undefined，返回undefined
  		 * @date 20160623
         */
        evalPath: function(obj, path, value){
        	// arguments.length等于1时，说明只有path参数
        	if(arguments.length === 1){
        		path = obj;
        		obj = window;
        	}
        	// 没有path，则直接返回value
        	if(!path){
        		if(arguments.length === 3){
        			obj = value;
        		}
        		return obj;
        	}
        	var paths = this.splitStr(path);
        	var length = paths.length;
        	for(var i=0, j=length - 1; i<j; i++){
        		if(obj === undefined){
        			return;
        		}
        		obj = obj[paths[i]];
        	}
        	if(obj === undefined){
        		return;
        	}
        	if(arguments.length === 3){
        		obj[paths[length - 1]] = value;
        		return value;
        	} else {
        		return obj[paths[length - 1]];
        	}
        },
        /**
    	 * 获取工作日
    	 * @example
    	 *  utils.getWorkDays(new Date("2015-12-22 12:00:00"),new Date());
    	 * @param {Date} startDate 开始时间
    	 * @param {Date} endDate 结束时间
    	 */
    	getWorkDays : function(startDate,endDate){
    		if(!startDate || !endDate){
    			console && console.log("开始获结束时间为null");
    			return 0;
    		}
    		var endTime = endDate.getTime();
    		var startTime = startDate.getTime();
    		var daytime = 24 * 60 * 60 * 1000;
    		var workTimes = 0;
    		if(endTime - startTime <= daytime){
    			if(startDate.getDay() == endDate.getDay()){
    				if(this.checkHolidays(startDate)){
    					workTimes += endTime-startTime;
    				}
    			}else{
    				if(this.checkHolidays(startDate) && this.checkHolidays(endDate)){
    					workTimes += endTime-startTime;
    				}else{
    					if(this.checkHolidays(startDate)){
    						workTimes += daytime + this.strToTimeMillis(this.strToDate(startDate) +" 00:00:00") - startTime;
    					}
    					if(this.checkHolidays(endDate)){
    						workTimes += endTime - this.strToTimeMillis(this.strToDate(endDate) +" 00:00:00");
    					}
    				}
				}
    		}else{
    			if(this.checkHolidays(startDate)){
					workTimes += daytime + this.strToTimeMillis(this.strToDate(startDate) +" 00:00:00") - startTime
				}
    			
    			var flag = true,
    				zoreTime = 0;
    			while(flag){
    				startTime += daytime;
    				startDate = new Date(startTime);
    				zoreTime = this.strToTimeMillis(this.strToDate(endDate) +" 00:00:00");
    				if(startTime > endTime){
    					workTimes +=  endTime - zoreTime;
    					flag =false;
    				}else{
    					if(startDate.getDay() == endDate.getDay() && (endTime-startTime)<daytime){
    						if(this.checkHolidays(startDate)){
    							workTimes +=  endTime - zoreTime;
    						}
    						flag =false;
    					}else{
    						if(this.checkHolidays(startDate)){
    							workTimes += daytime;
    						}
    					}    					
    				}
    			}
    		}
    		return workTimes;
    	},
    	checkHolidays:function(startDate, callback){
    		require(["ecp.service"], function(ecp){
    			var year = startDate.getYear(),
		    		day = startDate.getDay(),
		    		holidays = this["holiday"+year] || "",
		    		inHolidays = this["inHolidays"+year] || "",
		    		strDate = this.strToDate(startDate),
		    		ret;
	    		if(!holidays){
	    			try{
	    				var holidayList = ecp.RemoteService.doGet("com.ygsoft.ecp.app.operator.system.service.context.ITXtSpecCalendarContext","getHolidayList",[startDate.getYear() +1900,0 ]);
	    				for(var i=0,len=holidayList.length; i<len; i++){
	    					var c = holidayList[i];
	    					if("3" == c.datetype){
	    						inHolidays += this.strToDate(c.tdate)+",";
	    					}else{
	    						holidays += this.strToDate(c.tdate)+",";					
	    					}
	    				}    				
	    			}catch(e){
	    				window.console && window.console.log("加载节假日出错。");
	    			}
		    		this["holiday"+year] = holidays || "error";
		    		this["inHolidays"+year] = inHolidays;
	    		}
	    		if(((day==0 || day==6) && inHolidays.indexOf(strDate)==-1) || holidays.indexOf(strDate) != -1){
	    			ret = false;
	     	    }else{
	     	    	ret = true;
	     	    }
	    		if($.isFunction(callback)){
	    			callback.call(null, ret);
	    		}
    		});
    	},
		/**
    	 * 计算字符个数
    	 */
    	countCharacters : function(str){
    		if(typeof str === 'string'){
    			var totalCount = 0;
    			var j = str.length;
    			if (j > 0) {
    				for (var i=0; i<j; i++){
    					var code = str.charCodeAt(i);
    					if((code >= 0x0001 && code <=0x007e) || (0xff60 <= code && code <= 0xff9f)){
    						totalCount++;
    					}else{
    						totalCount+=2;
    					}	
    				}
    			}
    			return totalCount;
    		}
    	},
    	/**
    	 * 限制输入框的最大输入长度
    	 */
    	limitedMaxInput : function(container){
    		var allSelector = $("input[type=text],textarea", container || $("body"));
    		var that = this;
    		var bindEvent = function(element, config){
    			var maxLength = config.maxLength;
    			if(maxLength != null){
    				element.attr("maxlength", maxLength);
    				element.on('keydown keyup', function(){
    					var value = element.val();
    					var count= that.countCharacters(value);
    					if(count> maxLength){
    						var cutLength = _fun(value, maxLength);
    						element.val(value.substring(0, cutLength));
    						element.trigger("change");
    					}
    				});
    			}
    		};
    		
    		$.each(allSelector, function(i, element){
				var $this = $(element),
					dataOptions;
				try{
					dataOptions = $.parseJSON($this.attr("data-option"));
				}catch(e){
					dataOptions = {};
				}
				var config = $.extend({}, dataOptions);
				bindEvent($this, config);
			});
			
			function _fun(str,maxLength){
    			var i =0,
    				j = str.length,
    				count = 0,
    				ret = 0;
    			for(; i < j; i++){
    				count+= that.countCharacters(str[i]);
    				if(count > maxLength){
    					ret = i;
    					break;
    				}
    			}
    			return ret;
    		}
    	},
    	/**
    	 * 获得本地地址.
    	 */
    	getLocalAddress: function(){
			var loc = window.location;
			return loc.protocol + "//" + loc.host;
		},
				
		/**
		 * 获得附件下载地址.
		 * @param {Object} file 文件对象
		 * @param {String} userCode 用户ID
		 * @param {String} unitCode 单位代码
		 * @return {String} url 下载地址
		 */
		getAttachmentDownLoadURL: function(file, userCode, unitCode){
			if (!file) {
	     		 return "";
	     	}
	     	var serverAddress = this.getLocalAddress();
	     	var title = file.title;
	     	if(title.indexOf(".") >= 0) {
	     	    title = title.substring(0,title.indexOf("."));
	     	}
	     	var fileName = encodeURIComponent(title);
	     	//测试下载地址
	     	var downloadUrl  = serverAddress + "/grm/gris/contentmanage.ecmDownLoadServlet?fileName=" + fileName + "&fileType="+ file.btype + "&userCode="+ userCode +"&orgCode=" + unitCode + "&resId="+file.resId;
	     	return downloadUrl;
		},
				
		/**
		 * 是否为webkit浏览器
		 */		
		isNodeWebkitBrower: function() {
			// 检测是否node-webkit运行
			var gui = null;
			var isWebkit = false;
			if (typeof require !== 'undefined') {
				try {
					gui = require('nw.gui');
				} catch (e) {
					window.console&& window.console.info("no require[nw.gui] defined");
				}
				if (gui) {
					isWebkit = true;
				}
			} else if (typeof nwDispatcher !== 'undefined' && $.isFunction(nwDispatcher.requireNwGui)) {
				isWebkit = true;
			}
			return isWebkit;
		},
				
		/**
		* 判断是否是chrome浏览器.
		*/
		isChromeBrower: function() {
		   var isChrome = false;
		   if (window.navigator.userAgent.indexOf("Chrome") !== -1) {
			   isChrome = true;
		   }
		   return isChrome;
		},
		/**
		 * 获得IE版本号.
		 */		
		getIEVersion: function(){
	    	var ua = navigator.userAgent.toLowerCase();
	    	var msie = parseInt((/msie (\d+)/.exec(ua) || [])[1],10);
	    	if (isNaN(msie)) {
	    	  msie = parseInt((/trident\/.*; rv:(\d+)/.exec(ua) || [])[1],10);
	    	}
	    	return msie;
	    },
		/**
		*格式化日期数据
		*@example
		* var d = "2014-08-02 19:30:00";
		* var d1 = utils.formatDatePickerValue({code:"@date#1"},d);//d1="2014年8月2日"
		* var d1 = utils.formatDatePickerValue({code:"@date#2"},d);//d1="2014年8月"
		* var d1 = utils.formatDatePickerValue({code:"@date#3"},d);//d1="8月2日"
		* var d1 = utils.formatDatePickerValue({code:"@date#4"},d);//d1="二零一四年八月二日"
		* var d1 = utils.formatDatePickerValue({code:"@date#5"},d);//d1="二零一四年八月"
		* var d1 = utils.formatDatePickerValue({code:"@date#6"},d);//d1="八月二日"
		* 
		* 
		*@param {Object|String} format 格式,例如：{code: "@date#1"},支持6种日期格式：
		* 1： yyyy年m月d日
		* 2： yyyy年m月
		* 3： mm月d日
		* 4： YYYY年M月D日
		* 5： YYYY年M月
		* 6:  M月D日
		*@param {String} value 日期数据
		*@return {String} 返回指定格式的日期串
		*@author yangwenyi@ygsoft.com
		*@date 2014.8.2
		*@modify 修复: 当格式为6时程序异常(使用了一个不存在变量date)。
		*/
		formatDatePickerValue : function (format ,value){
				//格式为空
			if(!format || !value){return value}
			if(!$.isPlainObject(format)){
				format = $.parseJSON(format);
			}
			//获取格式code
			var formatCode = format.code ? format.code :"",
				formatValue = value.length >12 ? new Date(value.split(" ")[0]) : new Date(value);
			//格式code为空，返回value
			if(!formatCode){return value}
			//获取语言类型
			var lan = this.getLanguage() || "zh";
			var rules = formatCode.split("#"),
			    dts;	
			//处理时区，固定日期
			if(rules[2] == 1){
				formatValue = this.reverseTimeZoneToData(formatValue);
			}
			if(/en-us/.test(lan)) {
				var cy = formatValue.getFullYear();
				var cm = formatValue.getMonth();
				var ems = i18n.datepicker.months;
				cm = ems[cm];
				var cd = formatValue.getDate();
				var rv = rules[1]; 
				if(rv === "1" || rv === "4") {
					return cm + " " +  cd + "," + cy;
				} else if(rv === "2" || rv === "5") {
					return cm + "," + cy;
				} else {
					return cm + " " + cd;
				}
			} else {
				switch(rules[1]){
					case "1":
					case "2": 
					case "3": 
						dts = formatValue.format("","ja");
						//if(dts.indexOf("年")==-1){dts = formatValue.toLocaleDateString();}
						if(dts.indexOf("年")==-1){
							dts = formatValue.toLocaleDateString();
							if(dts.indexOf("年")==-1){
								dts = this.formatDate(formatValue,"yyyy年MM月dd日");
							}
						}
						break;
					case "4":
					case "5": 
					case "6":
						dts =  this.dateIntoChinese(formatValue);
						break;
				}							
				if( rules[1]=="1" || rules[1]=="4"){//2013年10月10日,二零一三年十月十日 
					return dts;
				}else if(rules[1]=="2" || rules[1]=="5"){//2013年10月,二零一三年十月 
					return dts.substring(0,dts.indexOf("月")+1);
				}else if(rules[1]=="3" || rules[1]=="6"){//10月10日,十月十日 
					return dts.substring(dts.indexOf("年")+1);
				} 
			}
			
			return this.strToDate(formatValue);
		},
		/**
		*日期转换为中文格式
		*@example 
		* var s = utils.dateIntoChinese(new Date("2014-12-31"));//s ="二零一四年十二月三十一日"
		* var s = utils.dateIntoChinese(new Date );//s ="二零一四年八月三日"
		*@param {Date} dt
		*@return {String} 中文日期字符串 
		*@author yangwenyi@ygsoft.com
		*@date 2014.8.2
		*@modify 修正一个隐含的错误： str不应该定义为全局变量；优化算法更灵活
		*/
		dateIntoChinese : function(dt){
			var y  = dt.getFullYear(),
                m =  dt.getMonth() + 1,
			    d  = dt.getDate(),
                YMD = cst.CHINESE_DATETIME,
                Y = YMD[0],
                M = YMD[1],
                D = YMD[2];
            return this.toCHNumb(y,"ly",false)+ Y +this.toCHNumb(m,"ld",false)+M +this.toCHNumb(d,"ld",false)+D;	
	    }, 
		/**
	    *dateIntoChinese的同名方法
	    *@see utils.toCHDate
	    *
	    */
		toCHDate: function(dt){
	        return this.dateIntoChinese(dt);
	    },
		/**
		 * 将阿拉伯数字转换成中文数字(为金额，日期，数字共用的方法，大大优化了代码)
		 *  @example
         *   utils.toCHNumb("1234567800056509.3","lm") //一千二百三十四万五千六百七十八亿〇五万六千五百〇九元三角
         *   utils.toCHNumb("1234567800056509.3","um") //壹仟贰佰叁拾肆萬伍仟陆佰柒拾捌億零伍萬陆仟伍佰零玖圆叁角
         *   utils.toCHNumb("1234567800056509.3","l") //一千二百三十四万五千六百七十八亿〇五万六千五百〇九点三
  		 *	 utils.toCHNumb("1234567800056509.3","u")  //壹仟贰佰叁拾肆萬伍仟陆佰柒拾捌億零伍萬陆仟伍佰零玖点叁
         *   utils.toCHNumb("-1234567800056509.3","u")  //-壹仟贰佰叁拾肆萬伍仟陆佰柒拾捌億零伍萬陆仟伍佰零玖点叁
         *
         *   utils.toCHNumb("2014","ly");  //二〇一四
         *   utils.toCHNumb("10","ld");  //十
         *   utils.toCHNumb("11","ld");  //十一
         *   utils.toCHNumb("20","ld");  //二十
         *   utils.toCHNumb("2014","uy");  //贰零壹肆
         *   utils.toCHNumb("10","ud");  //拾
         *   utils.toCHNumb("21","ud");  //贰拾壹
         *
		 * @param {Number} num
		 * @param {String} u  "u"表示转换成中文大写，否则("l")表示转换成中文小写;
                        第2位(如果有) m表示金额,y表示年份（2014拼读“二〇一四”）,d表示月/日（10拼读“十”）
		 * @param {Boolean} [dot=undefined] 表示有无小数部分，true表示纯小数，false表示纯整数，undefined表示不确定
		 * @return {String} 中文数字
		 * @author yangwenyi@ygsoft.com
		 * @date 2014.8.5
		 */
		toCHNumb: function(num,u,dot){
	     
	        function __isUpper(u){
	    	   return u = u.toLowerCase().startsWith("u") ; 
	        }
	        function __isMoney(u){
 	           return u.toLowerCase().endsWith("m") ;  
		    }
            function __isYear(u){
 	    	   return u.toLowerCase().endsWith("y") ;  
		    }
            function __isDay(u){
 	    	   return u.toLowerCase().endsWith("d") ;  
		    }
	        function __toChNum(num,chDigits){
			   num = ""+num;
			   for(var  l  = num.length,r="",i=0; i<l ;i++){
				  r += chDigits[num.charAt(i)];
			   }
			   return r;
		    }
		    function __toChJfl(num,chDigits){ //角分厘
			    num = num.substring(0,3);
             
			    for(var d,r="",i=0,len=num.length;i<len;i++){
				  d = +num[i];
				  r += chDigits[d] + (d==0? "" : (cst.CHINESE_CURRENCY[i+2]) );
			    }
                return r;
		    }
	        function __makeGrp4(num){
	    	    var group4=[]; //4维组，每4位组成1组，从低位开始
	  	        for(var g="", i= num.length,c=1; i--; c++ ){
	    	       g = (num[i] ? num[i] : num.charAt(i))+g;	  
	    	       if(c%4==0 || i==0 ){group4.push(g); g="";}
	    	    }
	    	    return group4;
	        }
	      
	        //拼读4维组，如1234读作一千二百三十四, 1020读作一千〇二十
	        function __spellGrp4(num,chDigits){
	    	   for(var d,r="",len = num.length,i= 0; i<len; i++){
	    		   d = +(num[i] ? num[i] : num.charAt(i));
                   if(isYear){
                       r += chDigits[d];  
                   }else if(isDay){
                       r += (d>1||i==len-1?  chDigits[d] : "") + ( d == 0 ? "" : ( i<len-1 ? chDigits[9+len-i-1] : "") ); 
                   }else{
                       r += chDigits[d] + ( d == 0 ? "" : ( i<len-1 ? chDigits[9+len-i-1] : "") );
                   }
	    		
	    	   }
	    	   return r;
	        }
	      
		    var di="", //整数部分
	      	    dd="", //小数部分 
	      	    toUpper = __isUpper(u),
	      	    isMoney = __isMoney(u),
                isYear = __isYear(u),
                isDay = __isDay(u),
			    currency;
		    if(isMoney){currency =  toUpper ? cst.CHINESE_CURRENCY[0] : cst.CHINESE_CURRENCY[1];}
	        num = (""+num).trim();

	        if( dot!==true && dot!==false ) {
	    	    num =  num.split(".");
                var sign ="";
	    	    if(num[0] && num[0]!="") {
                   if( num[0].startsWith("-") || num[0].startsWith("+")){
                       sign= num[0].substring(0,1);
                       num[0] =  num[0].from(1);
                   }
	    	       di = this.toCHNumb( num[0] ,u,false);
	    	    }
	    	    if(num[1] && num[1]!="") { 	  
	    	       dd =  (!isMoney ? "点" : "") + this.toCHNumb( num[1] ,u,true);
	    	    }
	    	    return sign+ (!isMoney ? (di + dd) : (di + currency +(dd=="" ? "整" : dd) ));	    	  
	        }else {
	    	    var chDigits =toUpper ? cst.CHINESE_U_NUMBER : cst.CHINESE_L_NUMBER;
                var zero = chDigits[0];
	    	    if(dot===false){//整数部分
					var g4= __makeGrp4(num); //4维组，每4位组成1组，从低位开始
	   		        for(var d4,i=0,len=g4.length; i<len;i++){
						 d4 = __spellGrp4(g4[i],chDigits); 
						 d4 =   this._removeZero(d4,zero);	    		 
						 if(i>0 && d4 !=""){
							 d4 +=chDigits[12+i]; 
						 }
						 if(i==len-1){
							 if(d4=="" && di==""){
								d4= toUpper ? '零' : '〇'; 
							 }else if(g4[i].startsWith("0") && d4.length>1){
								d4= d4.substring(1);
							 }
						 }
						 di = d4 + di;	    		 
					}
					return di;
				}else if(dot===true){//小数部分
					dd = !isMoney ? __toChNum(num, chDigits) : __toChJfl(num,chDigits);
					if(isMoney) dd = this._removeZero(dd,zero);	
					return dd;
				} 
		    }
		},
		/**			
		 * 移除result中包含的zero或者zerozero(内部方法)
		* @ignore
		*/
		_removeZero :function(src,zero){
			while(src.endsWith(zero)){
				src = src.substring(0,src.length-1);
			}
			var index = src.indexOf(zero+zero);
			if(index!=-1){
				src = src.substring(0,index)+src.substring(index+1);
				return this._removeZero(src,zero);
			}
			if(src=="一十"){
				src = src.replaceAll("一十","十");
			}
			if(src=="壹拾"){
				src = src.replaceAll("壹拾","拾");
			}
			return 	src;
		},
		
		/**
		 * 通过时区回写日期的转换
		 * @param {Date} date 要转换的日期对象
		 * @return res 
		 */
		reverseTimeZoneToData: function(date){
			if(!date || $.type(date) !== "date"){return;}
			var serverTimeZone = $.cookie("ecp_server_timezone");
			var offset = 0;
			var res = date.getTime();
			if(serverTimeZone){
				var tzos = new Date().getTimezoneOffset();
				offset = parseInt(serverTimeZone,10) + tzos * 60 * 1000;
			}
			res = res + offset;
			res = new Date(res);
			return res;
		},
		
	    /**
	     * 设置时区.
	     */
	    setTimeZone : function(){
//	    	var timezone = $.cookie("ecp_timezone");
//	    	if(!timezone){
	    		var timezone = new Date().getTimezoneOffset()/60;
	    		if(timezone < 0){
	    			timezone = "GMT+" + -timezone;
	    		}else{
	    			timezone = "GMT-" + timezone;
	    		}
	    		$.cookie("ecp_timezone",timezone);
//	    	}
	    	return timezone;
	    },
	    /**
	     * 返回网址前缀.
	     */
	    getLocaHost:function() {
	    	return window.location.protocol + "//" + window.location.host;
	    },
	    
	    /**
	     * 返回二维码服务端实现方式路径.
	     */
	    getQRCodeUrl:function(value, width) {
	    	if(width==null) {
	    		width = 100;
	    	}
	    	var url = "/grm/ecp/barcodeServlet?content="+value+"&barcodeTypeId=QR&width="+width+"&height=" + width
	    	return this.getLocaHost() + url;
	    },
	    /**
	     * 简易等待 wugang5
	     * var waiter = new Waiter();
	     * var first = function(){
	     * 		var dtd = waiter.Deferred();
	     * 		//模拟异步
	     * 		setTimeout(function(){
	     * 			 //异步完成
	     * 			 dtd.resolve();
	     * 		},5000);
	     * 		return dtd;
	     * };
	     * var second = function(){
	     * 		var dtd = waiter.Deferred();
	     * 		//模拟异步
	     * 		setTimeout(function(){
	     * 			 //异步完成
	     * 			 dtd.resolve();
	     * 		},1000);
	     * 		return dtd;
	     * }
	     * waiter.when(first(), second()).done(function () {
	     *		//dosomething
         *   }).fail(function () {
         *     console.log('fail');
         *  });
	     */
	    Waiter : function(){
	        var dfd = [],
	            doneArr = [],
	            failArr = [],
	            slice = [].slice,
	            that = this;
	        var Primise = function () {
	            this.resolved = false;
	            this.rejected = false;
	        };
	        Primise.prototype = {
	            resolve: function () {
	                this.resolved = true;
	                if (!dfd.length) return;
	                //删除已经执行的
	                for (var i = dfd.length - 1; i >= 0; i--) {
	                    if (dfd[i] && !dfd[i].resolved || dfd[i].rejected) {
	                        return;
	                    }
	                    dfd.splice(i, 1);
	                }
	                //任务全部完成，执行done
	                __exc(doneArr);
	            },
	            reject: function () {
	                this.rejected = true;
	                if (!dfd.length) return;
	                dfd.splice(0);
	                __exc(failArr);
	            }
	        };
	        that.Deferred = function () {
	            return new Primise();
	        };
	        function __exc(arr) {
	            var i = 0,
	                j = arr.length;
	            for (; i < j; i++) {
	                try {
	                    arr[i] && arr[i]();
	                } catch (e) {
	                	//不处理
	                }
	            }
	        }
	        that.when = function () {
	            dfd = slice.call(arguments);
	            var i = dfd.length;
	            for (--i; i >= 0; i--) {
	                if (!dfd[i] || dfd[i].resolved || dfd[i].rejected || !dfd[i] instanceof Primise) {
	                    dfd.splice(i, 1);
	                }
	            }
	            return that;
	        };
	        that.done = function () {
	            doneArr = doneArr.concat(slice.call(arguments));
	            return that;
	        };
	        that.fail = function () {
	            failArr = failArr.concat(slice.call(arguments));
	            return that;
	        };
	    },
		/**
		* 格式化number数据,返回指定格式的数据，包括金额中英文，中文大小写、百分比等等。
		* (该方法有瑕疵)
		* @example
		* #金额格式化
		*   var m = utils.formatData({code:"@money#2#￥#**"},12345.456); // m="￥12,345.46*"
		*   
		* #数值
		*   var m = utils.formatData({code:"@numerical#2#1#**"},12345.456); // m="12,345.46*"
		*   var m = utils.formatData({code:"@numerical#2#0#**"},12345.456); // m="12345.46*"
		*   
		* #科学计数
		*   var e = utils.formatData({code:"@kxjs#2#},12345.456); // m="1.23e+4"  
		*   
		* #百分比
		*   var p = utils.formatData({code:"@percent#2"},80.345,true); // p= "80.35%"
		*   var p = utils.formatData({code:"@percent#2"},0.80345); // p= "80.35%"
		*   var p = utils.formatData({code:"@perthoursand#2"},80.345); // p= "80.35‰"
		*   
		*  #中文数字或金额 
		*   var m = utils.formatData({code:"@zwdxx#chineseUpper"},80.345); // m= "捌拾点叁佰肆拾伍"
		*   var m = utils.formatData({code:"@zwdxx#chineseLower"},80.345); // m= "八十点三百四十五"
		*   var m = utils.formatData({code:"@zwdxx#chineseMoney"},80.345); // m= "捌拾圆叁角肆分伍厘"
		*   
		* @param {Object|String} format 格式，
		* @param {Number|String} value 数据
		* @param {Boolean} [per]  value是否已经是百分比
		* @return {String} 格式化字符串
		* @author yangwenyi@ygsoft.com
		* @date 2014.8.2
		* 
		*/
		formatData : function (format ,value, per){
				//格式为空
			if(!format || value==null){return value}
			if(!$.isPlainObject(format)){
				format = $.parseJSON(format);
			}
			//获取格式code
			var formatCode = format.code ? format.code :"",
				value = parseFloat(value);
			//格式code为空，返回value
			if(!formatCode){return value}
			if(formatCode.indexOf("@money") > -1){
				var rules = formatCode.split("#");
				//获取小数位
				var precision = parseInt(rules[1]),
					currencyFormat =rules[2],
					styleFormat =rules[3] ;
				return styleFormat.replace("*" , (currencyFormat + value.format(precision)));
			}else if(formatCode.indexOf("@percent") > -1){
				//百分比处理
			
				var rules = formatCode.split("#");
				//获取小数位
				var precision = parseInt(rules[1]);
//				//根据格式返回处理后的值  
//				if(!per && this.notEmpty(precision)){
//					return (parseFloat(value)*100).toFixed(precision)+"%";
//				}
				return parseFloat(value).toFixed(precision)+"%";
			}else if(formatCode.indexOf("@perthoursand")>-1){ //与%怎么逻辑不对称？ by yangwenyi
				//千分比处理
			
				var rules = formatCode.split("#");
				//获取小数位
				var precision = parseInt(rules[1]);
				//根据格式返回处理后的值   
				return parseFloat(value).toFixed(precision)+"‰";
			}else if(formatCode.indexOf("@kxjs")>-1){
				var rules = formatCode.split("#");
				//获取小数位
				var precision = parseInt(rules[1]);
				//根据格式返回处理后的值   
				return value.toExponential(precision);
			}else if(formatCode.indexOf("@numerical")>-1){
				var rules = formatCode.split("#"),
					styleFormat = rules[3],
					kilobit = rules[2],sfMark,
					precision = parseInt(rules[1]);//获取小数位
				//处理负数
				if(value && (""+value).indexOf("-")>=0){
					if(this.notEmpty(styleFormat)){
						sfMark = true;
						if(styleFormat.indexOf("-")>=0){
							styleFormat = styleFormat.replace("-","");
						}else if(styleFormat.indexOf("(")>=0){
							value = -value;	
						}
					}
				}
				if(kilobit=="1"){
					return sfMark === true ? styleFormat.replace("*" , value.format(precision)) : value.format(precision);
				}else{
					return sfMark === true ? styleFormat.replace("*" ,value.toFixed(precision)) : value.toFixed(precision);
				}
				/*var rules = formatCode.split("#"),
				styleFormat =rules[3],
				kilobit = rules[2],
				precision = parseInt(rules[1]);//获取小数位
				if(kilobit=="1"){
					value = value.format(precision);
				}else{
					value = value.toFixed(precision);
				}
				value = styleFormat.replace("*" , value);//仅替换第一个*
				return value.replace("--",""); //如果有双-,则变为正数*/
			}else if(formatCode.indexOf("@zwdxx")>-1){
				var rules = formatCode.split("#"),
				zwdxxFormat = rules[1];//获取小数位
				switch(zwdxxFormat){
					case "chineseUpper" : 
						return this.transferNumToChUpper(value);
						break;
					case "chineseLower" :
						return this.transferNumToChLower(value);
						break;
					case "chineseMoney" :
						return this.transferNumToMoney(value);
						break;
				}
			}
			return value;
		},
		
		/**
		 * 通过key获得值.
		 * (导出数据专用)
		 */
		getValueByKey: function(key,obj){
			if(!key || !obj){
				return null;
			}
			key = key.split(".");
			if(key.length==1){
				return obj[key[0]];
			}else{
				if(obj[key[0]]){
					return obj[key[0]][key[1]];
				}else{
					return null;
				}
			}
		},
		/**
		 * 获取导出数据.
		 * (导出数据专用)
		 * @param {Array} primarys 字段名称 例如：['dxmc','dwmc','msg']
		 * @param {Array} ordata 数据源 [{dxmc:"职工",dwmc:"珠海远光","msg":"春节祝福xxxx"}]
		 * @param {Array} primaryDt 对象数组 例如：[{s:"c",dt:'string'},{s:"c",dt:'string'},{s:"c",dt:'string'}];
		 */
		getExportData: function(primarys,ordata,primaryDt){
			var me = this;
			var sheetData = [];
			if($.type(ordata) ==="array" && $.type(primarys) ==="array"){
				$.each(ordata,function(i,obj){
					var rowData=[];//每行记录
					for(var k=0,len=primarys.length; k<len; k++){
						var text = me.getValueByKey(primarys[k],obj);
						if(primaryDt && primaryDt[k]){
							var primaryObj = primaryDt[k];
							if(primaryObj.dt =='number'){
								text = text ? text : 0 ;
								rowData.push({text : me.formatNumber(text,2) , dt:'number', s : primaryObj.s});
							}else{
								rowData.push({text : text , dt : primaryObj.dt, s : primaryObj.s});							
							}
						}else{
							rowData.push(text);
						}
					}
					sheetData.push(rowData);
				});
			}
			return sheetData;
		},
		/**
		 * 身份证.
		 */
		isIDCard:function(value) {
			return /^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/.test(value);
		},
		/**
		 * 电话号
		 */
		isTele:function(value) {
			return /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/.test(value);
		},
		/**
		 * 手机号.
		 */
		isMobile:function(value) {
			return /^1[34578]\d{9}$/.test(value);
		},
		/**
		 * 电子邮箱.
		 */
		isEmail:function(value) {
			return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value);
		},
		/**
		 * 邮政编码.
		 */
		isPostid:function(value) {
			return /[1-9]\d{5}(?!\d)/.test(value);
		},
		/**
		 * 较难数据
		 */
		validate:function(validate, value) {
			var show = true;
			var valiMsg = "";
			if(this.notEmpty(validate) && this.notEmpty(value)) {				
				if(/^email$/i.test(validate)) {
					show = this.isEmail(value);
					valiMsg = i18n.qzz.emailVali;
				} else if(/^telePhone$/i.test(validate)) {
					show = this.isTele(value);
					valiMsg = i18n.qzz.teleVali;
				} else if(/^mobileTelePhone$/i.test(validate)) {
					show = this.isMobile(value);
					valiMsg = i18n.qzz.mobileVali;
				} else if(/^postboat$/i.test(validate)) {
					show = this.isPostid(value);
					valiMsg = i18n.qzz.postVali;
				} else if(/^idcard$/i.test(validate)) {
					show = this.isIDCard(value);
					valiMsg = i18n.qzz.idcardVali;
				} else {
					return {"state":false, "message":""};
				}
			}
			return {"state":show, "message":valiMsg};
		},
		
		/**
		  * 设置焦点位置
		  * @example
		     utils.setFocusPosition($("#fullname"),true); //焦点设在id为fullname的输入控件上，并且全选其文字
		     utils.setFocusPosition($("#fullname"),false); //焦点设在id为fullname的输入控件文字最后
		     
		  * @param {JQuery} $input 控件
		  * @param {Boolean}  bool true全选，false焦点在最后一个字符
		  * @author yangwenyi@ygsoft.com
		 *  @date 2017-01-04
		  */ 
		setFocusPosition : function($input,bool) {
			if ($input.length > 0) {
				if ($input.is(":hidden")) {
					return;
				}
				var input = $input[0],
				    len = input.value.length,
				    len0 = bool? 0 : len;
		        if (input.setSelectionRange) {//FF
		        	input.focus();
		        	input.setSelectionRange(len0, len);
		        } else if (input.createTextRange) {//IE
		            var range = input.createTextRange();
		            range.collapse(true);
		            range.moveStart('character', len0);
		            range.moveEnd('character', len);
		            range.select();
		            range = null;
		        }
		        input = null;
			}
		}
    };
    return utils;
});