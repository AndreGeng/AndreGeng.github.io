angular.module('MyBlog', ['ui.router'])
    .config(['$interpolateProvider', '$httpProvider', function($interpolateProvider, $httpProvider) {
        $interpolateProvider.startSymbol('[[');
        $interpolateProvider.endSymbol(']]');

        $httpProvider.interceptors.push('globalInteceptor');
    }]);