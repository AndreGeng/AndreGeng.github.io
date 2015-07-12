angular.module('MyBlog')
    .directive('loader', [function() {
        return {
            restrict: 'A',
            template: '<div class="inner-circles-loader">Loading… < /div>',
            link: function(scope, iElement, iAttrs) {
                scope.$on('loader_show', function() {
                    return iElement.show();
                });
                scope.$on('loader_hide', function() {
                    return iElement.hide();
                });
            }
        };
    }])
