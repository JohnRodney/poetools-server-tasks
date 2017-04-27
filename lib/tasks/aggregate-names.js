'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _log = require('../../log');

var _mongoConnect = require('../mongo-connect');

var _mongoConnect2 = _interopRequireDefault(_mongoConnect);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* TODO:
 * collect list of distinct item names
 * save that list to a names collection
 * */
function cleanArray(array) {
  return Promise.resolve(array.map(function (name) {
    return name.replace(/<.*>/, '');
  }));
}

var Runner = function () {
  function Runner() {
    _classCallCheck(this, Runner);

    this.mongo = new _mongoConnect2.default();
  }

  _createClass(Runner, [{
    key: 'run',
    value: function run() {
      this.mongo.connect().then(function (db) {
        var result = db.collection('stashes').distinct('items.name').then(function (names) {
          return cleanArray(names);
        });
        return result.then(function (cleanNames) {
          return db.collection('names').replaceOne({}, { names: cleanNames }, { upsert: true });
        });
      }).catch(function (err) {
        return _log.log.dir(err);
      });
    }
  }]);

  return Runner;
}();

exports.default = Runner;