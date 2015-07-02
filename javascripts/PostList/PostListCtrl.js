angular.module('MyBlog')
  .config(['$interpolateProvider', function ($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
  }])
  .controller('PostListCtrl', ['$scope', 'PostList', function ($scope, PostList) {
    $scope.model = {
      postList: []
    };
    PostList.fetch().then(function(data){
      $scope.model.postList = data;
    }, function(data){
      console.log(data);
    });
  }]);
