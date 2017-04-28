'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _log = require('../../log');

var _mongoConnect = require('../mongo-connect');

var _mongoConnect2 = _interopRequireDefault(_mongoConnect);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* connect to PoE stash tab api
 * get stash tabs
 * store them in a collection
 * */

/* Add Change Index
  const changeIndex = { value: res.next_change_id };
*/

function upsertStashes(db, stashes) {
  var stashesCollection = db.collection('stashes');
  return stashes.reduce(function (acc, stash) {
    return acc.then(function () {
      return stashesCollection.replaceOne({ id: stash.id }, stash, { upsert: true });
    }).then(function () {
      return Promise.resolve(_log.log.log('replaced one'));
    });
  }, Promise.resolve());
}

var Runner = function () {
  function Runner(id) {
    _classCallCheck(this, Runner);

    this.id = id;
    this.mongo = new _mongoConnect2.default();
    this.options = {
      uri: 'http://api.pathofexile.com/public-stash-tabs/?id=63746829-67282221-63028447-73225445-68072722',
      headers: { 'User-Agent': 'Request-Promise' },
      json: true
    };
  }

  _createClass(Runner, [{
    key: 'setUriToNewId',
    value: function setUriToNewId(id) {
      if (!id) {
        return Promise.reject(id);
      }
      _log.log.log('updating uri id: ', id);
      this.id = id;
      this.options.uri = this.options.uri.replace(this.options.uri.split('=')[1], id);
      return Promise.resolve();
    }
  }, {
    key: 'run',
    value: function run() {
      var _this = this;

      return this.getChangeIndexId().then(function (id) {
        return _this.setUriToNewId(id);
      }).then(function () {
        _log.log.log('getting batch at id: ', _this.id);
        return (0, _requestPromise2.default)(_this.options).then(function (apiResponse) {
          return _this.executeTask(apiResponse);
        }).catch(function (err) {
          return _log.log.dir(err);
        });
      });
    }
  }, {
    key: 'connectToMongo',
    value: function connectToMongo() {
      return this.mongo.connect();
    }
  }, {
    key: 'getChangeIndexId',
    value: function getChangeIndexId() {
      return this.mongo.connect().then(function (db) {
        var changeIndexCollection = db.collection('changeIndex');
        return new Promise(function (resolve) {
          changeIndexCollection.find().toArray().then(function (array) {
            resolve(array.pop().value);
          });
        });
      });
    }
  }, {
    key: 'updateChangeIndex',
    value: function updateChangeIndex(id) {
      return this.mongo.connect().then(function (db) {
        var changeIndexCollection = db.collection('changeIndex');
        return new Promise(function (resolve, reject) {
          changeIndexCollection.count(function (err, count) {
            if (err) {
              reject(err);
            }
            if (count === 0) {
              resolve(changeIndexCollection.insert({ value: id }));
            } else {
              resolve(changeIndexCollection.update({}, { value: id }));
            }
          });
        });
      });
    }
  }, {
    key: 'executeTask',
    value: function executeTask(apiResponse) {
      var _this2 = this;

      var next_change_id = apiResponse.next_change_id,
          stashes = apiResponse.stashes;

      return this.mongo.connect().then(function (db) {
        return upsertStashes(db, stashes);
      }).then(function () {
        return _this2.setUriToNewId(next_change_id);
      }).then(function () {
        return _this2.updateChangeIndex(next_change_id);
      }).then(function () {
        return _log.log.log('finished');
      }).then(function () {
        return _this2.run();
      }).catch(function (err) {
        return _log.log.dir(err);
      });
      // this.updateChangeIndex(db, id);
      // this.run();
    }
  }]);

  return Runner;
}();

exports.default = Runner;