app.config(function ($stateProvider, $urlRouterProvider){
  $stateProvider
  .state('signin',{
    url: '/signin',
    templateUrl: 'templates/signin.html',
    controller: 'SigninCtrl'
  })
  .state('app',{
    url: "/app",
    abstract: true,
    controller: 'AppCtrl',
    templateUrl: "templates/menu.html"
  })
  .state('app.profile', {
    url: '/profile',
    views: {
      'menuContent' :{
        templateUrl: "templates/profile.html"
      }
    },
    onEnter: function(){
      console.log("profile");
    }
  })
  .state('app.settings', {
    url: '/settings',
    views: {
      'menuContent' :{
        templateUrl: "templates/settings.html"
      }
    },
    onEnter: function(){
      console.log("settings");
    }
  })

  $urlRouterProvider.otherwise(function ($injector, $location) {
    var $state = $injector.get("$state");
    $state.go("signin");
  });
});