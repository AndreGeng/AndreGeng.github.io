angular.module('MyBlog', ['ui.router'])
    .config(['$interpolateProvider', '$httpProvider', '$locationProvider', '$urlMatcherFactoryProvider', function($interpolateProvider, $httpProvider, $locationProvider, $urlMatcherFactoryProvider) {
        $interpolateProvider.startSymbol('[[');
        $interpolateProvider.endSymbol(']]');

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
        $urlMatcherFactoryProvider.strictMode(false)
        $httpProvider.interceptors.push('globalInteceptor');
    }]);