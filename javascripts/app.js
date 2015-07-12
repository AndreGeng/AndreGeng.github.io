angular.module('MyBlog', ['ui.router'])
    .config(['$interpolateProvider', '$httpProvider', '$locationProvider', function($interpolateProvider, $httpProvider, $locationProvider) {
        $interpolateProvider.startSymbol('[[');
        $interpolateProvider.endSymbol(']]');

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
        $httpProvider.interceptors.push('globalInteceptor');
    }]);