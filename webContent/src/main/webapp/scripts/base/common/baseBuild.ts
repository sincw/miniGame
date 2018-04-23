/*
 * @author:wangxingkai
 * @date:2018.03.18
 * @version:1.0.0
 * @descript:应用页面入口构建器
 */

import "angular";
import b = sinc.squaredup.model.base;

/**
 * App的构建器
 */
export class BasePage implements b.AppBuilder {
    app: ng.IModule;
    constructor(private appName: string, private requires?: Array<string>) {
        //创建应用模块
        this.app = angular.module(this.appName, this.requires ? this.requires : []);
        //初始化
        this.init();
    }
	/**
	 * 应用初始化
	 */
    init() {
       
    }

	/**
		 * 添加控制器
		 * @param {string} controllerName 控制器名
		 * @param {any[]} inlineAnnotatedConstructor 
		 */
    addController(controllerName: string, inlineAnnotatedConstructor: any[] | Function): b.AppBuilder {
        this.app.controller(controllerName, <any>inlineAnnotatedConstructor);
        return this;
    }
	/**
	 * 添加共享服务
	 * @param {string} serviceName 服务名
	 * @param {any[]} inlineAnnotatedConstructor
	 */
    addService(serviceName: string, inlineAnnotatedConstructor: any[] | Function): b.AppBuilder {
        this.app.factory(serviceName, <any>inlineAnnotatedConstructor);
        return this;
    }

	/**
	 * 添加过滤器
	 * @param {string} name 过滤器名
	 * @param {Function} filterFactoryFunction
	 */
    addFilter(filterName: string, filterFactoryFunction: any[] | Function): b.AppBuilder {
        this.app.filter(filterName, <any>filterFactoryFunction);
        return this;
    }

	/**
	 * 添加指令
	 * @param {string} name 指令名称
	 * @param {ng.IDirectiveFactory} directiveFactory
	 */
    addDirective(name: string, directiveFactory: any[] | ng.IDirectiveFactory): b.AppBuilder {
        this.app.directive(name, <any>directiveFactory);
        return this;
    }
    /**
     * 添加常量
     * @param name
     * @param value
     */
    addConstant(name: string, value: any): b.AppBuilder {
        this.app.constant(name, value);
        return this;
    }
    /**
     * 添加常量
     * @param name
     * @param value
     */
    addValue(name: string, value: any): b.AppBuilder {
        this.app.value(name, value);
        return this;
    }
	/**
	 * 启动应用
	 */
    start() {
        angular.bootstrap(document, [this.app.name]);
        console.info(this.app.name + " start...");
    }

	/**
	 * 销毁应用
	 */
    destory() {
        console.info(this.app.name +" destroy");
    }

}