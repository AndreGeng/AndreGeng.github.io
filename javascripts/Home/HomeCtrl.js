angular.module('MyBlog')
    .controller('HomeCtrl', ['$scope', 'PostList', '$state', function($scope, PostList, $state) {
        $scope.model = {
            postList: []
        };

        PostList.fetch().then(function(data) {
            $scope.model.postList = data;
        });

        $scope.goPostDetail = function(detailItem) {
            $state.go('PostDetail', {
                id: detailItem.id
            });
        };
    }]);
