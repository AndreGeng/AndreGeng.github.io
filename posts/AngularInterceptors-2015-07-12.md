AngularJs中的$http服务允许我们方便的和后台进行HTTP通信。我们有时会有统一的捕获http request或是处理http response的需求，例如：在request发到server端前在header中加入sessionid, 在获得response后统一的对错误进行log记录， 又或者当页面在请求数据时自动的显示一个loading spinner等等。Angular的拦截器正是为这种情况所准备的。这里我们就来介绍angular中的拦截器。
#拦截器简介

$httpProvider服务中包含有一组拦截器。换句话说Angular中的拦截器就是一个加入到$httpProvider拦截器数组中的一个服务。

    // register the interceptor as a service
    $provide.factory('myHttpInterceptor', function($q, dependency1, dependency2) {
        return {
            // optional method
            'request': function(config) {
                // do something on success
                return config;
            },

            // optional method
            'requestError': function(rejection) {
                // do something on error
                if (canRecover(rejection)) {
                    return responseOrNewPromise
                }
                return $q.reject(rejection);
            },



            // optional method
            'response': function(response) {
                // do something on success
                return response;
            },

            // optional method
            'responseError': function(rejection) {
                // do something on error
                if (canRecover(rejection)) {
                    return responseOrNewPromise
                }
                return $q.reject(rejection);
            }
        };
    });

    $httpProvider.interceptors.push('myHttpInterceptor');

拦截器允许我们：

**通过提供request方法来拦截一个request.**这个方法会在$http发送到后台前被调用，它会提供给我们一个config参数，（config中会包含请求的url, method, header, etc）我们可以任意对config做更改，*request方法必须返回config或是返回一个promise*, 返回其它的值会导致$http请求失败。

**通过提供response方法来拦截一个server端返回的response.**同样这个方法会在server端数据返回后，$http回调方法前被调用。方法的参数是response对象（主要是包含config对象，返回的数据，response status，etc）.

**通过提供requestError来拦截请求出错的情况。**当请求被上一个拦截器所拒绝时这个方法会被调用。例如：在上一个拦截器中request方法返回的promise被reject的时候，但具体应用还没涉及到，用过的朋友烦请comment中告知下。。

**通过提供responseError来拦截server端返回的错误。**一般用于log日志，或是重试机制。

#拦截器中的异步操作

直接上code

    module.factory('myInterceptor', ['$q', 'someAsyncService', function($q, someAsyncService) {
        var requestInterceptor = {
            request: function(config) {
                var deferred = $q.defer();
                someAsyncService.doAsyncOperation().then(function() {
                    // Asynchronous operation succeeded, modify config accordingly
                    ...
                    deferred.resolve(config);
                }, function() {
                    // Asynchronous operation failed, modify config accordingly
                    ...
                    deferred.reject(config);
                });
                return deferred.promise;
            }
        };

        return requestInterceptor;
    }]);


#拦截器应用
###Session注入
我们知道基本上有两种方式来实现server端验证，采用cookie或是采用token。关于这两个的区别未涉及的同学可以自行脑补下：[Cookie vs Token][Cookie vs Token]

    module.factory('sessionInjector', ['SessionService', function(SessionService) {
        var sessionInjector = {
            request: function(config) {
                if (!SessionService.isAnonymus) {
                    config.headers['x-session-token'] = SessionService.token;
                }
                return config;
            }
        };
        return sessionInjector;
    }]);
    module.config(['$httpProvider', function($httpProvider) {
        $httpProvider.interceptors.push('sessionInjector');
    }]);

###加载数据时，显示spinner
我们有时页面上会同时有不止一个异步任务在进行，这时spinner的显示和取消是个比较麻烦的事情，采用interceptor会让这种情况变的更合理也更简单。

    angular.module('MyBlog')
        .factory('globalInteceptor', ['$log', '$q', '$rootScope', function ($log, $q, $rootScope) {

            var numLoadings = 0;

            return {
                request: function(config){
                    numLoadings++;
                    //show loadings
                    $rootScope.$broadcast("loader_show");
                    return config;
                },

                response: function(response){
                    if ((--numLoadings) <= 0) {
                        //hide loadings
                        $rootScope.$broadcast("loader_hide");
                    }

                    return response;
                },

                responseError: function (response) {

                    if ((--numLoadings) <= 0) {
                        // Hide loader
                        $rootScope.$broadcast("loader_hide");
                    }

                    if (response.status != 200){
                        $log.error(response);
                    }

                    return $q.reject(response);
                }
            };
        }]);
**注意：**别忘了出错时也要取消spinner哦。

#结语
这里简介了Angular中拦截器的一些用法，其实也还有一些其它的应用像出错时的重试机制这种。大家可以自行摸索下。

Reference: [interceptors-in-angularjs-and-useful-examples][interceptors-in-angularjs-and-useful-examples]

[interceptors-in-angularjs-and-useful-examples]: http://www.webdeveasy.com/interceptors-in-angularjs-and-useful-examples/
[Cookie vs Token]: https://auth0.com/blog/2014/01/07/angularjs-authentication-with-cookies-vs-token/