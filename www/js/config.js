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
  .state('app.questbook', {
    url: '/questbook',
    views: {
      'menuContent' :{
        templateUrl: "templates/questbook.html"
      }
    },
    onEnter: function(){
      console.log("questbook");
    }
  })
  .state('app.skills', {
    url: '/skills',
    views: {
      'menuContent' :{
        templateUrl: "templates/skills.html"
      }
    },
    onEnter: function(){
      console.log("skills");
    }
  })
  .state('app.skill', {
    url: '/skill',
    views: {
      'menuContent' :{
        templateUrl: "templates/skill.html"
      }
    },
    onEnter: function(){
      console.log("skill");
    }
  })
  .state('app.questline_show', {
    url: '/questline/show',
    views: {
      'menuContent' :{
        templateUrl: "templates/questline/show.html"
      }
    },
    onEnter: function(){
      console.log("questline show");
    }
  })
  .state('app.quest_new', {
    url: '/quest/new',
    views: {
      'menuContent' :{
        templateUrl: "templates/quest/new.html"
      }
    },
    onEnter: function(){
      console.log("quest new");
    }
  })
  
  $urlRouterProvider.otherwise(function ($injector, $location) {
    var $state = $injector.get("$state");
    $state.go("signin");
  });
});