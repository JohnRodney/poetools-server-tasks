'use strict';

var _pollId = require('./tasks/poll-id');

var _pollId2 = _interopRequireDefault(_pollId);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var runner = new _pollId2.default(null);

runner.run();