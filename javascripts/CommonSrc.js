angular.module('MyBlog')
    .factory('globalInteceptor', ['$log', '$q', '$rootScope', function ($log, $q, $rootScope) {

        var numLoadings = 0;

        return {
            request: function(config){
                numLoadings++;
                //show loadings
                $rootScope.$broadcast("loader_show");
                return config;
            },

            response: function(response){
                if ((--numLoadings) <= 0) {
                    //hide loadings
                    $rootScope.$broadcast("loader_hide");
                }

                return response;
            },

            responseError: function (response) {

                if ((--numLoadings) <= 0) {
                    // Hide loader
                    $rootScope.$broadcast("loader_hide");
                }

                if (response.status != 200){
                    $log.error(response);
                }

                return $q.reject(response);
            }
        };
    }]);