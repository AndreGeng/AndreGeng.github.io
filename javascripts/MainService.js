angular.module('MyBlog')
  .factory('PostList', ['$q', '$http', function ($q, $http) {

    return {
      fetch: function(){
        var deferred = $q.defer();

        $http.get('./data/PostList.json').success(function(data, status, headers, config){
          deferred.resolve(data);
        }).error(function(data, status, headers, config){
          deferred.reject(data);
        });
        return deferred.promise;
      }
    };
  }])