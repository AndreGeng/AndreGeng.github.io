angular.module('MyBlog')
  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
    $stateProvider
      .state("Home", {
        url: "/posts",
        templateUrl: "templates/home.html"
      })
      .state("PostDetail", {
        url: "/posts/{id:[0-9]+}",
        templateUrl: "templates/postdetail.html"
      })
      .state("Hello!", {
        url: "/aboutme",
        templateUrl: "templates/hello.html"
      });

      $urlRouterProvider.otherwise('/posts');
  }]);