'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _mongodb = require('mongodb');

var _log = require('../log');

var _log2 = _interopRequireDefault(_log);

var _settings = require('../settings');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Mongo = function () {
  function Mongo() {
    _classCallCheck(this, Mongo);

    this.client = _mongodb.MongoClient;
  }

  _createClass(Mongo, [{
    key: 'connect',
    value: function connect() {
      var _this = this;

      return new Promise(function (resolve, reject) {
        if (_this.connected) {
          resolve(_this.db);
        }
        _this.client.connect(_settings.mongoConnectionString, function (err, db) {
          if (err) {
            reject(err);
          } else {
            _this.db = db;
            _this.connected = true;
            resolve(db);
          }
        });
      });
    }
  }, {
    key: 'insert',
    value: function insert() /* collection, object*/{
      if (!this.connected) {
        return false;
      }
      var myCollection = this.db.collection('myCollection');
      var texts = myCollection.find().toArray();
      return texts.then(function (results) {
        return _log2.default.log(results);
      });
    }
  }]);

  return Mongo;
}();

exports.default = Mongo;