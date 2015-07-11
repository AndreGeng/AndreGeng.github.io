angular.module('MyBlog')
    .controller('SidebarCtrl', ['$scope', 'PostList', '$state', function ($scope, PostList, $state) {
        $scope.model = {
            essentialPostList: [],
            latestPostList: []
        };

        PostList.fetch(5).then(function(data) {
            $scope.model.latestPostList = data;
        }, function(data) {
            console.log(data);
        });

        PostList.getEssentialPostList().then(function(data) {
            $scope.model.essentialPostList = data;
        }, function(data) {
            console.log(data);
        });

        $scope.goPostDetail = function(detailItem) {
            $state.go('PostDetail', {
                id: detailItem.id
            });
        };
    }]);
