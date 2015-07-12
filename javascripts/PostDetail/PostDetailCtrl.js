angular.module('MyBlog')
  .controller('PostDetailCtrl', ['$scope', 'PostList', '$location', '$window', function ($scope, PostList, $location, $window) {
    $scope.model = {
      postDetailUrl: ''
    };
    PostList.get().then(function(data){
        $scope.model.postDetailUrl = data.postContent||'';
    });


  }]);