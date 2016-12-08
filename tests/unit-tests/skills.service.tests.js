describe('skillService', function(){
  var SkillMock;
  var customref = {
    users: {
      test: {
        skills: {}
      }
    }
  };

  var ref = function(){
    return {
      child: function(data){
        return{
          update: function(skillData){
            var d = data.split('/');
            customref[d[0]][d[1]][d[2]][d[3]] = skillData;
          },
          set: function(skillData){
            var d = data.split('/');
            customref[d[0]][d[1]][d[2]][d[3]] = skillData;
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
              {id: "skill1", name: "Skill 1", xp: 20},
              {id: "skill2", name: "Skill 2", xp: 0}
            ]
            SkillMock.setSkills(s);
            s.forEach(function(element) {
              customref['users']['test']['skills'][element.id] = {name: element.name, xp: element.xp};
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

  beforeEach(inject(function (skillService) {
    SkillMock = skillService;
  }));

  it('can get an instance of my factory', inject(function(skillService) {
    expect(SkillMock).toBeDefined();
  }));

  it('has stories', inject(function(skillService) {
    SkillMock.loadSkills();
    expect(SkillMock.getSkills().length).not.toEqual(0);
    expect(SkillMock.getSkill("skill1").name).toEqual("Skill 1");
  }));

  it('can save story', inject(function(skillService) {
    SkillMock.saveSkill({name: "Test Skill", xp: 0}, null);
    expect(customref["users"]["test"]['skills']['test'].name).toEqual("Test Skill");
  }));

  it('can update story', inject(function(skillService) {
    SkillMock.loadSkills();
    SkillMock.saveSkill({name: "Skill 1", xp: 50}, "skill1");
    expect(customref["users"]["test"]['skills']['skill1'].xp).toEqual(70);
  }));

  it('can delete story', inject(function(skillService) {
    SkillMock.loadSkills();
    SkillMock.deleteSkill("skill1");
    expect(customref["users"]["test"]['skills']['skill1']).not.toBeDefined(); 
  }));
});