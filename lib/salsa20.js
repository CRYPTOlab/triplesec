// Generated by IcedCoffeeScript 1.7.0-a
(function() {
  var Cipher, Counter, Salsa20, Salsa20Core, Salsa20InnerCore, Salsa20WordStream, StreamCipher, WordArray, asum, bulk_encrypt, encrypt, endian_reverse, fixup_uint32, iced, util, __iced_k, __iced_k_noop, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  iced = require('iced-coffee-script/lib/coffee-script/iced').runtime;
  __iced_k = __iced_k_noop = function() {};

  _ref = require('./wordarray'), endian_reverse = _ref.endian_reverse, WordArray = _ref.WordArray;

  Counter = require('./ctr').Counter;

  fixup_uint32 = require('./util').fixup_uint32;

  StreamCipher = require('./algbase').StreamCipher;

  util = require('./util');

  asum = function(out, v) {
    var e, i, _i, _len;
    for (i = _i = 0, _len = v.length; _i < _len; i = ++_i) {
      e = v[i];
      out[i] += e;
    }
    return false;
  };

  Salsa20InnerCore = (function() {
    function Salsa20InnerCore(rounds) {
      this.rounds = rounds;
    }

    Salsa20InnerCore.prototype._core = function(v) {
      "use asm";
      var i, u, x0, x1, x10, x11, x12, x13, x14, x15, x2, x3, x4, x5, x6, x7, x8, x9, _i, _ref1;
      x0 = v[0], x1 = v[1], x2 = v[2], x3 = v[3], x4 = v[4], x5 = v[5], x6 = v[6], x7 = v[7], x8 = v[8], x9 = v[9], x10 = v[10], x11 = v[11], x12 = v[12], x13 = v[13], x14 = v[14], x15 = v[15];
      for (i = _i = 0, _ref1 = this.rounds; _i < _ref1; i = _i += 2) {
        u = (x0 + x12) | 0;
        x4 ^= (u << 7) | (u >>> 25);
        u = (x4 + x0) | 0;
        x8 ^= (u << 9) | (u >>> 23);
        u = (x8 + x4) | 0;
        x12 ^= (u << 13) | (u >>> 19);
        u = (x12 + x8) | 0;
        x0 ^= (u << 18) | (u >>> 14);
        u = (x5 + x1) | 0;
        x9 ^= (u << 7) | (u >>> 25);
        u = (x9 + x5) | 0;
        x13 ^= (u << 9) | (u >>> 23);
        u = (x13 + x9) | 0;
        x1 ^= (u << 13) | (u >>> 19);
        u = (x1 + x13) | 0;
        x5 ^= (u << 18) | (u >>> 14);
        u = (x10 + x6) | 0;
        x14 ^= (u << 7) | (u >>> 25);
        u = (x14 + x10) | 0;
        x2 ^= (u << 9) | (u >>> 23);
        u = (x2 + x14) | 0;
        x6 ^= (u << 13) | (u >>> 19);
        u = (x6 + x2) | 0;
        x10 ^= (u << 18) | (u >>> 14);
        u = (x15 + x11) | 0;
        x3 ^= (u << 7) | (u >>> 25);
        u = (x3 + x15) | 0;
        x7 ^= (u << 9) | (u >>> 23);
        u = (x7 + x3) | 0;
        x11 ^= (u << 13) | (u >>> 19);
        u = (x11 + x7) | 0;
        x15 ^= (u << 18) | (u >>> 14);
        u = (x0 + x3) | 0;
        x1 ^= (u << 7) | (u >>> 25);
        u = (x1 + x0) | 0;
        x2 ^= (u << 9) | (u >>> 23);
        u = (x2 + x1) | 0;
        x3 ^= (u << 13) | (u >>> 19);
        u = (x3 + x2) | 0;
        x0 ^= (u << 18) | (u >>> 14);
        u = (x5 + x4) | 0;
        x6 ^= (u << 7) | (u >>> 25);
        u = (x6 + x5) | 0;
        x7 ^= (u << 9) | (u >>> 23);
        u = (x7 + x6) | 0;
        x4 ^= (u << 13) | (u >>> 19);
        u = (x4 + x7) | 0;
        x5 ^= (u << 18) | (u >>> 14);
        u = (x10 + x9) | 0;
        x11 ^= (u << 7) | (u >>> 25);
        u = (x11 + x10) | 0;
        x8 ^= (u << 9) | (u >>> 23);
        u = (x8 + x11) | 0;
        x9 ^= (u << 13) | (u >>> 19);
        u = (x9 + x8) | 0;
        x10 ^= (u << 18) | (u >>> 14);
        u = (x15 + x14) | 0;
        x12 ^= (u << 7) | (u >>> 25);
        u = (x12 + x15) | 0;
        x13 ^= (u << 9) | (u >>> 23);
        u = (x13 + x12) | 0;
        x14 ^= (u << 13) | (u >>> 19);
        u = (x14 + x13) | 0;
        x15 ^= (u << 18) | (u >>> 14);
      }
      return [x0, x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15];
    };

    return Salsa20InnerCore;

  })();

  Salsa20Core = (function(_super) {
    __extends(Salsa20Core, _super);

    Salsa20Core.prototype.sigma = WordArray.from_buffer_le(new Buffer("expand 32-byte k"));

    Salsa20Core.prototype.tau = WordArray.from_buffer_le(new Buffer("expand 16-byte k"));

    Salsa20Core.blockSize = 64;

    Salsa20Core.prototype.blockSize = Salsa20Core.blockSize;

    Salsa20Core.keySize = 32;

    Salsa20Core.prototype.keySize = Salsa20Core.keySize;

    Salsa20Core.ivSize = 192 / 8;

    Salsa20Core.prototype.ivSize = Salsa20Core.ivSize;

    function Salsa20Core(key, nonce) {
      var _ref1;
      Salsa20Core.__super__.constructor.call(this, 20);
      this.key = key.clone().endian_reverse();
      this.nonce = nonce.clone().endian_reverse();
      if (!(((this.key.sigBytes === 16) && (this.nonce.sigBytes === 8)) || ((this.key.sigBytes === 32) && ((_ref1 = this.nonce.sigBytes) === 8 || _ref1 === 24)))) {
        throw new Error("Bad key/nonce lengths");
      }
      if (this.nonce.sigBytes === 24) {
        this.xsalsa_setup();
      }
      this.input = this.key_iv_setup(this.nonce, this.key);
      this._reset();
    }

    Salsa20Core.prototype.scrub = function() {
      this.key.scrub();
      this.nonce.scrub();
      return util.scrub_vec(this.input);
    };

    Salsa20Core.prototype.xsalsa_setup = function() {
      var n0, n1;
      n0 = new WordArray(this.nonce.words.slice(0, 4));
      this.nonce = n1 = new WordArray(this.nonce.words.slice(4));
      return this.key = this.hsalsa20(n0, this.key);
    };

    Salsa20Core.prototype.hsalsa20 = function(nonce, key) {
      var i, indexes, input, v;
      input = this.key_iv_setup(nonce, key);
      input[8] = nonce.words[2];
      input[9] = nonce.words[3];
      v = this._core(input);
      indexes = [0, 5, 10, 15, 6, 7, 8, 9];
      v = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = indexes.length; _i < _len; _i++) {
          i = indexes[_i];
          _results.push(fixup_uint32(v[i]));
        }
        return _results;
      })();
      util.scrub_vec(input);
      return new WordArray(v);
    };

    Salsa20Core.prototype.key_iv_setup = function(nonce, key) {
      var A, C, i, out, _i, _j, _k, _ref1;
      out = [];
      for (i = _i = 0; _i < 4; i = ++_i) {
        out[i + 1] = key.words[i];
      }
      _ref1 = key.sigBytes === 32 ? [this.sigma, key.words.slice(4)] : [this.tau, key.words], C = _ref1[0], A = _ref1[1];
      for (i = _j = 0; _j < 4; i = ++_j) {
        out[i + 11] = A[i];
      }
      for (i = _k = 0; _k < 4; i = ++_k) {
        out[i * 5] = C.words[i];
      }
      out[6] = nonce.words[0];
      out[7] = nonce.words[1];
      return out;
    };

    Salsa20Core.prototype.counter_setup = function() {
      this.input[8] = this.counter.get().words[0];
      return this.input[9] = this.counter.get().words[1];
    };

    Salsa20Core.prototype._reset = function() {
      return this.counter = new Counter({
        len: 2
      });
    };

    Salsa20Core.prototype._generateBlock = function() {
      var v;
      this.counter_setup();
      v = this._core(this.input);
      asum(v, this.input);
      this.counter.inc_le();
      return v;
    };

    return Salsa20Core;

  })(Salsa20InnerCore);

  exports.Salsa20WordStream = Salsa20WordStream = (function(_super) {
    __extends(Salsa20WordStream, _super);

    function Salsa20WordStream() {
      return Salsa20WordStream.__super__.constructor.apply(this, arguments);
    }

    Salsa20WordStream.prototype._reset = function() {
      return Salsa20WordStream.__super__._reset.call(this);
    };

    Salsa20WordStream.prototype.getWordArray = function(nbytes) {
      var blocks, i, nblocks, w, words, _i, _len, _ref1;
      if ((nbytes == null) || nbytes === this.blockSize) {
        words = this._generateBlock();
      } else {
        nblocks = Math.ceil(nbytes / this.blockSize);
        blocks = (function() {
          var _i, _results;
          _results = [];
          for (i = _i = 0; 0 <= nblocks ? _i < nblocks : _i > nblocks; i = 0 <= nblocks ? ++_i : --_i) {
            _results.push(this._generateBlock());
          }
          return _results;
        }).call(this);
        words = (_ref1 = []).concat.apply(_ref1, blocks);
      }
      for (i = _i = 0, _len = words.length; _i < _len; i = ++_i) {
        w = words[i];
        words[i] = endian_reverse(w);
      }
      return new WordArray(words, nbytes);
    };

    return Salsa20WordStream;

  })(Salsa20Core);

  exports.Salsa20 = Salsa20 = (function(_super) {
    __extends(Salsa20, _super);

    function Salsa20() {
      return Salsa20.__super__.constructor.apply(this, arguments);
    }

    Salsa20.prototype._reset = function() {
      Salsa20.__super__._reset.call(this);
      return this._i = this.blockSize;
    };

    Salsa20.prototype.getBytes = function(needed) {
      var bsz, n, v;
      if (needed == null) {
        needed = this.blockSize;
      }
      v = [];
      bsz = this.blockSize;
      if ((this._i === bsz) && (needed === bsz)) {
        return this._generateBlockBuffer();
      } else {
        while (needed > 0) {
          if (this._i === bsz) {
            this._generateBlockBuffer();
            this._i = 0;
          }
          n = Math.min(needed, bsz - this._i);
          v.push((n === bsz ? this._buf : this._buf.slice(this._i, this._i + n)));
          this._i += n;
          needed -= n;
        }
        return Buffer.concat(v);
      }
    };

    Salsa20.prototype._generateBlockBuffer = function() {
      var e, i, v, _i, _len;
      this._buf = new Buffer(this.blockSize);
      v = this._generateBlock();
      for (i = _i = 0, _len = v.length; _i < _len; i = ++_i) {
        e = v[i];
        this._buf.writeUInt32LE(fixup_uint32(e), i * 4);
      }
      return this._buf;
    };

    return Salsa20;

  })(Salsa20Core);

  exports.Cipher = Cipher = (function(_super) {
    __extends(Cipher, _super);

    function Cipher(_arg) {
      var iv, key;
      key = _arg.key, iv = _arg.iv;
      Cipher.__super__.constructor.call(this);
      this.salsa = new Salsa20WordStream(key, iv);
      this.bsiw = this.salsa.blockSize / 4;
    }

    Cipher.prototype.scrub = function() {
      return this.salsa.scrub();
    };

    Cipher.prototype.get_pad = function() {
      var pad;
      pad = this.salsa.getWordArray();
      return pad;
    };

    return Cipher;

  })(StreamCipher);

  exports.encrypt = encrypt = function(_arg) {
    var cipher, input, iv, key, ret;
    key = _arg.key, iv = _arg.iv, input = _arg.input;
    cipher = new Cipher({
      key: key,
      iv: iv
    });
    ret = cipher.encrypt(input);
    cipher.scrub();
    return ret;
  };

  exports.bulk_encrypt = bulk_encrypt = function(_arg, cb) {
    var cipher, input, iv, key, progress_hook, ret, ___iced_passed_deferral, __iced_deferrals, __iced_k;
    __iced_k = __iced_k_noop;
    ___iced_passed_deferral = iced.findDeferral(arguments);
    key = _arg.key, iv = _arg.iv, input = _arg.input, progress_hook = _arg.progress_hook;
    cipher = new Cipher({
      key: key,
      iv: iv
    });
    (function(_this) {
      return (function(__iced_k) {
        __iced_deferrals = new iced.Deferrals(__iced_k, {
          parent: ___iced_passed_deferral,
          filename: "/home/max/src/triplesec/src/salsa20.iced"
        });
        cipher.bulk_encrypt({
          input: input,
          progress_hook: progress_hook,
          what: "salsa20"
        }, __iced_deferrals.defer({
          assign_fn: (function() {
            return function() {
              return ret = arguments[0];
            };
          })(),
          lineno: 257
        }));
        __iced_deferrals._fulfill();
      });
    })(this)((function(_this) {
      return function() {
        cipher.scrub();
        return cb(ret);
      };
    })(this));
  };

  exports.Salsa20InnerCore = Salsa20InnerCore;

  exports.endian_reverse = endian_reverse;

  exports.asum = asum;

}).call(this);
