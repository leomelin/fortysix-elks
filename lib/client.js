var Client = function(username, password) {
  username = username || process.env.FORTYSIXELKS_USERNAME;
  password = password || process.env.FORTYSIXELKS_PASSWORD;
  if (!username) throw new Error('Please supply your 46elks username.');
  if (!password) throw new Error('Please supply your 46elks password.');
};

module.exports = exports = Client;