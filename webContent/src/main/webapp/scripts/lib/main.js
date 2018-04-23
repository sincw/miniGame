(function () {
    require.config({
        //define all js file path base on this base path  
        //actually this can setting same to data-main attribute in script tag  
        //定义所有JS文件的基本路径,实际这可跟script标签的data-main有相同的根路径  

        //baseUrl: 'G:/arithmetic/LackOfOneSquaredUp/typescript/LackOfOneSquaredUp/webContent/src/main/webapp'
        baseUrl: './'
        //define each js frame path, not need to add .js suffix name  
        //定义各个JS框架路径名,不用加后缀 .js  
            ,
        paths: {
            "jquery": "../../scripts/lib/jquery.min"//把对应的 jquery 这里写对即可  
                ,
            "bootstrap": "../../scripts/lib/bootstrap",
            "angular": "../../scripts/lib/angular.min",
            "utils": "../../scripts/base/common/utils"

        }

        //include NOT AMD specification js frame code  
        //包含其它非AMD规范的JS框架  
        ,
        shim: {
            'angular': {
                exports: 'angular'
            }
        }

    });
})(this);
