angular.module('MyBlog')
  .factory('PostList', ['$q', '$http', '$stateParams', function ($q, $http, $stateParams) {
    var convertFormat = function(data){
      data.postContent = data.postContent.replace('.md', '.html');
      data.postContent = 'digested_posts/' + data.postContent;
      return data;
    };
    return {
      fetch: function(){
        var deferred = $q.defer();

        $http.get('./data/PostList.json').success(function(data, status, headers, config){
          deferred.resolve(data);
        }).error(function(data, status, headers, config){
          deferred.reject(data);
        });
        return deferred.promise;
      },

      fetchWithLimit: function(limitNum){
        var deferred = $q.defer();

        $http.get('./data/PostList.json').success(function(data, status, headers, config){
          deferred.resolve(data.slice(0,limitNum));
        }).error(function(data, status, headers, config){
          deferred.reject(data);
        });
        return deferred.promise;
      },

      getEssentialPostList: function(){
        var deferred = $q.defer();

        $http.get('./data/PostList.json').success(function(data, status, headers, config){
          var essentialPostList = data.filter(function(item){
            return item.essential;
          });
          deferred.resolve(essentialPostList);
        }).error(function(data, status, headers, config){
          deferred.reject(data);
        });
        return deferred.promise;
      },

      get: function(id){
        var deferred = $q.defer();
        $http.get('./data/PostList.json').success(function(data, status, headers, config){
          for(var i=0;i<data.length;i++){
            var entry = data[i];
            if(entry.id == $stateParams.id){
              deferred.resolve(convertFormat(entry));
              break;
            }
          }
        }).error(function(data, status, headers, config){
          deferred.reject(data);
        });

        return deferred.promise;
      }
    };
  }])