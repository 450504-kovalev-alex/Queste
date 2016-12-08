describe('questService', function(){
  var QuestMock;
  var customref = {
    users: {
      test: {
        stories: {
          test: {
            quests: {}
          },
          story1: {
            quests: {}
          }
        }
      }
    }
  };

  var ref = function(){
    return {
      child: function(data){
        return{
          update: function(questData){
            var d = data.split('/');
            customref[d[0]][d[1]][d[2]][d[3]][d[4]][d[5]] = questData;
          },
          set: function(questData){
            var d = data.split('/');
            customref[d[0]][d[1]][d[2]][d[3]][d[4]][d[5]] = questData;
          },
          push: function(){
            return{
              key: "test"
            }
          },
          remove: function(){
            var d = data.split('/');
            delete customref[d[0]][d[1]][d[2]][d[3]][d[4]][d[5]];
          }
        }
      }
    }
  }

  var mockUserService = function() {
    return {
      getUser: function() {
        return { $id: "test" };
      }
    }
  }

  var mockStoryService = function() {
    return {
      getStories: function() {
        return  [
        {
          id: "story1", 
          name: "Story 1",
          quests: {
            "quest1": {
              name: "Quest 1"
            },
            "quest2": {
              name: "Quest 2"
            }
          }
        },
        {
          id: "story2",
          name: "Story 2",
          quests: {
            "quest3": {
              name: "Quest 3"
            },
            "quest4": {
              name: "Quest 4"
            }
          }
        }
        ];
      }
    }
  }

  var mockFirebaseArray = function() {
    return {
      $loaded: function() {
        return {
          then: function(cb) { 
            var s = [
            {id: "story1", name: "Story 1"},
            {id: "story2", name: "Story 2"}
            ]
            QuestMock.setStories(s);
            s.forEach(function(element) {
              customref['users']['test']['stories'][element.id] = {name: element.name} ;
            });
          }
        }
      }
    }
  }


  beforeEach(module('queste', 'firebase'));

  beforeEach(module(function($provide) {
    $provide.service('userService', mockUserService);
    $provide.service('storyService', mockStoryService);
    $provide.value('$firebaseArray', mockFirebaseArray);
    $provide.value('rootRef', ref);
  }))

  beforeEach(inject(function (questService) {
    QuestMock = questService;
  }));

  it('can get an instance of my factory', inject(function(questService) {
    expect(QuestMock).toBeDefined();
  }));

  it('has quests', inject(function(questService) {
    QuestMock.loadQuests();
    expect(QuestMock.getAllQuests().length).not.toEqual(0);
    expect(QuestMock.getQuests("story1").length).not.toEqual(0);
    expect(QuestMock.getQuest("story1", "quest1").name).toEqual("Quest 1");
  }));

  it('can save quest', inject(function(questService) {
    QuestMock.saveQuest({name: "Test Quest"}, "test", null);
    expect(customref["users"]["test"]['stories']['test']["quests"]['test'].name).toEqual("Test Quest");
  }));

  it('can update quest', inject(function(questService) {
    QuestMock.loadQuests();
    QuestMock.saveQuest({name: "Good Test Story"}, "story1", "quest1");
    expect(customref["users"]["test"]['stories']['story1']["quests"]['quest1'].name).toEqual("Good Test Story");
  }));

  it('can delete quest', inject(function(questService) {
    QuestMock.loadQuests();
    QuestMock.deleteQuest("story1", "quest1");
    expect(customref["users"]["test"]['stories']['story1']["quests"]['quest1']).not.toBeDefined(); 
  }));

  it('can delete story quests', inject(function(questService) {
    QuestMock.loadQuests();
    QuestMock.deleteStoryQuests("story1");
    expect(QuestMock.getQuests("story1").length).toEqual(0);
  }));
});