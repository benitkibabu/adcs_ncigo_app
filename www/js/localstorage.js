angular.module('ionic.utils', [])
.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
       return JSON.parse($window.localStorage[key] || '{}');
      //return $window.localStorage[key];
    },
    removeByIndex: function(key){
      $window.localStorage.removeItem($window.localstorage.key(key));
    },
    removeItem: function(key){
      $window.localStorage.removeItem(key);
    }
  }
}]);
