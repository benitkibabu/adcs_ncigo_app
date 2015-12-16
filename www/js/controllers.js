
angular.module('starter.controllers',[])

.controller('LoginCtrl', function($scope, $state, $localstorage, LoginStatus, StudentLogin, MyDeviceID, 
  $ionicPopup, $ionicHistory){
  $scope.$on('$ionicView.enter', function(e) {
    $ionicHistory.clearCache();
    $ionicHistory.clearHistory();
    if(LoginStatus.isLoggedIn() == "true"){
      $state.go('tab.updates');
    }
  });

  $scope.loginData = {};

  $scope.doLogin = function() {
    //!angular.isUndefined($scope.loginData)
    if($scope.loginData.username == ''){
      var alertPopup = $ionicPopup.alert({
        title: 'Empty fields!',
        template: $scope.loginData.username
      })
    }
    else{
      StudentLogin.loginUser($scope.loginData.username, $scope.loginData.password, 
        MyDeviceID.getDeviceId(), $scope.loginData.course)
      .success(function(data){
        if(!data.error){
          console.log("Success")
          console.log(data)
          if(data[0].student_no =="" || data[0].password ==""){
            var alertPopup = $ionicPopup.alert({
              title: 'Login Failed',
              template: 'Please check your credential'
            })
          }else{
            var user = {
              number: data[0].student_no,
              email : data[0].student_email,
              password: data[0].password,
              device_id : data[0].reg_id,
              course : data[0].course
            };

            $localstorage.set('isLoggedIn', 'true');
            $localstorage.setObject('user', user);
            $state.go('tab.updates');
          }

        }else{
          var alertPopup = $ionicPopup.alert({
            title: 'Login Failed',
            template: 'Please check your credential'
          })
          alertPopup.then(function(res) {
          })
        }      
      });
    }    
  };
})

.controller('DashCtrl', function($scope, NciUpdates, $ionicPopup, LoginStatus, $state, $ionicHistory) {
  
  $scope.$on('$ionicView.enter', function(e) {
    if(LoginStatus.isLoggedIn() =="false"){
      $state.go("login");
    }
  });

  $scope.status = "Logout";
  $scope.notification = NciUpdates.all();

  $scope.remove = function(update) {
    var alertPopup = $ionicPopup.confirm({
      title: 'Removing -> ' + update.title,
      template: 'Are you sure?'
    });
    alertPopup.then(function(res) {
      if(res) {
        NciUpdates.remove(update);
      } else {
        console.log('You are not sure');
      }
    });
  };

  $scope.doRefresh = function(){
    var upates = NciUpdates.all();
    $scope.notification = upates;
    $scope.$broadcast('scroll.refreshComplete');
  }

})

// Reminder Controller
.controller('NewReminderCtrl', function($scope, SaveReminder, $filter, $state) {

  var weekDaysList = ["Sun", "Mon", "Tue", "Wed", "thu", "Fri", "Sat"];
  var disabledDates = [
    new Date(1437719836326),
    new Date(),
    new Date(2015, 7, 10), //months are 0-based, this is August, 10th!
    new Date('Wednesday, August 12, 2015'), //Works with any valid Date formats like long format
    new Date("08-14-2015"), //Short format
    new Date(1439676000000) //UNIX format
  ];

  var monthList = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
  
  $scope.datepickerObject = {
    titleLabel: 'Title',  //Optional
    todayLabel: 'Today',  //Optional
    closeLabel: 'Close',  //Optional
    setLabel: 'Set',  //Optional
    setButtonType : 'button-assertive',  //Optional
    todayButtonType : 'button-assertive',  //Optional
    closeButtonType : 'button-assertive',  //Optional
    inputDate: new Date(),  //Optional
    mondayFirst: true,  //Optional
    disabledDates: disabledDates, //Optional
    weekDaysList: weekDaysList, //Optional
    monthList: monthList, //Optional
    templateType: 'popup', //Optional
    showTodayButton: 'true', //Optional
    modalHeaderColor: 'bar-positive', //Optional
    modalFooterColor: 'bar-positive', //Optional
    from: new Date(2012, 8, 2), //Optional
    to: new Date(2018, 8, 25),  //Optional
    callback: function (val) {  //Mandatory
      datePickerCallback(val);
    },
    dateFormat: 'dd-MM-yyyy', //Optional
    closeOnSelect: false, //Optional
  };

  var when = "";
  var datePickerCallback = function (val) {
    if (typeof(val) === 'undefined') {
      console.log('No date selected');
    } else {
      when = $filter('date')(val, 'dd-MM-yyyy');
      console.log('Selected date is : ', when)
    }
  };

  $scope.reminder = {};

  $scope.saveReminder = function(){
    var array = [];
    var old = SaveReminder.getReminder();
    console.log("old", old);
    if(old != null && old.length > 0){
      array = old;
    }
    var newR = {
      title: $scope.reminder.title,
      body:  $scope.reminder.body,
      when:  when
    }
    array.push(newR);
    SaveReminder.setReminder(array);
    $state.go("tab.reminder")
  }
})

.controller('ReminderCtrl', function($scope, SaveReminder) {

  $scope.shouldShowDelete = true;
  $scope.listCanSwipe = false;
  $scope.items = SaveReminder.getReminder();// [{title:'Ben\'s Birthday soon ', content:'Better find some present'}];

  $scope.remove = function(item){
    $scope.items.splice(item, 1);
    SaveReminder.setReminder($scope.items);
    $scope.doRefresh();
  }

  $scope.doRefresh = function(){
    $scope.items = SaveReminder.getReminder();
    $scope.$broadcast('scroll.refreshComplete');
  }
})

// Update Detail Controller
.controller('UpdateDetailCtrl', function($scope, $stateParams, NciUpdates) {
  $scope.update = NciUpdates.get($stateParams.uId);
})

//Settings Controller
.controller('SettingsCtrl', function($scope, SaveSettings) {
  
  $scope.pref = SaveSettings.getPref();
  
  if($scope.pref == null){
    $scope.pref = {
      enableNotification: true,
      enableSound : true
    };
  }

  $scope.saveChanges = function(){
      SaveSettings.setPref($scope.pref);
  }
  
})

//Profile Controller
.controller('ProfileCtrl', function($scope, $localstorage, $state){

  var obj = $localstorage.getObject("user");
  $scope.user = obj;

  $scope.logout = function(){
    $localstorage.set("isLoggedIn", 'false');
    $localstorage.removeItem("user");
    $state.go("login");
  }

});
