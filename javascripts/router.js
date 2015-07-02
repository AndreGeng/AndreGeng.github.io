angular.module('MyBlog', ['ui.router'])
  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
    $stateProvider
      .state("PostList", {
        url: "/posts",
        templateUrl: "templates/postlist.html"
      })
      .state("PostDetail", {
        url: "/posts/:id",
        templateUrl: "templates/postdetail.html"
      });

      $urlRouterProvider.when("", "/posts");
  }]);