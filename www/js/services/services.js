angular.module('starter.services', [])
.factory('StudentLogin',function($http, $httpParamSerializerJQLike){
  return {
    loginUser: function(number,pass,device_id,mcourse) {
      return $http({
        method:'POST',
        url:'http://bendev.gear.host/api/student.php',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        data :$httpParamSerializerJQLike({
          tag : 'student',
          student_no: number,
          email : number+"@student.ncirl.ie",
          password : pass,
          reg_id : device_id,
          course : mcourse
        })
      });
    }
  }
})

.factory('NciUpdates', function($http){
  var update = [];
  
  return {
    all: function() {
      update = [];
      $http.get('http://bendev.gear.host/api/?tag=getUpdates')
      .success(function(data){
        console.log(data)
        var jsonArray = data.result;
        for(var i=0; i<jsonArray.length; i++){
          var upd = jsonArray[i];
          update.push(upd);
        }
      })
      return update;
    },
    remove: function(item){
      update.splice(update.indexOf(item), 1);
    },
    get: function(id) {
      for (var i = 0; i < update.length; i++) {
        if (parseInt(update[i].id) === parseInt(id)) {
          return update[i];
        }
      }
      return null;
    }
  }
});
