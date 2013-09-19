var request = require('request');

// Public: Constructor of Client.
// 
// username - A string containing the users 46elks username.
// password - A string containing the users 46elks password.
//
// Returns the newly created client.
var Client = function(username, password) {
  this.username = username || process.env.FORTYSIXELKS_USERNAME;
  this.password = password || process.env.FORTYSIXELKS_PASSWORD;
  if (!this.username) throw new Error('Please supply your 46elks username.');
  if (!this.password) throw new Error('Please supply your 46elks password.');
  this.baseUri = 'https://api.46elks.com/a1';
};

// Private: Sends a post request to the given URI sending the supplied data as
//          form data.
//
//
// 
// Returns undefined.
Client.prototype.post = function(uri, data, callback) {
  request.post({
    url: this.baseUri+uri,
    auth: {
      username: this.username,
      password: this.password,
    },
    form: data,
  }, callback);
};

// Public: Sends a text message.
// 
// from     - A string of max 11 alphanumeric characters (a-zA-Z0-9). This will
//            show up as the sender of the text message in the recipients phone.
// to       - A string containing an E.164-formatted phone number. This is the
//            recipient of the text message. This string can also contain a
//            maximum of 200 E.164-formatted phone numbers in which case the
//            text message will be sent to every phone number in the list.
// message  - A string containing the message to be sent.
// callback - A function accepting an 'err' and 'sms' param. This is called
//            when the request has been sent to 46elks. The 'sms' argument
//            contains the response object from 46elks. This object has the
//            following keys:
//            
//            from      - This is the should be the same as the 'from' param
//                        that was passed in.
//            to        - This is the should be the same as the 'to' param that
//                        was passed in.
//            message   - This is the should be the same as the 'message' param
//                        that was passed in.
//            id        - The 46elks ID of the SMS.
//            cost      - An integer representing the number of cents (or 
//                        equivalent) times one hundred that was deducted from
//                        the 46elks account balance. That would be 3500 for 35
//                        cents. This is given in the currency of the account.
//            direction - This is always set to 'outgoing'
//            created   - A Date object representing the time the SMS was
//                        created in the 46elks system.
//
// Returns undefined.
Client.prototype.sendSMS = function(from, to, message, callback) {
  if (!from) throw new Error('The param \'from\' was not supplied.');
  if (!to) throw new Error('The param \'to\' was not supplied.');
  if (!message) throw new Error('The param \'message\' was not supplied.');
  if (from.length > 11) throw new Error('\'from\' can\'t be longer than 11 '+
                                        'charcters.');
  if (!from.match(/^[a-zA-Z0-9]+$/)) throw new Error('\'from\' can only '+
                                                     'contain a-z, A-Z and '+
                                                     '0-9');
  if (to.split(',').length > 200) throw new Error('\'to\' can\'t contain more '+
                                                  'than 200 numbers');
  this.post('/SMS', {
    from: from,
    to: to,
    message: message,
  }, function(err, res, body) {
    if (err) return callback(err);
    if (res.statusCode !== 200) {
      return callback(new Error("46elks error ("+res.statusCode+"): "+body));
    }
    var data = JSON.parse(body);
    data.created = new Date(data.created);
    callback(null, data);
  });
};

module.exports = exports = Client;