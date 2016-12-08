describe('UserService', function(){
    var UserMock;
    var customref = {
        users: {}
    };

    var ref = function(){
        return {
            child: function(data){
                return{
                    update: function(userData){
                        var d = data.split('/');
                        customref[d[0]][d[1]] = userData;
                    },
                    push: function(){
                        return{
                            set: function(userData){
                                customref[data]["test"] = userData;
                            }
                        }
                    },
                    remove: function(){
                        var d = data.split('/');
                        delete customref[d[0]][d[1]];
                    }
                }
            }
        }
    }

    var mockFirebaseObject = function() {
        return {
            $loaded: function() {
                return {
                  then: function(cb) { UserMock.setUser({email: "custom@email.com"}); }
              }
          }
      }
  }
  beforeEach(module('queste', 'firebase'));

  beforeEach(module(function($provide) {
    $provide.value('$firebaseObject', mockFirebaseObject);
    $provide.value('rootRef', ref);
}))

  beforeEach(inject(function (userService) {
    UserMock = userService;
}));

  it('can get an instance of my factory', inject(function(userService) {
    expect(UserMock).toBeDefined();
}));

  it('has user', inject(function(userService) {
    UserMock.loadUser();
    expect(UserMock.getUser().email).toEqual("custom@email.com");
}));

  it('can save user', inject(function(userService) {
    UserMock.saveUser({email: "custom@email.com"}, null);
    expect(customref["users"]["test"].email).toEqual("custom@email.com");
}));

   it('can update user', inject(function(userService) {
    UserMock.saveUser({email: "notcustom@email.com"}, "test");
    expect(customref["users"]["test"].email).toEqual("notcustom@email.com");
}));

  it('can delete user', inject(function(userService) {
    UserMock.deleteUser("test");
    expect(customref["users"]).toEqual({});
}));
});