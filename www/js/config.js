app.config(function ($stateProvider, $urlRouterProvider){
  $stateProvider
  .state('signin',{
    url: '/signin',
    templateUrl: 'templates/signin.html',
    controller: 'SigninCtrl'
  })
  .state('profile',{
    url: '/profile',
    templateUrl: 'templates/profile.html',
    controller: 'ProfileCtrl'
  })
  .state('settings',{
    url: '/settings',
    templateUrl: 'templates/settings.html',
    controller: 'SettingsCtrl'
  })
  
  $urlRouterProvider.otherwise(function ($injector, $location) {
    var $state = $injector.get("$state");
    $state.go("signin");
  });
});