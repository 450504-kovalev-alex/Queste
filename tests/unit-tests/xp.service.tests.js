describe('xpService', function(){
  var XPMock;

  beforeEach(module('queste'));

  beforeEach(inject(function (xpService) {
    XPMock = xpService;
  }));

  it('can get an instance of my factory', inject(function(xpService) {
    expect(XPMock).toBeDefined();
  }));

  it('can calculate xp', inject(function(xpService) {
    XPMock.calculateXP(1000);
    expect(XPMock.getCurLevelXP()).toEqual(1000);
    expect(XPMock.getNextLevelXP()).toEqual(1500);
    expect(XPMock.getXPtoNextLevel()).toEqual(500);
    expect(XPMock.getCurLevel()).toEqual(5);
  }));

});