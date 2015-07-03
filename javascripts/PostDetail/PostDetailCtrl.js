angular.module('MyBlog')
  .controller('PostDetailCtrl', ['$scope', 'PostList', function ($scope, PostList) {
    $scope.model = {
      postDetailUrl: ''
    };
    PostList.get().then(function(data){
        $scope.model.postDetailUrl = data.postContent||'';
    }, function(data){
      console.log(data);
    });
  }]);