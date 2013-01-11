
encodePath = function(path) {
  var size = 18;

  var table = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+/';

  var base64_1 = function(value) {
    return table[value];
  };

  var makeBitMask = function(size) {
    return -1 ^ (-1 << size);
  };

  var getPatch = function(value, bits, phase) {
    var ret =  (value & (makeBitMask(bits) << phase)) >> phase;

    return ret;
  };

  var base64_3 = function(value) {
    return base64_1(getPatch(value, 6, 12)) +
      base64_1(getPatch(value, 6, 6)) +
      base64_1(getPatch(value, 6, 0));
  };

  var encodeHeader = function(type, size) {
    // 0-moveTo, 1-lineTo, 2-quadraticCurveTo, 3-bezierCurveTo, 4-7 unused
    return (['M','L','Q','B'].indexOf(type) << 3) 
      | [12,18].indexOf(size) << 2;
  };

  var encodeValue = function(value, size) {
    if (value < 0) {
      return (-value & (-1 ^ (-1<<(size-1)))) | (1 << (size-1));
    } else {
      return value & (-1 ^ (-1<<(size-1)));
    }
  };

  var counts = { M: 2, L: 2, Q: 4, B: 6 }
  var count = 0;

  var encoded = [];
  path.split(/ /).forEach(function(item) {
    if (!count) { 
      count = counts[item];
      var b = encodeHeader(item, size);
      encoded.push(base64_1(b));
    } else if (count--) {
      var b = encodeValue(item, size);
      encoded.push(base64_3(b));
    }
  });

  return encoded.join('');
};
