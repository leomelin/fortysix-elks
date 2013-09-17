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

  it('doesn\'t throw when username param isn\'t specified if the '+
     'FORTYSIXELKS_USERNAME environment variable is defined', function(done) {
    process.env.FORTYSIXELKS_USERNAME = 'user';
    (function(){
      new Client(undefined, 'pass');
    }).should.not.throwError();
    done();
  });

  it('doesn\'t throw when password param isn\'t specified if the '+
     'FORTYSIXELKS_PASSWORD environment variable is defined', function(done) {
    process.env.FORTYSIXELKS_PASSWORD = 'pass';
    (function(){
      new Client('user', undefined);
    }).should.not.throwError();
    done();
  });
});