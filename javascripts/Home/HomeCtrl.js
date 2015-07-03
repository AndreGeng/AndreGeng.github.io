angular.module('MyBlog')
    .config(['$interpolateProvider', function($interpolateProvider) {
        $interpolateProvider.startSymbol('[[');
        $interpolateProvider.endSymbol(']]');
    }])
    .controller('HomeCtrl', ['$scope', 'PostList', '$state', function($scope, PostList, $state) {
        $scope.model = {
            postList: []
        };

        PostList.fetch().then(function(data) {
            $scope.model.postList = data;
        }, function(data) {
            console.log(data);
        });

        $scope.goPostDetail = function(detailItem) {
            $state.go('PostDetail', {
                id: detailItem.id
            });
        };
    }]);
