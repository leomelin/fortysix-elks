fortysix-elks
=============

A simple wrapper for the 46elks (http://46elks.com) API. At the moment only sms
functions are supported.

Install
-------
```
npm install fortysix-elks
```

Changelog
---------
### 0.0.3 (in development)
* The sendSMS() callback now receives a parsed version of the data that is
  returned by the 46elks API. Please see the comments in the code or the tests
  for an explanation of this data.
* Error messages from the 46elks API is now passed as a part of the Error
  object's message.

### 0.0.2 (2013-09-18)
* It is now possible to send text messages to multiple recipients.

### 0.0.1 (2013-09-18)
* Initial release.

TODO
----

* Support for text message delivery reports.

* Support for phone number allocation.

* Support for phone number modification and deallocation.