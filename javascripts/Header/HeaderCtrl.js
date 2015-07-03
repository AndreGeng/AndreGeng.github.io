angular.module('MyBlog')
  .controller('HeaderCtrl', ['$scope', '$state', function ($scope, $state) {
    $scope.goHello = function(){
      $state.go('Hello!');
    };

    $scope.goHome = function(){
      $state.go('Home');
    };
  }]);