'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _helper = require('./helper');

var _helper2 = _interopRequireDefault(_helper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Polygon = function () {
  function Polygon(height, width) {
    _classCallCheck(this, Polygon);

    this.height = height;
    this.width = width;
  }

  _createClass(Polygon, [{
    key: 'getArea',
    value: function getArea() {
      return this.calcArea();
    }
  }, {
    key: 'calcArea',
    value: function calcArea() {
      return this.height * this.width;
    }
  }]);

  return Polygon;
}();

var poly = new Polygon(10, 10);
console.log(poly.calcArea());
console.log((0, _helper2.default)(poly));
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = doSomething;
function doSomething(thing) {
  return 'I helped alot';
}
