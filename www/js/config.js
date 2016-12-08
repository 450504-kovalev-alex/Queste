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
        templateUrl: "templates/profile.html",
        controller: "ProfileCtrl"
      }
    },
  })

  .state('app.search', {
    url: '/search',
    views: {
      'menuContent' :{
        templateUrl: "templates/search.html",
        controller: 'SearchCtrl'
      }
    },
  })

  .state('app.settings', {
    url: '/settings',
    views: {
      'menuContent' :{
        templateUrl: "templates/settings.html",
        controller: 'SettingsCtrl'
      }
    },
  })

  .state('app.stories', {
    url: '/stories',
    views: {
      'menuContent' :{
        templateUrl: "templates/story/show_all.html",
        controller: "StoriesCtrl"
      }
    },
  })
  .state('app.story', {
    url: '/story/:storyId',
    views: {
      'menuContent' :{
        templateUrl: "templates/story/show.html",
        controller: "StoryCtrl"
      }
    }
  })

  .state('app.quest_new', {
    url: '/story/:storyId/quests/new',
    views: {
      'menuContent' :{
        templateUrl: "templates/quest/new.html",
        controller: "QuestCtrl"
      }
    },
  })
 .state('app.quest_edit', {
    url: '/story/:storyId/quests/:questId/edit',
    views: {
      'menuContent' :{
        templateUrl: "templates/quest/new.html",
        controller: "QuestCtrl"
      }
    },
  })
  .state('app.quest_show', {
    url: '/story/:storyId/quests/:questId',
    views: {
      'menuContent' :{
        templateUrl: "templates/quest/show.html",
        controller: "QuestCtrl"
      }
    },
  })

  .state('app.skills', {
    url: '/skills',
    views: {
      'menuContent' :{
        templateUrl: "templates/skills/show_all.html",
        controller: "SkillsCtrl"
      }
    },
  })
  .state('app.skill', {
    url: '/skills/:skillId',
    views: {
      'menuContent' :{
        templateUrl: "templates/skills/show.html",
        controller: "SkillCtrl"
      }
    }
  })
  
  $urlRouterProvider.otherwise(function ($injector, $location) {
    var $state = $injector.get("$state");
    $state.go("signin");
  });
});