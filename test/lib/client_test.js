var nock   = require('nock');
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

  describe('sendSMS', function() {
    it('throws if \'from\' is not supplied', function(done) {
      var c = new Client('user', 'pass');
      (function(){
        c.sendSMS(undefined, '+46703427085', 'Hej!', function() {});
      }).should.throwError(/'from' was not supplied/);
      done();
    });

    it('throws if \'from\' is longer than 11 characters', function(done) {
      var c = new Client('user', 'pass');
      (function(){
        c.sendSMS('abcdefghijkl', '+46703427085', 'Hej!', function() {});
      }).should.throwError(/'from' can't be longer than 11 charcters/);
      done();
    });

    it('throws if \'from\' contains illegal characters', function(done) {
      var c = new Client('user', 'pass');
      (function(){
        c.sendSMS('a.asd', '+46703427085', 'Hej!', function() {});
      }).should.throwError(/'from' can only contain a-z, A-Z and 0-9/);
      done();
    });

    it('throws if \'to\' is not supplied', function(done) {
      var c = new Client('user', 'pass');
      (function(){
        c.sendSMS('Calle', undefined, 'Hej!', function() {});
      }).should.throwError(/'to' was not supplied/);
      done();
    });

    it('throws if \'to\' contains more than 200 commas separated phone '+
       'numbers', function(done) {
      var to = '+46703427085';
      for (var i = 0; i < 200; i++) {
        to += ',+46703427085';
      }
      var c = new Client('user', 'pass');
      (function(){
        c.sendSMS('Calle', to, 'Hej!', function() {});
      }).should.throwError(/'to' can't contain more than 200 numbers/);
      done();
    });

    it('throws if \'message\' is not supplied', function(done) {
      var c = new Client('user', 'pass');
      (function(){
        c.sendSMS('Calle', '+46703427085', undefined, function() {});
      }).should.throwError(/'message' was not supplied/);
      done();
    });

    it('sends a request to the 46elks API', function(done) {
      var c = new Client('user', 'pass');
      var req = nock('https://api.46elks.com')
                  .post('/a1/SMS', {
                    from: 'Calle',
                    to: '+46703427085',
                    message: 'Hej!'
                  })
                  .reply(200);
      c.sendSMS('Calle', '+46703427085', 'Hej!', function(err) {
        if (err) throw err;
        req.isDone().should.be.true;
        done();
      });
    });

    it('errors if the response code from 46elks wasn\'t 200', function(done) {
      var c = new Client('user', 'pass');
      var req = nock('https://api.46elks.com')
                  .post('/a1/SMS', {
                    from: 'Calle',
                    to: '+46703427085',
                    message: 'Hej!'
                  })
                  .reply(503);
      c.sendSMS('Calle', '+46703427085', 'Hej!', function(err) {
        err.message.should.match(/responded with code 503/);
        done();
      });
    });
  });
});