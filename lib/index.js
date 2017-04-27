'use strict';

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _pollId = require('./tasks/poll-id');

var _pollId2 = _interopRequireDefault(_pollId);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var runner = new _pollId2.default(null);

runner.run();

_http2.default.createServer(function ( /* request,*/response) {
  response.write('hello');
}).listen(process.env.PORT || 5000);