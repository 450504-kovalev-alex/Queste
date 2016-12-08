describe('storyService', function(){
  var StoryMock;
  var customref = {
    users: {
      test: {
        stories: {}
      }
    }
  };

  var ref = function(){
    return {
      child: function(data){
        return{
          update: function(storyData){
            var d = data.split('/');
            customref[d[0]][d[1]][d[2]][d[3]] = storyData;
          },
          set: function(storyData){
            var d = data.split('/');
            customref[d[0]][d[1]][d[2]][d[3]] = storyData;
          },
          push: function(){
            return{
              key: "test"
            }
          },
          remove: function(){
            var d = data.split('/');
            delete customref[d[0]][d[1]][d[2]][d[3]];
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

  var mockFirebaseArray = function() {
    return {
      $loaded: function() {
        return {
          then: function(cb) { 
            var s = [
              {id: "story1", name: "Story 1"},
              {id: "story2", name: "Story 2"}
            ]
            StoryMock.setStories(s);
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
    $provide.value('$firebaseArray', mockFirebaseArray);
    $provide.value('rootRef', ref);
  }))

  beforeEach(inject(function (storyService) {
    StoryMock = storyService;
  }));

  it('can get an instance of my factory', inject(function(storyService) {
    expect(StoryMock).toBeDefined();
  }));

  it('has stories', inject(function(storyService) {
    StoryMock.loadStories();
    expect(StoryMock.getStories().length).not.toEqual(0);
    expect(StoryMock.getStory("story1").name).toEqual("Story 1");
  }));

  it('can save story', inject(function(storyService) {
    StoryMock.saveStory({name: "Test Story"}, null);
    expect(customref["users"]["test"]['stories']['test'].name).toEqual("Test Story");
  }));

  it('can update story', inject(function(storyService) {
    StoryMock.loadStories();
    StoryMock.saveStory({name: "Good Test Story"}, "story1");
    expect(customref["users"]["test"]['stories']['story1'].name).toEqual("Good Test Story");
  }));

  it('can delete story', inject(function(storyService) {
    StoryMock.loadStories();
    StoryMock.deleteStory("story1");
    expect(customref["users"]["test"]['stories']['story1']).not.toBeDefined(); 
  }));
});