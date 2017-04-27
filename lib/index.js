'use strict';

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _aggregateNames = require('./tasks/aggregate-names.js');

var _aggregateNames2 = _interopRequireDefault(_aggregateNames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var runner = new _aggregateNames2.default(null);

runner.run();

_http2.default.createServer(function () /* request, response */{}).listen(process.env.PORT || 5000);