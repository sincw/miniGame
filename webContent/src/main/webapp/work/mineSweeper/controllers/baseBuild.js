/*
 * @author:wangxingkai
 * @date:2018.03.18
 * @version:1.0.0
 * @descript:应用页面入口构建器
 */
"use strict";
require("angular");
/**
 * App的构建器
 */
var BasePage = (function () {
    function BasePage(appName, requires) {
        this.appName = appName;
        this.requires = requires;
        //创建应用模块
        this.app = angular.module(this.appName, this.requires ? this.requires : []);
        //初始化
        this.init();
    }
    /**
     * 应用初始化
     */
    BasePage.prototype.init = function () {
    };
    /**
         * 添加控制器
         * @param {string} controllerName 控制器名
         * @param {any[]} inlineAnnotatedConstructor
         */
    BasePage.prototype.addController = function (controllerName, inlineAnnotatedConstructor) {
        this.app.controller(controllerName, inlineAnnotatedConstructor);
        return this;
    };
    /**
     * 添加共享服务
     * @param {string} serviceName 服务名
     * @param {any[]} inlineAnnotatedConstructor
     */
    BasePage.prototype.addService = function (serviceName, inlineAnnotatedConstructor) {
        this.app.factory(serviceName, inlineAnnotatedConstructor);
        return this;
    };
    /**
     * 添加过滤器
     * @param {string} name 过滤器名
     * @param {Function} filterFactoryFunction
     */
    BasePage.prototype.addFilter = function (filterName, filterFactoryFunction) {
        this.app.filter(filterName, filterFactoryFunction);
        return this;
    };
    /**
     * 添加指令
     * @param {string} name 指令名称
     * @param {ng.IDirectiveFactory} directiveFactory
     */
    BasePage.prototype.addDirective = function (name, directiveFactory) {
        this.app.directive(name, directiveFactory);
        return this;
    };
    /**
     * 添加常量
     * @param name
     * @param value
     */
    BasePage.prototype.addConstant = function (name, value) {
        this.app.constant(name, value);
        return this;
    };
    /**
     * 添加常量
     * @param name
     * @param value
     */
    BasePage.prototype.addValue = function (name, value) {
        this.app.value(name, value);
        return this;
    };
    /**
     * 启动应用
     */
    BasePage.prototype.start = function () {
        angular.bootstrap(document, [this.app.name]);
        console.info(this.app.name + " start...");
    };
    /**
     * 销毁应用
     */
    BasePage.prototype.destory = function () {
        console.info(this.app.name + " destroy");
    };
    return BasePage;
}());
exports.BasePage = BasePage;
//# sourceMappingURL=baseBuild.js.map