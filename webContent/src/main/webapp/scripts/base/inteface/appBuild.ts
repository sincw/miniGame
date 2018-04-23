/*
 * @author:wangxingkai
 * @date:2018.03.15
 * @version:1.0.0
 */
namespace sinc.squaredup.model.base {
    /**
	 * 构建APP的构建器接口
	*/
    export interface AppBuilder {
        /**
		 *  app模块
		*/
        app: ng.IModule;
        /**
		 * 初始化
		*/
        init: () => void;
        /**
		 * 启动应用
		*/
        start: () => void;
        /**
		 * 销毁应用
		*/
        destory: () => void;

        /**
		 * 添加控制器
		 * @param {string} controllerName 控制器名
		 * @param {any[]} inlineAnnotatedConstructor 
		 */
        addController: (controllerName: string, inlineAnnotatedConstructor: Function | any[]) => AppBuilder;

        /**
		 * 添加共享服务
		 * @param {string} serviceName 服务名
		 * @param {any[]} inlineAnnotatedConstructor
		 */
        addService: (serviceName: string, inlineAnnotatedConstructor: Function | any[]) => AppBuilder;

        /**
		 * 添加过滤器
		 * @param {string} name 过滤器名
		 * @param {Function} filterFactoryFunction
		 */
        addFilter: (filterName: string, filterFactoryFunction: any[] | Function) => AppBuilder;

        /**
		 * 添加指令
		 * @param {string} name 指令名称
		 * @param {ng.IDirectiveFactory} directiveFactory
		 */
        addDirective: (name: string, directiveFactory: any[] | ng.IDirectiveFactory) => AppBuilder;

        /**
        * 添加常量
        * @param name
        * @param value
        */
        addConstant(name: string, value: any): AppBuilder;

    }
}