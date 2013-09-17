var Client = require('../../lib/client');

describe('Client', function() {
  it('throws if username param isn\'t specified', function(done) {
    (function(){
      new Client(undefined, 'pass');
    }).should.throwError(/username/);
    done();
  });

  it('throws if password param isn\'t specified', function(done) {
    (function(){
      new Client('user', undefined);
    }).should.throwError(/password/);
    done();
  });
});