var isLoggedIn ;
angular.module('starter', ['ionic','ionic.service.core', 'starter.controllers', 'starter.services', 'ionic.utils', 'ionic-datepicker'])

.run(function($ionicPlatform, LoginStatus, MyDeviceID, $ionicPopup) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
      StatusBar.backgroundColorByHexString("#ef473a");
    }

    isLoggedIn = LoginStatus.isLoggedIn();

  });

  var showAlert = function(title, message) {
    var alertPopup = $ionicPopup.alert({
     title: title,
     template: ''+message
    });
    alertPopup.then(function(res) {
    });
  };

  var deviceInformation = ionic.Platform.device();

  var isWebView = ionic.Platform.isWebView();
  var isIPad = ionic.Platform.isIPad();
  var isIOS = ionic.Platform.isIOS();
  var isAndroid = ionic.Platform.isAndroid();
  var isWindowsPhone = ionic.Platform.isWindowsPhone();

  var currentPlatform = ionic.Platform.platform();
  var currentPlatformVersion = ionic.Platform.version();
  
  pushNotification = window.plugins.pushNotification;
 
  window.onNotification = function(e){
    if(e.event == "registered"){
      if(e.regid.length > 0){
        var device_token = e.regid;
        if(MyDeviceID.getDeviceId().length < 10){
          MyDeviceID.store(device_token);
        }
        //showAlert(MyDeviceID.getDeviceId());
      }
    }
    else if(e.event == "message"){
      showAlert('New Update', e.message);
    }
    else if(e.event == "error"){
      showAlert('error', 'error occured');
    }
    
  };

  window.errorHandler = function(error){
    showAlert('error','an error occured');
  }

  pushNotification.register(
    onNotification,
    errorHandler,
    {
      'badge': 'true',
      'sound': 'true',
      'alert': 'true',
      'ecb': 'onNotification',
      'senderID': '1059451623513',
  });
 })

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
    
  })
  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html',
    controller: 'DashCtrl'   
  })

  .state('tab.updates', {
    url: '/updates',
    views: {
      'tab-updates': {
        templateUrl: 'templates/tab-updates.html'
      }
    }
  })
  .state('tab.update-detail', {
      url: '/updates/:uId',
      views: {
        'tab-updates': {
          templateUrl: 'templates/update-detail.html',
          controller: 'UpdateDetailCtrl'
        }
      }
    })

  .state('tab.profile', {
    url: '/profile',
    views: {
      'tab-profile': {
        templateUrl: 'templates/profile.html',
        controller: 'ProfileCtrl'
      }
    }
  })

  .state('tab.reminder', {
    url: '/reminder',
    views: {
      'tab-reminder': {
        templateUrl: 'templates/tab-reminder.html',
        controller: 'ReminderCtrl'
      }
    }
  })

  .state('tab.new-reminder', {
    url: '/reminder/:id',
    views: {
      'tab-reminder': {
        templateUrl: 'templates/new-reminder.html',
        controller: 'NewReminderCtrl'
      }
    }
  })

  .state('tab.settings', {
    url: '/settings',
    views: {
      'tab-settings': {
        templateUrl: 'templates/tab-settings.html',
        controller: 'SettingsCtrl'
      }
    }
  });

  $urlRouterProvider.otherwise('/tab/updates');
  
});
