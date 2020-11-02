(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
  var __commonJS = (callback, module) => () => {
    if (!module) {
      module = {exports: {}};
      callback(module.exports, module);
    }
    return module.exports;
  };
  var __exportStar = (target, module, desc) => {
    __markAsModule(target);
    if (typeof module === "object" || typeof module === "function") {
      for (let key of __getOwnPropNames(module))
        if (!__hasOwnProp.call(target, key) && key !== "default")
          __defProp(target, key, {get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable});
    }
    return target;
  };
  var __toModule = (module) => {
    if (module && module.__esModule)
      return module;
    return __exportStar(__defProp(__create(__getProtoOf(module)), "default", {value: module, enumerable: true}), module);
  };

  // node_modules/es6-promise-polyfill/promise.js
  var require_promise = __commonJS((exports) => {
    (function(global2) {
      var NativePromise = global2["Promise"];
      var nativePromiseSupported = NativePromise && "resolve" in NativePromise && "reject" in NativePromise && "all" in NativePromise && "race" in NativePromise && function() {
        var resolve2;
        new NativePromise(function(r) {
          resolve2 = r;
        });
        return typeof resolve2 === "function";
      }();
      if (typeof exports !== "undefined" && exports) {
        exports.Promise = nativePromiseSupported ? NativePromise : Promise2;
        exports.Polyfill = Promise2;
      } else {
        if (typeof define == "function" && define.amd) {
          define(function() {
            return nativePromiseSupported ? NativePromise : Promise2;
          });
        } else {
          if (!nativePromiseSupported)
            global2["Promise"] = Promise2;
        }
      }
      var PENDING = "pending";
      var SEALED = "sealed";
      var FULFILLED = "fulfilled";
      var REJECTED = "rejected";
      var NOOP = function() {
      };
      function isArray(value) {
        return Object.prototype.toString.call(value) === "[object Array]";
      }
      var asyncSetTimer = typeof setImmediate !== "undefined" ? setImmediate : setTimeout;
      var asyncQueue = [];
      var asyncTimer;
      function asyncFlush() {
        for (var i = 0; i < asyncQueue.length; i++)
          asyncQueue[i][0](asyncQueue[i][1]);
        asyncQueue = [];
        asyncTimer = false;
      }
      function asyncCall(callback, arg) {
        asyncQueue.push([callback, arg]);
        if (!asyncTimer) {
          asyncTimer = true;
          asyncSetTimer(asyncFlush, 0);
        }
      }
      function invokeResolver(resolver, promise) {
        function resolvePromise(value) {
          resolve(promise, value);
        }
        function rejectPromise(reason) {
          reject(promise, reason);
        }
        try {
          resolver(resolvePromise, rejectPromise);
        } catch (e) {
          rejectPromise(e);
        }
      }
      function invokeCallback(subscriber) {
        var owner = subscriber.owner;
        var settled = owner.state_;
        var value = owner.data_;
        var callback = subscriber[settled];
        var promise = subscriber.then;
        if (typeof callback === "function") {
          settled = FULFILLED;
          try {
            value = callback(value);
          } catch (e) {
            reject(promise, e);
          }
        }
        if (!handleThenable(promise, value)) {
          if (settled === FULFILLED)
            resolve(promise, value);
          if (settled === REJECTED)
            reject(promise, value);
        }
      }
      function handleThenable(promise, value) {
        var resolved;
        try {
          if (promise === value)
            throw new TypeError("A promises callback cannot return that same promise.");
          if (value && (typeof value === "function" || typeof value === "object")) {
            var then = value.then;
            if (typeof then === "function") {
              then.call(value, function(val) {
                if (!resolved) {
                  resolved = true;
                  if (value !== val)
                    resolve(promise, val);
                  else
                    fulfill(promise, val);
                }
              }, function(reason) {
                if (!resolved) {
                  resolved = true;
                  reject(promise, reason);
                }
              });
              return true;
            }
          }
        } catch (e) {
          if (!resolved)
            reject(promise, e);
          return true;
        }
        return false;
      }
      function resolve(promise, value) {
        if (promise === value || !handleThenable(promise, value))
          fulfill(promise, value);
      }
      function fulfill(promise, value) {
        if (promise.state_ === PENDING) {
          promise.state_ = SEALED;
          promise.data_ = value;
          asyncCall(publishFulfillment, promise);
        }
      }
      function reject(promise, reason) {
        if (promise.state_ === PENDING) {
          promise.state_ = SEALED;
          promise.data_ = reason;
          asyncCall(publishRejection, promise);
        }
      }
      function publish(promise) {
        var callbacks = promise.then_;
        promise.then_ = void 0;
        for (var i = 0; i < callbacks.length; i++) {
          invokeCallback(callbacks[i]);
        }
      }
      function publishFulfillment(promise) {
        promise.state_ = FULFILLED;
        publish(promise);
      }
      function publishRejection(promise) {
        promise.state_ = REJECTED;
        publish(promise);
      }
      function Promise2(resolver) {
        if (typeof resolver !== "function")
          throw new TypeError("Promise constructor takes a function argument");
        if (this instanceof Promise2 === false)
          throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
        this.then_ = [];
        invokeResolver(resolver, this);
      }
      Promise2.prototype = {
        constructor: Promise2,
        state_: PENDING,
        then_: null,
        data_: void 0,
        then: function(onFulfillment, onRejection) {
          var subscriber = {
            owner: this,
            then: new this.constructor(NOOP),
            fulfilled: onFulfillment,
            rejected: onRejection
          };
          if (this.state_ === FULFILLED || this.state_ === REJECTED) {
            asyncCall(invokeCallback, subscriber);
          } else {
            this.then_.push(subscriber);
          }
          return subscriber.then;
        },
        catch: function(onRejection) {
          return this.then(null, onRejection);
        }
      };
      Promise2.all = function(promises) {
        var Class = this;
        if (!isArray(promises))
          throw new TypeError("You must pass an array to Promise.all().");
        return new Class(function(resolve2, reject2) {
          var results = [];
          var remaining = 0;
          function resolver(index2) {
            remaining++;
            return function(value) {
              results[index2] = value;
              if (!--remaining)
                resolve2(results);
            };
          }
          for (var i = 0, promise; i < promises.length; i++) {
            promise = promises[i];
            if (promise && typeof promise.then === "function")
              promise.then(resolver(i), reject2);
            else
              results[i] = promise;
          }
          if (!remaining)
            resolve2(results);
        });
      };
      Promise2.race = function(promises) {
        var Class = this;
        if (!isArray(promises))
          throw new TypeError("You must pass an array to Promise.race().");
        return new Class(function(resolve2, reject2) {
          for (var i = 0, promise; i < promises.length; i++) {
            promise = promises[i];
            if (promise && typeof promise.then === "function")
              promise.then(resolve2, reject2);
            else
              resolve2(promise);
          }
        });
      };
      Promise2.resolve = function(value) {
        var Class = this;
        if (value && typeof value === "object" && value.constructor === Class)
          return value;
        return new Class(function(resolve2) {
          resolve2(value);
        });
      };
      Promise2.reject = function(reason) {
        var Class = this;
        return new Class(function(resolve2, reject2) {
          reject2(reason);
        });
      };
    })(typeof window != "undefined" ? window : typeof global != "undefined" ? global : typeof self != "undefined" ? self : exports);
  });

  // node_modules/object-assign/index.js
  var require_object_assign = __commonJS((exports, module) => {
    /*
    object-assign
    (c) Sindre Sorhus
    @license MIT
    */
    "use strict";
    var getOwnPropertySymbols = Object.getOwnPropertySymbols;
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var propIsEnumerable = Object.prototype.propertyIsEnumerable;
    function toObject(val) {
      if (val === null || val === void 0) {
        throw new TypeError("Object.assign cannot be called with null or undefined");
      }
      return Object(val);
    }
    function shouldUseNative() {
      try {
        if (!Object.assign) {
          return false;
        }
        var test1 = new String("abc");
        test1[5] = "de";
        if (Object.getOwnPropertyNames(test1)[0] === "5") {
          return false;
        }
        var test2 = {};
        for (var i = 0; i < 10; i++) {
          test2["_" + String.fromCharCode(i)] = i;
        }
        var order2 = Object.getOwnPropertyNames(test2).map(function(n) {
          return test2[n];
        });
        if (order2.join("") !== "0123456789") {
          return false;
        }
        var test3 = {};
        "abcdefghijklmnopqrst".split("").forEach(function(letter) {
          test3[letter] = letter;
        });
        if (Object.keys(Object.assign({}, test3)).join("") !== "abcdefghijklmnopqrst") {
          return false;
        }
        return true;
      } catch (err) {
        return false;
      }
    }
    module.exports = shouldUseNative() ? Object.assign : function(target, source) {
      var from;
      var to = toObject(target);
      var symbols;
      for (var s = 1; s < arguments.length; s++) {
        from = Object(arguments[s]);
        for (var key in from) {
          if (hasOwnProperty.call(from, key)) {
            to[key] = from[key];
          }
        }
        if (getOwnPropertySymbols) {
          symbols = getOwnPropertySymbols(from);
          for (var i = 0; i < symbols.length; i++) {
            if (propIsEnumerable.call(from, symbols[i])) {
              to[symbols[i]] = from[symbols[i]];
            }
          }
        }
      }
      return to;
    };
  });

  // node_modules/eventemitter3/index.js
  var require_eventemitter3 = __commonJS((exports, module) => {
    "use strict";
    var has = Object.prototype.hasOwnProperty;
    var prefix = "~";
    function Events() {
    }
    if (Object.create) {
      Events.prototype = Object.create(null);
      if (!new Events().__proto__)
        prefix = false;
    }
    function EE(fn, context2, once) {
      this.fn = fn;
      this.context = context2;
      this.once = once || false;
    }
    function addListener(emitter, event, fn, context2, once) {
      if (typeof fn !== "function") {
        throw new TypeError("The listener must be a function");
      }
      var listener = new EE(fn, context2 || emitter, once), evt = prefix ? prefix + event : event;
      if (!emitter._events[evt])
        emitter._events[evt] = listener, emitter._eventsCount++;
      else if (!emitter._events[evt].fn)
        emitter._events[evt].push(listener);
      else
        emitter._events[evt] = [emitter._events[evt], listener];
      return emitter;
    }
    function clearEvent(emitter, evt) {
      if (--emitter._eventsCount === 0)
        emitter._events = new Events();
      else
        delete emitter._events[evt];
    }
    function EventEmitter() {
      this._events = new Events();
      this._eventsCount = 0;
    }
    EventEmitter.prototype.eventNames = function eventNames() {
      var names = [], events, name;
      if (this._eventsCount === 0)
        return names;
      for (name in events = this._events) {
        if (has.call(events, name))
          names.push(prefix ? name.slice(1) : name);
      }
      if (Object.getOwnPropertySymbols) {
        return names.concat(Object.getOwnPropertySymbols(events));
      }
      return names;
    };
    EventEmitter.prototype.listeners = function listeners(event) {
      var evt = prefix ? prefix + event : event, handlers = this._events[evt];
      if (!handlers)
        return [];
      if (handlers.fn)
        return [handlers.fn];
      for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
        ee[i] = handlers[i].fn;
      }
      return ee;
    };
    EventEmitter.prototype.listenerCount = function listenerCount(event) {
      var evt = prefix ? prefix + event : event, listeners = this._events[evt];
      if (!listeners)
        return 0;
      if (listeners.fn)
        return 1;
      return listeners.length;
    };
    EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
      var evt = prefix ? prefix + event : event;
      if (!this._events[evt])
        return false;
      var listeners = this._events[evt], len = arguments.length, args, i;
      if (listeners.fn) {
        if (listeners.once)
          this.removeListener(event, listeners.fn, void 0, true);
        switch (len) {
          case 1:
            return listeners.fn.call(listeners.context), true;
          case 2:
            return listeners.fn.call(listeners.context, a1), true;
          case 3:
            return listeners.fn.call(listeners.context, a1, a2), true;
          case 4:
            return listeners.fn.call(listeners.context, a1, a2, a3), true;
          case 5:
            return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
          case 6:
            return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
        }
        for (i = 1, args = new Array(len - 1); i < len; i++) {
          args[i - 1] = arguments[i];
        }
        listeners.fn.apply(listeners.context, args);
      } else {
        var length = listeners.length, j;
        for (i = 0; i < length; i++) {
          if (listeners[i].once)
            this.removeListener(event, listeners[i].fn, void 0, true);
          switch (len) {
            case 1:
              listeners[i].fn.call(listeners[i].context);
              break;
            case 2:
              listeners[i].fn.call(listeners[i].context, a1);
              break;
            case 3:
              listeners[i].fn.call(listeners[i].context, a1, a2);
              break;
            case 4:
              listeners[i].fn.call(listeners[i].context, a1, a2, a3);
              break;
            default:
              if (!args)
                for (j = 1, args = new Array(len - 1); j < len; j++) {
                  args[j - 1] = arguments[j];
                }
              listeners[i].fn.apply(listeners[i].context, args);
          }
        }
      }
      return true;
    };
    EventEmitter.prototype.on = function on(event, fn, context2) {
      return addListener(this, event, fn, context2, false);
    };
    EventEmitter.prototype.once = function once(event, fn, context2) {
      return addListener(this, event, fn, context2, true);
    };
    EventEmitter.prototype.removeListener = function removeListener(event, fn, context2, once) {
      var evt = prefix ? prefix + event : event;
      if (!this._events[evt])
        return this;
      if (!fn) {
        clearEvent(this, evt);
        return this;
      }
      var listeners = this._events[evt];
      if (listeners.fn) {
        if (listeners.fn === fn && (!once || listeners.once) && (!context2 || listeners.context === context2)) {
          clearEvent(this, evt);
        }
      } else {
        for (var i = 0, events = [], length = listeners.length; i < length; i++) {
          if (listeners[i].fn !== fn || once && !listeners[i].once || context2 && listeners[i].context !== context2) {
            events.push(listeners[i]);
          }
        }
        if (events.length)
          this._events[evt] = events.length === 1 ? events[0] : events;
        else
          clearEvent(this, evt);
      }
      return this;
    };
    EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
      var evt;
      if (event) {
        evt = prefix ? prefix + event : event;
        if (this._events[evt])
          clearEvent(this, evt);
      } else {
        this._events = new Events();
        this._eventsCount = 0;
      }
      return this;
    };
    EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
    EventEmitter.prototype.addListener = EventEmitter.prototype.on;
    EventEmitter.prefixed = prefix;
    EventEmitter.EventEmitter = EventEmitter;
    if (typeof module !== "undefined") {
      module.exports = EventEmitter;
    }
  });

  // node_modules/earcut/src/earcut.js
  var require_earcut = __commonJS((exports, module) => {
    "use strict";
    module.exports = earcut2;
    module.exports.default = earcut2;
    function earcut2(data, holeIndices, dim) {
      dim = dim || 2;
      var hasHoles = holeIndices && holeIndices.length, outerLen = hasHoles ? holeIndices[0] * dim : data.length, outerNode = linkedList(data, 0, outerLen, dim, true), triangles = [];
      if (!outerNode || outerNode.next === outerNode.prev)
        return triangles;
      var minX, minY, maxX, maxY, x, y, invSize;
      if (hasHoles)
        outerNode = eliminateHoles(data, holeIndices, outerNode, dim);
      if (data.length > 80 * dim) {
        minX = maxX = data[0];
        minY = maxY = data[1];
        for (var i = dim; i < outerLen; i += dim) {
          x = data[i];
          y = data[i + 1];
          if (x < minX)
            minX = x;
          if (y < minY)
            minY = y;
          if (x > maxX)
            maxX = x;
          if (y > maxY)
            maxY = y;
        }
        invSize = Math.max(maxX - minX, maxY - minY);
        invSize = invSize !== 0 ? 1 / invSize : 0;
      }
      earcutLinked(outerNode, triangles, dim, minX, minY, invSize);
      return triangles;
    }
    function linkedList(data, start, end, dim, clockwise) {
      var i, last;
      if (clockwise === signedArea(data, start, end, dim) > 0) {
        for (i = start; i < end; i += dim)
          last = insertNode(i, data[i], data[i + 1], last);
      } else {
        for (i = end - dim; i >= start; i -= dim)
          last = insertNode(i, data[i], data[i + 1], last);
      }
      if (last && equals(last, last.next)) {
        removeNode(last);
        last = last.next;
      }
      return last;
    }
    function filterPoints(start, end) {
      if (!start)
        return start;
      if (!end)
        end = start;
      var p = start, again;
      do {
        again = false;
        if (!p.steiner && (equals(p, p.next) || area(p.prev, p, p.next) === 0)) {
          removeNode(p);
          p = end = p.prev;
          if (p === p.next)
            break;
          again = true;
        } else {
          p = p.next;
        }
      } while (again || p !== end);
      return end;
    }
    function earcutLinked(ear, triangles, dim, minX, minY, invSize, pass) {
      if (!ear)
        return;
      if (!pass && invSize)
        indexCurve(ear, minX, minY, invSize);
      var stop = ear, prev, next;
      while (ear.prev !== ear.next) {
        prev = ear.prev;
        next = ear.next;
        if (invSize ? isEarHashed(ear, minX, minY, invSize) : isEar(ear)) {
          triangles.push(prev.i / dim);
          triangles.push(ear.i / dim);
          triangles.push(next.i / dim);
          removeNode(ear);
          ear = next.next;
          stop = next.next;
          continue;
        }
        ear = next;
        if (ear === stop) {
          if (!pass) {
            earcutLinked(filterPoints(ear), triangles, dim, minX, minY, invSize, 1);
          } else if (pass === 1) {
            ear = cureLocalIntersections(filterPoints(ear), triangles, dim);
            earcutLinked(ear, triangles, dim, minX, minY, invSize, 2);
          } else if (pass === 2) {
            splitEarcut(ear, triangles, dim, minX, minY, invSize);
          }
          break;
        }
      }
    }
    function isEar(ear) {
      var a = ear.prev, b = ear, c = ear.next;
      if (area(a, b, c) >= 0)
        return false;
      var p = ear.next.next;
      while (p !== ear.prev) {
        if (pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) && area(p.prev, p, p.next) >= 0)
          return false;
        p = p.next;
      }
      return true;
    }
    function isEarHashed(ear, minX, minY, invSize) {
      var a = ear.prev, b = ear, c = ear.next;
      if (area(a, b, c) >= 0)
        return false;
      var minTX = a.x < b.x ? a.x < c.x ? a.x : c.x : b.x < c.x ? b.x : c.x, minTY = a.y < b.y ? a.y < c.y ? a.y : c.y : b.y < c.y ? b.y : c.y, maxTX = a.x > b.x ? a.x > c.x ? a.x : c.x : b.x > c.x ? b.x : c.x, maxTY = a.y > b.y ? a.y > c.y ? a.y : c.y : b.y > c.y ? b.y : c.y;
      var minZ = zOrder(minTX, minTY, minX, minY, invSize), maxZ = zOrder(maxTX, maxTY, minX, minY, invSize);
      var p = ear.prevZ, n = ear.nextZ;
      while (p && p.z >= minZ && n && n.z <= maxZ) {
        if (p !== ear.prev && p !== ear.next && pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) && area(p.prev, p, p.next) >= 0)
          return false;
        p = p.prevZ;
        if (n !== ear.prev && n !== ear.next && pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, n.x, n.y) && area(n.prev, n, n.next) >= 0)
          return false;
        n = n.nextZ;
      }
      while (p && p.z >= minZ) {
        if (p !== ear.prev && p !== ear.next && pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) && area(p.prev, p, p.next) >= 0)
          return false;
        p = p.prevZ;
      }
      while (n && n.z <= maxZ) {
        if (n !== ear.prev && n !== ear.next && pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, n.x, n.y) && area(n.prev, n, n.next) >= 0)
          return false;
        n = n.nextZ;
      }
      return true;
    }
    function cureLocalIntersections(start, triangles, dim) {
      var p = start;
      do {
        var a = p.prev, b = p.next.next;
        if (!equals(a, b) && intersects3(a, p, p.next, b) && locallyInside(a, b) && locallyInside(b, a)) {
          triangles.push(a.i / dim);
          triangles.push(p.i / dim);
          triangles.push(b.i / dim);
          removeNode(p);
          removeNode(p.next);
          p = start = b;
        }
        p = p.next;
      } while (p !== start);
      return filterPoints(p);
    }
    function splitEarcut(start, triangles, dim, minX, minY, invSize) {
      var a = start;
      do {
        var b = a.next.next;
        while (b !== a.prev) {
          if (a.i !== b.i && isValidDiagonal(a, b)) {
            var c = splitPolygon(a, b);
            a = filterPoints(a, a.next);
            c = filterPoints(c, c.next);
            earcutLinked(a, triangles, dim, minX, minY, invSize);
            earcutLinked(c, triangles, dim, minX, minY, invSize);
            return;
          }
          b = b.next;
        }
        a = a.next;
      } while (a !== start);
    }
    function eliminateHoles(data, holeIndices, outerNode, dim) {
      var queue2 = [], i, len, start, end, list;
      for (i = 0, len = holeIndices.length; i < len; i++) {
        start = holeIndices[i] * dim;
        end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
        list = linkedList(data, start, end, dim, false);
        if (list === list.next)
          list.steiner = true;
        queue2.push(getLeftmost(list));
      }
      queue2.sort(compareX);
      for (i = 0; i < queue2.length; i++) {
        eliminateHole(queue2[i], outerNode);
        outerNode = filterPoints(outerNode, outerNode.next);
      }
      return outerNode;
    }
    function compareX(a, b) {
      return a.x - b.x;
    }
    function eliminateHole(hole, outerNode) {
      outerNode = findHoleBridge(hole, outerNode);
      if (outerNode) {
        var b = splitPolygon(outerNode, hole);
        filterPoints(outerNode, outerNode.next);
        filterPoints(b, b.next);
      }
    }
    function findHoleBridge(hole, outerNode) {
      var p = outerNode, hx = hole.x, hy = hole.y, qx = -Infinity, m;
      do {
        if (hy <= p.y && hy >= p.next.y && p.next.y !== p.y) {
          var x = p.x + (hy - p.y) * (p.next.x - p.x) / (p.next.y - p.y);
          if (x <= hx && x > qx) {
            qx = x;
            if (x === hx) {
              if (hy === p.y)
                return p;
              if (hy === p.next.y)
                return p.next;
            }
            m = p.x < p.next.x ? p : p.next;
          }
        }
        p = p.next;
      } while (p !== outerNode);
      if (!m)
        return null;
      if (hx === qx)
        return m;
      var stop = m, mx = m.x, my = m.y, tanMin = Infinity, tan;
      p = m;
      do {
        if (hx >= p.x && p.x >= mx && hx !== p.x && pointInTriangle(hy < my ? hx : qx, hy, mx, my, hy < my ? qx : hx, hy, p.x, p.y)) {
          tan = Math.abs(hy - p.y) / (hx - p.x);
          if (locallyInside(p, hole) && (tan < tanMin || tan === tanMin && (p.x > m.x || p.x === m.x && sectorContainsSector(m, p)))) {
            m = p;
            tanMin = tan;
          }
        }
        p = p.next;
      } while (p !== stop);
      return m;
    }
    function sectorContainsSector(m, p) {
      return area(m.prev, m, p.prev) < 0 && area(p.next, m, m.next) < 0;
    }
    function indexCurve(start, minX, minY, invSize) {
      var p = start;
      do {
        if (p.z === null)
          p.z = zOrder(p.x, p.y, minX, minY, invSize);
        p.prevZ = p.prev;
        p.nextZ = p.next;
        p = p.next;
      } while (p !== start);
      p.prevZ.nextZ = null;
      p.prevZ = null;
      sortLinked(p);
    }
    function sortLinked(list) {
      var i, p, q, e, tail, numMerges, pSize, qSize, inSize = 1;
      do {
        p = list;
        list = null;
        tail = null;
        numMerges = 0;
        while (p) {
          numMerges++;
          q = p;
          pSize = 0;
          for (i = 0; i < inSize; i++) {
            pSize++;
            q = q.nextZ;
            if (!q)
              break;
          }
          qSize = inSize;
          while (pSize > 0 || qSize > 0 && q) {
            if (pSize !== 0 && (qSize === 0 || !q || p.z <= q.z)) {
              e = p;
              p = p.nextZ;
              pSize--;
            } else {
              e = q;
              q = q.nextZ;
              qSize--;
            }
            if (tail)
              tail.nextZ = e;
            else
              list = e;
            e.prevZ = tail;
            tail = e;
          }
          p = q;
        }
        tail.nextZ = null;
        inSize *= 2;
      } while (numMerges > 1);
      return list;
    }
    function zOrder(x, y, minX, minY, invSize) {
      x = 32767 * (x - minX) * invSize;
      y = 32767 * (y - minY) * invSize;
      x = (x | x << 8) & 16711935;
      x = (x | x << 4) & 252645135;
      x = (x | x << 2) & 858993459;
      x = (x | x << 1) & 1431655765;
      y = (y | y << 8) & 16711935;
      y = (y | y << 4) & 252645135;
      y = (y | y << 2) & 858993459;
      y = (y | y << 1) & 1431655765;
      return x | y << 1;
    }
    function getLeftmost(start) {
      var p = start, leftmost = start;
      do {
        if (p.x < leftmost.x || p.x === leftmost.x && p.y < leftmost.y)
          leftmost = p;
        p = p.next;
      } while (p !== start);
      return leftmost;
    }
    function pointInTriangle(ax, ay, bx, by, cx, cy, px, py) {
      return (cx - px) * (ay - py) - (ax - px) * (cy - py) >= 0 && (ax - px) * (by - py) - (bx - px) * (ay - py) >= 0 && (bx - px) * (cy - py) - (cx - px) * (by - py) >= 0;
    }
    function isValidDiagonal(a, b) {
      return a.next.i !== b.i && a.prev.i !== b.i && !intersectsPolygon(a, b) && (locallyInside(a, b) && locallyInside(b, a) && middleInside(a, b) && (area(a.prev, a, b.prev) || area(a, b.prev, b)) || equals(a, b) && area(a.prev, a, a.next) > 0 && area(b.prev, b, b.next) > 0);
    }
    function area(p, q, r) {
      return (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
    }
    function equals(p1, p2) {
      return p1.x === p2.x && p1.y === p2.y;
    }
    function intersects3(p1, q1, p2, q2) {
      var o1 = sign2(area(p1, q1, p2));
      var o2 = sign2(area(p1, q1, q2));
      var o3 = sign2(area(p2, q2, p1));
      var o4 = sign2(area(p2, q2, q1));
      if (o1 !== o2 && o3 !== o4)
        return true;
      if (o1 === 0 && onSegment(p1, p2, q1))
        return true;
      if (o2 === 0 && onSegment(p1, q2, q1))
        return true;
      if (o3 === 0 && onSegment(p2, p1, q2))
        return true;
      if (o4 === 0 && onSegment(p2, q1, q2))
        return true;
      return false;
    }
    function onSegment(p, q, r) {
      return q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) && q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y);
    }
    function sign2(num) {
      return num > 0 ? 1 : num < 0 ? -1 : 0;
    }
    function intersectsPolygon(a, b) {
      var p = a;
      do {
        if (p.i !== a.i && p.next.i !== a.i && p.i !== b.i && p.next.i !== b.i && intersects3(p, p.next, a, b))
          return true;
        p = p.next;
      } while (p !== a);
      return false;
    }
    function locallyInside(a, b) {
      return area(a.prev, a, a.next) < 0 ? area(a, b, a.next) >= 0 && area(a, a.prev, b) >= 0 : area(a, b, a.prev) < 0 || area(a, a.next, b) < 0;
    }
    function middleInside(a, b) {
      var p = a, inside = false, px = (a.x + b.x) / 2, py = (a.y + b.y) / 2;
      do {
        if (p.y > py !== p.next.y > py && p.next.y !== p.y && px < (p.next.x - p.x) * (py - p.y) / (p.next.y - p.y) + p.x)
          inside = !inside;
        p = p.next;
      } while (p !== a);
      return inside;
    }
    function splitPolygon(a, b) {
      var a2 = new Node(a.i, a.x, a.y), b2 = new Node(b.i, b.x, b.y), an = a.next, bp = b.prev;
      a.next = b;
      b.prev = a;
      a2.next = an;
      an.prev = a2;
      b2.next = a2;
      a2.prev = b2;
      bp.next = b2;
      b2.prev = bp;
      return b2;
    }
    function insertNode(i, x, y, last) {
      var p = new Node(i, x, y);
      if (!last) {
        p.prev = p;
        p.next = p;
      } else {
        p.next = last.next;
        p.prev = last;
        last.next.prev = p;
        last.next = p;
      }
      return p;
    }
    function removeNode(p) {
      p.next.prev = p.prev;
      p.prev.next = p.next;
      if (p.prevZ)
        p.prevZ.nextZ = p.nextZ;
      if (p.nextZ)
        p.nextZ.prevZ = p.prevZ;
    }
    function Node(i, x, y) {
      this.i = i;
      this.x = x;
      this.y = y;
      this.prev = null;
      this.next = null;
      this.z = null;
      this.prevZ = null;
      this.nextZ = null;
      this.steiner = false;
    }
    earcut2.deviation = function(data, holeIndices, dim, triangles) {
      var hasHoles = holeIndices && holeIndices.length;
      var outerLen = hasHoles ? holeIndices[0] * dim : data.length;
      var polygonArea = Math.abs(signedArea(data, 0, outerLen, dim));
      if (hasHoles) {
        for (var i = 0, len = holeIndices.length; i < len; i++) {
          var start = holeIndices[i] * dim;
          var end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
          polygonArea -= Math.abs(signedArea(data, start, end, dim));
        }
      }
      var trianglesArea = 0;
      for (i = 0; i < triangles.length; i += 3) {
        var a = triangles[i] * dim;
        var b = triangles[i + 1] * dim;
        var c = triangles[i + 2] * dim;
        trianglesArea += Math.abs((data[a] - data[c]) * (data[b + 1] - data[a + 1]) - (data[a] - data[b]) * (data[c + 1] - data[a + 1]));
      }
      return polygonArea === 0 && trianglesArea === 0 ? 0 : Math.abs((trianglesArea - polygonArea) / polygonArea);
    };
    function signedArea(data, start, end, dim) {
      var sum = 0;
      for (var i = start, j = end - dim; i < end; i += dim) {
        sum += (data[j] - data[i]) * (data[i + 1] + data[j + 1]);
        j = i;
      }
      return sum;
    }
    earcut2.flatten = function(data) {
      var dim = data[0][0].length, result = {vertices: [], holes: [], dimensions: dim}, holeIndex = 0;
      for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < data[i].length; j++) {
          for (var d = 0; d < dim; d++)
            result.vertices.push(data[i][j][d]);
        }
        if (i > 0) {
          holeIndex += data[i - 1].length;
          result.holes.push(holeIndex);
        }
      }
      return result;
    };
  });

  // node_modules/punycode/punycode.js
  var require_punycode = __commonJS((exports, module) => {
    "use strict";
    const maxInt = 2147483647;
    const base = 36;
    const tMin = 1;
    const tMax = 26;
    const skew = 38;
    const damp = 700;
    const initialBias = 72;
    const initialN = 128;
    const delimiter = "-";
    const regexPunycode = /^xn--/;
    const regexNonASCII = /[^\0-\x7E]/;
    const regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g;
    const errors = {
      overflow: "Overflow: input needs wider integers to process",
      "not-basic": "Illegal input >= 0x80 (not a basic code point)",
      "invalid-input": "Invalid input"
    };
    const baseMinusTMin = base - tMin;
    const floor = Math.floor;
    const stringFromCharCode = String.fromCharCode;
    function error(type) {
      throw new RangeError(errors[type]);
    }
    function map3(array, fn) {
      const result = [];
      let length = array.length;
      while (length--) {
        result[length] = fn(array[length]);
      }
      return result;
    }
    function mapDomain(string, fn) {
      const parts = string.split("@");
      let result = "";
      if (parts.length > 1) {
        result = parts[0] + "@";
        string = parts[1];
      }
      string = string.replace(regexSeparators, ".");
      const labels = string.split(".");
      const encoded = map3(labels, fn).join(".");
      return result + encoded;
    }
    function ucs2decode(string) {
      const output = [];
      let counter = 0;
      const length = string.length;
      while (counter < length) {
        const value = string.charCodeAt(counter++);
        if (value >= 55296 && value <= 56319 && counter < length) {
          const extra = string.charCodeAt(counter++);
          if ((extra & 64512) == 56320) {
            output.push(((value & 1023) << 10) + (extra & 1023) + 65536);
          } else {
            output.push(value);
            counter--;
          }
        } else {
          output.push(value);
        }
      }
      return output;
    }
    const ucs2encode = (array) => String.fromCodePoint(...array);
    const basicToDigit = function(codePoint) {
      if (codePoint - 48 < 10) {
        return codePoint - 22;
      }
      if (codePoint - 65 < 26) {
        return codePoint - 65;
      }
      if (codePoint - 97 < 26) {
        return codePoint - 97;
      }
      return base;
    };
    const digitToBasic = function(digit, flag) {
      return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
    };
    const adapt = function(delta, numPoints, firstTime) {
      let k = 0;
      delta = firstTime ? floor(delta / damp) : delta >> 1;
      delta += floor(delta / numPoints);
      for (; delta > baseMinusTMin * tMax >> 1; k += base) {
        delta = floor(delta / baseMinusTMin);
      }
      return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
    };
    const decode = function(input3) {
      const output = [];
      const inputLength = input3.length;
      let i = 0;
      let n = initialN;
      let bias = initialBias;
      let basic = input3.lastIndexOf(delimiter);
      if (basic < 0) {
        basic = 0;
      }
      for (let j = 0; j < basic; ++j) {
        if (input3.charCodeAt(j) >= 128) {
          error("not-basic");
        }
        output.push(input3.charCodeAt(j));
      }
      for (let index2 = basic > 0 ? basic + 1 : 0; index2 < inputLength; ) {
        let oldi = i;
        for (let w = 1, k = base; ; k += base) {
          if (index2 >= inputLength) {
            error("invalid-input");
          }
          const digit = basicToDigit(input3.charCodeAt(index2++));
          if (digit >= base || digit > floor((maxInt - i) / w)) {
            error("overflow");
          }
          i += digit * w;
          const t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
          if (digit < t) {
            break;
          }
          const baseMinusT = base - t;
          if (w > floor(maxInt / baseMinusT)) {
            error("overflow");
          }
          w *= baseMinusT;
        }
        const out = output.length + 1;
        bias = adapt(i - oldi, out, oldi == 0);
        if (floor(i / out) > maxInt - n) {
          error("overflow");
        }
        n += floor(i / out);
        i %= out;
        output.splice(i++, 0, n);
      }
      return String.fromCodePoint(...output);
    };
    const encode = function(input3) {
      const output = [];
      input3 = ucs2decode(input3);
      let inputLength = input3.length;
      let n = initialN;
      let delta = 0;
      let bias = initialBias;
      for (const currentValue of input3) {
        if (currentValue < 128) {
          output.push(stringFromCharCode(currentValue));
        }
      }
      let basicLength = output.length;
      let handledCPCount = basicLength;
      if (basicLength) {
        output.push(delimiter);
      }
      while (handledCPCount < inputLength) {
        let m = maxInt;
        for (const currentValue of input3) {
          if (currentValue >= n && currentValue < m) {
            m = currentValue;
          }
        }
        const handledCPCountPlusOne = handledCPCount + 1;
        if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
          error("overflow");
        }
        delta += (m - n) * handledCPCountPlusOne;
        n = m;
        for (const currentValue of input3) {
          if (currentValue < n && ++delta > maxInt) {
            error("overflow");
          }
          if (currentValue == n) {
            let q = delta;
            for (let k = base; ; k += base) {
              const t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
              if (q < t) {
                break;
              }
              const qMinusT = q - t;
              const baseMinusT = base - t;
              output.push(stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0)));
              q = floor(qMinusT / baseMinusT);
            }
            output.push(stringFromCharCode(digitToBasic(q, 0)));
            bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
            delta = 0;
            ++handledCPCount;
          }
        }
        ++delta;
        ++n;
      }
      return output.join("");
    };
    const toUnicode = function(input3) {
      return mapDomain(input3, function(string) {
        return regexPunycode.test(string) ? decode(string.slice(4).toLowerCase()) : string;
      });
    };
    const toASCII = function(input3) {
      return mapDomain(input3, function(string) {
        return regexNonASCII.test(string) ? "xn--" + encode(string) : string;
      });
    };
    const punycode = {
      version: "2.1.0",
      ucs2: {
        decode: ucs2decode,
        encode: ucs2encode
      },
      decode,
      encode,
      toASCII,
      toUnicode
    };
    module.exports = punycode;
  });

  // node_modules/url/util.js
  var require_util = __commonJS((exports, module) => {
    "use strict";
    module.exports = {
      isString: function(arg) {
        return typeof arg === "string";
      },
      isObject: function(arg) {
        return typeof arg === "object" && arg !== null;
      },
      isNull: function(arg) {
        return arg === null;
      },
      isNullOrUndefined: function(arg) {
        return arg == null;
      }
    };
  });

  // node_modules/querystring/decode.js
  var require_decode = __commonJS((exports, module) => {
    "use strict";
    function hasOwnProperty(obj, prop) {
      return Object.prototype.hasOwnProperty.call(obj, prop);
    }
    module.exports = function(qs, sep, eq, options) {
      sep = sep || "&";
      eq = eq || "=";
      var obj = {};
      if (typeof qs !== "string" || qs.length === 0) {
        return obj;
      }
      var regexp = /\+/g;
      qs = qs.split(sep);
      var maxKeys = 1e3;
      if (options && typeof options.maxKeys === "number") {
        maxKeys = options.maxKeys;
      }
      var len = qs.length;
      if (maxKeys > 0 && len > maxKeys) {
        len = maxKeys;
      }
      for (var i = 0; i < len; ++i) {
        var x = qs[i].replace(regexp, "%20"), idx = x.indexOf(eq), kstr, vstr, k, v;
        if (idx >= 0) {
          kstr = x.substr(0, idx);
          vstr = x.substr(idx + 1);
        } else {
          kstr = x;
          vstr = "";
        }
        k = decodeURIComponent(kstr);
        v = decodeURIComponent(vstr);
        if (!hasOwnProperty(obj, k)) {
          obj[k] = v;
        } else if (Array.isArray(obj[k])) {
          obj[k].push(v);
        } else {
          obj[k] = [obj[k], v];
        }
      }
      return obj;
    };
  });

  // node_modules/querystring/encode.js
  var require_encode = __commonJS((exports, module) => {
    "use strict";
    var stringifyPrimitive = function(v) {
      switch (typeof v) {
        case "string":
          return v;
        case "boolean":
          return v ? "true" : "false";
        case "number":
          return isFinite(v) ? v : "";
        default:
          return "";
      }
    };
    module.exports = function(obj, sep, eq, name) {
      sep = sep || "&";
      eq = eq || "=";
      if (obj === null) {
        obj = void 0;
      }
      if (typeof obj === "object") {
        return Object.keys(obj).map(function(k) {
          var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
          if (Array.isArray(obj[k])) {
            return obj[k].map(function(v) {
              return ks + encodeURIComponent(stringifyPrimitive(v));
            }).join(sep);
          } else {
            return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
          }
        }).join(sep);
      }
      if (!name)
        return "";
      return encodeURIComponent(stringifyPrimitive(name)) + eq + encodeURIComponent(stringifyPrimitive(obj));
    };
  });

  // node_modules/querystring/index.js
  var require_querystring = __commonJS((exports) => {
    "use strict";
    exports.decode = exports.parse = require_decode();
    exports.encode = exports.stringify = require_encode();
  });

  // node_modules/url/url.js
  var require_url = __commonJS((exports) => {
    "use strict";
    var punycode = require_punycode();
    var util = require_util();
    exports.parse = urlParse;
    exports.resolve = urlResolve;
    exports.resolveObject = urlResolveObject;
    exports.format = urlFormat;
    exports.Url = Url2;
    function Url2() {
      this.protocol = null;
      this.slashes = null;
      this.auth = null;
      this.host = null;
      this.port = null;
      this.hostname = null;
      this.hash = null;
      this.search = null;
      this.query = null;
      this.pathname = null;
      this.path = null;
      this.href = null;
    }
    var protocolPattern = /^([a-z0-9.+-]+:)/i;
    var portPattern = /:[0-9]*$/;
    var simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/;
    var delims = ["<", ">", '"', "`", " ", "\r", "\n", "	"];
    var unwise = ["{", "}", "|", "\\", "^", "`"].concat(delims);
    var autoEscape = ["'"].concat(unwise);
    var nonHostChars = ["%", "/", "?", ";", "#"].concat(autoEscape);
    var hostEndingChars = ["/", "?", "#"];
    var hostnameMaxLen = 255;
    var hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/;
    var hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/;
    var unsafeProtocol = {
      javascript: true,
      "javascript:": true
    };
    var hostlessProtocol = {
      javascript: true,
      "javascript:": true
    };
    var slashedProtocol = {
      http: true,
      https: true,
      ftp: true,
      gopher: true,
      file: true,
      "http:": true,
      "https:": true,
      "ftp:": true,
      "gopher:": true,
      "file:": true
    };
    var querystring = require_querystring();
    function urlParse(url3, parseQueryString, slashesDenoteHost) {
      if (url3 && util.isObject(url3) && url3 instanceof Url2)
        return url3;
      var u = new Url2();
      u.parse(url3, parseQueryString, slashesDenoteHost);
      return u;
    }
    Url2.prototype.parse = function(url3, parseQueryString, slashesDenoteHost) {
      if (!util.isString(url3)) {
        throw new TypeError("Parameter 'url' must be a string, not " + typeof url3);
      }
      var queryIndex = url3.indexOf("?"), splitter = queryIndex !== -1 && queryIndex < url3.indexOf("#") ? "?" : "#", uSplit = url3.split(splitter), slashRegex = /\\/g;
      uSplit[0] = uSplit[0].replace(slashRegex, "/");
      url3 = uSplit.join(splitter);
      var rest = url3;
      rest = rest.trim();
      if (!slashesDenoteHost && url3.split("#").length === 1) {
        var simplePath = simplePathPattern.exec(rest);
        if (simplePath) {
          this.path = rest;
          this.href = rest;
          this.pathname = simplePath[1];
          if (simplePath[2]) {
            this.search = simplePath[2];
            if (parseQueryString) {
              this.query = querystring.parse(this.search.substr(1));
            } else {
              this.query = this.search.substr(1);
            }
          } else if (parseQueryString) {
            this.search = "";
            this.query = {};
          }
          return this;
        }
      }
      var proto = protocolPattern.exec(rest);
      if (proto) {
        proto = proto[0];
        var lowerProto = proto.toLowerCase();
        this.protocol = lowerProto;
        rest = rest.substr(proto.length);
      }
      if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
        var slashes = rest.substr(0, 2) === "//";
        if (slashes && !(proto && hostlessProtocol[proto])) {
          rest = rest.substr(2);
          this.slashes = true;
        }
      }
      if (!hostlessProtocol[proto] && (slashes || proto && !slashedProtocol[proto])) {
        var hostEnd = -1;
        for (var i = 0; i < hostEndingChars.length; i++) {
          var hec = rest.indexOf(hostEndingChars[i]);
          if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
            hostEnd = hec;
        }
        var auth, atSign;
        if (hostEnd === -1) {
          atSign = rest.lastIndexOf("@");
        } else {
          atSign = rest.lastIndexOf("@", hostEnd);
        }
        if (atSign !== -1) {
          auth = rest.slice(0, atSign);
          rest = rest.slice(atSign + 1);
          this.auth = decodeURIComponent(auth);
        }
        hostEnd = -1;
        for (var i = 0; i < nonHostChars.length; i++) {
          var hec = rest.indexOf(nonHostChars[i]);
          if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
            hostEnd = hec;
        }
        if (hostEnd === -1)
          hostEnd = rest.length;
        this.host = rest.slice(0, hostEnd);
        rest = rest.slice(hostEnd);
        this.parseHost();
        this.hostname = this.hostname || "";
        var ipv6Hostname = this.hostname[0] === "[" && this.hostname[this.hostname.length - 1] === "]";
        if (!ipv6Hostname) {
          var hostparts = this.hostname.split(/\./);
          for (var i = 0, l = hostparts.length; i < l; i++) {
            var part = hostparts[i];
            if (!part)
              continue;
            if (!part.match(hostnamePartPattern)) {
              var newpart = "";
              for (var j = 0, k = part.length; j < k; j++) {
                if (part.charCodeAt(j) > 127) {
                  newpart += "x";
                } else {
                  newpart += part[j];
                }
              }
              if (!newpart.match(hostnamePartPattern)) {
                var validParts = hostparts.slice(0, i);
                var notHost = hostparts.slice(i + 1);
                var bit = part.match(hostnamePartStart);
                if (bit) {
                  validParts.push(bit[1]);
                  notHost.unshift(bit[2]);
                }
                if (notHost.length) {
                  rest = "/" + notHost.join(".") + rest;
                }
                this.hostname = validParts.join(".");
                break;
              }
            }
          }
        }
        if (this.hostname.length > hostnameMaxLen) {
          this.hostname = "";
        } else {
          this.hostname = this.hostname.toLowerCase();
        }
        if (!ipv6Hostname) {
          this.hostname = punycode.toASCII(this.hostname);
        }
        var p = this.port ? ":" + this.port : "";
        var h = this.hostname || "";
        this.host = h + p;
        this.href += this.host;
        if (ipv6Hostname) {
          this.hostname = this.hostname.substr(1, this.hostname.length - 2);
          if (rest[0] !== "/") {
            rest = "/" + rest;
          }
        }
      }
      if (!unsafeProtocol[lowerProto]) {
        for (var i = 0, l = autoEscape.length; i < l; i++) {
          var ae = autoEscape[i];
          if (rest.indexOf(ae) === -1)
            continue;
          var esc = encodeURIComponent(ae);
          if (esc === ae) {
            esc = escape(ae);
          }
          rest = rest.split(ae).join(esc);
        }
      }
      var hash = rest.indexOf("#");
      if (hash !== -1) {
        this.hash = rest.substr(hash);
        rest = rest.slice(0, hash);
      }
      var qm = rest.indexOf("?");
      if (qm !== -1) {
        this.search = rest.substr(qm);
        this.query = rest.substr(qm + 1);
        if (parseQueryString) {
          this.query = querystring.parse(this.query);
        }
        rest = rest.slice(0, qm);
      } else if (parseQueryString) {
        this.search = "";
        this.query = {};
      }
      if (rest)
        this.pathname = rest;
      if (slashedProtocol[lowerProto] && this.hostname && !this.pathname) {
        this.pathname = "/";
      }
      if (this.pathname || this.search) {
        var p = this.pathname || "";
        var s = this.search || "";
        this.path = p + s;
      }
      this.href = this.format();
      return this;
    };
    function urlFormat(obj) {
      if (util.isString(obj))
        obj = urlParse(obj);
      if (!(obj instanceof Url2))
        return Url2.prototype.format.call(obj);
      return obj.format();
    }
    Url2.prototype.format = function() {
      var auth = this.auth || "";
      if (auth) {
        auth = encodeURIComponent(auth);
        auth = auth.replace(/%3A/i, ":");
        auth += "@";
      }
      var protocol = this.protocol || "", pathname = this.pathname || "", hash = this.hash || "", host = false, query = "";
      if (this.host) {
        host = auth + this.host;
      } else if (this.hostname) {
        host = auth + (this.hostname.indexOf(":") === -1 ? this.hostname : "[" + this.hostname + "]");
        if (this.port) {
          host += ":" + this.port;
        }
      }
      if (this.query && util.isObject(this.query) && Object.keys(this.query).length) {
        query = querystring.stringify(this.query);
      }
      var search = this.search || query && "?" + query || "";
      if (protocol && protocol.substr(-1) !== ":")
        protocol += ":";
      if (this.slashes || (!protocol || slashedProtocol[protocol]) && host !== false) {
        host = "//" + (host || "");
        if (pathname && pathname.charAt(0) !== "/")
          pathname = "/" + pathname;
      } else if (!host) {
        host = "";
      }
      if (hash && hash.charAt(0) !== "#")
        hash = "#" + hash;
      if (search && search.charAt(0) !== "?")
        search = "?" + search;
      pathname = pathname.replace(/[?#]/g, function(match) {
        return encodeURIComponent(match);
      });
      search = search.replace("#", "%23");
      return protocol + host + pathname + search + hash;
    };
    function urlResolve(source, relative) {
      return urlParse(source, false, true).resolve(relative);
    }
    Url2.prototype.resolve = function(relative) {
      return this.resolveObject(urlParse(relative, false, true)).format();
    };
    function urlResolveObject(source, relative) {
      if (!source)
        return relative;
      return urlParse(source, false, true).resolveObject(relative);
    }
    Url2.prototype.resolveObject = function(relative) {
      if (util.isString(relative)) {
        var rel = new Url2();
        rel.parse(relative, false, true);
        relative = rel;
      }
      var result = new Url2();
      var tkeys = Object.keys(this);
      for (var tk = 0; tk < tkeys.length; tk++) {
        var tkey = tkeys[tk];
        result[tkey] = this[tkey];
      }
      result.hash = relative.hash;
      if (relative.href === "") {
        result.href = result.format();
        return result;
      }
      if (relative.slashes && !relative.protocol) {
        var rkeys = Object.keys(relative);
        for (var rk = 0; rk < rkeys.length; rk++) {
          var rkey = rkeys[rk];
          if (rkey !== "protocol")
            result[rkey] = relative[rkey];
        }
        if (slashedProtocol[result.protocol] && result.hostname && !result.pathname) {
          result.path = result.pathname = "/";
        }
        result.href = result.format();
        return result;
      }
      if (relative.protocol && relative.protocol !== result.protocol) {
        if (!slashedProtocol[relative.protocol]) {
          var keys = Object.keys(relative);
          for (var v = 0; v < keys.length; v++) {
            var k = keys[v];
            result[k] = relative[k];
          }
          result.href = result.format();
          return result;
        }
        result.protocol = relative.protocol;
        if (!relative.host && !hostlessProtocol[relative.protocol]) {
          var relPath = (relative.pathname || "").split("/");
          while (relPath.length && !(relative.host = relPath.shift()))
            ;
          if (!relative.host)
            relative.host = "";
          if (!relative.hostname)
            relative.hostname = "";
          if (relPath[0] !== "")
            relPath.unshift("");
          if (relPath.length < 2)
            relPath.unshift("");
          result.pathname = relPath.join("/");
        } else {
          result.pathname = relative.pathname;
        }
        result.search = relative.search;
        result.query = relative.query;
        result.host = relative.host || "";
        result.auth = relative.auth;
        result.hostname = relative.hostname || relative.host;
        result.port = relative.port;
        if (result.pathname || result.search) {
          var p = result.pathname || "";
          var s = result.search || "";
          result.path = p + s;
        }
        result.slashes = result.slashes || relative.slashes;
        result.href = result.format();
        return result;
      }
      var isSourceAbs = result.pathname && result.pathname.charAt(0) === "/", isRelAbs = relative.host || relative.pathname && relative.pathname.charAt(0) === "/", mustEndAbs = isRelAbs || isSourceAbs || result.host && relative.pathname, removeAllDots = mustEndAbs, srcPath = result.pathname && result.pathname.split("/") || [], relPath = relative.pathname && relative.pathname.split("/") || [], psychotic = result.protocol && !slashedProtocol[result.protocol];
      if (psychotic) {
        result.hostname = "";
        result.port = null;
        if (result.host) {
          if (srcPath[0] === "")
            srcPath[0] = result.host;
          else
            srcPath.unshift(result.host);
        }
        result.host = "";
        if (relative.protocol) {
          relative.hostname = null;
          relative.port = null;
          if (relative.host) {
            if (relPath[0] === "")
              relPath[0] = relative.host;
            else
              relPath.unshift(relative.host);
          }
          relative.host = null;
        }
        mustEndAbs = mustEndAbs && (relPath[0] === "" || srcPath[0] === "");
      }
      if (isRelAbs) {
        result.host = relative.host || relative.host === "" ? relative.host : result.host;
        result.hostname = relative.hostname || relative.hostname === "" ? relative.hostname : result.hostname;
        result.search = relative.search;
        result.query = relative.query;
        srcPath = relPath;
      } else if (relPath.length) {
        if (!srcPath)
          srcPath = [];
        srcPath.pop();
        srcPath = srcPath.concat(relPath);
        result.search = relative.search;
        result.query = relative.query;
      } else if (!util.isNullOrUndefined(relative.search)) {
        if (psychotic) {
          result.hostname = result.host = srcPath.shift();
          var authInHost = result.host && result.host.indexOf("@") > 0 ? result.host.split("@") : false;
          if (authInHost) {
            result.auth = authInHost.shift();
            result.host = result.hostname = authInHost.shift();
          }
        }
        result.search = relative.search;
        result.query = relative.query;
        if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
          result.path = (result.pathname ? result.pathname : "") + (result.search ? result.search : "");
        }
        result.href = result.format();
        return result;
      }
      if (!srcPath.length) {
        result.pathname = null;
        if (result.search) {
          result.path = "/" + result.search;
        } else {
          result.path = null;
        }
        result.href = result.format();
        return result;
      }
      var last = srcPath.slice(-1)[0];
      var hasTrailingSlash = (result.host || relative.host || srcPath.length > 1) && (last === "." || last === "..") || last === "";
      var up = 0;
      for (var i = srcPath.length; i >= 0; i--) {
        last = srcPath[i];
        if (last === ".") {
          srcPath.splice(i, 1);
        } else if (last === "..") {
          srcPath.splice(i, 1);
          up++;
        } else if (up) {
          srcPath.splice(i, 1);
          up--;
        }
      }
      if (!mustEndAbs && !removeAllDots) {
        for (; up--; up) {
          srcPath.unshift("..");
        }
      }
      if (mustEndAbs && srcPath[0] !== "" && (!srcPath[0] || srcPath[0].charAt(0) !== "/")) {
        srcPath.unshift("");
      }
      if (hasTrailingSlash && srcPath.join("/").substr(-1) !== "/") {
        srcPath.push("");
      }
      var isAbsolute = srcPath[0] === "" || srcPath[0] && srcPath[0].charAt(0) === "/";
      if (psychotic) {
        result.hostname = result.host = isAbsolute ? "" : srcPath.length ? srcPath.shift() : "";
        var authInHost = result.host && result.host.indexOf("@") > 0 ? result.host.split("@") : false;
        if (authInHost) {
          result.auth = authInHost.shift();
          result.host = result.hostname = authInHost.shift();
        }
      }
      mustEndAbs = mustEndAbs || result.host && srcPath.length;
      if (mustEndAbs && !isAbsolute) {
        srcPath.unshift("");
      }
      if (!srcPath.length) {
        result.pathname = null;
        result.path = null;
      } else {
        result.pathname = srcPath.join("/");
      }
      if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
        result.path = (result.pathname ? result.pathname : "") + (result.search ? result.search : "");
      }
      result.auth = relative.auth || result.auth;
      result.slashes = result.slashes || relative.slashes;
      result.href = result.format();
      return result;
    };
    Url2.prototype.parseHost = function() {
      var host = this.host;
      var port = portPattern.exec(host);
      if (port) {
        port = port[0];
        if (port !== ":") {
          this.port = port.substr(1);
        }
        host = host.substr(0, host.length - port.length);
      }
      if (host)
        this.hostname = host;
    };
  });

  // node_modules/parse-uri/index.js
  var require_parse_uri = __commonJS((exports, module) => {
    "use strict";
    function parseURI(str, opts) {
      if (!str)
        return void 0;
      opts = opts || {};
      var o = {
        key: [
          "source",
          "protocol",
          "authority",
          "userInfo",
          "user",
          "password",
          "host",
          "port",
          "relative",
          "path",
          "directory",
          "file",
          "query",
          "anchor"
        ],
        q: {
          name: "queryKey",
          parser: /(?:^|&)([^&=]*)=?([^&]*)/g
        },
        parser: {
          strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
          loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
        }
      };
      var m = o.parser[opts.strictMode ? "strict" : "loose"].exec(str);
      var uri = {};
      var i = 14;
      while (i--)
        uri[o.key[i]] = m[i] || "";
      uri[o.q.name] = {};
      uri[o.key[12]].replace(o.q.parser, function($0, $1, $2) {
        if ($1)
          uri[o.q.name][$1] = $2;
      });
      return uri;
    }
    module.exports = parseURI;
  });

  // node_modules/mini-signals/lib/mini-signals.js
  var require_mini_signals = __commonJS((exports, module) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _createClass2 = function() {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor)
            descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
        }
      }
      return function(Constructor, protoProps, staticProps) {
        if (protoProps)
          defineProperties(Constructor.prototype, protoProps);
        if (staticProps)
          defineProperties(Constructor, staticProps);
        return Constructor;
      };
    }();
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    var MiniSignalBinding = function() {
      function MiniSignalBinding2(fn, once, thisArg) {
        if (once === void 0)
          once = false;
        _classCallCheck(this, MiniSignalBinding2);
        this._fn = fn;
        this._once = once;
        this._thisArg = thisArg;
        this._next = this._prev = this._owner = null;
      }
      _createClass2(MiniSignalBinding2, [{
        key: "detach",
        value: function detach() {
          if (this._owner === null)
            return false;
          this._owner.detach(this);
          return true;
        }
      }]);
      return MiniSignalBinding2;
    }();
    function _addMiniSignalBinding(self2, node) {
      if (!self2._head) {
        self2._head = node;
        self2._tail = node;
      } else {
        self2._tail._next = node;
        node._prev = self2._tail;
        self2._tail = node;
      }
      node._owner = self2;
      return node;
    }
    var MiniSignal = function() {
      function MiniSignal2() {
        _classCallCheck(this, MiniSignal2);
        this._head = this._tail = void 0;
      }
      _createClass2(MiniSignal2, [{
        key: "handlers",
        value: function handlers() {
          var exists = arguments.length <= 0 || arguments[0] === void 0 ? false : arguments[0];
          var node = this._head;
          if (exists)
            return !!node;
          var ee = [];
          while (node) {
            ee.push(node);
            node = node._next;
          }
          return ee;
        }
      }, {
        key: "has",
        value: function has(node) {
          if (!(node instanceof MiniSignalBinding)) {
            throw new Error("MiniSignal#has(): First arg must be a MiniSignalBinding object.");
          }
          return node._owner === this;
        }
      }, {
        key: "dispatch",
        value: function dispatch() {
          var node = this._head;
          if (!node)
            return false;
          while (node) {
            if (node._once)
              this.detach(node);
            node._fn.apply(node._thisArg, arguments);
            node = node._next;
          }
          return true;
        }
      }, {
        key: "add",
        value: function add(fn) {
          var thisArg = arguments.length <= 1 || arguments[1] === void 0 ? null : arguments[1];
          if (typeof fn !== "function") {
            throw new Error("MiniSignal#add(): First arg must be a Function.");
          }
          return _addMiniSignalBinding(this, new MiniSignalBinding(fn, false, thisArg));
        }
      }, {
        key: "once",
        value: function once(fn) {
          var thisArg = arguments.length <= 1 || arguments[1] === void 0 ? null : arguments[1];
          if (typeof fn !== "function") {
            throw new Error("MiniSignal#once(): First arg must be a Function.");
          }
          return _addMiniSignalBinding(this, new MiniSignalBinding(fn, true, thisArg));
        }
      }, {
        key: "detach",
        value: function detach(node) {
          if (!(node instanceof MiniSignalBinding)) {
            throw new Error("MiniSignal#detach(): First arg must be a MiniSignalBinding object.");
          }
          if (node._owner !== this)
            return this;
          if (node._prev)
            node._prev._next = node._next;
          if (node._next)
            node._next._prev = node._prev;
          if (node === this._head) {
            this._head = node._next;
            if (node._next === null) {
              this._tail = null;
            }
          } else if (node === this._tail) {
            this._tail = node._prev;
            this._tail._next = null;
          }
          node._owner = null;
          return this;
        }
      }, {
        key: "detachAll",
        value: function detachAll() {
          var node = this._head;
          if (!node)
            return this;
          this._head = this._tail = null;
          while (node) {
            node._owner = null;
            node = node._next;
          }
          return this;
        }
      }]);
      return MiniSignal2;
    }();
    MiniSignal.MiniSignalBinding = MiniSignalBinding;
    exports["default"] = MiniSignal;
    module.exports = exports["default"];
  });

  // node_modules/tinycolor2/tinycolor.js
  var require_tinycolor = __commonJS((exports, module) => {
    (function(Math2) {
      var trimLeft = /^\s+/, trimRight = /\s+$/, tinyCounter = 0, mathRound = Math2.round, mathMin = Math2.min, mathMax = Math2.max, mathRandom = Math2.random;
      function tinycolor(color, opts) {
        color = color ? color : "";
        opts = opts || {};
        if (color instanceof tinycolor) {
          return color;
        }
        if (!(this instanceof tinycolor)) {
          return new tinycolor(color, opts);
        }
        var rgb = inputToRGB(color);
        this._originalInput = color, this._r = rgb.r, this._g = rgb.g, this._b = rgb.b, this._a = rgb.a, this._roundA = mathRound(100 * this._a) / 100, this._format = opts.format || rgb.format;
        this._gradientType = opts.gradientType;
        if (this._r < 1) {
          this._r = mathRound(this._r);
        }
        if (this._g < 1) {
          this._g = mathRound(this._g);
        }
        if (this._b < 1) {
          this._b = mathRound(this._b);
        }
        this._ok = rgb.ok;
        this._tc_id = tinyCounter++;
      }
      tinycolor.prototype = {
        isDark: function() {
          return this.getBrightness() < 128;
        },
        isLight: function() {
          return !this.isDark();
        },
        isValid: function() {
          return this._ok;
        },
        getOriginalInput: function() {
          return this._originalInput;
        },
        getFormat: function() {
          return this._format;
        },
        getAlpha: function() {
          return this._a;
        },
        getBrightness: function() {
          var rgb = this.toRgb();
          return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1e3;
        },
        getLuminance: function() {
          var rgb = this.toRgb();
          var RsRGB, GsRGB, BsRGB, R, G, B;
          RsRGB = rgb.r / 255;
          GsRGB = rgb.g / 255;
          BsRGB = rgb.b / 255;
          if (RsRGB <= 0.03928) {
            R = RsRGB / 12.92;
          } else {
            R = Math2.pow((RsRGB + 0.055) / 1.055, 2.4);
          }
          if (GsRGB <= 0.03928) {
            G = GsRGB / 12.92;
          } else {
            G = Math2.pow((GsRGB + 0.055) / 1.055, 2.4);
          }
          if (BsRGB <= 0.03928) {
            B = BsRGB / 12.92;
          } else {
            B = Math2.pow((BsRGB + 0.055) / 1.055, 2.4);
          }
          return 0.2126 * R + 0.7152 * G + 0.0722 * B;
        },
        setAlpha: function(value) {
          this._a = boundAlpha(value);
          this._roundA = mathRound(100 * this._a) / 100;
          return this;
        },
        toHsv: function() {
          var hsv = rgbToHsv(this._r, this._g, this._b);
          return {h: hsv.h * 360, s: hsv.s, v: hsv.v, a: this._a};
        },
        toHsvString: function() {
          var hsv = rgbToHsv(this._r, this._g, this._b);
          var h = mathRound(hsv.h * 360), s = mathRound(hsv.s * 100), v = mathRound(hsv.v * 100);
          return this._a == 1 ? "hsv(" + h + ", " + s + "%, " + v + "%)" : "hsva(" + h + ", " + s + "%, " + v + "%, " + this._roundA + ")";
        },
        toHsl: function() {
          var hsl = rgbToHsl(this._r, this._g, this._b);
          return {h: hsl.h * 360, s: hsl.s, l: hsl.l, a: this._a};
        },
        toHslString: function() {
          var hsl = rgbToHsl(this._r, this._g, this._b);
          var h = mathRound(hsl.h * 360), s = mathRound(hsl.s * 100), l = mathRound(hsl.l * 100);
          return this._a == 1 ? "hsl(" + h + ", " + s + "%, " + l + "%)" : "hsla(" + h + ", " + s + "%, " + l + "%, " + this._roundA + ")";
        },
        toHex: function(allow3Char) {
          return rgbToHex(this._r, this._g, this._b, allow3Char);
        },
        toHexString: function(allow3Char) {
          return "#" + this.toHex(allow3Char);
        },
        toHex8: function(allow4Char) {
          return rgbaToHex(this._r, this._g, this._b, this._a, allow4Char);
        },
        toHex8String: function(allow4Char) {
          return "#" + this.toHex8(allow4Char);
        },
        toRgb: function() {
          return {r: mathRound(this._r), g: mathRound(this._g), b: mathRound(this._b), a: this._a};
        },
        toRgbString: function() {
          return this._a == 1 ? "rgb(" + mathRound(this._r) + ", " + mathRound(this._g) + ", " + mathRound(this._b) + ")" : "rgba(" + mathRound(this._r) + ", " + mathRound(this._g) + ", " + mathRound(this._b) + ", " + this._roundA + ")";
        },
        toPercentageRgb: function() {
          return {r: mathRound(bound01(this._r, 255) * 100) + "%", g: mathRound(bound01(this._g, 255) * 100) + "%", b: mathRound(bound01(this._b, 255) * 100) + "%", a: this._a};
        },
        toPercentageRgbString: function() {
          return this._a == 1 ? "rgb(" + mathRound(bound01(this._r, 255) * 100) + "%, " + mathRound(bound01(this._g, 255) * 100) + "%, " + mathRound(bound01(this._b, 255) * 100) + "%)" : "rgba(" + mathRound(bound01(this._r, 255) * 100) + "%, " + mathRound(bound01(this._g, 255) * 100) + "%, " + mathRound(bound01(this._b, 255) * 100) + "%, " + this._roundA + ")";
        },
        toName: function() {
          if (this._a === 0) {
            return "transparent";
          }
          if (this._a < 1) {
            return false;
          }
          return hexNames[rgbToHex(this._r, this._g, this._b, true)] || false;
        },
        toFilter: function(secondColor) {
          var hex8String = "#" + rgbaToArgbHex(this._r, this._g, this._b, this._a);
          var secondHex8String = hex8String;
          var gradientType = this._gradientType ? "GradientType = 1, " : "";
          if (secondColor) {
            var s = tinycolor(secondColor);
            secondHex8String = "#" + rgbaToArgbHex(s._r, s._g, s._b, s._a);
          }
          return "progid:DXImageTransform.Microsoft.gradient(" + gradientType + "startColorstr=" + hex8String + ",endColorstr=" + secondHex8String + ")";
        },
        toString: function(format) {
          var formatSet = !!format;
          format = format || this._format;
          var formattedString = false;
          var hasAlpha = this._a < 1 && this._a >= 0;
          var needsAlphaFormat = !formatSet && hasAlpha && (format === "hex" || format === "hex6" || format === "hex3" || format === "hex4" || format === "hex8" || format === "name");
          if (needsAlphaFormat) {
            if (format === "name" && this._a === 0) {
              return this.toName();
            }
            return this.toRgbString();
          }
          if (format === "rgb") {
            formattedString = this.toRgbString();
          }
          if (format === "prgb") {
            formattedString = this.toPercentageRgbString();
          }
          if (format === "hex" || format === "hex6") {
            formattedString = this.toHexString();
          }
          if (format === "hex3") {
            formattedString = this.toHexString(true);
          }
          if (format === "hex4") {
            formattedString = this.toHex8String(true);
          }
          if (format === "hex8") {
            formattedString = this.toHex8String();
          }
          if (format === "name") {
            formattedString = this.toName();
          }
          if (format === "hsl") {
            formattedString = this.toHslString();
          }
          if (format === "hsv") {
            formattedString = this.toHsvString();
          }
          return formattedString || this.toHexString();
        },
        clone: function() {
          return tinycolor(this.toString());
        },
        _applyModification: function(fn, args) {
          var color = fn.apply(null, [this].concat([].slice.call(args)));
          this._r = color._r;
          this._g = color._g;
          this._b = color._b;
          this.setAlpha(color._a);
          return this;
        },
        lighten: function() {
          return this._applyModification(lighten, arguments);
        },
        brighten: function() {
          return this._applyModification(brighten, arguments);
        },
        darken: function() {
          return this._applyModification(darken, arguments);
        },
        desaturate: function() {
          return this._applyModification(desaturate, arguments);
        },
        saturate: function() {
          return this._applyModification(saturate, arguments);
        },
        greyscale: function() {
          return this._applyModification(greyscale, arguments);
        },
        spin: function() {
          return this._applyModification(spin, arguments);
        },
        _applyCombination: function(fn, args) {
          return fn.apply(null, [this].concat([].slice.call(args)));
        },
        analogous: function() {
          return this._applyCombination(analogous, arguments);
        },
        complement: function() {
          return this._applyCombination(complement, arguments);
        },
        monochromatic: function() {
          return this._applyCombination(monochromatic, arguments);
        },
        splitcomplement: function() {
          return this._applyCombination(splitcomplement, arguments);
        },
        triad: function() {
          return this._applyCombination(triad, arguments);
        },
        tetrad: function() {
          return this._applyCombination(tetrad, arguments);
        }
      };
      tinycolor.fromRatio = function(color, opts) {
        if (typeof color == "object") {
          var newColor = {};
          for (var i in color) {
            if (color.hasOwnProperty(i)) {
              if (i === "a") {
                newColor[i] = color[i];
              } else {
                newColor[i] = convertToPercentage(color[i]);
              }
            }
          }
          color = newColor;
        }
        return tinycolor(color, opts);
      };
      function inputToRGB(color) {
        var rgb = {r: 0, g: 0, b: 0};
        var a = 1;
        var s = null;
        var v = null;
        var l = null;
        var ok = false;
        var format = false;
        if (typeof color == "string") {
          color = stringInputToObject(color);
        }
        if (typeof color == "object") {
          if (isValidCSSUnit(color.r) && isValidCSSUnit(color.g) && isValidCSSUnit(color.b)) {
            rgb = rgbToRgb(color.r, color.g, color.b);
            ok = true;
            format = String(color.r).substr(-1) === "%" ? "prgb" : "rgb";
          } else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.v)) {
            s = convertToPercentage(color.s);
            v = convertToPercentage(color.v);
            rgb = hsvToRgb(color.h, s, v);
            ok = true;
            format = "hsv";
          } else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.l)) {
            s = convertToPercentage(color.s);
            l = convertToPercentage(color.l);
            rgb = hslToRgb(color.h, s, l);
            ok = true;
            format = "hsl";
          }
          if (color.hasOwnProperty("a")) {
            a = color.a;
          }
        }
        a = boundAlpha(a);
        return {
          ok,
          format: color.format || format,
          r: mathMin(255, mathMax(rgb.r, 0)),
          g: mathMin(255, mathMax(rgb.g, 0)),
          b: mathMin(255, mathMax(rgb.b, 0)),
          a
        };
      }
      function rgbToRgb(r, g, b) {
        return {
          r: bound01(r, 255) * 255,
          g: bound01(g, 255) * 255,
          b: bound01(b, 255) * 255
        };
      }
      function rgbToHsl(r, g, b) {
        r = bound01(r, 255);
        g = bound01(g, 255);
        b = bound01(b, 255);
        var max = mathMax(r, g, b), min = mathMin(r, g, b);
        var h, s, l = (max + min) / 2;
        if (max == min) {
          h = s = 0;
        } else {
          var d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          switch (max) {
            case r:
              h = (g - b) / d + (g < b ? 6 : 0);
              break;
            case g:
              h = (b - r) / d + 2;
              break;
            case b:
              h = (r - g) / d + 4;
              break;
          }
          h /= 6;
        }
        return {h, s, l};
      }
      function hslToRgb(h, s, l) {
        var r, g, b;
        h = bound01(h, 360);
        s = bound01(s, 100);
        l = bound01(l, 100);
        function hue2rgb(p2, q2, t) {
          if (t < 0)
            t += 1;
          if (t > 1)
            t -= 1;
          if (t < 1 / 6)
            return p2 + (q2 - p2) * 6 * t;
          if (t < 1 / 2)
            return q2;
          if (t < 2 / 3)
            return p2 + (q2 - p2) * (2 / 3 - t) * 6;
          return p2;
        }
        if (s === 0) {
          r = g = b = l;
        } else {
          var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
          var p = 2 * l - q;
          r = hue2rgb(p, q, h + 1 / 3);
          g = hue2rgb(p, q, h);
          b = hue2rgb(p, q, h - 1 / 3);
        }
        return {r: r * 255, g: g * 255, b: b * 255};
      }
      function rgbToHsv(r, g, b) {
        r = bound01(r, 255);
        g = bound01(g, 255);
        b = bound01(b, 255);
        var max = mathMax(r, g, b), min = mathMin(r, g, b);
        var h, s, v = max;
        var d = max - min;
        s = max === 0 ? 0 : d / max;
        if (max == min) {
          h = 0;
        } else {
          switch (max) {
            case r:
              h = (g - b) / d + (g < b ? 6 : 0);
              break;
            case g:
              h = (b - r) / d + 2;
              break;
            case b:
              h = (r - g) / d + 4;
              break;
          }
          h /= 6;
        }
        return {h, s, v};
      }
      function hsvToRgb(h, s, v) {
        h = bound01(h, 360) * 6;
        s = bound01(s, 100);
        v = bound01(v, 100);
        var i = Math2.floor(h), f = h - i, p = v * (1 - s), q = v * (1 - f * s), t = v * (1 - (1 - f) * s), mod = i % 6, r = [v, q, p, p, t, v][mod], g = [t, v, v, q, p, p][mod], b = [p, p, t, v, v, q][mod];
        return {r: r * 255, g: g * 255, b: b * 255};
      }
      function rgbToHex(r, g, b, allow3Char) {
        var hex = [
          pad2(mathRound(r).toString(16)),
          pad2(mathRound(g).toString(16)),
          pad2(mathRound(b).toString(16))
        ];
        if (allow3Char && hex[0].charAt(0) == hex[0].charAt(1) && hex[1].charAt(0) == hex[1].charAt(1) && hex[2].charAt(0) == hex[2].charAt(1)) {
          return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
        }
        return hex.join("");
      }
      function rgbaToHex(r, g, b, a, allow4Char) {
        var hex = [
          pad2(mathRound(r).toString(16)),
          pad2(mathRound(g).toString(16)),
          pad2(mathRound(b).toString(16)),
          pad2(convertDecimalToHex(a))
        ];
        if (allow4Char && hex[0].charAt(0) == hex[0].charAt(1) && hex[1].charAt(0) == hex[1].charAt(1) && hex[2].charAt(0) == hex[2].charAt(1) && hex[3].charAt(0) == hex[3].charAt(1)) {
          return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0) + hex[3].charAt(0);
        }
        return hex.join("");
      }
      function rgbaToArgbHex(r, g, b, a) {
        var hex = [
          pad2(convertDecimalToHex(a)),
          pad2(mathRound(r).toString(16)),
          pad2(mathRound(g).toString(16)),
          pad2(mathRound(b).toString(16))
        ];
        return hex.join("");
      }
      tinycolor.equals = function(color1, color2) {
        if (!color1 || !color2) {
          return false;
        }
        return tinycolor(color1).toRgbString() == tinycolor(color2).toRgbString();
      };
      tinycolor.random = function() {
        return tinycolor.fromRatio({
          r: mathRandom(),
          g: mathRandom(),
          b: mathRandom()
        });
      };
      function desaturate(color, amount) {
        amount = amount === 0 ? 0 : amount || 10;
        var hsl = tinycolor(color).toHsl();
        hsl.s -= amount / 100;
        hsl.s = clamp01(hsl.s);
        return tinycolor(hsl);
      }
      function saturate(color, amount) {
        amount = amount === 0 ? 0 : amount || 10;
        var hsl = tinycolor(color).toHsl();
        hsl.s += amount / 100;
        hsl.s = clamp01(hsl.s);
        return tinycolor(hsl);
      }
      function greyscale(color) {
        return tinycolor(color).desaturate(100);
      }
      function lighten(color, amount) {
        amount = amount === 0 ? 0 : amount || 10;
        var hsl = tinycolor(color).toHsl();
        hsl.l += amount / 100;
        hsl.l = clamp01(hsl.l);
        return tinycolor(hsl);
      }
      function brighten(color, amount) {
        amount = amount === 0 ? 0 : amount || 10;
        var rgb = tinycolor(color).toRgb();
        rgb.r = mathMax(0, mathMin(255, rgb.r - mathRound(255 * -(amount / 100))));
        rgb.g = mathMax(0, mathMin(255, rgb.g - mathRound(255 * -(amount / 100))));
        rgb.b = mathMax(0, mathMin(255, rgb.b - mathRound(255 * -(amount / 100))));
        return tinycolor(rgb);
      }
      function darken(color, amount) {
        amount = amount === 0 ? 0 : amount || 10;
        var hsl = tinycolor(color).toHsl();
        hsl.l -= amount / 100;
        hsl.l = clamp01(hsl.l);
        return tinycolor(hsl);
      }
      function spin(color, amount) {
        var hsl = tinycolor(color).toHsl();
        var hue = (hsl.h + amount) % 360;
        hsl.h = hue < 0 ? 360 + hue : hue;
        return tinycolor(hsl);
      }
      function complement(color) {
        var hsl = tinycolor(color).toHsl();
        hsl.h = (hsl.h + 180) % 360;
        return tinycolor(hsl);
      }
      function triad(color) {
        var hsl = tinycolor(color).toHsl();
        var h = hsl.h;
        return [
          tinycolor(color),
          tinycolor({h: (h + 120) % 360, s: hsl.s, l: hsl.l}),
          tinycolor({h: (h + 240) % 360, s: hsl.s, l: hsl.l})
        ];
      }
      function tetrad(color) {
        var hsl = tinycolor(color).toHsl();
        var h = hsl.h;
        return [
          tinycolor(color),
          tinycolor({h: (h + 90) % 360, s: hsl.s, l: hsl.l}),
          tinycolor({h: (h + 180) % 360, s: hsl.s, l: hsl.l}),
          tinycolor({h: (h + 270) % 360, s: hsl.s, l: hsl.l})
        ];
      }
      function splitcomplement(color) {
        var hsl = tinycolor(color).toHsl();
        var h = hsl.h;
        return [
          tinycolor(color),
          tinycolor({h: (h + 72) % 360, s: hsl.s, l: hsl.l}),
          tinycolor({h: (h + 216) % 360, s: hsl.s, l: hsl.l})
        ];
      }
      function analogous(color, results, slices) {
        results = results || 6;
        slices = slices || 30;
        var hsl = tinycolor(color).toHsl();
        var part = 360 / slices;
        var ret = [tinycolor(color)];
        for (hsl.h = (hsl.h - (part * results >> 1) + 720) % 360; --results; ) {
          hsl.h = (hsl.h + part) % 360;
          ret.push(tinycolor(hsl));
        }
        return ret;
      }
      function monochromatic(color, results) {
        results = results || 6;
        var hsv = tinycolor(color).toHsv();
        var h = hsv.h, s = hsv.s, v = hsv.v;
        var ret = [];
        var modification = 1 / results;
        while (results--) {
          ret.push(tinycolor({h, s, v}));
          v = (v + modification) % 1;
        }
        return ret;
      }
      tinycolor.mix = function(color1, color2, amount) {
        amount = amount === 0 ? 0 : amount || 50;
        var rgb1 = tinycolor(color1).toRgb();
        var rgb2 = tinycolor(color2).toRgb();
        var p = amount / 100;
        var rgba = {
          r: (rgb2.r - rgb1.r) * p + rgb1.r,
          g: (rgb2.g - rgb1.g) * p + rgb1.g,
          b: (rgb2.b - rgb1.b) * p + rgb1.b,
          a: (rgb2.a - rgb1.a) * p + rgb1.a
        };
        return tinycolor(rgba);
      };
      tinycolor.readability = function(color1, color2) {
        var c1 = tinycolor(color1);
        var c2 = tinycolor(color2);
        return (Math2.max(c1.getLuminance(), c2.getLuminance()) + 0.05) / (Math2.min(c1.getLuminance(), c2.getLuminance()) + 0.05);
      };
      tinycolor.isReadable = function(color1, color2, wcag2) {
        var readability = tinycolor.readability(color1, color2);
        var wcag2Parms, out;
        out = false;
        wcag2Parms = validateWCAG2Parms(wcag2);
        switch (wcag2Parms.level + wcag2Parms.size) {
          case "AAsmall":
          case "AAAlarge":
            out = readability >= 4.5;
            break;
          case "AAlarge":
            out = readability >= 3;
            break;
          case "AAAsmall":
            out = readability >= 7;
            break;
        }
        return out;
      };
      tinycolor.mostReadable = function(baseColor, colorList, args) {
        var bestColor = null;
        var bestScore = 0;
        var readability;
        var includeFallbackColors, level, size2;
        args = args || {};
        includeFallbackColors = args.includeFallbackColors;
        level = args.level;
        size2 = args.size;
        for (var i = 0; i < colorList.length; i++) {
          readability = tinycolor.readability(baseColor, colorList[i]);
          if (readability > bestScore) {
            bestScore = readability;
            bestColor = tinycolor(colorList[i]);
          }
        }
        if (tinycolor.isReadable(baseColor, bestColor, {level, size: size2}) || !includeFallbackColors) {
          return bestColor;
        } else {
          args.includeFallbackColors = false;
          return tinycolor.mostReadable(baseColor, ["#fff", "#000"], args);
        }
      };
      var names = tinycolor.names = {
        aliceblue: "f0f8ff",
        antiquewhite: "faebd7",
        aqua: "0ff",
        aquamarine: "7fffd4",
        azure: "f0ffff",
        beige: "f5f5dc",
        bisque: "ffe4c4",
        black: "000",
        blanchedalmond: "ffebcd",
        blue: "00f",
        blueviolet: "8a2be2",
        brown: "a52a2a",
        burlywood: "deb887",
        burntsienna: "ea7e5d",
        cadetblue: "5f9ea0",
        chartreuse: "7fff00",
        chocolate: "d2691e",
        coral: "ff7f50",
        cornflowerblue: "6495ed",
        cornsilk: "fff8dc",
        crimson: "dc143c",
        cyan: "0ff",
        darkblue: "00008b",
        darkcyan: "008b8b",
        darkgoldenrod: "b8860b",
        darkgray: "a9a9a9",
        darkgreen: "006400",
        darkgrey: "a9a9a9",
        darkkhaki: "bdb76b",
        darkmagenta: "8b008b",
        darkolivegreen: "556b2f",
        darkorange: "ff8c00",
        darkorchid: "9932cc",
        darkred: "8b0000",
        darksalmon: "e9967a",
        darkseagreen: "8fbc8f",
        darkslateblue: "483d8b",
        darkslategray: "2f4f4f",
        darkslategrey: "2f4f4f",
        darkturquoise: "00ced1",
        darkviolet: "9400d3",
        deeppink: "ff1493",
        deepskyblue: "00bfff",
        dimgray: "696969",
        dimgrey: "696969",
        dodgerblue: "1e90ff",
        firebrick: "b22222",
        floralwhite: "fffaf0",
        forestgreen: "228b22",
        fuchsia: "f0f",
        gainsboro: "dcdcdc",
        ghostwhite: "f8f8ff",
        gold: "ffd700",
        goldenrod: "daa520",
        gray: "808080",
        green: "008000",
        greenyellow: "adff2f",
        grey: "808080",
        honeydew: "f0fff0",
        hotpink: "ff69b4",
        indianred: "cd5c5c",
        indigo: "4b0082",
        ivory: "fffff0",
        khaki: "f0e68c",
        lavender: "e6e6fa",
        lavenderblush: "fff0f5",
        lawngreen: "7cfc00",
        lemonchiffon: "fffacd",
        lightblue: "add8e6",
        lightcoral: "f08080",
        lightcyan: "e0ffff",
        lightgoldenrodyellow: "fafad2",
        lightgray: "d3d3d3",
        lightgreen: "90ee90",
        lightgrey: "d3d3d3",
        lightpink: "ffb6c1",
        lightsalmon: "ffa07a",
        lightseagreen: "20b2aa",
        lightskyblue: "87cefa",
        lightslategray: "789",
        lightslategrey: "789",
        lightsteelblue: "b0c4de",
        lightyellow: "ffffe0",
        lime: "0f0",
        limegreen: "32cd32",
        linen: "faf0e6",
        magenta: "f0f",
        maroon: "800000",
        mediumaquamarine: "66cdaa",
        mediumblue: "0000cd",
        mediumorchid: "ba55d3",
        mediumpurple: "9370db",
        mediumseagreen: "3cb371",
        mediumslateblue: "7b68ee",
        mediumspringgreen: "00fa9a",
        mediumturquoise: "48d1cc",
        mediumvioletred: "c71585",
        midnightblue: "191970",
        mintcream: "f5fffa",
        mistyrose: "ffe4e1",
        moccasin: "ffe4b5",
        navajowhite: "ffdead",
        navy: "000080",
        oldlace: "fdf5e6",
        olive: "808000",
        olivedrab: "6b8e23",
        orange: "ffa500",
        orangered: "ff4500",
        orchid: "da70d6",
        palegoldenrod: "eee8aa",
        palegreen: "98fb98",
        paleturquoise: "afeeee",
        palevioletred: "db7093",
        papayawhip: "ffefd5",
        peachpuff: "ffdab9",
        peru: "cd853f",
        pink: "ffc0cb",
        plum: "dda0dd",
        powderblue: "b0e0e6",
        purple: "800080",
        rebeccapurple: "663399",
        red: "f00",
        rosybrown: "bc8f8f",
        royalblue: "4169e1",
        saddlebrown: "8b4513",
        salmon: "fa8072",
        sandybrown: "f4a460",
        seagreen: "2e8b57",
        seashell: "fff5ee",
        sienna: "a0522d",
        silver: "c0c0c0",
        skyblue: "87ceeb",
        slateblue: "6a5acd",
        slategray: "708090",
        slategrey: "708090",
        snow: "fffafa",
        springgreen: "00ff7f",
        steelblue: "4682b4",
        tan: "d2b48c",
        teal: "008080",
        thistle: "d8bfd8",
        tomato: "ff6347",
        turquoise: "40e0d0",
        violet: "ee82ee",
        wheat: "f5deb3",
        white: "fff",
        whitesmoke: "f5f5f5",
        yellow: "ff0",
        yellowgreen: "9acd32"
      };
      var hexNames = tinycolor.hexNames = flip(names);
      function flip(o) {
        var flipped = {};
        for (var i in o) {
          if (o.hasOwnProperty(i)) {
            flipped[o[i]] = i;
          }
        }
        return flipped;
      }
      function boundAlpha(a) {
        a = parseFloat(a);
        if (isNaN(a) || a < 0 || a > 1) {
          a = 1;
        }
        return a;
      }
      function bound01(n, max) {
        if (isOnePointZero(n)) {
          n = "100%";
        }
        var processPercent = isPercentage(n);
        n = mathMin(max, mathMax(0, parseFloat(n)));
        if (processPercent) {
          n = parseInt(n * max, 10) / 100;
        }
        if (Math2.abs(n - max) < 1e-6) {
          return 1;
        }
        return n % max / parseFloat(max);
      }
      function clamp01(val) {
        return mathMin(1, mathMax(0, val));
      }
      function parseIntFromHex(val) {
        return parseInt(val, 16);
      }
      function isOnePointZero(n) {
        return typeof n == "string" && n.indexOf(".") != -1 && parseFloat(n) === 1;
      }
      function isPercentage(n) {
        return typeof n === "string" && n.indexOf("%") != -1;
      }
      function pad2(c) {
        return c.length == 1 ? "0" + c : "" + c;
      }
      function convertToPercentage(n) {
        if (n <= 1) {
          n = n * 100 + "%";
        }
        return n;
      }
      function convertDecimalToHex(d) {
        return Math2.round(parseFloat(d) * 255).toString(16);
      }
      function convertHexToDecimal(h) {
        return parseIntFromHex(h) / 255;
      }
      var matchers = function() {
        var CSS_INTEGER = "[-\\+]?\\d+%?";
        var CSS_NUMBER = "[-\\+]?\\d*\\.\\d+%?";
        var CSS_UNIT = "(?:" + CSS_NUMBER + ")|(?:" + CSS_INTEGER + ")";
        var PERMISSIVE_MATCH3 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
        var PERMISSIVE_MATCH4 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
        return {
          CSS_UNIT: new RegExp(CSS_UNIT),
          rgb: new RegExp("rgb" + PERMISSIVE_MATCH3),
          rgba: new RegExp("rgba" + PERMISSIVE_MATCH4),
          hsl: new RegExp("hsl" + PERMISSIVE_MATCH3),
          hsla: new RegExp("hsla" + PERMISSIVE_MATCH4),
          hsv: new RegExp("hsv" + PERMISSIVE_MATCH3),
          hsva: new RegExp("hsva" + PERMISSIVE_MATCH4),
          hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
          hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
          hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
          hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
        };
      }();
      function isValidCSSUnit(color) {
        return !!matchers.CSS_UNIT.exec(color);
      }
      function stringInputToObject(color) {
        color = color.replace(trimLeft, "").replace(trimRight, "").toLowerCase();
        var named = false;
        if (names[color]) {
          color = names[color];
          named = true;
        } else if (color == "transparent") {
          return {r: 0, g: 0, b: 0, a: 0, format: "name"};
        }
        var match;
        if (match = matchers.rgb.exec(color)) {
          return {r: match[1], g: match[2], b: match[3]};
        }
        if (match = matchers.rgba.exec(color)) {
          return {r: match[1], g: match[2], b: match[3], a: match[4]};
        }
        if (match = matchers.hsl.exec(color)) {
          return {h: match[1], s: match[2], l: match[3]};
        }
        if (match = matchers.hsla.exec(color)) {
          return {h: match[1], s: match[2], l: match[3], a: match[4]};
        }
        if (match = matchers.hsv.exec(color)) {
          return {h: match[1], s: match[2], v: match[3]};
        }
        if (match = matchers.hsva.exec(color)) {
          return {h: match[1], s: match[2], v: match[3], a: match[4]};
        }
        if (match = matchers.hex8.exec(color)) {
          return {
            r: parseIntFromHex(match[1]),
            g: parseIntFromHex(match[2]),
            b: parseIntFromHex(match[3]),
            a: convertHexToDecimal(match[4]),
            format: named ? "name" : "hex8"
          };
        }
        if (match = matchers.hex6.exec(color)) {
          return {
            r: parseIntFromHex(match[1]),
            g: parseIntFromHex(match[2]),
            b: parseIntFromHex(match[3]),
            format: named ? "name" : "hex"
          };
        }
        if (match = matchers.hex4.exec(color)) {
          return {
            r: parseIntFromHex(match[1] + "" + match[1]),
            g: parseIntFromHex(match[2] + "" + match[2]),
            b: parseIntFromHex(match[3] + "" + match[3]),
            a: convertHexToDecimal(match[4] + "" + match[4]),
            format: named ? "name" : "hex8"
          };
        }
        if (match = matchers.hex3.exec(color)) {
          return {
            r: parseIntFromHex(match[1] + "" + match[1]),
            g: parseIntFromHex(match[2] + "" + match[2]),
            b: parseIntFromHex(match[3] + "" + match[3]),
            format: named ? "name" : "hex"
          };
        }
        return false;
      }
      function validateWCAG2Parms(parms) {
        var level, size2;
        parms = parms || {level: "AA", size: "small"};
        level = (parms.level || "AA").toUpperCase();
        size2 = (parms.size || "small").toLowerCase();
        if (level !== "AA" && level !== "AAA") {
          level = "AA";
        }
        if (size2 !== "small" && size2 !== "large") {
          size2 = "small";
        }
        return {level, size: size2};
      }
      if (typeof module !== "undefined" && module.exports) {
        module.exports = tinycolor;
      } else if (typeof define === "function" && define.amd) {
        define(function() {
          return tinycolor;
        });
      } else {
        window.tinycolor = tinycolor;
      }
    })(Math);
  });

  // node_modules/yy-counter/counter.js
  var require_counter = __commonJS((exports, module) => {
    module.exports = class Counter {
      constructor(options) {
        options = options || {};
        options.side = options.side || "rightbottom";
        options.side.toLowerCase();
        options.padding = options.padding || "7px";
        options.color = options.color || "white";
        options.background = options.background || "rgba(0,0,0,0.5)";
        this.div = document.createElement("div");
        Counter.findParent(options.side).appendChild(this.div);
        for (let style in options) {
          if (style !== "parent" && style !== "side") {
            this.div.style[style] = options[style];
          }
        }
      }
      static findParent(side) {
        const styles = [];
        let name = "yy-counter-";
        if (side.indexOf("left") !== -1) {
          name += "left-";
          styles["left"] = 0;
        } else {
          name += "right-";
          styles["right"] = 0;
        }
        if (side.indexOf("top") !== -1) {
          name += "top";
          styles["top"] = 0;
        } else {
          name += "bottom";
          styles["bottom"] = 0;
        }
        const test = document.getElementById(name);
        if (test) {
          return test;
        }
        const container = document.createElement("div");
        container.id = name;
        container.style.overflow = "hidden";
        container.style.position = "fixed";
        container.style.zIndex = 1e4;
        container.style.pointerEvents = "none";
        container.style.userSelect = "none";
        for (let style in styles) {
          container.style[style] = styles[style];
        }
        document.body.appendChild(container);
        return container;
      }
      log() {
        let s = "";
        for (let arg of arguments) {
          s += "<div>" + arg + "</div>";
        }
        this.div.innerHTML = s;
      }
      append() {
        let s = this.div.innerHTML;
        for (let arg of arguments) {
          s += "<div>" + arg + "</div>";
        }
        this.div.innerHTML = s;
      }
    };
  });

  // node_modules/yy-fps/index.js
  var require_yy_fps = __commonJS((exports, module) => {
    "use strict";
    var _createClass2 = function() {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor)
            descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
        }
      }
      return function(Constructor, protoProps, staticProps) {
        if (protoProps)
          defineProperties(Constructor.prototype, protoProps);
        if (staticProps)
          defineProperties(Constructor, staticProps);
        return Constructor;
      };
    }();
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    var Color = require_tinycolor();
    var Counter = require_counter();
    var STYLES = {
      background: "rgba(0, 0, 0, 0.5)",
      color: "white"
    };
    var STYLES_FPS = {
      padding: "0.1em 0.5em"
    };
    var STYLES_METER = {};
    module.exports = function() {
      function FPS2(options) {
        _classCallCheck(this, FPS2);
        this.options = options || {};
        this.tolerance = this.options.tolerance || 1;
        this.FPS = this.options.FPS || 60;
        this.meterWidth = this.options.meterWidth || 100;
        this.meterHeight = this.options.meterHeight || 25;
        this.meterLineHeight = this.options.meterLineHeight || 4;
        this.div = document.createElement("div");
        Counter.findParent(this.options.side || "bottom-right").appendChild(this.div);
        this.style(this.div, STYLES, this.options.styles);
        this.divFPS();
        this.meter = typeof this.options.meter === "undefined" || this.options.meter;
        this.lastTime = 0;
        this.frameNumber = 0;
        this.lastUpdate = 0;
        this.lastFPS = "--";
      }
      _createClass2(FPS2, [{
        key: "remove",
        value: function remove() {
          this.div.remove();
        }
      }, {
        key: "style",
        value: function style(div, style1, style2) {
          for (var style3 in style1) {
            div.style[style3] = style1[style3];
          }
          if (style2) {
            for (var _style in style2) {
              div.style[_style] = style2[_style];
            }
          }
        }
      }, {
        key: "divFPS",
        value: function divFPS() {
          var div = this.div;
          var options = this.options;
          var divFPS2 = document.createElement("div");
          div.appendChild(divFPS2);
          this.fpsSpan = document.createElement("span");
          divFPS2.appendChild(this.fpsSpan);
          var span = document.createElement("span");
          divFPS2.appendChild(span);
          span.innerText = typeof options.text !== "undefined" ? options.text : " FPS";
          this.style(div, STYLES_FPS, options.stylesFPS);
        }
      }, {
        key: "divMeter",
        value: function divMeter() {
          var div = this.div;
          var options = this.options;
          if (!this.meterCanvas) {
            this.meterCanvas = document.createElement("canvas");
            div.appendChild(this.meterCanvas);
            this.meterCanvas.width = this.meterWidth;
            this.meterCanvas.height = this.meterHeight;
            this.meterCanvas.style.width = div.width + "px";
            this.meterCanvas.style.height = div.height + "px";
            this.style(this.meterCanvas, STYLES_METER, options.stylesMeter);
          } else {
            this.meterCanvas.style.display = "block";
          }
        }
      }, {
        key: "frame",
        value: function frame() {
          this.frameNumber++;
          var currentTime = performance.now() - this.lastTime;
          if (currentTime > 500) {
            if (this.lastTime !== 0) {
              this.lastFPS = Math.floor(this.frameNumber / (currentTime / 1e3));
              if (this.lastFPS >= this.FPS - this.tolerance && this.lastFPS <= this.FPS + this.tolerance) {
                this.lastFPS = this.FPS;
              }
            }
            this.lastTime = performance.now();
            this.frameNumber = 0;
          }
          this.fpsSpan.innerText = this.lastFPS;
          if (this.meterCanvas && this.lastFPS !== "--") {
            this.meterUpdate(this.lastFPS / this.FPS);
          }
        }
      }, {
        key: "meterUpdate",
        value: function meterUpdate(percent) {
          var c = this.meterCanvas.getContext("2d");
          var data = c.getImageData(0, 0, this.meterCanvas.width, this.meterCanvas.height);
          c.putImageData(data, -1, 0);
          c.clearRect(this.meterCanvas.width - 1, 0, 1, this.meterCanvas.height);
          if (percent < 0.5) {
            c.fillStyle = Color.mix("#ff0000", "0xffa500", percent * 200).toHexString();
          } else {
            c.fillStyle = Color.mix("#ffa500", "#00ff00", (percent - 0.5) * 200).toHexString();
          }
          var height = (this.meterCanvas.height - this.meterLineHeight) * (1 - percent);
          c.fillRect(this.meterCanvas.width - 1, height, 1, this.meterLineHeight);
        }
      }, {
        key: "side",
        value: function side(options) {
          if (options.side) {
            options.side = options.side.toLowerCase();
            if (options.side.indexOf("left") !== -1) {
              STYLES["left"] = 0;
              delete STYLES["right"];
            } else {
              STYLES["right"] = 0;
              delete STYLES["left"];
            }
            if (options.side.indexOf("top") !== -1) {
              STYLES["top"] = 0;
              delete STYLES["bottom"];
            } else {
              STYLES["bottom"] = 0;
              delete STYLES["top"];
            }
          } else {
            STYLES["right"] = 0;
            STYLES["bottom"] = 0;
          }
        }
      }, {
        key: "fps",
        get: function get() {
          return this.FPS;
        },
        set: function set(value) {
          this.FPS = value;
        }
      }, {
        key: "meter",
        get: function get() {
          return this._meter;
        },
        set: function set(value) {
          if (value) {
            this.divMeter();
          } else if (this.meterCanvas) {
            this.meterCanvas.style.display = "none";
          }
        }
      }]);
      return FPS2;
    }();
  });

  // node_modules/seedrandom/lib/alea.js
  var require_alea = __commonJS((exports, module) => {
    (function(global2, module2, define2) {
      function Alea(seed) {
        var me = this, mash = Mash();
        me.next = function() {
          var t = 2091639 * me.s0 + me.c * 23283064365386963e-26;
          me.s0 = me.s1;
          me.s1 = me.s2;
          return me.s2 = t - (me.c = t | 0);
        };
        me.c = 1;
        me.s0 = mash(" ");
        me.s1 = mash(" ");
        me.s2 = mash(" ");
        me.s0 -= mash(seed);
        if (me.s0 < 0) {
          me.s0 += 1;
        }
        me.s1 -= mash(seed);
        if (me.s1 < 0) {
          me.s1 += 1;
        }
        me.s2 -= mash(seed);
        if (me.s2 < 0) {
          me.s2 += 1;
        }
        mash = null;
      }
      function copy(f, t) {
        t.c = f.c;
        t.s0 = f.s0;
        t.s1 = f.s1;
        t.s2 = f.s2;
        return t;
      }
      function impl(seed, opts) {
        var xg = new Alea(seed), state = opts && opts.state, prng = xg.next;
        prng.int32 = function() {
          return xg.next() * 4294967296 | 0;
        };
        prng.double = function() {
          return prng() + (prng() * 2097152 | 0) * 11102230246251565e-32;
        };
        prng.quick = prng;
        if (state) {
          if (typeof state == "object")
            copy(state, xg);
          prng.state = function() {
            return copy(xg, {});
          };
        }
        return prng;
      }
      function Mash() {
        var n = 4022871197;
        var mash = function(data) {
          data = String(data);
          for (var i = 0; i < data.length; i++) {
            n += data.charCodeAt(i);
            var h = 0.02519603282416938 * n;
            n = h >>> 0;
            h -= n;
            h *= n;
            n = h >>> 0;
            h -= n;
            n += h * 4294967296;
          }
          return (n >>> 0) * 23283064365386963e-26;
        };
        return mash;
      }
      if (module2 && module2.exports) {
        module2.exports = impl;
      } else if (define2 && define2.amd) {
        define2(function() {
          return impl;
        });
      } else {
        this.alea = impl;
      }
    })(exports, typeof module == "object" && module, typeof define == "function" && define);
  });

  // node_modules/seedrandom/lib/xor128.js
  var require_xor128 = __commonJS((exports, module) => {
    (function(global2, module2, define2) {
      function XorGen(seed) {
        var me = this, strseed = "";
        me.x = 0;
        me.y = 0;
        me.z = 0;
        me.w = 0;
        me.next = function() {
          var t = me.x ^ me.x << 11;
          me.x = me.y;
          me.y = me.z;
          me.z = me.w;
          return me.w ^= me.w >>> 19 ^ t ^ t >>> 8;
        };
        if (seed === (seed | 0)) {
          me.x = seed;
        } else {
          strseed += seed;
        }
        for (var k = 0; k < strseed.length + 64; k++) {
          me.x ^= strseed.charCodeAt(k) | 0;
          me.next();
        }
      }
      function copy(f, t) {
        t.x = f.x;
        t.y = f.y;
        t.z = f.z;
        t.w = f.w;
        return t;
      }
      function impl(seed, opts) {
        var xg = new XorGen(seed), state = opts && opts.state, prng = function() {
          return (xg.next() >>> 0) / 4294967296;
        };
        prng.double = function() {
          do {
            var top = xg.next() >>> 11, bot = (xg.next() >>> 0) / 4294967296, result = (top + bot) / (1 << 21);
          } while (result === 0);
          return result;
        };
        prng.int32 = xg.next;
        prng.quick = prng;
        if (state) {
          if (typeof state == "object")
            copy(state, xg);
          prng.state = function() {
            return copy(xg, {});
          };
        }
        return prng;
      }
      if (module2 && module2.exports) {
        module2.exports = impl;
      } else if (define2 && define2.amd) {
        define2(function() {
          return impl;
        });
      } else {
        this.xor128 = impl;
      }
    })(exports, typeof module == "object" && module, typeof define == "function" && define);
  });

  // node_modules/seedrandom/lib/xorwow.js
  var require_xorwow = __commonJS((exports, module) => {
    (function(global2, module2, define2) {
      function XorGen(seed) {
        var me = this, strseed = "";
        me.next = function() {
          var t = me.x ^ me.x >>> 2;
          me.x = me.y;
          me.y = me.z;
          me.z = me.w;
          me.w = me.v;
          return (me.d = me.d + 362437 | 0) + (me.v = me.v ^ me.v << 4 ^ (t ^ t << 1)) | 0;
        };
        me.x = 0;
        me.y = 0;
        me.z = 0;
        me.w = 0;
        me.v = 0;
        if (seed === (seed | 0)) {
          me.x = seed;
        } else {
          strseed += seed;
        }
        for (var k = 0; k < strseed.length + 64; k++) {
          me.x ^= strseed.charCodeAt(k) | 0;
          if (k == strseed.length) {
            me.d = me.x << 10 ^ me.x >>> 4;
          }
          me.next();
        }
      }
      function copy(f, t) {
        t.x = f.x;
        t.y = f.y;
        t.z = f.z;
        t.w = f.w;
        t.v = f.v;
        t.d = f.d;
        return t;
      }
      function impl(seed, opts) {
        var xg = new XorGen(seed), state = opts && opts.state, prng = function() {
          return (xg.next() >>> 0) / 4294967296;
        };
        prng.double = function() {
          do {
            var top = xg.next() >>> 11, bot = (xg.next() >>> 0) / 4294967296, result = (top + bot) / (1 << 21);
          } while (result === 0);
          return result;
        };
        prng.int32 = xg.next;
        prng.quick = prng;
        if (state) {
          if (typeof state == "object")
            copy(state, xg);
          prng.state = function() {
            return copy(xg, {});
          };
        }
        return prng;
      }
      if (module2 && module2.exports) {
        module2.exports = impl;
      } else if (define2 && define2.amd) {
        define2(function() {
          return impl;
        });
      } else {
        this.xorwow = impl;
      }
    })(exports, typeof module == "object" && module, typeof define == "function" && define);
  });

  // node_modules/seedrandom/lib/xorshift7.js
  var require_xorshift7 = __commonJS((exports, module) => {
    (function(global2, module2, define2) {
      function XorGen(seed) {
        var me = this;
        me.next = function() {
          var X = me.x, i = me.i, t, v, w;
          t = X[i];
          t ^= t >>> 7;
          v = t ^ t << 24;
          t = X[i + 1 & 7];
          v ^= t ^ t >>> 10;
          t = X[i + 3 & 7];
          v ^= t ^ t >>> 3;
          t = X[i + 4 & 7];
          v ^= t ^ t << 7;
          t = X[i + 7 & 7];
          t = t ^ t << 13;
          v ^= t ^ t << 9;
          X[i] = v;
          me.i = i + 1 & 7;
          return v;
        };
        function init2(me2, seed2) {
          var j, w, X = [];
          if (seed2 === (seed2 | 0)) {
            w = X[0] = seed2;
          } else {
            seed2 = "" + seed2;
            for (j = 0; j < seed2.length; ++j) {
              X[j & 7] = X[j & 7] << 15 ^ seed2.charCodeAt(j) + X[j + 1 & 7] << 13;
            }
          }
          while (X.length < 8)
            X.push(0);
          for (j = 0; j < 8 && X[j] === 0; ++j)
            ;
          if (j == 8)
            w = X[7] = -1;
          else
            w = X[j];
          me2.x = X;
          me2.i = 0;
          for (j = 256; j > 0; --j) {
            me2.next();
          }
        }
        init2(me, seed);
      }
      function copy(f, t) {
        t.x = f.x.slice();
        t.i = f.i;
        return t;
      }
      function impl(seed, opts) {
        if (seed == null)
          seed = +new Date();
        var xg = new XorGen(seed), state = opts && opts.state, prng = function() {
          return (xg.next() >>> 0) / 4294967296;
        };
        prng.double = function() {
          do {
            var top = xg.next() >>> 11, bot = (xg.next() >>> 0) / 4294967296, result = (top + bot) / (1 << 21);
          } while (result === 0);
          return result;
        };
        prng.int32 = xg.next;
        prng.quick = prng;
        if (state) {
          if (state.x)
            copy(state, xg);
          prng.state = function() {
            return copy(xg, {});
          };
        }
        return prng;
      }
      if (module2 && module2.exports) {
        module2.exports = impl;
      } else if (define2 && define2.amd) {
        define2(function() {
          return impl;
        });
      } else {
        this.xorshift7 = impl;
      }
    })(exports, typeof module == "object" && module, typeof define == "function" && define);
  });

  // node_modules/seedrandom/lib/xor4096.js
  var require_xor4096 = __commonJS((exports, module) => {
    (function(global2, module2, define2) {
      function XorGen(seed) {
        var me = this;
        me.next = function() {
          var w = me.w, X = me.X, i = me.i, t, v;
          me.w = w = w + 1640531527 | 0;
          v = X[i + 34 & 127];
          t = X[i = i + 1 & 127];
          v ^= v << 13;
          t ^= t << 17;
          v ^= v >>> 15;
          t ^= t >>> 12;
          v = X[i] = v ^ t;
          me.i = i;
          return v + (w ^ w >>> 16) | 0;
        };
        function init2(me2, seed2) {
          var t, v, i, j, w, X = [], limit = 128;
          if (seed2 === (seed2 | 0)) {
            v = seed2;
            seed2 = null;
          } else {
            seed2 = seed2 + "\0";
            v = 0;
            limit = Math.max(limit, seed2.length);
          }
          for (i = 0, j = -32; j < limit; ++j) {
            if (seed2)
              v ^= seed2.charCodeAt((j + 32) % seed2.length);
            if (j === 0)
              w = v;
            v ^= v << 10;
            v ^= v >>> 15;
            v ^= v << 4;
            v ^= v >>> 13;
            if (j >= 0) {
              w = w + 1640531527 | 0;
              t = X[j & 127] ^= v + w;
              i = t == 0 ? i + 1 : 0;
            }
          }
          if (i >= 128) {
            X[(seed2 && seed2.length || 0) & 127] = -1;
          }
          i = 127;
          for (j = 4 * 128; j > 0; --j) {
            v = X[i + 34 & 127];
            t = X[i = i + 1 & 127];
            v ^= v << 13;
            t ^= t << 17;
            v ^= v >>> 15;
            t ^= t >>> 12;
            X[i] = v ^ t;
          }
          me2.w = w;
          me2.X = X;
          me2.i = i;
        }
        init2(me, seed);
      }
      function copy(f, t) {
        t.i = f.i;
        t.w = f.w;
        t.X = f.X.slice();
        return t;
      }
      ;
      function impl(seed, opts) {
        if (seed == null)
          seed = +new Date();
        var xg = new XorGen(seed), state = opts && opts.state, prng = function() {
          return (xg.next() >>> 0) / 4294967296;
        };
        prng.double = function() {
          do {
            var top = xg.next() >>> 11, bot = (xg.next() >>> 0) / 4294967296, result = (top + bot) / (1 << 21);
          } while (result === 0);
          return result;
        };
        prng.int32 = xg.next;
        prng.quick = prng;
        if (state) {
          if (state.X)
            copy(state, xg);
          prng.state = function() {
            return copy(xg, {});
          };
        }
        return prng;
      }
      if (module2 && module2.exports) {
        module2.exports = impl;
      } else if (define2 && define2.amd) {
        define2(function() {
          return impl;
        });
      } else {
        this.xor4096 = impl;
      }
    })(exports, typeof module == "object" && module, typeof define == "function" && define);
  });

  // node_modules/seedrandom/lib/tychei.js
  var require_tychei = __commonJS((exports, module) => {
    (function(global2, module2, define2) {
      function XorGen(seed) {
        var me = this, strseed = "";
        me.next = function() {
          var b = me.b, c = me.c, d = me.d, a = me.a;
          b = b << 25 ^ b >>> 7 ^ c;
          c = c - d | 0;
          d = d << 24 ^ d >>> 8 ^ a;
          a = a - b | 0;
          me.b = b = b << 20 ^ b >>> 12 ^ c;
          me.c = c = c - d | 0;
          me.d = d << 16 ^ c >>> 16 ^ a;
          return me.a = a - b | 0;
        };
        me.a = 0;
        me.b = 0;
        me.c = 2654435769 | 0;
        me.d = 1367130551;
        if (seed === Math.floor(seed)) {
          me.a = seed / 4294967296 | 0;
          me.b = seed | 0;
        } else {
          strseed += seed;
        }
        for (var k = 0; k < strseed.length + 20; k++) {
          me.b ^= strseed.charCodeAt(k) | 0;
          me.next();
        }
      }
      function copy(f, t) {
        t.a = f.a;
        t.b = f.b;
        t.c = f.c;
        t.d = f.d;
        return t;
      }
      ;
      function impl(seed, opts) {
        var xg = new XorGen(seed), state = opts && opts.state, prng = function() {
          return (xg.next() >>> 0) / 4294967296;
        };
        prng.double = function() {
          do {
            var top = xg.next() >>> 11, bot = (xg.next() >>> 0) / 4294967296, result = (top + bot) / (1 << 21);
          } while (result === 0);
          return result;
        };
        prng.int32 = xg.next;
        prng.quick = prng;
        if (state) {
          if (typeof state == "object")
            copy(state, xg);
          prng.state = function() {
            return copy(xg, {});
          };
        }
        return prng;
      }
      if (module2 && module2.exports) {
        module2.exports = impl;
      } else if (define2 && define2.amd) {
        define2(function() {
          return impl;
        });
      } else {
        this.tychei = impl;
      }
    })(exports, typeof module == "object" && module, typeof define == "function" && define);
  });

  // empty:crypto
  var require_crypto = __commonJS(() => {
  });

  // node_modules/seedrandom/seedrandom.js
  var require_seedrandom = __commonJS((exports, module) => {
    (function(global2, pool, math16) {
      var width = 256, chunks = 6, digits = 52, rngname = "random", startdenom = math16.pow(width, chunks), significance = math16.pow(2, digits), overflow = significance * 2, mask = width - 1, nodecrypto;
      function seedrandom(seed, options, callback) {
        var key = [];
        options = options == true ? {entropy: true} : options || {};
        var shortseed = mixkey(flatten(options.entropy ? [seed, tostring(pool)] : seed == null ? autoseed() : seed, 3), key);
        var arc4 = new ARC4(key);
        var prng = function() {
          var n = arc4.g(chunks), d = startdenom, x = 0;
          while (n < significance) {
            n = (n + x) * width;
            d *= width;
            x = arc4.g(1);
          }
          while (n >= overflow) {
            n /= 2;
            d /= 2;
            x >>>= 1;
          }
          return (n + x) / d;
        };
        prng.int32 = function() {
          return arc4.g(4) | 0;
        };
        prng.quick = function() {
          return arc4.g(4) / 4294967296;
        };
        prng.double = prng;
        mixkey(tostring(arc4.S), pool);
        return (options.pass || callback || function(prng2, seed2, is_math_call, state) {
          if (state) {
            if (state.S) {
              copy(state, arc4);
            }
            prng2.state = function() {
              return copy(arc4, {});
            };
          }
          if (is_math_call) {
            math16[rngname] = prng2;
            return seed2;
          } else
            return prng2;
        })(prng, shortseed, "global" in options ? options.global : this == math16, options.state);
      }
      function ARC4(key) {
        var t, keylen = key.length, me = this, i = 0, j = me.i = me.j = 0, s = me.S = [];
        if (!keylen) {
          key = [keylen++];
        }
        while (i < width) {
          s[i] = i++;
        }
        for (i = 0; i < width; i++) {
          s[i] = s[j = mask & j + key[i % keylen] + (t = s[i])];
          s[j] = t;
        }
        (me.g = function(count2) {
          var t2, r = 0, i2 = me.i, j2 = me.j, s2 = me.S;
          while (count2--) {
            t2 = s2[i2 = mask & i2 + 1];
            r = r * width + s2[mask & (s2[i2] = s2[j2 = mask & j2 + t2]) + (s2[j2] = t2)];
          }
          me.i = i2;
          me.j = j2;
          return r;
        })(width);
      }
      function copy(f, t) {
        t.i = f.i;
        t.j = f.j;
        t.S = f.S.slice();
        return t;
      }
      ;
      function flatten(obj, depth) {
        var result = [], typ = typeof obj, prop;
        if (depth && typ == "object") {
          for (prop in obj) {
            try {
              result.push(flatten(obj[prop], depth - 1));
            } catch (e) {
            }
          }
        }
        return result.length ? result : typ == "string" ? obj : obj + "\0";
      }
      function mixkey(seed, key) {
        var stringseed = seed + "", smear, j = 0;
        while (j < stringseed.length) {
          key[mask & j] = mask & (smear ^= key[mask & j] * 19) + stringseed.charCodeAt(j++);
        }
        return tostring(key);
      }
      function autoseed() {
        try {
          var out;
          if (nodecrypto && (out = nodecrypto.randomBytes)) {
            out = out(width);
          } else {
            out = new Uint8Array(width);
            (global2.crypto || global2.msCrypto).getRandomValues(out);
          }
          return tostring(out);
        } catch (e) {
          var browser = global2.navigator, plugins = browser && browser.plugins;
          return [+new Date(), global2, plugins, global2.screen, tostring(pool)];
        }
      }
      function tostring(a) {
        return String.fromCharCode.apply(0, a);
      }
      mixkey(math16.random(), pool);
      if (typeof module == "object" && module.exports) {
        module.exports = seedrandom;
        try {
          nodecrypto = require_crypto();
        } catch (ex) {
        }
      } else if (typeof define == "function" && define.amd) {
        define(function() {
          return seedrandom;
        });
      } else {
        math16["seed" + rngname] = seedrandom;
      }
    })(typeof self !== "undefined" ? self : exports, [], Math);
  });

  // node_modules/seedrandom/index.js
  var require_seedrandom2 = __commonJS((exports, module) => {
    var alea = require_alea();
    var xor128 = require_xor128();
    var xorwow = require_xorwow();
    var xorshift7 = require_xorshift7();
    var xor4096 = require_xor4096();
    var tychei = require_tychei();
    var sr = require_seedrandom();
    sr.alea = alea;
    sr.xor128 = xor128;
    sr.xorwow = xorwow;
    sr.xorshift7 = xorshift7;
    sr.xor4096 = xor4096;
    sr.tychei = tychei;
    module.exports = sr;
  });

  // node_modules/yy-random/index.js
  var require_yy_random = __commonJS((exports, module) => {
    "use strict";
    var _createClass2 = function() {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor)
            descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
        }
      }
      return function(Constructor, protoProps, staticProps) {
        if (protoProps)
          defineProperties(Constructor.prototype, protoProps);
        if (staticProps)
          defineProperties(Constructor, staticProps);
        return Constructor;
      };
    }();
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    var seedrandom = require_seedrandom2();
    var Random = function() {
      function Random2() {
        _classCallCheck(this, Random2);
        this.generator = Math.random;
      }
      _createClass2(Random2, [{
        key: "seed",
        value: function seed(_seed, options) {
          options = options || {};
          this.generator = seedrandom[options.PRNG || "alea"](_seed, {state: options.state});
          this.options = options;
        }
      }, {
        key: "save",
        value: function save() {
          if (this.generator !== Math.random) {
            return this.generator.state();
          }
        }
      }, {
        key: "restore",
        value: function restore(state) {
          this.generator = seedrandom[this.options.PRNG || "alea"]("", {state});
        }
      }, {
        key: "seedOld",
        value: function seedOld(seed) {
          this.generator = function() {
            var x = Math.sin(seed++) * 1e4;
            return x - Math.floor(x);
          };
        }
      }, {
        key: "separateSeed",
        value: function separateSeed(seed) {
          var random4 = new Random2();
          random4.seed(seed);
          return random4;
        }
      }, {
        key: "reset",
        value: function reset() {
          this.generator = Math.random;
        }
      }, {
        key: "get",
        value: function get(ceiling, useFloat) {
          var negative = ceiling < 0 ? -1 : 1;
          ceiling *= negative;
          var result = void 0;
          if (useFloat) {
            result = this.generator() * ceiling;
          } else {
            result = Math.floor(this.generator() * ceiling);
          }
          return result * negative;
        }
      }, {
        key: "getHuge",
        value: function getHuge() {
          return this.get(Number.MAX_SAFE_INTEGER);
        }
      }, {
        key: "middle",
        value: function middle(_middle, delta, useFloat) {
          var half = delta / 2;
          return this.range(_middle - half, _middle + half, useFloat);
        }
      }, {
        key: "range",
        value: function range(start, end, useFloat) {
          if (end === start) {
            return end;
          }
          if (useFloat) {
            return this.get(end - start, true) + start;
          } else {
            var range2 = void 0;
            if (start < 0 && end > 0) {
              range2 = -start + end + 1;
            } else if (start === 0 && end > 0) {
              range2 = end + 1;
            } else if (start < 0 && end === 0) {
              range2 = start - 1;
              start = 1;
            } else if (start < 0 && end < 0) {
              range2 = end - start - 1;
            } else {
              range2 = end - start + 1;
            }
            return Math.floor(this.generator() * range2) + start;
          }
        }
      }, {
        key: "rangeMultiple",
        value: function rangeMultiple(start, end, count2, useFloat) {
          var array = [];
          for (var i = 0; i < count2; i++) {
            array.push(this.range(start, end, useFloat));
          }
          return array;
        }
      }, {
        key: "middleMultiple",
        value: function middleMultiple(middle, range, count2, useFloat) {
          var array = [];
          for (var i = 0; i < count2; i++) {
            array.push(middle(middle, range, useFloat));
          }
          return array;
        }
      }, {
        key: "sign",
        value: function sign2(chance) {
          chance = chance || 0.5;
          return this.generator() < chance ? 1 : -1;
        }
      }, {
        key: "chance",
        value: function chance(percent) {
          return this.generator() < (percent || 0.5);
        }
      }, {
        key: "angle",
        value: function angle() {
          return this.get(Math.PI * 2, true);
        }
      }, {
        key: "shuffle",
        value: function shuffle(array, copy) {
          if (copy) {
            array = array.slice();
          }
          if (array.length === 0) {
            return array;
          }
          var currentIndex = array.length, temporaryValue = void 0, randomIndex = void 0;
          while (currentIndex !== 0) {
            randomIndex = this.get(currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
          }
          return array;
        }
      }, {
        key: "pick",
        value: function pick(array, remove) {
          if (!remove) {
            return array[this.get(array.length)];
          } else {
            var pick2 = this.get(array.length);
            var temp2 = array[pick2];
            array.splice(pick2, 1);
            return temp2;
          }
        }
      }, {
        key: "property",
        value: function property(obj) {
          var result;
          var count2 = 0;
          for (var prop in obj) {
            if (this.chance(1 / ++count2)) {
              result = prop;
            }
          }
          return result;
        }
      }, {
        key: "set",
        value: function set(min, max, amount) {
          var set2 = [], all = [], i;
          for (i = min; i < max; i++) {
            all.push(i);
          }
          for (i = 0; i < amount; i++) {
            var found = this.get(all.length);
            set2.push(all[found]);
            all.splice(found, 1);
          }
          return set2;
        }
      }, {
        key: "distribution",
        value: function distribution(start, end, count2, includeStart, includeEnd, useFloat) {
          var interval = Math.floor((end - start) / count2);
          var halfInterval = interval / 2;
          var quarterInterval = interval / 4;
          var set = [];
          if (includeStart) {
            set.push(start);
          }
          for (var i = 0; i < count2; i++) {
            set.push(start + i * interval + halfInterval + this.range(-quarterInterval, quarterInterval, useFloat));
          }
          if (includeEnd) {
            set.push(end);
          }
          return set;
        }
      }, {
        key: "weightedProbabilityInt",
        value: function weightedProbabilityInt(min, max, target, stddev) {
          function normRand() {
            var x1 = void 0, x2 = void 0, rad = void 0;
            do {
              x1 = 2 * this.get(1, true) - 1;
              x2 = 2 * this.get(1, true) - 1;
              rad = x1 * x1 + x2 * x2;
            } while (rad >= 1 || rad === 0);
            var c = Math.sqrt(-2 * Math.log(rad) / rad);
            return x1 * c;
          }
          stddev = stddev || 1;
          if (Math.random() < 0.81546) {
            while (true) {
              var sample = normRand() * stddev + target;
              if (sample >= min && sample <= max) {
                return sample;
              }
            }
          } else {
            return this.range(min, max);
          }
        }
      }, {
        key: "circle",
        value: function circle(x, y, radius2, float) {
          var t = this.angle();
          var u = this.get(1, true) + this.get(1, true);
          var r = u > 1 ? 2 - u : u;
          if (float) {
            return [x + r * Math.cos(t) * radius2, y + r * Math.sin(t) * radius2];
          } else {
            return [Math.round(x + r * Math.cos(t) * radius2), Math.round(y + r * Math.sin(t) * radius2)];
          }
        }
      }, {
        key: "color",
        value: function color() {
          return this.get(16777215);
        }
      }]);
      return Random2;
    }();
    module.exports = new Random();
  });

  // node_modules/intersects/circle-point.js
  var require_circle_point = __commonJS((exports, module) => {
    "use strict";
    module.exports = function circlePoint(x1, y1, r1, x2, y2) {
      var x = x2 - x1;
      var y = y2 - y1;
      return x * x + y * y <= r1 * r1;
    };
  });

  // node_modules/intersects/circle-circle.js
  var require_circle_circle = __commonJS((exports, module) => {
    "use strict";
    module.exports = function circleCircle(x1, y1, r1, x2, y2, r2) {
      var x = x1 - x2;
      var y = y2 - y1;
      var radii = r1 + r2;
      return x * x + y * y <= radii * radii;
    };
  });

  // node_modules/intersects/line-circle.js
  var require_line_circle = __commonJS((exports, module) => {
    "use strict";
    module.exports = function lineCircle(x1, y1, x2, y2, xc, yc, rc) {
      var ac = [xc - x1, yc - y1];
      var ab = [x2 - x1, y2 - y1];
      var ab2 = dot(ab, ab);
      var acab = dot(ac, ab);
      var t = acab / ab2;
      t = t < 0 ? 0 : t;
      t = t > 1 ? 1 : t;
      var h = [ab[0] * t + x1 - xc, ab[1] * t + y1 - yc];
      var h2 = dot(h, h);
      return h2 <= rc * rc;
    };
    function dot(v1, v2) {
      return v1[0] * v2[0] + v1[1] * v2[1];
    }
  });

  // node_modules/intersects/circle-line.js
  var require_circle_line = __commonJS((exports, module) => {
    "use strict";
    var lineCircle = require_line_circle();
    module.exports = function circleLine(xc, yc, rc, x1, y1, x2, y2) {
      return lineCircle(x1, y1, x2, y2, xc, yc, rc);
    };
  });

  // node_modules/intersects/box-circle.js
  var require_box_circle = __commonJS((exports, module) => {
    "use strict";
    module.exports = function boxCircle(xb, yb, wb, hb, xc, yc, rc) {
      var hw = wb / 2;
      var hh = hb / 2;
      var distX = Math.abs(xc - (xb + wb / 2));
      var distY = Math.abs(yc - (yb + hb / 2));
      if (distX > hw + rc || distY > hh + rc) {
        return false;
      }
      if (distX <= hw || distY <= hh) {
        return true;
      }
      var x = distX - hw;
      var y = distY - hh;
      return x * x + y * y <= rc * rc;
    };
  });

  // node_modules/intersects/circle-box.js
  var require_circle_box = __commonJS((exports, module) => {
    "use strict";
    var boxCircle = require_box_circle();
    module.exports = function circleBox(xc, yc, rc, xb, yb, wb, hb) {
      return boxCircle(xb, yb, wb, hb, xc, yc, rc);
    };
  });

  // node_modules/intersects/line-point.js
  var require_line_point = __commonJS((exports, module) => {
    "use strict";
    function distanceSquared(x1, y1, x2, y2) {
      return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    }
    module.exports = function linePoint(x1, y1, x2, y2, xp, yp, tolerance) {
      tolerance = tolerance || 1;
      return Math.abs(distanceSquared(x1, y1, x2, y2) - (distanceSquared(x1, y1, xp, yp) + distanceSquared(x2, y2, xp, yp))) <= tolerance;
    };
  });

  // node_modules/intersects/polygon-point.js
  var require_polygon_point = __commonJS((exports, module) => {
    "use strict";
    const linePoint = require_line_point();
    module.exports = function polygonPoint(points, x, y, tolerance) {
      var length = points.length;
      var c = false;
      var i, j;
      for (i = 0, j = length - 2; i < length; i += 2) {
        if (points[i + 1] > y !== points[j + 1] > y && x < (points[j] - points[i]) * (y - points[i + 1]) / (points[j + 1] - points[i + 1]) + points[i]) {
          c = !c;
        }
        j = i;
      }
      if (c) {
        return true;
      }
      for (i = 0; i < length; i += 2) {
        var p1x = points[i];
        var p1y = points[i + 1];
        var p2x, p2y;
        if (i === length - 2) {
          p2x = points[0];
          p2y = points[1];
        } else {
          p2x = points[i + 2];
          p2y = points[i + 3];
        }
        if (linePoint(p1x, p1y, p2x, p2y, x, y, tolerance)) {
          return true;
        }
      }
      return false;
    };
  });

  // node_modules/intersects/polygon-circle.js
  var require_polygon_circle = __commonJS((exports, module) => {
    var polygonPoint = require_polygon_point();
    var lineCircle = require_line_circle();
    module.exports = function polygonCircle(points, xc, yc, rc, tolerance) {
      if (polygonPoint(points, xc, yc, tolerance)) {
        return true;
      }
      var count2 = points.length;
      for (var i = 0; i < count2 - 2; i += 2) {
        if (lineCircle(points[i], points[i + 1], points[i + 2], points[i + 3], xc, yc, rc)) {
          return true;
        }
      }
      return lineCircle(points[0], points[1], points[count2 - 2], points[count2 - 1], xc, yc, rc);
    };
  });

  // node_modules/intersects/circle-polygon.js
  var require_circle_polygon = __commonJS((exports, module) => {
    "use strict";
    var polygonCircle = require_polygon_circle();
    module.exports = function circlePolygon(xc, yc, rc, points, tolerance) {
      return polygonCircle(points, xc, yc, rc, tolerance);
    };
  });

  // node_modules/intersects/ellipse-helper.js
  var require_ellipse_helper = __commonJS((exports, module) => {
    var MAX_ITERATIONS = 10;
    var innerPolygonCoef;
    var outerPolygonCoef;
    var initialized;
    function initialize() {
      innerPolygonCoef = [];
      outerPolygonCoef = [];
      for (var t = 0; t <= MAX_ITERATIONS; t++) {
        var numNodes = 4 << t;
        innerPolygonCoef[t] = 0.5 / Math.cos(4 * Math.acos(0) / numNodes);
        outerPolygonCoef[t] = 0.5 / (Math.cos(2 * Math.acos(0) / numNodes) * Math.cos(2 * Math.acos(0) / numNodes));
      }
      initialized = true;
    }
    function iterate(x, y, c0x, c0y, c2x, c2y, rr) {
      for (var t = 1; t <= MAX_ITERATIONS; t++) {
        var c1x = (c0x + c2x) * innerPolygonCoef[t];
        var c1y = (c0y + c2y) * innerPolygonCoef[t];
        var tx = x - c1x;
        var ty = y - c1y;
        if (tx * tx + ty * ty <= rr) {
          return true;
        }
        var t2x = c2x - c1x;
        var t2y = c2y - c1y;
        if (tx * t2x + ty * t2y >= 0 && tx * t2x + ty * t2y <= t2x * t2x + t2y * t2y && (ty * t2x - tx * t2y >= 0 || rr * (t2x * t2x + t2y * t2y) >= (ty * t2x - tx * t2y) * (ty * t2x - tx * t2y))) {
          return true;
        }
        var t0x = c0x - c1x;
        var t0y = c0y - c1y;
        if (tx * t0x + ty * t0y >= 0 && tx * t0x + ty * t0y <= t0x * t0x + t0y * t0y && (ty * t0x - tx * t0y <= 0 || rr * (t0x * t0x + t0y * t0y) >= (ty * t0x - tx * t0y) * (ty * t0x - tx * t0y))) {
          return true;
        }
        var c3x = (c0x + c1x) * outerPolygonCoef[t];
        var c3y = (c0y + c1y) * outerPolygonCoef[t];
        if ((c3x - x) * (c3x - x) + (c3y - y) * (c3y - y) < rr) {
          c2x = c1x;
          c2y = c1y;
          continue;
        }
        var c4x = c1x - c3x + c1x;
        var c4y = c1y - c3y + c1y;
        if ((c4x - x) * (c4x - x) + (c4y - y) * (c4y - y) < rr) {
          c0x = c1x;
          c0y = c1y;
          continue;
        }
        var t3x = c3x - c1x;
        var t3y = c3y - c1y;
        if (ty * t3x - tx * t3y <= 0 || rr * (t3x * t3x + t3y * t3y) > (ty * t3x - tx * t3y) * (ty * t3x - tx * t3y)) {
          if (tx * t3x + ty * t3y > 0) {
            if (Math.abs(tx * t3x + ty * t3y) <= t3x * t3x + t3y * t3y || (x - c3x) * (c0x - c3x) + (y - c3y) * (c0y - c3y) >= 0) {
              c2x = c1x;
              c2y = c1y;
              continue;
            }
          } else if (-(tx * t3x + ty * t3y) <= t3x * t3x + t3y * t3y || (x - c4x) * (c2x - c4x) + (y - c4y) * (c2y - c4y) >= 0) {
            c0x = c1x;
            c0y = c1y;
            continue;
          }
        }
        return false;
      }
      return false;
    }
    function ellipseEllipse(x0, y0, w0, h0, x1, y1, w1, h1) {
      if (!initialized) {
        initialize();
      }
      var x = Math.abs(x1 - x0) * h1;
      var y = Math.abs(y1 - y0) * w1;
      w0 *= h1;
      h0 *= w1;
      var r = w1 * h1;
      if (x * x + (h0 - y) * (h0 - y) <= r * r || (w0 - x) * (w0 - x) + y * y <= r * r || x * h0 + y * w0 <= w0 * h0 || (x * h0 + y * w0 - w0 * h0) * (x * h0 + y * w0 - w0 * h0) <= r * r * (w0 * w0 + h0 * h0) && x * w0 - y * h0 >= -h0 * h0 && x * w0 - y * h0 <= w0 * w0) {
        return true;
      } else {
        if ((x - w0) * (x - w0) + (y - h0) * (y - h0) <= r * r || x <= w0 && y - r <= h0 || y <= h0 && x - r <= w0) {
          return iterate(x, y, w0, 0, 0, h0, r * r);
        }
        return false;
      }
    }
    function ellipseCircle(x0, y0, w, h, x1, y1, r) {
      if (!initialized) {
        initialize();
      }
      var x = Math.abs(x1 - x0);
      var y = Math.abs(y1 - y0);
      if (x * x + (h - y) * (h - y) <= r * r || (w - x) * (w - x) + y * y <= r * r || x * h + y * w <= w * h || (x * h + y * w - w * h) * (x * h + y * w - w * h) <= r * r * (w * w + h * h) && x * w - y * h >= -h * h && x * w - y * h <= w * w) {
        return true;
      } else {
        if ((x - w) * (x - w) + (y - h) * (y - h) <= r * r || x <= w && y - r <= h || y <= h && x - r <= w) {
          return iterate(x, y, w, 0, 0, h, r * r);
        }
        return false;
      }
    }
    module.exports = {
      ellipseCircle,
      ellipseEllipse
    };
  });

  // node_modules/intersects/ellipse-circle.js
  var require_ellipse_circle = __commonJS((exports, module) => {
    var ellipseHelper = require_ellipse_helper();
    module.exports = function ellipseCircle(xe, ye, rex, rey, xc, yc, rc) {
      return ellipseHelper.ellipseCircle(xe, ye, rex, rey, xc, yc, rc);
    };
  });

  // node_modules/intersects/circle-ellipse.js
  var require_circle_ellipse = __commonJS((exports, module) => {
    var ellipseCircle = require_ellipse_circle();
    module.exports = function circleEllipse(xc, yc, rc, xe, ye, rex, rey) {
      return ellipseCircle(xe, ye, rex, rey, xc, yc, rc);
    };
  });

  // node_modules/intersects/circleOutline-box.js
  var require_circleOutline_box = __commonJS((exports, module) => {
    var circlePoint = require_circle_point();
    var boxCircle = require_box_circle();
    module.exports = function circleOutlineBox(xc, yc, rc, x, y, width, height, thickness) {
      thickness = thickness || 1;
      var count2 = 0;
      count2 += circlePoint(xc, yc, rc, x, y) ? 1 : 0;
      count2 += circlePoint(xc, yc, rc, x + width, y) ? 1 : 0;
      count2 += circlePoint(xc, yc, rc, x, y + height) ? 1 : 0;
      count2 += circlePoint(xc, yc, rc, x + width, y + height) ? 1 : 0;
      if (count2 === 0) {
        return boxCircle(x, y, width, height, xc, yc, rc);
      }
      if (count2 >= 1 && count2 <= 3) {
        return true;
      }
      if (count2 === 4) {
        return !circlePoint(xc, yc, rc - thickness, x, y) || !circlePoint(xc, yc, rc - thickness, x + width, y) || !circlePoint(xc, yc, rc - thickness, x, y + height) || !circlePoint(xc, yc, rc - thickness, x + width, y + height);
      }
    };
  });

  // node_modules/intersects/circleOutline-line.js
  var require_circleOutline_line = __commonJS((exports, module) => {
    var lineCircle = require_line_circle();
    var circlePoint = require_circle_point();
    module.exports = function circleOutlineLine(xc, yc, rc, x1, y1, x2, y2, thickness) {
      thickness = thickness || 1;
      return lineCircle(x1, y1, x2, y2, xc, yc, rc) && !(circlePoint(xc, yc, rc - thickness, x1, y1) && circlePoint(xc, yc, rc - thickness, x2, y2));
    };
  });

  // node_modules/intersects/circleOutline-point.js
  var require_circleOutline_point = __commonJS((exports, module) => {
    var circlePoint = require_circle_point();
    module.exports = function circleOutlinePoint(xc, yc, rc, x, y, thickness) {
      thickness = thickness || 1;
      return circlePoint(xc, yc, rc, x, y) && !circlePoint(xc, yc, rc - thickness, x, y);
    };
  });

  // node_modules/intersects/lineToLine.js
  var require_lineToLine = __commonJS((exports, module) => {
    "use strict";
    module.exports = function lineToLine(x1, y1, x2, y2, x3, y3, x4, y4) {
      var s1_x = x2 - x1;
      var s1_y = y2 - y1;
      var s2_x = x4 - x3;
      var s2_y = y4 - y3;
      var s = (-s1_y * (x1 - x3) + s1_x * (y1 - y3)) / (-s2_x * s1_y + s1_x * s2_y);
      var t = (s2_x * (y1 - y3) - s2_y * (x1 - x3)) / (-s2_x * s1_y + s1_x * s2_y);
      return s >= 0 && s <= 1 && t >= 0 && t <= 1;
    };
  });

  // node_modules/intersects/line-polygon.js
  var require_line_polygon = __commonJS((exports, module) => {
    var polygonPoint = require_polygon_point();
    var lineLine = require_lineToLine();
    module.exports = function linePolygon(x1, y1, x2, y2, points, tolerance) {
      var length = points.length;
      if (polygonPoint(points, x1, y1, tolerance)) {
        return true;
      }
      for (var i = 0; i < length; i += 2) {
        var j = (i + 2) % length;
        if (lineLine(x1, y1, x2, y2, points[i], points[i + 1], points[j], points[j + 1])) {
          return true;
        }
      }
      return false;
    };
  });

  // node_modules/intersects/polygon-line.js
  var require_polygon_line = __commonJS((exports, module) => {
    var linePolygon = require_line_polygon();
    module.exports = function polygonLine(points, x1, y1, x2, y2, tolerance) {
      return linePolygon(x1, y1, x2, y2, points, tolerance);
    };
  });

  // node_modules/intersects/polygon-polygon.js
  var require_polygon_polygon = __commonJS((exports, module) => {
    "use strict";
    module.exports = function polygonPolygon(points1, points2) {
      var a = points1;
      var b = points2;
      var polygons = [a, b];
      var minA, maxA, projected, minB, maxB, j;
      for (var i = 0; i < polygons.length; i++) {
        var polygon = polygons[i];
        for (var i1 = 0; i1 < polygon.length; i1 += 2) {
          var i2 = (i1 + 2) % polygon.length;
          var normal = {x: polygon[i2 + 1] - polygon[i1 + 1], y: polygon[i1] - polygon[i2]};
          minA = maxA = null;
          for (j = 0; j < a.length; j += 2) {
            projected = normal.x * a[j] + normal.y * a[j + 1];
            if (minA === null || projected < minA) {
              minA = projected;
            }
            if (maxA === null || projected > maxA) {
              maxA = projected;
            }
          }
          minB = maxB = null;
          for (j = 0; j < b.length; j += 2) {
            projected = normal.x * b[j] + normal.y * b[j + 1];
            if (minB === null || projected < minB) {
              minB = projected;
            }
            if (maxB === null || projected > maxB) {
              maxB = projected;
            }
          }
          if (maxA < minB || maxB < minA) {
            return false;
          }
        }
      }
      return true;
    };
  });

  // node_modules/intersects/polygon-box.js
  var require_polygon_box = __commonJS((exports, module) => {
    "use strict";
    var polygonPolygon = require_polygon_polygon();
    module.exports = function polygonBox(points, x, y, w, h) {
      var points2 = [x, y, x + w, y, x + w, y + h, x, y + h];
      return polygonPolygon(points, points2);
    };
  });

  // node_modules/intersects/ellipse-line.js
  var require_ellipse_line = __commonJS((exports, module) => {
    module.exports = function ellipseLine(xe, ye, rex, rey, x1, y1, x2, y2) {
      x1 -= xe;
      x2 -= xe;
      y1 -= ye;
      y2 -= ye;
      var A = Math.pow(x2 - x1, 2) / rex / rex + Math.pow(y2 - y1, 2) / rey / rey;
      var B = 2 * x1 * (x2 - x1) / rex / rex + 2 * y1 * (y2 - y1) / rey / rey;
      var C = x1 * x1 / rex / rex + y1 * y1 / rey / rey - 1;
      var D = B * B - 4 * A * C;
      if (D === 0) {
        var t = -B / 2 / A;
        return t >= 0 && t <= 1;
      } else if (D > 0) {
        var sqrt = Math.sqrt(D);
        var t1 = (-B + sqrt) / 2 / A;
        var t2 = (-B - sqrt) / 2 / A;
        return t1 >= 0 && t1 <= 1 || t2 >= 0 && t2 <= 1;
      } else {
        return false;
      }
    };
  });

  // node_modules/intersects/line-ellipse.js
  var require_line_ellipse = __commonJS((exports, module) => {
    var ellipseLine = require_ellipse_line();
    module.exports = function lineEllipse(x1, y1, x2, y2, xe, ye, rex, rey) {
      return ellipseLine(xe, ye, rex, rey, x1, y1, x2, y2);
    };
  });

  // node_modules/intersects/polygon-ellipse.js
  var require_polygon_ellipse = __commonJS((exports, module) => {
    var polygonPoint = require_polygon_point();
    var lineEllipse = require_line_ellipse();
    module.exports = function polygonEllipse(points, xe, ye, rex, rey) {
      if (polygonPoint(points, xe, ye)) {
        return true;
      }
      var count2 = points.length;
      for (var i = 0; i < count2 - 2; i += 2) {
        if (lineEllipse(points[i], points[i + 1], points[i + 2], points[i + 3], xe, ye, rex, rey)) {
          return true;
        }
      }
      return lineEllipse(points[0], points[1], points[count2 - 2], points[count2 - 1], xe, ye, rex, rey);
    };
  });

  // node_modules/intersects/box-point.js
  var require_box_point = __commonJS((exports, module) => {
    "use strict";
    module.exports = function boxPoint(x1, y1, w1, h1, x2, y2) {
      return x2 >= x1 && x2 <= x1 + w1 && y2 >= y1 && y2 <= y1 + h1;
    };
  });

  // node_modules/intersects/box-box.js
  var require_box_box = __commonJS((exports, module) => {
    "use strict";
    module.exports = function boxBox(x1, y1, w1, h1, x2, y2, w2, h2) {
      return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
    };
  });

  // node_modules/intersects/lineToPolygon.js
  var require_lineToPolygon = __commonJS((exports, module) => {
    "use strict";
    module.exports = function lineToPolygon(x1, y1, x2, y2, thickness) {
      const angle = Math.atan2(y2 - y1, x2 - x1) - Math.PI / 2;
      const half = thickness / 2;
      const cos = Math.cos(angle) * half;
      const sin = Math.sin(angle) * half;
      return [
        x1 - cos,
        y1 - sin,
        x2 - cos,
        y2 - sin,
        x2 + cos,
        y2 + sin,
        x1 + cos,
        y1 + sin
      ];
    };
  });

  // node_modules/intersects/line-line.js
  var require_line_line = __commonJS((exports, module) => {
    "use strict";
    const lineToPolygon = require_lineToPolygon();
    const polygonPolygon = require_polygon_polygon();
    const linePolygon = require_line_polygon();
    const lineToLine = require_lineToLine();
    module.exports = function lineLine(x1, y1, x2, y2, x3, y3, x4, y4, thickness1, thickness2) {
      if (thickness1 || thickness2) {
        return lineLineThickness(x1, y1, x2, y2, x3, y3, x4, y4, thickness1, thickness2);
      } else {
        return lineToLine(x1, y1, x2, y2, x3, y3, x4, y4);
      }
    };
    function lineLineThickness(x1, y1, x2, y2, x3, y3, x4, y4, thickness1, thickness2) {
      if (thickness1 && thickness2) {
        return polygonPolygon(lineToPolygon(x1, y1, x2, y2, thickness1), lineToPolygon(x3, y3, x4, y4, thickness2));
      } else if (thickness1) {
        return linePolygon(x3, y3, x4, y4, lineToPolygon(x1, y1, x2, y2, thickness1));
      } else if (thickness2) {
        return linePolygon(x1, y1, x2, y2, lineToPolygon(x3, y3, x4, y4, thickness1));
      }
    }
  });

  // node_modules/intersects/line-box.js
  var require_line_box = __commonJS((exports, module) => {
    "use strict";
    var boxPoint = require_box_point();
    var lineLine = require_line_line();
    module.exports = function lineBox(x1, y1, x2, y2, xb, yb, wb, hb) {
      if (boxPoint(xb, yb, wb, hb, x1, y1) || boxPoint(xb, yb, wb, hb, x2, y2)) {
        return true;
      }
      return lineLine(x1, y1, x2, y2, xb, yb, xb + wb, yb) || lineLine(x1, y1, x2, y2, xb + wb, yb, xb + wb, yb + hb) || lineLine(x1, y1, x2, y2, xb, yb + hb, xb + wb, yb + hb) || lineLine(x1, y1, x2, y2, xb, yb, xb, yb + hb);
    };
  });

  // node_modules/intersects/box-line.js
  var require_box_line = __commonJS((exports, module) => {
    "use strict";
    var lineBox = require_line_box();
    module.exports = function boxLine(xb, yb, wb, hb, x1, y1, x2, y2) {
      return lineBox(x1, y1, x2, y2, xb, yb, wb, hb);
    };
  });

  // node_modules/intersects/box-polygon.js
  var require_box_polygon = __commonJS((exports, module) => {
    "use strict";
    var polygonBox = require_polygon_box();
    module.exports = function boxPolygon(xb, yb, wb, hb, points) {
      return polygonBox(points, xb, yb, wb, hb);
    };
  });

  // node_modules/intersects/ellipse-box.js
  var require_ellipse_box = __commonJS((exports, module) => {
    var ellipseLine = require_ellipse_line();
    var boxPoint = require_box_point();
    module.exports = function ellipseBox(xe, ye, rex, rey, xb, yb, wb, hb) {
      return boxPoint(xb, yb, wb, hb, xe, ye) || ellipseLine(xe, ye, rex, rey, xb, yb, xb + wb, yb) || ellipseLine(xe, ye, rex, rey, xb, yb + hb, xb + wb, yb + hb) || ellipseLine(xe, ye, rex, rey, xb, yb, xb, yb + hb) || ellipseLine(xe, ye, rex, rey, xb + wb, yb, xb + wb, yb + hb);
    };
  });

  // node_modules/intersects/box-ellipse.js
  var require_box_ellipse = __commonJS((exports, module) => {
    var ellipseBox = require_ellipse_box();
    module.exports = function boxEllipse(xb, yb, wb, hb, xe, ye, rex, rey) {
      return ellipseBox(xe, ye, rex, rey, xb, yb, wb, hb);
    };
  });

  // node_modules/intersects/box-circleOutline.js
  var require_box_circleOutline = __commonJS((exports, module) => {
    var circleOutlineBox = require_circleOutline_box();
    module.exports = function boxCircleOutline(x, y, width, height, xc, yc, rc, thickness) {
      return circleOutlineBox(xc, yc, rc, x, y, width, height, thickness);
    };
  });

  // node_modules/intersects/point-box.js
  var require_point_box = __commonJS((exports, module) => {
    "use strict";
    var boxPoint = require_box_point();
    module.exports = function pointBox(x1, y1, xb, yb, wb, hb) {
      return boxPoint(xb, yb, wb, hb, x1, y1);
    };
  });

  // node_modules/intersects/point-polygon.js
  var require_point_polygon = __commonJS((exports, module) => {
    "use strict";
    var polygonPoint = require_polygon_point();
    module.exports = function pointPolygon(x1, y1, points, tolerance) {
      return polygonPoint(points, x1, y1, tolerance);
    };
  });

  // node_modules/intersects/point-circle.js
  var require_point_circle = __commonJS((exports, module) => {
    "use strict";
    var circlePoint = require_circle_point();
    module.exports = function pointCircle(x1, y1, xc, yc, rc) {
      return circlePoint(xc, yc, rc, x1, y1);
    };
  });

  // node_modules/intersects/point-line.js
  var require_point_line = __commonJS((exports, module) => {
    "use strict";
    var linePoint = require_line_point();
    module.exports = function pointLine(xp, yp, x1, y1, x2, y2) {
      return linePoint(x1, y1, x2, y2, xp, yp);
    };
  });

  // node_modules/intersects/ellipse-point.js
  var require_ellipse_point = __commonJS((exports, module) => {
    module.exports = function ellipsePoint(xe, ye, rex, rey, x1, y1) {
      var x = Math.pow(x1 - xe, 2) / (rex * rex);
      var y = Math.pow(y1 - ye, 2) / (rey * rey);
      return x + y <= 1;
    };
  });

  // node_modules/intersects/point-ellipse.js
  var require_point_ellipse = __commonJS((exports, module) => {
    var ellipsePoint = require_ellipse_point();
    module.exports = function pointEllipse(x1, y1, xe, ye, rex, rey) {
      return ellipsePoint(xe, ye, rex, rey, x1, y1);
    };
  });

  // node_modules/intersects/point-circleOutline.js
  var require_point_circleOutline = __commonJS((exports, module) => {
    var circleOutlinePoint = require_circleOutline_point();
    module.exports = function pointCircleOutline(x, y, xc, yc, rc, thickness) {
      return circleOutlinePoint(x, y, xc, yc, rc, thickness);
    };
  });

  // node_modules/intersects/line-circleOutline.js
  var require_line_circleOutline = __commonJS((exports, module) => {
    var circleOutlineLine = require_circleOutline_line();
    module.exports = function lineCircleOutline(x1, y1, x2, y2, xc, yc, rc, thickness) {
      return circleOutlineLine(xc, yc, rc, x1, y1, x2, y2, thickness);
    };
  });

  // node_modules/intersects/ellipse-ellipse.js
  var require_ellipse_ellipse = __commonJS((exports, module) => {
    var ellipseHelper = require_ellipse_helper();
    module.exports = function ellipseEllipse(x1, y1, r1x, r1y, x2, y2, r2x, r2y) {
      return ellipseHelper.ellipseEllipse(x1, y1, r1x, r1y, x2, y2, r2x, r2y);
    };
  });

  // node_modules/intersects/ellipse-polygon.js
  var require_ellipse_polygon = __commonJS((exports, module) => {
    var polygonEllipse = require_polygon_ellipse();
    module.exports = function ellipsePolygon(xe, ye, rex, rey, points) {
      return polygonEllipse(points, xe, ye, rex, rey);
    };
  });

  // node_modules/intersects/index.js
  var require_intersects = __commonJS((exports, module) => {
    module.exports = {
      circlePoint: require_circle_point(),
      circleCircle: require_circle_circle(),
      circleLine: require_circle_line(),
      circleBox: require_circle_box(),
      circlePolygon: require_circle_polygon(),
      circleEllipse: require_circle_ellipse(),
      circleOutlineBox: require_circleOutline_box(),
      circleOutlineLine: require_circleOutline_line(),
      circleOutlinePoint: require_circleOutline_point(),
      polygonPoint: require_polygon_point(),
      polygonLine: require_polygon_line(),
      polygonPolygon: require_polygon_polygon(),
      polygonBox: require_polygon_box(),
      polygonCircle: require_polygon_circle(),
      polygonEllipse: require_polygon_ellipse(),
      boxPoint: require_box_point(),
      boxBox: require_box_box(),
      boxLine: require_box_line(),
      boxPolygon: require_box_polygon(),
      boxCircle: require_box_circle(),
      boxEllipse: require_box_ellipse(),
      boxCircleOutline: require_box_circleOutline(),
      pointBox: require_point_box(),
      pointPolygon: require_point_polygon(),
      pointCircle: require_point_circle(),
      pointLine: require_point_line(),
      pointEllipse: require_point_ellipse(),
      pointCircleOutline: require_point_circleOutline(),
      lineLine: require_line_line(),
      lineBox: require_line_box(),
      linePolygon: require_line_polygon(),
      lineCircle: require_line_circle(),
      linePoint: require_line_point(),
      lineEllipse: require_line_ellipse(),
      lineCircleOutline: require_line_circleOutline(),
      ellipsePoint: require_ellipse_point(),
      ellipseLine: require_ellipse_line(),
      ellipseBox: require_ellipse_box(),
      ellipseCircle: require_ellipse_circle(),
      ellipseEllipse: require_ellipse_ellipse(),
      ellipsePolygon: require_ellipse_polygon()
    };
  });

  // node_modules/@pixi/polyfill/lib/polyfill.es.js
  const es6_promise_polyfill = __toModule(require_promise());
  const object_assign = __toModule(require_object_assign());
  /*!
   * @pixi/polyfill - v5.3.3
   * Compiled Tue, 04 Aug 2020 16:23:09 UTC
   *
   * @pixi/polyfill is licensed under the MIT License.
   * http://www.opensource.org/licenses/mit-license
   */
  if (!window.Promise) {
    window.Promise = es6_promise_polyfill.Polyfill;
  }
  if (!Object.assign) {
    Object.assign = object_assign.default;
  }
  var ONE_FRAME_TIME = 16;
  if (!(Date.now && Date.prototype.getTime)) {
    Date.now = function now() {
      return new Date().getTime();
    };
  }
  if (!(window.performance && window.performance.now)) {
    var startTime_1 = Date.now();
    if (!window.performance) {
      window.performance = {};
    }
    window.performance.now = function() {
      return Date.now() - startTime_1;
    };
  }
  var lastTime = Date.now();
  var vendors = ["ms", "moz", "webkit", "o"];
  for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    var p = vendors[x];
    window.requestAnimationFrame = window[p + "RequestAnimationFrame"];
    window.cancelAnimationFrame = window[p + "CancelAnimationFrame"] || window[p + "CancelRequestAnimationFrame"];
  }
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function(callback) {
      if (typeof callback !== "function") {
        throw new TypeError(callback + "is not a function");
      }
      var currentTime = Date.now();
      var delay = ONE_FRAME_TIME + lastTime - currentTime;
      if (delay < 0) {
        delay = 0;
      }
      lastTime = currentTime;
      return window.setTimeout(function() {
        lastTime = Date.now();
        callback(performance.now());
      }, delay);
    };
  }
  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function(id) {
      return clearTimeout(id);
    };
  }
  if (!Math.sign) {
    Math.sign = function mathSign(x) {
      x = Number(x);
      if (x === 0 || isNaN(x)) {
        return x;
      }
      return x > 0 ? 1 : -1;
    };
  }
  if (!Number.isInteger) {
    Number.isInteger = function numberIsInteger(value) {
      return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
    };
  }
  if (!window.ArrayBuffer) {
    window.ArrayBuffer = Array;
  }
  if (!window.Float32Array) {
    window.Float32Array = Array;
  }
  if (!window.Uint32Array) {
    window.Uint32Array = Array;
  }
  if (!window.Uint16Array) {
    window.Uint16Array = Array;
  }
  if (!window.Uint8Array) {
    window.Uint8Array = Array;
  }
  if (!window.Int32Array) {
    window.Int32Array = Array;
  }

  // node_modules/ismobilejs/esm/isMobile.js
  var appleIphone = /iPhone/i;
  var appleIpod = /iPod/i;
  var appleTablet = /iPad/i;
  var appleUniversal = /\biOS-universal(?:.+)Mac\b/i;
  var androidPhone = /\bAndroid(?:.+)Mobile\b/i;
  var androidTablet = /Android/i;
  var amazonPhone = /(?:SD4930UR|\bSilk(?:.+)Mobile\b)/i;
  var amazonTablet = /Silk/i;
  var windowsPhone = /Windows Phone/i;
  var windowsTablet = /\bWindows(?:.+)ARM\b/i;
  var otherBlackBerry = /BlackBerry/i;
  var otherBlackBerry10 = /BB10/i;
  var otherOpera = /Opera Mini/i;
  var otherChrome = /\b(CriOS|Chrome)(?:.+)Mobile/i;
  var otherFirefox = /Mobile(?:.+)Firefox\b/i;
  var isAppleTabletOnIos13 = function(navigator2) {
    return typeof navigator2 !== "undefined" && navigator2.platform === "MacIntel" && typeof navigator2.maxTouchPoints === "number" && navigator2.maxTouchPoints > 1 && typeof MSStream === "undefined";
  };
  function createMatch(userAgent) {
    return function(regex) {
      return regex.test(userAgent);
    };
  }
  function isMobile(param) {
    var nav = {
      userAgent: "",
      platform: "",
      maxTouchPoints: 0
    };
    if (!param && typeof navigator !== "undefined") {
      nav = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        maxTouchPoints: navigator.maxTouchPoints || 0
      };
    } else if (typeof param === "string") {
      nav.userAgent = param;
    } else if (param && param.userAgent) {
      nav = {
        userAgent: param.userAgent,
        platform: param.platform,
        maxTouchPoints: param.maxTouchPoints || 0
      };
    }
    var userAgent = nav.userAgent;
    var tmp = userAgent.split("[FBAN");
    if (typeof tmp[1] !== "undefined") {
      userAgent = tmp[0];
    }
    tmp = userAgent.split("Twitter");
    if (typeof tmp[1] !== "undefined") {
      userAgent = tmp[0];
    }
    var match = createMatch(userAgent);
    var result = {
      apple: {
        phone: match(appleIphone) && !match(windowsPhone),
        ipod: match(appleIpod),
        tablet: !match(appleIphone) && (match(appleTablet) || isAppleTabletOnIos13(nav)) && !match(windowsPhone),
        universal: match(appleUniversal),
        device: (match(appleIphone) || match(appleIpod) || match(appleTablet) || match(appleUniversal) || isAppleTabletOnIos13(nav)) && !match(windowsPhone)
      },
      amazon: {
        phone: match(amazonPhone),
        tablet: !match(amazonPhone) && match(amazonTablet),
        device: match(amazonPhone) || match(amazonTablet)
      },
      android: {
        phone: !match(windowsPhone) && match(amazonPhone) || !match(windowsPhone) && match(androidPhone),
        tablet: !match(windowsPhone) && !match(amazonPhone) && !match(androidPhone) && (match(amazonTablet) || match(androidTablet)),
        device: !match(windowsPhone) && (match(amazonPhone) || match(amazonTablet) || match(androidPhone) || match(androidTablet)) || match(/\bokhttp\b/i)
      },
      windows: {
        phone: match(windowsPhone),
        tablet: match(windowsTablet),
        device: match(windowsPhone) || match(windowsTablet)
      },
      other: {
        blackberry: match(otherBlackBerry),
        blackberry10: match(otherBlackBerry10),
        opera: match(otherOpera),
        firefox: match(otherFirefox),
        chrome: match(otherChrome),
        device: match(otherBlackBerry) || match(otherBlackBerry10) || match(otherOpera) || match(otherFirefox) || match(otherChrome)
      },
      any: false,
      phone: false,
      tablet: false
    };
    result.any = result.apple.device || result.android.device || result.windows.device || result.other.device;
    result.phone = result.apple.phone || result.android.phone || result.windows.phone;
    result.tablet = result.apple.tablet || result.android.tablet || result.windows.tablet;
    return result;
  }

  // node_modules/@pixi/settings/lib/settings.es.js
  /*!
   * @pixi/settings - v5.3.3
   * Compiled Tue, 04 Aug 2020 16:23:09 UTC
   *
   * @pixi/settings is licensed under the MIT License.
   * http://www.opensource.org/licenses/mit-license
   */
  var isMobile3 = isMobile(window.navigator);
  function maxRecommendedTextures(max) {
    var allowMax = true;
    if (isMobile3.tablet || isMobile3.phone) {
      if (isMobile3.apple.device) {
        var match = navigator.userAgent.match(/OS (\d+)_(\d+)?/);
        if (match) {
          var majorVersion = parseInt(match[1], 10);
          if (majorVersion < 11) {
            allowMax = false;
          }
        }
      }
      if (isMobile3.android.device) {
        var match = navigator.userAgent.match(/Android\s([0-9.]*)/);
        if (match) {
          var majorVersion = parseInt(match[1], 10);
          if (majorVersion < 7) {
            allowMax = false;
          }
        }
      }
    }
    return allowMax ? max : 4;
  }
  function canUploadSameBuffer() {
    return !isMobile3.apple.device;
  }
  var settings = {
    MIPMAP_TEXTURES: 1,
    ANISOTROPIC_LEVEL: 0,
    RESOLUTION: 1,
    FILTER_RESOLUTION: 1,
    SPRITE_MAX_TEXTURES: maxRecommendedTextures(32),
    SPRITE_BATCH_SIZE: 4096,
    RENDER_OPTIONS: {
      view: null,
      antialias: false,
      autoDensity: false,
      transparent: false,
      backgroundColor: 0,
      clearBeforeRender: true,
      preserveDrawingBuffer: false,
      width: 800,
      height: 600,
      legacy: false
    },
    GC_MODE: 0,
    GC_MAX_IDLE: 60 * 60,
    GC_MAX_CHECK_COUNT: 60 * 10,
    WRAP_MODE: 33071,
    SCALE_MODE: 1,
    PRECISION_VERTEX: "highp",
    PRECISION_FRAGMENT: isMobile3.apple.device ? "highp" : "mediump",
    CAN_UPLOAD_SAME_BUFFER: canUploadSameBuffer(),
    CREATE_IMAGE_BITMAP: false,
    ROUND_PIXELS: false
  };

  // node_modules/@pixi/utils/lib/utils.es.js
  const eventemitter3 = __toModule(require_eventemitter3());
  const earcut = __toModule(require_earcut());
  const url = __toModule(require_url());
  const url2 = __toModule(require_url());

  // node_modules/@pixi/constants/lib/constants.es.js
  /*!
   * @pixi/constants - v5.3.3
   * Compiled Tue, 04 Aug 2020 16:23:09 UTC
   *
   * @pixi/constants is licensed under the MIT License.
   * http://www.opensource.org/licenses/mit-license
   */
  var ENV;
  (function(ENV3) {
    ENV3[ENV3["WEBGL_LEGACY"] = 0] = "WEBGL_LEGACY";
    ENV3[ENV3["WEBGL"] = 1] = "WEBGL";
    ENV3[ENV3["WEBGL2"] = 2] = "WEBGL2";
  })(ENV || (ENV = {}));
  var RENDERER_TYPE;
  (function(RENDERER_TYPE3) {
    RENDERER_TYPE3[RENDERER_TYPE3["UNKNOWN"] = 0] = "UNKNOWN";
    RENDERER_TYPE3[RENDERER_TYPE3["WEBGL"] = 1] = "WEBGL";
    RENDERER_TYPE3[RENDERER_TYPE3["CANVAS"] = 2] = "CANVAS";
  })(RENDERER_TYPE || (RENDERER_TYPE = {}));
  var BUFFER_BITS;
  (function(BUFFER_BITS3) {
    BUFFER_BITS3[BUFFER_BITS3["COLOR"] = 16384] = "COLOR";
    BUFFER_BITS3[BUFFER_BITS3["DEPTH"] = 256] = "DEPTH";
    BUFFER_BITS3[BUFFER_BITS3["STENCIL"] = 1024] = "STENCIL";
  })(BUFFER_BITS || (BUFFER_BITS = {}));
  var BLEND_MODES;
  (function(BLEND_MODES3) {
    BLEND_MODES3[BLEND_MODES3["NORMAL"] = 0] = "NORMAL";
    BLEND_MODES3[BLEND_MODES3["ADD"] = 1] = "ADD";
    BLEND_MODES3[BLEND_MODES3["MULTIPLY"] = 2] = "MULTIPLY";
    BLEND_MODES3[BLEND_MODES3["SCREEN"] = 3] = "SCREEN";
    BLEND_MODES3[BLEND_MODES3["OVERLAY"] = 4] = "OVERLAY";
    BLEND_MODES3[BLEND_MODES3["DARKEN"] = 5] = "DARKEN";
    BLEND_MODES3[BLEND_MODES3["LIGHTEN"] = 6] = "LIGHTEN";
    BLEND_MODES3[BLEND_MODES3["COLOR_DODGE"] = 7] = "COLOR_DODGE";
    BLEND_MODES3[BLEND_MODES3["COLOR_BURN"] = 8] = "COLOR_BURN";
    BLEND_MODES3[BLEND_MODES3["HARD_LIGHT"] = 9] = "HARD_LIGHT";
    BLEND_MODES3[BLEND_MODES3["SOFT_LIGHT"] = 10] = "SOFT_LIGHT";
    BLEND_MODES3[BLEND_MODES3["DIFFERENCE"] = 11] = "DIFFERENCE";
    BLEND_MODES3[BLEND_MODES3["EXCLUSION"] = 12] = "EXCLUSION";
    BLEND_MODES3[BLEND_MODES3["HUE"] = 13] = "HUE";
    BLEND_MODES3[BLEND_MODES3["SATURATION"] = 14] = "SATURATION";
    BLEND_MODES3[BLEND_MODES3["COLOR"] = 15] = "COLOR";
    BLEND_MODES3[BLEND_MODES3["LUMINOSITY"] = 16] = "LUMINOSITY";
    BLEND_MODES3[BLEND_MODES3["NORMAL_NPM"] = 17] = "NORMAL_NPM";
    BLEND_MODES3[BLEND_MODES3["ADD_NPM"] = 18] = "ADD_NPM";
    BLEND_MODES3[BLEND_MODES3["SCREEN_NPM"] = 19] = "SCREEN_NPM";
    BLEND_MODES3[BLEND_MODES3["NONE"] = 20] = "NONE";
    BLEND_MODES3[BLEND_MODES3["SRC_OVER"] = 0] = "SRC_OVER";
    BLEND_MODES3[BLEND_MODES3["SRC_IN"] = 21] = "SRC_IN";
    BLEND_MODES3[BLEND_MODES3["SRC_OUT"] = 22] = "SRC_OUT";
    BLEND_MODES3[BLEND_MODES3["SRC_ATOP"] = 23] = "SRC_ATOP";
    BLEND_MODES3[BLEND_MODES3["DST_OVER"] = 24] = "DST_OVER";
    BLEND_MODES3[BLEND_MODES3["DST_IN"] = 25] = "DST_IN";
    BLEND_MODES3[BLEND_MODES3["DST_OUT"] = 26] = "DST_OUT";
    BLEND_MODES3[BLEND_MODES3["DST_ATOP"] = 27] = "DST_ATOP";
    BLEND_MODES3[BLEND_MODES3["ERASE"] = 26] = "ERASE";
    BLEND_MODES3[BLEND_MODES3["SUBTRACT"] = 28] = "SUBTRACT";
    BLEND_MODES3[BLEND_MODES3["XOR"] = 29] = "XOR";
  })(BLEND_MODES || (BLEND_MODES = {}));
  var DRAW_MODES;
  (function(DRAW_MODES3) {
    DRAW_MODES3[DRAW_MODES3["POINTS"] = 0] = "POINTS";
    DRAW_MODES3[DRAW_MODES3["LINES"] = 1] = "LINES";
    DRAW_MODES3[DRAW_MODES3["LINE_LOOP"] = 2] = "LINE_LOOP";
    DRAW_MODES3[DRAW_MODES3["LINE_STRIP"] = 3] = "LINE_STRIP";
    DRAW_MODES3[DRAW_MODES3["TRIANGLES"] = 4] = "TRIANGLES";
    DRAW_MODES3[DRAW_MODES3["TRIANGLE_STRIP"] = 5] = "TRIANGLE_STRIP";
    DRAW_MODES3[DRAW_MODES3["TRIANGLE_FAN"] = 6] = "TRIANGLE_FAN";
  })(DRAW_MODES || (DRAW_MODES = {}));
  var FORMATS;
  (function(FORMATS3) {
    FORMATS3[FORMATS3["RGBA"] = 6408] = "RGBA";
    FORMATS3[FORMATS3["RGB"] = 6407] = "RGB";
    FORMATS3[FORMATS3["ALPHA"] = 6406] = "ALPHA";
    FORMATS3[FORMATS3["LUMINANCE"] = 6409] = "LUMINANCE";
    FORMATS3[FORMATS3["LUMINANCE_ALPHA"] = 6410] = "LUMINANCE_ALPHA";
    FORMATS3[FORMATS3["DEPTH_COMPONENT"] = 6402] = "DEPTH_COMPONENT";
    FORMATS3[FORMATS3["DEPTH_STENCIL"] = 34041] = "DEPTH_STENCIL";
  })(FORMATS || (FORMATS = {}));
  var TARGETS;
  (function(TARGETS3) {
    TARGETS3[TARGETS3["TEXTURE_2D"] = 3553] = "TEXTURE_2D";
    TARGETS3[TARGETS3["TEXTURE_CUBE_MAP"] = 34067] = "TEXTURE_CUBE_MAP";
    TARGETS3[TARGETS3["TEXTURE_2D_ARRAY"] = 35866] = "TEXTURE_2D_ARRAY";
    TARGETS3[TARGETS3["TEXTURE_CUBE_MAP_POSITIVE_X"] = 34069] = "TEXTURE_CUBE_MAP_POSITIVE_X";
    TARGETS3[TARGETS3["TEXTURE_CUBE_MAP_NEGATIVE_X"] = 34070] = "TEXTURE_CUBE_MAP_NEGATIVE_X";
    TARGETS3[TARGETS3["TEXTURE_CUBE_MAP_POSITIVE_Y"] = 34071] = "TEXTURE_CUBE_MAP_POSITIVE_Y";
    TARGETS3[TARGETS3["TEXTURE_CUBE_MAP_NEGATIVE_Y"] = 34072] = "TEXTURE_CUBE_MAP_NEGATIVE_Y";
    TARGETS3[TARGETS3["TEXTURE_CUBE_MAP_POSITIVE_Z"] = 34073] = "TEXTURE_CUBE_MAP_POSITIVE_Z";
    TARGETS3[TARGETS3["TEXTURE_CUBE_MAP_NEGATIVE_Z"] = 34074] = "TEXTURE_CUBE_MAP_NEGATIVE_Z";
  })(TARGETS || (TARGETS = {}));
  var TYPES;
  (function(TYPES3) {
    TYPES3[TYPES3["UNSIGNED_BYTE"] = 5121] = "UNSIGNED_BYTE";
    TYPES3[TYPES3["UNSIGNED_SHORT"] = 5123] = "UNSIGNED_SHORT";
    TYPES3[TYPES3["UNSIGNED_SHORT_5_6_5"] = 33635] = "UNSIGNED_SHORT_5_6_5";
    TYPES3[TYPES3["UNSIGNED_SHORT_4_4_4_4"] = 32819] = "UNSIGNED_SHORT_4_4_4_4";
    TYPES3[TYPES3["UNSIGNED_SHORT_5_5_5_1"] = 32820] = "UNSIGNED_SHORT_5_5_5_1";
    TYPES3[TYPES3["FLOAT"] = 5126] = "FLOAT";
    TYPES3[TYPES3["HALF_FLOAT"] = 36193] = "HALF_FLOAT";
  })(TYPES || (TYPES = {}));
  var SCALE_MODES;
  (function(SCALE_MODES3) {
    SCALE_MODES3[SCALE_MODES3["NEAREST"] = 0] = "NEAREST";
    SCALE_MODES3[SCALE_MODES3["LINEAR"] = 1] = "LINEAR";
  })(SCALE_MODES || (SCALE_MODES = {}));
  var WRAP_MODES;
  (function(WRAP_MODES3) {
    WRAP_MODES3[WRAP_MODES3["CLAMP"] = 33071] = "CLAMP";
    WRAP_MODES3[WRAP_MODES3["REPEAT"] = 10497] = "REPEAT";
    WRAP_MODES3[WRAP_MODES3["MIRRORED_REPEAT"] = 33648] = "MIRRORED_REPEAT";
  })(WRAP_MODES || (WRAP_MODES = {}));
  var MIPMAP_MODES;
  (function(MIPMAP_MODES3) {
    MIPMAP_MODES3[MIPMAP_MODES3["OFF"] = 0] = "OFF";
    MIPMAP_MODES3[MIPMAP_MODES3["POW2"] = 1] = "POW2";
    MIPMAP_MODES3[MIPMAP_MODES3["ON"] = 2] = "ON";
  })(MIPMAP_MODES || (MIPMAP_MODES = {}));
  var ALPHA_MODES;
  (function(ALPHA_MODES3) {
    ALPHA_MODES3[ALPHA_MODES3["NPM"] = 0] = "NPM";
    ALPHA_MODES3[ALPHA_MODES3["UNPACK"] = 1] = "UNPACK";
    ALPHA_MODES3[ALPHA_MODES3["PMA"] = 2] = "PMA";
    ALPHA_MODES3[ALPHA_MODES3["NO_PREMULTIPLIED_ALPHA"] = 0] = "NO_PREMULTIPLIED_ALPHA";
    ALPHA_MODES3[ALPHA_MODES3["PREMULTIPLY_ON_UPLOAD"] = 1] = "PREMULTIPLY_ON_UPLOAD";
    ALPHA_MODES3[ALPHA_MODES3["PREMULTIPLY_ALPHA"] = 2] = "PREMULTIPLY_ALPHA";
  })(ALPHA_MODES || (ALPHA_MODES = {}));
  var CLEAR_MODES;
  (function(CLEAR_MODES3) {
    CLEAR_MODES3[CLEAR_MODES3["NO"] = 0] = "NO";
    CLEAR_MODES3[CLEAR_MODES3["YES"] = 1] = "YES";
    CLEAR_MODES3[CLEAR_MODES3["AUTO"] = 2] = "AUTO";
    CLEAR_MODES3[CLEAR_MODES3["BLEND"] = 0] = "BLEND";
    CLEAR_MODES3[CLEAR_MODES3["CLEAR"] = 1] = "CLEAR";
    CLEAR_MODES3[CLEAR_MODES3["BLIT"] = 2] = "BLIT";
  })(CLEAR_MODES || (CLEAR_MODES = {}));
  var GC_MODES;
  (function(GC_MODES3) {
    GC_MODES3[GC_MODES3["AUTO"] = 0] = "AUTO";
    GC_MODES3[GC_MODES3["MANUAL"] = 1] = "MANUAL";
  })(GC_MODES || (GC_MODES = {}));
  var PRECISION;
  (function(PRECISION3) {
    PRECISION3["LOW"] = "lowp";
    PRECISION3["MEDIUM"] = "mediump";
    PRECISION3["HIGH"] = "highp";
  })(PRECISION || (PRECISION = {}));
  var MASK_TYPES;
  (function(MASK_TYPES3) {
    MASK_TYPES3[MASK_TYPES3["NONE"] = 0] = "NONE";
    MASK_TYPES3[MASK_TYPES3["SCISSOR"] = 1] = "SCISSOR";
    MASK_TYPES3[MASK_TYPES3["STENCIL"] = 2] = "STENCIL";
    MASK_TYPES3[MASK_TYPES3["SPRITE"] = 3] = "SPRITE";
  })(MASK_TYPES || (MASK_TYPES = {}));
  var MSAA_QUALITY;
  (function(MSAA_QUALITY3) {
    MSAA_QUALITY3[MSAA_QUALITY3["NONE"] = 0] = "NONE";
    MSAA_QUALITY3[MSAA_QUALITY3["LOW"] = 2] = "LOW";
    MSAA_QUALITY3[MSAA_QUALITY3["MEDIUM"] = 4] = "MEDIUM";
    MSAA_QUALITY3[MSAA_QUALITY3["HIGH"] = 8] = "HIGH";
  })(MSAA_QUALITY || (MSAA_QUALITY = {}));

  // node_modules/@pixi/utils/lib/utils.es.js
  /*!
   * @pixi/utils - v5.3.3
   * Compiled Tue, 04 Aug 2020 16:23:09 UTC
   *
   * @pixi/utils is licensed under the MIT License.
   * http://www.opensource.org/licenses/mit-license
   */
  settings.RETINA_PREFIX = /@([0-9\.]+)x/;
  settings.FAIL_IF_MAJOR_PERFORMANCE_CAVEAT = true;
  var saidHello = false;
  var VERSION = "5.3.3";
  function sayHello(type) {
    var _a2;
    if (saidHello) {
      return;
    }
    if (navigator.userAgent.toLowerCase().indexOf("chrome") > -1) {
      var args = [
        "\n %c %c %c PixiJS " + VERSION + " - \u2730 " + type + " \u2730  %c  %c  http://www.pixijs.com/  %c %c \u2665%c\u2665%c\u2665 \n\n",
        "background: #ff66a5; padding:5px 0;",
        "background: #ff66a5; padding:5px 0;",
        "color: #ff66a5; background: #030307; padding:5px 0;",
        "background: #ff66a5; padding:5px 0;",
        "background: #ffc3dc; padding:5px 0;",
        "background: #ff66a5; padding:5px 0;",
        "color: #ff2424; background: #fff; padding:5px 0;",
        "color: #ff2424; background: #fff; padding:5px 0;",
        "color: #ff2424; background: #fff; padding:5px 0;"
      ];
      (_a2 = window.console).log.apply(_a2, args);
    } else if (window.console) {
      window.console.log("PixiJS " + VERSION + " - " + type + " - http://www.pixijs.com/");
    }
    saidHello = true;
  }
  var supported;
  function isWebGLSupported() {
    if (typeof supported === "undefined") {
      supported = function supported2() {
        var contextOptions = {
          stencil: true,
          failIfMajorPerformanceCaveat: settings.FAIL_IF_MAJOR_PERFORMANCE_CAVEAT
        };
        try {
          if (!window.WebGLRenderingContext) {
            return false;
          }
          var canvas2 = document.createElement("canvas");
          var gl = canvas2.getContext("webgl", contextOptions) || canvas2.getContext("experimental-webgl", contextOptions);
          var success = !!(gl && gl.getContextAttributes().stencil);
          if (gl) {
            var loseContext = gl.getExtension("WEBGL_lose_context");
            if (loseContext) {
              loseContext.loseContext();
            }
          }
          gl = null;
          return success;
        } catch (e) {
          return false;
        }
      }();
    }
    return supported;
  }
  function hex2rgb(hex, out) {
    if (out === void 0) {
      out = [];
    }
    out[0] = (hex >> 16 & 255) / 255;
    out[1] = (hex >> 8 & 255) / 255;
    out[2] = (hex & 255) / 255;
    return out;
  }
  function hex2string(hex) {
    var hexString = hex.toString(16);
    hexString = "000000".substr(0, 6 - hexString.length) + hexString;
    return "#" + hexString;
  }
  function string2hex(string) {
    if (typeof string === "string" && string[0] === "#") {
      string = string.substr(1);
    }
    return parseInt(string, 16);
  }
  function mapPremultipliedBlendModes() {
    var pm = [];
    var npm = [];
    for (var i = 0; i < 32; i++) {
      pm[i] = i;
      npm[i] = i;
    }
    pm[BLEND_MODES.NORMAL_NPM] = BLEND_MODES.NORMAL;
    pm[BLEND_MODES.ADD_NPM] = BLEND_MODES.ADD;
    pm[BLEND_MODES.SCREEN_NPM] = BLEND_MODES.SCREEN;
    npm[BLEND_MODES.NORMAL] = BLEND_MODES.NORMAL_NPM;
    npm[BLEND_MODES.ADD] = BLEND_MODES.ADD_NPM;
    npm[BLEND_MODES.SCREEN] = BLEND_MODES.SCREEN_NPM;
    var array = [];
    array.push(npm);
    array.push(pm);
    return array;
  }
  var premultiplyBlendMode = mapPremultipliedBlendModes();
  function correctBlendMode(blendMode, premultiplied) {
    return premultiplyBlendMode[premultiplied ? 1 : 0][blendMode];
  }
  function premultiplyRgba(rgb, alpha, out, premultiply) {
    out = out || new Float32Array(4);
    if (premultiply || premultiply === void 0) {
      out[0] = rgb[0] * alpha;
      out[1] = rgb[1] * alpha;
      out[2] = rgb[2] * alpha;
    } else {
      out[0] = rgb[0];
      out[1] = rgb[1];
      out[2] = rgb[2];
    }
    out[3] = alpha;
    return out;
  }
  function premultiplyTint(tint, alpha) {
    if (alpha === 1) {
      return (alpha * 255 << 24) + tint;
    }
    if (alpha === 0) {
      return 0;
    }
    var R = tint >> 16 & 255;
    var G = tint >> 8 & 255;
    var B = tint & 255;
    R = R * alpha + 0.5 | 0;
    G = G * alpha + 0.5 | 0;
    B = B * alpha + 0.5 | 0;
    return (alpha * 255 << 24) + (R << 16) + (G << 8) + B;
  }
  function premultiplyTintToRgba(tint, alpha, out, premultiply) {
    out = out || new Float32Array(4);
    out[0] = (tint >> 16 & 255) / 255;
    out[1] = (tint >> 8 & 255) / 255;
    out[2] = (tint & 255) / 255;
    if (premultiply || premultiply === void 0) {
      out[0] *= alpha;
      out[1] *= alpha;
      out[2] *= alpha;
    }
    out[3] = alpha;
    return out;
  }
  function createIndicesForQuads(size2, outBuffer) {
    if (outBuffer === void 0) {
      outBuffer = null;
    }
    var totalIndices = size2 * 6;
    outBuffer = outBuffer || new Uint16Array(totalIndices);
    if (outBuffer.length !== totalIndices) {
      throw new Error("Out buffer length is incorrect, got " + outBuffer.length + " and expected " + totalIndices);
    }
    for (var i = 0, j = 0; i < totalIndices; i += 6, j += 4) {
      outBuffer[i + 0] = j + 0;
      outBuffer[i + 1] = j + 1;
      outBuffer[i + 2] = j + 2;
      outBuffer[i + 3] = j + 0;
      outBuffer[i + 4] = j + 2;
      outBuffer[i + 5] = j + 3;
    }
    return outBuffer;
  }
  var map = {Float32Array, Uint32Array, Int32Array, Uint8Array};
  function nextPow2(v) {
    v += v === 0 ? 1 : 0;
    --v;
    v |= v >>> 1;
    v |= v >>> 2;
    v |= v >>> 4;
    v |= v >>> 8;
    v |= v >>> 16;
    return v + 1;
  }
  function isPow2(v) {
    return !(v & v - 1) && !!v;
  }
  function log2(v) {
    var r = (v > 65535 ? 1 : 0) << 4;
    v >>>= r;
    var shift = (v > 255 ? 1 : 0) << 3;
    v >>>= shift;
    r |= shift;
    shift = (v > 15 ? 1 : 0) << 2;
    v >>>= shift;
    r |= shift;
    shift = (v > 3 ? 1 : 0) << 1;
    v >>>= shift;
    r |= shift;
    return r | v >> 1;
  }
  function removeItems(arr, startIdx, removeCount) {
    var length = arr.length;
    var i;
    if (startIdx >= length || removeCount === 0) {
      return;
    }
    removeCount = startIdx + removeCount > length ? length - startIdx : removeCount;
    var len = length - removeCount;
    for (i = startIdx; i < len; ++i) {
      arr[i] = arr[i + removeCount];
    }
    arr.length = len;
  }
  function sign(n) {
    if (n === 0) {
      return 0;
    }
    return n < 0 ? -1 : 1;
  }
  var nextUid = 0;
  function uid() {
    return ++nextUid;
  }
  var warnings = {};
  function deprecation(version, message, ignoreDepth) {
    if (ignoreDepth === void 0) {
      ignoreDepth = 3;
    }
    if (warnings[message]) {
      return;
    }
    var stack = new Error().stack;
    if (typeof stack === "undefined") {
      console.warn("PixiJS Deprecation Warning: ", message + "\nDeprecated since v" + version);
    } else {
      stack = stack.split("\n").splice(ignoreDepth).join("\n");
      if (console.groupCollapsed) {
        console.groupCollapsed("%cPixiJS Deprecation Warning: %c%s", "color:#614108;background:#fffbe6", "font-weight:normal;color:#614108;background:#fffbe6", message + "\nDeprecated since v" + version);
        console.warn(stack);
        console.groupEnd();
      } else {
        console.warn("PixiJS Deprecation Warning: ", message + "\nDeprecated since v" + version);
        console.warn(stack);
      }
    }
    warnings[message] = true;
  }
  var ProgramCache = {};
  var TextureCache = Object.create(null);
  var BaseTextureCache = Object.create(null);
  var CanvasRenderTarget = function() {
    function CanvasRenderTarget2(width, height, resolution) {
      this.canvas = document.createElement("canvas");
      this.context = this.canvas.getContext("2d");
      this.resolution = resolution || settings.RESOLUTION;
      this.resize(width, height);
    }
    CanvasRenderTarget2.prototype.clear = function() {
      this.context.setTransform(1, 0, 0, 1, 0, 0);
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };
    CanvasRenderTarget2.prototype.resize = function(width, height) {
      this.canvas.width = width * this.resolution;
      this.canvas.height = height * this.resolution;
    };
    CanvasRenderTarget2.prototype.destroy = function() {
      this.context = null;
      this.canvas = null;
    };
    Object.defineProperty(CanvasRenderTarget2.prototype, "width", {
      get: function() {
        return this.canvas.width;
      },
      set: function(val) {
        this.canvas.width = val;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(CanvasRenderTarget2.prototype, "height", {
      get: function() {
        return this.canvas.height;
      },
      set: function(val) {
        this.canvas.height = val;
      },
      enumerable: false,
      configurable: true
    });
    return CanvasRenderTarget2;
  }();
  function trimCanvas(canvas2) {
    var width = canvas2.width;
    var height = canvas2.height;
    var context2 = canvas2.getContext("2d");
    var imageData = context2.getImageData(0, 0, width, height);
    var pixels = imageData.data;
    var len = pixels.length;
    var bound = {
      top: null,
      left: null,
      right: null,
      bottom: null
    };
    var data = null;
    var i;
    var x;
    var y;
    for (i = 0; i < len; i += 4) {
      if (pixels[i + 3] !== 0) {
        x = i / 4 % width;
        y = ~~(i / 4 / width);
        if (bound.top === null) {
          bound.top = y;
        }
        if (bound.left === null) {
          bound.left = x;
        } else if (x < bound.left) {
          bound.left = x;
        }
        if (bound.right === null) {
          bound.right = x + 1;
        } else if (bound.right < x) {
          bound.right = x + 1;
        }
        if (bound.bottom === null) {
          bound.bottom = y;
        } else if (bound.bottom < y) {
          bound.bottom = y;
        }
      }
    }
    if (bound.top !== null) {
      width = bound.right - bound.left;
      height = bound.bottom - bound.top + 1;
      data = context2.getImageData(bound.left, bound.top, width, height);
    }
    return {
      height,
      width,
      data
    };
  }
  var tempAnchor;
  function determineCrossOrigin(url3, loc) {
    if (loc === void 0) {
      loc = window.location;
    }
    if (url3.indexOf("data:") === 0) {
      return "";
    }
    loc = loc || window.location;
    if (!tempAnchor) {
      tempAnchor = document.createElement("a");
    }
    tempAnchor.href = url3;
    var parsedUrl = url.parse(tempAnchor.href);
    var samePort = !parsedUrl.port && loc.port === "" || parsedUrl.port === loc.port;
    if (parsedUrl.hostname !== loc.hostname || !samePort || parsedUrl.protocol !== loc.protocol) {
      return "anonymous";
    }
    return "";
  }
  function getResolutionOfUrl(url3, defaultValue2) {
    var resolution = settings.RETINA_PREFIX.exec(url3);
    if (resolution) {
      return parseFloat(resolution[1]);
    }
    return defaultValue2 !== void 0 ? defaultValue2 : 1;
  }

  // node_modules/@pixi/math/lib/math.es.js
  /*!
   * @pixi/math - v5.3.3
   * Compiled Tue, 04 Aug 2020 16:23:09 UTC
   *
   * @pixi/math is licensed under the MIT License.
   * http://www.opensource.org/licenses/mit-license
   */
  var PI_2 = Math.PI * 2;
  var RAD_TO_DEG = 180 / Math.PI;
  var DEG_TO_RAD = Math.PI / 180;
  var SHAPES;
  (function(SHAPES2) {
    SHAPES2[SHAPES2["POLY"] = 0] = "POLY";
    SHAPES2[SHAPES2["RECT"] = 1] = "RECT";
    SHAPES2[SHAPES2["CIRC"] = 2] = "CIRC";
    SHAPES2[SHAPES2["ELIP"] = 3] = "ELIP";
    SHAPES2[SHAPES2["RREC"] = 4] = "RREC";
  })(SHAPES || (SHAPES = {}));
  var Rectangle = function() {
    function Rectangle2(x, y, width, height) {
      if (x === void 0) {
        x = 0;
      }
      if (y === void 0) {
        y = 0;
      }
      if (width === void 0) {
        width = 0;
      }
      if (height === void 0) {
        height = 0;
      }
      this.x = Number(x);
      this.y = Number(y);
      this.width = Number(width);
      this.height = Number(height);
      this.type = SHAPES.RECT;
    }
    Object.defineProperty(Rectangle2.prototype, "left", {
      get: function() {
        return this.x;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Rectangle2.prototype, "right", {
      get: function() {
        return this.x + this.width;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Rectangle2.prototype, "top", {
      get: function() {
        return this.y;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Rectangle2.prototype, "bottom", {
      get: function() {
        return this.y + this.height;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Rectangle2, "EMPTY", {
      get: function() {
        return new Rectangle2(0, 0, 0, 0);
      },
      enumerable: false,
      configurable: true
    });
    Rectangle2.prototype.clone = function() {
      return new Rectangle2(this.x, this.y, this.width, this.height);
    };
    Rectangle2.prototype.copyFrom = function(rectangle) {
      this.x = rectangle.x;
      this.y = rectangle.y;
      this.width = rectangle.width;
      this.height = rectangle.height;
      return this;
    };
    Rectangle2.prototype.copyTo = function(rectangle) {
      rectangle.x = this.x;
      rectangle.y = this.y;
      rectangle.width = this.width;
      rectangle.height = this.height;
      return rectangle;
    };
    Rectangle2.prototype.contains = function(x, y) {
      if (this.width <= 0 || this.height <= 0) {
        return false;
      }
      if (x >= this.x && x < this.x + this.width) {
        if (y >= this.y && y < this.y + this.height) {
          return true;
        }
      }
      return false;
    };
    Rectangle2.prototype.pad = function(paddingX, paddingY) {
      if (paddingX === void 0) {
        paddingX = 0;
      }
      if (paddingY === void 0) {
        paddingY = paddingX;
      }
      this.x -= paddingX;
      this.y -= paddingY;
      this.width += paddingX * 2;
      this.height += paddingY * 2;
      return this;
    };
    Rectangle2.prototype.fit = function(rectangle) {
      var x1 = Math.max(this.x, rectangle.x);
      var x2 = Math.min(this.x + this.width, rectangle.x + rectangle.width);
      var y1 = Math.max(this.y, rectangle.y);
      var y2 = Math.min(this.y + this.height, rectangle.y + rectangle.height);
      this.x = x1;
      this.width = Math.max(x2 - x1, 0);
      this.y = y1;
      this.height = Math.max(y2 - y1, 0);
      return this;
    };
    Rectangle2.prototype.ceil = function(resolution, eps) {
      if (resolution === void 0) {
        resolution = 1;
      }
      if (eps === void 0) {
        eps = 1e-3;
      }
      var x2 = Math.ceil((this.x + this.width - eps) * resolution) / resolution;
      var y2 = Math.ceil((this.y + this.height - eps) * resolution) / resolution;
      this.x = Math.floor((this.x + eps) * resolution) / resolution;
      this.y = Math.floor((this.y + eps) * resolution) / resolution;
      this.width = x2 - this.x;
      this.height = y2 - this.y;
      return this;
    };
    Rectangle2.prototype.enlarge = function(rectangle) {
      var x1 = Math.min(this.x, rectangle.x);
      var x2 = Math.max(this.x + this.width, rectangle.x + rectangle.width);
      var y1 = Math.min(this.y, rectangle.y);
      var y2 = Math.max(this.y + this.height, rectangle.y + rectangle.height);
      this.x = x1;
      this.width = x2 - x1;
      this.y = y1;
      this.height = y2 - y1;
      return this;
    };
    return Rectangle2;
  }();
  var Circle = function() {
    function Circle2(x, y, radius2) {
      if (x === void 0) {
        x = 0;
      }
      if (y === void 0) {
        y = 0;
      }
      if (radius2 === void 0) {
        radius2 = 0;
      }
      this.x = x;
      this.y = y;
      this.radius = radius2;
      this.type = SHAPES.CIRC;
    }
    Circle2.prototype.clone = function() {
      return new Circle2(this.x, this.y, this.radius);
    };
    Circle2.prototype.contains = function(x, y) {
      if (this.radius <= 0) {
        return false;
      }
      var r2 = this.radius * this.radius;
      var dx = this.x - x;
      var dy = this.y - y;
      dx *= dx;
      dy *= dy;
      return dx + dy <= r2;
    };
    Circle2.prototype.getBounds = function() {
      return new Rectangle(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
    };
    return Circle2;
  }();
  var Ellipse = function() {
    function Ellipse2(x, y, halfWidth, halfHeight) {
      if (x === void 0) {
        x = 0;
      }
      if (y === void 0) {
        y = 0;
      }
      if (halfWidth === void 0) {
        halfWidth = 0;
      }
      if (halfHeight === void 0) {
        halfHeight = 0;
      }
      this.x = x;
      this.y = y;
      this.width = halfWidth;
      this.height = halfHeight;
      this.type = SHAPES.ELIP;
    }
    Ellipse2.prototype.clone = function() {
      return new Ellipse2(this.x, this.y, this.width, this.height);
    };
    Ellipse2.prototype.contains = function(x, y) {
      if (this.width <= 0 || this.height <= 0) {
        return false;
      }
      var normx = (x - this.x) / this.width;
      var normy = (y - this.y) / this.height;
      normx *= normx;
      normy *= normy;
      return normx + normy <= 1;
    };
    Ellipse2.prototype.getBounds = function() {
      return new Rectangle(this.x - this.width, this.y - this.height, this.width, this.height);
    };
    return Ellipse2;
  }();
  var Polygon = function() {
    function Polygon2() {
      var arguments$1 = arguments;
      var points = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        points[_i] = arguments$1[_i];
      }
      var flat = Array.isArray(points[0]) ? points[0] : points;
      if (typeof flat[0] !== "number") {
        var p = [];
        for (var i = 0, il = flat.length; i < il; i++) {
          p.push(flat[i].x, flat[i].y);
        }
        flat = p;
      }
      this.points = flat;
      this.type = SHAPES.POLY;
      this.closeStroke = true;
    }
    Polygon2.prototype.clone = function() {
      var points = this.points.slice();
      var polygon = new Polygon2(points);
      polygon.closeStroke = this.closeStroke;
      return polygon;
    };
    Polygon2.prototype.contains = function(x, y) {
      var inside = false;
      var length = this.points.length / 2;
      for (var i = 0, j = length - 1; i < length; j = i++) {
        var xi = this.points[i * 2];
        var yi = this.points[i * 2 + 1];
        var xj = this.points[j * 2];
        var yj = this.points[j * 2 + 1];
        var intersect = yi > y !== yj > y && x < (xj - xi) * ((y - yi) / (yj - yi)) + xi;
        if (intersect) {
          inside = !inside;
        }
      }
      return inside;
    };
    return Polygon2;
  }();
  var RoundedRectangle = function() {
    function RoundedRectangle2(x, y, width, height, radius2) {
      if (x === void 0) {
        x = 0;
      }
      if (y === void 0) {
        y = 0;
      }
      if (width === void 0) {
        width = 0;
      }
      if (height === void 0) {
        height = 0;
      }
      if (radius2 === void 0) {
        radius2 = 20;
      }
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.radius = radius2;
      this.type = SHAPES.RREC;
    }
    RoundedRectangle2.prototype.clone = function() {
      return new RoundedRectangle2(this.x, this.y, this.width, this.height, this.radius);
    };
    RoundedRectangle2.prototype.contains = function(x, y) {
      if (this.width <= 0 || this.height <= 0) {
        return false;
      }
      if (x >= this.x && x <= this.x + this.width) {
        if (y >= this.y && y <= this.y + this.height) {
          if (y >= this.y + this.radius && y <= this.y + this.height - this.radius || x >= this.x + this.radius && x <= this.x + this.width - this.radius) {
            return true;
          }
          var dx = x - (this.x + this.radius);
          var dy = y - (this.y + this.radius);
          var radius2 = this.radius * this.radius;
          if (dx * dx + dy * dy <= radius2) {
            return true;
          }
          dx = x - (this.x + this.width - this.radius);
          if (dx * dx + dy * dy <= radius2) {
            return true;
          }
          dy = y - (this.y + this.height - this.radius);
          if (dx * dx + dy * dy <= radius2) {
            return true;
          }
          dx = x - (this.x + this.radius);
          if (dx * dx + dy * dy <= radius2) {
            return true;
          }
        }
      }
      return false;
    };
    return RoundedRectangle2;
  }();
  var Point = function() {
    function Point2(x, y) {
      if (x === void 0) {
        x = 0;
      }
      if (y === void 0) {
        y = 0;
      }
      this.x = x;
      this.y = y;
    }
    Point2.prototype.clone = function() {
      return new Point2(this.x, this.y);
    };
    Point2.prototype.copyFrom = function(p) {
      this.set(p.x, p.y);
      return this;
    };
    Point2.prototype.copyTo = function(p) {
      p.set(this.x, this.y);
      return p;
    };
    Point2.prototype.equals = function(p) {
      return p.x === this.x && p.y === this.y;
    };
    Point2.prototype.set = function(x, y) {
      if (x === void 0) {
        x = 0;
      }
      if (y === void 0) {
        y = x;
      }
      this.x = x;
      this.y = y;
      return this;
    };
    return Point2;
  }();
  var ObservablePoint = function() {
    function ObservablePoint2(cb, scope, x, y) {
      if (x === void 0) {
        x = 0;
      }
      if (y === void 0) {
        y = 0;
      }
      this._x = x;
      this._y = y;
      this.cb = cb;
      this.scope = scope;
    }
    ObservablePoint2.prototype.clone = function(cb, scope) {
      if (cb === void 0) {
        cb = this.cb;
      }
      if (scope === void 0) {
        scope = this.scope;
      }
      return new ObservablePoint2(cb, scope, this._x, this._y);
    };
    ObservablePoint2.prototype.set = function(x, y) {
      if (x === void 0) {
        x = 0;
      }
      if (y === void 0) {
        y = x;
      }
      if (this._x !== x || this._y !== y) {
        this._x = x;
        this._y = y;
        this.cb.call(this.scope);
      }
      return this;
    };
    ObservablePoint2.prototype.copyFrom = function(p) {
      if (this._x !== p.x || this._y !== p.y) {
        this._x = p.x;
        this._y = p.y;
        this.cb.call(this.scope);
      }
      return this;
    };
    ObservablePoint2.prototype.copyTo = function(p) {
      p.set(this._x, this._y);
      return p;
    };
    ObservablePoint2.prototype.equals = function(p) {
      return p.x === this._x && p.y === this._y;
    };
    Object.defineProperty(ObservablePoint2.prototype, "x", {
      get: function() {
        return this._x;
      },
      set: function(value) {
        if (this._x !== value) {
          this._x = value;
          this.cb.call(this.scope);
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(ObservablePoint2.prototype, "y", {
      get: function() {
        return this._y;
      },
      set: function(value) {
        if (this._y !== value) {
          this._y = value;
          this.cb.call(this.scope);
        }
      },
      enumerable: false,
      configurable: true
    });
    return ObservablePoint2;
  }();
  var Matrix = function() {
    function Matrix2(a, b, c, d, tx, ty) {
      if (a === void 0) {
        a = 1;
      }
      if (b === void 0) {
        b = 0;
      }
      if (c === void 0) {
        c = 0;
      }
      if (d === void 0) {
        d = 1;
      }
      if (tx === void 0) {
        tx = 0;
      }
      if (ty === void 0) {
        ty = 0;
      }
      this.array = null;
      this.a = a;
      this.b = b;
      this.c = c;
      this.d = d;
      this.tx = tx;
      this.ty = ty;
    }
    Matrix2.prototype.fromArray = function(array) {
      this.a = array[0];
      this.b = array[1];
      this.c = array[3];
      this.d = array[4];
      this.tx = array[2];
      this.ty = array[5];
    };
    Matrix2.prototype.set = function(a, b, c, d, tx, ty) {
      this.a = a;
      this.b = b;
      this.c = c;
      this.d = d;
      this.tx = tx;
      this.ty = ty;
      return this;
    };
    Matrix2.prototype.toArray = function(transpose, out) {
      if (!this.array) {
        this.array = new Float32Array(9);
      }
      var array = out || this.array;
      if (transpose) {
        array[0] = this.a;
        array[1] = this.b;
        array[2] = 0;
        array[3] = this.c;
        array[4] = this.d;
        array[5] = 0;
        array[6] = this.tx;
        array[7] = this.ty;
        array[8] = 1;
      } else {
        array[0] = this.a;
        array[1] = this.c;
        array[2] = this.tx;
        array[3] = this.b;
        array[4] = this.d;
        array[5] = this.ty;
        array[6] = 0;
        array[7] = 0;
        array[8] = 1;
      }
      return array;
    };
    Matrix2.prototype.apply = function(pos, newPos) {
      newPos = newPos || new Point();
      var x = pos.x;
      var y = pos.y;
      newPos.x = this.a * x + this.c * y + this.tx;
      newPos.y = this.b * x + this.d * y + this.ty;
      return newPos;
    };
    Matrix2.prototype.applyInverse = function(pos, newPos) {
      newPos = newPos || new Point();
      var id = 1 / (this.a * this.d + this.c * -this.b);
      var x = pos.x;
      var y = pos.y;
      newPos.x = this.d * id * x + -this.c * id * y + (this.ty * this.c - this.tx * this.d) * id;
      newPos.y = this.a * id * y + -this.b * id * x + (-this.ty * this.a + this.tx * this.b) * id;
      return newPos;
    };
    Matrix2.prototype.translate = function(x, y) {
      this.tx += x;
      this.ty += y;
      return this;
    };
    Matrix2.prototype.scale = function(x, y) {
      this.a *= x;
      this.d *= y;
      this.c *= x;
      this.b *= y;
      this.tx *= x;
      this.ty *= y;
      return this;
    };
    Matrix2.prototype.rotate = function(angle) {
      var cos = Math.cos(angle);
      var sin = Math.sin(angle);
      var a1 = this.a;
      var c1 = this.c;
      var tx1 = this.tx;
      this.a = a1 * cos - this.b * sin;
      this.b = a1 * sin + this.b * cos;
      this.c = c1 * cos - this.d * sin;
      this.d = c1 * sin + this.d * cos;
      this.tx = tx1 * cos - this.ty * sin;
      this.ty = tx1 * sin + this.ty * cos;
      return this;
    };
    Matrix2.prototype.append = function(matrix) {
      var a1 = this.a;
      var b1 = this.b;
      var c1 = this.c;
      var d1 = this.d;
      this.a = matrix.a * a1 + matrix.b * c1;
      this.b = matrix.a * b1 + matrix.b * d1;
      this.c = matrix.c * a1 + matrix.d * c1;
      this.d = matrix.c * b1 + matrix.d * d1;
      this.tx = matrix.tx * a1 + matrix.ty * c1 + this.tx;
      this.ty = matrix.tx * b1 + matrix.ty * d1 + this.ty;
      return this;
    };
    Matrix2.prototype.setTransform = function(x, y, pivotX, pivotY, scaleX, scaleY, rotation, skewX, skewY) {
      this.a = Math.cos(rotation + skewY) * scaleX;
      this.b = Math.sin(rotation + skewY) * scaleX;
      this.c = -Math.sin(rotation - skewX) * scaleY;
      this.d = Math.cos(rotation - skewX) * scaleY;
      this.tx = x - (pivotX * this.a + pivotY * this.c);
      this.ty = y - (pivotX * this.b + pivotY * this.d);
      return this;
    };
    Matrix2.prototype.prepend = function(matrix) {
      var tx1 = this.tx;
      if (matrix.a !== 1 || matrix.b !== 0 || matrix.c !== 0 || matrix.d !== 1) {
        var a1 = this.a;
        var c1 = this.c;
        this.a = a1 * matrix.a + this.b * matrix.c;
        this.b = a1 * matrix.b + this.b * matrix.d;
        this.c = c1 * matrix.a + this.d * matrix.c;
        this.d = c1 * matrix.b + this.d * matrix.d;
      }
      this.tx = tx1 * matrix.a + this.ty * matrix.c + matrix.tx;
      this.ty = tx1 * matrix.b + this.ty * matrix.d + matrix.ty;
      return this;
    };
    Matrix2.prototype.decompose = function(transform) {
      var a = this.a;
      var b = this.b;
      var c = this.c;
      var d = this.d;
      var skewX = -Math.atan2(-c, d);
      var skewY = Math.atan2(b, a);
      var delta = Math.abs(skewX + skewY);
      if (delta < 1e-5 || Math.abs(PI_2 - delta) < 1e-5) {
        transform.rotation = skewY;
        transform.skew.x = transform.skew.y = 0;
      } else {
        transform.rotation = 0;
        transform.skew.x = skewX;
        transform.skew.y = skewY;
      }
      transform.scale.x = Math.sqrt(a * a + b * b);
      transform.scale.y = Math.sqrt(c * c + d * d);
      transform.position.x = this.tx;
      transform.position.y = this.ty;
      return transform;
    };
    Matrix2.prototype.invert = function() {
      var a1 = this.a;
      var b1 = this.b;
      var c1 = this.c;
      var d1 = this.d;
      var tx1 = this.tx;
      var n = a1 * d1 - b1 * c1;
      this.a = d1 / n;
      this.b = -b1 / n;
      this.c = -c1 / n;
      this.d = a1 / n;
      this.tx = (c1 * this.ty - d1 * tx1) / n;
      this.ty = -(a1 * this.ty - b1 * tx1) / n;
      return this;
    };
    Matrix2.prototype.identity = function() {
      this.a = 1;
      this.b = 0;
      this.c = 0;
      this.d = 1;
      this.tx = 0;
      this.ty = 0;
      return this;
    };
    Matrix2.prototype.clone = function() {
      var matrix = new Matrix2();
      matrix.a = this.a;
      matrix.b = this.b;
      matrix.c = this.c;
      matrix.d = this.d;
      matrix.tx = this.tx;
      matrix.ty = this.ty;
      return matrix;
    };
    Matrix2.prototype.copyTo = function(matrix) {
      matrix.a = this.a;
      matrix.b = this.b;
      matrix.c = this.c;
      matrix.d = this.d;
      matrix.tx = this.tx;
      matrix.ty = this.ty;
      return matrix;
    };
    Matrix2.prototype.copyFrom = function(matrix) {
      this.a = matrix.a;
      this.b = matrix.b;
      this.c = matrix.c;
      this.d = matrix.d;
      this.tx = matrix.tx;
      this.ty = matrix.ty;
      return this;
    };
    Object.defineProperty(Matrix2, "IDENTITY", {
      get: function() {
        return new Matrix2();
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Matrix2, "TEMP_MATRIX", {
      get: function() {
        return new Matrix2();
      },
      enumerable: false,
      configurable: true
    });
    return Matrix2;
  }();
  var ux = [1, 1, 0, -1, -1, -1, 0, 1, 1, 1, 0, -1, -1, -1, 0, 1];
  var uy = [0, 1, 1, 1, 0, -1, -1, -1, 0, 1, 1, 1, 0, -1, -1, -1];
  var vx = [0, -1, -1, -1, 0, 1, 1, 1, 0, 1, 1, 1, 0, -1, -1, -1];
  var vy = [1, 1, 0, -1, -1, -1, 0, 1, -1, -1, 0, 1, 1, 1, 0, -1];
  var rotationCayley = [];
  var rotationMatrices = [];
  var signum = Math.sign;
  function init() {
    for (var i = 0; i < 16; i++) {
      var row = [];
      rotationCayley.push(row);
      for (var j = 0; j < 16; j++) {
        var _ux = signum(ux[i] * ux[j] + vx[i] * uy[j]);
        var _uy = signum(uy[i] * ux[j] + vy[i] * uy[j]);
        var _vx = signum(ux[i] * vx[j] + vx[i] * vy[j]);
        var _vy = signum(uy[i] * vx[j] + vy[i] * vy[j]);
        for (var k = 0; k < 16; k++) {
          if (ux[k] === _ux && uy[k] === _uy && vx[k] === _vx && vy[k] === _vy) {
            row.push(k);
            break;
          }
        }
      }
    }
    for (var i = 0; i < 16; i++) {
      var mat = new Matrix();
      mat.set(ux[i], uy[i], vx[i], vy[i], 0, 0);
      rotationMatrices.push(mat);
    }
  }
  init();
  var groupD8 = {
    E: 0,
    SE: 1,
    S: 2,
    SW: 3,
    W: 4,
    NW: 5,
    N: 6,
    NE: 7,
    MIRROR_VERTICAL: 8,
    MAIN_DIAGONAL: 10,
    MIRROR_HORIZONTAL: 12,
    REVERSE_DIAGONAL: 14,
    uX: function(ind) {
      return ux[ind];
    },
    uY: function(ind) {
      return uy[ind];
    },
    vX: function(ind) {
      return vx[ind];
    },
    vY: function(ind) {
      return vy[ind];
    },
    inv: function(rotation) {
      if (rotation & 8) {
        return rotation & 15;
      }
      return -rotation & 7;
    },
    add: function(rotationSecond, rotationFirst) {
      return rotationCayley[rotationSecond][rotationFirst];
    },
    sub: function(rotationSecond, rotationFirst) {
      return rotationCayley[rotationSecond][groupD8.inv(rotationFirst)];
    },
    rotate180: function(rotation) {
      return rotation ^ 4;
    },
    isVertical: function(rotation) {
      return (rotation & 3) === 2;
    },
    byDirection: function(dx, dy) {
      if (Math.abs(dx) * 2 <= Math.abs(dy)) {
        if (dy >= 0) {
          return groupD8.S;
        }
        return groupD8.N;
      } else if (Math.abs(dy) * 2 <= Math.abs(dx)) {
        if (dx > 0) {
          return groupD8.E;
        }
        return groupD8.W;
      } else if (dy > 0) {
        if (dx > 0) {
          return groupD8.SE;
        }
        return groupD8.SW;
      } else if (dx > 0) {
        return groupD8.NE;
      }
      return groupD8.NW;
    },
    matrixAppendRotationInv: function(matrix, rotation, tx, ty) {
      if (tx === void 0) {
        tx = 0;
      }
      if (ty === void 0) {
        ty = 0;
      }
      var mat = rotationMatrices[groupD8.inv(rotation)];
      mat.tx = tx;
      mat.ty = ty;
      matrix.append(mat);
    }
  };
  var Transform = function() {
    function Transform2() {
      this.worldTransform = new Matrix();
      this.localTransform = new Matrix();
      this.position = new ObservablePoint(this.onChange, this, 0, 0);
      this.scale = new ObservablePoint(this.onChange, this, 1, 1);
      this.pivot = new ObservablePoint(this.onChange, this, 0, 0);
      this.skew = new ObservablePoint(this.updateSkew, this, 0, 0);
      this._rotation = 0;
      this._cx = 1;
      this._sx = 0;
      this._cy = 0;
      this._sy = 1;
      this._localID = 0;
      this._currentLocalID = 0;
      this._worldID = 0;
      this._parentID = 0;
    }
    Transform2.prototype.onChange = function() {
      this._localID++;
    };
    Transform2.prototype.updateSkew = function() {
      this._cx = Math.cos(this._rotation + this.skew.y);
      this._sx = Math.sin(this._rotation + this.skew.y);
      this._cy = -Math.sin(this._rotation - this.skew.x);
      this._sy = Math.cos(this._rotation - this.skew.x);
      this._localID++;
    };
    Transform2.prototype.updateLocalTransform = function() {
      var lt = this.localTransform;
      if (this._localID !== this._currentLocalID) {
        lt.a = this._cx * this.scale.x;
        lt.b = this._sx * this.scale.x;
        lt.c = this._cy * this.scale.y;
        lt.d = this._sy * this.scale.y;
        lt.tx = this.position.x - (this.pivot.x * lt.a + this.pivot.y * lt.c);
        lt.ty = this.position.y - (this.pivot.x * lt.b + this.pivot.y * lt.d);
        this._currentLocalID = this._localID;
        this._parentID = -1;
      }
    };
    Transform2.prototype.updateTransform = function(parentTransform) {
      var lt = this.localTransform;
      if (this._localID !== this._currentLocalID) {
        lt.a = this._cx * this.scale.x;
        lt.b = this._sx * this.scale.x;
        lt.c = this._cy * this.scale.y;
        lt.d = this._sy * this.scale.y;
        lt.tx = this.position.x - (this.pivot.x * lt.a + this.pivot.y * lt.c);
        lt.ty = this.position.y - (this.pivot.x * lt.b + this.pivot.y * lt.d);
        this._currentLocalID = this._localID;
        this._parentID = -1;
      }
      if (this._parentID !== parentTransform._worldID) {
        var pt = parentTransform.worldTransform;
        var wt = this.worldTransform;
        wt.a = lt.a * pt.a + lt.b * pt.c;
        wt.b = lt.a * pt.b + lt.b * pt.d;
        wt.c = lt.c * pt.a + lt.d * pt.c;
        wt.d = lt.c * pt.b + lt.d * pt.d;
        wt.tx = lt.tx * pt.a + lt.ty * pt.c + pt.tx;
        wt.ty = lt.tx * pt.b + lt.ty * pt.d + pt.ty;
        this._parentID = parentTransform._worldID;
        this._worldID++;
      }
    };
    Transform2.prototype.setFromMatrix = function(matrix) {
      matrix.decompose(this);
      this._localID++;
    };
    Object.defineProperty(Transform2.prototype, "rotation", {
      get: function() {
        return this._rotation;
      },
      set: function(value) {
        if (this._rotation !== value) {
          this._rotation = value;
          this.updateSkew();
        }
      },
      enumerable: false,
      configurable: true
    });
    Transform2.IDENTITY = new Transform2();
    return Transform2;
  }();

  // node_modules/@pixi/display/lib/display.es.js
  /*!
   * @pixi/display - v5.3.3
   * Compiled Tue, 04 Aug 2020 16:23:09 UTC
   *
   * @pixi/display is licensed under the MIT License.
   * http://www.opensource.org/licenses/mit-license
   */
  settings.SORTABLE_CHILDREN = false;
  var Bounds = function() {
    function Bounds2() {
      this.minX = Infinity;
      this.minY = Infinity;
      this.maxX = -Infinity;
      this.maxY = -Infinity;
      this.rect = null;
      this.updateID = -1;
    }
    Bounds2.prototype.isEmpty = function() {
      return this.minX > this.maxX || this.minY > this.maxY;
    };
    Bounds2.prototype.clear = function() {
      this.minX = Infinity;
      this.minY = Infinity;
      this.maxX = -Infinity;
      this.maxY = -Infinity;
    };
    Bounds2.prototype.getRectangle = function(rect) {
      if (this.minX > this.maxX || this.minY > this.maxY) {
        return Rectangle.EMPTY;
      }
      rect = rect || new Rectangle(0, 0, 1, 1);
      rect.x = this.minX;
      rect.y = this.minY;
      rect.width = this.maxX - this.minX;
      rect.height = this.maxY - this.minY;
      return rect;
    };
    Bounds2.prototype.addPoint = function(point) {
      this.minX = Math.min(this.minX, point.x);
      this.maxX = Math.max(this.maxX, point.x);
      this.minY = Math.min(this.minY, point.y);
      this.maxY = Math.max(this.maxY, point.y);
    };
    Bounds2.prototype.addQuad = function(vertices) {
      var minX = this.minX;
      var minY = this.minY;
      var maxX = this.maxX;
      var maxY = this.maxY;
      var x = vertices[0];
      var y = vertices[1];
      minX = x < minX ? x : minX;
      minY = y < minY ? y : minY;
      maxX = x > maxX ? x : maxX;
      maxY = y > maxY ? y : maxY;
      x = vertices[2];
      y = vertices[3];
      minX = x < minX ? x : minX;
      minY = y < minY ? y : minY;
      maxX = x > maxX ? x : maxX;
      maxY = y > maxY ? y : maxY;
      x = vertices[4];
      y = vertices[5];
      minX = x < minX ? x : minX;
      minY = y < minY ? y : minY;
      maxX = x > maxX ? x : maxX;
      maxY = y > maxY ? y : maxY;
      x = vertices[6];
      y = vertices[7];
      minX = x < minX ? x : minX;
      minY = y < minY ? y : minY;
      maxX = x > maxX ? x : maxX;
      maxY = y > maxY ? y : maxY;
      this.minX = minX;
      this.minY = minY;
      this.maxX = maxX;
      this.maxY = maxY;
    };
    Bounds2.prototype.addFrame = function(transform, x0, y0, x1, y1) {
      this.addFrameMatrix(transform.worldTransform, x0, y0, x1, y1);
    };
    Bounds2.prototype.addFrameMatrix = function(matrix, x0, y0, x1, y1) {
      var a = matrix.a;
      var b = matrix.b;
      var c = matrix.c;
      var d = matrix.d;
      var tx = matrix.tx;
      var ty = matrix.ty;
      var minX = this.minX;
      var minY = this.minY;
      var maxX = this.maxX;
      var maxY = this.maxY;
      var x = a * x0 + c * y0 + tx;
      var y = b * x0 + d * y0 + ty;
      minX = x < minX ? x : minX;
      minY = y < minY ? y : minY;
      maxX = x > maxX ? x : maxX;
      maxY = y > maxY ? y : maxY;
      x = a * x1 + c * y0 + tx;
      y = b * x1 + d * y0 + ty;
      minX = x < minX ? x : minX;
      minY = y < minY ? y : minY;
      maxX = x > maxX ? x : maxX;
      maxY = y > maxY ? y : maxY;
      x = a * x0 + c * y1 + tx;
      y = b * x0 + d * y1 + ty;
      minX = x < minX ? x : minX;
      minY = y < minY ? y : minY;
      maxX = x > maxX ? x : maxX;
      maxY = y > maxY ? y : maxY;
      x = a * x1 + c * y1 + tx;
      y = b * x1 + d * y1 + ty;
      minX = x < minX ? x : minX;
      minY = y < minY ? y : minY;
      maxX = x > maxX ? x : maxX;
      maxY = y > maxY ? y : maxY;
      this.minX = minX;
      this.minY = minY;
      this.maxX = maxX;
      this.maxY = maxY;
    };
    Bounds2.prototype.addVertexData = function(vertexData, beginOffset, endOffset) {
      var minX = this.minX;
      var minY = this.minY;
      var maxX = this.maxX;
      var maxY = this.maxY;
      for (var i = beginOffset; i < endOffset; i += 2) {
        var x = vertexData[i];
        var y = vertexData[i + 1];
        minX = x < minX ? x : minX;
        minY = y < minY ? y : minY;
        maxX = x > maxX ? x : maxX;
        maxY = y > maxY ? y : maxY;
      }
      this.minX = minX;
      this.minY = minY;
      this.maxX = maxX;
      this.maxY = maxY;
    };
    Bounds2.prototype.addVertices = function(transform, vertices, beginOffset, endOffset) {
      this.addVerticesMatrix(transform.worldTransform, vertices, beginOffset, endOffset);
    };
    Bounds2.prototype.addVerticesMatrix = function(matrix, vertices, beginOffset, endOffset, padX, padY) {
      if (padX === void 0) {
        padX = 0;
      }
      if (padY === void 0) {
        padY = padX;
      }
      var a = matrix.a;
      var b = matrix.b;
      var c = matrix.c;
      var d = matrix.d;
      var tx = matrix.tx;
      var ty = matrix.ty;
      var minX = this.minX;
      var minY = this.minY;
      var maxX = this.maxX;
      var maxY = this.maxY;
      for (var i = beginOffset; i < endOffset; i += 2) {
        var rawX = vertices[i];
        var rawY = vertices[i + 1];
        var x = a * rawX + c * rawY + tx;
        var y = d * rawY + b * rawX + ty;
        minX = Math.min(minX, x - padX);
        maxX = Math.max(maxX, x + padX);
        minY = Math.min(minY, y - padY);
        maxY = Math.max(maxY, y + padY);
      }
      this.minX = minX;
      this.minY = minY;
      this.maxX = maxX;
      this.maxY = maxY;
    };
    Bounds2.prototype.addBounds = function(bounds) {
      var minX = this.minX;
      var minY = this.minY;
      var maxX = this.maxX;
      var maxY = this.maxY;
      this.minX = bounds.minX < minX ? bounds.minX : minX;
      this.minY = bounds.minY < minY ? bounds.minY : minY;
      this.maxX = bounds.maxX > maxX ? bounds.maxX : maxX;
      this.maxY = bounds.maxY > maxY ? bounds.maxY : maxY;
    };
    Bounds2.prototype.addBoundsMask = function(bounds, mask) {
      var _minX = bounds.minX > mask.minX ? bounds.minX : mask.minX;
      var _minY = bounds.minY > mask.minY ? bounds.minY : mask.minY;
      var _maxX = bounds.maxX < mask.maxX ? bounds.maxX : mask.maxX;
      var _maxY = bounds.maxY < mask.maxY ? bounds.maxY : mask.maxY;
      if (_minX <= _maxX && _minY <= _maxY) {
        var minX = this.minX;
        var minY = this.minY;
        var maxX = this.maxX;
        var maxY = this.maxY;
        this.minX = _minX < minX ? _minX : minX;
        this.minY = _minY < minY ? _minY : minY;
        this.maxX = _maxX > maxX ? _maxX : maxX;
        this.maxY = _maxY > maxY ? _maxY : maxY;
      }
    };
    Bounds2.prototype.addBoundsMatrix = function(bounds, matrix) {
      this.addFrameMatrix(matrix, bounds.minX, bounds.minY, bounds.maxX, bounds.maxY);
    };
    Bounds2.prototype.addBoundsArea = function(bounds, area) {
      var _minX = bounds.minX > area.x ? bounds.minX : area.x;
      var _minY = bounds.minY > area.y ? bounds.minY : area.y;
      var _maxX = bounds.maxX < area.x + area.width ? bounds.maxX : area.x + area.width;
      var _maxY = bounds.maxY < area.y + area.height ? bounds.maxY : area.y + area.height;
      if (_minX <= _maxX && _minY <= _maxY) {
        var minX = this.minX;
        var minY = this.minY;
        var maxX = this.maxX;
        var maxY = this.maxY;
        this.minX = _minX < minX ? _minX : minX;
        this.minY = _minY < minY ? _minY : minY;
        this.maxX = _maxX > maxX ? _maxX : maxX;
        this.maxY = _maxY > maxY ? _maxY : maxY;
      }
    };
    Bounds2.prototype.pad = function(paddingX, paddingY) {
      if (paddingX === void 0) {
        paddingX = 0;
      }
      if (paddingY === void 0) {
        paddingY = paddingX;
      }
      if (!this.isEmpty()) {
        this.minX -= paddingX;
        this.maxX += paddingX;
        this.minY -= paddingY;
        this.maxY += paddingY;
      }
    };
    Bounds2.prototype.addFramePad = function(x0, y0, x1, y1, padX, padY) {
      x0 -= padX;
      y0 -= padY;
      x1 += padX;
      y1 += padY;
      this.minX = this.minX < x0 ? this.minX : x0;
      this.maxX = this.maxX > x1 ? this.maxX : x1;
      this.minY = this.minY < y0 ? this.minY : y0;
      this.maxY = this.maxY > y1 ? this.maxY : y1;
    };
    return Bounds2;
  }();
  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation. All rights reserved.
  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at http://www.apache.org/licenses/LICENSE-2.0
  
  THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
  WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
  MERCHANTABLITY OR NON-INFRINGEMENT.
  
  See the Apache Version 2.0 License for specific language governing permissions
  and limitations under the License.
  ***************************************************************************** */
  var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf || {__proto__: []} instanceof Array && function(d2, b2) {
      d2.__proto__ = b2;
    } || function(d2, b2) {
      for (var p in b2) {
        if (b2.hasOwnProperty(p)) {
          d2[p] = b2[p];
        }
      }
    };
    return extendStatics(d, b);
  };
  function __extends(d, b) {
    extendStatics(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  }
  var DisplayObject = function(_super) {
    __extends(DisplayObject2, _super);
    function DisplayObject2() {
      var _this = _super.call(this) || this;
      _this.tempDisplayObjectParent = null;
      _this.transform = new Transform();
      _this.alpha = 1;
      _this.visible = true;
      _this.renderable = true;
      _this.parent = null;
      _this.worldAlpha = 1;
      _this._lastSortedIndex = 0;
      _this._zIndex = 0;
      _this.filterArea = null;
      _this.filters = null;
      _this._enabledFilters = null;
      _this._bounds = new Bounds();
      _this._localBounds = null;
      _this._boundsID = 0;
      _this._boundsRect = null;
      _this._localBoundsRect = null;
      _this._mask = null;
      _this._destroyed = false;
      _this.isSprite = false;
      _this.isMask = false;
      return _this;
    }
    DisplayObject2.mixin = function(source) {
      var keys = Object.keys(source);
      for (var i = 0; i < keys.length; ++i) {
        var propertyName = keys[i];
        Object.defineProperty(DisplayObject2.prototype, propertyName, Object.getOwnPropertyDescriptor(source, propertyName));
      }
    };
    DisplayObject2.prototype._recursivePostUpdateTransform = function() {
      if (this.parent) {
        this.parent._recursivePostUpdateTransform();
        this.transform.updateTransform(this.parent.transform);
      } else {
        this.transform.updateTransform(this._tempDisplayObjectParent.transform);
      }
    };
    DisplayObject2.prototype.updateTransform = function() {
      this._boundsID++;
      this.transform.updateTransform(this.parent.transform);
      this.worldAlpha = this.alpha * this.parent.worldAlpha;
    };
    DisplayObject2.prototype.getBounds = function(skipUpdate, rect) {
      if (!skipUpdate) {
        if (!this.parent) {
          this.parent = this._tempDisplayObjectParent;
          this.updateTransform();
          this.parent = null;
        } else {
          this._recursivePostUpdateTransform();
          this.updateTransform();
        }
      }
      if (this._bounds.updateID !== this._boundsID) {
        this.calculateBounds();
        this._bounds.updateID = this._boundsID;
      }
      if (!rect) {
        if (!this._boundsRect) {
          this._boundsRect = new Rectangle();
        }
        rect = this._boundsRect;
      }
      return this._bounds.getRectangle(rect);
    };
    DisplayObject2.prototype.getLocalBounds = function(rect) {
      if (!rect) {
        if (!this._localBoundsRect) {
          this._localBoundsRect = new Rectangle();
        }
        rect = this._localBoundsRect;
      }
      if (!this._localBounds) {
        this._localBounds = new Bounds();
      }
      var transformRef = this.transform;
      var parentRef = this.parent;
      this.parent = null;
      this.transform = this._tempDisplayObjectParent.transform;
      var worldBounds = this._bounds;
      var worldBoundsID = this._boundsID;
      this._bounds = this._localBounds;
      var bounds = this.getBounds(false, rect);
      this.parent = parentRef;
      this.transform = transformRef;
      this._bounds = worldBounds;
      this._bounds.updateID += this._boundsID - worldBoundsID;
      return bounds;
    };
    DisplayObject2.prototype.toGlobal = function(position, point, skipUpdate) {
      if (skipUpdate === void 0) {
        skipUpdate = false;
      }
      if (!skipUpdate) {
        this._recursivePostUpdateTransform();
        if (!this.parent) {
          this.parent = this._tempDisplayObjectParent;
          this.displayObjectUpdateTransform();
          this.parent = null;
        } else {
          this.displayObjectUpdateTransform();
        }
      }
      return this.worldTransform.apply(position, point);
    };
    DisplayObject2.prototype.toLocal = function(position, from, point, skipUpdate) {
      if (from) {
        position = from.toGlobal(position, point, skipUpdate);
      }
      if (!skipUpdate) {
        this._recursivePostUpdateTransform();
        if (!this.parent) {
          this.parent = this._tempDisplayObjectParent;
          this.displayObjectUpdateTransform();
          this.parent = null;
        } else {
          this.displayObjectUpdateTransform();
        }
      }
      return this.worldTransform.applyInverse(position, point);
    };
    DisplayObject2.prototype.setParent = function(container) {
      if (!container || !container.addChild) {
        throw new Error("setParent: Argument must be a Container");
      }
      container.addChild(this);
      return container;
    };
    DisplayObject2.prototype.setTransform = function(x, y, scaleX, scaleY, rotation, skewX, skewY, pivotX, pivotY) {
      if (x === void 0) {
        x = 0;
      }
      if (y === void 0) {
        y = 0;
      }
      if (scaleX === void 0) {
        scaleX = 1;
      }
      if (scaleY === void 0) {
        scaleY = 1;
      }
      if (rotation === void 0) {
        rotation = 0;
      }
      if (skewX === void 0) {
        skewX = 0;
      }
      if (skewY === void 0) {
        skewY = 0;
      }
      if (pivotX === void 0) {
        pivotX = 0;
      }
      if (pivotY === void 0) {
        pivotY = 0;
      }
      this.position.x = x;
      this.position.y = y;
      this.scale.x = !scaleX ? 1 : scaleX;
      this.scale.y = !scaleY ? 1 : scaleY;
      this.rotation = rotation;
      this.skew.x = skewX;
      this.skew.y = skewY;
      this.pivot.x = pivotX;
      this.pivot.y = pivotY;
      return this;
    };
    DisplayObject2.prototype.destroy = function(_options) {
      if (this.parent) {
        this.parent.removeChild(this);
      }
      this.removeAllListeners();
      this.transform = null;
      this.parent = null;
      this._bounds = null;
      this._mask = null;
      this.filters = null;
      this.filterArea = null;
      this.hitArea = null;
      this.interactive = false;
      this.interactiveChildren = false;
      this._destroyed = true;
    };
    Object.defineProperty(DisplayObject2.prototype, "_tempDisplayObjectParent", {
      get: function() {
        if (this.tempDisplayObjectParent === null) {
          this.tempDisplayObjectParent = new TemporaryDisplayObject();
        }
        return this.tempDisplayObjectParent;
      },
      enumerable: false,
      configurable: true
    });
    DisplayObject2.prototype.enableTempParent = function() {
      var myParent = this.parent;
      this.parent = this._tempDisplayObjectParent;
      return myParent;
    };
    DisplayObject2.prototype.disableTempParent = function(cacheParent) {
      this.parent = cacheParent;
    };
    Object.defineProperty(DisplayObject2.prototype, "x", {
      get: function() {
        return this.position.x;
      },
      set: function(value) {
        this.transform.position.x = value;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(DisplayObject2.prototype, "y", {
      get: function() {
        return this.position.y;
      },
      set: function(value) {
        this.transform.position.y = value;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(DisplayObject2.prototype, "worldTransform", {
      get: function() {
        return this.transform.worldTransform;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(DisplayObject2.prototype, "localTransform", {
      get: function() {
        return this.transform.localTransform;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(DisplayObject2.prototype, "position", {
      get: function() {
        return this.transform.position;
      },
      set: function(value) {
        this.transform.position.copyFrom(value);
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(DisplayObject2.prototype, "scale", {
      get: function() {
        return this.transform.scale;
      },
      set: function(value) {
        this.transform.scale.copyFrom(value);
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(DisplayObject2.prototype, "pivot", {
      get: function() {
        return this.transform.pivot;
      },
      set: function(value) {
        this.transform.pivot.copyFrom(value);
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(DisplayObject2.prototype, "skew", {
      get: function() {
        return this.transform.skew;
      },
      set: function(value) {
        this.transform.skew.copyFrom(value);
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(DisplayObject2.prototype, "rotation", {
      get: function() {
        return this.transform.rotation;
      },
      set: function(value) {
        this.transform.rotation = value;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(DisplayObject2.prototype, "angle", {
      get: function() {
        return this.transform.rotation * RAD_TO_DEG;
      },
      set: function(value) {
        this.transform.rotation = value * DEG_TO_RAD;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(DisplayObject2.prototype, "zIndex", {
      get: function() {
        return this._zIndex;
      },
      set: function(value) {
        this._zIndex = value;
        if (this.parent) {
          this.parent.sortDirty = true;
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(DisplayObject2.prototype, "worldVisible", {
      get: function() {
        var item = this;
        do {
          if (!item.visible) {
            return false;
          }
          item = item.parent;
        } while (item);
        return true;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(DisplayObject2.prototype, "mask", {
      get: function() {
        return this._mask;
      },
      set: function(value) {
        if (this._mask) {
          var maskObject = this._mask.maskObject || this._mask;
          maskObject.renderable = true;
          maskObject.isMask = false;
        }
        this._mask = value;
        if (this._mask) {
          var maskObject = this._mask.maskObject || this._mask;
          maskObject.renderable = false;
          maskObject.isMask = true;
        }
      },
      enumerable: false,
      configurable: true
    });
    return DisplayObject2;
  }(eventemitter3.default);
  var TemporaryDisplayObject = function(_super) {
    __extends(TemporaryDisplayObject2, _super);
    function TemporaryDisplayObject2() {
      var _this = _super !== null && _super.apply(this, arguments) || this;
      _this.sortDirty = null;
      return _this;
    }
    return TemporaryDisplayObject2;
  }(DisplayObject);
  DisplayObject.prototype.displayObjectUpdateTransform = DisplayObject.prototype.updateTransform;
  function sortChildren(a, b) {
    if (a.zIndex === b.zIndex) {
      return a._lastSortedIndex - b._lastSortedIndex;
    }
    return a.zIndex - b.zIndex;
  }
  var Container = function(_super) {
    __extends(Container2, _super);
    function Container2() {
      var _this = _super.call(this) || this;
      _this.children = [];
      _this.sortableChildren = settings.SORTABLE_CHILDREN;
      _this.sortDirty = false;
      return _this;
    }
    Container2.prototype.onChildrenChange = function(_length) {
    };
    Container2.prototype.addChild = function() {
      var arguments$1 = arguments;
      var children = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        children[_i] = arguments$1[_i];
      }
      if (children.length > 1) {
        for (var i = 0; i < children.length; i++) {
          this.addChild(children[i]);
        }
      } else {
        var child = children[0];
        if (child.parent) {
          child.parent.removeChild(child);
        }
        child.parent = this;
        this.sortDirty = true;
        child.transform._parentID = -1;
        this.children.push(child);
        this._boundsID++;
        this.onChildrenChange(this.children.length - 1);
        this.emit("childAdded", child, this, this.children.length - 1);
        child.emit("added", this);
      }
      return children[0];
    };
    Container2.prototype.addChildAt = function(child, index2) {
      if (index2 < 0 || index2 > this.children.length) {
        throw new Error(child + "addChildAt: The index " + index2 + " supplied is out of bounds " + this.children.length);
      }
      if (child.parent) {
        child.parent.removeChild(child);
      }
      child.parent = this;
      this.sortDirty = true;
      child.transform._parentID = -1;
      this.children.splice(index2, 0, child);
      this._boundsID++;
      this.onChildrenChange(index2);
      child.emit("added", this);
      this.emit("childAdded", child, this, index2);
      return child;
    };
    Container2.prototype.swapChildren = function(child, child2) {
      if (child === child2) {
        return;
      }
      var index1 = this.getChildIndex(child);
      var index2 = this.getChildIndex(child2);
      this.children[index1] = child2;
      this.children[index2] = child;
      this.onChildrenChange(index1 < index2 ? index1 : index2);
    };
    Container2.prototype.getChildIndex = function(child) {
      var index2 = this.children.indexOf(child);
      if (index2 === -1) {
        throw new Error("The supplied DisplayObject must be a child of the caller");
      }
      return index2;
    };
    Container2.prototype.setChildIndex = function(child, index2) {
      if (index2 < 0 || index2 >= this.children.length) {
        throw new Error("The index " + index2 + " supplied is out of bounds " + this.children.length);
      }
      var currentIndex = this.getChildIndex(child);
      removeItems(this.children, currentIndex, 1);
      this.children.splice(index2, 0, child);
      this.onChildrenChange(index2);
    };
    Container2.prototype.getChildAt = function(index2) {
      if (index2 < 0 || index2 >= this.children.length) {
        throw new Error("getChildAt: Index (" + index2 + ") does not exist.");
      }
      return this.children[index2];
    };
    Container2.prototype.removeChild = function() {
      var arguments$1 = arguments;
      var children = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        children[_i] = arguments$1[_i];
      }
      if (children.length > 1) {
        for (var i = 0; i < children.length; i++) {
          this.removeChild(children[i]);
        }
      } else {
        var child = children[0];
        var index2 = this.children.indexOf(child);
        if (index2 === -1) {
          return null;
        }
        child.parent = null;
        child.transform._parentID = -1;
        removeItems(this.children, index2, 1);
        this._boundsID++;
        this.onChildrenChange(index2);
        child.emit("removed", this);
        this.emit("childRemoved", child, this, index2);
      }
      return children[0];
    };
    Container2.prototype.removeChildAt = function(index2) {
      var child = this.getChildAt(index2);
      child.parent = null;
      child.transform._parentID = -1;
      removeItems(this.children, index2, 1);
      this._boundsID++;
      this.onChildrenChange(index2);
      child.emit("removed", this);
      this.emit("childRemoved", child, this, index2);
      return child;
    };
    Container2.prototype.removeChildren = function(beginIndex, endIndex) {
      if (beginIndex === void 0) {
        beginIndex = 0;
      }
      if (endIndex === void 0) {
        endIndex = this.children.length;
      }
      var begin = beginIndex;
      var end = endIndex;
      var range = end - begin;
      var removed;
      if (range > 0 && range <= end) {
        removed = this.children.splice(begin, range);
        for (var i = 0; i < removed.length; ++i) {
          removed[i].parent = null;
          if (removed[i].transform) {
            removed[i].transform._parentID = -1;
          }
        }
        this._boundsID++;
        this.onChildrenChange(beginIndex);
        for (var i = 0; i < removed.length; ++i) {
          removed[i].emit("removed", this);
          this.emit("childRemoved", removed[i], this, i);
        }
        return removed;
      } else if (range === 0 && this.children.length === 0) {
        return [];
      }
      throw new RangeError("removeChildren: numeric values are outside the acceptable range.");
    };
    Container2.prototype.sortChildren = function() {
      var sortRequired = false;
      for (var i = 0, j = this.children.length; i < j; ++i) {
        var child = this.children[i];
        child._lastSortedIndex = i;
        if (!sortRequired && child.zIndex !== 0) {
          sortRequired = true;
        }
      }
      if (sortRequired && this.children.length > 1) {
        this.children.sort(sortChildren);
      }
      this.sortDirty = false;
    };
    Container2.prototype.updateTransform = function() {
      if (this.sortableChildren && this.sortDirty) {
        this.sortChildren();
      }
      this._boundsID++;
      this.transform.updateTransform(this.parent.transform);
      this.worldAlpha = this.alpha * this.parent.worldAlpha;
      for (var i = 0, j = this.children.length; i < j; ++i) {
        var child = this.children[i];
        if (child.visible) {
          child.updateTransform();
        }
      }
    };
    Container2.prototype.calculateBounds = function() {
      this._bounds.clear();
      this._calculateBounds();
      for (var i = 0; i < this.children.length; i++) {
        var child = this.children[i];
        if (!child.visible || !child.renderable) {
          continue;
        }
        child.calculateBounds();
        if (child._mask) {
          var maskObject = child._mask.maskObject || child._mask;
          maskObject.calculateBounds();
          this._bounds.addBoundsMask(child._bounds, maskObject._bounds);
        } else if (child.filterArea) {
          this._bounds.addBoundsArea(child._bounds, child.filterArea);
        } else {
          this._bounds.addBounds(child._bounds);
        }
      }
      this._bounds.updateID = this._boundsID;
    };
    Container2.prototype.getLocalBounds = function(rect, skipChildrenUpdate) {
      if (skipChildrenUpdate === void 0) {
        skipChildrenUpdate = false;
      }
      var result = _super.prototype.getLocalBounds.call(this, rect);
      if (!skipChildrenUpdate) {
        for (var i = 0, j = this.children.length; i < j; ++i) {
          var child = this.children[i];
          if (child.visible) {
            child.updateTransform();
          }
        }
      }
      return result;
    };
    Container2.prototype._calculateBounds = function() {
    };
    Container2.prototype.render = function(renderer) {
      if (!this.visible || this.worldAlpha <= 0 || !this.renderable) {
        return;
      }
      if (this._mask || this.filters && this.filters.length) {
        this.renderAdvanced(renderer);
      } else {
        this._render(renderer);
        for (var i = 0, j = this.children.length; i < j; ++i) {
          this.children[i].render(renderer);
        }
      }
    };
    Container2.prototype.renderAdvanced = function(renderer) {
      renderer.batch.flush();
      var filters2 = this.filters;
      var mask = this._mask;
      if (filters2) {
        if (!this._enabledFilters) {
          this._enabledFilters = [];
        }
        this._enabledFilters.length = 0;
        for (var i = 0; i < filters2.length; i++) {
          if (filters2[i].enabled) {
            this._enabledFilters.push(filters2[i]);
          }
        }
        if (this._enabledFilters.length) {
          renderer.filter.push(this, this._enabledFilters);
        }
      }
      if (mask) {
        renderer.mask.push(this, this._mask);
      }
      this._render(renderer);
      for (var i = 0, j = this.children.length; i < j; i++) {
        this.children[i].render(renderer);
      }
      renderer.batch.flush();
      if (mask) {
        renderer.mask.pop(this);
      }
      if (filters2 && this._enabledFilters && this._enabledFilters.length) {
        renderer.filter.pop();
      }
    };
    Container2.prototype._render = function(_renderer) {
    };
    Container2.prototype.destroy = function(options) {
      _super.prototype.destroy.call(this);
      this.sortDirty = false;
      var destroyChildren = typeof options === "boolean" ? options : options && options.children;
      var oldChildren = this.removeChildren(0, this.children.length);
      if (destroyChildren) {
        for (var i = 0; i < oldChildren.length; ++i) {
          oldChildren[i].destroy(options);
        }
      }
    };
    Object.defineProperty(Container2.prototype, "width", {
      get: function() {
        return this.scale.x * this.getLocalBounds().width;
      },
      set: function(value) {
        var width = this.getLocalBounds().width;
        if (width !== 0) {
          this.scale.x = value / width;
        } else {
          this.scale.x = 1;
        }
        this._width = value;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Container2.prototype, "height", {
      get: function() {
        return this.scale.y * this.getLocalBounds().height;
      },
      set: function(value) {
        var height = this.getLocalBounds().height;
        if (height !== 0) {
          this.scale.y = value / height;
        } else {
          this.scale.y = 1;
        }
        this._height = value;
      },
      enumerable: false,
      configurable: true
    });
    return Container2;
  }(DisplayObject);
  Container.prototype.containerUpdateTransform = Container.prototype.updateTransform;

  // node_modules/@pixi/accessibility/lib/accessibility.es.js
  /*!
   * @pixi/accessibility - v5.3.3
   * Compiled Tue, 04 Aug 2020 16:23:09 UTC
   *
   * @pixi/accessibility is licensed under the MIT License.
   * http://www.opensource.org/licenses/mit-license
   */
  var accessibleTarget = {
    accessible: false,
    accessibleTitle: null,
    accessibleHint: null,
    tabIndex: 0,
    _accessibleActive: false,
    _accessibleDiv: null,
    accessibleType: "button",
    accessiblePointerEvents: "auto",
    accessibleChildren: true,
    renderId: -1
  };
  DisplayObject.mixin(accessibleTarget);
  var KEY_CODE_TAB = 9;
  var DIV_TOUCH_SIZE = 100;
  var DIV_TOUCH_POS_X = 0;
  var DIV_TOUCH_POS_Y = 0;
  var DIV_TOUCH_ZINDEX = 2;
  var DIV_HOOK_SIZE = 1;
  var DIV_HOOK_POS_X = -1e3;
  var DIV_HOOK_POS_Y = -1e3;
  var DIV_HOOK_ZINDEX = 2;
  var AccessibilityManager = function() {
    function AccessibilityManager2(renderer) {
      this._hookDiv = null;
      if (isMobile3.tablet || isMobile3.phone) {
        this.createTouchHook();
      }
      var div = document.createElement("div");
      div.style.width = DIV_TOUCH_SIZE + "px";
      div.style.height = DIV_TOUCH_SIZE + "px";
      div.style.position = "absolute";
      div.style.top = DIV_TOUCH_POS_X + "px";
      div.style.left = DIV_TOUCH_POS_Y + "px";
      div.style.zIndex = DIV_TOUCH_ZINDEX.toString();
      this.div = div;
      this.pool = [];
      this.renderId = 0;
      this.debug = false;
      this.renderer = renderer;
      this.children = [];
      this._onKeyDown = this._onKeyDown.bind(this);
      this._onMouseMove = this._onMouseMove.bind(this);
      this._isActive = false;
      this._isMobileAccessibility = false;
      this.androidUpdateCount = 0;
      this.androidUpdateFrequency = 500;
      window.addEventListener("keydown", this._onKeyDown, false);
    }
    Object.defineProperty(AccessibilityManager2.prototype, "isActive", {
      get: function() {
        return this._isActive;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(AccessibilityManager2.prototype, "isMobileAccessibility", {
      get: function() {
        return this._isMobileAccessibility;
      },
      enumerable: false,
      configurable: true
    });
    AccessibilityManager2.prototype.createTouchHook = function() {
      var _this = this;
      var hookDiv = document.createElement("button");
      hookDiv.style.width = DIV_HOOK_SIZE + "px";
      hookDiv.style.height = DIV_HOOK_SIZE + "px";
      hookDiv.style.position = "absolute";
      hookDiv.style.top = DIV_HOOK_POS_X + "px";
      hookDiv.style.left = DIV_HOOK_POS_Y + "px";
      hookDiv.style.zIndex = DIV_HOOK_ZINDEX.toString();
      hookDiv.style.backgroundColor = "#FF0000";
      hookDiv.title = "select to enable accessability for this content";
      hookDiv.addEventListener("focus", function() {
        _this._isMobileAccessibility = true;
        _this.activate();
        _this.destroyTouchHook();
      });
      document.body.appendChild(hookDiv);
      this._hookDiv = hookDiv;
    };
    AccessibilityManager2.prototype.destroyTouchHook = function() {
      if (!this._hookDiv) {
        return;
      }
      document.body.removeChild(this._hookDiv);
      this._hookDiv = null;
    };
    AccessibilityManager2.prototype.activate = function() {
      if (this._isActive) {
        return;
      }
      this._isActive = true;
      window.document.addEventListener("mousemove", this._onMouseMove, true);
      window.removeEventListener("keydown", this._onKeyDown, false);
      this.renderer.on("postrender", this.update, this);
      if (this.renderer.view.parentNode) {
        this.renderer.view.parentNode.appendChild(this.div);
      }
    };
    AccessibilityManager2.prototype.deactivate = function() {
      if (!this._isActive || this._isMobileAccessibility) {
        return;
      }
      this._isActive = false;
      window.document.removeEventListener("mousemove", this._onMouseMove, true);
      window.addEventListener("keydown", this._onKeyDown, false);
      this.renderer.off("postrender", this.update);
      if (this.div.parentNode) {
        this.div.parentNode.removeChild(this.div);
      }
    };
    AccessibilityManager2.prototype.updateAccessibleObjects = function(displayObject) {
      if (!displayObject.visible || !displayObject.accessibleChildren) {
        return;
      }
      if (displayObject.accessible && displayObject.interactive) {
        if (!displayObject._accessibleActive) {
          this.addChild(displayObject);
        }
        displayObject.renderId = this.renderId;
      }
      var children = displayObject.children;
      for (var i = 0; i < children.length; i++) {
        this.updateAccessibleObjects(children[i]);
      }
    };
    AccessibilityManager2.prototype.update = function() {
      var now = performance.now();
      if (isMobile3.android.device && now < this.androidUpdateCount) {
        return;
      }
      this.androidUpdateCount = now + this.androidUpdateFrequency;
      if (!this.renderer.renderingToScreen) {
        return;
      }
      if (this.renderer._lastObjectRendered) {
        this.updateAccessibleObjects(this.renderer._lastObjectRendered);
      }
      var rect = this.renderer.view.getBoundingClientRect();
      var resolution = this.renderer.resolution;
      var sx = rect.width / this.renderer.width * resolution;
      var sy = rect.height / this.renderer.height * resolution;
      var div = this.div;
      div.style.left = rect.left + "px";
      div.style.top = rect.top + "px";
      div.style.width = this.renderer.width + "px";
      div.style.height = this.renderer.height + "px";
      for (var i = 0; i < this.children.length; i++) {
        var child = this.children[i];
        if (child.renderId !== this.renderId) {
          child._accessibleActive = false;
          removeItems(this.children, i, 1);
          this.div.removeChild(child._accessibleDiv);
          this.pool.push(child._accessibleDiv);
          child._accessibleDiv = null;
          i--;
        } else {
          div = child._accessibleDiv;
          var hitArea = child.hitArea;
          var wt = child.worldTransform;
          if (child.hitArea) {
            div.style.left = (wt.tx + hitArea.x * wt.a) * sx + "px";
            div.style.top = (wt.ty + hitArea.y * wt.d) * sy + "px";
            div.style.width = hitArea.width * wt.a * sx + "px";
            div.style.height = hitArea.height * wt.d * sy + "px";
          } else {
            hitArea = child.getBounds();
            this.capHitArea(hitArea);
            div.style.left = hitArea.x * sx + "px";
            div.style.top = hitArea.y * sy + "px";
            div.style.width = hitArea.width * sx + "px";
            div.style.height = hitArea.height * sy + "px";
            if (div.title !== child.accessibleTitle && child.accessibleTitle !== null) {
              div.title = child.accessibleTitle;
            }
            if (div.getAttribute("aria-label") !== child.accessibleHint && child.accessibleHint !== null) {
              div.setAttribute("aria-label", child.accessibleHint);
            }
          }
          if (child.accessibleTitle !== div.title || child.tabIndex !== div.tabIndex) {
            div.title = child.accessibleTitle;
            div.tabIndex = child.tabIndex;
            if (this.debug) {
              this.updateDebugHTML(div);
            }
          }
        }
      }
      this.renderId++;
    };
    AccessibilityManager2.prototype.updateDebugHTML = function(div) {
      div.innerHTML = "type: " + div.type + "</br> title : " + div.title + "</br> tabIndex: " + div.tabIndex;
    };
    AccessibilityManager2.prototype.capHitArea = function(hitArea) {
      if (hitArea.x < 0) {
        hitArea.width += hitArea.x;
        hitArea.x = 0;
      }
      if (hitArea.y < 0) {
        hitArea.height += hitArea.y;
        hitArea.y = 0;
      }
      if (hitArea.x + hitArea.width > this.renderer.width) {
        hitArea.width = this.renderer.width - hitArea.x;
      }
      if (hitArea.y + hitArea.height > this.renderer.height) {
        hitArea.height = this.renderer.height - hitArea.y;
      }
    };
    AccessibilityManager2.prototype.addChild = function(displayObject) {
      var div = this.pool.pop();
      if (!div) {
        div = document.createElement("button");
        div.style.width = DIV_TOUCH_SIZE + "px";
        div.style.height = DIV_TOUCH_SIZE + "px";
        div.style.backgroundColor = this.debug ? "rgba(255,255,255,0.5)" : "transparent";
        div.style.position = "absolute";
        div.style.zIndex = DIV_TOUCH_ZINDEX.toString();
        div.style.borderStyle = "none";
        if (navigator.userAgent.toLowerCase().indexOf("chrome") > -1) {
          div.setAttribute("aria-live", "off");
        } else {
          div.setAttribute("aria-live", "polite");
        }
        if (navigator.userAgent.match(/rv:.*Gecko\//)) {
          div.setAttribute("aria-relevant", "additions");
        } else {
          div.setAttribute("aria-relevant", "text");
        }
        div.addEventListener("click", this._onClick.bind(this));
        div.addEventListener("focus", this._onFocus.bind(this));
        div.addEventListener("focusout", this._onFocusOut.bind(this));
      }
      div.style.pointerEvents = displayObject.accessiblePointerEvents;
      div.type = displayObject.accessibleType;
      if (displayObject.accessibleTitle && displayObject.accessibleTitle !== null) {
        div.title = displayObject.accessibleTitle;
      } else if (!displayObject.accessibleHint || displayObject.accessibleHint === null) {
        div.title = "displayObject " + displayObject.tabIndex;
      }
      if (displayObject.accessibleHint && displayObject.accessibleHint !== null) {
        div.setAttribute("aria-label", displayObject.accessibleHint);
      }
      if (this.debug) {
        this.updateDebugHTML(div);
      }
      displayObject._accessibleActive = true;
      displayObject._accessibleDiv = div;
      div.displayObject = displayObject;
      this.children.push(displayObject);
      this.div.appendChild(displayObject._accessibleDiv);
      displayObject._accessibleDiv.tabIndex = displayObject.tabIndex;
    };
    AccessibilityManager2.prototype._onClick = function(e) {
      var interactionManager = this.renderer.plugins.interaction;
      interactionManager.dispatchEvent(e.target.displayObject, "click", interactionManager.eventData);
      interactionManager.dispatchEvent(e.target.displayObject, "pointertap", interactionManager.eventData);
      interactionManager.dispatchEvent(e.target.displayObject, "tap", interactionManager.eventData);
    };
    AccessibilityManager2.prototype._onFocus = function(e) {
      if (!e.target.getAttribute("aria-live")) {
        e.target.setAttribute("aria-live", "assertive");
      }
      var interactionManager = this.renderer.plugins.interaction;
      interactionManager.dispatchEvent(e.target.displayObject, "mouseover", interactionManager.eventData);
    };
    AccessibilityManager2.prototype._onFocusOut = function(e) {
      if (!e.target.getAttribute("aria-live")) {
        e.target.setAttribute("aria-live", "polite");
      }
      var interactionManager = this.renderer.plugins.interaction;
      interactionManager.dispatchEvent(e.target.displayObject, "mouseout", interactionManager.eventData);
    };
    AccessibilityManager2.prototype._onKeyDown = function(e) {
      if (e.keyCode !== KEY_CODE_TAB) {
        return;
      }
      this.activate();
    };
    AccessibilityManager2.prototype._onMouseMove = function(e) {
      if (e.movementX === 0 && e.movementY === 0) {
        return;
      }
      this.deactivate();
    };
    AccessibilityManager2.prototype.destroy = function() {
      this.destroyTouchHook();
      this.div = null;
      window.document.removeEventListener("mousemove", this._onMouseMove, true);
      window.removeEventListener("keydown", this._onKeyDown);
      this.pool = null;
      this.children = null;
      this.renderer = null;
    };
    return AccessibilityManager2;
  }();

  // node_modules/@pixi/ticker/lib/ticker.es.js
  /*!
   * @pixi/ticker - v5.3.3
   * Compiled Tue, 04 Aug 2020 16:23:09 UTC
   *
   * @pixi/ticker is licensed under the MIT License.
   * http://www.opensource.org/licenses/mit-license
   */
  settings.TARGET_FPMS = 0.06;
  var UPDATE_PRIORITY;
  (function(UPDATE_PRIORITY2) {
    UPDATE_PRIORITY2[UPDATE_PRIORITY2["INTERACTION"] = 50] = "INTERACTION";
    UPDATE_PRIORITY2[UPDATE_PRIORITY2["HIGH"] = 25] = "HIGH";
    UPDATE_PRIORITY2[UPDATE_PRIORITY2["NORMAL"] = 0] = "NORMAL";
    UPDATE_PRIORITY2[UPDATE_PRIORITY2["LOW"] = -25] = "LOW";
    UPDATE_PRIORITY2[UPDATE_PRIORITY2["UTILITY"] = -50] = "UTILITY";
  })(UPDATE_PRIORITY || (UPDATE_PRIORITY = {}));
  var TickerListener = function() {
    function TickerListener2(fn, context2, priority, once) {
      if (context2 === void 0) {
        context2 = null;
      }
      if (priority === void 0) {
        priority = 0;
      }
      if (once === void 0) {
        once = false;
      }
      this.fn = fn;
      this.context = context2;
      this.priority = priority;
      this.once = once;
      this.next = null;
      this.previous = null;
      this._destroyed = false;
    }
    TickerListener2.prototype.match = function(fn, context2) {
      if (context2 === void 0) {
        context2 = null;
      }
      return this.fn === fn && this.context === context2;
    };
    TickerListener2.prototype.emit = function(deltaTime) {
      if (this.fn) {
        if (this.context) {
          this.fn.call(this.context, deltaTime);
        } else {
          this.fn(deltaTime);
        }
      }
      var redirect = this.next;
      if (this.once) {
        this.destroy(true);
      }
      if (this._destroyed) {
        this.next = null;
      }
      return redirect;
    };
    TickerListener2.prototype.connect = function(previous) {
      this.previous = previous;
      if (previous.next) {
        previous.next.previous = this;
      }
      this.next = previous.next;
      previous.next = this;
    };
    TickerListener2.prototype.destroy = function(hard) {
      if (hard === void 0) {
        hard = false;
      }
      this._destroyed = true;
      this.fn = null;
      this.context = null;
      if (this.previous) {
        this.previous.next = this.next;
      }
      if (this.next) {
        this.next.previous = this.previous;
      }
      var redirect = this.next;
      this.next = hard ? null : redirect;
      this.previous = null;
      return redirect;
    };
    return TickerListener2;
  }();
  var Ticker = function() {
    function Ticker2() {
      var _this = this;
      this._head = new TickerListener(null, null, Infinity);
      this._requestId = null;
      this._maxElapsedMS = 100;
      this._minElapsedMS = 0;
      this.autoStart = false;
      this.deltaTime = 1;
      this.deltaMS = 1 / settings.TARGET_FPMS;
      this.elapsedMS = 1 / settings.TARGET_FPMS;
      this.lastTime = -1;
      this.speed = 1;
      this.started = false;
      this._protected = false;
      this._lastFrame = -1;
      this._tick = function(time) {
        _this._requestId = null;
        if (_this.started) {
          _this.update(time);
          if (_this.started && _this._requestId === null && _this._head.next) {
            _this._requestId = requestAnimationFrame(_this._tick);
          }
        }
      };
    }
    Ticker2.prototype._requestIfNeeded = function() {
      if (this._requestId === null && this._head.next) {
        this.lastTime = performance.now();
        this._lastFrame = this.lastTime;
        this._requestId = requestAnimationFrame(this._tick);
      }
    };
    Ticker2.prototype._cancelIfNeeded = function() {
      if (this._requestId !== null) {
        cancelAnimationFrame(this._requestId);
        this._requestId = null;
      }
    };
    Ticker2.prototype._startIfPossible = function() {
      if (this.started) {
        this._requestIfNeeded();
      } else if (this.autoStart) {
        this.start();
      }
    };
    Ticker2.prototype.add = function(fn, context2, priority) {
      if (priority === void 0) {
        priority = UPDATE_PRIORITY.NORMAL;
      }
      return this._addListener(new TickerListener(fn, context2, priority));
    };
    Ticker2.prototype.addOnce = function(fn, context2, priority) {
      if (priority === void 0) {
        priority = UPDATE_PRIORITY.NORMAL;
      }
      return this._addListener(new TickerListener(fn, context2, priority, true));
    };
    Ticker2.prototype._addListener = function(listener) {
      var current = this._head.next;
      var previous = this._head;
      if (!current) {
        listener.connect(previous);
      } else {
        while (current) {
          if (listener.priority > current.priority) {
            listener.connect(previous);
            break;
          }
          previous = current;
          current = current.next;
        }
        if (!listener.previous) {
          listener.connect(previous);
        }
      }
      this._startIfPossible();
      return this;
    };
    Ticker2.prototype.remove = function(fn, context2) {
      var listener = this._head.next;
      while (listener) {
        if (listener.match(fn, context2)) {
          listener = listener.destroy();
        } else {
          listener = listener.next;
        }
      }
      if (!this._head.next) {
        this._cancelIfNeeded();
      }
      return this;
    };
    Object.defineProperty(Ticker2.prototype, "count", {
      get: function() {
        if (!this._head) {
          return 0;
        }
        var count2 = 0;
        var current = this._head;
        while (current = current.next) {
          count2++;
        }
        return count2;
      },
      enumerable: false,
      configurable: true
    });
    Ticker2.prototype.start = function() {
      if (!this.started) {
        this.started = true;
        this._requestIfNeeded();
      }
    };
    Ticker2.prototype.stop = function() {
      if (this.started) {
        this.started = false;
        this._cancelIfNeeded();
      }
    };
    Ticker2.prototype.destroy = function() {
      if (!this._protected) {
        this.stop();
        var listener = this._head.next;
        while (listener) {
          listener = listener.destroy(true);
        }
        this._head.destroy();
        this._head = null;
      }
    };
    Ticker2.prototype.update = function(currentTime) {
      if (currentTime === void 0) {
        currentTime = performance.now();
      }
      var elapsedMS;
      if (currentTime > this.lastTime) {
        elapsedMS = this.elapsedMS = currentTime - this.lastTime;
        if (elapsedMS > this._maxElapsedMS) {
          elapsedMS = this._maxElapsedMS;
        }
        elapsedMS *= this.speed;
        if (this._minElapsedMS) {
          var delta = currentTime - this._lastFrame | 0;
          if (delta < this._minElapsedMS) {
            return;
          }
          this._lastFrame = currentTime - delta % this._minElapsedMS;
        }
        this.deltaMS = elapsedMS;
        this.deltaTime = this.deltaMS * settings.TARGET_FPMS;
        var head = this._head;
        var listener = head.next;
        while (listener) {
          listener = listener.emit(this.deltaTime);
        }
        if (!head.next) {
          this._cancelIfNeeded();
        }
      } else {
        this.deltaTime = this.deltaMS = this.elapsedMS = 0;
      }
      this.lastTime = currentTime;
    };
    Object.defineProperty(Ticker2.prototype, "FPS", {
      get: function() {
        return 1e3 / this.elapsedMS;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Ticker2.prototype, "minFPS", {
      get: function() {
        return 1e3 / this._maxElapsedMS;
      },
      set: function(fps) {
        var minFPS = Math.min(this.maxFPS, fps);
        var minFPMS = Math.min(Math.max(0, minFPS) / 1e3, settings.TARGET_FPMS);
        this._maxElapsedMS = 1 / minFPMS;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Ticker2.prototype, "maxFPS", {
      get: function() {
        if (this._minElapsedMS) {
          return Math.round(1e3 / this._minElapsedMS);
        }
        return 0;
      },
      set: function(fps) {
        if (fps === 0) {
          this._minElapsedMS = 0;
        } else {
          var maxFPS = Math.max(this.minFPS, fps);
          this._minElapsedMS = 1 / (maxFPS / 1e3);
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Ticker2, "shared", {
      get: function() {
        if (!Ticker2._shared) {
          var shared = Ticker2._shared = new Ticker2();
          shared.autoStart = true;
          shared._protected = true;
        }
        return Ticker2._shared;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Ticker2, "system", {
      get: function() {
        if (!Ticker2._system) {
          var system = Ticker2._system = new Ticker2();
          system.autoStart = true;
          system._protected = true;
        }
        return Ticker2._system;
      },
      enumerable: false,
      configurable: true
    });
    return Ticker2;
  }();
  var TickerPlugin = function() {
    function TickerPlugin2() {
    }
    TickerPlugin2.init = function(options) {
      var _this = this;
      options = Object.assign({
        autoStart: true,
        sharedTicker: false
      }, options);
      Object.defineProperty(this, "ticker", {
        set: function(ticker6) {
          if (this._ticker) {
            this._ticker.remove(this.render, this);
          }
          this._ticker = ticker6;
          if (ticker6) {
            ticker6.add(this.render, this, UPDATE_PRIORITY.LOW);
          }
        },
        get: function() {
          return this._ticker;
        }
      });
      this.stop = function() {
        _this._ticker.stop();
      };
      this.start = function() {
        _this._ticker.start();
      };
      this._ticker = null;
      this.ticker = options.sharedTicker ? Ticker.shared : new Ticker();
      if (options.autoStart) {
        this.start();
      }
    };
    TickerPlugin2.destroy = function() {
      if (this._ticker) {
        var oldTicker = this._ticker;
        this.ticker = null;
        oldTicker.destroy();
      }
    };
    return TickerPlugin2;
  }();

  // node_modules/@pixi/interaction/lib/interaction.es.js
  /*!
   * @pixi/interaction - v5.3.3
   * Compiled Tue, 04 Aug 2020 16:23:09 UTC
   *
   * @pixi/interaction is licensed under the MIT License.
   * http://www.opensource.org/licenses/mit-license
   */
  var InteractionData = function() {
    function InteractionData2() {
      this.pressure = 0;
      this.rotationAngle = 0;
      this.twist = 0;
      this.tangentialPressure = 0;
      this.global = new Point();
      this.target = null;
      this.originalEvent = null;
      this.identifier = null;
      this.isPrimary = false;
      this.button = 0;
      this.buttons = 0;
      this.width = 0;
      this.height = 0;
      this.tiltX = 0;
      this.tiltY = 0;
      this.pointerType = null;
      this.pressure = 0;
      this.rotationAngle = 0;
      this.twist = 0;
      this.tangentialPressure = 0;
    }
    Object.defineProperty(InteractionData2.prototype, "pointerId", {
      get: function() {
        return this.identifier;
      },
      enumerable: false,
      configurable: true
    });
    InteractionData2.prototype.getLocalPosition = function(displayObject, point, globalPos) {
      return displayObject.worldTransform.applyInverse(globalPos || this.global, point);
    };
    InteractionData2.prototype.copyEvent = function(event) {
      if ("isPrimary" in event && event.isPrimary) {
        this.isPrimary = true;
      }
      this.button = "button" in event && event.button;
      var buttons = "buttons" in event && event.buttons;
      this.buttons = Number.isInteger(buttons) ? buttons : "which" in event && event.which;
      this.width = "width" in event && event.width;
      this.height = "height" in event && event.height;
      this.tiltX = "tiltX" in event && event.tiltX;
      this.tiltY = "tiltY" in event && event.tiltY;
      this.pointerType = "pointerType" in event && event.pointerType;
      this.pressure = "pressure" in event && event.pressure;
      this.rotationAngle = "rotationAngle" in event && event.rotationAngle;
      this.twist = "twist" in event && event.twist || 0;
      this.tangentialPressure = "tangentialPressure" in event && event.tangentialPressure || 0;
    };
    InteractionData2.prototype.reset = function() {
      this.isPrimary = false;
    };
    return InteractionData2;
  }();
  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation. All rights reserved.
  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at http://www.apache.org/licenses/LICENSE-2.0
  
  THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
  WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
  MERCHANTABLITY OR NON-INFRINGEMENT.
  
  See the Apache Version 2.0 License for specific language governing permissions
  and limitations under the License.
  ***************************************************************************** */
  var extendStatics2 = function(d, b) {
    extendStatics2 = Object.setPrototypeOf || {__proto__: []} instanceof Array && function(d2, b2) {
      d2.__proto__ = b2;
    } || function(d2, b2) {
      for (var p in b2) {
        if (b2.hasOwnProperty(p)) {
          d2[p] = b2[p];
        }
      }
    };
    return extendStatics2(d, b);
  };
  function __extends2(d, b) {
    extendStatics2(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  }
  var InteractionEvent = function() {
    function InteractionEvent2() {
      this.stopped = false;
      this.stopsPropagatingAt = null;
      this.stopPropagationHint = false;
      this.target = null;
      this.currentTarget = null;
      this.type = null;
      this.data = null;
    }
    InteractionEvent2.prototype.stopPropagation = function() {
      this.stopped = true;
      this.stopPropagationHint = true;
      this.stopsPropagatingAt = this.currentTarget;
    };
    InteractionEvent2.prototype.reset = function() {
      this.stopped = false;
      this.stopsPropagatingAt = null;
      this.stopPropagationHint = false;
      this.currentTarget = null;
      this.target = null;
    };
    return InteractionEvent2;
  }();
  var InteractionTrackingData = function() {
    function InteractionTrackingData2(pointerId) {
      this._pointerId = pointerId;
      this._flags = InteractionTrackingData2.FLAGS.NONE;
    }
    InteractionTrackingData2.prototype._doSet = function(flag, yn) {
      if (yn) {
        this._flags = this._flags | flag;
      } else {
        this._flags = this._flags & ~flag;
      }
    };
    Object.defineProperty(InteractionTrackingData2.prototype, "pointerId", {
      get: function() {
        return this._pointerId;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(InteractionTrackingData2.prototype, "flags", {
      get: function() {
        return this._flags;
      },
      set: function(flags) {
        this._flags = flags;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(InteractionTrackingData2.prototype, "none", {
      get: function() {
        return this._flags === InteractionTrackingData2.FLAGS.NONE;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(InteractionTrackingData2.prototype, "over", {
      get: function() {
        return (this._flags & InteractionTrackingData2.FLAGS.OVER) !== 0;
      },
      set: function(yn) {
        this._doSet(InteractionTrackingData2.FLAGS.OVER, yn);
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(InteractionTrackingData2.prototype, "rightDown", {
      get: function() {
        return (this._flags & InteractionTrackingData2.FLAGS.RIGHT_DOWN) !== 0;
      },
      set: function(yn) {
        this._doSet(InteractionTrackingData2.FLAGS.RIGHT_DOWN, yn);
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(InteractionTrackingData2.prototype, "leftDown", {
      get: function() {
        return (this._flags & InteractionTrackingData2.FLAGS.LEFT_DOWN) !== 0;
      },
      set: function(yn) {
        this._doSet(InteractionTrackingData2.FLAGS.LEFT_DOWN, yn);
      },
      enumerable: false,
      configurable: true
    });
    InteractionTrackingData2.FLAGS = Object.freeze({
      NONE: 0,
      OVER: 1 << 0,
      LEFT_DOWN: 1 << 1,
      RIGHT_DOWN: 1 << 2
    });
    return InteractionTrackingData2;
  }();
  var TreeSearch = function() {
    function TreeSearch2() {
      this._tempPoint = new Point();
    }
    TreeSearch2.prototype.recursiveFindHit = function(interactionEvent, displayObject, func, hitTest, interactive) {
      if (!displayObject || !displayObject.visible) {
        return false;
      }
      var point = interactionEvent.data.global;
      interactive = displayObject.interactive || interactive;
      var hit = false;
      var interactiveParent = interactive;
      var hitTestChildren = true;
      if (displayObject.hitArea) {
        if (hitTest) {
          displayObject.worldTransform.applyInverse(point, this._tempPoint);
          if (!displayObject.hitArea.contains(this._tempPoint.x, this._tempPoint.y)) {
            hitTest = false;
            hitTestChildren = false;
          } else {
            hit = true;
          }
        }
        interactiveParent = false;
      } else if (displayObject._mask) {
        if (hitTest) {
          if (!(displayObject._mask.containsPoint && displayObject._mask.containsPoint(point))) {
            hitTest = false;
          }
        }
      }
      if (hitTestChildren && displayObject.interactiveChildren && displayObject.children) {
        var children = displayObject.children;
        for (var i = children.length - 1; i >= 0; i--) {
          var child = children[i];
          var childHit = this.recursiveFindHit(interactionEvent, child, func, hitTest, interactiveParent);
          if (childHit) {
            if (!child.parent) {
              continue;
            }
            interactiveParent = false;
            if (childHit) {
              if (interactionEvent.target) {
                hitTest = false;
              }
              hit = true;
            }
          }
        }
      }
      if (interactive) {
        if (hitTest && !interactionEvent.target) {
          if (!displayObject.hitArea && displayObject.containsPoint) {
            if (displayObject.containsPoint(point)) {
              hit = true;
            }
          }
        }
        if (displayObject.interactive) {
          if (hit && !interactionEvent.target) {
            interactionEvent.target = displayObject;
          }
          if (func) {
            func(interactionEvent, displayObject, !!hit);
          }
        }
      }
      return hit;
    };
    TreeSearch2.prototype.findHit = function(interactionEvent, displayObject, func, hitTest) {
      this.recursiveFindHit(interactionEvent, displayObject, func, hitTest, false);
    };
    return TreeSearch2;
  }();
  var interactiveTarget = {
    interactive: false,
    interactiveChildren: true,
    hitArea: null,
    get buttonMode() {
      return this.cursor === "pointer";
    },
    set buttonMode(value) {
      if (value) {
        this.cursor = "pointer";
      } else if (this.cursor === "pointer") {
        this.cursor = null;
      }
    },
    cursor: null,
    get trackedPointers() {
      if (this._trackedPointers === void 0) {
        this._trackedPointers = {};
      }
      return this._trackedPointers;
    },
    _trackedPointers: void 0
  };
  DisplayObject.mixin(interactiveTarget);
  var MOUSE_POINTER_ID = 1;
  var hitTestEvent = {
    target: null,
    data: {
      global: null
    }
  };
  var InteractionManager = function(_super) {
    __extends2(InteractionManager2, _super);
    function InteractionManager2(renderer, options) {
      var _this = _super.call(this) || this;
      options = options || {};
      _this.renderer = renderer;
      _this.autoPreventDefault = options.autoPreventDefault !== void 0 ? options.autoPreventDefault : true;
      _this.interactionFrequency = options.interactionFrequency || 10;
      _this.mouse = new InteractionData();
      _this.mouse.identifier = MOUSE_POINTER_ID;
      _this.mouse.global.set(-999999);
      _this.activeInteractionData = {};
      _this.activeInteractionData[MOUSE_POINTER_ID] = _this.mouse;
      _this.interactionDataPool = [];
      _this.eventData = new InteractionEvent();
      _this.interactionDOMElement = null;
      _this.moveWhenInside = false;
      _this.eventsAdded = false;
      _this.tickerAdded = false;
      _this.mouseOverRenderer = false;
      _this.supportsTouchEvents = "ontouchstart" in window;
      _this.supportsPointerEvents = !!window.PointerEvent;
      _this.onPointerUp = _this.onPointerUp.bind(_this);
      _this.processPointerUp = _this.processPointerUp.bind(_this);
      _this.onPointerCancel = _this.onPointerCancel.bind(_this);
      _this.processPointerCancel = _this.processPointerCancel.bind(_this);
      _this.onPointerDown = _this.onPointerDown.bind(_this);
      _this.processPointerDown = _this.processPointerDown.bind(_this);
      _this.onPointerMove = _this.onPointerMove.bind(_this);
      _this.processPointerMove = _this.processPointerMove.bind(_this);
      _this.onPointerOut = _this.onPointerOut.bind(_this);
      _this.processPointerOverOut = _this.processPointerOverOut.bind(_this);
      _this.onPointerOver = _this.onPointerOver.bind(_this);
      _this.cursorStyles = {
        default: "inherit",
        pointer: "pointer"
      };
      _this.currentCursorMode = null;
      _this.cursor = null;
      _this.resolution = 1;
      _this.delayedEvents = [];
      _this.search = new TreeSearch();
      _this._tempDisplayObject = new TemporaryDisplayObject();
      _this._useSystemTicker = options.useSystemTicker !== void 0 ? options.useSystemTicker : true;
      _this.setTargetElement(_this.renderer.view, _this.renderer.resolution);
      return _this;
    }
    Object.defineProperty(InteractionManager2.prototype, "useSystemTicker", {
      get: function() {
        return this._useSystemTicker;
      },
      set: function(useSystemTicker) {
        this._useSystemTicker = useSystemTicker;
        if (useSystemTicker) {
          this.addTickerListener();
        } else {
          this.removeTickerListener();
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(InteractionManager2.prototype, "lastObjectRendered", {
      get: function() {
        return this.renderer._lastObjectRendered || this._tempDisplayObject;
      },
      enumerable: false,
      configurable: true
    });
    InteractionManager2.prototype.hitTest = function(globalPoint, root) {
      hitTestEvent.target = null;
      hitTestEvent.data.global = globalPoint;
      if (!root) {
        root = this.lastObjectRendered;
      }
      this.processInteractive(hitTestEvent, root, null, true);
      return hitTestEvent.target;
    };
    InteractionManager2.prototype.setTargetElement = function(element, resolution) {
      if (resolution === void 0) {
        resolution = 1;
      }
      this.removeTickerListener();
      this.removeEvents();
      this.interactionDOMElement = element;
      this.resolution = resolution;
      this.addEvents();
      this.addTickerListener();
    };
    InteractionManager2.prototype.addTickerListener = function() {
      if (this.tickerAdded || !this.interactionDOMElement || !this._useSystemTicker) {
        return;
      }
      Ticker.system.add(this.tickerUpdate, this, UPDATE_PRIORITY.INTERACTION);
      this.tickerAdded = true;
    };
    InteractionManager2.prototype.removeTickerListener = function() {
      if (!this.tickerAdded) {
        return;
      }
      Ticker.system.remove(this.tickerUpdate, this);
      this.tickerAdded = false;
    };
    InteractionManager2.prototype.addEvents = function() {
      if (this.eventsAdded || !this.interactionDOMElement) {
        return;
      }
      var style = this.interactionDOMElement.style;
      if (window.navigator.msPointerEnabled) {
        style.msContentZooming = "none";
        style.msTouchAction = "none";
      } else if (this.supportsPointerEvents) {
        style.touchAction = "none";
      }
      if (this.supportsPointerEvents) {
        window.document.addEventListener("pointermove", this.onPointerMove, true);
        this.interactionDOMElement.addEventListener("pointerdown", this.onPointerDown, true);
        this.interactionDOMElement.addEventListener("pointerleave", this.onPointerOut, true);
        this.interactionDOMElement.addEventListener("pointerover", this.onPointerOver, true);
        window.addEventListener("pointercancel", this.onPointerCancel, true);
        window.addEventListener("pointerup", this.onPointerUp, true);
      } else {
        window.document.addEventListener("mousemove", this.onPointerMove, true);
        this.interactionDOMElement.addEventListener("mousedown", this.onPointerDown, true);
        this.interactionDOMElement.addEventListener("mouseout", this.onPointerOut, true);
        this.interactionDOMElement.addEventListener("mouseover", this.onPointerOver, true);
        window.addEventListener("mouseup", this.onPointerUp, true);
      }
      if (this.supportsTouchEvents) {
        this.interactionDOMElement.addEventListener("touchstart", this.onPointerDown, true);
        this.interactionDOMElement.addEventListener("touchcancel", this.onPointerCancel, true);
        this.interactionDOMElement.addEventListener("touchend", this.onPointerUp, true);
        this.interactionDOMElement.addEventListener("touchmove", this.onPointerMove, true);
      }
      this.eventsAdded = true;
    };
    InteractionManager2.prototype.removeEvents = function() {
      if (!this.eventsAdded || !this.interactionDOMElement) {
        return;
      }
      var style = this.interactionDOMElement.style;
      if (window.navigator.msPointerEnabled) {
        style.msContentZooming = "";
        style.msTouchAction = "";
      } else if (this.supportsPointerEvents) {
        style.touchAction = "";
      }
      if (this.supportsPointerEvents) {
        window.document.removeEventListener("pointermove", this.onPointerMove, true);
        this.interactionDOMElement.removeEventListener("pointerdown", this.onPointerDown, true);
        this.interactionDOMElement.removeEventListener("pointerleave", this.onPointerOut, true);
        this.interactionDOMElement.removeEventListener("pointerover", this.onPointerOver, true);
        window.removeEventListener("pointercancel", this.onPointerCancel, true);
        window.removeEventListener("pointerup", this.onPointerUp, true);
      } else {
        window.document.removeEventListener("mousemove", this.onPointerMove, true);
        this.interactionDOMElement.removeEventListener("mousedown", this.onPointerDown, true);
        this.interactionDOMElement.removeEventListener("mouseout", this.onPointerOut, true);
        this.interactionDOMElement.removeEventListener("mouseover", this.onPointerOver, true);
        window.removeEventListener("mouseup", this.onPointerUp, true);
      }
      if (this.supportsTouchEvents) {
        this.interactionDOMElement.removeEventListener("touchstart", this.onPointerDown, true);
        this.interactionDOMElement.removeEventListener("touchcancel", this.onPointerCancel, true);
        this.interactionDOMElement.removeEventListener("touchend", this.onPointerUp, true);
        this.interactionDOMElement.removeEventListener("touchmove", this.onPointerMove, true);
      }
      this.interactionDOMElement = null;
      this.eventsAdded = false;
    };
    InteractionManager2.prototype.tickerUpdate = function(deltaTime) {
      this._deltaTime += deltaTime;
      if (this._deltaTime < this.interactionFrequency) {
        return;
      }
      this._deltaTime = 0;
      this.update();
    };
    InteractionManager2.prototype.update = function() {
      if (!this.interactionDOMElement) {
        return;
      }
      if (this._didMove) {
        this._didMove = false;
        return;
      }
      this.cursor = null;
      for (var k in this.activeInteractionData) {
        if (this.activeInteractionData.hasOwnProperty(k)) {
          var interactionData = this.activeInteractionData[k];
          if (interactionData.originalEvent && interactionData.pointerType !== "touch") {
            var interactionEvent = this.configureInteractionEventForDOMEvent(this.eventData, interactionData.originalEvent, interactionData);
            this.processInteractive(interactionEvent, this.lastObjectRendered, this.processPointerOverOut, true);
          }
        }
      }
      this.setCursorMode(this.cursor);
    };
    InteractionManager2.prototype.setCursorMode = function(mode) {
      mode = mode || "default";
      if (this.currentCursorMode === mode) {
        return;
      }
      this.currentCursorMode = mode;
      var style = this.cursorStyles[mode];
      if (style) {
        switch (typeof style) {
          case "string":
            this.interactionDOMElement.style.cursor = style;
            break;
          case "function":
            style(mode);
            break;
          case "object":
            Object.assign(this.interactionDOMElement.style, style);
            break;
        }
      } else if (typeof mode === "string" && !Object.prototype.hasOwnProperty.call(this.cursorStyles, mode)) {
        this.interactionDOMElement.style.cursor = mode;
      }
    };
    InteractionManager2.prototype.dispatchEvent = function(displayObject, eventString, eventData) {
      if (!eventData.stopPropagationHint || displayObject === eventData.stopsPropagatingAt) {
        eventData.currentTarget = displayObject;
        eventData.type = eventString;
        displayObject.emit(eventString, eventData);
        if (displayObject[eventString]) {
          displayObject[eventString](eventData);
        }
      }
    };
    InteractionManager2.prototype.delayDispatchEvent = function(displayObject, eventString, eventData) {
      this.delayedEvents.push({displayObject, eventString, eventData});
    };
    InteractionManager2.prototype.mapPositionToPoint = function(point, x, y) {
      var rect;
      if (!this.interactionDOMElement.parentElement) {
        rect = {x: 0, y: 0, width: 0, height: 0};
      } else {
        rect = this.interactionDOMElement.getBoundingClientRect();
      }
      var resolutionMultiplier = 1 / this.resolution;
      point.x = (x - rect.left) * (this.interactionDOMElement.width / rect.width) * resolutionMultiplier;
      point.y = (y - rect.top) * (this.interactionDOMElement.height / rect.height) * resolutionMultiplier;
    };
    InteractionManager2.prototype.processInteractive = function(interactionEvent, displayObject, func, hitTest) {
      var hit = this.search.findHit(interactionEvent, displayObject, func, hitTest);
      var delayedEvents = this.delayedEvents;
      if (!delayedEvents.length) {
        return hit;
      }
      interactionEvent.stopPropagationHint = false;
      var delayedLen = delayedEvents.length;
      this.delayedEvents = [];
      for (var i = 0; i < delayedLen; i++) {
        var _a2 = delayedEvents[i], displayObject_1 = _a2.displayObject, eventString = _a2.eventString, eventData = _a2.eventData;
        if (eventData.stopsPropagatingAt === displayObject_1) {
          eventData.stopPropagationHint = true;
        }
        this.dispatchEvent(displayObject_1, eventString, eventData);
      }
      return hit;
    };
    InteractionManager2.prototype.onPointerDown = function(originalEvent) {
      if (this.supportsTouchEvents && originalEvent.pointerType === "touch") {
        return;
      }
      var events = this.normalizeToPointerData(originalEvent);
      if (this.autoPreventDefault && events[0].isNormalized) {
        var cancelable = originalEvent.cancelable || !("cancelable" in originalEvent);
        if (cancelable) {
          originalEvent.preventDefault();
        }
      }
      var eventLen = events.length;
      for (var i = 0; i < eventLen; i++) {
        var event = events[i];
        var interactionData = this.getInteractionDataForPointerId(event);
        var interactionEvent = this.configureInteractionEventForDOMEvent(this.eventData, event, interactionData);
        interactionEvent.data.originalEvent = originalEvent;
        this.processInteractive(interactionEvent, this.lastObjectRendered, this.processPointerDown, true);
        this.emit("pointerdown", interactionEvent);
        if (event.pointerType === "touch") {
          this.emit("touchstart", interactionEvent);
        } else if (event.pointerType === "mouse" || event.pointerType === "pen") {
          var isRightButton = event.button === 2;
          this.emit(isRightButton ? "rightdown" : "mousedown", this.eventData);
        }
      }
    };
    InteractionManager2.prototype.processPointerDown = function(interactionEvent, displayObject, hit) {
      var data = interactionEvent.data;
      var id = interactionEvent.data.identifier;
      if (hit) {
        if (!displayObject.trackedPointers[id]) {
          displayObject.trackedPointers[id] = new InteractionTrackingData(id);
        }
        this.dispatchEvent(displayObject, "pointerdown", interactionEvent);
        if (data.pointerType === "touch") {
          this.dispatchEvent(displayObject, "touchstart", interactionEvent);
        } else if (data.pointerType === "mouse" || data.pointerType === "pen") {
          var isRightButton = data.button === 2;
          if (isRightButton) {
            displayObject.trackedPointers[id].rightDown = true;
          } else {
            displayObject.trackedPointers[id].leftDown = true;
          }
          this.dispatchEvent(displayObject, isRightButton ? "rightdown" : "mousedown", interactionEvent);
        }
      }
    };
    InteractionManager2.prototype.onPointerComplete = function(originalEvent, cancelled, func) {
      var events = this.normalizeToPointerData(originalEvent);
      var eventLen = events.length;
      var eventAppend = originalEvent.target !== this.interactionDOMElement ? "outside" : "";
      for (var i = 0; i < eventLen; i++) {
        var event = events[i];
        var interactionData = this.getInteractionDataForPointerId(event);
        var interactionEvent = this.configureInteractionEventForDOMEvent(this.eventData, event, interactionData);
        interactionEvent.data.originalEvent = originalEvent;
        this.processInteractive(interactionEvent, this.lastObjectRendered, func, cancelled || !eventAppend);
        this.emit(cancelled ? "pointercancel" : "pointerup" + eventAppend, interactionEvent);
        if (event.pointerType === "mouse" || event.pointerType === "pen") {
          var isRightButton = event.button === 2;
          this.emit(isRightButton ? "rightup" + eventAppend : "mouseup" + eventAppend, interactionEvent);
        } else if (event.pointerType === "touch") {
          this.emit(cancelled ? "touchcancel" : "touchend" + eventAppend, interactionEvent);
          this.releaseInteractionDataForPointerId(event.pointerId);
        }
      }
    };
    InteractionManager2.prototype.onPointerCancel = function(event) {
      if (this.supportsTouchEvents && event.pointerType === "touch") {
        return;
      }
      this.onPointerComplete(event, true, this.processPointerCancel);
    };
    InteractionManager2.prototype.processPointerCancel = function(interactionEvent, displayObject) {
      var data = interactionEvent.data;
      var id = interactionEvent.data.identifier;
      if (displayObject.trackedPointers[id] !== void 0) {
        delete displayObject.trackedPointers[id];
        this.dispatchEvent(displayObject, "pointercancel", interactionEvent);
        if (data.pointerType === "touch") {
          this.dispatchEvent(displayObject, "touchcancel", interactionEvent);
        }
      }
    };
    InteractionManager2.prototype.onPointerUp = function(event) {
      if (this.supportsTouchEvents && event.pointerType === "touch") {
        return;
      }
      this.onPointerComplete(event, false, this.processPointerUp);
    };
    InteractionManager2.prototype.processPointerUp = function(interactionEvent, displayObject, hit) {
      var data = interactionEvent.data;
      var id = interactionEvent.data.identifier;
      var trackingData = displayObject.trackedPointers[id];
      var isTouch = data.pointerType === "touch";
      var isMouse = data.pointerType === "mouse" || data.pointerType === "pen";
      var isMouseTap = false;
      if (isMouse) {
        var isRightButton = data.button === 2;
        var flags = InteractionTrackingData.FLAGS;
        var test = isRightButton ? flags.RIGHT_DOWN : flags.LEFT_DOWN;
        var isDown = trackingData !== void 0 && trackingData.flags & test;
        if (hit) {
          this.dispatchEvent(displayObject, isRightButton ? "rightup" : "mouseup", interactionEvent);
          if (isDown) {
            this.dispatchEvent(displayObject, isRightButton ? "rightclick" : "click", interactionEvent);
            isMouseTap = true;
          }
        } else if (isDown) {
          this.dispatchEvent(displayObject, isRightButton ? "rightupoutside" : "mouseupoutside", interactionEvent);
        }
        if (trackingData) {
          if (isRightButton) {
            trackingData.rightDown = false;
          } else {
            trackingData.leftDown = false;
          }
        }
      }
      if (hit) {
        this.dispatchEvent(displayObject, "pointerup", interactionEvent);
        if (isTouch) {
          this.dispatchEvent(displayObject, "touchend", interactionEvent);
        }
        if (trackingData) {
          if (!isMouse || isMouseTap) {
            this.dispatchEvent(displayObject, "pointertap", interactionEvent);
          }
          if (isTouch) {
            this.dispatchEvent(displayObject, "tap", interactionEvent);
            trackingData.over = false;
          }
        }
      } else if (trackingData) {
        this.dispatchEvent(displayObject, "pointerupoutside", interactionEvent);
        if (isTouch) {
          this.dispatchEvent(displayObject, "touchendoutside", interactionEvent);
        }
      }
      if (trackingData && trackingData.none) {
        delete displayObject.trackedPointers[id];
      }
    };
    InteractionManager2.prototype.onPointerMove = function(originalEvent) {
      if (this.supportsTouchEvents && originalEvent.pointerType === "touch") {
        return;
      }
      var events = this.normalizeToPointerData(originalEvent);
      if (events[0].pointerType === "mouse" || events[0].pointerType === "pen") {
        this._didMove = true;
        this.cursor = null;
      }
      var eventLen = events.length;
      for (var i = 0; i < eventLen; i++) {
        var event = events[i];
        var interactionData = this.getInteractionDataForPointerId(event);
        var interactionEvent = this.configureInteractionEventForDOMEvent(this.eventData, event, interactionData);
        interactionEvent.data.originalEvent = originalEvent;
        this.processInteractive(interactionEvent, this.lastObjectRendered, this.processPointerMove, true);
        this.emit("pointermove", interactionEvent);
        if (event.pointerType === "touch") {
          this.emit("touchmove", interactionEvent);
        }
        if (event.pointerType === "mouse" || event.pointerType === "pen") {
          this.emit("mousemove", interactionEvent);
        }
      }
      if (events[0].pointerType === "mouse") {
        this.setCursorMode(this.cursor);
      }
    };
    InteractionManager2.prototype.processPointerMove = function(interactionEvent, displayObject, hit) {
      var data = interactionEvent.data;
      var isTouch = data.pointerType === "touch";
      var isMouse = data.pointerType === "mouse" || data.pointerType === "pen";
      if (isMouse) {
        this.processPointerOverOut(interactionEvent, displayObject, hit);
      }
      if (!this.moveWhenInside || hit) {
        this.dispatchEvent(displayObject, "pointermove", interactionEvent);
        if (isTouch) {
          this.dispatchEvent(displayObject, "touchmove", interactionEvent);
        }
        if (isMouse) {
          this.dispatchEvent(displayObject, "mousemove", interactionEvent);
        }
      }
    };
    InteractionManager2.prototype.onPointerOut = function(originalEvent) {
      if (this.supportsTouchEvents && originalEvent.pointerType === "touch") {
        return;
      }
      var events = this.normalizeToPointerData(originalEvent);
      var event = events[0];
      if (event.pointerType === "mouse") {
        this.mouseOverRenderer = false;
        this.setCursorMode(null);
      }
      var interactionData = this.getInteractionDataForPointerId(event);
      var interactionEvent = this.configureInteractionEventForDOMEvent(this.eventData, event, interactionData);
      interactionEvent.data.originalEvent = event;
      this.processInteractive(interactionEvent, this.lastObjectRendered, this.processPointerOverOut, false);
      this.emit("pointerout", interactionEvent);
      if (event.pointerType === "mouse" || event.pointerType === "pen") {
        this.emit("mouseout", interactionEvent);
      } else {
        this.releaseInteractionDataForPointerId(interactionData.identifier);
      }
    };
    InteractionManager2.prototype.processPointerOverOut = function(interactionEvent, displayObject, hit) {
      var data = interactionEvent.data;
      var id = interactionEvent.data.identifier;
      var isMouse = data.pointerType === "mouse" || data.pointerType === "pen";
      var trackingData = displayObject.trackedPointers[id];
      if (hit && !trackingData) {
        trackingData = displayObject.trackedPointers[id] = new InteractionTrackingData(id);
      }
      if (trackingData === void 0) {
        return;
      }
      if (hit && this.mouseOverRenderer) {
        if (!trackingData.over) {
          trackingData.over = true;
          this.delayDispatchEvent(displayObject, "pointerover", interactionEvent);
          if (isMouse) {
            this.delayDispatchEvent(displayObject, "mouseover", interactionEvent);
          }
        }
        if (isMouse && this.cursor === null) {
          this.cursor = displayObject.cursor;
        }
      } else if (trackingData.over) {
        trackingData.over = false;
        this.dispatchEvent(displayObject, "pointerout", this.eventData);
        if (isMouse) {
          this.dispatchEvent(displayObject, "mouseout", interactionEvent);
        }
        if (trackingData.none) {
          delete displayObject.trackedPointers[id];
        }
      }
    };
    InteractionManager2.prototype.onPointerOver = function(originalEvent) {
      var events = this.normalizeToPointerData(originalEvent);
      var event = events[0];
      var interactionData = this.getInteractionDataForPointerId(event);
      var interactionEvent = this.configureInteractionEventForDOMEvent(this.eventData, event, interactionData);
      interactionEvent.data.originalEvent = event;
      if (event.pointerType === "mouse") {
        this.mouseOverRenderer = true;
      }
      this.emit("pointerover", interactionEvent);
      if (event.pointerType === "mouse" || event.pointerType === "pen") {
        this.emit("mouseover", interactionEvent);
      }
    };
    InteractionManager2.prototype.getInteractionDataForPointerId = function(event) {
      var pointerId = event.pointerId;
      var interactionData;
      if (pointerId === MOUSE_POINTER_ID || event.pointerType === "mouse") {
        interactionData = this.mouse;
      } else if (this.activeInteractionData[pointerId]) {
        interactionData = this.activeInteractionData[pointerId];
      } else {
        interactionData = this.interactionDataPool.pop() || new InteractionData();
        interactionData.identifier = pointerId;
        this.activeInteractionData[pointerId] = interactionData;
      }
      interactionData.copyEvent(event);
      return interactionData;
    };
    InteractionManager2.prototype.releaseInteractionDataForPointerId = function(pointerId) {
      var interactionData = this.activeInteractionData[pointerId];
      if (interactionData) {
        delete this.activeInteractionData[pointerId];
        interactionData.reset();
        this.interactionDataPool.push(interactionData);
      }
    };
    InteractionManager2.prototype.configureInteractionEventForDOMEvent = function(interactionEvent, pointerEvent, interactionData) {
      interactionEvent.data = interactionData;
      this.mapPositionToPoint(interactionData.global, pointerEvent.clientX, pointerEvent.clientY);
      if (pointerEvent.pointerType === "touch") {
        pointerEvent.globalX = interactionData.global.x;
        pointerEvent.globalY = interactionData.global.y;
      }
      interactionData.originalEvent = pointerEvent;
      interactionEvent.reset();
      return interactionEvent;
    };
    InteractionManager2.prototype.normalizeToPointerData = function(event) {
      var normalizedEvents = [];
      if (this.supportsTouchEvents && event instanceof TouchEvent) {
        for (var i = 0, li = event.changedTouches.length; i < li; i++) {
          var touch = event.changedTouches[i];
          if (typeof touch.button === "undefined") {
            touch.button = event.touches.length ? 1 : 0;
          }
          if (typeof touch.buttons === "undefined") {
            touch.buttons = event.touches.length ? 1 : 0;
          }
          if (typeof touch.isPrimary === "undefined") {
            touch.isPrimary = event.touches.length === 1 && event.type === "touchstart";
          }
          if (typeof touch.width === "undefined") {
            touch.width = touch.radiusX || 1;
          }
          if (typeof touch.height === "undefined") {
            touch.height = touch.radiusY || 1;
          }
          if (typeof touch.tiltX === "undefined") {
            touch.tiltX = 0;
          }
          if (typeof touch.tiltY === "undefined") {
            touch.tiltY = 0;
          }
          if (typeof touch.pointerType === "undefined") {
            touch.pointerType = "touch";
          }
          if (typeof touch.pointerId === "undefined") {
            touch.pointerId = touch.identifier || 0;
          }
          if (typeof touch.pressure === "undefined") {
            touch.pressure = touch.force || 0.5;
          }
          if (typeof touch.twist === "undefined") {
            touch.twist = 0;
          }
          if (typeof touch.tangentialPressure === "undefined") {
            touch.tangentialPressure = 0;
          }
          if (typeof touch.layerX === "undefined") {
            touch.layerX = touch.offsetX = touch.clientX;
          }
          if (typeof touch.layerY === "undefined") {
            touch.layerY = touch.offsetY = touch.clientY;
          }
          touch.isNormalized = true;
          normalizedEvents.push(touch);
        }
      } else if (event instanceof MouseEvent && (!this.supportsPointerEvents || !(event instanceof window.PointerEvent))) {
        var tempEvent = event;
        if (typeof tempEvent.isPrimary === "undefined") {
          tempEvent.isPrimary = true;
        }
        if (typeof tempEvent.width === "undefined") {
          tempEvent.width = 1;
        }
        if (typeof tempEvent.height === "undefined") {
          tempEvent.height = 1;
        }
        if (typeof tempEvent.tiltX === "undefined") {
          tempEvent.tiltX = 0;
        }
        if (typeof tempEvent.tiltY === "undefined") {
          tempEvent.tiltY = 0;
        }
        if (typeof tempEvent.pointerType === "undefined") {
          tempEvent.pointerType = "mouse";
        }
        if (typeof tempEvent.pointerId === "undefined") {
          tempEvent.pointerId = MOUSE_POINTER_ID;
        }
        if (typeof tempEvent.pressure === "undefined") {
          tempEvent.pressure = 0.5;
        }
        if (typeof tempEvent.twist === "undefined") {
          tempEvent.twist = 0;
        }
        if (typeof tempEvent.tangentialPressure === "undefined") {
          tempEvent.tangentialPressure = 0;
        }
        tempEvent.isNormalized = true;
        normalizedEvents.push(tempEvent);
      } else {
        normalizedEvents.push(event);
      }
      return normalizedEvents;
    };
    InteractionManager2.prototype.destroy = function() {
      this.removeEvents();
      this.removeTickerListener();
      this.removeAllListeners();
      this.renderer = null;
      this.mouse = null;
      this.eventData = null;
      this.interactionDOMElement = null;
      this.onPointerDown = null;
      this.processPointerDown = null;
      this.onPointerUp = null;
      this.processPointerUp = null;
      this.onPointerCancel = null;
      this.processPointerCancel = null;
      this.onPointerMove = null;
      this.processPointerMove = null;
      this.onPointerOut = null;
      this.processPointerOverOut = null;
      this.onPointerOver = null;
      this.search = null;
    };
    return InteractionManager2;
  }(eventemitter3.default);

  // node_modules/@pixi/runner/lib/runner.es.js
  /*!
   * @pixi/runner - v5.3.3
   * Compiled Tue, 04 Aug 2020 16:23:09 UTC
   *
   * @pixi/runner is licensed under the MIT License.
   * http://www.opensource.org/licenses/mit-license
   */
  var Runner = function() {
    function Runner2(name) {
      this.items = [];
      this._name = name;
      this._aliasCount = 0;
    }
    Runner2.prototype.emit = function(a0, a1, a2, a3, a4, a5, a6, a7) {
      if (arguments.length > 8) {
        throw new Error("max arguments reached");
      }
      var _a2 = this, name = _a2.name, items = _a2.items;
      this._aliasCount++;
      for (var i = 0, len = items.length; i < len; i++) {
        items[i][name](a0, a1, a2, a3, a4, a5, a6, a7);
      }
      if (items === this.items) {
        this._aliasCount--;
      }
      return this;
    };
    Runner2.prototype.ensureNonAliasedItems = function() {
      if (this._aliasCount > 0 && this.items.length > 1) {
        this._aliasCount = 0;
        this.items = this.items.slice(0);
      }
    };
    Runner2.prototype.add = function(item) {
      if (item[this._name]) {
        this.ensureNonAliasedItems();
        this.remove(item);
        this.items.push(item);
      }
      return this;
    };
    Runner2.prototype.remove = function(item) {
      var index2 = this.items.indexOf(item);
      if (index2 !== -1) {
        this.ensureNonAliasedItems();
        this.items.splice(index2, 1);
      }
      return this;
    };
    Runner2.prototype.contains = function(item) {
      return this.items.indexOf(item) !== -1;
    };
    Runner2.prototype.removeAll = function() {
      this.ensureNonAliasedItems();
      this.items.length = 0;
      return this;
    };
    Runner2.prototype.destroy = function() {
      this.removeAll();
      this.items = null;
      this._name = null;
    };
    Object.defineProperty(Runner2.prototype, "empty", {
      get: function() {
        return this.items.length === 0;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Runner2.prototype, "name", {
      get: function() {
        return this._name;
      },
      enumerable: false,
      configurable: true
    });
    return Runner2;
  }();
  Object.defineProperties(Runner.prototype, {
    dispatch: {value: Runner.prototype.emit},
    run: {value: Runner.prototype.emit}
  });

  // node_modules/@pixi/core/lib/core.es.js
  /*!
   * @pixi/core - v5.3.3
   * Compiled Tue, 04 Aug 2020 16:23:09 UTC
   *
   * @pixi/core is licensed under the MIT License.
   * http://www.opensource.org/licenses/mit-license
   */
  settings.PREFER_ENV = isMobile3.any ? ENV.WEBGL : ENV.WEBGL2;
  settings.STRICT_TEXTURE_CACHE = false;
  var INSTALLED = [];
  function autoDetectResource(source, options) {
    if (!source) {
      return null;
    }
    var extension = "";
    if (typeof source === "string") {
      var result = /\.(\w{3,4})(?:$|\?|#)/i.exec(source);
      if (result) {
        extension = result[1].toLowerCase();
      }
    }
    for (var i = INSTALLED.length - 1; i >= 0; --i) {
      var ResourcePlugin = INSTALLED[i];
      if (ResourcePlugin.test && ResourcePlugin.test(source, extension)) {
        return new ResourcePlugin(source, options);
      }
    }
    throw new Error("Unrecognized source type to auto-detect Resource");
  }
  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation. All rights reserved.
  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at http://www.apache.org/licenses/LICENSE-2.0
  
  THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
  WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
  MERCHANTABLITY OR NON-INFRINGEMENT.
  
  See the Apache Version 2.0 License for specific language governing permissions
  and limitations under the License.
  ***************************************************************************** */
  var extendStatics3 = function(d, b) {
    extendStatics3 = Object.setPrototypeOf || {__proto__: []} instanceof Array && function(d2, b2) {
      d2.__proto__ = b2;
    } || function(d2, b2) {
      for (var p in b2) {
        if (b2.hasOwnProperty(p)) {
          d2[p] = b2[p];
        }
      }
    };
    return extendStatics3(d, b);
  };
  function __extends3(d, b) {
    extendStatics3(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  }
  var Resource = function() {
    function Resource3(width, height) {
      if (width === void 0) {
        width = 0;
      }
      if (height === void 0) {
        height = 0;
      }
      this._width = width;
      this._height = height;
      this.destroyed = false;
      this.internal = false;
      this.onResize = new Runner("setRealSize");
      this.onUpdate = new Runner("update");
      this.onError = new Runner("onError");
    }
    Resource3.prototype.bind = function(baseTexture) {
      this.onResize.add(baseTexture);
      this.onUpdate.add(baseTexture);
      this.onError.add(baseTexture);
      if (this._width || this._height) {
        this.onResize.emit(this._width, this._height);
      }
    };
    Resource3.prototype.unbind = function(baseTexture) {
      this.onResize.remove(baseTexture);
      this.onUpdate.remove(baseTexture);
      this.onError.remove(baseTexture);
    };
    Resource3.prototype.resize = function(width, height) {
      if (width !== this._width || height !== this._height) {
        this._width = width;
        this._height = height;
        this.onResize.emit(width, height);
      }
    };
    Object.defineProperty(Resource3.prototype, "valid", {
      get: function() {
        return !!this._width && !!this._height;
      },
      enumerable: false,
      configurable: true
    });
    Resource3.prototype.update = function() {
      if (!this.destroyed) {
        this.onUpdate.emit();
      }
    };
    Resource3.prototype.load = function() {
      return Promise.resolve(this);
    };
    Object.defineProperty(Resource3.prototype, "width", {
      get: function() {
        return this._width;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Resource3.prototype, "height", {
      get: function() {
        return this._height;
      },
      enumerable: false,
      configurable: true
    });
    Resource3.prototype.style = function(_renderer, _baseTexture, _glTexture) {
      return false;
    };
    Resource3.prototype.dispose = function() {
    };
    Resource3.prototype.destroy = function() {
      if (!this.destroyed) {
        this.destroyed = true;
        this.dispose();
        this.onError.removeAll();
        this.onError = null;
        this.onResize.removeAll();
        this.onResize = null;
        this.onUpdate.removeAll();
        this.onUpdate = null;
      }
    };
    Resource3.test = function(_source, _extension) {
      return false;
    };
    return Resource3;
  }();
  var BufferResource = function(_super) {
    __extends3(BufferResource2, _super);
    function BufferResource2(source, options) {
      var _this = this;
      var _a2 = options || {}, width = _a2.width, height = _a2.height;
      if (!width || !height) {
        throw new Error("BufferResource width or height invalid");
      }
      _this = _super.call(this, width, height) || this;
      _this.data = source;
      return _this;
    }
    BufferResource2.prototype.upload = function(renderer, baseTexture, glTexture) {
      var gl = renderer.gl;
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, baseTexture.alphaMode === ALPHA_MODES.UNPACK);
      if (glTexture.width === baseTexture.width && glTexture.height === baseTexture.height) {
        gl.texSubImage2D(baseTexture.target, 0, 0, 0, baseTexture.width, baseTexture.height, baseTexture.format, baseTexture.type, this.data);
      } else {
        glTexture.width = baseTexture.width;
        glTexture.height = baseTexture.height;
        gl.texImage2D(baseTexture.target, 0, glTexture.internalFormat, baseTexture.width, baseTexture.height, 0, baseTexture.format, glTexture.type, this.data);
      }
      return true;
    };
    BufferResource2.prototype.dispose = function() {
      this.data = null;
    };
    BufferResource2.test = function(source) {
      return source instanceof Float32Array || source instanceof Uint8Array || source instanceof Uint32Array;
    };
    return BufferResource2;
  }(Resource);
  var defaultBufferOptions = {
    scaleMode: SCALE_MODES.NEAREST,
    format: FORMATS.RGBA,
    alphaMode: ALPHA_MODES.NPM
  };
  var BaseTexture = function(_super) {
    __extends3(BaseTexture2, _super);
    function BaseTexture2(resource, options) {
      if (resource === void 0) {
        resource = null;
      }
      if (options === void 0) {
        options = null;
      }
      var _this = _super.call(this) || this;
      options = options || {};
      var alphaMode = options.alphaMode, mipmap = options.mipmap, anisotropicLevel = options.anisotropicLevel, scaleMode = options.scaleMode, width = options.width, height = options.height, wrapMode = options.wrapMode, format = options.format, type = options.type, target = options.target, resolution = options.resolution, resourceOptions = options.resourceOptions;
      if (resource && !(resource instanceof Resource)) {
        resource = autoDetectResource(resource, resourceOptions);
        resource.internal = true;
      }
      _this.width = width || 0;
      _this.height = height || 0;
      _this.resolution = resolution || settings.RESOLUTION;
      _this.mipmap = mipmap !== void 0 ? mipmap : settings.MIPMAP_TEXTURES;
      _this.anisotropicLevel = anisotropicLevel !== void 0 ? anisotropicLevel : settings.ANISOTROPIC_LEVEL;
      _this.wrapMode = wrapMode || settings.WRAP_MODE;
      _this.scaleMode = scaleMode !== void 0 ? scaleMode : settings.SCALE_MODE;
      _this.format = format || FORMATS.RGBA;
      _this.type = type || TYPES.UNSIGNED_BYTE;
      _this.target = target || TARGETS.TEXTURE_2D;
      _this.alphaMode = alphaMode !== void 0 ? alphaMode : ALPHA_MODES.UNPACK;
      if (options.premultiplyAlpha !== void 0) {
        _this.premultiplyAlpha = options.premultiplyAlpha;
      }
      _this.uid = uid();
      _this.touched = 0;
      _this.isPowerOfTwo = false;
      _this._refreshPOT();
      _this._glTextures = {};
      _this.dirtyId = 0;
      _this.dirtyStyleId = 0;
      _this.cacheId = null;
      _this.valid = width > 0 && height > 0;
      _this.textureCacheIds = [];
      _this.destroyed = false;
      _this.resource = null;
      _this._batchEnabled = 0;
      _this._batchLocation = 0;
      _this.parentTextureArray = null;
      _this.setResource(resource);
      return _this;
    }
    Object.defineProperty(BaseTexture2.prototype, "realWidth", {
      get: function() {
        return Math.ceil(this.width * this.resolution - 1e-4);
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(BaseTexture2.prototype, "realHeight", {
      get: function() {
        return Math.ceil(this.height * this.resolution - 1e-4);
      },
      enumerable: false,
      configurable: true
    });
    BaseTexture2.prototype.setStyle = function(scaleMode, mipmap) {
      var dirty;
      if (scaleMode !== void 0 && scaleMode !== this.scaleMode) {
        this.scaleMode = scaleMode;
        dirty = true;
      }
      if (mipmap !== void 0 && mipmap !== this.mipmap) {
        this.mipmap = mipmap;
        dirty = true;
      }
      if (dirty) {
        this.dirtyStyleId++;
      }
      return this;
    };
    BaseTexture2.prototype.setSize = function(width, height, resolution) {
      this.resolution = resolution || this.resolution;
      this.width = width;
      this.height = height;
      this._refreshPOT();
      this.update();
      return this;
    };
    BaseTexture2.prototype.setRealSize = function(realWidth, realHeight, resolution) {
      this.resolution = resolution || this.resolution;
      this.width = realWidth / this.resolution;
      this.height = realHeight / this.resolution;
      this._refreshPOT();
      this.update();
      return this;
    };
    BaseTexture2.prototype._refreshPOT = function() {
      this.isPowerOfTwo = isPow2(this.realWidth) && isPow2(this.realHeight);
    };
    BaseTexture2.prototype.setResolution = function(resolution) {
      var oldResolution = this.resolution;
      if (oldResolution === resolution) {
        return this;
      }
      this.resolution = resolution;
      if (this.valid) {
        this.width = this.width * oldResolution / resolution;
        this.height = this.height * oldResolution / resolution;
        this.emit("update", this);
      }
      this._refreshPOT();
      return this;
    };
    BaseTexture2.prototype.setResource = function(resource) {
      if (this.resource === resource) {
        return this;
      }
      if (this.resource) {
        throw new Error("Resource can be set only once");
      }
      resource.bind(this);
      this.resource = resource;
      return this;
    };
    BaseTexture2.prototype.update = function() {
      if (!this.valid) {
        if (this.width > 0 && this.height > 0) {
          this.valid = true;
          this.emit("loaded", this);
          this.emit("update", this);
        }
      } else {
        this.dirtyId++;
        this.dirtyStyleId++;
        this.emit("update", this);
      }
    };
    BaseTexture2.prototype.onError = function(event) {
      this.emit("error", this, event);
    };
    BaseTexture2.prototype.destroy = function() {
      if (this.resource) {
        this.resource.unbind(this);
        if (this.resource.internal) {
          this.resource.destroy();
        }
        this.resource = null;
      }
      if (this.cacheId) {
        delete BaseTextureCache[this.cacheId];
        delete TextureCache[this.cacheId];
        this.cacheId = null;
      }
      this.dispose();
      BaseTexture2.removeFromCache(this);
      this.textureCacheIds = null;
      this.destroyed = true;
    };
    BaseTexture2.prototype.dispose = function() {
      this.emit("dispose", this);
    };
    BaseTexture2.prototype.castToBaseTexture = function() {
      return this;
    };
    BaseTexture2.from = function(source, options, strict) {
      if (strict === void 0) {
        strict = settings.STRICT_TEXTURE_CACHE;
      }
      var isFrame = typeof source === "string";
      var cacheId = null;
      if (isFrame) {
        cacheId = source;
      } else {
        if (!source._pixiId) {
          source._pixiId = "pixiid_" + uid();
        }
        cacheId = source._pixiId;
      }
      var baseTexture = BaseTextureCache[cacheId];
      if (isFrame && strict && !baseTexture) {
        throw new Error('The cacheId "' + cacheId + '" does not exist in BaseTextureCache.');
      }
      if (!baseTexture) {
        baseTexture = new BaseTexture2(source, options);
        baseTexture.cacheId = cacheId;
        BaseTexture2.addToCache(baseTexture, cacheId);
      }
      return baseTexture;
    };
    BaseTexture2.fromBuffer = function(buffer, width, height, options) {
      buffer = buffer || new Float32Array(width * height * 4);
      var resource = new BufferResource(buffer, {width, height});
      var type = buffer instanceof Float32Array ? TYPES.FLOAT : TYPES.UNSIGNED_BYTE;
      return new BaseTexture2(resource, Object.assign(defaultBufferOptions, options || {width, height, type}));
    };
    BaseTexture2.addToCache = function(baseTexture, id) {
      if (id) {
        if (baseTexture.textureCacheIds.indexOf(id) === -1) {
          baseTexture.textureCacheIds.push(id);
        }
        if (BaseTextureCache[id]) {
          console.warn("BaseTexture added to the cache with an id [" + id + "] that already had an entry");
        }
        BaseTextureCache[id] = baseTexture;
      }
    };
    BaseTexture2.removeFromCache = function(baseTexture) {
      if (typeof baseTexture === "string") {
        var baseTextureFromCache = BaseTextureCache[baseTexture];
        if (baseTextureFromCache) {
          var index2 = baseTextureFromCache.textureCacheIds.indexOf(baseTexture);
          if (index2 > -1) {
            baseTextureFromCache.textureCacheIds.splice(index2, 1);
          }
          delete BaseTextureCache[baseTexture];
          return baseTextureFromCache;
        }
      } else if (baseTexture && baseTexture.textureCacheIds) {
        for (var i = 0; i < baseTexture.textureCacheIds.length; ++i) {
          delete BaseTextureCache[baseTexture.textureCacheIds[i]];
        }
        baseTexture.textureCacheIds.length = 0;
        return baseTexture;
      }
      return null;
    };
    BaseTexture2._globalBatch = 0;
    return BaseTexture2;
  }(eventemitter3.default);
  var AbstractMultiResource = function(_super) {
    __extends3(AbstractMultiResource2, _super);
    function AbstractMultiResource2(length, options) {
      var _this = this;
      var _a2 = options || {}, width = _a2.width, height = _a2.height;
      _this = _super.call(this, width, height) || this;
      _this.items = [];
      _this.itemDirtyIds = [];
      for (var i = 0; i < length; i++) {
        var partTexture = new BaseTexture();
        _this.items.push(partTexture);
        _this.itemDirtyIds.push(-2);
      }
      _this.length = length;
      _this._load = null;
      _this.baseTexture = null;
      return _this;
    }
    AbstractMultiResource2.prototype.initFromArray = function(resources, options) {
      for (var i = 0; i < this.length; i++) {
        if (!resources[i]) {
          continue;
        }
        if (resources[i].castToBaseTexture) {
          this.addBaseTextureAt(resources[i].castToBaseTexture(), i);
        } else if (resources[i] instanceof Resource) {
          this.addResourceAt(resources[i], i);
        } else {
          this.addResourceAt(autoDetectResource(resources[i], options), i);
        }
      }
    };
    AbstractMultiResource2.prototype.dispose = function() {
      for (var i = 0, len = this.length; i < len; i++) {
        this.items[i].destroy();
      }
      this.items = null;
      this.itemDirtyIds = null;
      this._load = null;
    };
    AbstractMultiResource2.prototype.addResourceAt = function(resource, index2) {
      if (!this.items[index2]) {
        throw new Error("Index " + index2 + " is out of bounds");
      }
      if (resource.valid && !this.valid) {
        this.resize(resource.width, resource.height);
      }
      this.items[index2].setResource(resource);
      return this;
    };
    AbstractMultiResource2.prototype.bind = function(baseTexture) {
      if (this.baseTexture !== null) {
        throw new Error("Only one base texture per TextureArray is allowed");
      }
      _super.prototype.bind.call(this, baseTexture);
      for (var i = 0; i < this.length; i++) {
        this.items[i].parentTextureArray = baseTexture;
        this.items[i].on("update", baseTexture.update, baseTexture);
      }
    };
    AbstractMultiResource2.prototype.unbind = function(baseTexture) {
      _super.prototype.unbind.call(this, baseTexture);
      for (var i = 0; i < this.length; i++) {
        this.items[i].parentTextureArray = null;
        this.items[i].off("update", baseTexture.update, baseTexture);
      }
    };
    AbstractMultiResource2.prototype.load = function() {
      var _this = this;
      if (this._load) {
        return this._load;
      }
      var resources = this.items.map(function(item) {
        return item.resource;
      }).filter(function(item) {
        return item;
      });
      var promises = resources.map(function(item) {
        return item.load();
      });
      this._load = Promise.all(promises).then(function() {
        var _a2 = _this.items[0], realWidth = _a2.realWidth, realHeight = _a2.realHeight;
        _this.resize(realWidth, realHeight);
        return Promise.resolve(_this);
      });
      return this._load;
    };
    return AbstractMultiResource2;
  }(Resource);
  var ArrayResource = function(_super) {
    __extends3(ArrayResource2, _super);
    function ArrayResource2(source, options) {
      var _this = this;
      var _a2 = options || {}, width = _a2.width, height = _a2.height;
      var urls;
      var length;
      if (Array.isArray(source)) {
        urls = source;
        length = source.length;
      } else {
        length = source;
      }
      _this = _super.call(this, length, {width, height}) || this;
      if (urls) {
        _this.initFromArray(urls, options);
      }
      return _this;
    }
    ArrayResource2.prototype.addBaseTextureAt = function(baseTexture, index2) {
      if (baseTexture.resource) {
        this.addResourceAt(baseTexture.resource, index2);
      } else {
        throw new Error("ArrayResource does not support RenderTexture");
      }
      return this;
    };
    ArrayResource2.prototype.bind = function(baseTexture) {
      _super.prototype.bind.call(this, baseTexture);
      baseTexture.target = TARGETS.TEXTURE_2D_ARRAY;
    };
    ArrayResource2.prototype.upload = function(renderer, texture, glTexture) {
      var _a2 = this, length = _a2.length, itemDirtyIds = _a2.itemDirtyIds, items = _a2.items;
      var gl = renderer.gl;
      if (glTexture.dirtyId < 0) {
        gl.texImage3D(gl.TEXTURE_2D_ARRAY, 0, texture.format, this._width, this._height, length, 0, texture.format, texture.type, null);
      }
      for (var i = 0; i < length; i++) {
        var item = items[i];
        if (itemDirtyIds[i] < item.dirtyId) {
          itemDirtyIds[i] = item.dirtyId;
          if (item.valid) {
            gl.texSubImage3D(gl.TEXTURE_2D_ARRAY, 0, 0, 0, i, item.resource.width, item.resource.height, 1, texture.format, texture.type, item.resource.source);
          }
        }
      }
      return true;
    };
    return ArrayResource2;
  }(AbstractMultiResource);
  var BaseImageResource = function(_super) {
    __extends3(BaseImageResource2, _super);
    function BaseImageResource2(source) {
      var _this = this;
      var sourceAny = source;
      var width = sourceAny.naturalWidth || sourceAny.videoWidth || sourceAny.width;
      var height = sourceAny.naturalHeight || sourceAny.videoHeight || sourceAny.height;
      _this = _super.call(this, width, height) || this;
      _this.source = source;
      _this.noSubImage = false;
      return _this;
    }
    BaseImageResource2.crossOrigin = function(element, url3, crossorigin) {
      if (crossorigin === void 0 && url3.indexOf("data:") !== 0) {
        element.crossOrigin = determineCrossOrigin(url3);
      } else if (crossorigin !== false) {
        element.crossOrigin = typeof crossorigin === "string" ? crossorigin : "anonymous";
      }
    };
    BaseImageResource2.prototype.upload = function(renderer, baseTexture, glTexture, source) {
      var gl = renderer.gl;
      var width = baseTexture.realWidth;
      var height = baseTexture.realHeight;
      source = source || this.source;
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, baseTexture.alphaMode === ALPHA_MODES.UNPACK);
      if (!this.noSubImage && baseTexture.target === gl.TEXTURE_2D && glTexture.width === width && glTexture.height === height) {
        gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, baseTexture.format, baseTexture.type, source);
      } else {
        glTexture.width = width;
        glTexture.height = height;
        gl.texImage2D(baseTexture.target, 0, baseTexture.format, baseTexture.format, baseTexture.type, source);
      }
      return true;
    };
    BaseImageResource2.prototype.update = function() {
      if (this.destroyed) {
        return;
      }
      var source = this.source;
      var width = source.naturalWidth || source.videoWidth || source.width;
      var height = source.naturalHeight || source.videoHeight || source.height;
      this.resize(width, height);
      _super.prototype.update.call(this);
    };
    BaseImageResource2.prototype.dispose = function() {
      this.source = null;
    };
    return BaseImageResource2;
  }(Resource);
  var CanvasResource = function(_super) {
    __extends3(CanvasResource2, _super);
    function CanvasResource2() {
      return _super !== null && _super.apply(this, arguments) || this;
    }
    CanvasResource2.test = function(source) {
      var OffscreenCanvas2 = window.OffscreenCanvas;
      if (OffscreenCanvas2 && source instanceof OffscreenCanvas2) {
        return true;
      }
      return source instanceof HTMLCanvasElement;
    };
    return CanvasResource2;
  }(BaseImageResource);
  var CubeResource = function(_super) {
    __extends3(CubeResource2, _super);
    function CubeResource2(source, options) {
      var _this = this;
      var _a2 = options || {}, width = _a2.width, height = _a2.height, autoLoad = _a2.autoLoad, linkBaseTexture = _a2.linkBaseTexture;
      if (source && source.length !== CubeResource2.SIDES) {
        throw new Error("Invalid length. Got " + source.length + ", expected 6");
      }
      _this = _super.call(this, 6, {width, height}) || this;
      for (var i = 0; i < CubeResource2.SIDES; i++) {
        _this.items[i].target = TARGETS.TEXTURE_CUBE_MAP_POSITIVE_X + i;
      }
      _this.linkBaseTexture = linkBaseTexture !== false;
      if (source) {
        _this.initFromArray(source, options);
      }
      if (autoLoad !== false) {
        _this.load();
      }
      return _this;
    }
    CubeResource2.prototype.bind = function(baseTexture) {
      _super.prototype.bind.call(this, baseTexture);
      baseTexture.target = TARGETS.TEXTURE_CUBE_MAP;
    };
    CubeResource2.prototype.addBaseTextureAt = function(baseTexture, index2, linkBaseTexture) {
      if (linkBaseTexture === void 0) {
        linkBaseTexture = this.linkBaseTexture;
      }
      if (!this.items[index2]) {
        throw new Error("Index " + index2 + " is out of bounds");
      }
      if (!this.linkBaseTexture || baseTexture.parentTextureArray || Object.keys(baseTexture._glTextures).length > 0) {
        if (baseTexture.resource) {
          this.addResourceAt(baseTexture.resource, index2);
        } else {
          throw new Error("CubeResource does not support copying of renderTexture.");
        }
      } else {
        baseTexture.target = TARGETS.TEXTURE_CUBE_MAP_POSITIVE_X + index2;
        baseTexture.parentTextureArray = this.baseTexture;
        this.items[index2] = baseTexture;
      }
      if (baseTexture.valid && !this.valid) {
        this.resize(baseTexture.realWidth, baseTexture.realHeight);
      }
      this.items[index2] = baseTexture;
      return this;
    };
    CubeResource2.prototype.upload = function(renderer, _baseTexture, glTexture) {
      var dirty = this.itemDirtyIds;
      for (var i = 0; i < CubeResource2.SIDES; i++) {
        var side = this.items[i];
        if (dirty[i] < side.dirtyId) {
          if (side.valid && side.resource) {
            side.resource.upload(renderer, side, glTexture);
            dirty[i] = side.dirtyId;
          } else if (dirty[i] < -1) {
            renderer.gl.texImage2D(side.target, 0, glTexture.internalFormat, _baseTexture.realWidth, _baseTexture.realHeight, 0, _baseTexture.format, glTexture.type, null);
            dirty[i] = -1;
          }
        }
      }
      return true;
    };
    CubeResource2.test = function(source) {
      return Array.isArray(source) && source.length === CubeResource2.SIDES;
    };
    CubeResource2.SIDES = 6;
    return CubeResource2;
  }(AbstractMultiResource);
  var ImageResource = function(_super) {
    __extends3(ImageResource2, _super);
    function ImageResource2(source, options) {
      var _this = this;
      options = options || {};
      if (!(source instanceof HTMLImageElement)) {
        var imageElement = new Image();
        BaseImageResource.crossOrigin(imageElement, source, options.crossorigin);
        imageElement.src = source;
        source = imageElement;
      }
      _this = _super.call(this, source) || this;
      if (!source.complete && !!_this._width && !!_this._height) {
        _this._width = 0;
        _this._height = 0;
      }
      _this.url = source.src;
      _this._process = null;
      _this.preserveBitmap = false;
      _this.createBitmap = (options.createBitmap !== void 0 ? options.createBitmap : settings.CREATE_IMAGE_BITMAP) && !!window.createImageBitmap;
      _this.alphaMode = typeof options.alphaMode === "number" ? options.alphaMode : null;
      if (options.premultiplyAlpha !== void 0) {
        _this.premultiplyAlpha = options.premultiplyAlpha;
      }
      _this.bitmap = null;
      _this._load = null;
      if (options.autoLoad !== false) {
        _this.load();
      }
      return _this;
    }
    ImageResource2.prototype.load = function(createBitmap) {
      var _this = this;
      if (this._load) {
        return this._load;
      }
      if (createBitmap !== void 0) {
        this.createBitmap = createBitmap;
      }
      this._load = new Promise(function(resolve, reject) {
        var source = _this.source;
        _this.url = source.src;
        var completed = function() {
          if (_this.destroyed) {
            return;
          }
          source.onload = null;
          source.onerror = null;
          _this.resize(source.width, source.height);
          _this._load = null;
          if (_this.createBitmap) {
            resolve(_this.process());
          } else {
            resolve(_this);
          }
        };
        if (source.complete && source.src) {
          completed();
        } else {
          source.onload = completed;
          source.onerror = function(event) {
            reject(event);
            _this.onError.emit(event);
          };
        }
      });
      return this._load;
    };
    ImageResource2.prototype.process = function() {
      var _this = this;
      var source = this.source;
      if (this._process !== null) {
        return this._process;
      }
      if (this.bitmap !== null || !window.createImageBitmap) {
        return Promise.resolve(this);
      }
      this._process = window.createImageBitmap(source, 0, 0, source.width, source.height, {
        premultiplyAlpha: this.alphaMode === ALPHA_MODES.UNPACK ? "premultiply" : "none"
      }).then(function(bitmap) {
        if (_this.destroyed) {
          return Promise.reject();
        }
        _this.bitmap = bitmap;
        _this.update();
        _this._process = null;
        return Promise.resolve(_this);
      });
      return this._process;
    };
    ImageResource2.prototype.upload = function(renderer, baseTexture, glTexture) {
      if (typeof this.alphaMode === "number") {
        baseTexture.alphaMode = this.alphaMode;
      }
      if (!this.createBitmap) {
        return _super.prototype.upload.call(this, renderer, baseTexture, glTexture);
      }
      if (!this.bitmap) {
        this.process();
        if (!this.bitmap) {
          return false;
        }
      }
      _super.prototype.upload.call(this, renderer, baseTexture, glTexture, this.bitmap);
      if (!this.preserveBitmap) {
        var flag = true;
        var glTextures = baseTexture._glTextures;
        for (var key in glTextures) {
          var otherTex = glTextures[key];
          if (otherTex !== glTexture && otherTex.dirtyId !== baseTexture.dirtyId) {
            flag = false;
            break;
          }
        }
        if (flag) {
          if (this.bitmap.close) {
            this.bitmap.close();
          }
          this.bitmap = null;
        }
      }
      return true;
    };
    ImageResource2.prototype.dispose = function() {
      this.source.onload = null;
      this.source.onerror = null;
      _super.prototype.dispose.call(this);
      if (this.bitmap) {
        this.bitmap.close();
        this.bitmap = null;
      }
      this._process = null;
      this._load = null;
    };
    ImageResource2.test = function(source) {
      return typeof source === "string" || source instanceof HTMLImageElement;
    };
    return ImageResource2;
  }(BaseImageResource);
  var SVGResource = function(_super) {
    __extends3(SVGResource2, _super);
    function SVGResource2(sourceBase64, options) {
      var _this = this;
      options = options || {};
      _this = _super.call(this, document.createElement("canvas")) || this;
      _this._width = 0;
      _this._height = 0;
      _this.svg = sourceBase64;
      _this.scale = options.scale || 1;
      _this._overrideWidth = options.width;
      _this._overrideHeight = options.height;
      _this._resolve = null;
      _this._crossorigin = options.crossorigin;
      _this._load = null;
      if (options.autoLoad !== false) {
        _this.load();
      }
      return _this;
    }
    SVGResource2.prototype.load = function() {
      var _this = this;
      if (this._load) {
        return this._load;
      }
      this._load = new Promise(function(resolve) {
        _this._resolve = function() {
          _this.resize(_this.source.width, _this.source.height);
          resolve(_this);
        };
        if (/^\<svg/.test(_this.svg.trim())) {
          if (!btoa) {
            throw new Error("Your browser doesn't support base64 conversions.");
          }
          _this.svg = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(_this.svg)));
        }
        _this._loadSvg();
      });
      return this._load;
    };
    SVGResource2.prototype._loadSvg = function() {
      var _this = this;
      var tempImage = new Image();
      BaseImageResource.crossOrigin(tempImage, this.svg, this._crossorigin);
      tempImage.src = this.svg;
      tempImage.onerror = function(event) {
        if (!_this._resolve) {
          return;
        }
        tempImage.onerror = null;
        _this.onError.emit(event);
      };
      tempImage.onload = function() {
        if (!_this._resolve) {
          return;
        }
        var svgWidth = tempImage.width;
        var svgHeight = tempImage.height;
        if (!svgWidth || !svgHeight) {
          throw new Error("The SVG image must have width and height defined (in pixels), canvas API needs them.");
        }
        var width = svgWidth * _this.scale;
        var height = svgHeight * _this.scale;
        if (_this._overrideWidth || _this._overrideHeight) {
          width = _this._overrideWidth || _this._overrideHeight / svgHeight * svgWidth;
          height = _this._overrideHeight || _this._overrideWidth / svgWidth * svgHeight;
        }
        width = Math.round(width);
        height = Math.round(height);
        var canvas2 = _this.source;
        canvas2.width = width;
        canvas2.height = height;
        canvas2._pixiId = "canvas_" + uid();
        canvas2.getContext("2d").drawImage(tempImage, 0, 0, svgWidth, svgHeight, 0, 0, width, height);
        _this._resolve();
        _this._resolve = null;
      };
    };
    SVGResource2.getSize = function(svgString) {
      var sizeMatch = SVGResource2.SVG_SIZE.exec(svgString);
      var size2 = {};
      if (sizeMatch) {
        size2[sizeMatch[1]] = Math.round(parseFloat(sizeMatch[3]));
        size2[sizeMatch[5]] = Math.round(parseFloat(sizeMatch[7]));
      }
      return size2;
    };
    SVGResource2.prototype.dispose = function() {
      _super.prototype.dispose.call(this);
      this._resolve = null;
      this._crossorigin = null;
    };
    SVGResource2.test = function(source, extension) {
      return extension === "svg" || typeof source === "string" && source.indexOf("data:image/svg+xml;base64") === 0 || typeof source === "string" && source.indexOf("<svg") === 0;
    };
    SVGResource2.SVG_SIZE = /<svg[^>]*(?:\s(width|height)=('|")(\d*(?:\.\d+)?)(?:px)?('|"))[^>]*(?:\s(width|height)=('|")(\d*(?:\.\d+)?)(?:px)?('|"))[^>]*>/i;
    return SVGResource2;
  }(BaseImageResource);
  var VideoResource = function(_super) {
    __extends3(VideoResource2, _super);
    function VideoResource2(source, options) {
      var _this = this;
      options = options || {};
      if (!(source instanceof HTMLVideoElement)) {
        var videoElement = document.createElement("video");
        videoElement.setAttribute("preload", "auto");
        videoElement.setAttribute("webkit-playsinline", "");
        videoElement.setAttribute("playsinline", "");
        if (typeof source === "string") {
          source = [source];
        }
        var firstSrc = source[0].src || source[0];
        BaseImageResource.crossOrigin(videoElement, firstSrc, options.crossorigin);
        for (var i = 0; i < source.length; ++i) {
          var sourceElement = document.createElement("source");
          var _a2 = source[i], src = _a2.src, mime = _a2.mime;
          src = src || source[i];
          var baseSrc = src.split("?").shift().toLowerCase();
          var ext = baseSrc.substr(baseSrc.lastIndexOf(".") + 1);
          mime = mime || VideoResource2.MIME_TYPES[ext] || "video/" + ext;
          sourceElement.src = src;
          sourceElement.type = mime;
          videoElement.appendChild(sourceElement);
        }
        source = videoElement;
      }
      _this = _super.call(this, source) || this;
      _this.noSubImage = true;
      _this._autoUpdate = true;
      _this._isConnectedToTicker = false;
      _this._updateFPS = options.updateFPS || 0;
      _this._msToNextUpdate = 0;
      _this.autoPlay = options.autoPlay !== false;
      _this._load = null;
      _this._resolve = null;
      _this._onCanPlay = _this._onCanPlay.bind(_this);
      _this._onError = _this._onError.bind(_this);
      if (options.autoLoad !== false) {
        _this.load();
      }
      return _this;
    }
    VideoResource2.prototype.update = function(_deltaTime) {
      if (_deltaTime === void 0) {
        _deltaTime = 0;
      }
      if (!this.destroyed) {
        var elapsedMS = Ticker.shared.elapsedMS * this.source.playbackRate;
        this._msToNextUpdate = Math.floor(this._msToNextUpdate - elapsedMS);
        if (!this._updateFPS || this._msToNextUpdate <= 0) {
          _super.prototype.update.call(this);
          this._msToNextUpdate = this._updateFPS ? Math.floor(1e3 / this._updateFPS) : 0;
        }
      }
    };
    VideoResource2.prototype.load = function() {
      var _this = this;
      if (this._load) {
        return this._load;
      }
      var source = this.source;
      if ((source.readyState === source.HAVE_ENOUGH_DATA || source.readyState === source.HAVE_FUTURE_DATA) && source.width && source.height) {
        source.complete = true;
      }
      source.addEventListener("play", this._onPlayStart.bind(this));
      source.addEventListener("pause", this._onPlayStop.bind(this));
      if (!this._isSourceReady()) {
        source.addEventListener("canplay", this._onCanPlay);
        source.addEventListener("canplaythrough", this._onCanPlay);
        source.addEventListener("error", this._onError, true);
      } else {
        this._onCanPlay();
      }
      this._load = new Promise(function(resolve) {
        if (_this.valid) {
          resolve(_this);
        } else {
          _this._resolve = resolve;
          source.load();
        }
      });
      return this._load;
    };
    VideoResource2.prototype._onError = function(event) {
      this.source.removeEventListener("error", this._onError, true);
      this.onError.emit(event);
    };
    VideoResource2.prototype._isSourcePlaying = function() {
      var source = this.source;
      return source.currentTime > 0 && source.paused === false && source.ended === false && source.readyState > 2;
    };
    VideoResource2.prototype._isSourceReady = function() {
      var source = this.source;
      return source.readyState === 3 || source.readyState === 4;
    };
    VideoResource2.prototype._onPlayStart = function() {
      if (!this.valid) {
        this._onCanPlay();
      }
      if (this.autoUpdate && !this._isConnectedToTicker) {
        Ticker.shared.add(this.update, this);
        this._isConnectedToTicker = true;
      }
    };
    VideoResource2.prototype._onPlayStop = function() {
      if (this._isConnectedToTicker) {
        Ticker.shared.remove(this.update, this);
        this._isConnectedToTicker = false;
      }
    };
    VideoResource2.prototype._onCanPlay = function() {
      var source = this.source;
      source.removeEventListener("canplay", this._onCanPlay);
      source.removeEventListener("canplaythrough", this._onCanPlay);
      var valid = this.valid;
      this.resize(source.videoWidth, source.videoHeight);
      if (!valid && this._resolve) {
        this._resolve(this);
        this._resolve = null;
      }
      if (this._isSourcePlaying()) {
        this._onPlayStart();
      } else if (this.autoPlay) {
        source.play();
      }
    };
    VideoResource2.prototype.dispose = function() {
      if (this._isConnectedToTicker) {
        Ticker.shared.remove(this.update, this);
      }
      var source = this.source;
      if (source) {
        source.removeEventListener("error", this._onError, true);
        source.pause();
        source.src = "";
        source.load();
      }
      _super.prototype.dispose.call(this);
    };
    Object.defineProperty(VideoResource2.prototype, "autoUpdate", {
      get: function() {
        return this._autoUpdate;
      },
      set: function(value) {
        if (value !== this._autoUpdate) {
          this._autoUpdate = value;
          if (!this._autoUpdate && this._isConnectedToTicker) {
            Ticker.shared.remove(this.update, this);
            this._isConnectedToTicker = false;
          } else if (this._autoUpdate && !this._isConnectedToTicker && this._isSourcePlaying()) {
            Ticker.shared.add(this.update, this);
            this._isConnectedToTicker = true;
          }
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(VideoResource2.prototype, "updateFPS", {
      get: function() {
        return this._updateFPS;
      },
      set: function(value) {
        if (value !== this._updateFPS) {
          this._updateFPS = value;
        }
      },
      enumerable: false,
      configurable: true
    });
    VideoResource2.test = function(source, extension) {
      return source instanceof HTMLVideoElement || VideoResource2.TYPES.indexOf(extension) > -1;
    };
    VideoResource2.TYPES = ["mp4", "m4v", "webm", "ogg", "ogv", "h264", "avi", "mov"];
    VideoResource2.MIME_TYPES = {
      ogv: "video/ogg",
      mov: "video/quicktime",
      m4v: "video/mp4"
    };
    return VideoResource2;
  }(BaseImageResource);
  var ImageBitmapResource = function(_super) {
    __extends3(ImageBitmapResource2, _super);
    function ImageBitmapResource2() {
      return _super !== null && _super.apply(this, arguments) || this;
    }
    ImageBitmapResource2.test = function(source) {
      return !!window.createImageBitmap && source instanceof ImageBitmap;
    };
    return ImageBitmapResource2;
  }(BaseImageResource);
  INSTALLED.push(ImageResource, ImageBitmapResource, CanvasResource, VideoResource, SVGResource, BufferResource, CubeResource, ArrayResource);
  var System = function() {
    function System2(renderer) {
      this.renderer = renderer;
    }
    System2.prototype.destroy = function() {
      this.renderer = null;
    };
    return System2;
  }();
  var DepthResource = function(_super) {
    __extends3(DepthResource2, _super);
    function DepthResource2() {
      return _super !== null && _super.apply(this, arguments) || this;
    }
    DepthResource2.prototype.upload = function(renderer, baseTexture, glTexture) {
      var gl = renderer.gl;
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, baseTexture.alphaMode === ALPHA_MODES.UNPACK);
      if (glTexture.width === baseTexture.width && glTexture.height === baseTexture.height) {
        gl.texSubImage2D(baseTexture.target, 0, 0, 0, baseTexture.width, baseTexture.height, baseTexture.format, baseTexture.type, this.data);
      } else {
        glTexture.width = baseTexture.width;
        glTexture.height = baseTexture.height;
        gl.texImage2D(baseTexture.target, 0, renderer.context.webGLVersion === 1 ? gl.DEPTH_COMPONENT : gl.DEPTH_COMPONENT16, baseTexture.width, baseTexture.height, 0, baseTexture.format, baseTexture.type, this.data);
      }
      return true;
    };
    return DepthResource2;
  }(BufferResource);
  var Framebuffer = function() {
    function Framebuffer2(width, height) {
      this.width = Math.ceil(width || 100);
      this.height = Math.ceil(height || 100);
      this.stencil = false;
      this.depth = false;
      this.dirtyId = 0;
      this.dirtyFormat = 0;
      this.dirtySize = 0;
      this.depthTexture = null;
      this.colorTextures = [];
      this.glFramebuffers = {};
      this.disposeRunner = new Runner("disposeFramebuffer");
      this.multisample = MSAA_QUALITY.NONE;
    }
    Object.defineProperty(Framebuffer2.prototype, "colorTexture", {
      get: function() {
        return this.colorTextures[0];
      },
      enumerable: false,
      configurable: true
    });
    Framebuffer2.prototype.addColorTexture = function(index2, texture) {
      if (index2 === void 0) {
        index2 = 0;
      }
      this.colorTextures[index2] = texture || new BaseTexture(null, {
        scaleMode: SCALE_MODES.NEAREST,
        resolution: 1,
        mipmap: MIPMAP_MODES.OFF,
        width: this.width,
        height: this.height
      });
      this.dirtyId++;
      this.dirtyFormat++;
      return this;
    };
    Framebuffer2.prototype.addDepthTexture = function(texture) {
      this.depthTexture = texture || new BaseTexture(new DepthResource(null, {width: this.width, height: this.height}), {
        scaleMode: SCALE_MODES.NEAREST,
        resolution: 1,
        width: this.width,
        height: this.height,
        mipmap: MIPMAP_MODES.OFF,
        format: FORMATS.DEPTH_COMPONENT,
        type: TYPES.UNSIGNED_SHORT
      });
      this.dirtyId++;
      this.dirtyFormat++;
      return this;
    };
    Framebuffer2.prototype.enableDepth = function() {
      this.depth = true;
      this.dirtyId++;
      this.dirtyFormat++;
      return this;
    };
    Framebuffer2.prototype.enableStencil = function() {
      this.stencil = true;
      this.dirtyId++;
      this.dirtyFormat++;
      return this;
    };
    Framebuffer2.prototype.resize = function(width, height) {
      width = Math.ceil(width);
      height = Math.ceil(height);
      if (width === this.width && height === this.height) {
        return;
      }
      this.width = width;
      this.height = height;
      this.dirtyId++;
      this.dirtySize++;
      for (var i = 0; i < this.colorTextures.length; i++) {
        var texture = this.colorTextures[i];
        var resolution = texture.resolution;
        texture.setSize(width / resolution, height / resolution);
      }
      if (this.depthTexture) {
        var resolution = this.depthTexture.resolution;
        this.depthTexture.setSize(width / resolution, height / resolution);
      }
    };
    Framebuffer2.prototype.dispose = function() {
      this.disposeRunner.emit(this, false);
    };
    Framebuffer2.prototype.destroyDepthTexture = function() {
      if (this.depthTexture) {
        this.depthTexture.destroy();
        this.depthTexture = null;
        ++this.dirtyId;
        ++this.dirtyFormat;
      }
    };
    return Framebuffer2;
  }();
  var BaseRenderTexture = function(_super) {
    __extends3(BaseRenderTexture2, _super);
    function BaseRenderTexture2(options) {
      var _this = this;
      if (typeof options === "number") {
        var width_1 = arguments[0];
        var height_1 = arguments[1];
        var scaleMode = arguments[2];
        var resolution = arguments[3];
        options = {width: width_1, height: height_1, scaleMode, resolution};
      }
      _this = _super.call(this, null, options) || this;
      var _a2 = options || {}, width = _a2.width, height = _a2.height;
      _this.mipmap = 0;
      _this.width = Math.ceil(width) || 100;
      _this.height = Math.ceil(height) || 100;
      _this.valid = true;
      _this.clearColor = [0, 0, 0, 0];
      _this.framebuffer = new Framebuffer(_this.width * _this.resolution, _this.height * _this.resolution).addColorTexture(0, _this);
      _this.maskStack = [];
      _this.filterStack = [{}];
      return _this;
    }
    BaseRenderTexture2.prototype.resize = function(width, height) {
      width = Math.ceil(width);
      height = Math.ceil(height);
      this.framebuffer.resize(width * this.resolution, height * this.resolution);
    };
    BaseRenderTexture2.prototype.dispose = function() {
      this.framebuffer.dispose();
      _super.prototype.dispose.call(this);
    };
    BaseRenderTexture2.prototype.destroy = function() {
      _super.prototype.destroy.call(this);
      this.framebuffer.destroyDepthTexture();
      this.framebuffer = null;
    };
    return BaseRenderTexture2;
  }(BaseTexture);
  var TextureUvs = function() {
    function TextureUvs2() {
      this.x0 = 0;
      this.y0 = 0;
      this.x1 = 1;
      this.y1 = 0;
      this.x2 = 1;
      this.y2 = 1;
      this.x3 = 0;
      this.y3 = 1;
      this.uvsFloat32 = new Float32Array(8);
    }
    TextureUvs2.prototype.set = function(frame, baseFrame, rotate) {
      var tw = baseFrame.width;
      var th = baseFrame.height;
      if (rotate) {
        var w2 = frame.width / 2 / tw;
        var h2 = frame.height / 2 / th;
        var cX = frame.x / tw + w2;
        var cY = frame.y / th + h2;
        rotate = groupD8.add(rotate, groupD8.NW);
        this.x0 = cX + w2 * groupD8.uX(rotate);
        this.y0 = cY + h2 * groupD8.uY(rotate);
        rotate = groupD8.add(rotate, 2);
        this.x1 = cX + w2 * groupD8.uX(rotate);
        this.y1 = cY + h2 * groupD8.uY(rotate);
        rotate = groupD8.add(rotate, 2);
        this.x2 = cX + w2 * groupD8.uX(rotate);
        this.y2 = cY + h2 * groupD8.uY(rotate);
        rotate = groupD8.add(rotate, 2);
        this.x3 = cX + w2 * groupD8.uX(rotate);
        this.y3 = cY + h2 * groupD8.uY(rotate);
      } else {
        this.x0 = frame.x / tw;
        this.y0 = frame.y / th;
        this.x1 = (frame.x + frame.width) / tw;
        this.y1 = frame.y / th;
        this.x2 = (frame.x + frame.width) / tw;
        this.y2 = (frame.y + frame.height) / th;
        this.x3 = frame.x / tw;
        this.y3 = (frame.y + frame.height) / th;
      }
      this.uvsFloat32[0] = this.x0;
      this.uvsFloat32[1] = this.y0;
      this.uvsFloat32[2] = this.x1;
      this.uvsFloat32[3] = this.y1;
      this.uvsFloat32[4] = this.x2;
      this.uvsFloat32[5] = this.y2;
      this.uvsFloat32[6] = this.x3;
      this.uvsFloat32[7] = this.y3;
    };
    return TextureUvs2;
  }();
  var DEFAULT_UVS = new TextureUvs();
  var Texture = function(_super) {
    __extends3(Texture2, _super);
    function Texture2(baseTexture, frame, orig, trim, rotate, anchor) {
      var _this = _super.call(this) || this;
      _this.noFrame = false;
      if (!frame) {
        _this.noFrame = true;
        frame = new Rectangle(0, 0, 1, 1);
      }
      if (baseTexture instanceof Texture2) {
        baseTexture = baseTexture.baseTexture;
      }
      _this.baseTexture = baseTexture;
      _this._frame = frame;
      _this.trim = trim;
      _this.valid = false;
      _this._uvs = DEFAULT_UVS;
      _this.uvMatrix = null;
      _this.orig = orig || frame;
      _this._rotate = Number(rotate || 0);
      if (rotate === true) {
        _this._rotate = 2;
      } else if (_this._rotate % 2 !== 0) {
        throw new Error("attempt to use diamond-shaped UVs. If you are sure, set rotation manually");
      }
      _this.defaultAnchor = anchor ? new Point(anchor.x, anchor.y) : new Point(0, 0);
      _this._updateID = 0;
      _this.textureCacheIds = [];
      if (!baseTexture.valid) {
        baseTexture.once("loaded", _this.onBaseTextureUpdated, _this);
      } else if (_this.noFrame) {
        if (baseTexture.valid) {
          _this.onBaseTextureUpdated(baseTexture);
        }
      } else {
        _this.frame = frame;
      }
      if (_this.noFrame) {
        baseTexture.on("update", _this.onBaseTextureUpdated, _this);
      }
      return _this;
    }
    Texture2.prototype.update = function() {
      if (this.baseTexture.resource) {
        this.baseTexture.resource.update();
      }
    };
    Texture2.prototype.onBaseTextureUpdated = function(baseTexture) {
      if (this.noFrame) {
        if (!this.baseTexture.valid) {
          return;
        }
        this._frame.width = baseTexture.width;
        this._frame.height = baseTexture.height;
        this.valid = true;
        this.updateUvs();
      } else {
        this.frame = this._frame;
      }
      this.emit("update", this);
    };
    Texture2.prototype.destroy = function(destroyBase) {
      if (this.baseTexture) {
        if (destroyBase) {
          var resource = this.baseTexture;
          if (resource && resource.url && TextureCache[resource.url]) {
            Texture2.removeFromCache(resource.url);
          }
          this.baseTexture.destroy();
        }
        this.baseTexture.off("loaded", this.onBaseTextureUpdated, this);
        this.baseTexture.off("update", this.onBaseTextureUpdated, this);
        this.baseTexture = null;
      }
      this._frame = null;
      this._uvs = null;
      this.trim = null;
      this.orig = null;
      this.valid = false;
      Texture2.removeFromCache(this);
      this.textureCacheIds = null;
    };
    Texture2.prototype.clone = function() {
      return new Texture2(this.baseTexture, this.frame.clone(), this.orig.clone(), this.trim && this.trim.clone(), this.rotate, this.defaultAnchor);
    };
    Texture2.prototype.updateUvs = function() {
      if (this._uvs === DEFAULT_UVS) {
        this._uvs = new TextureUvs();
      }
      this._uvs.set(this._frame, this.baseTexture, this.rotate);
      this._updateID++;
    };
    Texture2.from = function(source, options, strict) {
      if (options === void 0) {
        options = {};
      }
      if (strict === void 0) {
        strict = settings.STRICT_TEXTURE_CACHE;
      }
      var isFrame = typeof source === "string";
      var cacheId = null;
      if (isFrame) {
        cacheId = source;
      } else {
        if (!source._pixiId) {
          source._pixiId = "pixiid_" + uid();
        }
        cacheId = source._pixiId;
      }
      var texture = TextureCache[cacheId];
      if (isFrame && strict && !texture) {
        throw new Error('The cacheId "' + cacheId + '" does not exist in TextureCache.');
      }
      if (!texture) {
        if (!options.resolution) {
          options.resolution = getResolutionOfUrl(source);
        }
        texture = new Texture2(new BaseTexture(source, options));
        texture.baseTexture.cacheId = cacheId;
        BaseTexture.addToCache(texture.baseTexture, cacheId);
        Texture2.addToCache(texture, cacheId);
      }
      return texture;
    };
    Texture2.fromURL = function(url3, options) {
      var resourceOptions = Object.assign({autoLoad: false}, options === null || options === void 0 ? void 0 : options.resourceOptions);
      var texture = Texture2.from(url3, Object.assign({resourceOptions}, options), false);
      var resource = texture.baseTexture.resource;
      if (texture.baseTexture.valid) {
        return Promise.resolve(texture);
      }
      return resource.load().then(function() {
        return Promise.resolve(texture);
      });
    };
    Texture2.fromBuffer = function(buffer, width, height, options) {
      return new Texture2(BaseTexture.fromBuffer(buffer, width, height, options));
    };
    Texture2.fromLoader = function(source, imageUrl, name) {
      var resource = new ImageResource(source);
      resource.url = imageUrl;
      var baseTexture = new BaseTexture(resource, {
        scaleMode: settings.SCALE_MODE,
        resolution: getResolutionOfUrl(imageUrl)
      });
      var texture = new Texture2(baseTexture);
      if (!name) {
        name = imageUrl;
      }
      BaseTexture.addToCache(texture.baseTexture, name);
      Texture2.addToCache(texture, name);
      if (name !== imageUrl) {
        BaseTexture.addToCache(texture.baseTexture, imageUrl);
        Texture2.addToCache(texture, imageUrl);
      }
      return texture;
    };
    Texture2.addToCache = function(texture, id) {
      if (id) {
        if (texture.textureCacheIds.indexOf(id) === -1) {
          texture.textureCacheIds.push(id);
        }
        if (TextureCache[id]) {
          console.warn("Texture added to the cache with an id [" + id + "] that already had an entry");
        }
        TextureCache[id] = texture;
      }
    };
    Texture2.removeFromCache = function(texture) {
      if (typeof texture === "string") {
        var textureFromCache = TextureCache[texture];
        if (textureFromCache) {
          var index2 = textureFromCache.textureCacheIds.indexOf(texture);
          if (index2 > -1) {
            textureFromCache.textureCacheIds.splice(index2, 1);
          }
          delete TextureCache[texture];
          return textureFromCache;
        }
      } else if (texture && texture.textureCacheIds) {
        for (var i = 0; i < texture.textureCacheIds.length; ++i) {
          if (TextureCache[texture.textureCacheIds[i]] === texture) {
            delete TextureCache[texture.textureCacheIds[i]];
          }
        }
        texture.textureCacheIds.length = 0;
        return texture;
      }
      return null;
    };
    Object.defineProperty(Texture2.prototype, "resolution", {
      get: function() {
        return this.baseTexture.resolution;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Texture2.prototype, "frame", {
      get: function() {
        return this._frame;
      },
      set: function(frame) {
        this._frame = frame;
        this.noFrame = false;
        var x = frame.x, y = frame.y, width = frame.width, height = frame.height;
        var xNotFit = x + width > this.baseTexture.width;
        var yNotFit = y + height > this.baseTexture.height;
        if (xNotFit || yNotFit) {
          var relationship = xNotFit && yNotFit ? "and" : "or";
          var errorX = "X: " + x + " + " + width + " = " + (x + width) + " > " + this.baseTexture.width;
          var errorY = "Y: " + y + " + " + height + " = " + (y + height) + " > " + this.baseTexture.height;
          throw new Error("Texture Error: frame does not fit inside the base Texture dimensions: " + (errorX + " " + relationship + " " + errorY));
        }
        this.valid = width && height && this.baseTexture.valid;
        if (!this.trim && !this.rotate) {
          this.orig = frame;
        }
        if (this.valid) {
          this.updateUvs();
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Texture2.prototype, "rotate", {
      get: function() {
        return this._rotate;
      },
      set: function(rotate) {
        this._rotate = rotate;
        if (this.valid) {
          this.updateUvs();
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Texture2.prototype, "width", {
      get: function() {
        return this.orig.width;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Texture2.prototype, "height", {
      get: function() {
        return this.orig.height;
      },
      enumerable: false,
      configurable: true
    });
    Texture2.prototype.castToBaseTexture = function() {
      return this.baseTexture;
    };
    return Texture2;
  }(eventemitter3.default);
  function createWhiteTexture() {
    var canvas2 = document.createElement("canvas");
    canvas2.width = 16;
    canvas2.height = 16;
    var context2 = canvas2.getContext("2d");
    context2.fillStyle = "white";
    context2.fillRect(0, 0, 16, 16);
    return new Texture(new BaseTexture(new CanvasResource(canvas2)));
  }
  function removeAllHandlers(tex) {
    tex.destroy = function _emptyDestroy() {
    };
    tex.on = function _emptyOn() {
    };
    tex.once = function _emptyOnce() {
    };
    tex.emit = function _emptyEmit() {
    };
  }
  Texture.EMPTY = new Texture(new BaseTexture());
  removeAllHandlers(Texture.EMPTY);
  removeAllHandlers(Texture.EMPTY.baseTexture);
  Texture.WHITE = createWhiteTexture();
  removeAllHandlers(Texture.WHITE);
  removeAllHandlers(Texture.WHITE.baseTexture);
  var RenderTexture = function(_super) {
    __extends3(RenderTexture2, _super);
    function RenderTexture2(baseRenderTexture, frame) {
      var _this = this;
      var _legacyRenderer = null;
      if (!(baseRenderTexture instanceof BaseRenderTexture)) {
        var width = arguments[1];
        var height = arguments[2];
        var scaleMode = arguments[3];
        var resolution = arguments[4];
        console.warn("Please use RenderTexture.create(" + width + ", " + height + ") instead of the ctor directly.");
        _legacyRenderer = arguments[0];
        frame = null;
        baseRenderTexture = new BaseRenderTexture({
          width,
          height,
          scaleMode,
          resolution
        });
      }
      _this = _super.call(this, baseRenderTexture, frame) || this;
      _this.legacyRenderer = _legacyRenderer;
      _this.valid = true;
      _this.filterFrame = null;
      _this.filterPoolKey = null;
      _this.updateUvs();
      return _this;
    }
    Object.defineProperty(RenderTexture2.prototype, "framebuffer", {
      get: function() {
        return this.baseTexture.framebuffer;
      },
      enumerable: false,
      configurable: true
    });
    RenderTexture2.prototype.resize = function(width, height, resizeBaseTexture) {
      if (resizeBaseTexture === void 0) {
        resizeBaseTexture = true;
      }
      width = Math.ceil(width);
      height = Math.ceil(height);
      this.valid = width > 0 && height > 0;
      this._frame.width = this.orig.width = width;
      this._frame.height = this.orig.height = height;
      if (resizeBaseTexture) {
        this.baseTexture.resize(width, height);
      }
      this.updateUvs();
    };
    RenderTexture2.prototype.setResolution = function(resolution) {
      var baseTexture = this.baseTexture;
      if (baseTexture.resolution === resolution) {
        return;
      }
      baseTexture.setResolution(resolution);
      this.resize(baseTexture.width, baseTexture.height, false);
    };
    RenderTexture2.create = function(options) {
      if (typeof options === "number") {
        options = {
          width: options,
          height: arguments[1],
          scaleMode: arguments[2],
          resolution: arguments[3]
        };
      }
      return new RenderTexture2(new BaseRenderTexture(options));
    };
    return RenderTexture2;
  }(Texture);
  var RenderTexturePool = function() {
    function RenderTexturePool2(textureOptions) {
      this.texturePool = {};
      this.textureOptions = textureOptions || {};
      this.enableFullScreen = false;
      this._pixelsWidth = 0;
      this._pixelsHeight = 0;
    }
    RenderTexturePool2.prototype.createTexture = function(realWidth, realHeight) {
      var baseRenderTexture = new BaseRenderTexture(Object.assign({
        width: realWidth,
        height: realHeight,
        resolution: 1
      }, this.textureOptions));
      return new RenderTexture(baseRenderTexture);
    };
    RenderTexturePool2.prototype.getOptimalTexture = function(minWidth, minHeight, resolution) {
      if (resolution === void 0) {
        resolution = 1;
      }
      var key = RenderTexturePool2.SCREEN_KEY;
      minWidth *= resolution;
      minHeight *= resolution;
      if (!this.enableFullScreen || minWidth !== this._pixelsWidth || minHeight !== this._pixelsHeight) {
        minWidth = nextPow2(minWidth);
        minHeight = nextPow2(minHeight);
        key = (minWidth & 65535) << 16 | minHeight & 65535;
      }
      if (!this.texturePool[key]) {
        this.texturePool[key] = [];
      }
      var renderTexture = this.texturePool[key].pop();
      if (!renderTexture) {
        renderTexture = this.createTexture(minWidth, minHeight);
      }
      renderTexture.filterPoolKey = key;
      renderTexture.setResolution(resolution);
      return renderTexture;
    };
    RenderTexturePool2.prototype.getFilterTexture = function(input3, resolution) {
      var filterTexture = this.getOptimalTexture(input3.width, input3.height, resolution || input3.resolution);
      filterTexture.filterFrame = input3.filterFrame;
      return filterTexture;
    };
    RenderTexturePool2.prototype.returnTexture = function(renderTexture) {
      var key = renderTexture.filterPoolKey;
      renderTexture.filterFrame = null;
      this.texturePool[key].push(renderTexture);
    };
    RenderTexturePool2.prototype.returnFilterTexture = function(renderTexture) {
      this.returnTexture(renderTexture);
    };
    RenderTexturePool2.prototype.clear = function(destroyTextures) {
      destroyTextures = destroyTextures !== false;
      if (destroyTextures) {
        for (var i in this.texturePool) {
          var textures = this.texturePool[i];
          if (textures) {
            for (var j = 0; j < textures.length; j++) {
              textures[j].destroy(true);
            }
          }
        }
      }
      this.texturePool = {};
    };
    RenderTexturePool2.prototype.setScreenSize = function(size2) {
      if (size2.width === this._pixelsWidth && size2.height === this._pixelsHeight) {
        return;
      }
      var screenKey = RenderTexturePool2.SCREEN_KEY;
      var textures = this.texturePool[screenKey];
      this.enableFullScreen = size2.width > 0 && size2.height > 0;
      if (textures) {
        for (var j = 0; j < textures.length; j++) {
          textures[j].destroy(true);
        }
      }
      this.texturePool[screenKey] = [];
      this._pixelsWidth = size2.width;
      this._pixelsHeight = size2.height;
    };
    RenderTexturePool2.SCREEN_KEY = "screen";
    return RenderTexturePool2;
  }();
  var Attribute = function() {
    function Attribute2(buffer, size2, normalized, type, stride, start, instance) {
      if (size2 === void 0) {
        size2 = 0;
      }
      if (normalized === void 0) {
        normalized = false;
      }
      if (type === void 0) {
        type = 5126;
      }
      this.buffer = buffer;
      this.size = size2;
      this.normalized = normalized;
      this.type = type;
      this.stride = stride;
      this.start = start;
      this.instance = instance;
    }
    Attribute2.prototype.destroy = function() {
      this.buffer = null;
    };
    Attribute2.from = function(buffer, size2, normalized, type, stride) {
      return new Attribute2(buffer, size2, normalized, type, stride);
    };
    return Attribute2;
  }();
  var UID = 0;
  var Buffer2 = function() {
    function Buffer3(data, _static, index2) {
      if (_static === void 0) {
        _static = true;
      }
      if (index2 === void 0) {
        index2 = false;
      }
      this.data = data || new Float32Array(1);
      this._glBuffers = {};
      this._updateID = 0;
      this.index = index2;
      this.static = _static;
      this.id = UID++;
      this.disposeRunner = new Runner("disposeBuffer");
    }
    Buffer3.prototype.update = function(data) {
      this.data = data || this.data;
      this._updateID++;
    };
    Buffer3.prototype.dispose = function() {
      this.disposeRunner.emit(this, false);
    };
    Buffer3.prototype.destroy = function() {
      this.dispose();
      this.data = null;
    };
    Buffer3.from = function(data) {
      if (data instanceof Array) {
        data = new Float32Array(data);
      }
      return new Buffer3(data);
    };
    return Buffer3;
  }();
  function getBufferType(array) {
    if (array.BYTES_PER_ELEMENT === 4) {
      if (array instanceof Float32Array) {
        return "Float32Array";
      } else if (array instanceof Uint32Array) {
        return "Uint32Array";
      }
      return "Int32Array";
    } else if (array.BYTES_PER_ELEMENT === 2) {
      if (array instanceof Uint16Array) {
        return "Uint16Array";
      }
    } else if (array.BYTES_PER_ELEMENT === 1) {
      if (array instanceof Uint8Array) {
        return "Uint8Array";
      }
    }
    return null;
  }
  var map2 = {
    Float32Array,
    Uint32Array,
    Int32Array,
    Uint8Array
  };
  function interleaveTypedArrays(arrays, sizes) {
    var outSize = 0;
    var stride = 0;
    var views = {};
    for (var i = 0; i < arrays.length; i++) {
      stride += sizes[i];
      outSize += arrays[i].length;
    }
    var buffer = new ArrayBuffer(outSize * 4);
    var out = null;
    var littleOffset = 0;
    for (var i = 0; i < arrays.length; i++) {
      var size2 = sizes[i];
      var array = arrays[i];
      var type = getBufferType(array);
      if (!views[type]) {
        views[type] = new map2[type](buffer);
      }
      out = views[type];
      for (var j = 0; j < array.length; j++) {
        var indexStart = (j / size2 | 0) * stride + littleOffset;
        var index2 = j % size2;
        out[indexStart + index2] = array[j];
      }
      littleOffset += size2;
    }
    return new Float32Array(buffer);
  }
  var byteSizeMap = {5126: 4, 5123: 2, 5121: 1};
  var UID$1 = 0;
  var map$1 = {
    Float32Array,
    Uint32Array,
    Int32Array,
    Uint8Array,
    Uint16Array
  };
  var Geometry = function() {
    function Geometry2(buffers, attributes) {
      if (buffers === void 0) {
        buffers = [];
      }
      if (attributes === void 0) {
        attributes = {};
      }
      this.buffers = buffers;
      this.indexBuffer = null;
      this.attributes = attributes;
      this.glVertexArrayObjects = {};
      this.id = UID$1++;
      this.instanced = false;
      this.instanceCount = 1;
      this.disposeRunner = new Runner("disposeGeometry");
      this.refCount = 0;
    }
    Geometry2.prototype.addAttribute = function(id, buffer, size2, normalized, type, stride, start, instance) {
      if (size2 === void 0) {
        size2 = 0;
      }
      if (normalized === void 0) {
        normalized = false;
      }
      if (instance === void 0) {
        instance = false;
      }
      if (!buffer) {
        throw new Error("You must pass a buffer when creating an attribute");
      }
      if (!(buffer instanceof Buffer2)) {
        if (buffer instanceof Array) {
          buffer = new Float32Array(buffer);
        }
        buffer = new Buffer2(buffer);
      }
      var ids = id.split("|");
      if (ids.length > 1) {
        for (var i = 0; i < ids.length; i++) {
          this.addAttribute(ids[i], buffer, size2, normalized, type);
        }
        return this;
      }
      var bufferIndex = this.buffers.indexOf(buffer);
      if (bufferIndex === -1) {
        this.buffers.push(buffer);
        bufferIndex = this.buffers.length - 1;
      }
      this.attributes[id] = new Attribute(bufferIndex, size2, normalized, type, stride, start, instance);
      this.instanced = this.instanced || instance;
      return this;
    };
    Geometry2.prototype.getAttribute = function(id) {
      return this.attributes[id];
    };
    Geometry2.prototype.getBuffer = function(id) {
      return this.buffers[this.getAttribute(id).buffer];
    };
    Geometry2.prototype.addIndex = function(buffer) {
      if (!(buffer instanceof Buffer2)) {
        if (buffer instanceof Array) {
          buffer = new Uint16Array(buffer);
        }
        buffer = new Buffer2(buffer);
      }
      buffer.index = true;
      this.indexBuffer = buffer;
      if (this.buffers.indexOf(buffer) === -1) {
        this.buffers.push(buffer);
      }
      return this;
    };
    Geometry2.prototype.getIndex = function() {
      return this.indexBuffer;
    };
    Geometry2.prototype.interleave = function() {
      if (this.buffers.length === 1 || this.buffers.length === 2 && this.indexBuffer) {
        return this;
      }
      var arrays = [];
      var sizes = [];
      var interleavedBuffer = new Buffer2();
      var i;
      for (i in this.attributes) {
        var attribute = this.attributes[i];
        var buffer = this.buffers[attribute.buffer];
        arrays.push(buffer.data);
        sizes.push(attribute.size * byteSizeMap[attribute.type] / 4);
        attribute.buffer = 0;
      }
      interleavedBuffer.data = interleaveTypedArrays(arrays, sizes);
      for (i = 0; i < this.buffers.length; i++) {
        if (this.buffers[i] !== this.indexBuffer) {
          this.buffers[i].destroy();
        }
      }
      this.buffers = [interleavedBuffer];
      if (this.indexBuffer) {
        this.buffers.push(this.indexBuffer);
      }
      return this;
    };
    Geometry2.prototype.getSize = function() {
      for (var i in this.attributes) {
        var attribute = this.attributes[i];
        var buffer = this.buffers[attribute.buffer];
        return buffer.data.length / (attribute.stride / 4 || attribute.size);
      }
      return 0;
    };
    Geometry2.prototype.dispose = function() {
      this.disposeRunner.emit(this, false);
    };
    Geometry2.prototype.destroy = function() {
      this.dispose();
      this.buffers = null;
      this.indexBuffer = null;
      this.attributes = null;
    };
    Geometry2.prototype.clone = function() {
      var geometry = new Geometry2();
      for (var i = 0; i < this.buffers.length; i++) {
        geometry.buffers[i] = new Buffer2(this.buffers[i].data.slice(0));
      }
      for (var i in this.attributes) {
        var attrib = this.attributes[i];
        geometry.attributes[i] = new Attribute(attrib.buffer, attrib.size, attrib.normalized, attrib.type, attrib.stride, attrib.start, attrib.instance);
      }
      if (this.indexBuffer) {
        geometry.indexBuffer = geometry.buffers[this.buffers.indexOf(this.indexBuffer)];
        geometry.indexBuffer.index = true;
      }
      return geometry;
    };
    Geometry2.merge = function(geometries) {
      var geometryOut = new Geometry2();
      var arrays = [];
      var sizes = [];
      var offsets = [];
      var geometry;
      for (var i = 0; i < geometries.length; i++) {
        geometry = geometries[i];
        for (var j = 0; j < geometry.buffers.length; j++) {
          sizes[j] = sizes[j] || 0;
          sizes[j] += geometry.buffers[j].data.length;
          offsets[j] = 0;
        }
      }
      for (var i = 0; i < geometry.buffers.length; i++) {
        arrays[i] = new map$1[getBufferType(geometry.buffers[i].data)](sizes[i]);
        geometryOut.buffers[i] = new Buffer2(arrays[i]);
      }
      for (var i = 0; i < geometries.length; i++) {
        geometry = geometries[i];
        for (var j = 0; j < geometry.buffers.length; j++) {
          arrays[j].set(geometry.buffers[j].data, offsets[j]);
          offsets[j] += geometry.buffers[j].data.length;
        }
      }
      geometryOut.attributes = geometry.attributes;
      if (geometry.indexBuffer) {
        geometryOut.indexBuffer = geometryOut.buffers[geometry.buffers.indexOf(geometry.indexBuffer)];
        geometryOut.indexBuffer.index = true;
        var offset = 0;
        var stride = 0;
        var offset2 = 0;
        var bufferIndexToCount = 0;
        for (var i = 0; i < geometry.buffers.length; i++) {
          if (geometry.buffers[i] !== geometry.indexBuffer) {
            bufferIndexToCount = i;
            break;
          }
        }
        for (var i in geometry.attributes) {
          var attribute = geometry.attributes[i];
          if ((attribute.buffer | 0) === bufferIndexToCount) {
            stride += attribute.size * byteSizeMap[attribute.type] / 4;
          }
        }
        for (var i = 0; i < geometries.length; i++) {
          var indexBufferData = geometries[i].indexBuffer.data;
          for (var j = 0; j < indexBufferData.length; j++) {
            geometryOut.indexBuffer.data[j + offset2] += offset;
          }
          offset += geometry.buffers[bufferIndexToCount].data.length / stride;
          offset2 += indexBufferData.length;
        }
      }
      return geometryOut;
    };
    return Geometry2;
  }();
  var Quad = function(_super) {
    __extends3(Quad2, _super);
    function Quad2() {
      var _this = _super.call(this) || this;
      _this.addAttribute("aVertexPosition", new Float32Array([
        0,
        0,
        1,
        0,
        1,
        1,
        0,
        1
      ])).addIndex([0, 1, 3, 2]);
      return _this;
    }
    return Quad2;
  }(Geometry);
  var QuadUv = function(_super) {
    __extends3(QuadUv2, _super);
    function QuadUv2() {
      var _this = _super.call(this) || this;
      _this.vertices = new Float32Array([
        -1,
        -1,
        1,
        -1,
        1,
        1,
        -1,
        1
      ]);
      _this.uvs = new Float32Array([
        0,
        0,
        1,
        0,
        1,
        1,
        0,
        1
      ]);
      _this.vertexBuffer = new Buffer2(_this.vertices);
      _this.uvBuffer = new Buffer2(_this.uvs);
      _this.addAttribute("aVertexPosition", _this.vertexBuffer).addAttribute("aTextureCoord", _this.uvBuffer).addIndex([0, 1, 2, 0, 2, 3]);
      return _this;
    }
    QuadUv2.prototype.map = function(targetTextureFrame, destinationFrame) {
      var x = 0;
      var y = 0;
      this.uvs[0] = x;
      this.uvs[1] = y;
      this.uvs[2] = x + destinationFrame.width / targetTextureFrame.width;
      this.uvs[3] = y;
      this.uvs[4] = x + destinationFrame.width / targetTextureFrame.width;
      this.uvs[5] = y + destinationFrame.height / targetTextureFrame.height;
      this.uvs[6] = x;
      this.uvs[7] = y + destinationFrame.height / targetTextureFrame.height;
      x = destinationFrame.x;
      y = destinationFrame.y;
      this.vertices[0] = x;
      this.vertices[1] = y;
      this.vertices[2] = x + destinationFrame.width;
      this.vertices[3] = y;
      this.vertices[4] = x + destinationFrame.width;
      this.vertices[5] = y + destinationFrame.height;
      this.vertices[6] = x;
      this.vertices[7] = y + destinationFrame.height;
      this.invalidate();
      return this;
    };
    QuadUv2.prototype.invalidate = function() {
      this.vertexBuffer._updateID++;
      this.uvBuffer._updateID++;
      return this;
    };
    return QuadUv2;
  }(Geometry);
  var UID$2 = 0;
  var UniformGroup = function() {
    function UniformGroup2(uniforms, _static) {
      this.uniforms = uniforms;
      this.group = true;
      this.syncUniforms = {};
      this.dirtyId = 0;
      this.id = UID$2++;
      this.static = !!_static;
    }
    UniformGroup2.prototype.update = function() {
      this.dirtyId++;
    };
    UniformGroup2.prototype.add = function(name, uniforms, _static) {
      this.uniforms[name] = new UniformGroup2(uniforms, _static);
    };
    UniformGroup2.from = function(uniforms, _static) {
      return new UniformGroup2(uniforms, _static);
    };
    return UniformGroup2;
  }();
  var FilterState = function() {
    function FilterState2() {
      this.renderTexture = null;
      this.target = null;
      this.legacy = false;
      this.resolution = 1;
      this.sourceFrame = new Rectangle();
      this.destinationFrame = new Rectangle();
      this.filters = [];
    }
    FilterState2.prototype.clear = function() {
      this.target = null;
      this.filters = null;
      this.renderTexture = null;
    };
    return FilterState2;
  }();
  var FilterSystem = function(_super) {
    __extends3(FilterSystem2, _super);
    function FilterSystem2(renderer) {
      var _this = _super.call(this, renderer) || this;
      _this.defaultFilterStack = [{}];
      _this.texturePool = new RenderTexturePool();
      _this.texturePool.setScreenSize(renderer.view);
      _this.statePool = [];
      _this.quad = new Quad();
      _this.quadUv = new QuadUv();
      _this.tempRect = new Rectangle();
      _this.activeState = {};
      _this.globalUniforms = new UniformGroup({
        outputFrame: _this.tempRect,
        inputSize: new Float32Array(4),
        inputPixel: new Float32Array(4),
        inputClamp: new Float32Array(4),
        resolution: 1,
        filterArea: new Float32Array(4),
        filterClamp: new Float32Array(4)
      }, true);
      _this.forceClear = false;
      _this.useMaxPadding = false;
      return _this;
    }
    FilterSystem2.prototype.push = function(target, filters2) {
      var renderer = this.renderer;
      var filterStack = this.defaultFilterStack;
      var state = this.statePool.pop() || new FilterState();
      var resolution = filters2[0].resolution;
      var padding = filters2[0].padding;
      var autoFit = filters2[0].autoFit;
      var legacy = filters2[0].legacy;
      for (var i = 1; i < filters2.length; i++) {
        var filter = filters2[i];
        resolution = Math.min(resolution, filter.resolution);
        padding = this.useMaxPadding ? Math.max(padding, filter.padding) : padding + filter.padding;
        autoFit = autoFit || filter.autoFit;
        legacy = legacy || filter.legacy;
      }
      if (filterStack.length === 1) {
        this.defaultFilterStack[0].renderTexture = renderer.renderTexture.current;
      }
      filterStack.push(state);
      state.resolution = resolution;
      state.legacy = legacy;
      state.target = target;
      state.sourceFrame.copyFrom(target.filterArea || target.getBounds(true));
      state.sourceFrame.pad(padding);
      if (autoFit) {
        state.sourceFrame.fit(this.renderer.renderTexture.sourceFrame);
      }
      state.sourceFrame.ceil(resolution);
      state.renderTexture = this.getOptimalFilterTexture(state.sourceFrame.width, state.sourceFrame.height, resolution);
      state.filters = filters2;
      state.destinationFrame.width = state.renderTexture.width;
      state.destinationFrame.height = state.renderTexture.height;
      var destinationFrame = this.tempRect;
      destinationFrame.width = state.sourceFrame.width;
      destinationFrame.height = state.sourceFrame.height;
      state.renderTexture.filterFrame = state.sourceFrame;
      renderer.renderTexture.bind(state.renderTexture, state.sourceFrame, destinationFrame);
      renderer.renderTexture.clear();
    };
    FilterSystem2.prototype.pop = function() {
      var filterStack = this.defaultFilterStack;
      var state = filterStack.pop();
      var filters2 = state.filters;
      this.activeState = state;
      var globalUniforms = this.globalUniforms.uniforms;
      globalUniforms.outputFrame = state.sourceFrame;
      globalUniforms.resolution = state.resolution;
      var inputSize = globalUniforms.inputSize;
      var inputPixel = globalUniforms.inputPixel;
      var inputClamp = globalUniforms.inputClamp;
      inputSize[0] = state.destinationFrame.width;
      inputSize[1] = state.destinationFrame.height;
      inputSize[2] = 1 / inputSize[0];
      inputSize[3] = 1 / inputSize[1];
      inputPixel[0] = inputSize[0] * state.resolution;
      inputPixel[1] = inputSize[1] * state.resolution;
      inputPixel[2] = 1 / inputPixel[0];
      inputPixel[3] = 1 / inputPixel[1];
      inputClamp[0] = 0.5 * inputPixel[2];
      inputClamp[1] = 0.5 * inputPixel[3];
      inputClamp[2] = state.sourceFrame.width * inputSize[2] - 0.5 * inputPixel[2];
      inputClamp[3] = state.sourceFrame.height * inputSize[3] - 0.5 * inputPixel[3];
      if (state.legacy) {
        var filterArea = globalUniforms.filterArea;
        filterArea[0] = state.destinationFrame.width;
        filterArea[1] = state.destinationFrame.height;
        filterArea[2] = state.sourceFrame.x;
        filterArea[3] = state.sourceFrame.y;
        globalUniforms.filterClamp = globalUniforms.inputClamp;
      }
      this.globalUniforms.update();
      var lastState = filterStack[filterStack.length - 1];
      if (state.renderTexture.framebuffer.multisample > 1) {
        this.renderer.framebuffer.blit();
      }
      if (filters2.length === 1) {
        filters2[0].apply(this, state.renderTexture, lastState.renderTexture, CLEAR_MODES.BLEND, state);
        this.returnFilterTexture(state.renderTexture);
      } else {
        var flip = state.renderTexture;
        var flop = this.getOptimalFilterTexture(flip.width, flip.height, state.resolution);
        flop.filterFrame = flip.filterFrame;
        var i = 0;
        for (i = 0; i < filters2.length - 1; ++i) {
          filters2[i].apply(this, flip, flop, CLEAR_MODES.CLEAR, state);
          var t = flip;
          flip = flop;
          flop = t;
        }
        filters2[i].apply(this, flip, lastState.renderTexture, CLEAR_MODES.BLEND, state);
        this.returnFilterTexture(flip);
        this.returnFilterTexture(flop);
      }
      state.clear();
      this.statePool.push(state);
    };
    FilterSystem2.prototype.bindAndClear = function(filterTexture, clearMode) {
      if (clearMode === void 0) {
        clearMode = CLEAR_MODES.CLEAR;
      }
      if (filterTexture && filterTexture.filterFrame) {
        var destinationFrame = this.tempRect;
        destinationFrame.width = filterTexture.filterFrame.width;
        destinationFrame.height = filterTexture.filterFrame.height;
        this.renderer.renderTexture.bind(filterTexture, filterTexture.filterFrame, destinationFrame);
      } else {
        this.renderer.renderTexture.bind(filterTexture);
      }
      if (typeof clearMode === "boolean") {
        clearMode = clearMode ? CLEAR_MODES.CLEAR : CLEAR_MODES.BLEND;
        deprecation("5.2.1", "Use CLEAR_MODES when using clear applyFilter option");
      }
      if (clearMode === CLEAR_MODES.CLEAR || clearMode === CLEAR_MODES.BLIT && this.forceClear) {
        this.renderer.renderTexture.clear();
      }
    };
    FilterSystem2.prototype.applyFilter = function(filter, input3, output, clearMode) {
      var renderer = this.renderer;
      this.bindAndClear(output, clearMode);
      filter.uniforms.uSampler = input3;
      filter.uniforms.filterGlobals = this.globalUniforms;
      renderer.state.set(filter.state);
      renderer.shader.bind(filter);
      if (filter.legacy) {
        this.quadUv.map(input3._frame, input3.filterFrame);
        renderer.geometry.bind(this.quadUv);
        renderer.geometry.draw(DRAW_MODES.TRIANGLES);
      } else {
        renderer.geometry.bind(this.quad);
        renderer.geometry.draw(DRAW_MODES.TRIANGLE_STRIP);
      }
    };
    FilterSystem2.prototype.calculateSpriteMatrix = function(outputMatrix, sprite5) {
      var _a2 = this.activeState, sourceFrame = _a2.sourceFrame, destinationFrame = _a2.destinationFrame;
      var orig = sprite5._texture.orig;
      var mappedMatrix = outputMatrix.set(destinationFrame.width, 0, 0, destinationFrame.height, sourceFrame.x, sourceFrame.y);
      var worldTransform = sprite5.worldTransform.copyTo(Matrix.TEMP_MATRIX);
      worldTransform.invert();
      mappedMatrix.prepend(worldTransform);
      mappedMatrix.scale(1 / orig.width, 1 / orig.height);
      mappedMatrix.translate(sprite5.anchor.x, sprite5.anchor.y);
      return mappedMatrix;
    };
    FilterSystem2.prototype.destroy = function() {
      this.texturePool.clear(false);
    };
    FilterSystem2.prototype.getOptimalFilterTexture = function(minWidth, minHeight, resolution) {
      if (resolution === void 0) {
        resolution = 1;
      }
      return this.texturePool.getOptimalTexture(minWidth, minHeight, resolution);
    };
    FilterSystem2.prototype.getFilterTexture = function(input3, resolution) {
      if (typeof input3 === "number") {
        var swap = input3;
        input3 = resolution;
        resolution = swap;
      }
      input3 = input3 || this.activeState.renderTexture;
      var filterTexture = this.texturePool.getOptimalTexture(input3.width, input3.height, resolution || input3.resolution);
      filterTexture.filterFrame = input3.filterFrame;
      return filterTexture;
    };
    FilterSystem2.prototype.returnFilterTexture = function(renderTexture) {
      this.texturePool.returnTexture(renderTexture);
    };
    FilterSystem2.prototype.emptyPool = function() {
      this.texturePool.clear(true);
    };
    FilterSystem2.prototype.resize = function() {
      this.texturePool.setScreenSize(this.renderer.view);
    };
    return FilterSystem2;
  }(System);
  var ObjectRenderer = function() {
    function ObjectRenderer2(renderer) {
      this.renderer = renderer;
    }
    ObjectRenderer2.prototype.flush = function() {
    };
    ObjectRenderer2.prototype.destroy = function() {
      this.renderer = null;
    };
    ObjectRenderer2.prototype.start = function() {
    };
    ObjectRenderer2.prototype.stop = function() {
      this.flush();
    };
    ObjectRenderer2.prototype.render = function(_object) {
    };
    return ObjectRenderer2;
  }();
  var BatchSystem = function(_super) {
    __extends3(BatchSystem2, _super);
    function BatchSystem2(renderer) {
      var _this = _super.call(this, renderer) || this;
      _this.emptyRenderer = new ObjectRenderer(renderer);
      _this.currentRenderer = _this.emptyRenderer;
      return _this;
    }
    BatchSystem2.prototype.setObjectRenderer = function(objectRenderer) {
      if (this.currentRenderer === objectRenderer) {
        return;
      }
      this.currentRenderer.stop();
      this.currentRenderer = objectRenderer;
      this.currentRenderer.start();
    };
    BatchSystem2.prototype.flush = function() {
      this.setObjectRenderer(this.emptyRenderer);
    };
    BatchSystem2.prototype.reset = function() {
      this.setObjectRenderer(this.emptyRenderer);
    };
    BatchSystem2.prototype.copyBoundTextures = function(arr, maxTextures) {
      var boundTextures = this.renderer.texture.boundTextures;
      for (var i = maxTextures - 1; i >= 0; --i) {
        arr[i] = boundTextures[i] || null;
        if (arr[i]) {
          arr[i]._batchLocation = i;
        }
      }
    };
    BatchSystem2.prototype.boundArray = function(texArray, boundTextures, batchId, maxTextures) {
      var elements = texArray.elements, ids = texArray.ids, count2 = texArray.count;
      var j = 0;
      for (var i = 0; i < count2; i++) {
        var tex = elements[i];
        var loc = tex._batchLocation;
        if (loc >= 0 && loc < maxTextures && boundTextures[loc] === tex) {
          ids[i] = loc;
          continue;
        }
        while (j < maxTextures) {
          var bound = boundTextures[j];
          if (bound && bound._batchEnabled === batchId && bound._batchLocation === j) {
            j++;
            continue;
          }
          ids[i] = j;
          tex._batchLocation = j;
          boundTextures[j] = tex;
          break;
        }
      }
    };
    return BatchSystem2;
  }(System);
  var CONTEXT_UID_COUNTER = 0;
  var ContextSystem = function(_super) {
    __extends3(ContextSystem2, _super);
    function ContextSystem2(renderer) {
      var _this = _super.call(this, renderer) || this;
      _this.webGLVersion = 1;
      _this.extensions = {};
      _this.supports = {
        uint32Indices: false
      };
      _this.handleContextLost = _this.handleContextLost.bind(_this);
      _this.handleContextRestored = _this.handleContextRestored.bind(_this);
      renderer.view.addEventListener("webglcontextlost", _this.handleContextLost, false);
      renderer.view.addEventListener("webglcontextrestored", _this.handleContextRestored, false);
      return _this;
    }
    Object.defineProperty(ContextSystem2.prototype, "isLost", {
      get: function() {
        return !this.gl || this.gl.isContextLost();
      },
      enumerable: false,
      configurable: true
    });
    ContextSystem2.prototype.contextChange = function(gl) {
      this.gl = gl;
      this.renderer.gl = gl;
      this.renderer.CONTEXT_UID = CONTEXT_UID_COUNTER++;
      if (gl.isContextLost() && gl.getExtension("WEBGL_lose_context")) {
        gl.getExtension("WEBGL_lose_context").restoreContext();
      }
    };
    ContextSystem2.prototype.initFromContext = function(gl) {
      this.gl = gl;
      this.validateContext(gl);
      this.renderer.gl = gl;
      this.renderer.CONTEXT_UID = CONTEXT_UID_COUNTER++;
      this.renderer.runners.contextChange.emit(gl);
    };
    ContextSystem2.prototype.initFromOptions = function(options) {
      var gl = this.createContext(this.renderer.view, options);
      this.initFromContext(gl);
    };
    ContextSystem2.prototype.createContext = function(canvas2, options) {
      var gl;
      if (settings.PREFER_ENV >= ENV.WEBGL2) {
        gl = canvas2.getContext("webgl2", options);
      }
      if (gl) {
        this.webGLVersion = 2;
      } else {
        this.webGLVersion = 1;
        gl = canvas2.getContext("webgl", options) || canvas2.getContext("experimental-webgl", options);
        if (!gl) {
          throw new Error("This browser does not support WebGL. Try using the canvas renderer");
        }
      }
      this.gl = gl;
      this.getExtensions();
      return this.gl;
    };
    ContextSystem2.prototype.getExtensions = function() {
      var gl = this.gl;
      if (this.webGLVersion === 1) {
        Object.assign(this.extensions, {
          drawBuffers: gl.getExtension("WEBGL_draw_buffers"),
          depthTexture: gl.getExtension("WEBGL_depth_texture"),
          loseContext: gl.getExtension("WEBGL_lose_context"),
          vertexArrayObject: gl.getExtension("OES_vertex_array_object") || gl.getExtension("MOZ_OES_vertex_array_object") || gl.getExtension("WEBKIT_OES_vertex_array_object"),
          anisotropicFiltering: gl.getExtension("EXT_texture_filter_anisotropic"),
          uint32ElementIndex: gl.getExtension("OES_element_index_uint"),
          floatTexture: gl.getExtension("OES_texture_float"),
          floatTextureLinear: gl.getExtension("OES_texture_float_linear"),
          textureHalfFloat: gl.getExtension("OES_texture_half_float"),
          textureHalfFloatLinear: gl.getExtension("OES_texture_half_float_linear")
        });
      } else if (this.webGLVersion === 2) {
        Object.assign(this.extensions, {
          anisotropicFiltering: gl.getExtension("EXT_texture_filter_anisotropic"),
          colorBufferFloat: gl.getExtension("EXT_color_buffer_float"),
          floatTextureLinear: gl.getExtension("OES_texture_float_linear")
        });
      }
    };
    ContextSystem2.prototype.handleContextLost = function(event) {
      event.preventDefault();
    };
    ContextSystem2.prototype.handleContextRestored = function() {
      this.renderer.runners.contextChange.emit(this.gl);
    };
    ContextSystem2.prototype.destroy = function() {
      var view6 = this.renderer.view;
      view6.removeEventListener("webglcontextlost", this.handleContextLost);
      view6.removeEventListener("webglcontextrestored", this.handleContextRestored);
      this.gl.useProgram(null);
      if (this.extensions.loseContext) {
        this.extensions.loseContext.loseContext();
      }
    };
    ContextSystem2.prototype.postrender = function() {
      if (this.renderer.renderingToScreen) {
        this.gl.flush();
      }
    };
    ContextSystem2.prototype.validateContext = function(gl) {
      var attributes = gl.getContextAttributes();
      if (!attributes.stencil) {
        console.warn("Provided WebGL context does not have a stencil buffer, masks may not render correctly");
      }
      var hasuint32 = "WebGL2RenderingContext" in window && gl instanceof window.WebGL2RenderingContext || !!gl.getExtension("OES_element_index_uint");
      this.supports.uint32Indices = hasuint32;
      if (!hasuint32) {
        console.warn("Provided WebGL context does not support 32 index buffer, complex graphics may not render correctly");
      }
    };
    return ContextSystem2;
  }(System);
  var GLFramebuffer = function() {
    function GLFramebuffer2(framebuffer) {
      this.framebuffer = framebuffer;
      this.stencil = null;
      this.dirtyId = 0;
      this.dirtyFormat = 0;
      this.dirtySize = 0;
      this.multisample = MSAA_QUALITY.NONE;
      this.msaaBuffer = null;
      this.blitFramebuffer = null;
    }
    return GLFramebuffer2;
  }();
  var tempRectangle = new Rectangle();
  var FramebufferSystem = function(_super) {
    __extends3(FramebufferSystem2, _super);
    function FramebufferSystem2(renderer) {
      var _this = _super.call(this, renderer) || this;
      _this.managedFramebuffers = [];
      _this.unknownFramebuffer = new Framebuffer(10, 10);
      _this.msaaSamples = null;
      return _this;
    }
    FramebufferSystem2.prototype.contextChange = function() {
      var gl = this.gl = this.renderer.gl;
      this.CONTEXT_UID = this.renderer.CONTEXT_UID;
      this.current = this.unknownFramebuffer;
      this.viewport = new Rectangle();
      this.hasMRT = true;
      this.writeDepthTexture = true;
      this.disposeAll(true);
      if (this.renderer.context.webGLVersion === 1) {
        var nativeDrawBuffersExtension_1 = this.renderer.context.extensions.drawBuffers;
        var nativeDepthTextureExtension = this.renderer.context.extensions.depthTexture;
        if (settings.PREFER_ENV === ENV.WEBGL_LEGACY) {
          nativeDrawBuffersExtension_1 = null;
          nativeDepthTextureExtension = null;
        }
        if (nativeDrawBuffersExtension_1) {
          gl.drawBuffers = function(activeTextures) {
            return nativeDrawBuffersExtension_1.drawBuffersWEBGL(activeTextures);
          };
        } else {
          this.hasMRT = false;
          gl.drawBuffers = function() {
          };
        }
        if (!nativeDepthTextureExtension) {
          this.writeDepthTexture = false;
        }
      } else {
        this.msaaSamples = gl.getInternalformatParameter(gl.RENDERBUFFER, gl.RGBA8, gl.SAMPLES);
      }
    };
    FramebufferSystem2.prototype.bind = function(framebuffer, frame) {
      var gl = this.gl;
      if (framebuffer) {
        var fbo = framebuffer.glFramebuffers[this.CONTEXT_UID] || this.initFramebuffer(framebuffer);
        if (this.current !== framebuffer) {
          this.current = framebuffer;
          gl.bindFramebuffer(gl.FRAMEBUFFER, fbo.framebuffer);
        }
        if (fbo.dirtyId !== framebuffer.dirtyId) {
          fbo.dirtyId = framebuffer.dirtyId;
          if (fbo.dirtyFormat !== framebuffer.dirtyFormat) {
            fbo.dirtyFormat = framebuffer.dirtyFormat;
            this.updateFramebuffer(framebuffer);
          } else if (fbo.dirtySize !== framebuffer.dirtySize) {
            fbo.dirtySize = framebuffer.dirtySize;
            this.resizeFramebuffer(framebuffer);
          }
        }
        for (var i = 0; i < framebuffer.colorTextures.length; i++) {
          var tex = framebuffer.colorTextures[i];
          this.renderer.texture.unbind(tex.parentTextureArray || tex);
        }
        if (framebuffer.depthTexture) {
          this.renderer.texture.unbind(framebuffer.depthTexture);
        }
        if (frame) {
          this.setViewport(frame.x, frame.y, frame.width, frame.height);
        } else {
          this.setViewport(0, 0, framebuffer.width, framebuffer.height);
        }
      } else {
        if (this.current) {
          this.current = null;
          gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        }
        if (frame) {
          this.setViewport(frame.x, frame.y, frame.width, frame.height);
        } else {
          this.setViewport(0, 0, this.renderer.width, this.renderer.height);
        }
      }
    };
    FramebufferSystem2.prototype.setViewport = function(x, y, width, height) {
      var v = this.viewport;
      if (v.width !== width || v.height !== height || v.x !== x || v.y !== y) {
        v.x = x;
        v.y = y;
        v.width = width;
        v.height = height;
        this.gl.viewport(x, y, width, height);
      }
    };
    Object.defineProperty(FramebufferSystem2.prototype, "size", {
      get: function() {
        if (this.current) {
          return {x: 0, y: 0, width: this.current.width, height: this.current.height};
        }
        return {x: 0, y: 0, width: this.renderer.width, height: this.renderer.height};
      },
      enumerable: false,
      configurable: true
    });
    FramebufferSystem2.prototype.clear = function(r, g, b, a, mask) {
      if (mask === void 0) {
        mask = BUFFER_BITS.COLOR | BUFFER_BITS.DEPTH;
      }
      var gl = this.gl;
      gl.clearColor(r, g, b, a);
      gl.clear(mask);
    };
    FramebufferSystem2.prototype.initFramebuffer = function(framebuffer) {
      var gl = this.gl;
      var fbo = new GLFramebuffer(gl.createFramebuffer());
      fbo.multisample = this.detectSamples(framebuffer.multisample);
      framebuffer.glFramebuffers[this.CONTEXT_UID] = fbo;
      this.managedFramebuffers.push(framebuffer);
      framebuffer.disposeRunner.add(this);
      return fbo;
    };
    FramebufferSystem2.prototype.resizeFramebuffer = function(framebuffer) {
      var gl = this.gl;
      var fbo = framebuffer.glFramebuffers[this.CONTEXT_UID];
      if (fbo.stencil) {
        gl.bindRenderbuffer(gl.RENDERBUFFER, fbo.stencil);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, framebuffer.width, framebuffer.height);
      }
      var colorTextures = framebuffer.colorTextures;
      for (var i = 0; i < colorTextures.length; i++) {
        this.renderer.texture.bind(colorTextures[i], 0);
      }
      if (framebuffer.depthTexture) {
        this.renderer.texture.bind(framebuffer.depthTexture, 0);
      }
    };
    FramebufferSystem2.prototype.updateFramebuffer = function(framebuffer) {
      var gl = this.gl;
      var fbo = framebuffer.glFramebuffers[this.CONTEXT_UID];
      var colorTextures = framebuffer.colorTextures;
      var count2 = colorTextures.length;
      if (!gl.drawBuffers) {
        count2 = Math.min(count2, 1);
      }
      if (fbo.multisample > 1) {
        fbo.msaaBuffer = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, fbo.msaaBuffer);
        gl.renderbufferStorageMultisample(gl.RENDERBUFFER, fbo.multisample, gl.RGBA8, framebuffer.width, framebuffer.height);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.RENDERBUFFER, fbo.msaaBuffer);
      }
      var activeTextures = [];
      for (var i = 0; i < count2; i++) {
        if (i === 0 && fbo.multisample > 1) {
          continue;
        }
        var texture = framebuffer.colorTextures[i];
        var parentTexture = texture.parentTextureArray || texture;
        this.renderer.texture.bind(parentTexture, 0);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0 + i, texture.target, parentTexture._glTextures[this.CONTEXT_UID].texture, 0);
        activeTextures.push(gl.COLOR_ATTACHMENT0 + i);
      }
      if (activeTextures.length > 1) {
        gl.drawBuffers(activeTextures);
      }
      if (framebuffer.depthTexture) {
        var writeDepthTexture = this.writeDepthTexture;
        if (writeDepthTexture) {
          var depthTexture = framebuffer.depthTexture;
          this.renderer.texture.bind(depthTexture, 0);
          gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, depthTexture._glTextures[this.CONTEXT_UID].texture, 0);
        }
      }
      if (!fbo.stencil && (framebuffer.stencil || framebuffer.depth)) {
        fbo.stencil = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, fbo.stencil);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, framebuffer.width, framebuffer.height);
        if (!framebuffer.depthTexture) {
          gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, fbo.stencil);
        }
      }
    };
    FramebufferSystem2.prototype.detectSamples = function(samples) {
      var msaaSamples = this.msaaSamples;
      var res = MSAA_QUALITY.NONE;
      if (samples <= 1 || msaaSamples === null) {
        return res;
      }
      for (var i = 0; i < msaaSamples.length; i++) {
        if (msaaSamples[i] <= samples) {
          res = msaaSamples[i];
          break;
        }
      }
      if (res === 1) {
        res = MSAA_QUALITY.NONE;
      }
      return res;
    };
    FramebufferSystem2.prototype.blit = function(framebuffer, sourcePixels, destPixels) {
      var _a2 = this, current = _a2.current, renderer = _a2.renderer, gl = _a2.gl, CONTEXT_UID = _a2.CONTEXT_UID;
      if (renderer.context.webGLVersion !== 2) {
        return;
      }
      if (!current) {
        return;
      }
      var fbo = current.glFramebuffers[CONTEXT_UID];
      if (!fbo) {
        return;
      }
      if (!framebuffer) {
        if (fbo.multisample <= 1) {
          return;
        }
        if (!fbo.blitFramebuffer) {
          fbo.blitFramebuffer = new Framebuffer(current.width, current.height);
          fbo.blitFramebuffer.addColorTexture(0, current.colorTextures[0]);
        }
        framebuffer = fbo.blitFramebuffer;
        framebuffer.width = current.width;
        framebuffer.height = current.height;
      }
      if (!sourcePixels) {
        sourcePixels = tempRectangle;
        sourcePixels.width = current.width;
        sourcePixels.height = current.height;
      }
      if (!destPixels) {
        destPixels = sourcePixels;
      }
      var sameSize = sourcePixels.width === destPixels.width && sourcePixels.height === destPixels.height;
      this.bind(framebuffer);
      gl.bindFramebuffer(gl.READ_FRAMEBUFFER, fbo.framebuffer);
      gl.blitFramebuffer(sourcePixels.x, sourcePixels.y, sourcePixels.width, sourcePixels.height, destPixels.x, destPixels.y, destPixels.width, destPixels.height, gl.COLOR_BUFFER_BIT, sameSize ? gl.NEAREST : gl.LINEAR);
    };
    FramebufferSystem2.prototype.disposeFramebuffer = function(framebuffer, contextLost) {
      var fbo = framebuffer.glFramebuffers[this.CONTEXT_UID];
      var gl = this.gl;
      if (!fbo) {
        return;
      }
      delete framebuffer.glFramebuffers[this.CONTEXT_UID];
      var index2 = this.managedFramebuffers.indexOf(framebuffer);
      if (index2 >= 0) {
        this.managedFramebuffers.splice(index2, 1);
      }
      framebuffer.disposeRunner.remove(this);
      if (!contextLost) {
        gl.deleteFramebuffer(fbo.framebuffer);
        if (fbo.stencil) {
          gl.deleteRenderbuffer(fbo.stencil);
        }
      }
    };
    FramebufferSystem2.prototype.disposeAll = function(contextLost) {
      var list = this.managedFramebuffers;
      this.managedFramebuffers = [];
      for (var i = 0; i < list.length; i++) {
        this.disposeFramebuffer(list[i], contextLost);
      }
    };
    FramebufferSystem2.prototype.forceStencil = function() {
      var framebuffer = this.current;
      if (!framebuffer) {
        return;
      }
      var fbo = framebuffer.glFramebuffers[this.CONTEXT_UID];
      if (!fbo || fbo.stencil) {
        return;
      }
      framebuffer.enableStencil();
      var w = framebuffer.width;
      var h = framebuffer.height;
      var gl = this.gl;
      var stencil = gl.createRenderbuffer();
      gl.bindRenderbuffer(gl.RENDERBUFFER, stencil);
      gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, w, h);
      fbo.stencil = stencil;
      gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, stencil);
    };
    FramebufferSystem2.prototype.reset = function() {
      this.current = this.unknownFramebuffer;
      this.viewport = new Rectangle();
    };
    return FramebufferSystem2;
  }(System);
  var GLBuffer = function() {
    function GLBuffer2(buffer) {
      this.buffer = buffer || null;
      this.updateID = -1;
      this.byteLength = -1;
      this.refCount = 0;
    }
    return GLBuffer2;
  }();
  var byteSizeMap$1 = {5126: 4, 5123: 2, 5121: 1};
  var GeometrySystem = function(_super) {
    __extends3(GeometrySystem2, _super);
    function GeometrySystem2(renderer) {
      var _this = _super.call(this, renderer) || this;
      _this._activeGeometry = null;
      _this._activeVao = null;
      _this.hasVao = true;
      _this.hasInstance = true;
      _this.canUseUInt32ElementIndex = false;
      _this.managedGeometries = {};
      _this.managedBuffers = {};
      return _this;
    }
    GeometrySystem2.prototype.contextChange = function() {
      this.disposeAll(true);
      var gl = this.gl = this.renderer.gl;
      var context2 = this.renderer.context;
      this.CONTEXT_UID = this.renderer.CONTEXT_UID;
      if (!gl.createVertexArray) {
        var nativeVaoExtension_1 = this.renderer.context.extensions.vertexArrayObject;
        if (settings.PREFER_ENV === ENV.WEBGL_LEGACY) {
          nativeVaoExtension_1 = null;
        }
        if (nativeVaoExtension_1) {
          gl.createVertexArray = function() {
            return nativeVaoExtension_1.createVertexArrayOES();
          };
          gl.bindVertexArray = function(vao) {
            return nativeVaoExtension_1.bindVertexArrayOES(vao);
          };
          gl.deleteVertexArray = function(vao) {
            return nativeVaoExtension_1.deleteVertexArrayOES(vao);
          };
        } else {
          this.hasVao = false;
          gl.createVertexArray = function() {
            return null;
          };
          gl.bindVertexArray = function() {
            return null;
          };
          gl.deleteVertexArray = function() {
            return null;
          };
        }
      }
      if (!gl.vertexAttribDivisor) {
        var instanceExt_1 = gl.getExtension("ANGLE_instanced_arrays");
        if (instanceExt_1) {
          gl.vertexAttribDivisor = function(a, b) {
            return instanceExt_1.vertexAttribDivisorANGLE(a, b);
          };
          gl.drawElementsInstanced = function(a, b, c, d, e) {
            return instanceExt_1.drawElementsInstancedANGLE(a, b, c, d, e);
          };
          gl.drawArraysInstanced = function(a, b, c, d) {
            return instanceExt_1.drawArraysInstancedANGLE(a, b, c, d);
          };
        } else {
          this.hasInstance = false;
        }
      }
      this.canUseUInt32ElementIndex = context2.webGLVersion === 2 || !!context2.extensions.uint32ElementIndex;
    };
    GeometrySystem2.prototype.bind = function(geometry, shader) {
      shader = shader || this.renderer.shader.shader;
      var gl = this.gl;
      var vaos = geometry.glVertexArrayObjects[this.CONTEXT_UID];
      if (!vaos) {
        this.managedGeometries[geometry.id] = geometry;
        geometry.disposeRunner.add(this);
        geometry.glVertexArrayObjects[this.CONTEXT_UID] = vaos = {};
      }
      var vao = vaos[shader.program.id] || this.initGeometryVao(geometry, shader.program);
      this._activeGeometry = geometry;
      if (this._activeVao !== vao) {
        this._activeVao = vao;
        if (this.hasVao) {
          gl.bindVertexArray(vao);
        } else {
          this.activateVao(geometry, shader.program);
        }
      }
      this.updateBuffers();
    };
    GeometrySystem2.prototype.reset = function() {
      this.unbind();
    };
    GeometrySystem2.prototype.updateBuffers = function() {
      var geometry = this._activeGeometry;
      var gl = this.gl;
      for (var i = 0; i < geometry.buffers.length; i++) {
        var buffer = geometry.buffers[i];
        var glBuffer = buffer._glBuffers[this.CONTEXT_UID];
        if (buffer._updateID !== glBuffer.updateID) {
          glBuffer.updateID = buffer._updateID;
          var type = buffer.index ? gl.ELEMENT_ARRAY_BUFFER : gl.ARRAY_BUFFER;
          gl.bindBuffer(type, glBuffer.buffer);
          this._boundBuffer = glBuffer;
          if (glBuffer.byteLength >= buffer.data.byteLength) {
            gl.bufferSubData(type, 0, buffer.data);
          } else {
            var drawType = buffer.static ? gl.STATIC_DRAW : gl.DYNAMIC_DRAW;
            glBuffer.byteLength = buffer.data.byteLength;
            gl.bufferData(type, buffer.data, drawType);
          }
        }
      }
    };
    GeometrySystem2.prototype.checkCompatibility = function(geometry, program) {
      var geometryAttributes = geometry.attributes;
      var shaderAttributes = program.attributeData;
      for (var j in shaderAttributes) {
        if (!geometryAttributes[j]) {
          throw new Error('shader and geometry incompatible, geometry missing the "' + j + '" attribute');
        }
      }
    };
    GeometrySystem2.prototype.getSignature = function(geometry, program) {
      var attribs = geometry.attributes;
      var shaderAttributes = program.attributeData;
      var strings = ["g", geometry.id];
      for (var i in attribs) {
        if (shaderAttributes[i]) {
          strings.push(i);
        }
      }
      return strings.join("-");
    };
    GeometrySystem2.prototype.initGeometryVao = function(geometry, program) {
      this.checkCompatibility(geometry, program);
      var gl = this.gl;
      var CONTEXT_UID = this.CONTEXT_UID;
      var signature = this.getSignature(geometry, program);
      var vaoObjectHash = geometry.glVertexArrayObjects[this.CONTEXT_UID];
      var vao = vaoObjectHash[signature];
      if (vao) {
        vaoObjectHash[program.id] = vao;
        return vao;
      }
      var buffers = geometry.buffers;
      var attributes = geometry.attributes;
      var tempStride = {};
      var tempStart = {};
      for (var j in buffers) {
        tempStride[j] = 0;
        tempStart[j] = 0;
      }
      for (var j in attributes) {
        if (!attributes[j].size && program.attributeData[j]) {
          attributes[j].size = program.attributeData[j].size;
        } else if (!attributes[j].size) {
          console.warn("PIXI Geometry attribute '" + j + "' size cannot be determined (likely the bound shader does not have the attribute)");
        }
        tempStride[attributes[j].buffer] += attributes[j].size * byteSizeMap$1[attributes[j].type];
      }
      for (var j in attributes) {
        var attribute = attributes[j];
        var attribSize = attribute.size;
        if (attribute.stride === void 0) {
          if (tempStride[attribute.buffer] === attribSize * byteSizeMap$1[attribute.type]) {
            attribute.stride = 0;
          } else {
            attribute.stride = tempStride[attribute.buffer];
          }
        }
        if (attribute.start === void 0) {
          attribute.start = tempStart[attribute.buffer];
          tempStart[attribute.buffer] += attribSize * byteSizeMap$1[attribute.type];
        }
      }
      vao = gl.createVertexArray();
      gl.bindVertexArray(vao);
      for (var i = 0; i < buffers.length; i++) {
        var buffer = buffers[i];
        if (!buffer._glBuffers[CONTEXT_UID]) {
          buffer._glBuffers[CONTEXT_UID] = new GLBuffer(gl.createBuffer());
          this.managedBuffers[buffer.id] = buffer;
          buffer.disposeRunner.add(this);
        }
        buffer._glBuffers[CONTEXT_UID].refCount++;
      }
      this.activateVao(geometry, program);
      this._activeVao = vao;
      vaoObjectHash[program.id] = vao;
      vaoObjectHash[signature] = vao;
      return vao;
    };
    GeometrySystem2.prototype.disposeBuffer = function(buffer, contextLost) {
      if (!this.managedBuffers[buffer.id]) {
        return;
      }
      delete this.managedBuffers[buffer.id];
      var glBuffer = buffer._glBuffers[this.CONTEXT_UID];
      var gl = this.gl;
      buffer.disposeRunner.remove(this);
      if (!glBuffer) {
        return;
      }
      if (!contextLost) {
        gl.deleteBuffer(glBuffer.buffer);
      }
      delete buffer._glBuffers[this.CONTEXT_UID];
    };
    GeometrySystem2.prototype.disposeGeometry = function(geometry, contextLost) {
      if (!this.managedGeometries[geometry.id]) {
        return;
      }
      delete this.managedGeometries[geometry.id];
      var vaos = geometry.glVertexArrayObjects[this.CONTEXT_UID];
      var gl = this.gl;
      var buffers = geometry.buffers;
      geometry.disposeRunner.remove(this);
      if (!vaos) {
        return;
      }
      for (var i = 0; i < buffers.length; i++) {
        var buf = buffers[i]._glBuffers[this.CONTEXT_UID];
        buf.refCount--;
        if (buf.refCount === 0 && !contextLost) {
          this.disposeBuffer(buffers[i], contextLost);
        }
      }
      if (!contextLost) {
        for (var vaoId in vaos) {
          if (vaoId[0] === "g") {
            var vao = vaos[vaoId];
            if (this._activeVao === vao) {
              this.unbind();
            }
            gl.deleteVertexArray(vao);
          }
        }
      }
      delete geometry.glVertexArrayObjects[this.CONTEXT_UID];
    };
    GeometrySystem2.prototype.disposeAll = function(contextLost) {
      var all = Object.keys(this.managedGeometries);
      for (var i = 0; i < all.length; i++) {
        this.disposeGeometry(this.managedGeometries[all[i]], contextLost);
      }
      all = Object.keys(this.managedBuffers);
      for (var i = 0; i < all.length; i++) {
        this.disposeBuffer(this.managedBuffers[all[i]], contextLost);
      }
    };
    GeometrySystem2.prototype.activateVao = function(geometry, program) {
      var gl = this.gl;
      var CONTEXT_UID = this.CONTEXT_UID;
      var buffers = geometry.buffers;
      var attributes = geometry.attributes;
      if (geometry.indexBuffer) {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, geometry.indexBuffer._glBuffers[CONTEXT_UID].buffer);
      }
      var lastBuffer = null;
      for (var j in attributes) {
        var attribute = attributes[j];
        var buffer = buffers[attribute.buffer];
        var glBuffer = buffer._glBuffers[CONTEXT_UID];
        if (program.attributeData[j]) {
          if (lastBuffer !== glBuffer) {
            gl.bindBuffer(gl.ARRAY_BUFFER, glBuffer.buffer);
            lastBuffer = glBuffer;
          }
          var location = program.attributeData[j].location;
          gl.enableVertexAttribArray(location);
          gl.vertexAttribPointer(location, attribute.size, attribute.type || gl.FLOAT, attribute.normalized, attribute.stride, attribute.start);
          if (attribute.instance) {
            if (this.hasInstance) {
              gl.vertexAttribDivisor(location, 1);
            } else {
              throw new Error("geometry error, GPU Instancing is not supported on this device");
            }
          }
        }
      }
    };
    GeometrySystem2.prototype.draw = function(type, size2, start, instanceCount) {
      var gl = this.gl;
      var geometry = this._activeGeometry;
      if (geometry.indexBuffer) {
        var byteSize = geometry.indexBuffer.data.BYTES_PER_ELEMENT;
        var glType = byteSize === 2 ? gl.UNSIGNED_SHORT : gl.UNSIGNED_INT;
        if (byteSize === 2 || byteSize === 4 && this.canUseUInt32ElementIndex) {
          if (geometry.instanced) {
            gl.drawElementsInstanced(type, size2 || geometry.indexBuffer.data.length, glType, (start || 0) * byteSize, instanceCount || 1);
          } else {
            gl.drawElements(type, size2 || geometry.indexBuffer.data.length, glType, (start || 0) * byteSize);
          }
        } else {
          console.warn("unsupported index buffer type: uint32");
        }
      } else if (geometry.instanced) {
        gl.drawArraysInstanced(type, start, size2 || geometry.getSize(), instanceCount || 1);
      } else {
        gl.drawArrays(type, start, size2 || geometry.getSize());
      }
      return this;
    };
    GeometrySystem2.prototype.unbind = function() {
      this.gl.bindVertexArray(null);
      this._activeVao = null;
      this._activeGeometry = null;
    };
    return GeometrySystem2;
  }(System);
  var MaskData = function() {
    function MaskData2(maskObject) {
      if (maskObject === void 0) {
        maskObject = null;
      }
      this.type = MASK_TYPES.NONE;
      this.autoDetect = true;
      this.maskObject = maskObject || null;
      this.pooled = false;
      this.isMaskData = true;
      this._stencilCounter = 0;
      this._scissorCounter = 0;
      this._scissorRect = null;
      this._target = null;
    }
    MaskData2.prototype.reset = function() {
      if (this.pooled) {
        this.maskObject = null;
        this.type = MASK_TYPES.NONE;
        this.autoDetect = true;
      }
      this._target = null;
    };
    MaskData2.prototype.copyCountersOrReset = function(maskAbove) {
      if (maskAbove) {
        this._stencilCounter = maskAbove._stencilCounter;
        this._scissorCounter = maskAbove._scissorCounter;
        this._scissorRect = maskAbove._scissorRect;
      } else {
        this._stencilCounter = 0;
        this._scissorCounter = 0;
        this._scissorRect = null;
      }
    };
    return MaskData2;
  }();
  function compileShader(gl, type, src) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    return shader;
  }
  function compileProgram(gl, vertexSrc, fragmentSrc, attributeLocations) {
    var glVertShader = compileShader(gl, gl.VERTEX_SHADER, vertexSrc);
    var glFragShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSrc);
    var program = gl.createProgram();
    gl.attachShader(program, glVertShader);
    gl.attachShader(program, glFragShader);
    if (attributeLocations) {
      for (var i in attributeLocations) {
        gl.bindAttribLocation(program, attributeLocations[i], i);
      }
    }
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      if (!gl.getShaderParameter(glVertShader, gl.COMPILE_STATUS)) {
        console.warn(vertexSrc);
        console.error(gl.getShaderInfoLog(glVertShader));
      }
      if (!gl.getShaderParameter(glFragShader, gl.COMPILE_STATUS)) {
        console.warn(fragmentSrc);
        console.error(gl.getShaderInfoLog(glFragShader));
      }
      console.error("Pixi.js Error: Could not initialize shader.");
      console.error("gl.VALIDATE_STATUS", gl.getProgramParameter(program, gl.VALIDATE_STATUS));
      console.error("gl.getError()", gl.getError());
      if (gl.getProgramInfoLog(program) !== "") {
        console.warn("Pixi.js Warning: gl.getProgramInfoLog()", gl.getProgramInfoLog(program));
      }
      gl.deleteProgram(program);
      program = null;
    }
    gl.deleteShader(glVertShader);
    gl.deleteShader(glFragShader);
    return program;
  }
  function booleanArray(size2) {
    var array = new Array(size2);
    for (var i = 0; i < array.length; i++) {
      array[i] = false;
    }
    return array;
  }
  function defaultValue(type, size2) {
    switch (type) {
      case "float":
        return 0;
      case "vec2":
        return new Float32Array(2 * size2);
      case "vec3":
        return new Float32Array(3 * size2);
      case "vec4":
        return new Float32Array(4 * size2);
      case "int":
      case "sampler2D":
      case "sampler2DArray":
        return 0;
      case "ivec2":
        return new Int32Array(2 * size2);
      case "ivec3":
        return new Int32Array(3 * size2);
      case "ivec4":
        return new Int32Array(4 * size2);
      case "bool":
        return false;
      case "bvec2":
        return booleanArray(2 * size2);
      case "bvec3":
        return booleanArray(3 * size2);
      case "bvec4":
        return booleanArray(4 * size2);
      case "mat2":
        return new Float32Array([
          1,
          0,
          0,
          1
        ]);
      case "mat3":
        return new Float32Array([
          1,
          0,
          0,
          0,
          1,
          0,
          0,
          0,
          1
        ]);
      case "mat4":
        return new Float32Array([
          1,
          0,
          0,
          0,
          0,
          1,
          0,
          0,
          0,
          0,
          1,
          0,
          0,
          0,
          0,
          1
        ]);
    }
    return null;
  }
  var unknownContext = {};
  var context = unknownContext;
  function getTestContext() {
    if (context === unknownContext || context && context.isContextLost()) {
      var canvas2 = document.createElement("canvas");
      var gl = void 0;
      if (settings.PREFER_ENV >= ENV.WEBGL2) {
        gl = canvas2.getContext("webgl2", {});
      }
      if (!gl) {
        gl = canvas2.getContext("webgl", {}) || canvas2.getContext("experimental-webgl", {});
        if (!gl) {
          gl = null;
        } else {
          gl.getExtension("WEBGL_draw_buffers");
        }
      }
      context = gl;
    }
    return context;
  }
  var maxFragmentPrecision;
  function getMaxFragmentPrecision() {
    if (!maxFragmentPrecision) {
      maxFragmentPrecision = PRECISION.MEDIUM;
      var gl = getTestContext();
      if (gl) {
        if (gl.getShaderPrecisionFormat) {
          var shaderFragment = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT);
          maxFragmentPrecision = shaderFragment.precision ? PRECISION.HIGH : PRECISION.MEDIUM;
        }
      }
    }
    return maxFragmentPrecision;
  }
  function setPrecision(src, requestedPrecision, maxSupportedPrecision) {
    if (src.substring(0, 9) !== "precision") {
      var precision = requestedPrecision;
      if (requestedPrecision === PRECISION.HIGH && maxSupportedPrecision !== PRECISION.HIGH) {
        precision = PRECISION.MEDIUM;
      }
      return "precision " + precision + " float;\n" + src;
    } else if (maxSupportedPrecision !== PRECISION.HIGH && src.substring(0, 15) === "precision highp") {
      return src.replace("precision highp", "precision mediump");
    }
    return src;
  }
  var GLSL_TO_SIZE = {
    float: 1,
    vec2: 2,
    vec3: 3,
    vec4: 4,
    int: 1,
    ivec2: 2,
    ivec3: 3,
    ivec4: 4,
    bool: 1,
    bvec2: 2,
    bvec3: 3,
    bvec4: 4,
    mat2: 4,
    mat3: 9,
    mat4: 16,
    sampler2D: 1
  };
  function mapSize(type) {
    return GLSL_TO_SIZE[type];
  }
  var GL_TABLE = null;
  var GL_TO_GLSL_TYPES = {
    FLOAT: "float",
    FLOAT_VEC2: "vec2",
    FLOAT_VEC3: "vec3",
    FLOAT_VEC4: "vec4",
    INT: "int",
    INT_VEC2: "ivec2",
    INT_VEC3: "ivec3",
    INT_VEC4: "ivec4",
    BOOL: "bool",
    BOOL_VEC2: "bvec2",
    BOOL_VEC3: "bvec3",
    BOOL_VEC4: "bvec4",
    FLOAT_MAT2: "mat2",
    FLOAT_MAT3: "mat3",
    FLOAT_MAT4: "mat4",
    SAMPLER_2D: "sampler2D",
    INT_SAMPLER_2D: "sampler2D",
    UNSIGNED_INT_SAMPLER_2D: "sampler2D",
    SAMPLER_CUBE: "samplerCube",
    INT_SAMPLER_CUBE: "samplerCube",
    UNSIGNED_INT_SAMPLER_CUBE: "samplerCube",
    SAMPLER_2D_ARRAY: "sampler2DArray",
    INT_SAMPLER_2D_ARRAY: "sampler2DArray",
    UNSIGNED_INT_SAMPLER_2D_ARRAY: "sampler2DArray"
  };
  function mapType(gl, type) {
    if (!GL_TABLE) {
      var typeNames = Object.keys(GL_TO_GLSL_TYPES);
      GL_TABLE = {};
      for (var i = 0; i < typeNames.length; ++i) {
        var tn = typeNames[i];
        GL_TABLE[gl[tn]] = GL_TO_GLSL_TYPES[tn];
      }
    }
    return GL_TABLE[type];
  }
  var uniformParsers = [
    {
      test: function(data) {
        return data.type === "float" && data.size === 1;
      },
      code: function(name) {
        return '\n            if(uv["' + name + '"] !== ud["' + name + '"].value)\n            {\n                ud["' + name + '"].value = uv["' + name + '"]\n                gl.uniform1f(ud["' + name + '"].location, uv["' + name + '"])\n            }\n            ';
      }
    },
    {
      test: function(data) {
        return (data.type === "sampler2D" || data.type === "samplerCube" || data.type === "sampler2DArray") && data.size === 1 && !data.isArray;
      },
      code: function(name) {
        return 't = syncData.textureCount++;\n\n            renderer.texture.bind(uv["' + name + '"], t);\n\n            if(ud["' + name + '"].value !== t)\n            {\n                ud["' + name + '"].value = t;\n                gl.uniform1i(ud["' + name + '"].location, t);\n; // eslint-disable-line max-len\n            }';
      }
    },
    {
      test: function(data, uniform) {
        return data.type === "mat3" && data.size === 1 && uniform.a !== void 0;
      },
      code: function(name) {
        return '\n            gl.uniformMatrix3fv(ud["' + name + '"].location, false, uv["' + name + '"].toArray(true));\n            ';
      }
    },
    {
      test: function(data, uniform) {
        return data.type === "vec2" && data.size === 1 && uniform.x !== void 0;
      },
      code: function(name) {
        return '\n                cv = ud["' + name + '"].value;\n                v = uv["' + name + '"];\n\n                if(cv[0] !== v.x || cv[1] !== v.y)\n                {\n                    cv[0] = v.x;\n                    cv[1] = v.y;\n                    gl.uniform2f(ud["' + name + '"].location, v.x, v.y);\n                }';
      }
    },
    {
      test: function(data) {
        return data.type === "vec2" && data.size === 1;
      },
      code: function(name) {
        return '\n                cv = ud["' + name + '"].value;\n                v = uv["' + name + '"];\n\n                if(cv[0] !== v[0] || cv[1] !== v[1])\n                {\n                    cv[0] = v[0];\n                    cv[1] = v[1];\n                    gl.uniform2f(ud["' + name + '"].location, v[0], v[1]);\n                }\n            ';
      }
    },
    {
      test: function(data, uniform) {
        return data.type === "vec4" && data.size === 1 && uniform.width !== void 0;
      },
      code: function(name) {
        return '\n                cv = ud["' + name + '"].value;\n                v = uv["' + name + '"];\n\n                if(cv[0] !== v.x || cv[1] !== v.y || cv[2] !== v.width || cv[3] !== v.height)\n                {\n                    cv[0] = v.x;\n                    cv[1] = v.y;\n                    cv[2] = v.width;\n                    cv[3] = v.height;\n                    gl.uniform4f(ud["' + name + '"].location, v.x, v.y, v.width, v.height)\n                }';
      }
    },
    {
      test: function(data) {
        return data.type === "vec4" && data.size === 1;
      },
      code: function(name) {
        return '\n                cv = ud["' + name + '"].value;\n                v = uv["' + name + '"];\n\n                if(cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2] || cv[3] !== v[3])\n                {\n                    cv[0] = v[0];\n                    cv[1] = v[1];\n                    cv[2] = v[2];\n                    cv[3] = v[3];\n\n                    gl.uniform4f(ud["' + name + '"].location, v[0], v[1], v[2], v[3])\n                }';
      }
    }
  ];
  var GLSL_TO_SINGLE_SETTERS_CACHED = {
    float: "\n    if(cv !== v)\n    {\n        cv.v = v;\n        gl.uniform1f(location, v)\n    }",
    vec2: "\n    if(cv[0] !== v[0] || cv[1] !== v[1])\n    {\n        cv[0] = v[0];\n        cv[1] = v[1];\n        gl.uniform2f(location, v[0], v[1])\n    }",
    vec3: "\n    if(cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2])\n    {\n        cv[0] = v[0];\n        cv[1] = v[1];\n        cv[2] = v[2];\n\n        gl.uniform3f(location, v[0], v[1], v[2])\n    }",
    vec4: "gl.uniform4f(location, v[0], v[1], v[2], v[3])",
    int: "gl.uniform1i(location, v)",
    ivec2: "gl.uniform2i(location, v[0], v[1])",
    ivec3: "gl.uniform3i(location, v[0], v[1], v[2])",
    ivec4: "gl.uniform4i(location, v[0], v[1], v[2], v[3])",
    bool: "gl.uniform1i(location, v)",
    bvec2: "gl.uniform2i(location, v[0], v[1])",
    bvec3: "gl.uniform3i(location, v[0], v[1], v[2])",
    bvec4: "gl.uniform4i(location, v[0], v[1], v[2], v[3])",
    mat2: "gl.uniformMatrix2fv(location, false, v)",
    mat3: "gl.uniformMatrix3fv(location, false, v)",
    mat4: "gl.uniformMatrix4fv(location, false, v)",
    sampler2D: "gl.uniform1i(location, v)",
    samplerCube: "gl.uniform1i(location, v)",
    sampler2DArray: "gl.uniform1i(location, v)"
  };
  var GLSL_TO_ARRAY_SETTERS = {
    float: "gl.uniform1fv(location, v)",
    vec2: "gl.uniform2fv(location, v)",
    vec3: "gl.uniform3fv(location, v)",
    vec4: "gl.uniform4fv(location, v)",
    mat4: "gl.uniformMatrix4fv(location, false, v)",
    mat3: "gl.uniformMatrix3fv(location, false, v)",
    mat2: "gl.uniformMatrix2fv(location, false, v)",
    int: "gl.uniform1iv(location, v)",
    ivec2: "gl.uniform2iv(location, v)",
    ivec3: "gl.uniform3iv(location, v)",
    ivec4: "gl.uniform4iv(location, v)",
    bool: "gl.uniform1iv(location, v)",
    bvec2: "gl.uniform2iv(location, v)",
    bvec3: "gl.uniform3iv(location, v)",
    bvec4: "gl.uniform4iv(location, v)",
    sampler2D: "gl.uniform1iv(location, v)",
    samplerCube: "gl.uniform1iv(location, v)",
    sampler2DArray: "gl.uniform1iv(location, v)"
  };
  function generateUniformsSync(group, uniformData) {
    var funcFragments = ["\n        var v = null;\n        var cv = null\n        var t = 0;\n        var gl = renderer.gl\n    "];
    for (var i in group.uniforms) {
      var data = uniformData[i];
      if (!data) {
        if (group.uniforms[i].group) {
          funcFragments.push('\n                    renderer.shader.syncUniformGroup(uv["' + i + '"], syncData);\n                ');
        }
        continue;
      }
      var uniform = group.uniforms[i];
      var parsed = false;
      for (var j = 0; j < uniformParsers.length; j++) {
        if (uniformParsers[j].test(data, uniform)) {
          funcFragments.push(uniformParsers[j].code(i, uniform));
          parsed = true;
          break;
        }
      }
      if (!parsed) {
        var templateType = data.size === 1 ? GLSL_TO_SINGLE_SETTERS_CACHED : GLSL_TO_ARRAY_SETTERS;
        var template = templateType[data.type].replace("location", 'ud["' + i + '"].location');
        funcFragments.push('\n            cv = ud["' + i + '"].value;\n            v = uv["' + i + '"];\n            ' + template + ";");
      }
    }
    return new Function("ud", "uv", "renderer", "syncData", funcFragments.join("\n"));
  }
  var fragTemplate = [
    "precision mediump float;",
    "void main(void){",
    "float test = 0.1;",
    "%forloop%",
    "gl_FragColor = vec4(0.0);",
    "}"
  ].join("\n");
  function generateIfTestSrc(maxIfs) {
    var src = "";
    for (var i = 0; i < maxIfs; ++i) {
      if (i > 0) {
        src += "\nelse ";
      }
      if (i < maxIfs - 1) {
        src += "if(test == " + i + ".0){}";
      }
    }
    return src;
  }
  function checkMaxIfStatementsInShader(maxIfs, gl) {
    if (maxIfs === 0) {
      throw new Error("Invalid value of `0` passed to `checkMaxIfStatementsInShader`");
    }
    var shader = gl.createShader(gl.FRAGMENT_SHADER);
    while (true) {
      var fragmentSrc = fragTemplate.replace(/%forloop%/gi, generateIfTestSrc(maxIfs));
      gl.shaderSource(shader, fragmentSrc);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        maxIfs = maxIfs / 2 | 0;
      } else {
        break;
      }
    }
    return maxIfs;
  }
  var unsafeEval;
  function unsafeEvalSupported() {
    if (typeof unsafeEval === "boolean") {
      return unsafeEval;
    }
    try {
      var func = new Function("param1", "param2", "param3", "return param1[param2] === param3;");
      unsafeEval = func({a: "b"}, "a", "b") === true;
    } catch (e) {
      unsafeEval = false;
    }
    return unsafeEval;
  }
  var defaultFragment = "varying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\n\nvoid main(void){\n   gl_FragColor *= texture2D(uSampler, vTextureCoord);\n}";
  var defaultVertex = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void){\n   gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n   vTextureCoord = aTextureCoord;\n}\n";
  var UID$3 = 0;
  var nameCache = {};
  var Program = function() {
    function Program2(vertexSrc, fragmentSrc, name) {
      if (name === void 0) {
        name = "pixi-shader";
      }
      this.id = UID$3++;
      this.vertexSrc = vertexSrc || Program2.defaultVertexSrc;
      this.fragmentSrc = fragmentSrc || Program2.defaultFragmentSrc;
      this.vertexSrc = this.vertexSrc.trim();
      this.fragmentSrc = this.fragmentSrc.trim();
      if (this.vertexSrc.substring(0, 8) !== "#version") {
        name = name.replace(/\s+/g, "-");
        if (nameCache[name]) {
          nameCache[name]++;
          name += "-" + nameCache[name];
        } else {
          nameCache[name] = 1;
        }
        this.vertexSrc = "#define SHADER_NAME " + name + "\n" + this.vertexSrc;
        this.fragmentSrc = "#define SHADER_NAME " + name + "\n" + this.fragmentSrc;
        this.vertexSrc = setPrecision(this.vertexSrc, settings.PRECISION_VERTEX, PRECISION.HIGH);
        this.fragmentSrc = setPrecision(this.fragmentSrc, settings.PRECISION_FRAGMENT, getMaxFragmentPrecision());
      }
      this.extractData(this.vertexSrc, this.fragmentSrc);
      this.glPrograms = {};
      this.syncUniforms = null;
    }
    Program2.prototype.extractData = function(vertexSrc, fragmentSrc) {
      var gl = getTestContext();
      if (gl) {
        var program = compileProgram(gl, vertexSrc, fragmentSrc);
        this.attributeData = this.getAttributeData(program, gl);
        this.uniformData = this.getUniformData(program, gl);
        gl.deleteProgram(program);
      } else {
        this.uniformData = {};
        this.attributeData = {};
      }
    };
    Program2.prototype.getAttributeData = function(program, gl) {
      var attributes = {};
      var attributesArray = [];
      var totalAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
      for (var i = 0; i < totalAttributes; i++) {
        var attribData = gl.getActiveAttrib(program, i);
        var type = mapType(gl, attribData.type);
        var data = {
          type,
          name: attribData.name,
          size: mapSize(type),
          location: 0
        };
        attributes[attribData.name] = data;
        attributesArray.push(data);
      }
      attributesArray.sort(function(a, b) {
        return a.name > b.name ? 1 : -1;
      });
      for (var i = 0; i < attributesArray.length; i++) {
        attributesArray[i].location = i;
      }
      return attributes;
    };
    Program2.prototype.getUniformData = function(program, gl) {
      var uniforms = {};
      var totalUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
      for (var i = 0; i < totalUniforms; i++) {
        var uniformData = gl.getActiveUniform(program, i);
        var name = uniformData.name.replace(/\[.*?\]$/, "");
        var isArray = uniformData.name.match(/\[.*?\]$/);
        var type = mapType(gl, uniformData.type);
        uniforms[name] = {
          type,
          size: uniformData.size,
          isArray,
          value: defaultValue(type, uniformData.size)
        };
      }
      return uniforms;
    };
    Object.defineProperty(Program2, "defaultVertexSrc", {
      get: function() {
        return defaultVertex;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Program2, "defaultFragmentSrc", {
      get: function() {
        return defaultFragment;
      },
      enumerable: false,
      configurable: true
    });
    Program2.from = function(vertexSrc, fragmentSrc, name) {
      var key = vertexSrc + fragmentSrc;
      var program = ProgramCache[key];
      if (!program) {
        ProgramCache[key] = program = new Program2(vertexSrc, fragmentSrc, name);
      }
      return program;
    };
    return Program2;
  }();
  var Shader = function() {
    function Shader2(program, uniforms) {
      this.program = program;
      if (uniforms) {
        if (uniforms instanceof UniformGroup) {
          this.uniformGroup = uniforms;
        } else {
          this.uniformGroup = new UniformGroup(uniforms);
        }
      } else {
        this.uniformGroup = new UniformGroup({});
      }
      for (var i in program.uniformData) {
        if (this.uniformGroup.uniforms[i] instanceof Array) {
          this.uniformGroup.uniforms[i] = new Float32Array(this.uniformGroup.uniforms[i]);
        }
      }
    }
    Shader2.prototype.checkUniformExists = function(name, group) {
      if (group.uniforms[name]) {
        return true;
      }
      for (var i in group.uniforms) {
        var uniform = group.uniforms[i];
        if (uniform.group) {
          if (this.checkUniformExists(name, uniform)) {
            return true;
          }
        }
      }
      return false;
    };
    Shader2.prototype.destroy = function() {
      this.uniformGroup = null;
    };
    Object.defineProperty(Shader2.prototype, "uniforms", {
      get: function() {
        return this.uniformGroup.uniforms;
      },
      enumerable: false,
      configurable: true
    });
    Shader2.from = function(vertexSrc, fragmentSrc, uniforms) {
      var program = Program.from(vertexSrc, fragmentSrc);
      return new Shader2(program, uniforms);
    };
    return Shader2;
  }();
  var BLEND = 0;
  var OFFSET = 1;
  var CULLING = 2;
  var DEPTH_TEST = 3;
  var WINDING = 4;
  var State = function() {
    function State2() {
      this.data = 0;
      this.blendMode = BLEND_MODES.NORMAL;
      this.polygonOffset = 0;
      this.blend = true;
    }
    Object.defineProperty(State2.prototype, "blend", {
      get: function() {
        return !!(this.data & 1 << BLEND);
      },
      set: function(value) {
        if (!!(this.data & 1 << BLEND) !== value) {
          this.data ^= 1 << BLEND;
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(State2.prototype, "offsets", {
      get: function() {
        return !!(this.data & 1 << OFFSET);
      },
      set: function(value) {
        if (!!(this.data & 1 << OFFSET) !== value) {
          this.data ^= 1 << OFFSET;
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(State2.prototype, "culling", {
      get: function() {
        return !!(this.data & 1 << CULLING);
      },
      set: function(value) {
        if (!!(this.data & 1 << CULLING) !== value) {
          this.data ^= 1 << CULLING;
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(State2.prototype, "depthTest", {
      get: function() {
        return !!(this.data & 1 << DEPTH_TEST);
      },
      set: function(value) {
        if (!!(this.data & 1 << DEPTH_TEST) !== value) {
          this.data ^= 1 << DEPTH_TEST;
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(State2.prototype, "clockwiseFrontFace", {
      get: function() {
        return !!(this.data & 1 << WINDING);
      },
      set: function(value) {
        if (!!(this.data & 1 << WINDING) !== value) {
          this.data ^= 1 << WINDING;
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(State2.prototype, "blendMode", {
      get: function() {
        return this._blendMode;
      },
      set: function(value) {
        this.blend = value !== BLEND_MODES.NONE;
        this._blendMode = value;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(State2.prototype, "polygonOffset", {
      get: function() {
        return this._polygonOffset;
      },
      set: function(value) {
        this.offsets = !!value;
        this._polygonOffset = value;
      },
      enumerable: false,
      configurable: true
    });
    State2.for2d = function() {
      var state = new State2();
      state.depthTest = false;
      state.blend = true;
      return state;
    };
    return State2;
  }();
  var defaultVertex$1 = "attribute vec2 aVertexPosition;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nuniform vec4 inputSize;\nuniform vec4 outputFrame;\n\nvec4 filterVertexPosition( void )\n{\n    vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;\n\n    return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);\n}\n\nvec2 filterTextureCoord( void )\n{\n    return aVertexPosition * (outputFrame.zw * inputSize.zw);\n}\n\nvoid main(void)\n{\n    gl_Position = filterVertexPosition();\n    vTextureCoord = filterTextureCoord();\n}\n";
  var defaultFragment$1 = "varying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\n\nvoid main(void){\n   gl_FragColor = texture2D(uSampler, vTextureCoord);\n}\n";
  var Filter = function(_super) {
    __extends3(Filter2, _super);
    function Filter2(vertexSrc, fragmentSrc, uniforms) {
      var _this = this;
      var program = Program.from(vertexSrc || Filter2.defaultVertexSrc, fragmentSrc || Filter2.defaultFragmentSrc);
      _this = _super.call(this, program, uniforms) || this;
      _this.padding = 0;
      _this.resolution = settings.FILTER_RESOLUTION;
      _this.enabled = true;
      _this.autoFit = true;
      _this.legacy = !!_this.program.attributeData.aTextureCoord;
      _this.state = new State();
      return _this;
    }
    Filter2.prototype.apply = function(filterManager, input3, output, clearMode, _currentState) {
      filterManager.applyFilter(this, input3, output, clearMode);
    };
    Object.defineProperty(Filter2.prototype, "blendMode", {
      get: function() {
        return this.state.blendMode;
      },
      set: function(value) {
        this.state.blendMode = value;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Filter2, "defaultVertexSrc", {
      get: function() {
        return defaultVertex$1;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Filter2, "defaultFragmentSrc", {
      get: function() {
        return defaultFragment$1;
      },
      enumerable: false,
      configurable: true
    });
    return Filter2;
  }(Shader);
  var vertex = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\nuniform mat3 otherMatrix;\n\nvarying vec2 vMaskCoord;\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n\n    vTextureCoord = aTextureCoord;\n    vMaskCoord = ( otherMatrix * vec3( aTextureCoord, 1.0)  ).xy;\n}\n";
  var fragment = "varying vec2 vMaskCoord;\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform sampler2D mask;\nuniform float alpha;\nuniform float npmAlpha;\nuniform vec4 maskClamp;\n\nvoid main(void)\n{\n    float clip = step(3.5,\n        step(maskClamp.x, vMaskCoord.x) +\n        step(maskClamp.y, vMaskCoord.y) +\n        step(vMaskCoord.x, maskClamp.z) +\n        step(vMaskCoord.y, maskClamp.w));\n\n    vec4 original = texture2D(uSampler, vTextureCoord);\n    vec4 masky = texture2D(mask, vMaskCoord);\n    float alphaMul = 1.0 - npmAlpha * (1.0 - masky.a);\n\n    original *= (alphaMul * masky.r * alpha * clip);\n\n    gl_FragColor = original;\n}\n";
  var tempMat = new Matrix();
  var TextureMatrix = function() {
    function TextureMatrix2(texture, clampMargin) {
      this._texture = texture;
      this.mapCoord = new Matrix();
      this.uClampFrame = new Float32Array(4);
      this.uClampOffset = new Float32Array(2);
      this._textureID = -1;
      this._updateID = 0;
      this.clampOffset = 0;
      this.clampMargin = typeof clampMargin === "undefined" ? 0.5 : clampMargin;
      this.isSimple = false;
    }
    Object.defineProperty(TextureMatrix2.prototype, "texture", {
      get: function() {
        return this._texture;
      },
      set: function(value) {
        this._texture = value;
        this._textureID = -1;
      },
      enumerable: false,
      configurable: true
    });
    TextureMatrix2.prototype.multiplyUvs = function(uvs, out) {
      if (out === void 0) {
        out = uvs;
      }
      var mat = this.mapCoord;
      for (var i = 0; i < uvs.length; i += 2) {
        var x = uvs[i];
        var y = uvs[i + 1];
        out[i] = x * mat.a + y * mat.c + mat.tx;
        out[i + 1] = x * mat.b + y * mat.d + mat.ty;
      }
      return out;
    };
    TextureMatrix2.prototype.update = function(forceUpdate) {
      var tex = this._texture;
      if (!tex || !tex.valid) {
        return false;
      }
      if (!forceUpdate && this._textureID === tex._updateID) {
        return false;
      }
      this._textureID = tex._updateID;
      this._updateID++;
      var uvs = tex._uvs;
      this.mapCoord.set(uvs.x1 - uvs.x0, uvs.y1 - uvs.y0, uvs.x3 - uvs.x0, uvs.y3 - uvs.y0, uvs.x0, uvs.y0);
      var orig = tex.orig;
      var trim = tex.trim;
      if (trim) {
        tempMat.set(orig.width / trim.width, 0, 0, orig.height / trim.height, -trim.x / trim.width, -trim.y / trim.height);
        this.mapCoord.append(tempMat);
      }
      var texBase = tex.baseTexture;
      var frame = this.uClampFrame;
      var margin = this.clampMargin / texBase.resolution;
      var offset = this.clampOffset;
      frame[0] = (tex._frame.x + margin + offset) / texBase.width;
      frame[1] = (tex._frame.y + margin + offset) / texBase.height;
      frame[2] = (tex._frame.x + tex._frame.width - margin + offset) / texBase.width;
      frame[3] = (tex._frame.y + tex._frame.height - margin + offset) / texBase.height;
      this.uClampOffset[0] = offset / texBase.realWidth;
      this.uClampOffset[1] = offset / texBase.realHeight;
      this.isSimple = tex._frame.width === texBase.width && tex._frame.height === texBase.height && tex.rotate === 0;
      return true;
    };
    return TextureMatrix2;
  }();
  var SpriteMaskFilter = function(_super) {
    __extends3(SpriteMaskFilter2, _super);
    function SpriteMaskFilter2(sprite5) {
      var _this = this;
      var maskMatrix = new Matrix();
      _this = _super.call(this, vertex, fragment) || this;
      sprite5.renderable = false;
      _this.maskSprite = sprite5;
      _this.maskMatrix = maskMatrix;
      return _this;
    }
    SpriteMaskFilter2.prototype.apply = function(filterManager, input3, output, clearMode) {
      var maskSprite = this.maskSprite;
      var tex = maskSprite._texture;
      if (!tex.valid) {
        return;
      }
      if (!tex.uvMatrix) {
        tex.uvMatrix = new TextureMatrix(tex, 0);
      }
      tex.uvMatrix.update();
      this.uniforms.npmAlpha = tex.baseTexture.alphaMode ? 0 : 1;
      this.uniforms.mask = tex;
      this.uniforms.otherMatrix = filterManager.calculateSpriteMatrix(this.maskMatrix, maskSprite).prepend(tex.uvMatrix.mapCoord);
      this.uniforms.alpha = maskSprite.worldAlpha;
      this.uniforms.maskClamp = tex.uvMatrix.uClampFrame;
      filterManager.applyFilter(this, input3, output, clearMode);
    };
    return SpriteMaskFilter2;
  }(Filter);
  var MaskSystem = function(_super) {
    __extends3(MaskSystem2, _super);
    function MaskSystem2(renderer) {
      var _this = _super.call(this, renderer) || this;
      _this.enableScissor = false;
      _this.alphaMaskPool = [];
      _this.maskDataPool = [];
      _this.maskStack = [];
      _this.alphaMaskIndex = 0;
      return _this;
    }
    MaskSystem2.prototype.setMaskStack = function(maskStack) {
      this.maskStack = maskStack;
      this.renderer.scissor.setMaskStack(maskStack);
      this.renderer.stencil.setMaskStack(maskStack);
    };
    MaskSystem2.prototype.push = function(target, maskDataOrTarget) {
      var maskData = maskDataOrTarget;
      if (!maskData.isMaskData) {
        var d = this.maskDataPool.pop() || new MaskData();
        d.pooled = true;
        d.maskObject = maskDataOrTarget;
        maskData = d;
      }
      if (maskData.autoDetect) {
        this.detect(maskData);
      }
      maskData.copyCountersOrReset(this.maskStack[this.maskStack.length - 1]);
      maskData._target = target;
      switch (maskData.type) {
        case MASK_TYPES.SCISSOR:
          this.maskStack.push(maskData);
          this.renderer.scissor.push(maskData);
          break;
        case MASK_TYPES.STENCIL:
          this.maskStack.push(maskData);
          this.renderer.stencil.push(maskData);
          break;
        case MASK_TYPES.SPRITE:
          maskData.copyCountersOrReset(null);
          this.pushSpriteMask(maskData);
          this.maskStack.push(maskData);
          break;
        default:
          break;
      }
    };
    MaskSystem2.prototype.pop = function(target) {
      var maskData = this.maskStack.pop();
      if (!maskData || maskData._target !== target) {
        return;
      }
      switch (maskData.type) {
        case MASK_TYPES.SCISSOR:
          this.renderer.scissor.pop();
          break;
        case MASK_TYPES.STENCIL:
          this.renderer.stencil.pop(maskData.maskObject);
          break;
        case MASK_TYPES.SPRITE:
          this.popSpriteMask();
          break;
        default:
          break;
      }
      maskData.reset();
      if (maskData.pooled) {
        this.maskDataPool.push(maskData);
      }
    };
    MaskSystem2.prototype.detect = function(maskData) {
      var maskObject = maskData.maskObject;
      if (maskObject.isSprite) {
        maskData.type = MASK_TYPES.SPRITE;
        return;
      }
      maskData.type = MASK_TYPES.STENCIL;
      if (this.enableScissor && maskObject.isFastRect && maskObject.isFastRect()) {
        var matrix = maskObject.worldTransform;
        var rotX = Math.atan2(matrix.b, matrix.a);
        var rotXY = Math.atan2(matrix.d, matrix.c);
        rotX = Math.round(rotX * (180 / Math.PI) * 100);
        rotXY = Math.round(rotXY * (180 / Math.PI) * 100) - rotX;
        rotX = (rotX % 9e3 + 9e3) % 9e3;
        rotXY = (rotXY % 18e3 + 18e3) % 18e3;
        if (rotX === 0 && rotXY === 9e3) {
          maskData.type = MASK_TYPES.SCISSOR;
        }
      }
    };
    MaskSystem2.prototype.pushSpriteMask = function(maskData) {
      var maskObject = maskData.maskObject;
      var target = maskData._target;
      var alphaMaskFilter = this.alphaMaskPool[this.alphaMaskIndex];
      if (!alphaMaskFilter) {
        alphaMaskFilter = this.alphaMaskPool[this.alphaMaskIndex] = [new SpriteMaskFilter(maskObject)];
      }
      alphaMaskFilter[0].resolution = this.renderer.resolution;
      alphaMaskFilter[0].maskSprite = maskObject;
      var stashFilterArea = target.filterArea;
      target.filterArea = maskObject.getBounds(true);
      this.renderer.filter.push(target, alphaMaskFilter);
      target.filterArea = stashFilterArea;
      this.alphaMaskIndex++;
    };
    MaskSystem2.prototype.popSpriteMask = function() {
      this.renderer.filter.pop();
      this.alphaMaskIndex--;
    };
    return MaskSystem2;
  }(System);
  var AbstractMaskSystem = function(_super) {
    __extends3(AbstractMaskSystem2, _super);
    function AbstractMaskSystem2(renderer) {
      var _this = _super.call(this, renderer) || this;
      _this.maskStack = [];
      _this.glConst = 0;
      return _this;
    }
    AbstractMaskSystem2.prototype.getStackLength = function() {
      return this.maskStack.length;
    };
    AbstractMaskSystem2.prototype.setMaskStack = function(maskStack) {
      var gl = this.renderer.gl;
      var curStackLen = this.getStackLength();
      this.maskStack = maskStack;
      var newStackLen = this.getStackLength();
      if (newStackLen !== curStackLen) {
        if (newStackLen === 0) {
          gl.disable(this.glConst);
        } else {
          gl.enable(this.glConst);
          this._useCurrent();
        }
      }
    };
    AbstractMaskSystem2.prototype._useCurrent = function() {
    };
    AbstractMaskSystem2.prototype.destroy = function() {
      _super.prototype.destroy.call(this);
      this.maskStack = null;
    };
    return AbstractMaskSystem2;
  }(System);
  var ScissorSystem = function(_super) {
    __extends3(ScissorSystem2, _super);
    function ScissorSystem2(renderer) {
      var _this = _super.call(this, renderer) || this;
      _this.glConst = WebGLRenderingContext.SCISSOR_TEST;
      return _this;
    }
    ScissorSystem2.prototype.getStackLength = function() {
      var maskData = this.maskStack[this.maskStack.length - 1];
      if (maskData) {
        return maskData._scissorCounter;
      }
      return 0;
    };
    ScissorSystem2.prototype.push = function(maskData) {
      var maskObject = maskData.maskObject;
      maskObject.renderable = true;
      var prevData = maskData._scissorRect;
      var bounds = maskObject.getBounds(true);
      var gl = this.renderer.gl;
      maskObject.renderable = false;
      if (prevData) {
        bounds.fit(prevData);
      } else {
        gl.enable(gl.SCISSOR_TEST);
      }
      maskData._scissorCounter++;
      maskData._scissorRect = bounds;
      this._useCurrent();
    };
    ScissorSystem2.prototype.pop = function() {
      var gl = this.renderer.gl;
      if (this.getStackLength() > 0) {
        this._useCurrent();
      } else {
        gl.disable(gl.SCISSOR_TEST);
      }
    };
    ScissorSystem2.prototype._useCurrent = function() {
      var rect = this.maskStack[this.maskStack.length - 1]._scissorRect;
      var rt = this.renderer.renderTexture.current;
      var _a2 = this.renderer.projection, transform = _a2.transform, sourceFrame = _a2.sourceFrame, destinationFrame = _a2.destinationFrame;
      var resolution = rt ? rt.resolution : this.renderer.resolution;
      var x = (rect.x - sourceFrame.x) * resolution + destinationFrame.x;
      var y = (rect.y - sourceFrame.y) * resolution + destinationFrame.y;
      var width = rect.width * resolution;
      var height = rect.height * resolution;
      if (transform) {
        x += transform.tx * resolution;
        y += transform.ty * resolution;
      }
      if (!rt) {
        y = this.renderer.height - height - y;
      }
      this.renderer.gl.scissor(x, y, width, height);
    };
    return ScissorSystem2;
  }(AbstractMaskSystem);
  var StencilSystem = function(_super) {
    __extends3(StencilSystem2, _super);
    function StencilSystem2(renderer) {
      var _this = _super.call(this, renderer) || this;
      _this.glConst = WebGLRenderingContext.STENCIL_TEST;
      return _this;
    }
    StencilSystem2.prototype.getStackLength = function() {
      var maskData = this.maskStack[this.maskStack.length - 1];
      if (maskData) {
        return maskData._stencilCounter;
      }
      return 0;
    };
    StencilSystem2.prototype.push = function(maskData) {
      var maskObject = maskData.maskObject;
      var gl = this.renderer.gl;
      var prevMaskCount = maskData._stencilCounter;
      if (prevMaskCount === 0) {
        this.renderer.framebuffer.forceStencil();
        gl.enable(gl.STENCIL_TEST);
      }
      maskData._stencilCounter++;
      gl.colorMask(false, false, false, false);
      gl.stencilFunc(gl.EQUAL, prevMaskCount, this._getBitwiseMask());
      gl.stencilOp(gl.KEEP, gl.KEEP, gl.INCR);
      maskObject.renderable = true;
      maskObject.render(this.renderer);
      this.renderer.batch.flush();
      maskObject.renderable = false;
      this._useCurrent();
    };
    StencilSystem2.prototype.pop = function(maskObject) {
      var gl = this.renderer.gl;
      if (this.getStackLength() === 0) {
        gl.disable(gl.STENCIL_TEST);
        gl.clear(gl.STENCIL_BUFFER_BIT);
        gl.clearStencil(0);
      } else {
        gl.colorMask(false, false, false, false);
        gl.stencilOp(gl.KEEP, gl.KEEP, gl.DECR);
        maskObject.renderable = true;
        maskObject.render(this.renderer);
        this.renderer.batch.flush();
        maskObject.renderable = false;
        this._useCurrent();
      }
    };
    StencilSystem2.prototype._useCurrent = function() {
      var gl = this.renderer.gl;
      gl.colorMask(true, true, true, true);
      gl.stencilFunc(gl.EQUAL, this.getStackLength(), this._getBitwiseMask());
      gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
    };
    StencilSystem2.prototype._getBitwiseMask = function() {
      return (1 << this.getStackLength()) - 1;
    };
    return StencilSystem2;
  }(AbstractMaskSystem);
  var ProjectionSystem = function(_super) {
    __extends3(ProjectionSystem2, _super);
    function ProjectionSystem2(renderer) {
      var _this = _super.call(this, renderer) || this;
      _this.destinationFrame = null;
      _this.sourceFrame = null;
      _this.defaultFrame = null;
      _this.projectionMatrix = new Matrix();
      _this.transform = null;
      return _this;
    }
    ProjectionSystem2.prototype.update = function(destinationFrame, sourceFrame, resolution, root) {
      this.destinationFrame = destinationFrame || this.destinationFrame || this.defaultFrame;
      this.sourceFrame = sourceFrame || this.sourceFrame || destinationFrame;
      this.calculateProjection(this.destinationFrame, this.sourceFrame, resolution, root);
      if (this.transform) {
        this.projectionMatrix.append(this.transform);
      }
      var renderer = this.renderer;
      renderer.globalUniforms.uniforms.projectionMatrix = this.projectionMatrix;
      renderer.globalUniforms.update();
      if (renderer.shader.shader) {
        renderer.shader.syncUniformGroup(renderer.shader.shader.uniforms.globals);
      }
    };
    ProjectionSystem2.prototype.calculateProjection = function(_destinationFrame, sourceFrame, _resolution, root) {
      var pm = this.projectionMatrix;
      var sign2 = !root ? 1 : -1;
      pm.identity();
      pm.a = 1 / sourceFrame.width * 2;
      pm.d = sign2 * (1 / sourceFrame.height * 2);
      pm.tx = -1 - sourceFrame.x * pm.a;
      pm.ty = -sign2 - sourceFrame.y * pm.d;
    };
    ProjectionSystem2.prototype.setTransform = function(_matrix) {
    };
    return ProjectionSystem2;
  }(System);
  var tempRect = new Rectangle();
  var tempRect2 = new Rectangle();
  var viewportFrame = new Rectangle();
  var RenderTextureSystem = function(_super) {
    __extends3(RenderTextureSystem2, _super);
    function RenderTextureSystem2(renderer) {
      var _this = _super.call(this, renderer) || this;
      _this.clearColor = renderer._backgroundColorRgba;
      _this.defaultMaskStack = [];
      _this.current = null;
      _this.sourceFrame = new Rectangle();
      _this.destinationFrame = new Rectangle();
      return _this;
    }
    RenderTextureSystem2.prototype.bind = function(renderTexture, sourceFrame, destinationFrame) {
      if (renderTexture === void 0) {
        renderTexture = null;
      }
      var renderer = this.renderer;
      this.current = renderTexture;
      var baseTexture;
      var framebuffer;
      var resolution;
      if (renderTexture) {
        baseTexture = renderTexture.baseTexture;
        resolution = baseTexture.resolution;
        if (!sourceFrame) {
          tempRect.width = renderTexture.frame.width;
          tempRect.height = renderTexture.frame.height;
          sourceFrame = tempRect;
        }
        if (!destinationFrame) {
          tempRect2.x = renderTexture.frame.x;
          tempRect2.y = renderTexture.frame.y;
          tempRect2.width = sourceFrame.width;
          tempRect2.height = sourceFrame.height;
          destinationFrame = tempRect2;
        }
        framebuffer = baseTexture.framebuffer;
      } else {
        resolution = renderer.resolution;
        if (!sourceFrame) {
          tempRect.width = renderer.screen.width;
          tempRect.height = renderer.screen.height;
          sourceFrame = tempRect;
        }
        if (!destinationFrame) {
          destinationFrame = tempRect;
          destinationFrame.width = sourceFrame.width;
          destinationFrame.height = sourceFrame.height;
        }
      }
      viewportFrame.x = destinationFrame.x * resolution;
      viewportFrame.y = destinationFrame.y * resolution;
      viewportFrame.width = destinationFrame.width * resolution;
      viewportFrame.height = destinationFrame.height * resolution;
      this.renderer.framebuffer.bind(framebuffer, viewportFrame);
      this.renderer.projection.update(destinationFrame, sourceFrame, resolution, !framebuffer);
      if (renderTexture) {
        this.renderer.mask.setMaskStack(baseTexture.maskStack);
      } else {
        this.renderer.mask.setMaskStack(this.defaultMaskStack);
      }
      this.sourceFrame.copyFrom(sourceFrame);
      this.destinationFrame.copyFrom(destinationFrame);
    };
    RenderTextureSystem2.prototype.clear = function(clearColor, mask) {
      if (this.current) {
        clearColor = clearColor || this.current.baseTexture.clearColor;
      } else {
        clearColor = clearColor || this.clearColor;
      }
      this.renderer.framebuffer.clear(clearColor[0], clearColor[1], clearColor[2], clearColor[3], mask);
    };
    RenderTextureSystem2.prototype.resize = function() {
      this.bind(null);
    };
    RenderTextureSystem2.prototype.reset = function() {
      this.bind(null);
    };
    return RenderTextureSystem2;
  }(System);
  var IGLUniformData = function() {
    function IGLUniformData2() {
    }
    return IGLUniformData2;
  }();
  var GLProgram = function() {
    function GLProgram2(program, uniformData) {
      this.program = program;
      this.uniformData = uniformData;
      this.uniformGroups = {};
    }
    GLProgram2.prototype.destroy = function() {
      this.uniformData = null;
      this.uniformGroups = null;
      this.program = null;
    };
    return GLProgram2;
  }();
  var UID$4 = 0;
  var defaultSyncData = {textureCount: 0};
  var ShaderSystem = function(_super) {
    __extends3(ShaderSystem2, _super);
    function ShaderSystem2(renderer) {
      var _this = _super.call(this, renderer) || this;
      _this.destroyed = false;
      _this.systemCheck();
      _this.gl = null;
      _this.shader = null;
      _this.program = null;
      _this.cache = {};
      _this.id = UID$4++;
      return _this;
    }
    ShaderSystem2.prototype.systemCheck = function() {
      if (!unsafeEvalSupported()) {
        throw new Error("Current environment does not allow unsafe-eval, please use @pixi/unsafe-eval module to enable support.");
      }
    };
    ShaderSystem2.prototype.contextChange = function(gl) {
      this.gl = gl;
      this.reset();
    };
    ShaderSystem2.prototype.bind = function(shader, dontSync) {
      shader.uniforms.globals = this.renderer.globalUniforms;
      var program = shader.program;
      var glProgram = program.glPrograms[this.renderer.CONTEXT_UID] || this.generateShader(shader);
      this.shader = shader;
      if (this.program !== program) {
        this.program = program;
        this.gl.useProgram(glProgram.program);
      }
      if (!dontSync) {
        defaultSyncData.textureCount = 0;
        this.syncUniformGroup(shader.uniformGroup, defaultSyncData);
      }
      return glProgram;
    };
    ShaderSystem2.prototype.setUniforms = function(uniforms) {
      var shader = this.shader.program;
      var glProgram = shader.glPrograms[this.renderer.CONTEXT_UID];
      shader.syncUniforms(glProgram.uniformData, uniforms, this.renderer);
    };
    ShaderSystem2.prototype.syncUniformGroup = function(group, syncData) {
      var glProgram = this.getglProgram();
      if (!group.static || group.dirtyId !== glProgram.uniformGroups[group.id]) {
        glProgram.uniformGroups[group.id] = group.dirtyId;
        this.syncUniforms(group, glProgram, syncData);
      }
    };
    ShaderSystem2.prototype.syncUniforms = function(group, glProgram, syncData) {
      var syncFunc = group.syncUniforms[this.shader.program.id] || this.createSyncGroups(group);
      syncFunc(glProgram.uniformData, group.uniforms, this.renderer, syncData);
    };
    ShaderSystem2.prototype.createSyncGroups = function(group) {
      var id = this.getSignature(group, this.shader.program.uniformData);
      if (!this.cache[id]) {
        this.cache[id] = generateUniformsSync(group, this.shader.program.uniformData);
      }
      group.syncUniforms[this.shader.program.id] = this.cache[id];
      return group.syncUniforms[this.shader.program.id];
    };
    ShaderSystem2.prototype.getSignature = function(group, uniformData) {
      var uniforms = group.uniforms;
      var strings = [];
      for (var i in uniforms) {
        strings.push(i);
        if (uniformData[i]) {
          strings.push(uniformData[i].type);
        }
      }
      return strings.join("-");
    };
    ShaderSystem2.prototype.getglProgram = function() {
      if (this.shader) {
        return this.shader.program.glPrograms[this.renderer.CONTEXT_UID];
      }
      return null;
    };
    ShaderSystem2.prototype.generateShader = function(shader) {
      var gl = this.gl;
      var program = shader.program;
      var attribMap = {};
      for (var i in program.attributeData) {
        attribMap[i] = program.attributeData[i].location;
      }
      var shaderProgram = compileProgram(gl, program.vertexSrc, program.fragmentSrc, attribMap);
      var uniformData = {};
      for (var i in program.uniformData) {
        var data = program.uniformData[i];
        uniformData[i] = {
          location: gl.getUniformLocation(shaderProgram, i),
          value: defaultValue(data.type, data.size)
        };
      }
      var glProgram = new GLProgram(shaderProgram, uniformData);
      program.glPrograms[this.renderer.CONTEXT_UID] = glProgram;
      return glProgram;
    };
    ShaderSystem2.prototype.reset = function() {
      this.program = null;
      this.shader = null;
    };
    ShaderSystem2.prototype.destroy = function() {
      this.destroyed = true;
    };
    return ShaderSystem2;
  }(System);
  function mapWebGLBlendModesToPixi(gl, array) {
    if (array === void 0) {
      array = [];
    }
    array[BLEND_MODES.NORMAL] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
    array[BLEND_MODES.ADD] = [gl.ONE, gl.ONE];
    array[BLEND_MODES.MULTIPLY] = [gl.DST_COLOR, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
    array[BLEND_MODES.SCREEN] = [gl.ONE, gl.ONE_MINUS_SRC_COLOR, gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
    array[BLEND_MODES.OVERLAY] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
    array[BLEND_MODES.DARKEN] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
    array[BLEND_MODES.LIGHTEN] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
    array[BLEND_MODES.COLOR_DODGE] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
    array[BLEND_MODES.COLOR_BURN] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
    array[BLEND_MODES.HARD_LIGHT] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
    array[BLEND_MODES.SOFT_LIGHT] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
    array[BLEND_MODES.DIFFERENCE] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
    array[BLEND_MODES.EXCLUSION] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
    array[BLEND_MODES.HUE] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
    array[BLEND_MODES.SATURATION] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
    array[BLEND_MODES.COLOR] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
    array[BLEND_MODES.LUMINOSITY] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
    array[BLEND_MODES.NONE] = [0, 0];
    array[BLEND_MODES.NORMAL_NPM] = [gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
    array[BLEND_MODES.ADD_NPM] = [gl.SRC_ALPHA, gl.ONE, gl.ONE, gl.ONE];
    array[BLEND_MODES.SCREEN_NPM] = [gl.SRC_ALPHA, gl.ONE_MINUS_SRC_COLOR, gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
    array[BLEND_MODES.SRC_IN] = [gl.DST_ALPHA, gl.ZERO];
    array[BLEND_MODES.SRC_OUT] = [gl.ONE_MINUS_DST_ALPHA, gl.ZERO];
    array[BLEND_MODES.SRC_ATOP] = [gl.DST_ALPHA, gl.ONE_MINUS_SRC_ALPHA];
    array[BLEND_MODES.DST_OVER] = [gl.ONE_MINUS_DST_ALPHA, gl.ONE];
    array[BLEND_MODES.DST_IN] = [gl.ZERO, gl.SRC_ALPHA];
    array[BLEND_MODES.DST_OUT] = [gl.ZERO, gl.ONE_MINUS_SRC_ALPHA];
    array[BLEND_MODES.DST_ATOP] = [gl.ONE_MINUS_DST_ALPHA, gl.SRC_ALPHA];
    array[BLEND_MODES.XOR] = [gl.ONE_MINUS_DST_ALPHA, gl.ONE_MINUS_SRC_ALPHA];
    array[BLEND_MODES.SUBTRACT] = [gl.ONE, gl.ONE, gl.ONE, gl.ONE, gl.FUNC_REVERSE_SUBTRACT, gl.FUNC_ADD];
    return array;
  }
  var BLEND$1 = 0;
  var OFFSET$1 = 1;
  var CULLING$1 = 2;
  var DEPTH_TEST$1 = 3;
  var WINDING$1 = 4;
  var StateSystem = function(_super) {
    __extends3(StateSystem2, _super);
    function StateSystem2(renderer) {
      var _this = _super.call(this, renderer) || this;
      _this.gl = null;
      _this.stateId = 0;
      _this.polygonOffset = 0;
      _this.blendMode = BLEND_MODES.NONE;
      _this._blendEq = false;
      _this.map = [];
      _this.map[BLEND$1] = _this.setBlend;
      _this.map[OFFSET$1] = _this.setOffset;
      _this.map[CULLING$1] = _this.setCullFace;
      _this.map[DEPTH_TEST$1] = _this.setDepthTest;
      _this.map[WINDING$1] = _this.setFrontFace;
      _this.checks = [];
      _this.defaultState = new State();
      _this.defaultState.blend = true;
      return _this;
    }
    StateSystem2.prototype.contextChange = function(gl) {
      this.gl = gl;
      this.blendModes = mapWebGLBlendModesToPixi(gl);
      this.set(this.defaultState);
      this.reset();
    };
    StateSystem2.prototype.set = function(state) {
      state = state || this.defaultState;
      if (this.stateId !== state.data) {
        var diff = this.stateId ^ state.data;
        var i = 0;
        while (diff) {
          if (diff & 1) {
            this.map[i].call(this, !!(state.data & 1 << i));
          }
          diff = diff >> 1;
          i++;
        }
        this.stateId = state.data;
      }
      for (var i = 0; i < this.checks.length; i++) {
        this.checks[i](this, state);
      }
    };
    StateSystem2.prototype.forceState = function(state) {
      state = state || this.defaultState;
      for (var i = 0; i < this.map.length; i++) {
        this.map[i].call(this, !!(state.data & 1 << i));
      }
      for (var i = 0; i < this.checks.length; i++) {
        this.checks[i](this, state);
      }
      this.stateId = state.data;
    };
    StateSystem2.prototype.setBlend = function(value) {
      this.updateCheck(StateSystem2.checkBlendMode, value);
      this.gl[value ? "enable" : "disable"](this.gl.BLEND);
    };
    StateSystem2.prototype.setOffset = function(value) {
      this.updateCheck(StateSystem2.checkPolygonOffset, value);
      this.gl[value ? "enable" : "disable"](this.gl.POLYGON_OFFSET_FILL);
    };
    StateSystem2.prototype.setDepthTest = function(value) {
      this.gl[value ? "enable" : "disable"](this.gl.DEPTH_TEST);
    };
    StateSystem2.prototype.setCullFace = function(value) {
      this.gl[value ? "enable" : "disable"](this.gl.CULL_FACE);
    };
    StateSystem2.prototype.setFrontFace = function(value) {
      this.gl.frontFace(this.gl[value ? "CW" : "CCW"]);
    };
    StateSystem2.prototype.setBlendMode = function(value) {
      if (value === this.blendMode) {
        return;
      }
      this.blendMode = value;
      var mode = this.blendModes[value];
      var gl = this.gl;
      if (mode.length === 2) {
        gl.blendFunc(mode[0], mode[1]);
      } else {
        gl.blendFuncSeparate(mode[0], mode[1], mode[2], mode[3]);
      }
      if (mode.length === 6) {
        this._blendEq = true;
        gl.blendEquationSeparate(mode[4], mode[5]);
      } else if (this._blendEq) {
        this._blendEq = false;
        gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD);
      }
    };
    StateSystem2.prototype.setPolygonOffset = function(value, scale) {
      this.gl.polygonOffset(value, scale);
    };
    StateSystem2.prototype.reset = function() {
      this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, false);
      this.forceState(this.defaultState);
      this._blendEq = true;
      this.blendMode = -1;
      this.setBlendMode(0);
    };
    StateSystem2.prototype.updateCheck = function(func, value) {
      var index2 = this.checks.indexOf(func);
      if (value && index2 === -1) {
        this.checks.push(func);
      } else if (!value && index2 !== -1) {
        this.checks.splice(index2, 1);
      }
    };
    StateSystem2.checkBlendMode = function(system, state) {
      system.setBlendMode(state.blendMode);
    };
    StateSystem2.checkPolygonOffset = function(system, state) {
      system.setPolygonOffset(1, state.polygonOffset);
    };
    return StateSystem2;
  }(System);
  var TextureGCSystem = function(_super) {
    __extends3(TextureGCSystem2, _super);
    function TextureGCSystem2(renderer) {
      var _this = _super.call(this, renderer) || this;
      _this.count = 0;
      _this.checkCount = 0;
      _this.maxIdle = settings.GC_MAX_IDLE;
      _this.checkCountMax = settings.GC_MAX_CHECK_COUNT;
      _this.mode = settings.GC_MODE;
      return _this;
    }
    TextureGCSystem2.prototype.postrender = function() {
      if (!this.renderer.renderingToScreen) {
        return;
      }
      this.count++;
      if (this.mode === GC_MODES.MANUAL) {
        return;
      }
      this.checkCount++;
      if (this.checkCount > this.checkCountMax) {
        this.checkCount = 0;
        this.run();
      }
    };
    TextureGCSystem2.prototype.run = function() {
      var tm = this.renderer.texture;
      var managedTextures = tm.managedTextures;
      var wasRemoved = false;
      for (var i = 0; i < managedTextures.length; i++) {
        var texture = managedTextures[i];
        if (!texture.framebuffer && this.count - texture.touched > this.maxIdle) {
          tm.destroyTexture(texture, true);
          managedTextures[i] = null;
          wasRemoved = true;
        }
      }
      if (wasRemoved) {
        var j = 0;
        for (var i = 0; i < managedTextures.length; i++) {
          if (managedTextures[i] !== null) {
            managedTextures[j++] = managedTextures[i];
          }
        }
        managedTextures.length = j;
      }
    };
    TextureGCSystem2.prototype.unload = function(displayObject) {
      var _a2;
      var tm = this.renderer.texture;
      if ((_a2 = displayObject._texture) === null || _a2 === void 0 ? void 0 : _a2.framebuffer) {
        tm.destroyTexture(displayObject._texture);
      }
      for (var i = displayObject.children.length - 1; i >= 0; i--) {
        this.unload(displayObject.children[i]);
      }
    };
    return TextureGCSystem2;
  }(System);
  var GLTexture = function() {
    function GLTexture2(texture) {
      this.texture = texture;
      this.width = -1;
      this.height = -1;
      this.dirtyId = -1;
      this.dirtyStyleId = -1;
      this.mipmap = false;
      this.wrapMode = 33071;
      this.type = 6408;
      this.internalFormat = 5121;
    }
    return GLTexture2;
  }();
  var TextureSystem = function(_super) {
    __extends3(TextureSystem2, _super);
    function TextureSystem2(renderer) {
      var _this = _super.call(this, renderer) || this;
      _this.boundTextures = [];
      _this.currentLocation = -1;
      _this.managedTextures = [];
      _this._unknownBoundTextures = false;
      _this.unknownTexture = new BaseTexture();
      return _this;
    }
    TextureSystem2.prototype.contextChange = function() {
      var gl = this.gl = this.renderer.gl;
      this.CONTEXT_UID = this.renderer.CONTEXT_UID;
      this.webGLVersion = this.renderer.context.webGLVersion;
      var maxTextures = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
      this.boundTextures.length = maxTextures;
      for (var i = 0; i < maxTextures; i++) {
        this.boundTextures[i] = null;
      }
      this.emptyTextures = {};
      var emptyTexture2D = new GLTexture(gl.createTexture());
      gl.bindTexture(gl.TEXTURE_2D, emptyTexture2D.texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(4));
      this.emptyTextures[gl.TEXTURE_2D] = emptyTexture2D;
      this.emptyTextures[gl.TEXTURE_CUBE_MAP] = new GLTexture(gl.createTexture());
      gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.emptyTextures[gl.TEXTURE_CUBE_MAP].texture);
      for (var i = 0; i < 6; i++) {
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      }
      gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      for (var i = 0; i < this.boundTextures.length; i++) {
        this.bind(null, i);
      }
    };
    TextureSystem2.prototype.bind = function(texture, location) {
      if (location === void 0) {
        location = 0;
      }
      var gl = this.gl;
      if (texture) {
        texture = texture.castToBaseTexture();
        if (texture.parentTextureArray) {
          return;
        }
        if (texture.valid) {
          texture.touched = this.renderer.textureGC.count;
          var glTexture = texture._glTextures[this.CONTEXT_UID] || this.initTexture(texture);
          if (this.boundTextures[location] !== texture) {
            if (this.currentLocation !== location) {
              this.currentLocation = location;
              gl.activeTexture(gl.TEXTURE0 + location);
            }
            gl.bindTexture(texture.target, glTexture.texture);
          }
          if (glTexture.dirtyId !== texture.dirtyId) {
            if (this.currentLocation !== location) {
              this.currentLocation = location;
              gl.activeTexture(gl.TEXTURE0 + location);
            }
            this.updateTexture(texture);
          }
          this.boundTextures[location] = texture;
        }
      } else {
        if (this.currentLocation !== location) {
          this.currentLocation = location;
          gl.activeTexture(gl.TEXTURE0 + location);
        }
        gl.bindTexture(gl.TEXTURE_2D, this.emptyTextures[gl.TEXTURE_2D].texture);
        this.boundTextures[location] = null;
      }
    };
    TextureSystem2.prototype.reset = function() {
      this._unknownBoundTextures = true;
      this.currentLocation = -1;
      for (var i = 0; i < this.boundTextures.length; i++) {
        this.boundTextures[i] = this.unknownTexture;
      }
    };
    TextureSystem2.prototype.unbind = function(texture) {
      var _a2 = this, gl = _a2.gl, boundTextures = _a2.boundTextures;
      if (this._unknownBoundTextures) {
        this._unknownBoundTextures = false;
        for (var i = 0; i < boundTextures.length; i++) {
          if (boundTextures[i] === this.unknownTexture) {
            this.bind(null, i);
          }
        }
      }
      for (var i = 0; i < boundTextures.length; i++) {
        if (boundTextures[i] === texture) {
          if (this.currentLocation !== i) {
            gl.activeTexture(gl.TEXTURE0 + i);
            this.currentLocation = i;
          }
          gl.bindTexture(gl.TEXTURE_2D, this.emptyTextures[texture.target].texture);
          boundTextures[i] = null;
        }
      }
    };
    TextureSystem2.prototype.initTexture = function(texture) {
      var glTexture = new GLTexture(this.gl.createTexture());
      glTexture.dirtyId = -1;
      texture._glTextures[this.CONTEXT_UID] = glTexture;
      this.managedTextures.push(texture);
      texture.on("dispose", this.destroyTexture, this);
      return glTexture;
    };
    TextureSystem2.prototype.initTextureType = function(texture, glTexture) {
      glTexture.internalFormat = texture.format;
      glTexture.type = texture.type;
      if (this.webGLVersion !== 2) {
        return;
      }
      var gl = this.renderer.gl;
      if (texture.type === gl.FLOAT && texture.format === gl.RGBA) {
        glTexture.internalFormat = gl.RGBA32F;
      }
      if (texture.type === TYPES.HALF_FLOAT) {
        glTexture.type = gl.HALF_FLOAT;
      }
      if (glTexture.type === gl.HALF_FLOAT && texture.format === gl.RGBA) {
        glTexture.internalFormat = gl.RGBA16F;
      }
    };
    TextureSystem2.prototype.updateTexture = function(texture) {
      var glTexture = texture._glTextures[this.CONTEXT_UID];
      if (!glTexture) {
        return;
      }
      var renderer = this.renderer;
      this.initTextureType(texture, glTexture);
      if (texture.resource && texture.resource.upload(renderer, texture, glTexture))
        ;
      else {
        var width = texture.realWidth;
        var height = texture.realHeight;
        var gl = renderer.gl;
        if (glTexture.width !== width || glTexture.height !== height || glTexture.dirtyId < 0) {
          glTexture.width = width;
          glTexture.height = height;
          gl.texImage2D(texture.target, 0, glTexture.internalFormat, width, height, 0, texture.format, glTexture.type, null);
        }
      }
      if (texture.dirtyStyleId !== glTexture.dirtyStyleId) {
        this.updateTextureStyle(texture);
      }
      glTexture.dirtyId = texture.dirtyId;
    };
    TextureSystem2.prototype.destroyTexture = function(texture, skipRemove) {
      var gl = this.gl;
      texture = texture.castToBaseTexture();
      if (texture._glTextures[this.CONTEXT_UID]) {
        this.unbind(texture);
        gl.deleteTexture(texture._glTextures[this.CONTEXT_UID].texture);
        texture.off("dispose", this.destroyTexture, this);
        delete texture._glTextures[this.CONTEXT_UID];
        if (!skipRemove) {
          var i = this.managedTextures.indexOf(texture);
          if (i !== -1) {
            removeItems(this.managedTextures, i, 1);
          }
        }
      }
    };
    TextureSystem2.prototype.updateTextureStyle = function(texture) {
      var glTexture = texture._glTextures[this.CONTEXT_UID];
      if (!glTexture) {
        return;
      }
      if ((texture.mipmap === MIPMAP_MODES.POW2 || this.webGLVersion !== 2) && !texture.isPowerOfTwo) {
        glTexture.mipmap = false;
      } else {
        glTexture.mipmap = texture.mipmap >= 1;
      }
      if (this.webGLVersion !== 2 && !texture.isPowerOfTwo) {
        glTexture.wrapMode = WRAP_MODES.CLAMP;
      } else {
        glTexture.wrapMode = texture.wrapMode;
      }
      if (texture.resource && texture.resource.style(this.renderer, texture, glTexture))
        ;
      else {
        this.setStyle(texture, glTexture);
      }
      glTexture.dirtyStyleId = texture.dirtyStyleId;
    };
    TextureSystem2.prototype.setStyle = function(texture, glTexture) {
      var gl = this.gl;
      if (glTexture.mipmap) {
        gl.generateMipmap(texture.target);
      }
      gl.texParameteri(texture.target, gl.TEXTURE_WRAP_S, glTexture.wrapMode);
      gl.texParameteri(texture.target, gl.TEXTURE_WRAP_T, glTexture.wrapMode);
      if (glTexture.mipmap) {
        gl.texParameteri(texture.target, gl.TEXTURE_MIN_FILTER, texture.scaleMode === SCALE_MODES.LINEAR ? gl.LINEAR_MIPMAP_LINEAR : gl.NEAREST_MIPMAP_NEAREST);
        var anisotropicExt = this.renderer.context.extensions.anisotropicFiltering;
        if (anisotropicExt && texture.anisotropicLevel > 0 && texture.scaleMode === SCALE_MODES.LINEAR) {
          var level = Math.min(texture.anisotropicLevel, gl.getParameter(anisotropicExt.MAX_TEXTURE_MAX_ANISOTROPY_EXT));
          gl.texParameterf(texture.target, anisotropicExt.TEXTURE_MAX_ANISOTROPY_EXT, level);
        }
      } else {
        gl.texParameteri(texture.target, gl.TEXTURE_MIN_FILTER, texture.scaleMode === SCALE_MODES.LINEAR ? gl.LINEAR : gl.NEAREST);
      }
      gl.texParameteri(texture.target, gl.TEXTURE_MAG_FILTER, texture.scaleMode === SCALE_MODES.LINEAR ? gl.LINEAR : gl.NEAREST);
    };
    return TextureSystem2;
  }(System);
  var tempMatrix = new Matrix();
  var AbstractRenderer = function(_super) {
    __extends3(AbstractRenderer2, _super);
    function AbstractRenderer2(type, options) {
      if (type === void 0) {
        type = RENDERER_TYPE.UNKNOWN;
      }
      var _this = _super.call(this) || this;
      options = Object.assign({}, settings.RENDER_OPTIONS, options);
      if (options.roundPixels) {
        settings.ROUND_PIXELS = options.roundPixels;
        deprecation("5.0.0", "Renderer roundPixels option is deprecated, please use PIXI.settings.ROUND_PIXELS", 2);
      }
      _this.options = options;
      _this.type = type;
      _this.screen = new Rectangle(0, 0, options.width, options.height);
      _this.view = options.view || document.createElement("canvas");
      _this.resolution = options.resolution || settings.RESOLUTION;
      _this.transparent = options.transparent;
      _this.autoDensity = options.autoDensity || options.autoResize || false;
      _this.preserveDrawingBuffer = options.preserveDrawingBuffer;
      _this.clearBeforeRender = options.clearBeforeRender;
      _this._backgroundColor = 0;
      _this._backgroundColorRgba = [0, 0, 0, 0];
      _this._backgroundColorString = "#000000";
      _this.backgroundColor = options.backgroundColor || _this._backgroundColor;
      _this._lastObjectRendered = null;
      _this.plugins = {};
      return _this;
    }
    AbstractRenderer2.prototype.initPlugins = function(staticMap) {
      for (var o in staticMap) {
        this.plugins[o] = new staticMap[o](this);
      }
    };
    Object.defineProperty(AbstractRenderer2.prototype, "width", {
      get: function() {
        return this.view.width;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(AbstractRenderer2.prototype, "height", {
      get: function() {
        return this.view.height;
      },
      enumerable: false,
      configurable: true
    });
    AbstractRenderer2.prototype.resize = function(screenWidth, screenHeight) {
      this.screen.width = screenWidth;
      this.screen.height = screenHeight;
      this.view.width = screenWidth * this.resolution;
      this.view.height = screenHeight * this.resolution;
      if (this.autoDensity) {
        this.view.style.width = screenWidth + "px";
        this.view.style.height = screenHeight + "px";
      }
      this.emit("resize", screenWidth, screenHeight);
    };
    AbstractRenderer2.prototype.generateTexture = function(displayObject, scaleMode, resolution, region) {
      region = region || displayObject.getLocalBounds(null, true);
      if (region.width === 0) {
        region.width = 1;
      }
      if (region.height === 0) {
        region.height = 1;
      }
      var renderTexture = RenderTexture.create({
        width: region.width | 0,
        height: region.height | 0,
        scaleMode,
        resolution
      });
      tempMatrix.tx = -region.x;
      tempMatrix.ty = -region.y;
      this.render(displayObject, renderTexture, false, tempMatrix, !!displayObject.parent);
      return renderTexture;
    };
    AbstractRenderer2.prototype.destroy = function(removeView) {
      for (var o in this.plugins) {
        this.plugins[o].destroy();
        this.plugins[o] = null;
      }
      if (removeView && this.view.parentNode) {
        this.view.parentNode.removeChild(this.view);
      }
      var thisAny = this;
      thisAny.plugins = null;
      thisAny.type = RENDERER_TYPE.UNKNOWN;
      thisAny.view = null;
      thisAny.screen = null;
      thisAny._tempDisplayObjectParent = null;
      thisAny.options = null;
      this._backgroundColorRgba = null;
      this._backgroundColorString = null;
      this._lastObjectRendered = null;
    };
    Object.defineProperty(AbstractRenderer2.prototype, "backgroundColor", {
      get: function() {
        return this._backgroundColor;
      },
      set: function(value) {
        this._backgroundColor = value;
        this._backgroundColorString = hex2string(value);
        hex2rgb(value, this._backgroundColorRgba);
      },
      enumerable: false,
      configurable: true
    });
    return AbstractRenderer2;
  }(eventemitter3.default);
  var Renderer = function(_super) {
    __extends3(Renderer2, _super);
    function Renderer2(options) {
      var _this = _super.call(this, RENDERER_TYPE.WEBGL, options) || this;
      options = _this.options;
      _this.gl = null;
      _this.CONTEXT_UID = 0;
      _this.runners = {
        destroy: new Runner("destroy"),
        contextChange: new Runner("contextChange"),
        reset: new Runner("reset"),
        update: new Runner("update"),
        postrender: new Runner("postrender"),
        prerender: new Runner("prerender"),
        resize: new Runner("resize")
      };
      _this.globalUniforms = new UniformGroup({
        projectionMatrix: new Matrix()
      }, true);
      _this.addSystem(MaskSystem, "mask").addSystem(ContextSystem, "context").addSystem(StateSystem, "state").addSystem(ShaderSystem, "shader").addSystem(TextureSystem, "texture").addSystem(GeometrySystem, "geometry").addSystem(FramebufferSystem, "framebuffer").addSystem(ScissorSystem, "scissor").addSystem(StencilSystem, "stencil").addSystem(ProjectionSystem, "projection").addSystem(TextureGCSystem, "textureGC").addSystem(FilterSystem, "filter").addSystem(RenderTextureSystem, "renderTexture").addSystem(BatchSystem, "batch");
      _this.initPlugins(Renderer2.__plugins);
      if (options.context) {
        _this.context.initFromContext(options.context);
      } else {
        _this.context.initFromOptions({
          alpha: !!_this.transparent,
          antialias: options.antialias,
          premultipliedAlpha: _this.transparent && _this.transparent !== "notMultiplied",
          stencil: true,
          preserveDrawingBuffer: options.preserveDrawingBuffer,
          powerPreference: _this.options.powerPreference
        });
      }
      _this.renderingToScreen = true;
      sayHello(_this.context.webGLVersion === 2 ? "WebGL 2" : "WebGL 1");
      _this.resize(_this.options.width, _this.options.height);
      return _this;
    }
    Renderer2.create = function(options) {
      if (isWebGLSupported()) {
        return new Renderer2(options);
      }
      throw new Error('WebGL unsupported in this browser, use "pixi.js-legacy" for fallback canvas2d support.');
    };
    Renderer2.prototype.addSystem = function(ClassRef, name) {
      if (!name) {
        name = ClassRef.name;
      }
      var system = new ClassRef(this);
      if (this[name]) {
        throw new Error('Whoops! The name "' + name + '" is already in use');
      }
      this[name] = system;
      for (var i in this.runners) {
        this.runners[i].add(system);
      }
      return this;
    };
    Renderer2.prototype.render = function(displayObject, renderTexture, clear, transform, skipUpdateTransform) {
      this.renderingToScreen = !renderTexture;
      this.runners.prerender.emit();
      this.emit("prerender");
      this.projection.transform = transform;
      if (this.context.isLost) {
        return;
      }
      if (!renderTexture) {
        this._lastObjectRendered = displayObject;
      }
      if (!skipUpdateTransform) {
        var cacheParent = displayObject.enableTempParent();
        displayObject.updateTransform();
        displayObject.disableTempParent(cacheParent);
      }
      this.renderTexture.bind(renderTexture);
      this.batch.currentRenderer.start();
      if (clear !== void 0 ? clear : this.clearBeforeRender) {
        this.renderTexture.clear();
      }
      displayObject.render(this);
      this.batch.currentRenderer.flush();
      if (renderTexture) {
        renderTexture.baseTexture.update();
      }
      this.runners.postrender.emit();
      this.projection.transform = null;
      this.emit("postrender");
    };
    Renderer2.prototype.resize = function(screenWidth, screenHeight) {
      _super.prototype.resize.call(this, screenWidth, screenHeight);
      this.runners.resize.emit(screenWidth, screenHeight);
    };
    Renderer2.prototype.reset = function() {
      this.runners.reset.emit();
      return this;
    };
    Renderer2.prototype.clear = function() {
      this.renderTexture.bind();
      this.renderTexture.clear();
    };
    Renderer2.prototype.destroy = function(removeView) {
      this.runners.destroy.emit();
      for (var r in this.runners) {
        this.runners[r].destroy();
      }
      _super.prototype.destroy.call(this, removeView);
      this.gl = null;
    };
    Renderer2.registerPlugin = function(pluginName, ctor) {
      Renderer2.__plugins = Renderer2.__plugins || {};
      Renderer2.__plugins[pluginName] = ctor;
    };
    return Renderer2;
  }(AbstractRenderer);
  function autoDetectRenderer(options) {
    return Renderer.create(options);
  }
  var _default = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";
  var defaultFilter = "attribute vec2 aVertexPosition;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nuniform vec4 inputSize;\nuniform vec4 outputFrame;\n\nvec4 filterVertexPosition( void )\n{\n    vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;\n\n    return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);\n}\n\nvec2 filterTextureCoord( void )\n{\n    return aVertexPosition * (outputFrame.zw * inputSize.zw);\n}\n\nvoid main(void)\n{\n    gl_Position = filterVertexPosition();\n    vTextureCoord = filterTextureCoord();\n}\n";
  var BatchDrawCall = function() {
    function BatchDrawCall2() {
      this.texArray = null;
      this.blend = 0;
      this.type = DRAW_MODES.TRIANGLES;
      this.start = 0;
      this.size = 0;
      this.data = null;
    }
    return BatchDrawCall2;
  }();
  var BatchTextureArray = function() {
    function BatchTextureArray2() {
      this.elements = [];
      this.ids = [];
      this.count = 0;
    }
    BatchTextureArray2.prototype.clear = function() {
      for (var i = 0; i < this.count; i++) {
        this.elements[i] = null;
      }
      this.count = 0;
    };
    return BatchTextureArray2;
  }();
  var ViewableBuffer = function() {
    function ViewableBuffer2(size2) {
      this.rawBinaryData = new ArrayBuffer(size2);
      this.uint32View = new Uint32Array(this.rawBinaryData);
      this.float32View = new Float32Array(this.rawBinaryData);
    }
    Object.defineProperty(ViewableBuffer2.prototype, "int8View", {
      get: function() {
        if (!this._int8View) {
          this._int8View = new Int8Array(this.rawBinaryData);
        }
        return this._int8View;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(ViewableBuffer2.prototype, "uint8View", {
      get: function() {
        if (!this._uint8View) {
          this._uint8View = new Uint8Array(this.rawBinaryData);
        }
        return this._uint8View;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(ViewableBuffer2.prototype, "int16View", {
      get: function() {
        if (!this._int16View) {
          this._int16View = new Int16Array(this.rawBinaryData);
        }
        return this._int16View;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(ViewableBuffer2.prototype, "uint16View", {
      get: function() {
        if (!this._uint16View) {
          this._uint16View = new Uint16Array(this.rawBinaryData);
        }
        return this._uint16View;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(ViewableBuffer2.prototype, "int32View", {
      get: function() {
        if (!this._int32View) {
          this._int32View = new Int32Array(this.rawBinaryData);
        }
        return this._int32View;
      },
      enumerable: false,
      configurable: true
    });
    ViewableBuffer2.prototype.view = function(type) {
      return this[type + "View"];
    };
    ViewableBuffer2.prototype.destroy = function() {
      this.rawBinaryData = null;
      this._int8View = null;
      this._uint8View = null;
      this._int16View = null;
      this._uint16View = null;
      this._int32View = null;
      this.uint32View = null;
      this.float32View = null;
    };
    ViewableBuffer2.sizeOf = function(type) {
      switch (type) {
        case "int8":
        case "uint8":
          return 1;
        case "int16":
        case "uint16":
          return 2;
        case "int32":
        case "uint32":
        case "float32":
          return 4;
        default:
          throw new Error(type + " isn't a valid view type");
      }
    };
    return ViewableBuffer2;
  }();
  var AbstractBatchRenderer = function(_super) {
    __extends3(AbstractBatchRenderer2, _super);
    function AbstractBatchRenderer2(renderer) {
      var _this = _super.call(this, renderer) || this;
      _this.shaderGenerator = null;
      _this.geometryClass = null;
      _this.vertexSize = null;
      _this.state = State.for2d();
      _this.size = settings.SPRITE_BATCH_SIZE * 4;
      _this._vertexCount = 0;
      _this._indexCount = 0;
      _this._bufferedElements = [];
      _this._bufferedTextures = [];
      _this._bufferSize = 0;
      _this._shader = null;
      _this._packedGeometries = [];
      _this._packedGeometryPoolSize = 2;
      _this._flushId = 0;
      _this._aBuffers = {};
      _this._iBuffers = {};
      _this.MAX_TEXTURES = 1;
      _this.renderer.on("prerender", _this.onPrerender, _this);
      renderer.runners.contextChange.add(_this);
      _this._dcIndex = 0;
      _this._aIndex = 0;
      _this._iIndex = 0;
      _this._attributeBuffer = null;
      _this._indexBuffer = null;
      _this._tempBoundTextures = [];
      return _this;
    }
    AbstractBatchRenderer2.prototype.contextChange = function() {
      var gl = this.renderer.gl;
      if (settings.PREFER_ENV === ENV.WEBGL_LEGACY) {
        this.MAX_TEXTURES = 1;
      } else {
        this.MAX_TEXTURES = Math.min(gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS), settings.SPRITE_MAX_TEXTURES);
        this.MAX_TEXTURES = checkMaxIfStatementsInShader(this.MAX_TEXTURES, gl);
      }
      this._shader = this.shaderGenerator.generateShader(this.MAX_TEXTURES);
      for (var i = 0; i < this._packedGeometryPoolSize; i++) {
        this._packedGeometries[i] = new this.geometryClass();
      }
      this.initFlushBuffers();
    };
    AbstractBatchRenderer2.prototype.initFlushBuffers = function() {
      var _drawCallPool = AbstractBatchRenderer2._drawCallPool, _textureArrayPool = AbstractBatchRenderer2._textureArrayPool;
      var MAX_SPRITES = this.size / 4;
      var MAX_TA = Math.floor(MAX_SPRITES / this.MAX_TEXTURES) + 1;
      while (_drawCallPool.length < MAX_SPRITES) {
        _drawCallPool.push(new BatchDrawCall());
      }
      while (_textureArrayPool.length < MAX_TA) {
        _textureArrayPool.push(new BatchTextureArray());
      }
      for (var i = 0; i < this.MAX_TEXTURES; i++) {
        this._tempBoundTextures[i] = null;
      }
    };
    AbstractBatchRenderer2.prototype.onPrerender = function() {
      this._flushId = 0;
    };
    AbstractBatchRenderer2.prototype.render = function(element) {
      if (!element._texture.valid) {
        return;
      }
      if (this._vertexCount + element.vertexData.length / 2 > this.size) {
        this.flush();
      }
      this._vertexCount += element.vertexData.length / 2;
      this._indexCount += element.indices.length;
      this._bufferedTextures[this._bufferSize] = element._texture.baseTexture;
      this._bufferedElements[this._bufferSize++] = element;
    };
    AbstractBatchRenderer2.prototype.buildTexturesAndDrawCalls = function() {
      var _a2 = this, textures = _a2._bufferedTextures, MAX_TEXTURES = _a2.MAX_TEXTURES;
      var textureArrays = AbstractBatchRenderer2._textureArrayPool;
      var batch = this.renderer.batch;
      var boundTextures = this._tempBoundTextures;
      var touch = this.renderer.textureGC.count;
      var TICK = ++BaseTexture._globalBatch;
      var countTexArrays = 0;
      var texArray = textureArrays[0];
      var start = 0;
      batch.copyBoundTextures(boundTextures, MAX_TEXTURES);
      for (var i = 0; i < this._bufferSize; ++i) {
        var tex = textures[i];
        textures[i] = null;
        if (tex._batchEnabled === TICK) {
          continue;
        }
        if (texArray.count >= MAX_TEXTURES) {
          batch.boundArray(texArray, boundTextures, TICK, MAX_TEXTURES);
          this.buildDrawCalls(texArray, start, i);
          start = i;
          texArray = textureArrays[++countTexArrays];
          ++TICK;
        }
        tex._batchEnabled = TICK;
        tex.touched = touch;
        texArray.elements[texArray.count++] = tex;
      }
      if (texArray.count > 0) {
        batch.boundArray(texArray, boundTextures, TICK, MAX_TEXTURES);
        this.buildDrawCalls(texArray, start, this._bufferSize);
        ++countTexArrays;
        ++TICK;
      }
      for (var i = 0; i < boundTextures.length; i++) {
        boundTextures[i] = null;
      }
      BaseTexture._globalBatch = TICK;
    };
    AbstractBatchRenderer2.prototype.buildDrawCalls = function(texArray, start, finish) {
      var _a2 = this, elements = _a2._bufferedElements, _attributeBuffer = _a2._attributeBuffer, _indexBuffer = _a2._indexBuffer, vertexSize = _a2.vertexSize;
      var drawCalls = AbstractBatchRenderer2._drawCallPool;
      var dcIndex = this._dcIndex;
      var aIndex = this._aIndex;
      var iIndex = this._iIndex;
      var drawCall = drawCalls[dcIndex];
      drawCall.start = this._iIndex;
      drawCall.texArray = texArray;
      for (var i = start; i < finish; ++i) {
        var sprite5 = elements[i];
        var tex = sprite5._texture.baseTexture;
        var spriteBlendMode = premultiplyBlendMode[tex.alphaMode ? 1 : 0][sprite5.blendMode];
        elements[i] = null;
        if (start < i && drawCall.blend !== spriteBlendMode) {
          drawCall.size = iIndex - drawCall.start;
          start = i;
          drawCall = drawCalls[++dcIndex];
          drawCall.texArray = texArray;
          drawCall.start = iIndex;
        }
        this.packInterleavedGeometry(sprite5, _attributeBuffer, _indexBuffer, aIndex, iIndex);
        aIndex += sprite5.vertexData.length / 2 * vertexSize;
        iIndex += sprite5.indices.length;
        drawCall.blend = spriteBlendMode;
      }
      if (start < finish) {
        drawCall.size = iIndex - drawCall.start;
        ++dcIndex;
      }
      this._dcIndex = dcIndex;
      this._aIndex = aIndex;
      this._iIndex = iIndex;
    };
    AbstractBatchRenderer2.prototype.bindAndClearTexArray = function(texArray) {
      var textureSystem = this.renderer.texture;
      for (var j = 0; j < texArray.count; j++) {
        textureSystem.bind(texArray.elements[j], texArray.ids[j]);
        texArray.elements[j] = null;
      }
      texArray.count = 0;
    };
    AbstractBatchRenderer2.prototype.updateGeometry = function() {
      var _a2 = this, packedGeometries = _a2._packedGeometries, attributeBuffer = _a2._attributeBuffer, indexBuffer = _a2._indexBuffer;
      if (!settings.CAN_UPLOAD_SAME_BUFFER) {
        if (this._packedGeometryPoolSize <= this._flushId) {
          this._packedGeometryPoolSize++;
          packedGeometries[this._flushId] = new this.geometryClass();
        }
        packedGeometries[this._flushId]._buffer.update(attributeBuffer.rawBinaryData);
        packedGeometries[this._flushId]._indexBuffer.update(indexBuffer);
        this.renderer.geometry.bind(packedGeometries[this._flushId]);
        this.renderer.geometry.updateBuffers();
        this._flushId++;
      } else {
        packedGeometries[this._flushId]._buffer.update(attributeBuffer.rawBinaryData);
        packedGeometries[this._flushId]._indexBuffer.update(indexBuffer);
        this.renderer.geometry.updateBuffers();
      }
    };
    AbstractBatchRenderer2.prototype.drawBatches = function() {
      var dcCount = this._dcIndex;
      var _a2 = this.renderer, gl = _a2.gl, stateSystem = _a2.state;
      var drawCalls = AbstractBatchRenderer2._drawCallPool;
      var curTexArray = null;
      for (var i = 0; i < dcCount; i++) {
        var _b = drawCalls[i], texArray = _b.texArray, type = _b.type, size2 = _b.size, start = _b.start, blend = _b.blend;
        if (curTexArray !== texArray) {
          curTexArray = texArray;
          this.bindAndClearTexArray(texArray);
        }
        this.state.blendMode = blend;
        stateSystem.set(this.state);
        gl.drawElements(type, size2, gl.UNSIGNED_SHORT, start * 2);
      }
    };
    AbstractBatchRenderer2.prototype.flush = function() {
      if (this._vertexCount === 0) {
        return;
      }
      this._attributeBuffer = this.getAttributeBuffer(this._vertexCount);
      this._indexBuffer = this.getIndexBuffer(this._indexCount);
      this._aIndex = 0;
      this._iIndex = 0;
      this._dcIndex = 0;
      this.buildTexturesAndDrawCalls();
      this.updateGeometry();
      this.drawBatches();
      this._bufferSize = 0;
      this._vertexCount = 0;
      this._indexCount = 0;
    };
    AbstractBatchRenderer2.prototype.start = function() {
      this.renderer.state.set(this.state);
      this.renderer.shader.bind(this._shader);
      if (settings.CAN_UPLOAD_SAME_BUFFER) {
        this.renderer.geometry.bind(this._packedGeometries[this._flushId]);
      }
    };
    AbstractBatchRenderer2.prototype.stop = function() {
      this.flush();
    };
    AbstractBatchRenderer2.prototype.destroy = function() {
      for (var i = 0; i < this._packedGeometryPoolSize; i++) {
        if (this._packedGeometries[i]) {
          this._packedGeometries[i].destroy();
        }
      }
      this.renderer.off("prerender", this.onPrerender, this);
      this._aBuffers = null;
      this._iBuffers = null;
      this._packedGeometries = null;
      this._attributeBuffer = null;
      this._indexBuffer = null;
      if (this._shader) {
        this._shader.destroy();
        this._shader = null;
      }
      _super.prototype.destroy.call(this);
    };
    AbstractBatchRenderer2.prototype.getAttributeBuffer = function(size2) {
      var roundedP2 = nextPow2(Math.ceil(size2 / 8));
      var roundedSizeIndex = log2(roundedP2);
      var roundedSize = roundedP2 * 8;
      if (this._aBuffers.length <= roundedSizeIndex) {
        this._iBuffers.length = roundedSizeIndex + 1;
      }
      var buffer = this._aBuffers[roundedSize];
      if (!buffer) {
        this._aBuffers[roundedSize] = buffer = new ViewableBuffer(roundedSize * this.vertexSize * 4);
      }
      return buffer;
    };
    AbstractBatchRenderer2.prototype.getIndexBuffer = function(size2) {
      var roundedP2 = nextPow2(Math.ceil(size2 / 12));
      var roundedSizeIndex = log2(roundedP2);
      var roundedSize = roundedP2 * 12;
      if (this._iBuffers.length <= roundedSizeIndex) {
        this._iBuffers.length = roundedSizeIndex + 1;
      }
      var buffer = this._iBuffers[roundedSizeIndex];
      if (!buffer) {
        this._iBuffers[roundedSizeIndex] = buffer = new Uint16Array(roundedSize);
      }
      return buffer;
    };
    AbstractBatchRenderer2.prototype.packInterleavedGeometry = function(element, attributeBuffer, indexBuffer, aIndex, iIndex) {
      var uint32View = attributeBuffer.uint32View, float32View = attributeBuffer.float32View;
      var packedVertices = aIndex / this.vertexSize;
      var uvs = element.uvs;
      var indicies = element.indices;
      var vertexData = element.vertexData;
      var textureId = element._texture.baseTexture._batchLocation;
      var alpha = Math.min(element.worldAlpha, 1);
      var argb = alpha < 1 && element._texture.baseTexture.alphaMode ? premultiplyTint(element._tintRGB, alpha) : element._tintRGB + (alpha * 255 << 24);
      for (var i = 0; i < vertexData.length; i += 2) {
        float32View[aIndex++] = vertexData[i];
        float32View[aIndex++] = vertexData[i + 1];
        float32View[aIndex++] = uvs[i];
        float32View[aIndex++] = uvs[i + 1];
        uint32View[aIndex++] = argb;
        float32View[aIndex++] = textureId;
      }
      for (var i = 0; i < indicies.length; i++) {
        indexBuffer[iIndex++] = packedVertices + indicies[i];
      }
    };
    AbstractBatchRenderer2._drawCallPool = [];
    AbstractBatchRenderer2._textureArrayPool = [];
    return AbstractBatchRenderer2;
  }(ObjectRenderer);
  var BatchShaderGenerator = function() {
    function BatchShaderGenerator2(vertexSrc, fragTemplate3) {
      this.vertexSrc = vertexSrc;
      this.fragTemplate = fragTemplate3;
      this.programCache = {};
      this.defaultGroupCache = {};
      if (fragTemplate3.indexOf("%count%") < 0) {
        throw new Error('Fragment template must contain "%count%".');
      }
      if (fragTemplate3.indexOf("%forloop%") < 0) {
        throw new Error('Fragment template must contain "%forloop%".');
      }
    }
    BatchShaderGenerator2.prototype.generateShader = function(maxTextures) {
      if (!this.programCache[maxTextures]) {
        var sampleValues = new Int32Array(maxTextures);
        for (var i = 0; i < maxTextures; i++) {
          sampleValues[i] = i;
        }
        this.defaultGroupCache[maxTextures] = UniformGroup.from({uSamplers: sampleValues}, true);
        var fragmentSrc = this.fragTemplate;
        fragmentSrc = fragmentSrc.replace(/%count%/gi, "" + maxTextures);
        fragmentSrc = fragmentSrc.replace(/%forloop%/gi, this.generateSampleSrc(maxTextures));
        this.programCache[maxTextures] = new Program(this.vertexSrc, fragmentSrc);
      }
      var uniforms = {
        tint: new Float32Array([1, 1, 1, 1]),
        translationMatrix: new Matrix(),
        default: this.defaultGroupCache[maxTextures]
      };
      return new Shader(this.programCache[maxTextures], uniforms);
    };
    BatchShaderGenerator2.prototype.generateSampleSrc = function(maxTextures) {
      var src = "";
      src += "\n";
      src += "\n";
      for (var i = 0; i < maxTextures; i++) {
        if (i > 0) {
          src += "\nelse ";
        }
        if (i < maxTextures - 1) {
          src += "if(vTextureId < " + i + ".5)";
        }
        src += "\n{";
        src += "\n	color = texture2D(uSamplers[" + i + "], vTextureCoord);";
        src += "\n}";
      }
      src += "\n";
      src += "\n";
      return src;
    };
    return BatchShaderGenerator2;
  }();
  var BatchGeometry = function(_super) {
    __extends3(BatchGeometry2, _super);
    function BatchGeometry2(_static) {
      if (_static === void 0) {
        _static = false;
      }
      var _this = _super.call(this) || this;
      _this._buffer = new Buffer2(null, _static, false);
      _this._indexBuffer = new Buffer2(null, _static, true);
      _this.addAttribute("aVertexPosition", _this._buffer, 2, false, TYPES.FLOAT).addAttribute("aTextureCoord", _this._buffer, 2, false, TYPES.FLOAT).addAttribute("aColor", _this._buffer, 4, true, TYPES.UNSIGNED_BYTE).addAttribute("aTextureId", _this._buffer, 1, true, TYPES.FLOAT).addIndex(_this._indexBuffer);
      return _this;
    }
    return BatchGeometry2;
  }(Geometry);
  var defaultVertex$2 = "precision highp float;\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\nattribute vec4 aColor;\nattribute float aTextureId;\n\nuniform mat3 projectionMatrix;\nuniform mat3 translationMatrix;\nuniform vec4 tint;\n\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\nvarying float vTextureId;\n\nvoid main(void){\n    gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n\n    vTextureCoord = aTextureCoord;\n    vTextureId = aTextureId;\n    vColor = aColor * tint;\n}\n";
  var defaultFragment$2 = "varying vec2 vTextureCoord;\nvarying vec4 vColor;\nvarying float vTextureId;\nuniform sampler2D uSamplers[%count%];\n\nvoid main(void){\n    vec4 color;\n    %forloop%\n    gl_FragColor = color * vColor;\n}\n";
  var BatchPluginFactory = function() {
    function BatchPluginFactory2() {
    }
    BatchPluginFactory2.create = function(options) {
      var _a2 = Object.assign({
        vertex: defaultVertex$2,
        fragment: defaultFragment$2,
        geometryClass: BatchGeometry,
        vertexSize: 6
      }, options), vertex7 = _a2.vertex, fragment10 = _a2.fragment, vertexSize = _a2.vertexSize, geometryClass = _a2.geometryClass;
      return function(_super) {
        __extends3(BatchPlugin, _super);
        function BatchPlugin(renderer) {
          var _this = _super.call(this, renderer) || this;
          _this.shaderGenerator = new BatchShaderGenerator(vertex7, fragment10);
          _this.geometryClass = geometryClass;
          _this.vertexSize = vertexSize;
          return _this;
        }
        return BatchPlugin;
      }(AbstractBatchRenderer);
    };
    Object.defineProperty(BatchPluginFactory2, "defaultVertexSrc", {
      get: function() {
        return defaultVertex$2;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(BatchPluginFactory2, "defaultFragmentTemplate", {
      get: function() {
        return defaultFragment$2;
      },
      enumerable: false,
      configurable: true
    });
    return BatchPluginFactory2;
  }();
  var BatchRenderer = BatchPluginFactory.create();

  // node_modules/@pixi/app/lib/app.es.js
  /*!
   * @pixi/app - v5.3.3
   * Compiled Tue, 04 Aug 2020 16:23:09 UTC
   *
   * @pixi/app is licensed under the MIT License.
   * http://www.opensource.org/licenses/mit-license
   */
  var Application = function() {
    function Application2(options) {
      var _this = this;
      options = Object.assign({
        forceCanvas: false
      }, options);
      this.renderer = autoDetectRenderer(options);
      this.stage = new Container();
      Application2._plugins.forEach(function(plugin) {
        plugin.init.call(_this, options);
      });
    }
    Application2.registerPlugin = function(plugin) {
      Application2._plugins.push(plugin);
    };
    Application2.prototype.render = function() {
      this.renderer.render(this.stage);
    };
    Object.defineProperty(Application2.prototype, "view", {
      get: function() {
        return this.renderer.view;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Application2.prototype, "screen", {
      get: function() {
        return this.renderer.screen;
      },
      enumerable: false,
      configurable: true
    });
    Application2.prototype.destroy = function(removeView, stageOptions) {
      var _this = this;
      var plugins = Application2._plugins.slice(0);
      plugins.reverse();
      plugins.forEach(function(plugin) {
        plugin.destroy.call(_this);
      });
      this.stage.destroy(stageOptions);
      this.stage = null;
      this.renderer.destroy(removeView);
      this.renderer = null;
    };
    return Application2;
  }();
  Application._plugins = [];
  var ResizePlugin = function() {
    function ResizePlugin2() {
    }
    ResizePlugin2.init = function(options) {
      var _this = this;
      Object.defineProperty(this, "resizeTo", {
        set: function(dom) {
          window.removeEventListener("resize", this.queueResize);
          this._resizeTo = dom;
          if (dom) {
            window.addEventListener("resize", this.queueResize);
            this.resize();
          }
        },
        get: function() {
          return this._resizeTo;
        }
      });
      this.queueResize = function() {
        if (!_this._resizeTo) {
          return;
        }
        _this.cancelResize();
        _this._resizeId = requestAnimationFrame(function() {
          return _this.resize();
        });
      };
      this.cancelResize = function() {
        if (_this._resizeId) {
          cancelAnimationFrame(_this._resizeId);
          _this._resizeId = null;
        }
      };
      this.resize = function() {
        if (!_this._resizeTo) {
          return;
        }
        _this.cancelResize();
        var width;
        var height;
        if (_this._resizeTo === window) {
          width = window.innerWidth;
          height = window.innerHeight;
        } else {
          var _a2 = _this._resizeTo, clientWidth = _a2.clientWidth, clientHeight = _a2.clientHeight;
          width = clientWidth;
          height = clientHeight;
        }
        _this.renderer.resize(width, height);
      };
      this._resizeId = null;
      this._resizeTo = null;
      this.resizeTo = options.resizeTo || null;
    };
    ResizePlugin2.destroy = function() {
      this.cancelResize();
      this.cancelResize = null;
      this.queueResize = null;
      this.resizeTo = null;
      this.resize = null;
    };
    return ResizePlugin2;
  }();
  Application.registerPlugin(ResizePlugin);

  // node_modules/@pixi/extract/lib/extract.es.js
  /*!
   * @pixi/extract - v5.3.3
   * Compiled Tue, 04 Aug 2020 16:23:09 UTC
   *
   * @pixi/extract is licensed under the MIT License.
   * http://www.opensource.org/licenses/mit-license
   */
  var TEMP_RECT = new Rectangle();
  var BYTES_PER_PIXEL = 4;
  var Extract = function() {
    function Extract2(renderer) {
      this.renderer = renderer;
      renderer.extract = this;
    }
    Extract2.prototype.image = function(target, format, quality) {
      var image = new Image();
      image.src = this.base64(target, format, quality);
      return image;
    };
    Extract2.prototype.base64 = function(target, format, quality) {
      return this.canvas(target).toDataURL(format, quality);
    };
    Extract2.prototype.canvas = function(target) {
      var renderer = this.renderer;
      var resolution;
      var frame;
      var flipY = false;
      var renderTexture;
      var generated = false;
      if (target) {
        if (target instanceof RenderTexture) {
          renderTexture = target;
        } else {
          renderTexture = this.renderer.generateTexture(target);
          generated = true;
        }
      }
      if (renderTexture) {
        resolution = renderTexture.baseTexture.resolution;
        frame = renderTexture.frame;
        flipY = false;
        renderer.renderTexture.bind(renderTexture);
      } else {
        resolution = this.renderer.resolution;
        flipY = true;
        frame = TEMP_RECT;
        frame.width = this.renderer.width;
        frame.height = this.renderer.height;
        renderer.renderTexture.bind(null);
      }
      var width = Math.floor(frame.width * resolution + 1e-4);
      var height = Math.floor(frame.height * resolution + 1e-4);
      var canvasBuffer = new CanvasRenderTarget(width, height, 1);
      var webglPixels = new Uint8Array(BYTES_PER_PIXEL * width * height);
      var gl = renderer.gl;
      gl.readPixels(frame.x * resolution, frame.y * resolution, width, height, gl.RGBA, gl.UNSIGNED_BYTE, webglPixels);
      var canvasData = canvasBuffer.context.getImageData(0, 0, width, height);
      Extract2.arrayPostDivide(webglPixels, canvasData.data);
      canvasBuffer.context.putImageData(canvasData, 0, 0);
      if (flipY) {
        var target_1 = new CanvasRenderTarget(canvasBuffer.width, canvasBuffer.height, 1);
        target_1.context.scale(1, -1);
        target_1.context.drawImage(canvasBuffer.canvas, 0, -height);
        canvasBuffer.destroy();
        canvasBuffer = target_1;
      }
      if (generated) {
        renderTexture.destroy(true);
      }
      return canvasBuffer.canvas;
    };
    Extract2.prototype.pixels = function(target) {
      var renderer = this.renderer;
      var resolution;
      var frame;
      var renderTexture;
      var generated = false;
      if (target) {
        if (target instanceof RenderTexture) {
          renderTexture = target;
        } else {
          renderTexture = this.renderer.generateTexture(target);
          generated = true;
        }
      }
      if (renderTexture) {
        resolution = renderTexture.baseTexture.resolution;
        frame = renderTexture.frame;
        renderer.renderTexture.bind(renderTexture);
      } else {
        resolution = renderer.resolution;
        frame = TEMP_RECT;
        frame.width = renderer.width;
        frame.height = renderer.height;
        renderer.renderTexture.bind(null);
      }
      var width = frame.width * resolution;
      var height = frame.height * resolution;
      var webglPixels = new Uint8Array(BYTES_PER_PIXEL * width * height);
      var gl = renderer.gl;
      gl.readPixels(frame.x * resolution, frame.y * resolution, width, height, gl.RGBA, gl.UNSIGNED_BYTE, webglPixels);
      if (generated) {
        renderTexture.destroy(true);
      }
      Extract2.arrayPostDivide(webglPixels, webglPixels);
      return webglPixels;
    };
    Extract2.prototype.destroy = function() {
      this.renderer.extract = null;
      this.renderer = null;
    };
    Extract2.arrayPostDivide = function(pixels, out) {
      for (var i = 0; i < pixels.length; i += 4) {
        var alpha = out[i + 3] = pixels[i + 3];
        if (alpha !== 0) {
          out[i] = Math.round(Math.min(pixels[i] * 255 / alpha, 255));
          out[i + 1] = Math.round(Math.min(pixels[i + 1] * 255 / alpha, 255));
          out[i + 2] = Math.round(Math.min(pixels[i + 2] * 255 / alpha, 255));
        } else {
          out[i] = pixels[i];
          out[i + 1] = pixels[i + 1];
          out[i + 2] = pixels[i + 2];
        }
      }
    };
    return Extract2;
  }();

  // node_modules/resource-loader/dist/resource-loader.esm.js
  const parse_uri = __toModule(require_parse_uri());
  const mini_signals = __toModule(require_mini_signals());
  /*!
   * resource-loader - v3.0.1
   * https://github.com/pixijs/pixi-sound
   * Compiled Tue, 02 Jul 2019 14:06:18 UTC
   *
   * resource-loader is licensed under the MIT license.
   * http://www.opensource.org/licenses/mit-license
   */
  function _noop() {
  }
  function eachSeries(array, iterator, callback, deferNext) {
    var i = 0;
    var len = array.length;
    (function next(err) {
      if (err || i === len) {
        if (callback) {
          callback(err);
        }
        return;
      }
      if (deferNext) {
        setTimeout(function() {
          iterator(array[i++], next);
        }, 1);
      } else {
        iterator(array[i++], next);
      }
    })();
  }
  function onlyOnce(fn) {
    return function onceWrapper() {
      if (fn === null) {
        throw new Error("Callback was already called.");
      }
      var callFn = fn;
      fn = null;
      callFn.apply(this, arguments);
    };
  }
  function queue(worker, concurrency) {
    if (concurrency == null) {
      concurrency = 1;
    } else if (concurrency === 0) {
      throw new Error("Concurrency must not be zero");
    }
    var workers = 0;
    var q = {
      _tasks: [],
      concurrency,
      saturated: _noop,
      unsaturated: _noop,
      buffer: concurrency / 4,
      empty: _noop,
      drain: _noop,
      error: _noop,
      started: false,
      paused: false,
      push: function push(data, callback) {
        _insert(data, false, callback);
      },
      kill: function kill() {
        workers = 0;
        q.drain = _noop;
        q.started = false;
        q._tasks = [];
      },
      unshift: function unshift(data, callback) {
        _insert(data, true, callback);
      },
      process: function process() {
        while (!q.paused && workers < q.concurrency && q._tasks.length) {
          var task = q._tasks.shift();
          if (q._tasks.length === 0) {
            q.empty();
          }
          workers += 1;
          if (workers === q.concurrency) {
            q.saturated();
          }
          worker(task.data, onlyOnce(_next(task)));
        }
      },
      length: function length() {
        return q._tasks.length;
      },
      running: function running() {
        return workers;
      },
      idle: function idle() {
        return q._tasks.length + workers === 0;
      },
      pause: function pause() {
        if (q.paused === true) {
          return;
        }
        q.paused = true;
      },
      resume: function resume() {
        if (q.paused === false) {
          return;
        }
        q.paused = false;
        for (var w = 1; w <= q.concurrency; w++) {
          q.process();
        }
      }
    };
    function _insert(data, insertAtFront, callback) {
      if (callback != null && typeof callback !== "function") {
        throw new Error("task callback must be a function");
      }
      q.started = true;
      if (data == null && q.idle()) {
        setTimeout(function() {
          return q.drain();
        }, 1);
        return;
      }
      var item = {
        data,
        callback: typeof callback === "function" ? callback : _noop
      };
      if (insertAtFront) {
        q._tasks.unshift(item);
      } else {
        q._tasks.push(item);
      }
      setTimeout(function() {
        return q.process();
      }, 1);
    }
    function _next(task) {
      return function next() {
        workers -= 1;
        task.callback.apply(task, arguments);
        if (arguments[0] != null) {
          q.error(arguments[0], task.data);
        }
        if (workers <= q.concurrency - q.buffer) {
          q.unsaturated();
        }
        if (q.idle()) {
          q.drain();
        }
        q.process();
      };
    }
    return q;
  }
  var cache = {};
  function caching(resource, next) {
    var _this = this;
    if (cache[resource.url]) {
      resource.data = cache[resource.url];
      resource.complete();
    } else {
      resource.onComplete.once(function() {
        return cache[_this.url] = _this.data;
      });
    }
    next();
  }
  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor)
        descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps)
      _defineProperties(Constructor.prototype, protoProps);
    if (staticProps)
      _defineProperties(Constructor, staticProps);
    return Constructor;
  }
  var useXdr = !!(window.XDomainRequest && !("withCredentials" in new XMLHttpRequest()));
  var tempAnchor2 = null;
  var STATUS_NONE = 0;
  var STATUS_OK = 200;
  var STATUS_EMPTY = 204;
  var STATUS_IE_BUG_EMPTY = 1223;
  var STATUS_TYPE_OK = 2;
  function _noop$1() {
  }
  var Resource2 = /* @__PURE__ */ function() {
    Resource3.setExtensionLoadType = function setExtensionLoadType(extname, loadType) {
      setExtMap(Resource3._loadTypeMap, extname, loadType);
    };
    Resource3.setExtensionXhrType = function setExtensionXhrType(extname, xhrType) {
      setExtMap(Resource3._xhrTypeMap, extname, xhrType);
    };
    function Resource3(name, url3, options) {
      if (typeof name !== "string" || typeof url3 !== "string") {
        throw new Error("Both name and url are required for constructing a resource.");
      }
      options = options || {};
      this._flags = 0;
      this._setFlag(Resource3.STATUS_FLAGS.DATA_URL, url3.indexOf("data:") === 0);
      this.name = name;
      this.url = url3;
      this.extension = this._getExtension();
      this.data = null;
      this.crossOrigin = options.crossOrigin === true ? "anonymous" : options.crossOrigin;
      this.timeout = options.timeout || 0;
      this.loadType = options.loadType || this._determineLoadType();
      this.xhrType = options.xhrType;
      this.metadata = options.metadata || {};
      this.error = null;
      this.xhr = null;
      this.children = [];
      this.type = Resource3.TYPE.UNKNOWN;
      this.progressChunk = 0;
      this._dequeue = _noop$1;
      this._onLoadBinding = null;
      this._elementTimer = 0;
      this._boundComplete = this.complete.bind(this);
      this._boundOnError = this._onError.bind(this);
      this._boundOnProgress = this._onProgress.bind(this);
      this._boundOnTimeout = this._onTimeout.bind(this);
      this._boundXhrOnError = this._xhrOnError.bind(this);
      this._boundXhrOnTimeout = this._xhrOnTimeout.bind(this);
      this._boundXhrOnAbort = this._xhrOnAbort.bind(this);
      this._boundXhrOnLoad = this._xhrOnLoad.bind(this);
      this.onStart = new mini_signals.default();
      this.onProgress = new mini_signals.default();
      this.onComplete = new mini_signals.default();
      this.onAfterMiddleware = new mini_signals.default();
    }
    var _proto = Resource3.prototype;
    _proto.complete = function complete() {
      this._clearEvents();
      this._finish();
    };
    _proto.abort = function abort(message) {
      if (this.error) {
        return;
      }
      this.error = new Error(message);
      this._clearEvents();
      if (this.xhr) {
        this.xhr.abort();
      } else if (this.xdr) {
        this.xdr.abort();
      } else if (this.data) {
        if (this.data.src) {
          this.data.src = Resource3.EMPTY_GIF;
        } else {
          while (this.data.firstChild) {
            this.data.removeChild(this.data.firstChild);
          }
        }
      }
      this._finish();
    };
    _proto.load = function load(cb) {
      var _this = this;
      if (this.isLoading) {
        return;
      }
      if (this.isComplete) {
        if (cb) {
          setTimeout(function() {
            return cb(_this);
          }, 1);
        }
        return;
      } else if (cb) {
        this.onComplete.once(cb);
      }
      this._setFlag(Resource3.STATUS_FLAGS.LOADING, true);
      this.onStart.dispatch(this);
      if (this.crossOrigin === false || typeof this.crossOrigin !== "string") {
        this.crossOrigin = this._determineCrossOrigin(this.url);
      }
      switch (this.loadType) {
        case Resource3.LOAD_TYPE.IMAGE:
          this.type = Resource3.TYPE.IMAGE;
          this._loadElement("image");
          break;
        case Resource3.LOAD_TYPE.AUDIO:
          this.type = Resource3.TYPE.AUDIO;
          this._loadSourceElement("audio");
          break;
        case Resource3.LOAD_TYPE.VIDEO:
          this.type = Resource3.TYPE.VIDEO;
          this._loadSourceElement("video");
          break;
        case Resource3.LOAD_TYPE.XHR:
        default:
          if (useXdr && this.crossOrigin) {
            this._loadXdr();
          } else {
            this._loadXhr();
          }
          break;
      }
    };
    _proto._hasFlag = function _hasFlag(flag) {
      return (this._flags & flag) !== 0;
    };
    _proto._setFlag = function _setFlag(flag, value) {
      this._flags = value ? this._flags | flag : this._flags & ~flag;
    };
    _proto._clearEvents = function _clearEvents() {
      clearTimeout(this._elementTimer);
      if (this.data && this.data.removeEventListener) {
        this.data.removeEventListener("error", this._boundOnError, false);
        this.data.removeEventListener("load", this._boundComplete, false);
        this.data.removeEventListener("progress", this._boundOnProgress, false);
        this.data.removeEventListener("canplaythrough", this._boundComplete, false);
      }
      if (this.xhr) {
        if (this.xhr.removeEventListener) {
          this.xhr.removeEventListener("error", this._boundXhrOnError, false);
          this.xhr.removeEventListener("timeout", this._boundXhrOnTimeout, false);
          this.xhr.removeEventListener("abort", this._boundXhrOnAbort, false);
          this.xhr.removeEventListener("progress", this._boundOnProgress, false);
          this.xhr.removeEventListener("load", this._boundXhrOnLoad, false);
        } else {
          this.xhr.onerror = null;
          this.xhr.ontimeout = null;
          this.xhr.onprogress = null;
          this.xhr.onload = null;
        }
      }
    };
    _proto._finish = function _finish() {
      if (this.isComplete) {
        throw new Error("Complete called again for an already completed resource.");
      }
      this._setFlag(Resource3.STATUS_FLAGS.COMPLETE, true);
      this._setFlag(Resource3.STATUS_FLAGS.LOADING, false);
      this.onComplete.dispatch(this);
    };
    _proto._loadElement = function _loadElement(type) {
      if (this.metadata.loadElement) {
        this.data = this.metadata.loadElement;
      } else if (type === "image" && typeof window.Image !== "undefined") {
        this.data = new Image();
      } else {
        this.data = document.createElement(type);
      }
      if (this.crossOrigin) {
        this.data.crossOrigin = this.crossOrigin;
      }
      if (!this.metadata.skipSource) {
        this.data.src = this.url;
      }
      this.data.addEventListener("error", this._boundOnError, false);
      this.data.addEventListener("load", this._boundComplete, false);
      this.data.addEventListener("progress", this._boundOnProgress, false);
      if (this.timeout) {
        this._elementTimer = setTimeout(this._boundOnTimeout, this.timeout);
      }
    };
    _proto._loadSourceElement = function _loadSourceElement(type) {
      if (this.metadata.loadElement) {
        this.data = this.metadata.loadElement;
      } else if (type === "audio" && typeof window.Audio !== "undefined") {
        this.data = new Audio();
      } else {
        this.data = document.createElement(type);
      }
      if (this.data === null) {
        this.abort("Unsupported element: " + type);
        return;
      }
      if (this.crossOrigin) {
        this.data.crossOrigin = this.crossOrigin;
      }
      if (!this.metadata.skipSource) {
        if (navigator.isCocoonJS) {
          this.data.src = Array.isArray(this.url) ? this.url[0] : this.url;
        } else if (Array.isArray(this.url)) {
          var mimeTypes = this.metadata.mimeType;
          for (var i = 0; i < this.url.length; ++i) {
            this.data.appendChild(this._createSource(type, this.url[i], Array.isArray(mimeTypes) ? mimeTypes[i] : mimeTypes));
          }
        } else {
          var _mimeTypes = this.metadata.mimeType;
          this.data.appendChild(this._createSource(type, this.url, Array.isArray(_mimeTypes) ? _mimeTypes[0] : _mimeTypes));
        }
      }
      this.data.addEventListener("error", this._boundOnError, false);
      this.data.addEventListener("load", this._boundComplete, false);
      this.data.addEventListener("progress", this._boundOnProgress, false);
      this.data.addEventListener("canplaythrough", this._boundComplete, false);
      this.data.load();
      if (this.timeout) {
        this._elementTimer = setTimeout(this._boundOnTimeout, this.timeout);
      }
    };
    _proto._loadXhr = function _loadXhr() {
      if (typeof this.xhrType !== "string") {
        this.xhrType = this._determineXhrType();
      }
      var xhr = this.xhr = new XMLHttpRequest();
      xhr.open("GET", this.url, true);
      xhr.timeout = this.timeout;
      if (this.xhrType === Resource3.XHR_RESPONSE_TYPE.JSON || this.xhrType === Resource3.XHR_RESPONSE_TYPE.DOCUMENT) {
        xhr.responseType = Resource3.XHR_RESPONSE_TYPE.TEXT;
      } else {
        xhr.responseType = this.xhrType;
      }
      xhr.addEventListener("error", this._boundXhrOnError, false);
      xhr.addEventListener("timeout", this._boundXhrOnTimeout, false);
      xhr.addEventListener("abort", this._boundXhrOnAbort, false);
      xhr.addEventListener("progress", this._boundOnProgress, false);
      xhr.addEventListener("load", this._boundXhrOnLoad, false);
      xhr.send();
    };
    _proto._loadXdr = function _loadXdr() {
      if (typeof this.xhrType !== "string") {
        this.xhrType = this._determineXhrType();
      }
      var xdr = this.xhr = new XDomainRequest();
      xdr.timeout = this.timeout || 5e3;
      xdr.onerror = this._boundXhrOnError;
      xdr.ontimeout = this._boundXhrOnTimeout;
      xdr.onprogress = this._boundOnProgress;
      xdr.onload = this._boundXhrOnLoad;
      xdr.open("GET", this.url, true);
      setTimeout(function() {
        return xdr.send();
      }, 1);
    };
    _proto._createSource = function _createSource(type, url3, mime) {
      if (!mime) {
        mime = type + "/" + this._getExtension(url3);
      }
      var source = document.createElement("source");
      source.src = url3;
      source.type = mime;
      return source;
    };
    _proto._onError = function _onError(event) {
      this.abort("Failed to load element using: " + event.target.nodeName);
    };
    _proto._onProgress = function _onProgress(event) {
      if (event && event.lengthComputable) {
        this.onProgress.dispatch(this, event.loaded / event.total);
      }
    };
    _proto._onTimeout = function _onTimeout() {
      this.abort("Load timed out.");
    };
    _proto._xhrOnError = function _xhrOnError() {
      var xhr = this.xhr;
      this.abort(reqType(xhr) + " Request failed. Status: " + xhr.status + ', text: "' + xhr.statusText + '"');
    };
    _proto._xhrOnTimeout = function _xhrOnTimeout() {
      var xhr = this.xhr;
      this.abort(reqType(xhr) + " Request timed out.");
    };
    _proto._xhrOnAbort = function _xhrOnAbort() {
      var xhr = this.xhr;
      this.abort(reqType(xhr) + " Request was aborted by the user.");
    };
    _proto._xhrOnLoad = function _xhrOnLoad() {
      var xhr = this.xhr;
      var text3 = "";
      var status = typeof xhr.status === "undefined" ? STATUS_OK : xhr.status;
      if (xhr.responseType === "" || xhr.responseType === "text" || typeof xhr.responseType === "undefined") {
        text3 = xhr.responseText;
      }
      if (status === STATUS_NONE && (text3.length > 0 || xhr.responseType === Resource3.XHR_RESPONSE_TYPE.BUFFER)) {
        status = STATUS_OK;
      } else if (status === STATUS_IE_BUG_EMPTY) {
        status = STATUS_EMPTY;
      }
      var statusType = status / 100 | 0;
      if (statusType === STATUS_TYPE_OK) {
        if (this.xhrType === Resource3.XHR_RESPONSE_TYPE.TEXT) {
          this.data = text3;
          this.type = Resource3.TYPE.TEXT;
        } else if (this.xhrType === Resource3.XHR_RESPONSE_TYPE.JSON) {
          try {
            this.data = JSON.parse(text3);
            this.type = Resource3.TYPE.JSON;
          } catch (e) {
            this.abort("Error trying to parse loaded json: " + e);
            return;
          }
        } else if (this.xhrType === Resource3.XHR_RESPONSE_TYPE.DOCUMENT) {
          try {
            if (window.DOMParser) {
              var domparser = new DOMParser();
              this.data = domparser.parseFromString(text3, "text/xml");
            } else {
              var div = document.createElement("div");
              div.innerHTML = text3;
              this.data = div;
            }
            this.type = Resource3.TYPE.XML;
          } catch (e) {
            this.abort("Error trying to parse loaded xml: " + e);
            return;
          }
        } else {
          this.data = xhr.response || text3;
        }
      } else {
        this.abort("[" + xhr.status + "] " + xhr.statusText + ": " + xhr.responseURL);
        return;
      }
      this.complete();
    };
    _proto._determineCrossOrigin = function _determineCrossOrigin(url3, loc) {
      if (url3.indexOf("data:") === 0) {
        return "";
      }
      if (window.origin !== window.location.origin) {
        return "anonymous";
      }
      loc = loc || window.location;
      if (!tempAnchor2) {
        tempAnchor2 = document.createElement("a");
      }
      tempAnchor2.href = url3;
      url3 = parse_uri.default(tempAnchor2.href, {
        strictMode: true
      });
      var samePort = !url3.port && loc.port === "" || url3.port === loc.port;
      var protocol = url3.protocol ? url3.protocol + ":" : "";
      if (url3.host !== loc.hostname || !samePort || protocol !== loc.protocol) {
        return "anonymous";
      }
      return "";
    };
    _proto._determineXhrType = function _determineXhrType() {
      return Resource3._xhrTypeMap[this.extension] || Resource3.XHR_RESPONSE_TYPE.TEXT;
    };
    _proto._determineLoadType = function _determineLoadType() {
      return Resource3._loadTypeMap[this.extension] || Resource3.LOAD_TYPE.XHR;
    };
    _proto._getExtension = function _getExtension() {
      var url3 = this.url;
      var ext = "";
      if (this.isDataUrl) {
        var slashIndex = url3.indexOf("/");
        ext = url3.substring(slashIndex + 1, url3.indexOf(";", slashIndex));
      } else {
        var queryStart = url3.indexOf("?");
        var hashStart = url3.indexOf("#");
        var index2 = Math.min(queryStart > -1 ? queryStart : url3.length, hashStart > -1 ? hashStart : url3.length);
        url3 = url3.substring(0, index2);
        ext = url3.substring(url3.lastIndexOf(".") + 1);
      }
      return ext.toLowerCase();
    };
    _proto._getMimeFromXhrType = function _getMimeFromXhrType(type) {
      switch (type) {
        case Resource3.XHR_RESPONSE_TYPE.BUFFER:
          return "application/octet-binary";
        case Resource3.XHR_RESPONSE_TYPE.BLOB:
          return "application/blob";
        case Resource3.XHR_RESPONSE_TYPE.DOCUMENT:
          return "application/xml";
        case Resource3.XHR_RESPONSE_TYPE.JSON:
          return "application/json";
        case Resource3.XHR_RESPONSE_TYPE.DEFAULT:
        case Resource3.XHR_RESPONSE_TYPE.TEXT:
        default:
          return "text/plain";
      }
    };
    _createClass(Resource3, [{
      key: "isDataUrl",
      get: function get() {
        return this._hasFlag(Resource3.STATUS_FLAGS.DATA_URL);
      }
    }, {
      key: "isComplete",
      get: function get() {
        return this._hasFlag(Resource3.STATUS_FLAGS.COMPLETE);
      }
    }, {
      key: "isLoading",
      get: function get() {
        return this._hasFlag(Resource3.STATUS_FLAGS.LOADING);
      }
    }]);
    return Resource3;
  }();
  Resource2.STATUS_FLAGS = {
    NONE: 0,
    DATA_URL: 1 << 0,
    COMPLETE: 1 << 1,
    LOADING: 1 << 2
  };
  Resource2.TYPE = {
    UNKNOWN: 0,
    JSON: 1,
    XML: 2,
    IMAGE: 3,
    AUDIO: 4,
    VIDEO: 5,
    TEXT: 6
  };
  Resource2.LOAD_TYPE = {
    XHR: 1,
    IMAGE: 2,
    AUDIO: 3,
    VIDEO: 4
  };
  Resource2.XHR_RESPONSE_TYPE = {
    DEFAULT: "text",
    BUFFER: "arraybuffer",
    BLOB: "blob",
    DOCUMENT: "document",
    JSON: "json",
    TEXT: "text"
  };
  Resource2._loadTypeMap = {
    gif: Resource2.LOAD_TYPE.IMAGE,
    png: Resource2.LOAD_TYPE.IMAGE,
    bmp: Resource2.LOAD_TYPE.IMAGE,
    jpg: Resource2.LOAD_TYPE.IMAGE,
    jpeg: Resource2.LOAD_TYPE.IMAGE,
    tif: Resource2.LOAD_TYPE.IMAGE,
    tiff: Resource2.LOAD_TYPE.IMAGE,
    webp: Resource2.LOAD_TYPE.IMAGE,
    tga: Resource2.LOAD_TYPE.IMAGE,
    svg: Resource2.LOAD_TYPE.IMAGE,
    "svg+xml": Resource2.LOAD_TYPE.IMAGE,
    mp3: Resource2.LOAD_TYPE.AUDIO,
    ogg: Resource2.LOAD_TYPE.AUDIO,
    wav: Resource2.LOAD_TYPE.AUDIO,
    mp4: Resource2.LOAD_TYPE.VIDEO,
    webm: Resource2.LOAD_TYPE.VIDEO
  };
  Resource2._xhrTypeMap = {
    xhtml: Resource2.XHR_RESPONSE_TYPE.DOCUMENT,
    html: Resource2.XHR_RESPONSE_TYPE.DOCUMENT,
    htm: Resource2.XHR_RESPONSE_TYPE.DOCUMENT,
    xml: Resource2.XHR_RESPONSE_TYPE.DOCUMENT,
    tmx: Resource2.XHR_RESPONSE_TYPE.DOCUMENT,
    svg: Resource2.XHR_RESPONSE_TYPE.DOCUMENT,
    tsx: Resource2.XHR_RESPONSE_TYPE.DOCUMENT,
    gif: Resource2.XHR_RESPONSE_TYPE.BLOB,
    png: Resource2.XHR_RESPONSE_TYPE.BLOB,
    bmp: Resource2.XHR_RESPONSE_TYPE.BLOB,
    jpg: Resource2.XHR_RESPONSE_TYPE.BLOB,
    jpeg: Resource2.XHR_RESPONSE_TYPE.BLOB,
    tif: Resource2.XHR_RESPONSE_TYPE.BLOB,
    tiff: Resource2.XHR_RESPONSE_TYPE.BLOB,
    webp: Resource2.XHR_RESPONSE_TYPE.BLOB,
    tga: Resource2.XHR_RESPONSE_TYPE.BLOB,
    json: Resource2.XHR_RESPONSE_TYPE.JSON,
    text: Resource2.XHR_RESPONSE_TYPE.TEXT,
    txt: Resource2.XHR_RESPONSE_TYPE.TEXT,
    ttf: Resource2.XHR_RESPONSE_TYPE.BUFFER,
    otf: Resource2.XHR_RESPONSE_TYPE.BUFFER
  };
  Resource2.EMPTY_GIF = "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";
  function setExtMap(map3, extname, val) {
    if (extname && extname.indexOf(".") === 0) {
      extname = extname.substring(1);
    }
    if (!extname) {
      return;
    }
    map3[extname] = val;
  }
  function reqType(xhr) {
    return xhr.toString().replace("object ", "");
  }
  var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  function encodeBinary(input3) {
    var output = "";
    var inx = 0;
    while (inx < input3.length) {
      var bytebuffer = [0, 0, 0];
      var encodedCharIndexes = [0, 0, 0, 0];
      for (var jnx = 0; jnx < bytebuffer.length; ++jnx) {
        if (inx < input3.length) {
          bytebuffer[jnx] = input3.charCodeAt(inx++) & 255;
        } else {
          bytebuffer[jnx] = 0;
        }
      }
      encodedCharIndexes[0] = bytebuffer[0] >> 2;
      encodedCharIndexes[1] = (bytebuffer[0] & 3) << 4 | bytebuffer[1] >> 4;
      encodedCharIndexes[2] = (bytebuffer[1] & 15) << 2 | bytebuffer[2] >> 6;
      encodedCharIndexes[3] = bytebuffer[2] & 63;
      var paddingBytes = inx - (input3.length - 1);
      switch (paddingBytes) {
        case 2:
          encodedCharIndexes[3] = 64;
          encodedCharIndexes[2] = 64;
          break;
        case 1:
          encodedCharIndexes[3] = 64;
          break;
        default:
          break;
      }
      for (var _jnx = 0; _jnx < encodedCharIndexes.length; ++_jnx) {
        output += _keyStr.charAt(encodedCharIndexes[_jnx]);
      }
    }
    return output;
  }
  var Url = window.URL || window.webkitURL;
  function parsing(resource, next) {
    if (!resource.data) {
      next();
      return;
    }
    if (resource.xhr && resource.xhrType === Resource2.XHR_RESPONSE_TYPE.BLOB) {
      if (!window.Blob || typeof resource.data === "string") {
        var type = resource.xhr.getResponseHeader("content-type");
        if (type && type.indexOf("image") === 0) {
          resource.data = new Image();
          resource.data.src = "data:" + type + ";base64," + encodeBinary(resource.xhr.responseText);
          resource.type = Resource2.TYPE.IMAGE;
          resource.data.onload = function() {
            resource.data.onload = null;
            next();
          };
          return;
        }
      } else if (resource.data.type.indexOf("image") === 0) {
        var src = Url.createObjectURL(resource.data);
        resource.blob = resource.data;
        resource.data = new Image();
        resource.data.src = src;
        resource.type = Resource2.TYPE.IMAGE;
        resource.data.onload = function() {
          Url.revokeObjectURL(src);
          resource.data.onload = null;
          next();
        };
        return;
      }
    }
    next();
  }
  var index = {
    caching,
    parsing
  };
  var MAX_PROGRESS = 100;
  var rgxExtractUrlHash = /(#[\w-]+)?$/;
  var Loader = /* @__PURE__ */ function() {
    function Loader3(baseUrl, concurrency) {
      var _this = this;
      if (baseUrl === void 0) {
        baseUrl = "";
      }
      if (concurrency === void 0) {
        concurrency = 10;
      }
      this.baseUrl = baseUrl;
      this.progress = 0;
      this.loading = false;
      this.defaultQueryString = "";
      this._beforeMiddleware = [];
      this._afterMiddleware = [];
      this._resourcesParsing = [];
      this._boundLoadResource = function(r, d) {
        return _this._loadResource(r, d);
      };
      this._queue = queue(this._boundLoadResource, concurrency);
      this._queue.pause();
      this.resources = {};
      this.onProgress = new mini_signals.default();
      this.onError = new mini_signals.default();
      this.onLoad = new mini_signals.default();
      this.onStart = new mini_signals.default();
      this.onComplete = new mini_signals.default();
      for (var i = 0; i < Loader3._defaultBeforeMiddleware.length; ++i) {
        this.pre(Loader3._defaultBeforeMiddleware[i]);
      }
      for (var _i = 0; _i < Loader3._defaultAfterMiddleware.length; ++_i) {
        this.use(Loader3._defaultAfterMiddleware[_i]);
      }
    }
    var _proto = Loader3.prototype;
    _proto.add = function add(name, url3, options, cb) {
      if (Array.isArray(name)) {
        for (var i = 0; i < name.length; ++i) {
          this.add(name[i]);
        }
        return this;
      }
      if (typeof name === "object") {
        cb = url3 || name.callback || name.onComplete;
        options = name;
        url3 = name.url;
        name = name.name || name.key || name.url;
      }
      if (typeof url3 !== "string") {
        cb = options;
        options = url3;
        url3 = name;
      }
      if (typeof url3 !== "string") {
        throw new Error("No url passed to add resource to loader.");
      }
      if (typeof options === "function") {
        cb = options;
        options = null;
      }
      if (this.loading && (!options || !options.parentResource)) {
        throw new Error("Cannot add resources while the loader is running.");
      }
      if (this.resources[name]) {
        throw new Error('Resource named "' + name + '" already exists.');
      }
      url3 = this._prepareUrl(url3);
      this.resources[name] = new Resource2(name, url3, options);
      if (typeof cb === "function") {
        this.resources[name].onAfterMiddleware.once(cb);
      }
      if (this.loading) {
        var parent = options.parentResource;
        var incompleteChildren = [];
        for (var _i2 = 0; _i2 < parent.children.length; ++_i2) {
          if (!parent.children[_i2].isComplete) {
            incompleteChildren.push(parent.children[_i2]);
          }
        }
        var fullChunk = parent.progressChunk * (incompleteChildren.length + 1);
        var eachChunk = fullChunk / (incompleteChildren.length + 2);
        parent.children.push(this.resources[name]);
        parent.progressChunk = eachChunk;
        for (var _i3 = 0; _i3 < incompleteChildren.length; ++_i3) {
          incompleteChildren[_i3].progressChunk = eachChunk;
        }
        this.resources[name].progressChunk = eachChunk;
      }
      this._queue.push(this.resources[name]);
      return this;
    };
    _proto.pre = function pre(fn) {
      this._beforeMiddleware.push(fn);
      return this;
    };
    _proto.use = function use(fn) {
      this._afterMiddleware.push(fn);
      return this;
    };
    _proto.reset = function reset() {
      this.progress = 0;
      this.loading = false;
      this._queue.kill();
      this._queue.pause();
      for (var k in this.resources) {
        var res = this.resources[k];
        if (res._onLoadBinding) {
          res._onLoadBinding.detach();
        }
        if (res.isLoading) {
          res.abort();
        }
      }
      this.resources = {};
      return this;
    };
    _proto.load = function load(cb) {
      if (typeof cb === "function") {
        this.onComplete.once(cb);
      }
      if (this.loading) {
        return this;
      }
      if (this._queue.idle()) {
        this._onStart();
        this._onComplete();
      } else {
        var numTasks = this._queue._tasks.length;
        var chunk = MAX_PROGRESS / numTasks;
        for (var i = 0; i < this._queue._tasks.length; ++i) {
          this._queue._tasks[i].data.progressChunk = chunk;
        }
        this._onStart();
        this._queue.resume();
      }
      return this;
    };
    _proto._prepareUrl = function _prepareUrl(url3) {
      var parsedUrl = parse_uri.default(url3, {
        strictMode: true
      });
      var result;
      if (parsedUrl.protocol || !parsedUrl.path || url3.indexOf("//") === 0) {
        result = url3;
      } else if (this.baseUrl.length && this.baseUrl.lastIndexOf("/") !== this.baseUrl.length - 1 && url3.charAt(0) !== "/") {
        result = this.baseUrl + "/" + url3;
      } else {
        result = this.baseUrl + url3;
      }
      if (this.defaultQueryString) {
        var hash = rgxExtractUrlHash.exec(result)[0];
        result = result.substr(0, result.length - hash.length);
        if (result.indexOf("?") !== -1) {
          result += "&" + this.defaultQueryString;
        } else {
          result += "?" + this.defaultQueryString;
        }
        result += hash;
      }
      return result;
    };
    _proto._loadResource = function _loadResource(resource, dequeue) {
      var _this2 = this;
      resource._dequeue = dequeue;
      eachSeries(this._beforeMiddleware, function(fn, next) {
        fn.call(_this2, resource, function() {
          next(resource.isComplete ? {} : null);
        });
      }, function() {
        if (resource.isComplete) {
          _this2._onLoad(resource);
        } else {
          resource._onLoadBinding = resource.onComplete.once(_this2._onLoad, _this2);
          resource.load();
        }
      }, true);
    };
    _proto._onStart = function _onStart() {
      this.progress = 0;
      this.loading = true;
      this.onStart.dispatch(this);
    };
    _proto._onComplete = function _onComplete() {
      this.progress = MAX_PROGRESS;
      this.loading = false;
      this.onComplete.dispatch(this, this.resources);
    };
    _proto._onLoad = function _onLoad(resource) {
      var _this3 = this;
      resource._onLoadBinding = null;
      this._resourcesParsing.push(resource);
      resource._dequeue();
      eachSeries(this._afterMiddleware, function(fn, next) {
        fn.call(_this3, resource, next);
      }, function() {
        resource.onAfterMiddleware.dispatch(resource);
        _this3.progress = Math.min(MAX_PROGRESS, _this3.progress + resource.progressChunk);
        _this3.onProgress.dispatch(_this3, resource);
        if (resource.error) {
          _this3.onError.dispatch(resource.error, _this3, resource);
        } else {
          _this3.onLoad.dispatch(_this3, resource);
        }
        _this3._resourcesParsing.splice(_this3._resourcesParsing.indexOf(resource), 1);
        if (_this3._queue.idle() && _this3._resourcesParsing.length === 0) {
          _this3._onComplete();
        }
      }, true);
    };
    _createClass(Loader3, [{
      key: "concurrency",
      get: function get() {
        return this._queue.concurrency;
      },
      set: function set(concurrency) {
        this._queue.concurrency = concurrency;
      }
    }]);
    return Loader3;
  }();
  Loader._defaultBeforeMiddleware = [];
  Loader._defaultAfterMiddleware = [];
  Loader.pre = function LoaderPreStatic(fn) {
    Loader._defaultBeforeMiddleware.push(fn);
    return Loader;
  };
  Loader.use = function LoaderUseStatic(fn) {
    Loader._defaultAfterMiddleware.push(fn);
    return Loader;
  };

  // node_modules/@pixi/loaders/lib/loaders.es.js
  /*!
   * @pixi/loaders - v5.3.3
   * Compiled Tue, 04 Aug 2020 16:23:09 UTC
   *
   * @pixi/loaders is licensed under the MIT License.
   * http://www.opensource.org/licenses/mit-license
   */
  var LoaderResource = Resource2;
  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation. All rights reserved.
  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at http://www.apache.org/licenses/LICENSE-2.0
  
  THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
  WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
  MERCHANTABLITY OR NON-INFRINGEMENT.
  
  See the Apache Version 2.0 License for specific language governing permissions
  and limitations under the License.
  ***************************************************************************** */
  var extendStatics4 = function(d, b) {
    extendStatics4 = Object.setPrototypeOf || {__proto__: []} instanceof Array && function(d2, b2) {
      d2.__proto__ = b2;
    } || function(d2, b2) {
      for (var p in b2) {
        if (b2.hasOwnProperty(p)) {
          d2[p] = b2[p];
        }
      }
    };
    return extendStatics4(d, b);
  };
  function __extends4(d, b) {
    extendStatics4(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  }
  var TextureLoader = function() {
    function TextureLoader2() {
    }
    TextureLoader2.use = function(resource, next) {
      if (resource.data && resource.type === Resource2.TYPE.IMAGE) {
        resource.texture = Texture.fromLoader(resource.data, resource.url, resource.name);
      }
      next();
    };
    return TextureLoader2;
  }();
  var Loader2 = function(_super) {
    __extends4(Loader3, _super);
    function Loader3(baseUrl, concurrency) {
      var _this = _super.call(this, baseUrl, concurrency) || this;
      for (var i = 0; i < Loader3._plugins.length; ++i) {
        var plugin = Loader3._plugins[i];
        var pre = plugin.pre, use = plugin.use;
        if (pre) {
          _this.pre(pre);
        }
        if (use) {
          _this.use(use);
        }
      }
      _this._protected = false;
      return _this;
    }
    Loader3.prototype.destroy = function() {
      if (!this._protected) {
        this.reset();
      }
    };
    Object.defineProperty(Loader3, "shared", {
      get: function() {
        var shared = Loader3._shared;
        if (!shared) {
          shared = new Loader3();
          shared._protected = true;
          Loader3._shared = shared;
        }
        return shared;
      },
      enumerable: false,
      configurable: true
    });
    Loader3.registerPlugin = function(plugin) {
      Loader3._plugins.push(plugin);
      if (plugin.add) {
        plugin.add();
      }
      return Loader3;
    };
    Loader3._plugins = [];
    return Loader3;
  }(Loader);
  Loader2.registerPlugin({use: index.parsing});
  Loader2.registerPlugin(TextureLoader);
  var AppLoaderPlugin = function() {
    function AppLoaderPlugin2() {
    }
    AppLoaderPlugin2.init = function(options) {
      options = Object.assign({
        sharedLoader: false
      }, options);
      this.loader = options.sharedLoader ? Loader2.shared : new Loader2();
    };
    AppLoaderPlugin2.destroy = function() {
      if (this.loader) {
        this.loader.destroy();
        this.loader = null;
      }
    };
    return AppLoaderPlugin2;
  }();

  // node_modules/@pixi/particles/lib/particles.es.js
  /*!
   * @pixi/particles - v5.3.3
   * Compiled Tue, 04 Aug 2020 16:23:09 UTC
   *
   * @pixi/particles is licensed under the MIT License.
   * http://www.opensource.org/licenses/mit-license
   */
  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation. All rights reserved.
  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at http://www.apache.org/licenses/LICENSE-2.0
  
  THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
  WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
  MERCHANTABLITY OR NON-INFRINGEMENT.
  
  See the Apache Version 2.0 License for specific language governing permissions
  and limitations under the License.
  ***************************************************************************** */
  var extendStatics5 = function(d, b) {
    extendStatics5 = Object.setPrototypeOf || {__proto__: []} instanceof Array && function(d2, b2) {
      d2.__proto__ = b2;
    } || function(d2, b2) {
      for (var p in b2) {
        if (b2.hasOwnProperty(p)) {
          d2[p] = b2[p];
        }
      }
    };
    return extendStatics5(d, b);
  };
  function __extends5(d, b) {
    extendStatics5(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  }
  var ParticleContainer = function(_super) {
    __extends5(ParticleContainer2, _super);
    function ParticleContainer2(maxSize, properties, batchSize, autoResize) {
      if (maxSize === void 0) {
        maxSize = 1500;
      }
      if (batchSize === void 0) {
        batchSize = 16384;
      }
      if (autoResize === void 0) {
        autoResize = false;
      }
      var _this = _super.call(this) || this;
      var maxBatchSize = 16384;
      if (batchSize > maxBatchSize) {
        batchSize = maxBatchSize;
      }
      _this._properties = [false, true, false, false, false];
      _this._maxSize = maxSize;
      _this._batchSize = batchSize;
      _this._buffers = null;
      _this._bufferUpdateIDs = [];
      _this._updateID = 0;
      _this.interactiveChildren = false;
      _this.blendMode = BLEND_MODES.NORMAL;
      _this.autoResize = autoResize;
      _this.roundPixels = true;
      _this.baseTexture = null;
      _this.setProperties(properties);
      _this._tint = 0;
      _this.tintRgb = new Float32Array(4);
      _this.tint = 16777215;
      return _this;
    }
    ParticleContainer2.prototype.setProperties = function(properties) {
      if (properties) {
        this._properties[0] = "vertices" in properties || "scale" in properties ? !!properties.vertices || !!properties.scale : this._properties[0];
        this._properties[1] = "position" in properties ? !!properties.position : this._properties[1];
        this._properties[2] = "rotation" in properties ? !!properties.rotation : this._properties[2];
        this._properties[3] = "uvs" in properties ? !!properties.uvs : this._properties[3];
        this._properties[4] = "tint" in properties || "alpha" in properties ? !!properties.tint || !!properties.alpha : this._properties[4];
      }
    };
    ParticleContainer2.prototype.updateTransform = function() {
      this.displayObjectUpdateTransform();
    };
    Object.defineProperty(ParticleContainer2.prototype, "tint", {
      get: function() {
        return this._tint;
      },
      set: function(value) {
        this._tint = value;
        hex2rgb(value, this.tintRgb);
      },
      enumerable: false,
      configurable: true
    });
    ParticleContainer2.prototype.render = function(renderer) {
      var _this = this;
      if (!this.visible || this.worldAlpha <= 0 || !this.children.length || !this.renderable) {
        return;
      }
      if (!this.baseTexture) {
        this.baseTexture = this.children[0]._texture.baseTexture;
        if (!this.baseTexture.valid) {
          this.baseTexture.once("update", function() {
            return _this.onChildrenChange(0);
          });
        }
      }
      renderer.batch.setObjectRenderer(renderer.plugins.particle);
      renderer.plugins.particle.render(this);
    };
    ParticleContainer2.prototype.onChildrenChange = function(smallestChildIndex) {
      var bufferIndex = Math.floor(smallestChildIndex / this._batchSize);
      while (this._bufferUpdateIDs.length < bufferIndex) {
        this._bufferUpdateIDs.push(0);
      }
      this._bufferUpdateIDs[bufferIndex] = ++this._updateID;
    };
    ParticleContainer2.prototype.dispose = function() {
      if (this._buffers) {
        for (var i = 0; i < this._buffers.length; ++i) {
          this._buffers[i].destroy();
        }
        this._buffers = null;
      }
    };
    ParticleContainer2.prototype.destroy = function(options) {
      _super.prototype.destroy.call(this, options);
      this.dispose();
      this._properties = null;
      this._buffers = null;
      this._bufferUpdateIDs = null;
    };
    return ParticleContainer2;
  }(Container);
  var ParticleBuffer = function() {
    function ParticleBuffer2(properties, dynamicPropertyFlags, size2) {
      this.geometry = new Geometry();
      this.indexBuffer = null;
      this.size = size2;
      this.dynamicProperties = [];
      this.staticProperties = [];
      for (var i = 0; i < properties.length; ++i) {
        var property = properties[i];
        property = {
          attributeName: property.attributeName,
          size: property.size,
          uploadFunction: property.uploadFunction,
          type: property.type || TYPES.FLOAT,
          offset: property.offset
        };
        if (dynamicPropertyFlags[i]) {
          this.dynamicProperties.push(property);
        } else {
          this.staticProperties.push(property);
        }
      }
      this.staticStride = 0;
      this.staticBuffer = null;
      this.staticData = null;
      this.staticDataUint32 = null;
      this.dynamicStride = 0;
      this.dynamicBuffer = null;
      this.dynamicData = null;
      this.dynamicDataUint32 = null;
      this._updateID = 0;
      this.initBuffers();
    }
    ParticleBuffer2.prototype.initBuffers = function() {
      var geometry = this.geometry;
      var dynamicOffset = 0;
      this.indexBuffer = new Buffer2(createIndicesForQuads(this.size), true, true);
      geometry.addIndex(this.indexBuffer);
      this.dynamicStride = 0;
      for (var i = 0; i < this.dynamicProperties.length; ++i) {
        var property = this.dynamicProperties[i];
        property.offset = dynamicOffset;
        dynamicOffset += property.size;
        this.dynamicStride += property.size;
      }
      var dynBuffer = new ArrayBuffer(this.size * this.dynamicStride * 4 * 4);
      this.dynamicData = new Float32Array(dynBuffer);
      this.dynamicDataUint32 = new Uint32Array(dynBuffer);
      this.dynamicBuffer = new Buffer2(this.dynamicData, false, false);
      var staticOffset = 0;
      this.staticStride = 0;
      for (var i = 0; i < this.staticProperties.length; ++i) {
        var property = this.staticProperties[i];
        property.offset = staticOffset;
        staticOffset += property.size;
        this.staticStride += property.size;
      }
      var statBuffer = new ArrayBuffer(this.size * this.staticStride * 4 * 4);
      this.staticData = new Float32Array(statBuffer);
      this.staticDataUint32 = new Uint32Array(statBuffer);
      this.staticBuffer = new Buffer2(this.staticData, true, false);
      for (var i = 0; i < this.dynamicProperties.length; ++i) {
        var property = this.dynamicProperties[i];
        geometry.addAttribute(property.attributeName, this.dynamicBuffer, 0, property.type === TYPES.UNSIGNED_BYTE, property.type, this.dynamicStride * 4, property.offset * 4);
      }
      for (var i = 0; i < this.staticProperties.length; ++i) {
        var property = this.staticProperties[i];
        geometry.addAttribute(property.attributeName, this.staticBuffer, 0, property.type === TYPES.UNSIGNED_BYTE, property.type, this.staticStride * 4, property.offset * 4);
      }
    };
    ParticleBuffer2.prototype.uploadDynamic = function(children, startIndex, amount) {
      for (var i = 0; i < this.dynamicProperties.length; i++) {
        var property = this.dynamicProperties[i];
        property.uploadFunction(children, startIndex, amount, property.type === TYPES.UNSIGNED_BYTE ? this.dynamicDataUint32 : this.dynamicData, this.dynamicStride, property.offset);
      }
      this.dynamicBuffer._updateID++;
    };
    ParticleBuffer2.prototype.uploadStatic = function(children, startIndex, amount) {
      for (var i = 0; i < this.staticProperties.length; i++) {
        var property = this.staticProperties[i];
        property.uploadFunction(children, startIndex, amount, property.type === TYPES.UNSIGNED_BYTE ? this.staticDataUint32 : this.staticData, this.staticStride, property.offset);
      }
      this.staticBuffer._updateID++;
    };
    ParticleBuffer2.prototype.destroy = function() {
      this.indexBuffer = null;
      this.dynamicProperties = null;
      this.dynamicBuffer = null;
      this.dynamicData = null;
      this.dynamicDataUint32 = null;
      this.staticProperties = null;
      this.staticBuffer = null;
      this.staticData = null;
      this.staticDataUint32 = null;
      this.geometry.destroy();
    };
    return ParticleBuffer2;
  }();
  var fragment2 = "varying vec2 vTextureCoord;\nvarying vec4 vColor;\n\nuniform sampler2D uSampler;\n\nvoid main(void){\n    vec4 color = texture2D(uSampler, vTextureCoord) * vColor;\n    gl_FragColor = color;\n}";
  var vertex2 = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\nattribute vec4 aColor;\n\nattribute vec2 aPositionCoord;\nattribute float aRotation;\n\nuniform mat3 translationMatrix;\nuniform vec4 uColor;\n\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\n\nvoid main(void){\n    float x = (aVertexPosition.x) * cos(aRotation) - (aVertexPosition.y) * sin(aRotation);\n    float y = (aVertexPosition.x) * sin(aRotation) + (aVertexPosition.y) * cos(aRotation);\n\n    vec2 v = vec2(x, y);\n    v = v + aPositionCoord;\n\n    gl_Position = vec4((translationMatrix * vec3(v, 1.0)).xy, 0.0, 1.0);\n\n    vTextureCoord = aTextureCoord;\n    vColor = aColor * uColor;\n}\n";
  var ParticleRenderer = function(_super) {
    __extends5(ParticleRenderer2, _super);
    function ParticleRenderer2(renderer) {
      var _this = _super.call(this, renderer) || this;
      _this.shader = null;
      _this.properties = null;
      _this.tempMatrix = new Matrix();
      _this.properties = [
        {
          attributeName: "aVertexPosition",
          size: 2,
          uploadFunction: _this.uploadVertices,
          offset: 0
        },
        {
          attributeName: "aPositionCoord",
          size: 2,
          uploadFunction: _this.uploadPosition,
          offset: 0
        },
        {
          attributeName: "aRotation",
          size: 1,
          uploadFunction: _this.uploadRotation,
          offset: 0
        },
        {
          attributeName: "aTextureCoord",
          size: 2,
          uploadFunction: _this.uploadUvs,
          offset: 0
        },
        {
          attributeName: "aColor",
          size: 1,
          type: TYPES.UNSIGNED_BYTE,
          uploadFunction: _this.uploadTint,
          offset: 0
        }
      ];
      _this.shader = Shader.from(vertex2, fragment2, {});
      _this.state = State.for2d();
      return _this;
    }
    ParticleRenderer2.prototype.render = function(container) {
      var children = container.children;
      var maxSize = container._maxSize;
      var batchSize = container._batchSize;
      var renderer = this.renderer;
      var totalChildren = children.length;
      if (totalChildren === 0) {
        return;
      } else if (totalChildren > maxSize && !container.autoResize) {
        totalChildren = maxSize;
      }
      var buffers = container._buffers;
      if (!buffers) {
        buffers = container._buffers = this.generateBuffers(container);
      }
      var baseTexture = children[0]._texture.baseTexture;
      this.state.blendMode = correctBlendMode(container.blendMode, baseTexture.alphaMode);
      renderer.state.set(this.state);
      var gl = renderer.gl;
      var m = container.worldTransform.copyTo(this.tempMatrix);
      m.prepend(renderer.globalUniforms.uniforms.projectionMatrix);
      this.shader.uniforms.translationMatrix = m.toArray(true);
      this.shader.uniforms.uColor = premultiplyRgba(container.tintRgb, container.worldAlpha, this.shader.uniforms.uColor, baseTexture.alphaMode);
      this.shader.uniforms.uSampler = baseTexture;
      this.renderer.shader.bind(this.shader);
      var updateStatic = false;
      for (var i = 0, j = 0; i < totalChildren; i += batchSize, j += 1) {
        var amount = totalChildren - i;
        if (amount > batchSize) {
          amount = batchSize;
        }
        if (j >= buffers.length) {
          buffers.push(this._generateOneMoreBuffer(container));
        }
        var buffer = buffers[j];
        buffer.uploadDynamic(children, i, amount);
        var bid = container._bufferUpdateIDs[j] || 0;
        updateStatic = updateStatic || buffer._updateID < bid;
        if (updateStatic) {
          buffer._updateID = container._updateID;
          buffer.uploadStatic(children, i, amount);
        }
        renderer.geometry.bind(buffer.geometry);
        gl.drawElements(gl.TRIANGLES, amount * 6, gl.UNSIGNED_SHORT, 0);
      }
    };
    ParticleRenderer2.prototype.generateBuffers = function(container) {
      var buffers = [];
      var size2 = container._maxSize;
      var batchSize = container._batchSize;
      var dynamicPropertyFlags = container._properties;
      for (var i = 0; i < size2; i += batchSize) {
        buffers.push(new ParticleBuffer(this.properties, dynamicPropertyFlags, batchSize));
      }
      return buffers;
    };
    ParticleRenderer2.prototype._generateOneMoreBuffer = function(container) {
      var batchSize = container._batchSize;
      var dynamicPropertyFlags = container._properties;
      return new ParticleBuffer(this.properties, dynamicPropertyFlags, batchSize);
    };
    ParticleRenderer2.prototype.uploadVertices = function(children, startIndex, amount, array, stride, offset) {
      var w0 = 0;
      var w1 = 0;
      var h0 = 0;
      var h1 = 0;
      for (var i = 0; i < amount; ++i) {
        var sprite5 = children[startIndex + i];
        var texture = sprite5._texture;
        var sx = sprite5.scale.x;
        var sy = sprite5.scale.y;
        var trim = texture.trim;
        var orig = texture.orig;
        if (trim) {
          w1 = trim.x - sprite5.anchor.x * orig.width;
          w0 = w1 + trim.width;
          h1 = trim.y - sprite5.anchor.y * orig.height;
          h0 = h1 + trim.height;
        } else {
          w0 = orig.width * (1 - sprite5.anchor.x);
          w1 = orig.width * -sprite5.anchor.x;
          h0 = orig.height * (1 - sprite5.anchor.y);
          h1 = orig.height * -sprite5.anchor.y;
        }
        array[offset] = w1 * sx;
        array[offset + 1] = h1 * sy;
        array[offset + stride] = w0 * sx;
        array[offset + stride + 1] = h1 * sy;
        array[offset + stride * 2] = w0 * sx;
        array[offset + stride * 2 + 1] = h0 * sy;
        array[offset + stride * 3] = w1 * sx;
        array[offset + stride * 3 + 1] = h0 * sy;
        offset += stride * 4;
      }
    };
    ParticleRenderer2.prototype.uploadPosition = function(children, startIndex, amount, array, stride, offset) {
      for (var i = 0; i < amount; i++) {
        var spritePosition = children[startIndex + i].position;
        array[offset] = spritePosition.x;
        array[offset + 1] = spritePosition.y;
        array[offset + stride] = spritePosition.x;
        array[offset + stride + 1] = spritePosition.y;
        array[offset + stride * 2] = spritePosition.x;
        array[offset + stride * 2 + 1] = spritePosition.y;
        array[offset + stride * 3] = spritePosition.x;
        array[offset + stride * 3 + 1] = spritePosition.y;
        offset += stride * 4;
      }
    };
    ParticleRenderer2.prototype.uploadRotation = function(children, startIndex, amount, array, stride, offset) {
      for (var i = 0; i < amount; i++) {
        var spriteRotation = children[startIndex + i].rotation;
        array[offset] = spriteRotation;
        array[offset + stride] = spriteRotation;
        array[offset + stride * 2] = spriteRotation;
        array[offset + stride * 3] = spriteRotation;
        offset += stride * 4;
      }
    };
    ParticleRenderer2.prototype.uploadUvs = function(children, startIndex, amount, array, stride, offset) {
      for (var i = 0; i < amount; ++i) {
        var textureUvs = children[startIndex + i]._texture._uvs;
        if (textureUvs) {
          array[offset] = textureUvs.x0;
          array[offset + 1] = textureUvs.y0;
          array[offset + stride] = textureUvs.x1;
          array[offset + stride + 1] = textureUvs.y1;
          array[offset + stride * 2] = textureUvs.x2;
          array[offset + stride * 2 + 1] = textureUvs.y2;
          array[offset + stride * 3] = textureUvs.x3;
          array[offset + stride * 3 + 1] = textureUvs.y3;
          offset += stride * 4;
        } else {
          array[offset] = 0;
          array[offset + 1] = 0;
          array[offset + stride] = 0;
          array[offset + stride + 1] = 0;
          array[offset + stride * 2] = 0;
          array[offset + stride * 2 + 1] = 0;
          array[offset + stride * 3] = 0;
          array[offset + stride * 3 + 1] = 0;
          offset += stride * 4;
        }
      }
    };
    ParticleRenderer2.prototype.uploadTint = function(children, startIndex, amount, array, stride, offset) {
      for (var i = 0; i < amount; ++i) {
        var sprite5 = children[startIndex + i];
        var premultiplied = sprite5._texture.baseTexture.alphaMode > 0;
        var alpha = sprite5.alpha;
        var argb = alpha < 1 && premultiplied ? premultiplyTint(sprite5._tintRGB, alpha) : sprite5._tintRGB + (alpha * 255 << 24);
        array[offset] = argb;
        array[offset + stride] = argb;
        array[offset + stride * 2] = argb;
        array[offset + stride * 3] = argb;
        offset += stride * 4;
      }
    };
    ParticleRenderer2.prototype.destroy = function() {
      _super.prototype.destroy.call(this);
      if (this.shader) {
        this.shader.destroy();
        this.shader = null;
      }
      this.tempMatrix = null;
    };
    return ParticleRenderer2;
  }(ObjectRenderer);

  // node_modules/@pixi/graphics/lib/graphics.es.js
  /*!
   * @pixi/graphics - v5.3.3
   * Compiled Tue, 04 Aug 2020 16:23:09 UTC
   *
   * @pixi/graphics is licensed under the MIT License.
   * http://www.opensource.org/licenses/mit-license
   */
  var LINE_JOIN;
  (function(LINE_JOIN2) {
    LINE_JOIN2["MITER"] = "miter";
    LINE_JOIN2["BEVEL"] = "bevel";
    LINE_JOIN2["ROUND"] = "round";
  })(LINE_JOIN || (LINE_JOIN = {}));
  var LINE_CAP;
  (function(LINE_CAP2) {
    LINE_CAP2["BUTT"] = "butt";
    LINE_CAP2["ROUND"] = "round";
    LINE_CAP2["SQUARE"] = "square";
  })(LINE_CAP || (LINE_CAP = {}));
  var GRAPHICS_CURVES = {
    adaptive: true,
    maxLength: 10,
    minSegments: 8,
    maxSegments: 2048,
    epsilon: 1e-4,
    _segmentsCount: function(length, defaultSegments) {
      if (defaultSegments === void 0) {
        defaultSegments = 20;
      }
      if (!this.adaptive || !length || isNaN(length)) {
        return defaultSegments;
      }
      var result = Math.ceil(length / this.maxLength);
      if (result < this.minSegments) {
        result = this.minSegments;
      } else if (result > this.maxSegments) {
        result = this.maxSegments;
      }
      return result;
    }
  };
  var FillStyle = function() {
    function FillStyle2() {
      this.color = 16777215;
      this.alpha = 1;
      this.texture = Texture.WHITE;
      this.matrix = null;
      this.visible = false;
      this.reset();
    }
    FillStyle2.prototype.clone = function() {
      var obj = new FillStyle2();
      obj.color = this.color;
      obj.alpha = this.alpha;
      obj.texture = this.texture;
      obj.matrix = this.matrix;
      obj.visible = this.visible;
      return obj;
    };
    FillStyle2.prototype.reset = function() {
      this.color = 16777215;
      this.alpha = 1;
      this.texture = Texture.WHITE;
      this.matrix = null;
      this.visible = false;
    };
    FillStyle2.prototype.destroy = function() {
      this.texture = null;
      this.matrix = null;
    };
    return FillStyle2;
  }();
  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation. All rights reserved.
  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at http://www.apache.org/licenses/LICENSE-2.0
  
  THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
  WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
  MERCHANTABLITY OR NON-INFRINGEMENT.
  
  See the Apache Version 2.0 License for specific language governing permissions
  and limitations under the License.
  ***************************************************************************** */
  var extendStatics6 = function(d, b) {
    extendStatics6 = Object.setPrototypeOf || {__proto__: []} instanceof Array && function(d2, b2) {
      d2.__proto__ = b2;
    } || function(d2, b2) {
      for (var p in b2) {
        if (b2.hasOwnProperty(p)) {
          d2[p] = b2[p];
        }
      }
    };
    return extendStatics6(d, b);
  };
  function __extends6(d, b) {
    extendStatics6(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  }
  var buildPoly = {
    build: function(graphicsData) {
      graphicsData.points = graphicsData.shape.points.slice();
    },
    triangulate: function(graphicsData, graphicsGeometry) {
      var points = graphicsData.points;
      var holes = graphicsData.holes;
      var verts = graphicsGeometry.points;
      var indices2 = graphicsGeometry.indices;
      if (points.length >= 6) {
        var holeArray = [];
        for (var i = 0; i < holes.length; i++) {
          var hole = holes[i];
          holeArray.push(points.length / 2);
          points = points.concat(hole.points);
        }
        var triangles = earcut.default(points, holeArray, 2);
        if (!triangles) {
          return;
        }
        var vertPos = verts.length / 2;
        for (var i = 0; i < triangles.length; i += 3) {
          indices2.push(triangles[i] + vertPos);
          indices2.push(triangles[i + 1] + vertPos);
          indices2.push(triangles[i + 2] + vertPos);
        }
        for (var i = 0; i < points.length; i++) {
          verts.push(points[i]);
        }
      }
    }
  };
  var buildCircle = {
    build: function(graphicsData) {
      var circleData = graphicsData.shape;
      var points = graphicsData.points;
      var x = circleData.x;
      var y = circleData.y;
      var width;
      var height;
      points.length = 0;
      if (graphicsData.type === SHAPES.CIRC) {
        width = circleData.radius;
        height = circleData.radius;
      } else {
        var ellipseData = graphicsData.shape;
        width = ellipseData.width;
        height = ellipseData.height;
      }
      if (width === 0 || height === 0) {
        return;
      }
      var totalSegs = Math.floor(30 * Math.sqrt(circleData.radius)) || Math.floor(15 * Math.sqrt(width + height));
      totalSegs /= 2.3;
      var seg = Math.PI * 2 / totalSegs;
      for (var i = 0; i < totalSegs - 0.5; i++) {
        points.push(x + Math.sin(-seg * i) * width, y + Math.cos(-seg * i) * height);
      }
      points.push(points[0], points[1]);
    },
    triangulate: function(graphicsData, graphicsGeometry) {
      var points = graphicsData.points;
      var verts = graphicsGeometry.points;
      var indices2 = graphicsGeometry.indices;
      var vertPos = verts.length / 2;
      var center = vertPos;
      var circle = graphicsData.shape;
      var matrix = graphicsData.matrix;
      var x = circle.x;
      var y = circle.y;
      verts.push(graphicsData.matrix ? matrix.a * x + matrix.c * y + matrix.tx : x, graphicsData.matrix ? matrix.b * x + matrix.d * y + matrix.ty : y);
      for (var i = 0; i < points.length; i += 2) {
        verts.push(points[i], points[i + 1]);
        indices2.push(vertPos++, center, vertPos);
      }
    }
  };
  var buildRectangle = {
    build: function(graphicsData) {
      var rectData = graphicsData.shape;
      var x = rectData.x;
      var y = rectData.y;
      var width = rectData.width;
      var height = rectData.height;
      var points = graphicsData.points;
      points.length = 0;
      points.push(x, y, x + width, y, x + width, y + height, x, y + height);
    },
    triangulate: function(graphicsData, graphicsGeometry) {
      var points = graphicsData.points;
      var verts = graphicsGeometry.points;
      var vertPos = verts.length / 2;
      verts.push(points[0], points[1], points[2], points[3], points[6], points[7], points[4], points[5]);
      graphicsGeometry.indices.push(vertPos, vertPos + 1, vertPos + 2, vertPos + 1, vertPos + 2, vertPos + 3);
    }
  };
  function getPt(n1, n2, perc) {
    var diff = n2 - n1;
    return n1 + diff * perc;
  }
  function quadraticBezierCurve(fromX, fromY, cpX, cpY, toX, toY, out) {
    if (out === void 0) {
      out = [];
    }
    var n = 20;
    var points = out;
    var xa = 0;
    var ya = 0;
    var xb = 0;
    var yb = 0;
    var x = 0;
    var y = 0;
    for (var i = 0, j = 0; i <= n; ++i) {
      j = i / n;
      xa = getPt(fromX, cpX, j);
      ya = getPt(fromY, cpY, j);
      xb = getPt(cpX, toX, j);
      yb = getPt(cpY, toY, j);
      x = getPt(xa, xb, j);
      y = getPt(ya, yb, j);
      points.push(x, y);
    }
    return points;
  }
  var buildRoundedRectangle = {
    build: function(graphicsData) {
      var rrectData = graphicsData.shape;
      var points = graphicsData.points;
      var x = rrectData.x;
      var y = rrectData.y;
      var width = rrectData.width;
      var height = rrectData.height;
      var radius2 = Math.max(0, Math.min(rrectData.radius, Math.min(width, height) / 2));
      points.length = 0;
      if (!radius2) {
        points.push(x, y, x + width, y, x + width, y + height, x, y + height);
      } else {
        quadraticBezierCurve(x, y + radius2, x, y, x + radius2, y, points);
        quadraticBezierCurve(x + width - radius2, y, x + width, y, x + width, y + radius2, points);
        quadraticBezierCurve(x + width, y + height - radius2, x + width, y + height, x + width - radius2, y + height, points);
        quadraticBezierCurve(x + radius2, y + height, x, y + height, x, y + height - radius2, points);
      }
    },
    triangulate: function(graphicsData, graphicsGeometry) {
      var points = graphicsData.points;
      var verts = graphicsGeometry.points;
      var indices2 = graphicsGeometry.indices;
      var vecPos = verts.length / 2;
      var triangles = earcut.default(points, null, 2);
      for (var i = 0, j = triangles.length; i < j; i += 3) {
        indices2.push(triangles[i] + vecPos);
        indices2.push(triangles[i + 1] + vecPos);
        indices2.push(triangles[i + 2] + vecPos);
      }
      for (var i = 0, j = points.length; i < j; i++) {
        verts.push(points[i], points[++i]);
      }
    }
  };
  function square(x, y, nx, ny, innerWeight, outerWeight, clockwise, verts) {
    var ix = x - nx * innerWeight;
    var iy = y - ny * innerWeight;
    var ox = x + nx * outerWeight;
    var oy = y + ny * outerWeight;
    var exx;
    var eyy;
    if (clockwise) {
      exx = ny;
      eyy = -nx;
    } else {
      exx = -ny;
      eyy = nx;
    }
    var eix = ix + exx;
    var eiy = iy + eyy;
    var eox = ox + exx;
    var eoy = oy + eyy;
    verts.push(eix, eiy);
    verts.push(eox, eoy);
    return 2;
  }
  function round(cx, cy, sx, sy, ex, ey, verts, clockwise) {
    var cx2p0x = sx - cx;
    var cy2p0y = sy - cy;
    var angle0 = Math.atan2(cx2p0x, cy2p0y);
    var angle1 = Math.atan2(ex - cx, ey - cy);
    if (clockwise && angle0 < angle1) {
      angle0 += Math.PI * 2;
    } else if (!clockwise && angle0 > angle1) {
      angle1 += Math.PI * 2;
    }
    var startAngle = angle0;
    var angleDiff = angle1 - angle0;
    var absAngleDiff = Math.abs(angleDiff);
    var radius2 = Math.sqrt(cx2p0x * cx2p0x + cy2p0y * cy2p0y);
    var segCount = (15 * absAngleDiff * Math.sqrt(radius2) / Math.PI >> 0) + 1;
    var angleInc = angleDiff / segCount;
    startAngle += angleInc;
    if (clockwise) {
      verts.push(cx, cy);
      verts.push(sx, sy);
      for (var i = 1, angle = startAngle; i < segCount; i++, angle += angleInc) {
        verts.push(cx, cy);
        verts.push(cx + Math.sin(angle) * radius2, cy + Math.cos(angle) * radius2);
      }
      verts.push(cx, cy);
      verts.push(ex, ey);
    } else {
      verts.push(sx, sy);
      verts.push(cx, cy);
      for (var i = 1, angle = startAngle; i < segCount; i++, angle += angleInc) {
        verts.push(cx + Math.sin(angle) * radius2, cy + Math.cos(angle) * radius2);
        verts.push(cx, cy);
      }
      verts.push(ex, ey);
      verts.push(cx, cy);
    }
    return segCount * 2;
  }
  function buildNonNativeLine(graphicsData, graphicsGeometry) {
    var shape = graphicsData.shape;
    var points = graphicsData.points || shape.points.slice();
    var eps = graphicsGeometry.closePointEps;
    if (points.length === 0) {
      return;
    }
    var style = graphicsData.lineStyle;
    var firstPoint = new Point(points[0], points[1]);
    var lastPoint = new Point(points[points.length - 2], points[points.length - 1]);
    var closedShape = shape.type !== SHAPES.POLY || shape.closeStroke;
    var closedPath = Math.abs(firstPoint.x - lastPoint.x) < eps && Math.abs(firstPoint.y - lastPoint.y) < eps;
    if (closedShape) {
      points = points.slice();
      if (closedPath) {
        points.pop();
        points.pop();
        lastPoint.set(points[points.length - 2], points[points.length - 1]);
      }
      var midPointX = (firstPoint.x + lastPoint.x) * 0.5;
      var midPointY = (lastPoint.y + firstPoint.y) * 0.5;
      points.unshift(midPointX, midPointY);
      points.push(midPointX, midPointY);
    }
    var verts = graphicsGeometry.points;
    var length = points.length / 2;
    var indexCount = points.length;
    var indexStart = verts.length / 2;
    var width = style.width / 2;
    var widthSquared = width * width;
    var miterLimitSquared = style.miterLimit * style.miterLimit;
    var x0 = points[0];
    var y0 = points[1];
    var x1 = points[2];
    var y1 = points[3];
    var x2 = 0;
    var y2 = 0;
    var perpx = -(y0 - y1);
    var perpy = x0 - x1;
    var perp1x = 0;
    var perp1y = 0;
    var dist = Math.sqrt(perpx * perpx + perpy * perpy);
    perpx /= dist;
    perpy /= dist;
    perpx *= width;
    perpy *= width;
    var ratio = style.alignment;
    var innerWeight = (1 - ratio) * 2;
    var outerWeight = ratio * 2;
    if (!closedShape) {
      if (style.cap === LINE_CAP.ROUND) {
        indexCount += round(x0 - perpx * (innerWeight - outerWeight) * 0.5, y0 - perpy * (innerWeight - outerWeight) * 0.5, x0 - perpx * innerWeight, y0 - perpy * innerWeight, x0 + perpx * outerWeight, y0 + perpy * outerWeight, verts, true) + 2;
      } else if (style.cap === LINE_CAP.SQUARE) {
        indexCount += square(x0, y0, perpx, perpy, innerWeight, outerWeight, true, verts);
      }
    }
    verts.push(x0 - perpx * innerWeight, y0 - perpy * innerWeight);
    verts.push(x0 + perpx * outerWeight, y0 + perpy * outerWeight);
    for (var i = 1; i < length - 1; ++i) {
      x0 = points[(i - 1) * 2];
      y0 = points[(i - 1) * 2 + 1];
      x1 = points[i * 2];
      y1 = points[i * 2 + 1];
      x2 = points[(i + 1) * 2];
      y2 = points[(i + 1) * 2 + 1];
      perpx = -(y0 - y1);
      perpy = x0 - x1;
      dist = Math.sqrt(perpx * perpx + perpy * perpy);
      perpx /= dist;
      perpy /= dist;
      perpx *= width;
      perpy *= width;
      perp1x = -(y1 - y2);
      perp1y = x1 - x2;
      dist = Math.sqrt(perp1x * perp1x + perp1y * perp1y);
      perp1x /= dist;
      perp1y /= dist;
      perp1x *= width;
      perp1y *= width;
      var dx0 = x1 - x0;
      var dy0 = y0 - y1;
      var dx1 = x1 - x2;
      var dy1 = y2 - y1;
      var cross = dy0 * dx1 - dy1 * dx0;
      var clockwise = cross < 0;
      if (Math.abs(cross) < 0.1) {
        verts.push(x1 - perpx * innerWeight, y1 - perpy * innerWeight);
        verts.push(x1 + perpx * outerWeight, y1 + perpy * outerWeight);
        continue;
      }
      var c1 = (-perpx + x0) * (-perpy + y1) - (-perpx + x1) * (-perpy + y0);
      var c2 = (-perp1x + x2) * (-perp1y + y1) - (-perp1x + x1) * (-perp1y + y2);
      var px = (dx0 * c2 - dx1 * c1) / cross;
      var py = (dy1 * c1 - dy0 * c2) / cross;
      var pdist = (px - x1) * (px - x1) + (py - y1) * (py - y1);
      var imx = x1 + (px - x1) * innerWeight;
      var imy = y1 + (py - y1) * innerWeight;
      var omx = x1 - (px - x1) * outerWeight;
      var omy = y1 - (py - y1) * outerWeight;
      if (style.join === LINE_JOIN.BEVEL || pdist / widthSquared > miterLimitSquared) {
        if (clockwise) {
          verts.push(imx, imy);
          verts.push(x1 + perpx * outerWeight, y1 + perpy * outerWeight);
          verts.push(imx, imy);
          verts.push(x1 + perp1x * outerWeight, y1 + perp1y * outerWeight);
        } else {
          verts.push(x1 - perpx * innerWeight, y1 - perpy * innerWeight);
          verts.push(omx, omy);
          verts.push(x1 - perp1x * innerWeight, y1 - perp1y * innerWeight);
          verts.push(omx, omy);
        }
        indexCount += 2;
      } else if (style.join === LINE_JOIN.ROUND) {
        if (clockwise) {
          verts.push(imx, imy);
          verts.push(x1 + perpx * outerWeight, y1 + perpy * outerWeight);
          indexCount += round(x1, y1, x1 + perpx * outerWeight, y1 + perpy * outerWeight, x1 + perp1x * outerWeight, y1 + perp1y * outerWeight, verts, true) + 4;
          verts.push(imx, imy);
          verts.push(x1 + perp1x * outerWeight, y1 + perp1y * outerWeight);
        } else {
          verts.push(x1 - perpx * innerWeight, y1 - perpy * innerWeight);
          verts.push(omx, omy);
          indexCount += round(x1, y1, x1 - perpx * innerWeight, y1 - perpy * innerWeight, x1 - perp1x * innerWeight, y1 - perp1y * innerWeight, verts, false) + 4;
          verts.push(x1 - perp1x * innerWeight, y1 - perp1y * innerWeight);
          verts.push(omx, omy);
        }
      } else {
        verts.push(imx, imy);
        verts.push(omx, omy);
      }
    }
    x0 = points[(length - 2) * 2];
    y0 = points[(length - 2) * 2 + 1];
    x1 = points[(length - 1) * 2];
    y1 = points[(length - 1) * 2 + 1];
    perpx = -(y0 - y1);
    perpy = x0 - x1;
    dist = Math.sqrt(perpx * perpx + perpy * perpy);
    perpx /= dist;
    perpy /= dist;
    perpx *= width;
    perpy *= width;
    verts.push(x1 - perpx * innerWeight, y1 - perpy * innerWeight);
    verts.push(x1 + perpx * outerWeight, y1 + perpy * outerWeight);
    if (!closedShape) {
      if (style.cap === LINE_CAP.ROUND) {
        indexCount += round(x1 - perpx * (innerWeight - outerWeight) * 0.5, y1 - perpy * (innerWeight - outerWeight) * 0.5, x1 - perpx * innerWeight, y1 - perpy * innerWeight, x1 + perpx * outerWeight, y1 + perpy * outerWeight, verts, false) + 2;
      } else if (style.cap === LINE_CAP.SQUARE) {
        indexCount += square(x1, y1, perpx, perpy, innerWeight, outerWeight, false, verts);
      }
    }
    var indices2 = graphicsGeometry.indices;
    var eps2 = GRAPHICS_CURVES.epsilon * GRAPHICS_CURVES.epsilon;
    for (var i = indexStart; i < indexCount + indexStart - 2; ++i) {
      x0 = verts[i * 2];
      y0 = verts[i * 2 + 1];
      x1 = verts[(i + 1) * 2];
      y1 = verts[(i + 1) * 2 + 1];
      x2 = verts[(i + 2) * 2];
      y2 = verts[(i + 2) * 2 + 1];
      if (Math.abs(x0 * (y1 - y2) + x1 * (y2 - y0) + x2 * (y0 - y1)) < eps2) {
        continue;
      }
      indices2.push(i, i + 1, i + 2);
    }
  }
  function buildNativeLine(graphicsData, graphicsGeometry) {
    var i = 0;
    var shape = graphicsData.shape;
    var points = graphicsData.points || shape.points;
    var closedShape = shape.type !== SHAPES.POLY || shape.closeStroke;
    if (points.length === 0) {
      return;
    }
    var verts = graphicsGeometry.points;
    var indices2 = graphicsGeometry.indices;
    var length = points.length / 2;
    var startIndex = verts.length / 2;
    var currentIndex = startIndex;
    verts.push(points[0], points[1]);
    for (i = 1; i < length; i++) {
      verts.push(points[i * 2], points[i * 2 + 1]);
      indices2.push(currentIndex, currentIndex + 1);
      currentIndex++;
    }
    if (closedShape) {
      indices2.push(currentIndex, startIndex);
    }
  }
  function buildLine(graphicsData, graphicsGeometry) {
    if (graphicsData.lineStyle.native) {
      buildNativeLine(graphicsData, graphicsGeometry);
    } else {
      buildNonNativeLine(graphicsData, graphicsGeometry);
    }
  }
  var Star = function(_super) {
    __extends6(Star2, _super);
    function Star2(x, y, points, radius2, innerRadius, rotation) {
      if (rotation === void 0) {
        rotation = 0;
      }
      var _this = this;
      innerRadius = innerRadius || radius2 / 2;
      var startAngle = -1 * Math.PI / 2 + rotation;
      var len = points * 2;
      var delta = PI_2 / len;
      var polygon = [];
      for (var i = 0; i < len; i++) {
        var r = i % 2 ? innerRadius : radius2;
        var angle = i * delta + startAngle;
        polygon.push(x + r * Math.cos(angle), y + r * Math.sin(angle));
      }
      _this = _super.call(this, polygon) || this;
      return _this;
    }
    return Star2;
  }(Polygon);
  var ArcUtils = function() {
    function ArcUtils2() {
    }
    ArcUtils2.curveTo = function(x1, y1, x2, y2, radius2, points) {
      var fromX = points[points.length - 2];
      var fromY = points[points.length - 1];
      var a1 = fromY - y1;
      var b1 = fromX - x1;
      var a2 = y2 - y1;
      var b2 = x2 - x1;
      var mm = Math.abs(a1 * b2 - b1 * a2);
      if (mm < 1e-8 || radius2 === 0) {
        if (points[points.length - 2] !== x1 || points[points.length - 1] !== y1) {
          points.push(x1, y1);
        }
        return null;
      }
      var dd = a1 * a1 + b1 * b1;
      var cc = a2 * a2 + b2 * b2;
      var tt = a1 * a2 + b1 * b2;
      var k1 = radius2 * Math.sqrt(dd) / mm;
      var k2 = radius2 * Math.sqrt(cc) / mm;
      var j1 = k1 * tt / dd;
      var j2 = k2 * tt / cc;
      var cx = k1 * b2 + k2 * b1;
      var cy = k1 * a2 + k2 * a1;
      var px = b1 * (k2 + j1);
      var py = a1 * (k2 + j1);
      var qx = b2 * (k1 + j2);
      var qy = a2 * (k1 + j2);
      var startAngle = Math.atan2(py - cy, px - cx);
      var endAngle = Math.atan2(qy - cy, qx - cx);
      return {
        cx: cx + x1,
        cy: cy + y1,
        radius: radius2,
        startAngle,
        endAngle,
        anticlockwise: b1 * a2 > b2 * a1
      };
    };
    ArcUtils2.arc = function(_startX, _startY, cx, cy, radius2, startAngle, endAngle, _anticlockwise, points) {
      var sweep = endAngle - startAngle;
      var n = GRAPHICS_CURVES._segmentsCount(Math.abs(sweep) * radius2, Math.ceil(Math.abs(sweep) / PI_2) * 40);
      var theta = sweep / (n * 2);
      var theta2 = theta * 2;
      var cTheta = Math.cos(theta);
      var sTheta = Math.sin(theta);
      var segMinus = n - 1;
      var remainder = segMinus % 1 / segMinus;
      for (var i = 0; i <= segMinus; ++i) {
        var real = i + remainder * i;
        var angle = theta + startAngle + theta2 * real;
        var c = Math.cos(angle);
        var s = -Math.sin(angle);
        points.push((cTheta * c + sTheta * s) * radius2 + cx, (cTheta * -s + sTheta * c) * radius2 + cy);
      }
    };
    return ArcUtils2;
  }();
  var BezierUtils = function() {
    function BezierUtils2() {
    }
    BezierUtils2.curveLength = function(fromX, fromY, cpX, cpY, cpX2, cpY2, toX, toY) {
      var n = 10;
      var result = 0;
      var t = 0;
      var t2 = 0;
      var t3 = 0;
      var nt = 0;
      var nt2 = 0;
      var nt3 = 0;
      var x = 0;
      var y = 0;
      var dx = 0;
      var dy = 0;
      var prevX = fromX;
      var prevY = fromY;
      for (var i = 1; i <= n; ++i) {
        t = i / n;
        t2 = t * t;
        t3 = t2 * t;
        nt = 1 - t;
        nt2 = nt * nt;
        nt3 = nt2 * nt;
        x = nt3 * fromX + 3 * nt2 * t * cpX + 3 * nt * t2 * cpX2 + t3 * toX;
        y = nt3 * fromY + 3 * nt2 * t * cpY + 3 * nt * t2 * cpY2 + t3 * toY;
        dx = prevX - x;
        dy = prevY - y;
        prevX = x;
        prevY = y;
        result += Math.sqrt(dx * dx + dy * dy);
      }
      return result;
    };
    BezierUtils2.curveTo = function(cpX, cpY, cpX2, cpY2, toX, toY, points) {
      var fromX = points[points.length - 2];
      var fromY = points[points.length - 1];
      points.length -= 2;
      var n = GRAPHICS_CURVES._segmentsCount(BezierUtils2.curveLength(fromX, fromY, cpX, cpY, cpX2, cpY2, toX, toY));
      var dt = 0;
      var dt2 = 0;
      var dt3 = 0;
      var t2 = 0;
      var t3 = 0;
      points.push(fromX, fromY);
      for (var i = 1, j = 0; i <= n; ++i) {
        j = i / n;
        dt = 1 - j;
        dt2 = dt * dt;
        dt3 = dt2 * dt;
        t2 = j * j;
        t3 = t2 * j;
        points.push(dt3 * fromX + 3 * dt2 * j * cpX + 3 * dt * t2 * cpX2 + t3 * toX, dt3 * fromY + 3 * dt2 * j * cpY + 3 * dt * t2 * cpY2 + t3 * toY);
      }
    };
    return BezierUtils2;
  }();
  var QuadraticUtils = function() {
    function QuadraticUtils2() {
    }
    QuadraticUtils2.curveLength = function(fromX, fromY, cpX, cpY, toX, toY) {
      var ax = fromX - 2 * cpX + toX;
      var ay = fromY - 2 * cpY + toY;
      var bx = 2 * cpX - 2 * fromX;
      var by = 2 * cpY - 2 * fromY;
      var a = 4 * (ax * ax + ay * ay);
      var b = 4 * (ax * bx + ay * by);
      var c = bx * bx + by * by;
      var s = 2 * Math.sqrt(a + b + c);
      var a2 = Math.sqrt(a);
      var a32 = 2 * a * a2;
      var c2 = 2 * Math.sqrt(c);
      var ba = b / a2;
      return (a32 * s + a2 * b * (s - c2) + (4 * c * a - b * b) * Math.log((2 * a2 + ba + s) / (ba + c2))) / (4 * a32);
    };
    QuadraticUtils2.curveTo = function(cpX, cpY, toX, toY, points) {
      var fromX = points[points.length - 2];
      var fromY = points[points.length - 1];
      var n = GRAPHICS_CURVES._segmentsCount(QuadraticUtils2.curveLength(fromX, fromY, cpX, cpY, toX, toY));
      var xa = 0;
      var ya = 0;
      for (var i = 1; i <= n; ++i) {
        var j = i / n;
        xa = fromX + (cpX - fromX) * j;
        ya = fromY + (cpY - fromY) * j;
        points.push(xa + (cpX + (toX - cpX) * j - xa) * j, ya + (cpY + (toY - cpY) * j - ya) * j);
      }
    };
    return QuadraticUtils2;
  }();
  var BatchPart = function() {
    function BatchPart2() {
      this.reset();
    }
    BatchPart2.prototype.begin = function(style, startIndex, attribStart) {
      this.reset();
      this.style = style;
      this.start = startIndex;
      this.attribStart = attribStart;
    };
    BatchPart2.prototype.end = function(endIndex, endAttrib) {
      this.attribSize = endAttrib - this.attribStart;
      this.size = endIndex - this.start;
    };
    BatchPart2.prototype.reset = function() {
      this.style = null;
      this.size = 0;
      this.start = 0;
      this.attribStart = 0;
      this.attribSize = 0;
    };
    return BatchPart2;
  }();
  var _a;
  var FILL_COMMANDS = (_a = {}, _a[SHAPES.POLY] = buildPoly, _a[SHAPES.CIRC] = buildCircle, _a[SHAPES.ELIP] = buildCircle, _a[SHAPES.RECT] = buildRectangle, _a[SHAPES.RREC] = buildRoundedRectangle, _a);
  var BATCH_POOL = [];
  var DRAW_CALL_POOL = [];
  var GraphicsData = function() {
    function GraphicsData2(shape, fillStyle, lineStyle, matrix) {
      if (fillStyle === void 0) {
        fillStyle = null;
      }
      if (lineStyle === void 0) {
        lineStyle = null;
      }
      if (matrix === void 0) {
        matrix = null;
      }
      this.shape = shape;
      this.lineStyle = lineStyle;
      this.fillStyle = fillStyle;
      this.matrix = matrix;
      this.type = shape.type;
      this.points = [];
      this.holes = [];
    }
    GraphicsData2.prototype.clone = function() {
      return new GraphicsData2(this.shape, this.fillStyle, this.lineStyle, this.matrix);
    };
    GraphicsData2.prototype.destroy = function() {
      this.shape = null;
      this.holes.length = 0;
      this.holes = null;
      this.points.length = 0;
      this.points = null;
      this.lineStyle = null;
      this.fillStyle = null;
    };
    return GraphicsData2;
  }();
  var tmpPoint = new Point();
  var tmpBounds = new Bounds();
  var GraphicsGeometry = function(_super) {
    __extends6(GraphicsGeometry2, _super);
    function GraphicsGeometry2() {
      var _this = _super.call(this) || this;
      _this.uvsFloat32 = null;
      _this.indicesUint16 = null;
      _this.points = [];
      _this.colors = [];
      _this.uvs = [];
      _this.indices = [];
      _this.textureIds = [];
      _this.graphicsData = [];
      _this.dirty = 0;
      _this.batchDirty = -1;
      _this.cacheDirty = -1;
      _this.clearDirty = 0;
      _this.drawCalls = [];
      _this.batches = [];
      _this.shapeIndex = 0;
      _this._bounds = new Bounds();
      _this.boundsDirty = -1;
      _this.boundsPadding = 0;
      _this.batchable = false;
      _this.indicesUint16 = null;
      _this.uvsFloat32 = null;
      _this.closePointEps = 1e-4;
      return _this;
    }
    Object.defineProperty(GraphicsGeometry2.prototype, "bounds", {
      get: function() {
        if (this.boundsDirty !== this.dirty) {
          this.boundsDirty = this.dirty;
          this.calculateBounds();
        }
        return this._bounds;
      },
      enumerable: false,
      configurable: true
    });
    GraphicsGeometry2.prototype.invalidate = function() {
      this.boundsDirty = -1;
      this.dirty++;
      this.batchDirty++;
      this.shapeIndex = 0;
      this.points.length = 0;
      this.colors.length = 0;
      this.uvs.length = 0;
      this.indices.length = 0;
      this.textureIds.length = 0;
      for (var i = 0; i < this.drawCalls.length; i++) {
        this.drawCalls[i].texArray.clear();
        DRAW_CALL_POOL.push(this.drawCalls[i]);
      }
      this.drawCalls.length = 0;
      for (var i = 0; i < this.batches.length; i++) {
        var batchPart = this.batches[i];
        batchPart.reset();
        BATCH_POOL.push(batchPart);
      }
      this.batches.length = 0;
    };
    GraphicsGeometry2.prototype.clear = function() {
      if (this.graphicsData.length > 0) {
        this.invalidate();
        this.clearDirty++;
        this.graphicsData.length = 0;
      }
      return this;
    };
    GraphicsGeometry2.prototype.drawShape = function(shape, fillStyle, lineStyle, matrix) {
      if (fillStyle === void 0) {
        fillStyle = null;
      }
      if (lineStyle === void 0) {
        lineStyle = null;
      }
      if (matrix === void 0) {
        matrix = null;
      }
      var data = new GraphicsData(shape, fillStyle, lineStyle, matrix);
      this.graphicsData.push(data);
      this.dirty++;
      return this;
    };
    GraphicsGeometry2.prototype.drawHole = function(shape, matrix) {
      if (matrix === void 0) {
        matrix = null;
      }
      if (!this.graphicsData.length) {
        return null;
      }
      var data = new GraphicsData(shape, null, null, matrix);
      var lastShape = this.graphicsData[this.graphicsData.length - 1];
      data.lineStyle = lastShape.lineStyle;
      lastShape.holes.push(data);
      this.dirty++;
      return this;
    };
    GraphicsGeometry2.prototype.destroy = function() {
      _super.prototype.destroy.call(this);
      for (var i = 0; i < this.graphicsData.length; ++i) {
        this.graphicsData[i].destroy();
      }
      this.points.length = 0;
      this.points = null;
      this.colors.length = 0;
      this.colors = null;
      this.uvs.length = 0;
      this.uvs = null;
      this.indices.length = 0;
      this.indices = null;
      this.indexBuffer.destroy();
      this.indexBuffer = null;
      this.graphicsData.length = 0;
      this.graphicsData = null;
      this.drawCalls.length = 0;
      this.drawCalls = null;
      this.batches.length = 0;
      this.batches = null;
      this._bounds = null;
    };
    GraphicsGeometry2.prototype.containsPoint = function(point) {
      var graphicsData = this.graphicsData;
      for (var i = 0; i < graphicsData.length; ++i) {
        var data = graphicsData[i];
        if (!data.fillStyle.visible) {
          continue;
        }
        if (data.shape) {
          if (data.matrix) {
            data.matrix.applyInverse(point, tmpPoint);
          } else {
            tmpPoint.copyFrom(point);
          }
          if (data.shape.contains(tmpPoint.x, tmpPoint.y)) {
            var hitHole = false;
            if (data.holes) {
              for (var i_1 = 0; i_1 < data.holes.length; i_1++) {
                var hole = data.holes[i_1];
                if (hole.shape.contains(tmpPoint.x, tmpPoint.y)) {
                  hitHole = true;
                  break;
                }
              }
            }
            if (!hitHole) {
              return true;
            }
          }
        }
      }
      return false;
    };
    GraphicsGeometry2.prototype.updateBatches = function(allow32Indices) {
      if (!this.graphicsData.length) {
        this.batchable = true;
        return;
      }
      if (!this.validateBatching()) {
        return;
      }
      this.cacheDirty = this.dirty;
      var uvs = this.uvs;
      var graphicsData = this.graphicsData;
      var batchPart = null;
      var currentStyle = null;
      if (this.batches.length > 0) {
        batchPart = this.batches[this.batches.length - 1];
        currentStyle = batchPart.style;
      }
      for (var i = this.shapeIndex; i < graphicsData.length; i++) {
        this.shapeIndex++;
        var data = graphicsData[i];
        var fillStyle = data.fillStyle;
        var lineStyle = data.lineStyle;
        var command = FILL_COMMANDS[data.type];
        command.build(data);
        if (data.matrix) {
          this.transformPoints(data.points, data.matrix);
        }
        for (var j = 0; j < 2; j++) {
          var style = j === 0 ? fillStyle : lineStyle;
          if (!style.visible) {
            continue;
          }
          var nextTexture = style.texture.baseTexture;
          var index_1 = this.indices.length;
          var attribIndex = this.points.length / 2;
          nextTexture.wrapMode = WRAP_MODES.REPEAT;
          if (j === 0) {
            this.processFill(data);
          } else {
            this.processLine(data);
          }
          var size2 = this.points.length / 2 - attribIndex;
          if (size2 === 0) {
            continue;
          }
          if (batchPart && !this._compareStyles(currentStyle, style)) {
            batchPart.end(index_1, attribIndex);
            batchPart = null;
          }
          if (!batchPart) {
            batchPart = BATCH_POOL.pop() || new BatchPart();
            batchPart.begin(style, index_1, attribIndex);
            this.batches.push(batchPart);
            currentStyle = style;
          }
          this.addUvs(this.points, uvs, style.texture, attribIndex, size2, style.matrix);
        }
      }
      var index2 = this.indices.length;
      var attrib = this.points.length / 2;
      if (batchPart) {
        batchPart.end(index2, attrib);
      }
      if (this.batches.length === 0) {
        this.batchable = true;
        return;
      }
      if (this.indicesUint16 && this.indices.length === this.indicesUint16.length) {
        this.indicesUint16.set(this.indices);
      } else {
        var need32 = attrib > 65535 && allow32Indices;
        this.indicesUint16 = need32 ? new Uint32Array(this.indices) : new Uint16Array(this.indices);
      }
      this.batchable = this.isBatchable();
      if (this.batchable) {
        this.packBatches();
      } else {
        this.buildDrawCalls();
      }
    };
    GraphicsGeometry2.prototype._compareStyles = function(styleA, styleB) {
      if (!styleA || !styleB) {
        return false;
      }
      if (styleA.texture.baseTexture !== styleB.texture.baseTexture) {
        return false;
      }
      if (styleA.color + styleA.alpha !== styleB.color + styleB.alpha) {
        return false;
      }
      if (!!styleA.native !== !!styleB.native) {
        return false;
      }
      return true;
    };
    GraphicsGeometry2.prototype.validateBatching = function() {
      if (this.dirty === this.cacheDirty || !this.graphicsData.length) {
        return false;
      }
      for (var i = 0, l = this.graphicsData.length; i < l; i++) {
        var data = this.graphicsData[i];
        var fill = data.fillStyle;
        var line = data.lineStyle;
        if (fill && !fill.texture.baseTexture.valid) {
          return false;
        }
        if (line && !line.texture.baseTexture.valid) {
          return false;
        }
      }
      return true;
    };
    GraphicsGeometry2.prototype.packBatches = function() {
      this.batchDirty++;
      this.uvsFloat32 = new Float32Array(this.uvs);
      var batches = this.batches;
      for (var i = 0, l = batches.length; i < l; i++) {
        var batch = batches[i];
        for (var j = 0; j < batch.size; j++) {
          var index2 = batch.start + j;
          this.indicesUint16[index2] = this.indicesUint16[index2] - batch.attribStart;
        }
      }
    };
    GraphicsGeometry2.prototype.isBatchable = function() {
      if (this.points.length > 65535 * 2) {
        return false;
      }
      var batches = this.batches;
      for (var i = 0; i < batches.length; i++) {
        if (batches[i].style.native) {
          return false;
        }
      }
      return this.points.length < GraphicsGeometry2.BATCHABLE_SIZE * 2;
    };
    GraphicsGeometry2.prototype.buildDrawCalls = function() {
      var TICK = ++BaseTexture._globalBatch;
      for (var i = 0; i < this.drawCalls.length; i++) {
        this.drawCalls[i].texArray.clear();
        DRAW_CALL_POOL.push(this.drawCalls[i]);
      }
      this.drawCalls.length = 0;
      var colors2 = this.colors;
      var textureIds = this.textureIds;
      var currentGroup = DRAW_CALL_POOL.pop();
      if (!currentGroup) {
        currentGroup = new BatchDrawCall();
        currentGroup.texArray = new BatchTextureArray();
      }
      currentGroup.texArray.count = 0;
      currentGroup.start = 0;
      currentGroup.size = 0;
      currentGroup.type = DRAW_MODES.TRIANGLES;
      var textureCount = 0;
      var currentTexture = null;
      var textureId = 0;
      var native = false;
      var drawMode = DRAW_MODES.TRIANGLES;
      var index2 = 0;
      this.drawCalls.push(currentGroup);
      for (var i = 0; i < this.batches.length; i++) {
        var data = this.batches[i];
        var MAX_TEXTURES = 8;
        var style = data.style;
        var nextTexture = style.texture.baseTexture;
        if (native !== !!style.native) {
          native = !!style.native;
          drawMode = native ? DRAW_MODES.LINES : DRAW_MODES.TRIANGLES;
          currentTexture = null;
          textureCount = MAX_TEXTURES;
          TICK++;
        }
        if (currentTexture !== nextTexture) {
          currentTexture = nextTexture;
          if (nextTexture._batchEnabled !== TICK) {
            if (textureCount === MAX_TEXTURES) {
              TICK++;
              textureCount = 0;
              if (currentGroup.size > 0) {
                currentGroup = DRAW_CALL_POOL.pop();
                if (!currentGroup) {
                  currentGroup = new BatchDrawCall();
                  currentGroup.texArray = new BatchTextureArray();
                }
                this.drawCalls.push(currentGroup);
              }
              currentGroup.start = index2;
              currentGroup.size = 0;
              currentGroup.texArray.count = 0;
              currentGroup.type = drawMode;
            }
            nextTexture.touched = 1;
            nextTexture._batchEnabled = TICK;
            nextTexture._batchLocation = textureCount;
            nextTexture.wrapMode = 10497;
            currentGroup.texArray.elements[currentGroup.texArray.count++] = nextTexture;
            textureCount++;
          }
        }
        currentGroup.size += data.size;
        index2 += data.size;
        textureId = nextTexture._batchLocation;
        this.addColors(colors2, style.color, style.alpha, data.attribSize);
        this.addTextureIds(textureIds, textureId, data.attribSize);
      }
      BaseTexture._globalBatch = TICK;
      this.packAttributes();
    };
    GraphicsGeometry2.prototype.packAttributes = function() {
      var verts = this.points;
      var uvs = this.uvs;
      var colors2 = this.colors;
      var textureIds = this.textureIds;
      var glPoints = new ArrayBuffer(verts.length * 3 * 4);
      var f32 = new Float32Array(glPoints);
      var u32 = new Uint32Array(glPoints);
      var p = 0;
      for (var i = 0; i < verts.length / 2; i++) {
        f32[p++] = verts[i * 2];
        f32[p++] = verts[i * 2 + 1];
        f32[p++] = uvs[i * 2];
        f32[p++] = uvs[i * 2 + 1];
        u32[p++] = colors2[i];
        f32[p++] = textureIds[i];
      }
      this._buffer.update(glPoints);
      this._indexBuffer.update(this.indicesUint16);
    };
    GraphicsGeometry2.prototype.processFill = function(data) {
      if (data.holes.length) {
        this.processHoles(data.holes);
        buildPoly.triangulate(data, this);
      } else {
        var command = FILL_COMMANDS[data.type];
        command.triangulate(data, this);
      }
    };
    GraphicsGeometry2.prototype.processLine = function(data) {
      buildLine(data, this);
      for (var i = 0; i < data.holes.length; i++) {
        buildLine(data.holes[i], this);
      }
    };
    GraphicsGeometry2.prototype.processHoles = function(holes) {
      for (var i = 0; i < holes.length; i++) {
        var hole = holes[i];
        var command = FILL_COMMANDS[hole.type];
        command.build(hole);
        if (hole.matrix) {
          this.transformPoints(hole.points, hole.matrix);
        }
      }
    };
    GraphicsGeometry2.prototype.calculateBounds = function() {
      var bounds = this._bounds;
      var sequenceBounds = tmpBounds;
      var curMatrix = Matrix.IDENTITY;
      this._bounds.clear();
      sequenceBounds.clear();
      for (var i = 0; i < this.graphicsData.length; i++) {
        var data = this.graphicsData[i];
        var shape = data.shape;
        var type = data.type;
        var lineStyle = data.lineStyle;
        var nextMatrix = data.matrix || Matrix.IDENTITY;
        var lineWidth = 0;
        if (lineStyle && lineStyle.visible) {
          var alignment = lineStyle.alignment;
          lineWidth = lineStyle.width;
          if (type === SHAPES.POLY) {
            lineWidth = lineWidth * (0.5 + Math.abs(0.5 - alignment));
          } else {
            lineWidth = lineWidth * Math.max(0, alignment);
          }
        }
        if (curMatrix !== nextMatrix) {
          if (!sequenceBounds.isEmpty()) {
            bounds.addBoundsMatrix(sequenceBounds, curMatrix);
            sequenceBounds.clear();
          }
          curMatrix = nextMatrix;
        }
        if (type === SHAPES.RECT || type === SHAPES.RREC) {
          var rect = shape;
          sequenceBounds.addFramePad(rect.x, rect.y, rect.x + rect.width, rect.y + rect.height, lineWidth, lineWidth);
        } else if (type === SHAPES.CIRC) {
          var circle = shape;
          sequenceBounds.addFramePad(circle.x, circle.y, circle.x, circle.y, circle.radius + lineWidth, circle.radius + lineWidth);
        } else if (type === SHAPES.ELIP) {
          var ellipse = shape;
          sequenceBounds.addFramePad(ellipse.x, ellipse.y, ellipse.x, ellipse.y, ellipse.width + lineWidth, ellipse.height + lineWidth);
        } else {
          var poly = shape;
          bounds.addVerticesMatrix(curMatrix, poly.points, 0, poly.points.length, lineWidth, lineWidth);
        }
      }
      if (!sequenceBounds.isEmpty()) {
        bounds.addBoundsMatrix(sequenceBounds, curMatrix);
      }
      bounds.pad(this.boundsPadding, this.boundsPadding);
    };
    GraphicsGeometry2.prototype.transformPoints = function(points, matrix) {
      for (var i = 0; i < points.length / 2; i++) {
        var x = points[i * 2];
        var y = points[i * 2 + 1];
        points[i * 2] = matrix.a * x + matrix.c * y + matrix.tx;
        points[i * 2 + 1] = matrix.b * x + matrix.d * y + matrix.ty;
      }
    };
    GraphicsGeometry2.prototype.addColors = function(colors2, color, alpha, size2) {
      var rgb = (color >> 16) + (color & 65280) + ((color & 255) << 16);
      var rgba = premultiplyTint(rgb, alpha);
      while (size2-- > 0) {
        colors2.push(rgba);
      }
    };
    GraphicsGeometry2.prototype.addTextureIds = function(textureIds, id, size2) {
      while (size2-- > 0) {
        textureIds.push(id);
      }
    };
    GraphicsGeometry2.prototype.addUvs = function(verts, uvs, texture, start, size2, matrix) {
      if (matrix === void 0) {
        matrix = null;
      }
      var index2 = 0;
      var uvsStart = uvs.length;
      var frame = texture.frame;
      while (index2 < size2) {
        var x = verts[(start + index2) * 2];
        var y = verts[(start + index2) * 2 + 1];
        if (matrix) {
          var nx = matrix.a * x + matrix.c * y + matrix.tx;
          y = matrix.b * x + matrix.d * y + matrix.ty;
          x = nx;
        }
        index2++;
        uvs.push(x / frame.width, y / frame.height);
      }
      var baseTexture = texture.baseTexture;
      if (frame.width < baseTexture.width || frame.height < baseTexture.height) {
        this.adjustUvs(uvs, texture, uvsStart, size2);
      }
    };
    GraphicsGeometry2.prototype.adjustUvs = function(uvs, texture, start, size2) {
      var baseTexture = texture.baseTexture;
      var eps = 1e-6;
      var finish = start + size2 * 2;
      var frame = texture.frame;
      var scaleX = frame.width / baseTexture.width;
      var scaleY = frame.height / baseTexture.height;
      var offsetX = frame.x / frame.width;
      var offsetY = frame.y / frame.height;
      var minX = Math.floor(uvs[start] + eps);
      var minY = Math.floor(uvs[start + 1] + eps);
      for (var i = start + 2; i < finish; i += 2) {
        minX = Math.min(minX, Math.floor(uvs[i] + eps));
        minY = Math.min(minY, Math.floor(uvs[i + 1] + eps));
      }
      offsetX -= minX;
      offsetY -= minY;
      for (var i = start; i < finish; i += 2) {
        uvs[i] = (uvs[i] + offsetX) * scaleX;
        uvs[i + 1] = (uvs[i + 1] + offsetY) * scaleY;
      }
    };
    GraphicsGeometry2.BATCHABLE_SIZE = 100;
    return GraphicsGeometry2;
  }(BatchGeometry);
  var LineStyle = function(_super) {
    __extends6(LineStyle2, _super);
    function LineStyle2() {
      var _this = _super !== null && _super.apply(this, arguments) || this;
      _this.width = 0;
      _this.alignment = 0.5;
      _this.native = false;
      _this.cap = LINE_CAP.BUTT;
      _this.join = LINE_JOIN.MITER;
      _this.miterLimit = 10;
      return _this;
    }
    LineStyle2.prototype.clone = function() {
      var obj = new LineStyle2();
      obj.color = this.color;
      obj.alpha = this.alpha;
      obj.texture = this.texture;
      obj.matrix = this.matrix;
      obj.visible = this.visible;
      obj.width = this.width;
      obj.alignment = this.alignment;
      obj.native = this.native;
      obj.cap = this.cap;
      obj.join = this.join;
      obj.miterLimit = this.miterLimit;
      return obj;
    };
    LineStyle2.prototype.reset = function() {
      _super.prototype.reset.call(this);
      this.color = 0;
      this.alignment = 0.5;
      this.width = 0;
      this.native = false;
    };
    return LineStyle2;
  }(FillStyle);
  var temp = new Float32Array(3);
  var DEFAULT_SHADERS = {};
  var Graphics = function(_super) {
    __extends6(Graphics2, _super);
    function Graphics2(geometry) {
      if (geometry === void 0) {
        geometry = null;
      }
      var _this = _super.call(this) || this;
      _this._geometry = geometry || new GraphicsGeometry();
      _this._geometry.refCount++;
      _this.shader = null;
      _this.state = State.for2d();
      _this._fillStyle = new FillStyle();
      _this._lineStyle = new LineStyle();
      _this._matrix = null;
      _this._holeMode = false;
      _this.currentPath = null;
      _this.batches = [];
      _this.batchTint = -1;
      _this.batchDirty = -1;
      _this.vertexData = null;
      _this.pluginName = "batch";
      _this._transformID = -1;
      _this.tint = 16777215;
      _this.blendMode = BLEND_MODES.NORMAL;
      return _this;
    }
    Object.defineProperty(Graphics2.prototype, "geometry", {
      get: function() {
        return this._geometry;
      },
      enumerable: false,
      configurable: true
    });
    Graphics2.prototype.clone = function() {
      this.finishPoly();
      return new Graphics2(this._geometry);
    };
    Object.defineProperty(Graphics2.prototype, "blendMode", {
      get: function() {
        return this.state.blendMode;
      },
      set: function(value) {
        this.state.blendMode = value;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Graphics2.prototype, "tint", {
      get: function() {
        return this._tint;
      },
      set: function(value) {
        this._tint = value;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Graphics2.prototype, "fill", {
      get: function() {
        return this._fillStyle;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Graphics2.prototype, "line", {
      get: function() {
        return this._lineStyle;
      },
      enumerable: false,
      configurable: true
    });
    Graphics2.prototype.lineStyle = function(options) {
      if (options === void 0) {
        options = null;
      }
      if (typeof options === "number") {
        var args = arguments;
        options = {
          width: args[0] || 0,
          color: args[1] || 0,
          alpha: args[2] !== void 0 ? args[2] : 1,
          alignment: args[3] !== void 0 ? args[3] : 0.5,
          native: !!args[4]
        };
      }
      return this.lineTextureStyle(options);
    };
    Graphics2.prototype.lineTextureStyle = function(options) {
      if (typeof options === "number") {
        deprecation("v5.2.0", "Please use object-based options for Graphics#lineTextureStyle");
        var _a2 = arguments, width = _a2[0], texture = _a2[1], color = _a2[2], alpha = _a2[3], matrix = _a2[4], alignment = _a2[5], native = _a2[6];
        options = {width, texture, color, alpha, matrix, alignment, native};
        Object.keys(options).forEach(function(key) {
          return options[key] === void 0 && delete options[key];
        });
      }
      options = Object.assign({
        width: 0,
        texture: Texture.WHITE,
        color: options && options.texture ? 16777215 : 0,
        alpha: 1,
        matrix: null,
        alignment: 0.5,
        native: false,
        cap: LINE_CAP.BUTT,
        join: LINE_JOIN.MITER,
        miterLimit: 10
      }, options);
      if (this.currentPath) {
        this.startPoly();
      }
      var visible = options.width > 0 && options.alpha > 0;
      if (!visible) {
        this._lineStyle.reset();
      } else {
        if (options.matrix) {
          options.matrix = options.matrix.clone();
          options.matrix.invert();
        }
        Object.assign(this._lineStyle, {visible}, options);
      }
      return this;
    };
    Graphics2.prototype.startPoly = function() {
      if (this.currentPath) {
        var points = this.currentPath.points;
        var len = this.currentPath.points.length;
        if (len > 2) {
          this.drawShape(this.currentPath);
          this.currentPath = new Polygon();
          this.currentPath.closeStroke = false;
          this.currentPath.points.push(points[len - 2], points[len - 1]);
        }
      } else {
        this.currentPath = new Polygon();
        this.currentPath.closeStroke = false;
      }
    };
    Graphics2.prototype.finishPoly = function() {
      if (this.currentPath) {
        if (this.currentPath.points.length > 2) {
          this.drawShape(this.currentPath);
          this.currentPath = null;
        } else {
          this.currentPath.points.length = 0;
        }
      }
    };
    Graphics2.prototype.moveTo = function(x, y) {
      this.startPoly();
      this.currentPath.points[0] = x;
      this.currentPath.points[1] = y;
      return this;
    };
    Graphics2.prototype.lineTo = function(x, y) {
      if (!this.currentPath) {
        this.moveTo(0, 0);
      }
      var points = this.currentPath.points;
      var fromX = points[points.length - 2];
      var fromY = points[points.length - 1];
      if (fromX !== x || fromY !== y) {
        points.push(x, y);
      }
      return this;
    };
    Graphics2.prototype._initCurve = function(x, y) {
      if (x === void 0) {
        x = 0;
      }
      if (y === void 0) {
        y = 0;
      }
      if (this.currentPath) {
        if (this.currentPath.points.length === 0) {
          this.currentPath.points = [x, y];
        }
      } else {
        this.moveTo(x, y);
      }
    };
    Graphics2.prototype.quadraticCurveTo = function(cpX, cpY, toX, toY) {
      this._initCurve();
      var points = this.currentPath.points;
      if (points.length === 0) {
        this.moveTo(0, 0);
      }
      QuadraticUtils.curveTo(cpX, cpY, toX, toY, points);
      return this;
    };
    Graphics2.prototype.bezierCurveTo = function(cpX, cpY, cpX2, cpY2, toX, toY) {
      this._initCurve();
      BezierUtils.curveTo(cpX, cpY, cpX2, cpY2, toX, toY, this.currentPath.points);
      return this;
    };
    Graphics2.prototype.arcTo = function(x1, y1, x2, y2, radius2) {
      this._initCurve(x1, y1);
      var points = this.currentPath.points;
      var result = ArcUtils.curveTo(x1, y1, x2, y2, radius2, points);
      if (result) {
        var cx = result.cx, cy = result.cy, radius_1 = result.radius, startAngle = result.startAngle, endAngle = result.endAngle, anticlockwise = result.anticlockwise;
        this.arc(cx, cy, radius_1, startAngle, endAngle, anticlockwise);
      }
      return this;
    };
    Graphics2.prototype.arc = function(cx, cy, radius2, startAngle, endAngle, anticlockwise) {
      if (anticlockwise === void 0) {
        anticlockwise = false;
      }
      if (startAngle === endAngle) {
        return this;
      }
      if (!anticlockwise && endAngle <= startAngle) {
        endAngle += PI_2;
      } else if (anticlockwise && startAngle <= endAngle) {
        startAngle += PI_2;
      }
      var sweep = endAngle - startAngle;
      if (sweep === 0) {
        return this;
      }
      var startX = cx + Math.cos(startAngle) * radius2;
      var startY = cy + Math.sin(startAngle) * radius2;
      var eps = this._geometry.closePointEps;
      var points = this.currentPath ? this.currentPath.points : null;
      if (points) {
        var xDiff = Math.abs(points[points.length - 2] - startX);
        var yDiff = Math.abs(points[points.length - 1] - startY);
        if (xDiff < eps && yDiff < eps)
          ;
        else {
          points.push(startX, startY);
        }
      } else {
        this.moveTo(startX, startY);
        points = this.currentPath.points;
      }
      ArcUtils.arc(startX, startY, cx, cy, radius2, startAngle, endAngle, anticlockwise, points);
      return this;
    };
    Graphics2.prototype.beginFill = function(color, alpha) {
      if (color === void 0) {
        color = 0;
      }
      if (alpha === void 0) {
        alpha = 1;
      }
      return this.beginTextureFill({texture: Texture.WHITE, color, alpha});
    };
    Graphics2.prototype.beginTextureFill = function(options) {
      if (options instanceof Texture) {
        deprecation("v5.2.0", "Please use object-based options for Graphics#beginTextureFill");
        var _a2 = arguments, texture = _a2[0], color = _a2[1], alpha = _a2[2], matrix = _a2[3];
        options = {texture, color, alpha, matrix};
        Object.keys(options).forEach(function(key) {
          return options[key] === void 0 && delete options[key];
        });
      }
      options = Object.assign({
        texture: Texture.WHITE,
        color: 16777215,
        alpha: 1,
        matrix: null
      }, options);
      if (this.currentPath) {
        this.startPoly();
      }
      var visible = options.alpha > 0;
      if (!visible) {
        this._fillStyle.reset();
      } else {
        if (options.matrix) {
          options.matrix = options.matrix.clone();
          options.matrix.invert();
        }
        Object.assign(this._fillStyle, {visible}, options);
      }
      return this;
    };
    Graphics2.prototype.endFill = function() {
      this.finishPoly();
      this._fillStyle.reset();
      return this;
    };
    Graphics2.prototype.drawRect = function(x, y, width, height) {
      return this.drawShape(new Rectangle(x, y, width, height));
    };
    Graphics2.prototype.drawRoundedRect = function(x, y, width, height, radius2) {
      return this.drawShape(new RoundedRectangle(x, y, width, height, radius2));
    };
    Graphics2.prototype.drawCircle = function(x, y, radius2) {
      return this.drawShape(new Circle(x, y, radius2));
    };
    Graphics2.prototype.drawEllipse = function(x, y, width, height) {
      return this.drawShape(new Ellipse(x, y, width, height));
    };
    Graphics2.prototype.drawPolygon = function() {
      var arguments$1 = arguments;
      var path = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        path[_i] = arguments$1[_i];
      }
      var points;
      var closeStroke = true;
      var poly = path[0];
      if (poly.points) {
        closeStroke = poly.closeStroke;
        points = poly.points;
      } else if (Array.isArray(path[0])) {
        points = path[0];
      } else {
        points = path;
      }
      var shape = new Polygon(points);
      shape.closeStroke = closeStroke;
      this.drawShape(shape);
      return this;
    };
    Graphics2.prototype.drawShape = function(shape) {
      if (!this._holeMode) {
        this._geometry.drawShape(shape, this._fillStyle.clone(), this._lineStyle.clone(), this._matrix);
      } else {
        this._geometry.drawHole(shape, this._matrix);
      }
      return this;
    };
    Graphics2.prototype.drawStar = function(x, y, points, radius2, innerRadius, rotation) {
      if (rotation === void 0) {
        rotation = 0;
      }
      return this.drawPolygon(new Star(x, y, points, radius2, innerRadius, rotation));
    };
    Graphics2.prototype.clear = function() {
      this._geometry.clear();
      this._lineStyle.reset();
      this._fillStyle.reset();
      this._boundsID++;
      this._matrix = null;
      this._holeMode = false;
      this.currentPath = null;
      return this;
    };
    Graphics2.prototype.isFastRect = function() {
      var data = this._geometry.graphicsData;
      return data.length === 1 && data[0].shape.type === SHAPES.RECT && !(data[0].lineStyle.visible && data[0].lineStyle.width);
    };
    Graphics2.prototype._render = function(renderer) {
      this.finishPoly();
      var geometry = this._geometry;
      var hasuit32 = renderer.context.supports.uint32Indices;
      geometry.updateBatches(hasuit32);
      if (geometry.batchable) {
        if (this.batchDirty !== geometry.batchDirty) {
          this._populateBatches();
        }
        this._renderBatched(renderer);
      } else {
        renderer.batch.flush();
        this._renderDirect(renderer);
      }
    };
    Graphics2.prototype._populateBatches = function() {
      var geometry = this._geometry;
      var blendMode = this.blendMode;
      var len = geometry.batches.length;
      this.batchTint = -1;
      this._transformID = -1;
      this.batchDirty = geometry.batchDirty;
      this.batches.length = len;
      this.vertexData = new Float32Array(geometry.points);
      for (var i = 0; i < len; i++) {
        var gI = geometry.batches[i];
        var color = gI.style.color;
        var vertexData = new Float32Array(this.vertexData.buffer, gI.attribStart * 4 * 2, gI.attribSize * 2);
        var uvs = new Float32Array(geometry.uvsFloat32.buffer, gI.attribStart * 4 * 2, gI.attribSize * 2);
        var indices2 = new Uint16Array(geometry.indicesUint16.buffer, gI.start * 2, gI.size);
        var batch = {
          vertexData,
          blendMode,
          indices: indices2,
          uvs,
          _batchRGB: hex2rgb(color),
          _tintRGB: color,
          _texture: gI.style.texture,
          alpha: gI.style.alpha,
          worldAlpha: 1
        };
        this.batches[i] = batch;
      }
    };
    Graphics2.prototype._renderBatched = function(renderer) {
      if (!this.batches.length) {
        return;
      }
      renderer.batch.setObjectRenderer(renderer.plugins[this.pluginName]);
      this.calculateVertices();
      this.calculateTints();
      for (var i = 0, l = this.batches.length; i < l; i++) {
        var batch = this.batches[i];
        batch.worldAlpha = this.worldAlpha * batch.alpha;
        renderer.plugins[this.pluginName].render(batch);
      }
    };
    Graphics2.prototype._renderDirect = function(renderer) {
      var shader = this._resolveDirectShader(renderer);
      var geometry = this._geometry;
      var tint = this.tint;
      var worldAlpha = this.worldAlpha;
      var uniforms = shader.uniforms;
      var drawCalls = geometry.drawCalls;
      uniforms.translationMatrix = this.transform.worldTransform;
      uniforms.tint[0] = (tint >> 16 & 255) / 255 * worldAlpha;
      uniforms.tint[1] = (tint >> 8 & 255) / 255 * worldAlpha;
      uniforms.tint[2] = (tint & 255) / 255 * worldAlpha;
      uniforms.tint[3] = worldAlpha;
      renderer.shader.bind(shader);
      renderer.geometry.bind(geometry, shader);
      renderer.state.set(this.state);
      for (var i = 0, l = drawCalls.length; i < l; i++) {
        this._renderDrawCallDirect(renderer, geometry.drawCalls[i]);
      }
    };
    Graphics2.prototype._renderDrawCallDirect = function(renderer, drawCall) {
      var texArray = drawCall.texArray, type = drawCall.type, size2 = drawCall.size, start = drawCall.start;
      var groupTextureCount = texArray.count;
      for (var j = 0; j < groupTextureCount; j++) {
        renderer.texture.bind(texArray.elements[j], j);
      }
      renderer.geometry.draw(type, size2, start);
    };
    Graphics2.prototype._resolveDirectShader = function(renderer) {
      var shader = this.shader;
      var pluginName = this.pluginName;
      if (!shader) {
        if (!DEFAULT_SHADERS[pluginName]) {
          var sampleValues = new Int32Array(16);
          for (var i = 0; i < 16; i++) {
            sampleValues[i] = i;
          }
          var uniforms = {
            tint: new Float32Array([1, 1, 1, 1]),
            translationMatrix: new Matrix(),
            default: UniformGroup.from({uSamplers: sampleValues}, true)
          };
          var program = renderer.plugins[pluginName]._shader.program;
          DEFAULT_SHADERS[pluginName] = new Shader(program, uniforms);
        }
        shader = DEFAULT_SHADERS[pluginName];
      }
      return shader;
    };
    Graphics2.prototype._calculateBounds = function() {
      this.finishPoly();
      var geometry = this._geometry;
      if (!geometry.graphicsData.length) {
        return;
      }
      var _a2 = geometry.bounds, minX = _a2.minX, minY = _a2.minY, maxX = _a2.maxX, maxY = _a2.maxY;
      this._bounds.addFrame(this.transform, minX, minY, maxX, maxY);
    };
    Graphics2.prototype.containsPoint = function(point) {
      this.worldTransform.applyInverse(point, Graphics2._TEMP_POINT);
      return this._geometry.containsPoint(Graphics2._TEMP_POINT);
    };
    Graphics2.prototype.calculateTints = function() {
      if (this.batchTint !== this.tint) {
        this.batchTint = this.tint;
        var tintRGB = hex2rgb(this.tint, temp);
        for (var i = 0; i < this.batches.length; i++) {
          var batch = this.batches[i];
          var batchTint = batch._batchRGB;
          var r = tintRGB[0] * batchTint[0] * 255;
          var g = tintRGB[1] * batchTint[1] * 255;
          var b = tintRGB[2] * batchTint[2] * 255;
          var color = (r << 16) + (g << 8) + (b | 0);
          batch._tintRGB = (color >> 16) + (color & 65280) + ((color & 255) << 16);
        }
      }
    };
    Graphics2.prototype.calculateVertices = function() {
      var wtID = this.transform._worldID;
      if (this._transformID === wtID) {
        return;
      }
      this._transformID = wtID;
      var wt = this.transform.worldTransform;
      var a = wt.a;
      var b = wt.b;
      var c = wt.c;
      var d = wt.d;
      var tx = wt.tx;
      var ty = wt.ty;
      var data = this._geometry.points;
      var vertexData = this.vertexData;
      var count2 = 0;
      for (var i = 0; i < data.length; i += 2) {
        var x = data[i];
        var y = data[i + 1];
        vertexData[count2++] = a * x + c * y + tx;
        vertexData[count2++] = d * y + b * x + ty;
      }
    };
    Graphics2.prototype.closePath = function() {
      var currentPath = this.currentPath;
      if (currentPath) {
        currentPath.closeStroke = true;
      }
      return this;
    };
    Graphics2.prototype.setMatrix = function(matrix) {
      this._matrix = matrix;
      return this;
    };
    Graphics2.prototype.beginHole = function() {
      this.finishPoly();
      this._holeMode = true;
      return this;
    };
    Graphics2.prototype.endHole = function() {
      this.finishPoly();
      this._holeMode = false;
      return this;
    };
    Graphics2.prototype.destroy = function(options) {
      _super.prototype.destroy.call(this, options);
      this._geometry.refCount--;
      if (this._geometry.refCount === 0) {
        this._geometry.dispose();
      }
      this._matrix = null;
      this.currentPath = null;
      this._lineStyle.destroy();
      this._lineStyle = null;
      this._fillStyle.destroy();
      this._fillStyle = null;
      this._geometry = null;
      this.shader = null;
      this.vertexData = null;
      this.batches.length = 0;
      this.batches = null;
      _super.prototype.destroy.call(this, options);
    };
    Graphics2._TEMP_POINT = new Point();
    return Graphics2;
  }(Container);

  // node_modules/@pixi/sprite/lib/sprite.es.js
  /*!
   * @pixi/sprite - v5.3.3
   * Compiled Tue, 04 Aug 2020 16:23:09 UTC
   *
   * @pixi/sprite is licensed under the MIT License.
   * http://www.opensource.org/licenses/mit-license
   */
  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation. All rights reserved.
  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at http://www.apache.org/licenses/LICENSE-2.0
  
  THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
  WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
  MERCHANTABLITY OR NON-INFRINGEMENT.
  
  See the Apache Version 2.0 License for specific language governing permissions
  and limitations under the License.
  ***************************************************************************** */
  var extendStatics7 = function(d, b) {
    extendStatics7 = Object.setPrototypeOf || {__proto__: []} instanceof Array && function(d2, b2) {
      d2.__proto__ = b2;
    } || function(d2, b2) {
      for (var p in b2) {
        if (b2.hasOwnProperty(p)) {
          d2[p] = b2[p];
        }
      }
    };
    return extendStatics7(d, b);
  };
  function __extends7(d, b) {
    extendStatics7(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  }
  var tempPoint = new Point();
  var indices = new Uint16Array([0, 1, 2, 0, 2, 3]);
  var Sprite = function(_super) {
    __extends7(Sprite2, _super);
    function Sprite2(texture) {
      var _this = _super.call(this) || this;
      _this._anchor = new ObservablePoint(_this._onAnchorUpdate, _this, texture ? texture.defaultAnchor.x : 0, texture ? texture.defaultAnchor.y : 0);
      _this._texture = null;
      _this._width = 0;
      _this._height = 0;
      _this._tint = null;
      _this._tintRGB = null;
      _this.tint = 16777215;
      _this.blendMode = BLEND_MODES.NORMAL;
      _this._cachedTint = 16777215;
      _this.uvs = null;
      _this.texture = texture || Texture.EMPTY;
      _this.vertexData = new Float32Array(8);
      _this.vertexTrimmedData = null;
      _this._transformID = -1;
      _this._textureID = -1;
      _this._transformTrimmedID = -1;
      _this._textureTrimmedID = -1;
      _this.indices = indices;
      _this.pluginName = "batch";
      _this.isSprite = true;
      _this._roundPixels = settings.ROUND_PIXELS;
      return _this;
    }
    Sprite2.prototype._onTextureUpdate = function() {
      this._textureID = -1;
      this._textureTrimmedID = -1;
      this._cachedTint = 16777215;
      if (this._width) {
        this.scale.x = sign(this.scale.x) * this._width / this._texture.orig.width;
      }
      if (this._height) {
        this.scale.y = sign(this.scale.y) * this._height / this._texture.orig.height;
      }
    };
    Sprite2.prototype._onAnchorUpdate = function() {
      this._transformID = -1;
      this._transformTrimmedID = -1;
    };
    Sprite2.prototype.calculateVertices = function() {
      var texture = this._texture;
      if (this._transformID === this.transform._worldID && this._textureID === texture._updateID) {
        return;
      }
      if (this._textureID !== texture._updateID) {
        this.uvs = this._texture._uvs.uvsFloat32;
      }
      this._transformID = this.transform._worldID;
      this._textureID = texture._updateID;
      var wt = this.transform.worldTransform;
      var a = wt.a;
      var b = wt.b;
      var c = wt.c;
      var d = wt.d;
      var tx = wt.tx;
      var ty = wt.ty;
      var vertexData = this.vertexData;
      var trim = texture.trim;
      var orig = texture.orig;
      var anchor = this._anchor;
      var w0 = 0;
      var w1 = 0;
      var h0 = 0;
      var h1 = 0;
      if (trim) {
        w1 = trim.x - anchor._x * orig.width;
        w0 = w1 + trim.width;
        h1 = trim.y - anchor._y * orig.height;
        h0 = h1 + trim.height;
      } else {
        w1 = -anchor._x * orig.width;
        w0 = w1 + orig.width;
        h1 = -anchor._y * orig.height;
        h0 = h1 + orig.height;
      }
      vertexData[0] = a * w1 + c * h1 + tx;
      vertexData[1] = d * h1 + b * w1 + ty;
      vertexData[2] = a * w0 + c * h1 + tx;
      vertexData[3] = d * h1 + b * w0 + ty;
      vertexData[4] = a * w0 + c * h0 + tx;
      vertexData[5] = d * h0 + b * w0 + ty;
      vertexData[6] = a * w1 + c * h0 + tx;
      vertexData[7] = d * h0 + b * w1 + ty;
      if (this._roundPixels) {
        var resolution = settings.RESOLUTION;
        for (var i = 0; i < vertexData.length; ++i) {
          vertexData[i] = Math.round((vertexData[i] * resolution | 0) / resolution);
        }
      }
    };
    Sprite2.prototype.calculateTrimmedVertices = function() {
      if (!this.vertexTrimmedData) {
        this.vertexTrimmedData = new Float32Array(8);
      } else if (this._transformTrimmedID === this.transform._worldID && this._textureTrimmedID === this._texture._updateID) {
        return;
      }
      this._transformTrimmedID = this.transform._worldID;
      this._textureTrimmedID = this._texture._updateID;
      var texture = this._texture;
      var vertexData = this.vertexTrimmedData;
      var orig = texture.orig;
      var anchor = this._anchor;
      var wt = this.transform.worldTransform;
      var a = wt.a;
      var b = wt.b;
      var c = wt.c;
      var d = wt.d;
      var tx = wt.tx;
      var ty = wt.ty;
      var w1 = -anchor._x * orig.width;
      var w0 = w1 + orig.width;
      var h1 = -anchor._y * orig.height;
      var h0 = h1 + orig.height;
      vertexData[0] = a * w1 + c * h1 + tx;
      vertexData[1] = d * h1 + b * w1 + ty;
      vertexData[2] = a * w0 + c * h1 + tx;
      vertexData[3] = d * h1 + b * w0 + ty;
      vertexData[4] = a * w0 + c * h0 + tx;
      vertexData[5] = d * h0 + b * w0 + ty;
      vertexData[6] = a * w1 + c * h0 + tx;
      vertexData[7] = d * h0 + b * w1 + ty;
    };
    Sprite2.prototype._render = function(renderer) {
      this.calculateVertices();
      renderer.batch.setObjectRenderer(renderer.plugins[this.pluginName]);
      renderer.plugins[this.pluginName].render(this);
    };
    Sprite2.prototype._calculateBounds = function() {
      var trim = this._texture.trim;
      var orig = this._texture.orig;
      if (!trim || trim.width === orig.width && trim.height === orig.height) {
        this.calculateVertices();
        this._bounds.addQuad(this.vertexData);
      } else {
        this.calculateTrimmedVertices();
        this._bounds.addQuad(this.vertexTrimmedData);
      }
    };
    Sprite2.prototype.getLocalBounds = function(rect) {
      if (this.children.length === 0) {
        this._bounds.minX = this._texture.orig.width * -this._anchor._x;
        this._bounds.minY = this._texture.orig.height * -this._anchor._y;
        this._bounds.maxX = this._texture.orig.width * (1 - this._anchor._x);
        this._bounds.maxY = this._texture.orig.height * (1 - this._anchor._y);
        if (!rect) {
          if (!this._localBoundsRect) {
            this._localBoundsRect = new Rectangle();
          }
          rect = this._localBoundsRect;
        }
        return this._bounds.getRectangle(rect);
      }
      return _super.prototype.getLocalBounds.call(this, rect);
    };
    Sprite2.prototype.containsPoint = function(point) {
      this.worldTransform.applyInverse(point, tempPoint);
      var width = this._texture.orig.width;
      var height = this._texture.orig.height;
      var x1 = -width * this.anchor.x;
      var y1 = 0;
      if (tempPoint.x >= x1 && tempPoint.x < x1 + width) {
        y1 = -height * this.anchor.y;
        if (tempPoint.y >= y1 && tempPoint.y < y1 + height) {
          return true;
        }
      }
      return false;
    };
    Sprite2.prototype.destroy = function(options) {
      _super.prototype.destroy.call(this, options);
      this._texture.off("update", this._onTextureUpdate, this);
      this._anchor = null;
      var destroyTexture = typeof options === "boolean" ? options : options && options.texture;
      if (destroyTexture) {
        var destroyBaseTexture = typeof options === "boolean" ? options : options && options.baseTexture;
        this._texture.destroy(!!destroyBaseTexture);
      }
      this._texture = null;
    };
    Sprite2.from = function(source, options) {
      var texture = source instanceof Texture ? source : Texture.from(source, options);
      return new Sprite2(texture);
    };
    Object.defineProperty(Sprite2.prototype, "roundPixels", {
      get: function() {
        return this._roundPixels;
      },
      set: function(value) {
        if (this._roundPixels !== value) {
          this._transformID = -1;
        }
        this._roundPixels = value;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Sprite2.prototype, "width", {
      get: function() {
        return Math.abs(this.scale.x) * this._texture.orig.width;
      },
      set: function(value) {
        var s = sign(this.scale.x) || 1;
        this.scale.x = s * value / this._texture.orig.width;
        this._width = value;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Sprite2.prototype, "height", {
      get: function() {
        return Math.abs(this.scale.y) * this._texture.orig.height;
      },
      set: function(value) {
        var s = sign(this.scale.y) || 1;
        this.scale.y = s * value / this._texture.orig.height;
        this._height = value;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Sprite2.prototype, "anchor", {
      get: function() {
        return this._anchor;
      },
      set: function(value) {
        this._anchor.copyFrom(value);
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Sprite2.prototype, "tint", {
      get: function() {
        return this._tint;
      },
      set: function(value) {
        this._tint = value;
        this._tintRGB = (value >> 16) + (value & 65280) + ((value & 255) << 16);
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Sprite2.prototype, "texture", {
      get: function() {
        return this._texture;
      },
      set: function(value) {
        if (this._texture === value) {
          return;
        }
        if (this._texture) {
          this._texture.off("update", this._onTextureUpdate, this);
        }
        this._texture = value || Texture.EMPTY;
        this._cachedTint = 16777215;
        this._textureID = -1;
        this._textureTrimmedID = -1;
        if (value) {
          if (value.baseTexture.valid) {
            this._onTextureUpdate();
          } else {
            value.once("update", this._onTextureUpdate, this);
          }
        }
      },
      enumerable: false,
      configurable: true
    });
    return Sprite2;
  }(Container);

  // node_modules/@pixi/text/lib/text.es.js
  /*!
   * @pixi/text - v5.3.3
   * Compiled Tue, 04 Aug 2020 16:23:09 UTC
   *
   * @pixi/text is licensed under the MIT License.
   * http://www.opensource.org/licenses/mit-license
   */
  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation. All rights reserved.
  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at http://www.apache.org/licenses/LICENSE-2.0
  
  THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
  WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
  MERCHANTABLITY OR NON-INFRINGEMENT.
  
  See the Apache Version 2.0 License for specific language governing permissions
  and limitations under the License.
  ***************************************************************************** */
  var extendStatics8 = function(d, b) {
    extendStatics8 = Object.setPrototypeOf || {__proto__: []} instanceof Array && function(d2, b2) {
      d2.__proto__ = b2;
    } || function(d2, b2) {
      for (var p in b2) {
        if (b2.hasOwnProperty(p)) {
          d2[p] = b2[p];
        }
      }
    };
    return extendStatics8(d, b);
  };
  function __extends8(d, b) {
    extendStatics8(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  }
  var TEXT_GRADIENT;
  (function(TEXT_GRADIENT2) {
    TEXT_GRADIENT2[TEXT_GRADIENT2["LINEAR_VERTICAL"] = 0] = "LINEAR_VERTICAL";
    TEXT_GRADIENT2[TEXT_GRADIENT2["LINEAR_HORIZONTAL"] = 1] = "LINEAR_HORIZONTAL";
  })(TEXT_GRADIENT || (TEXT_GRADIENT = {}));
  var defaultStyle = {
    align: "left",
    breakWords: false,
    dropShadow: false,
    dropShadowAlpha: 1,
    dropShadowAngle: Math.PI / 6,
    dropShadowBlur: 0,
    dropShadowColor: "black",
    dropShadowDistance: 5,
    fill: "black",
    fillGradientType: TEXT_GRADIENT.LINEAR_VERTICAL,
    fillGradientStops: [],
    fontFamily: "Arial",
    fontSize: 26,
    fontStyle: "normal",
    fontVariant: "normal",
    fontWeight: "normal",
    letterSpacing: 0,
    lineHeight: 0,
    lineJoin: "miter",
    miterLimit: 10,
    padding: 0,
    stroke: "black",
    strokeThickness: 0,
    textBaseline: "alphabetic",
    trim: false,
    whiteSpace: "pre",
    wordWrap: false,
    wordWrapWidth: 100,
    leading: 0
  };
  var genericFontFamilies = [
    "serif",
    "sans-serif",
    "monospace",
    "cursive",
    "fantasy",
    "system-ui"
  ];
  var TextStyle = function() {
    function TextStyle2(style) {
      this.styleID = 0;
      this.reset();
      deepCopyProperties(this, style, style);
    }
    TextStyle2.prototype.clone = function() {
      var clonedProperties = {};
      deepCopyProperties(clonedProperties, this, defaultStyle);
      return new TextStyle2(clonedProperties);
    };
    TextStyle2.prototype.reset = function() {
      deepCopyProperties(this, defaultStyle, defaultStyle);
    };
    Object.defineProperty(TextStyle2.prototype, "align", {
      get: function() {
        return this._align;
      },
      set: function(align) {
        if (this._align !== align) {
          this._align = align;
          this.styleID++;
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TextStyle2.prototype, "breakWords", {
      get: function() {
        return this._breakWords;
      },
      set: function(breakWords) {
        if (this._breakWords !== breakWords) {
          this._breakWords = breakWords;
          this.styleID++;
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TextStyle2.prototype, "dropShadow", {
      get: function() {
        return this._dropShadow;
      },
      set: function(dropShadow) {
        if (this._dropShadow !== dropShadow) {
          this._dropShadow = dropShadow;
          this.styleID++;
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TextStyle2.prototype, "dropShadowAlpha", {
      get: function() {
        return this._dropShadowAlpha;
      },
      set: function(dropShadowAlpha) {
        if (this._dropShadowAlpha !== dropShadowAlpha) {
          this._dropShadowAlpha = dropShadowAlpha;
          this.styleID++;
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TextStyle2.prototype, "dropShadowAngle", {
      get: function() {
        return this._dropShadowAngle;
      },
      set: function(dropShadowAngle) {
        if (this._dropShadowAngle !== dropShadowAngle) {
          this._dropShadowAngle = dropShadowAngle;
          this.styleID++;
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TextStyle2.prototype, "dropShadowBlur", {
      get: function() {
        return this._dropShadowBlur;
      },
      set: function(dropShadowBlur) {
        if (this._dropShadowBlur !== dropShadowBlur) {
          this._dropShadowBlur = dropShadowBlur;
          this.styleID++;
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TextStyle2.prototype, "dropShadowColor", {
      get: function() {
        return this._dropShadowColor;
      },
      set: function(dropShadowColor) {
        var outputColor = getColor(dropShadowColor);
        if (this._dropShadowColor !== outputColor) {
          this._dropShadowColor = outputColor;
          this.styleID++;
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TextStyle2.prototype, "dropShadowDistance", {
      get: function() {
        return this._dropShadowDistance;
      },
      set: function(dropShadowDistance) {
        if (this._dropShadowDistance !== dropShadowDistance) {
          this._dropShadowDistance = dropShadowDistance;
          this.styleID++;
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TextStyle2.prototype, "fill", {
      get: function() {
        return this._fill;
      },
      set: function(fill) {
        var outputColor = getColor(fill);
        if (this._fill !== outputColor) {
          this._fill = outputColor;
          this.styleID++;
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TextStyle2.prototype, "fillGradientType", {
      get: function() {
        return this._fillGradientType;
      },
      set: function(fillGradientType) {
        if (this._fillGradientType !== fillGradientType) {
          this._fillGradientType = fillGradientType;
          this.styleID++;
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TextStyle2.prototype, "fillGradientStops", {
      get: function() {
        return this._fillGradientStops;
      },
      set: function(fillGradientStops) {
        if (!areArraysEqual(this._fillGradientStops, fillGradientStops)) {
          this._fillGradientStops = fillGradientStops;
          this.styleID++;
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TextStyle2.prototype, "fontFamily", {
      get: function() {
        return this._fontFamily;
      },
      set: function(fontFamily) {
        if (this.fontFamily !== fontFamily) {
          this._fontFamily = fontFamily;
          this.styleID++;
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TextStyle2.prototype, "fontSize", {
      get: function() {
        return this._fontSize;
      },
      set: function(fontSize) {
        if (this._fontSize !== fontSize) {
          this._fontSize = fontSize;
          this.styleID++;
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TextStyle2.prototype, "fontStyle", {
      get: function() {
        return this._fontStyle;
      },
      set: function(fontStyle) {
        if (this._fontStyle !== fontStyle) {
          this._fontStyle = fontStyle;
          this.styleID++;
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TextStyle2.prototype, "fontVariant", {
      get: function() {
        return this._fontVariant;
      },
      set: function(fontVariant) {
        if (this._fontVariant !== fontVariant) {
          this._fontVariant = fontVariant;
          this.styleID++;
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TextStyle2.prototype, "fontWeight", {
      get: function() {
        return this._fontWeight;
      },
      set: function(fontWeight) {
        if (this._fontWeight !== fontWeight) {
          this._fontWeight = fontWeight;
          this.styleID++;
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TextStyle2.prototype, "letterSpacing", {
      get: function() {
        return this._letterSpacing;
      },
      set: function(letterSpacing) {
        if (this._letterSpacing !== letterSpacing) {
          this._letterSpacing = letterSpacing;
          this.styleID++;
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TextStyle2.prototype, "lineHeight", {
      get: function() {
        return this._lineHeight;
      },
      set: function(lineHeight) {
        if (this._lineHeight !== lineHeight) {
          this._lineHeight = lineHeight;
          this.styleID++;
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TextStyle2.prototype, "leading", {
      get: function() {
        return this._leading;
      },
      set: function(leading) {
        if (this._leading !== leading) {
          this._leading = leading;
          this.styleID++;
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TextStyle2.prototype, "lineJoin", {
      get: function() {
        return this._lineJoin;
      },
      set: function(lineJoin) {
        if (this._lineJoin !== lineJoin) {
          this._lineJoin = lineJoin;
          this.styleID++;
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TextStyle2.prototype, "miterLimit", {
      get: function() {
        return this._miterLimit;
      },
      set: function(miterLimit) {
        if (this._miterLimit !== miterLimit) {
          this._miterLimit = miterLimit;
          this.styleID++;
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TextStyle2.prototype, "padding", {
      get: function() {
        return this._padding;
      },
      set: function(padding) {
        if (this._padding !== padding) {
          this._padding = padding;
          this.styleID++;
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TextStyle2.prototype, "stroke", {
      get: function() {
        return this._stroke;
      },
      set: function(stroke) {
        var outputColor = getColor(stroke);
        if (this._stroke !== outputColor) {
          this._stroke = outputColor;
          this.styleID++;
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TextStyle2.prototype, "strokeThickness", {
      get: function() {
        return this._strokeThickness;
      },
      set: function(strokeThickness) {
        if (this._strokeThickness !== strokeThickness) {
          this._strokeThickness = strokeThickness;
          this.styleID++;
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TextStyle2.prototype, "textBaseline", {
      get: function() {
        return this._textBaseline;
      },
      set: function(textBaseline) {
        if (this._textBaseline !== textBaseline) {
          this._textBaseline = textBaseline;
          this.styleID++;
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TextStyle2.prototype, "trim", {
      get: function() {
        return this._trim;
      },
      set: function(trim) {
        if (this._trim !== trim) {
          this._trim = trim;
          this.styleID++;
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TextStyle2.prototype, "whiteSpace", {
      get: function() {
        return this._whiteSpace;
      },
      set: function(whiteSpace) {
        if (this._whiteSpace !== whiteSpace) {
          this._whiteSpace = whiteSpace;
          this.styleID++;
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TextStyle2.prototype, "wordWrap", {
      get: function() {
        return this._wordWrap;
      },
      set: function(wordWrap) {
        if (this._wordWrap !== wordWrap) {
          this._wordWrap = wordWrap;
          this.styleID++;
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TextStyle2.prototype, "wordWrapWidth", {
      get: function() {
        return this._wordWrapWidth;
      },
      set: function(wordWrapWidth) {
        if (this._wordWrapWidth !== wordWrapWidth) {
          this._wordWrapWidth = wordWrapWidth;
          this.styleID++;
        }
      },
      enumerable: false,
      configurable: true
    });
    TextStyle2.prototype.toFontString = function() {
      var fontSizeString = typeof this.fontSize === "number" ? this.fontSize + "px" : this.fontSize;
      var fontFamilies = this.fontFamily;
      if (!Array.isArray(this.fontFamily)) {
        fontFamilies = this.fontFamily.split(",");
      }
      for (var i = fontFamilies.length - 1; i >= 0; i--) {
        var fontFamily = fontFamilies[i].trim();
        if (!/([\"\'])[^\'\"]+\1/.test(fontFamily) && genericFontFamilies.indexOf(fontFamily) < 0) {
          fontFamily = '"' + fontFamily + '"';
        }
        fontFamilies[i] = fontFamily;
      }
      return this.fontStyle + " " + this.fontVariant + " " + this.fontWeight + " " + fontSizeString + " " + fontFamilies.join(",");
    };
    return TextStyle2;
  }();
  function getSingleColor(color) {
    if (typeof color === "number") {
      return hex2string(color);
    } else if (typeof color === "string") {
      if (color.indexOf("0x") === 0) {
        color = color.replace("0x", "#");
      }
    }
    return color;
  }
  function getColor(color) {
    if (!Array.isArray(color)) {
      return getSingleColor(color);
    } else {
      for (var i = 0; i < color.length; ++i) {
        color[i] = getSingleColor(color[i]);
      }
      return color;
    }
  }
  function areArraysEqual(array1, array2) {
    if (!Array.isArray(array1) || !Array.isArray(array2)) {
      return false;
    }
    if (array1.length !== array2.length) {
      return false;
    }
    for (var i = 0; i < array1.length; ++i) {
      if (array1[i] !== array2[i]) {
        return false;
      }
    }
    return true;
  }
  function deepCopyProperties(target, source, propertyObj) {
    for (var prop in propertyObj) {
      if (Array.isArray(source[prop])) {
        target[prop] = source[prop].slice();
      } else {
        target[prop] = source[prop];
      }
    }
  }
  var TextMetrics = function() {
    function TextMetrics2(text3, style, width, height, lines, lineWidths, lineHeight, maxLineWidth, fontProperties) {
      this.text = text3;
      this.style = style;
      this.width = width;
      this.height = height;
      this.lines = lines;
      this.lineWidths = lineWidths;
      this.lineHeight = lineHeight;
      this.maxLineWidth = maxLineWidth;
      this.fontProperties = fontProperties;
    }
    TextMetrics2.measureText = function(text3, style, wordWrap, canvas2) {
      if (canvas2 === void 0) {
        canvas2 = TextMetrics2._canvas;
      }
      wordWrap = wordWrap === void 0 || wordWrap === null ? style.wordWrap : wordWrap;
      var font = style.toFontString();
      var fontProperties = TextMetrics2.measureFont(font);
      if (fontProperties.fontSize === 0) {
        fontProperties.fontSize = style.fontSize;
        fontProperties.ascent = style.fontSize;
      }
      var context2 = canvas2.getContext("2d");
      context2.font = font;
      var outputText = wordWrap ? TextMetrics2.wordWrap(text3, style, canvas2) : text3;
      var lines = outputText.split(/(?:\r\n|\r|\n)/);
      var lineWidths = new Array(lines.length);
      var maxLineWidth = 0;
      for (var i = 0; i < lines.length; i++) {
        var lineWidth = context2.measureText(lines[i]).width + (lines[i].length - 1) * style.letterSpacing;
        lineWidths[i] = lineWidth;
        maxLineWidth = Math.max(maxLineWidth, lineWidth);
      }
      var width = maxLineWidth + style.strokeThickness;
      if (style.dropShadow) {
        width += style.dropShadowDistance;
      }
      var lineHeight = style.lineHeight || fontProperties.fontSize + style.strokeThickness;
      var height = Math.max(lineHeight, fontProperties.fontSize + style.strokeThickness) + (lines.length - 1) * (lineHeight + style.leading);
      if (style.dropShadow) {
        height += style.dropShadowDistance;
      }
      return new TextMetrics2(text3, style, width, height, lines, lineWidths, lineHeight + style.leading, maxLineWidth, fontProperties);
    };
    TextMetrics2.wordWrap = function(text3, style, canvas2) {
      if (canvas2 === void 0) {
        canvas2 = TextMetrics2._canvas;
      }
      var context2 = canvas2.getContext("2d");
      var width = 0;
      var line = "";
      var lines = "";
      var cache2 = {};
      var letterSpacing = style.letterSpacing, whiteSpace = style.whiteSpace;
      var collapseSpaces = TextMetrics2.collapseSpaces(whiteSpace);
      var collapseNewlines = TextMetrics2.collapseNewlines(whiteSpace);
      var canPrependSpaces = !collapseSpaces;
      var wordWrapWidth = style.wordWrapWidth + letterSpacing;
      var tokens = TextMetrics2.tokenize(text3);
      for (var i = 0; i < tokens.length; i++) {
        var token = tokens[i];
        if (TextMetrics2.isNewline(token)) {
          if (!collapseNewlines) {
            lines += TextMetrics2.addLine(line);
            canPrependSpaces = !collapseSpaces;
            line = "";
            width = 0;
            continue;
          }
          token = " ";
        }
        if (collapseSpaces) {
          var currIsBreakingSpace = TextMetrics2.isBreakingSpace(token);
          var lastIsBreakingSpace = TextMetrics2.isBreakingSpace(line[line.length - 1]);
          if (currIsBreakingSpace && lastIsBreakingSpace) {
            continue;
          }
        }
        var tokenWidth = TextMetrics2.getFromCache(token, letterSpacing, cache2, context2);
        if (tokenWidth > wordWrapWidth) {
          if (line !== "") {
            lines += TextMetrics2.addLine(line);
            line = "";
            width = 0;
          }
          if (TextMetrics2.canBreakWords(token, style.breakWords)) {
            var characters = TextMetrics2.wordWrapSplit(token);
            for (var j = 0; j < characters.length; j++) {
              var char = characters[j];
              var k = 1;
              while (characters[j + k]) {
                var nextChar = characters[j + k];
                var lastChar = char[char.length - 1];
                if (!TextMetrics2.canBreakChars(lastChar, nextChar, token, j, style.breakWords)) {
                  char += nextChar;
                } else {
                  break;
                }
                k++;
              }
              j += char.length - 1;
              var characterWidth = TextMetrics2.getFromCache(char, letterSpacing, cache2, context2);
              if (characterWidth + width > wordWrapWidth) {
                lines += TextMetrics2.addLine(line);
                canPrependSpaces = false;
                line = "";
                width = 0;
              }
              line += char;
              width += characterWidth;
            }
          } else {
            if (line.length > 0) {
              lines += TextMetrics2.addLine(line);
              line = "";
              width = 0;
            }
            var isLastToken = i === tokens.length - 1;
            lines += TextMetrics2.addLine(token, !isLastToken);
            canPrependSpaces = false;
            line = "";
            width = 0;
          }
        } else {
          if (tokenWidth + width > wordWrapWidth) {
            canPrependSpaces = false;
            lines += TextMetrics2.addLine(line);
            line = "";
            width = 0;
          }
          if (line.length > 0 || !TextMetrics2.isBreakingSpace(token) || canPrependSpaces) {
            line += token;
            width += tokenWidth;
          }
        }
      }
      lines += TextMetrics2.addLine(line, false);
      return lines;
    };
    TextMetrics2.addLine = function(line, newLine) {
      if (newLine === void 0) {
        newLine = true;
      }
      line = TextMetrics2.trimRight(line);
      line = newLine ? line + "\n" : line;
      return line;
    };
    TextMetrics2.getFromCache = function(key, letterSpacing, cache2, context2) {
      var width = cache2[key];
      if (width === void 0) {
        var spacing = key.length * letterSpacing;
        width = context2.measureText(key).width + spacing;
        cache2[key] = width;
      }
      return width;
    };
    TextMetrics2.collapseSpaces = function(whiteSpace) {
      return whiteSpace === "normal" || whiteSpace === "pre-line";
    };
    TextMetrics2.collapseNewlines = function(whiteSpace) {
      return whiteSpace === "normal";
    };
    TextMetrics2.trimRight = function(text3) {
      if (typeof text3 !== "string") {
        return "";
      }
      for (var i = text3.length - 1; i >= 0; i--) {
        var char = text3[i];
        if (!TextMetrics2.isBreakingSpace(char)) {
          break;
        }
        text3 = text3.slice(0, -1);
      }
      return text3;
    };
    TextMetrics2.isNewline = function(char) {
      if (typeof char !== "string") {
        return false;
      }
      return TextMetrics2._newlines.indexOf(char.charCodeAt(0)) >= 0;
    };
    TextMetrics2.isBreakingSpace = function(char) {
      if (typeof char !== "string") {
        return false;
      }
      return TextMetrics2._breakingSpaces.indexOf(char.charCodeAt(0)) >= 0;
    };
    TextMetrics2.tokenize = function(text3) {
      var tokens = [];
      var token = "";
      if (typeof text3 !== "string") {
        return tokens;
      }
      for (var i = 0; i < text3.length; i++) {
        var char = text3[i];
        if (TextMetrics2.isBreakingSpace(char) || TextMetrics2.isNewline(char)) {
          if (token !== "") {
            tokens.push(token);
            token = "";
          }
          tokens.push(char);
          continue;
        }
        token += char;
      }
      if (token !== "") {
        tokens.push(token);
      }
      return tokens;
    };
    TextMetrics2.canBreakWords = function(_token, breakWords) {
      return breakWords;
    };
    TextMetrics2.canBreakChars = function(_char, _nextChar, _token, _index, _breakWords) {
      return true;
    };
    TextMetrics2.wordWrapSplit = function(token) {
      return token.split("");
    };
    TextMetrics2.measureFont = function(font) {
      if (TextMetrics2._fonts[font]) {
        return TextMetrics2._fonts[font];
      }
      var properties = {
        ascent: 0,
        descent: 0,
        fontSize: 0
      };
      var canvas2 = TextMetrics2._canvas;
      var context2 = TextMetrics2._context;
      context2.font = font;
      var metricsString = TextMetrics2.METRICS_STRING + TextMetrics2.BASELINE_SYMBOL;
      var width = Math.ceil(context2.measureText(metricsString).width);
      var baseline = Math.ceil(context2.measureText(TextMetrics2.BASELINE_SYMBOL).width);
      var height = 2 * baseline;
      baseline = baseline * TextMetrics2.BASELINE_MULTIPLIER | 0;
      canvas2.width = width;
      canvas2.height = height;
      context2.fillStyle = "#f00";
      context2.fillRect(0, 0, width, height);
      context2.font = font;
      context2.textBaseline = "alphabetic";
      context2.fillStyle = "#000";
      context2.fillText(metricsString, 0, baseline);
      var imagedata = context2.getImageData(0, 0, width, height).data;
      var pixels = imagedata.length;
      var line = width * 4;
      var i = 0;
      var idx = 0;
      var stop = false;
      for (i = 0; i < baseline; ++i) {
        for (var j = 0; j < line; j += 4) {
          if (imagedata[idx + j] !== 255) {
            stop = true;
            break;
          }
        }
        if (!stop) {
          idx += line;
        } else {
          break;
        }
      }
      properties.ascent = baseline - i;
      idx = pixels - line;
      stop = false;
      for (i = height; i > baseline; --i) {
        for (var j = 0; j < line; j += 4) {
          if (imagedata[idx + j] !== 255) {
            stop = true;
            break;
          }
        }
        if (!stop) {
          idx -= line;
        } else {
          break;
        }
      }
      properties.descent = i - baseline;
      properties.fontSize = properties.ascent + properties.descent;
      TextMetrics2._fonts[font] = properties;
      return properties;
    };
    TextMetrics2.clearMetrics = function(font) {
      if (font === void 0) {
        font = "";
      }
      if (font) {
        delete TextMetrics2._fonts[font];
      } else {
        TextMetrics2._fonts = {};
      }
    };
    return TextMetrics2;
  }();
  var canvas = function() {
    try {
      var c = new OffscreenCanvas(0, 0);
      var context2 = c.getContext("2d");
      if (context2 && context2.measureText) {
        return c;
      }
      return document.createElement("canvas");
    } catch (ex) {
      return document.createElement("canvas");
    }
  }();
  canvas.width = canvas.height = 10;
  TextMetrics._canvas = canvas;
  TextMetrics._context = canvas.getContext("2d");
  TextMetrics._fonts = {};
  TextMetrics.METRICS_STRING = "|\xC9q\xC5";
  TextMetrics.BASELINE_SYMBOL = "M";
  TextMetrics.BASELINE_MULTIPLIER = 1.4;
  TextMetrics._newlines = [
    10,
    13
  ];
  TextMetrics._breakingSpaces = [
    9,
    32,
    8192,
    8193,
    8194,
    8195,
    8196,
    8197,
    8198,
    8200,
    8201,
    8202,
    8287,
    12288
  ];
  var defaultDestroyOptions = {
    texture: true,
    children: false,
    baseTexture: true
  };
  var Text = function(_super) {
    __extends8(Text2, _super);
    function Text2(text3, style, canvas2) {
      var _this = this;
      var ownCanvas = false;
      if (!canvas2) {
        canvas2 = document.createElement("canvas");
        ownCanvas = true;
      }
      canvas2.width = 3;
      canvas2.height = 3;
      var texture = Texture.from(canvas2);
      texture.orig = new Rectangle();
      texture.trim = new Rectangle();
      _this = _super.call(this, texture) || this;
      _this._ownCanvas = ownCanvas;
      _this.canvas = canvas2;
      _this.context = _this.canvas.getContext("2d");
      _this._resolution = settings.RESOLUTION;
      _this._autoResolution = true;
      _this._text = null;
      _this._style = null;
      _this._styleListener = null;
      _this._font = "";
      _this.text = text3;
      _this.style = style;
      _this.localStyleID = -1;
      return _this;
    }
    Text2.prototype.updateText = function(respectDirty) {
      var style = this._style;
      if (this.localStyleID !== style.styleID) {
        this.dirty = true;
        this.localStyleID = style.styleID;
      }
      if (!this.dirty && respectDirty) {
        return;
      }
      this._font = this._style.toFontString();
      var context2 = this.context;
      var measured = TextMetrics.measureText(this._text || " ", this._style, this._style.wordWrap, this.canvas);
      var width = measured.width;
      var height = measured.height;
      var lines = measured.lines;
      var lineHeight = measured.lineHeight;
      var lineWidths = measured.lineWidths;
      var maxLineWidth = measured.maxLineWidth;
      var fontProperties = measured.fontProperties;
      this.canvas.width = Math.ceil((Math.max(1, width) + style.padding * 2) * this._resolution);
      this.canvas.height = Math.ceil((Math.max(1, height) + style.padding * 2) * this._resolution);
      context2.scale(this._resolution, this._resolution);
      context2.clearRect(0, 0, this.canvas.width, this.canvas.height);
      context2.font = this._font;
      context2.lineWidth = style.strokeThickness;
      context2.textBaseline = style.textBaseline;
      context2.lineJoin = style.lineJoin;
      context2.miterLimit = style.miterLimit;
      var linePositionX;
      var linePositionY;
      var passesCount = style.dropShadow ? 2 : 1;
      for (var i = 0; i < passesCount; ++i) {
        var isShadowPass = style.dropShadow && i === 0;
        var dsOffsetText = isShadowPass ? height * 2 : 0;
        var dsOffsetShadow = dsOffsetText * this.resolution;
        if (isShadowPass) {
          context2.fillStyle = "black";
          context2.strokeStyle = "black";
          var dropShadowColor = style.dropShadowColor;
          var rgb = hex2rgb(typeof dropShadowColor === "number" ? dropShadowColor : string2hex(dropShadowColor));
          context2.shadowColor = "rgba(" + rgb[0] * 255 + "," + rgb[1] * 255 + "," + rgb[2] * 255 + "," + style.dropShadowAlpha + ")";
          context2.shadowBlur = style.dropShadowBlur;
          context2.shadowOffsetX = Math.cos(style.dropShadowAngle) * style.dropShadowDistance;
          context2.shadowOffsetY = Math.sin(style.dropShadowAngle) * style.dropShadowDistance + dsOffsetShadow;
        } else {
          context2.fillStyle = this._generateFillStyle(style, lines, measured);
          context2.strokeStyle = style.stroke;
          context2.shadowColor = "0";
          context2.shadowBlur = 0;
          context2.shadowOffsetX = 0;
          context2.shadowOffsetY = 0;
        }
        for (var i_1 = 0; i_1 < lines.length; i_1++) {
          linePositionX = style.strokeThickness / 2;
          linePositionY = style.strokeThickness / 2 + i_1 * lineHeight + fontProperties.ascent;
          if (style.align === "right") {
            linePositionX += maxLineWidth - lineWidths[i_1];
          } else if (style.align === "center") {
            linePositionX += (maxLineWidth - lineWidths[i_1]) / 2;
          }
          if (style.stroke && style.strokeThickness) {
            this.drawLetterSpacing(lines[i_1], linePositionX + style.padding, linePositionY + style.padding - dsOffsetText, true);
          }
          if (style.fill) {
            this.drawLetterSpacing(lines[i_1], linePositionX + style.padding, linePositionY + style.padding - dsOffsetText);
          }
        }
      }
      this.updateTexture();
    };
    Text2.prototype.drawLetterSpacing = function(text3, x, y, isStroke) {
      if (isStroke === void 0) {
        isStroke = false;
      }
      var style = this._style;
      var letterSpacing = style.letterSpacing;
      if (letterSpacing === 0) {
        if (isStroke) {
          this.context.strokeText(text3, x, y);
        } else {
          this.context.fillText(text3, x, y);
        }
        return;
      }
      var currentPosition = x;
      var stringArray = Array.from ? Array.from(text3) : text3.split("");
      var previousWidth = this.context.measureText(text3).width;
      var currentWidth = 0;
      for (var i = 0; i < stringArray.length; ++i) {
        var currentChar = stringArray[i];
        if (isStroke) {
          this.context.strokeText(currentChar, currentPosition, y);
        } else {
          this.context.fillText(currentChar, currentPosition, y);
        }
        currentWidth = this.context.measureText(text3.substring(i + 1)).width;
        currentPosition += previousWidth - currentWidth + letterSpacing;
        previousWidth = currentWidth;
      }
    };
    Text2.prototype.updateTexture = function() {
      var canvas2 = this.canvas;
      if (this._style.trim) {
        var trimmed = trimCanvas(canvas2);
        if (trimmed.data) {
          canvas2.width = trimmed.width;
          canvas2.height = trimmed.height;
          this.context.putImageData(trimmed.data, 0, 0);
        }
      }
      var texture = this._texture;
      var style = this._style;
      var padding = style.trim ? 0 : style.padding;
      var baseTexture = texture.baseTexture;
      texture.trim.width = texture._frame.width = Math.ceil(canvas2.width / this._resolution);
      texture.trim.height = texture._frame.height = Math.ceil(canvas2.height / this._resolution);
      texture.trim.x = -padding;
      texture.trim.y = -padding;
      texture.orig.width = texture._frame.width - padding * 2;
      texture.orig.height = texture._frame.height - padding * 2;
      this._onTextureUpdate();
      baseTexture.setRealSize(canvas2.width, canvas2.height, this._resolution);
      this._recursivePostUpdateTransform();
      this.dirty = false;
    };
    Text2.prototype._render = function(renderer) {
      if (this._autoResolution && this._resolution !== renderer.resolution) {
        this._resolution = renderer.resolution;
        this.dirty = true;
      }
      this.updateText(true);
      _super.prototype._render.call(this, renderer);
    };
    Text2.prototype.getLocalBounds = function(rect) {
      this.updateText(true);
      return _super.prototype.getLocalBounds.call(this, rect);
    };
    Text2.prototype._calculateBounds = function() {
      this.updateText(true);
      this.calculateVertices();
      this._bounds.addQuad(this.vertexData);
    };
    Text2.prototype._generateFillStyle = function(style, lines, metrics) {
      var fillStyle = style.fill;
      if (!Array.isArray(fillStyle)) {
        return fillStyle;
      } else if (fillStyle.length === 1) {
        return fillStyle[0];
      }
      var gradient;
      var dropShadowCorrection = style.dropShadow ? style.dropShadowDistance : 0;
      var padding = style.padding || 0;
      var width = Math.ceil(this.canvas.width / this._resolution) - dropShadowCorrection - padding * 2;
      var height = Math.ceil(this.canvas.height / this._resolution) - dropShadowCorrection - padding * 2;
      var fill = fillStyle.slice();
      var fillGradientStops = style.fillGradientStops.slice();
      if (!fillGradientStops.length) {
        var lengthPlus1 = fill.length + 1;
        for (var i = 1; i < lengthPlus1; ++i) {
          fillGradientStops.push(i / lengthPlus1);
        }
      }
      fill.unshift(fillStyle[0]);
      fillGradientStops.unshift(0);
      fill.push(fillStyle[fillStyle.length - 1]);
      fillGradientStops.push(1);
      if (style.fillGradientType === TEXT_GRADIENT.LINEAR_VERTICAL) {
        gradient = this.context.createLinearGradient(width / 2, padding, width / 2, height + padding);
        var lastIterationStop = 0;
        var textHeight = metrics.fontProperties.fontSize + style.strokeThickness;
        var gradStopLineHeight = textHeight / height;
        for (var i = 0; i < lines.length; i++) {
          var thisLineTop = metrics.lineHeight * i;
          for (var j = 0; j < fill.length; j++) {
            var lineStop = 0;
            if (typeof fillGradientStops[j] === "number") {
              lineStop = fillGradientStops[j];
            } else {
              lineStop = j / fill.length;
            }
            var globalStop = thisLineTop / height + lineStop * gradStopLineHeight;
            var clampedStop = Math.max(lastIterationStop, globalStop);
            clampedStop = Math.min(clampedStop, 1);
            gradient.addColorStop(clampedStop, fill[j]);
            lastIterationStop = clampedStop;
          }
        }
      } else {
        gradient = this.context.createLinearGradient(padding, height / 2, width + padding, height / 2);
        var totalIterations = fill.length + 1;
        var currentIteration = 1;
        for (var i = 0; i < fill.length; i++) {
          var stop = void 0;
          if (typeof fillGradientStops[i] === "number") {
            stop = fillGradientStops[i];
          } else {
            stop = currentIteration / totalIterations;
          }
          gradient.addColorStop(stop, fill[i]);
          currentIteration++;
        }
      }
      return gradient;
    };
    Text2.prototype.destroy = function(options) {
      if (typeof options === "boolean") {
        options = {children: options};
      }
      options = Object.assign({}, defaultDestroyOptions, options);
      _super.prototype.destroy.call(this, options);
      if (this._ownCanvas) {
        this.canvas.height = this.canvas.width = 0;
      }
      this.context = null;
      this.canvas = null;
      this._style = null;
    };
    Object.defineProperty(Text2.prototype, "width", {
      get: function() {
        this.updateText(true);
        return Math.abs(this.scale.x) * this._texture.orig.width;
      },
      set: function(value) {
        this.updateText(true);
        var s = sign(this.scale.x) || 1;
        this.scale.x = s * value / this._texture.orig.width;
        this._width = value;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Text2.prototype, "height", {
      get: function() {
        this.updateText(true);
        return Math.abs(this.scale.y) * this._texture.orig.height;
      },
      set: function(value) {
        this.updateText(true);
        var s = sign(this.scale.y) || 1;
        this.scale.y = s * value / this._texture.orig.height;
        this._height = value;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Text2.prototype, "style", {
      get: function() {
        return this._style;
      },
      set: function(style) {
        style = style || {};
        if (style instanceof TextStyle) {
          this._style = style;
        } else {
          this._style = new TextStyle(style);
        }
        this.localStyleID = -1;
        this.dirty = true;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Text2.prototype, "text", {
      get: function() {
        return this._text;
      },
      set: function(text3) {
        text3 = String(text3 === null || text3 === void 0 ? "" : text3);
        if (this._text === text3) {
          return;
        }
        this._text = text3;
        this.dirty = true;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Text2.prototype, "resolution", {
      get: function() {
        return this._resolution;
      },
      set: function(value) {
        this._autoResolution = false;
        if (this._resolution === value) {
          return;
        }
        this._resolution = value;
        this.dirty = true;
      },
      enumerable: false,
      configurable: true
    });
    return Text2;
  }(Sprite);

  // node_modules/@pixi/prepare/lib/prepare.es.js
  /*!
   * @pixi/prepare - v5.3.3
   * Compiled Tue, 04 Aug 2020 16:23:09 UTC
   *
   * @pixi/prepare is licensed under the MIT License.
   * http://www.opensource.org/licenses/mit-license
   */
  settings.UPLOADS_PER_FRAME = 4;
  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation. All rights reserved.
  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at http://www.apache.org/licenses/LICENSE-2.0
  
  THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
  WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
  MERCHANTABLITY OR NON-INFRINGEMENT.
  
  See the Apache Version 2.0 License for specific language governing permissions
  and limitations under the License.
  ***************************************************************************** */
  var extendStatics9 = function(d, b) {
    extendStatics9 = Object.setPrototypeOf || {__proto__: []} instanceof Array && function(d2, b2) {
      d2.__proto__ = b2;
    } || function(d2, b2) {
      for (var p in b2) {
        if (b2.hasOwnProperty(p)) {
          d2[p] = b2[p];
        }
      }
    };
    return extendStatics9(d, b);
  };
  function __extends9(d, b) {
    extendStatics9(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  }
  var CountLimiter = function() {
    function CountLimiter2(maxItemsPerFrame) {
      this.maxItemsPerFrame = maxItemsPerFrame;
      this.itemsLeft = 0;
    }
    CountLimiter2.prototype.beginFrame = function() {
      this.itemsLeft = this.maxItemsPerFrame;
    };
    CountLimiter2.prototype.allowedToUpload = function() {
      return this.itemsLeft-- > 0;
    };
    return CountLimiter2;
  }();
  function findMultipleBaseTextures(item, queue2) {
    var result = false;
    if (item && item._textures && item._textures.length) {
      for (var i = 0; i < item._textures.length; i++) {
        if (item._textures[i] instanceof Texture) {
          var baseTexture = item._textures[i].baseTexture;
          if (queue2.indexOf(baseTexture) === -1) {
            queue2.push(baseTexture);
            result = true;
          }
        }
      }
    }
    return result;
  }
  function findBaseTexture(item, queue2) {
    if (item.baseTexture instanceof BaseTexture) {
      var texture = item.baseTexture;
      if (queue2.indexOf(texture) === -1) {
        queue2.push(texture);
      }
      return true;
    }
    return false;
  }
  function findTexture(item, queue2) {
    if (item._texture && item._texture instanceof Texture) {
      var texture = item._texture.baseTexture;
      if (queue2.indexOf(texture) === -1) {
        queue2.push(texture);
      }
      return true;
    }
    return false;
  }
  function drawText(_helper, item) {
    if (item instanceof Text) {
      item.updateText(true);
      return true;
    }
    return false;
  }
  function calculateTextStyle(_helper, item) {
    if (item instanceof TextStyle) {
      var font = item.toFontString();
      TextMetrics.measureFont(font);
      return true;
    }
    return false;
  }
  function findText(item, queue2) {
    if (item instanceof Text) {
      if (queue2.indexOf(item.style) === -1) {
        queue2.push(item.style);
      }
      if (queue2.indexOf(item) === -1) {
        queue2.push(item);
      }
      var texture = item._texture.baseTexture;
      if (queue2.indexOf(texture) === -1) {
        queue2.push(texture);
      }
      return true;
    }
    return false;
  }
  function findTextStyle(item, queue2) {
    if (item instanceof TextStyle) {
      if (queue2.indexOf(item) === -1) {
        queue2.push(item);
      }
      return true;
    }
    return false;
  }
  var BasePrepare = function() {
    function BasePrepare2(renderer) {
      var _this = this;
      this.limiter = new CountLimiter(settings.UPLOADS_PER_FRAME);
      this.renderer = renderer;
      this.uploadHookHelper = null;
      this.queue = [];
      this.addHooks = [];
      this.uploadHooks = [];
      this.completes = [];
      this.ticking = false;
      this.delayedTick = function() {
        if (!_this.queue) {
          return;
        }
        _this.prepareItems();
      };
      this.registerFindHook(findText);
      this.registerFindHook(findTextStyle);
      this.registerFindHook(findMultipleBaseTextures);
      this.registerFindHook(findBaseTexture);
      this.registerFindHook(findTexture);
      this.registerUploadHook(drawText);
      this.registerUploadHook(calculateTextStyle);
    }
    BasePrepare2.prototype.upload = function(item, done) {
      if (typeof item === "function") {
        done = item;
        item = null;
      }
      if (item) {
        this.add(item);
      }
      if (this.queue.length) {
        if (done) {
          this.completes.push(done);
        }
        if (!this.ticking) {
          this.ticking = true;
          Ticker.system.addOnce(this.tick, this, UPDATE_PRIORITY.UTILITY);
        }
      } else if (done) {
        done();
      }
    };
    BasePrepare2.prototype.tick = function() {
      setTimeout(this.delayedTick, 0);
    };
    BasePrepare2.prototype.prepareItems = function() {
      this.limiter.beginFrame();
      while (this.queue.length && this.limiter.allowedToUpload()) {
        var item = this.queue[0];
        var uploaded = false;
        if (item && !item._destroyed) {
          for (var i = 0, len = this.uploadHooks.length; i < len; i++) {
            if (this.uploadHooks[i](this.uploadHookHelper, item)) {
              this.queue.shift();
              uploaded = true;
              break;
            }
          }
        }
        if (!uploaded) {
          this.queue.shift();
        }
      }
      if (!this.queue.length) {
        this.ticking = false;
        var completes = this.completes.slice(0);
        this.completes.length = 0;
        for (var i = 0, len = completes.length; i < len; i++) {
          completes[i]();
        }
      } else {
        Ticker.system.addOnce(this.tick, this, UPDATE_PRIORITY.UTILITY);
      }
    };
    BasePrepare2.prototype.registerFindHook = function(addHook) {
      if (addHook) {
        this.addHooks.push(addHook);
      }
      return this;
    };
    BasePrepare2.prototype.registerUploadHook = function(uploadHook) {
      if (uploadHook) {
        this.uploadHooks.push(uploadHook);
      }
      return this;
    };
    BasePrepare2.prototype.add = function(item) {
      for (var i = 0, len = this.addHooks.length; i < len; i++) {
        if (this.addHooks[i](item, this.queue)) {
          break;
        }
      }
      if (item instanceof Container) {
        for (var i = item.children.length - 1; i >= 0; i--) {
          this.add(item.children[i]);
        }
      }
      return this;
    };
    BasePrepare2.prototype.destroy = function() {
      if (this.ticking) {
        Ticker.system.remove(this.tick, this);
      }
      this.ticking = false;
      this.addHooks = null;
      this.uploadHooks = null;
      this.renderer = null;
      this.completes = null;
      this.queue = null;
      this.limiter = null;
      this.uploadHookHelper = null;
    };
    return BasePrepare2;
  }();
  function uploadBaseTextures(renderer, item) {
    if (item instanceof BaseTexture) {
      if (!item._glTextures[renderer.CONTEXT_UID]) {
        renderer.texture.bind(item);
      }
      return true;
    }
    return false;
  }
  function uploadGraphics(renderer, item) {
    if (!(item instanceof Graphics)) {
      return false;
    }
    var geometry = item.geometry;
    item.finishPoly();
    geometry.updateBatches();
    var batches = geometry.batches;
    for (var i = 0; i < batches.length; i++) {
      var texture = batches[i].style.texture;
      if (texture) {
        uploadBaseTextures(renderer, texture.baseTexture);
      }
    }
    if (!geometry.batchable) {
      renderer.geometry.bind(geometry, item._resolveDirectShader(renderer));
    }
    return true;
  }
  function findGraphics(item, queue2) {
    if (item instanceof Graphics) {
      queue2.push(item);
      return true;
    }
    return false;
  }
  var Prepare = function(_super) {
    __extends9(Prepare2, _super);
    function Prepare2(renderer) {
      var _this = _super.call(this, renderer) || this;
      _this.uploadHookHelper = _this.renderer;
      _this.registerFindHook(findGraphics);
      _this.registerUploadHook(uploadBaseTextures);
      _this.registerUploadHook(uploadGraphics);
      return _this;
    }
    return Prepare2;
  }(BasePrepare);
  var TimeLimiter = function() {
    function TimeLimiter2(maxMilliseconds) {
      this.maxMilliseconds = maxMilliseconds;
      this.frameStart = 0;
    }
    TimeLimiter2.prototype.beginFrame = function() {
      this.frameStart = Date.now();
    };
    TimeLimiter2.prototype.allowedToUpload = function() {
      return Date.now() - this.frameStart < this.maxMilliseconds;
    };
    return TimeLimiter2;
  }();

  // node_modules/@pixi/spritesheet/lib/spritesheet.es.js
  /*!
   * @pixi/spritesheet - v5.3.3
   * Compiled Tue, 04 Aug 2020 16:23:09 UTC
   *
   * @pixi/spritesheet is licensed under the MIT License.
   * http://www.opensource.org/licenses/mit-license
   */
  var Spritesheet = function() {
    function Spritesheet2(texture, data, resolutionFilename) {
      if (resolutionFilename === void 0) {
        resolutionFilename = null;
      }
      this._texture = texture instanceof Texture ? texture : null;
      this.baseTexture = texture instanceof BaseTexture ? texture : this._texture.baseTexture;
      this.textures = {};
      this.animations = {};
      this.data = data;
      var resource = this.baseTexture.resource;
      this.resolution = this._updateResolution(resolutionFilename || (resource ? resource.url : null));
      this._frames = this.data.frames;
      this._frameKeys = Object.keys(this._frames);
      this._batchIndex = 0;
      this._callback = null;
    }
    Spritesheet2.prototype._updateResolution = function(resolutionFilename) {
      if (resolutionFilename === void 0) {
        resolutionFilename = null;
      }
      var scale = this.data.meta.scale;
      var resolution = getResolutionOfUrl(resolutionFilename, null);
      if (resolution === null) {
        resolution = scale !== void 0 ? parseFloat(scale) : 1;
      }
      if (resolution !== 1) {
        this.baseTexture.setResolution(resolution);
      }
      return resolution;
    };
    Spritesheet2.prototype.parse = function(callback) {
      this._batchIndex = 0;
      this._callback = callback;
      if (this._frameKeys.length <= Spritesheet2.BATCH_SIZE) {
        this._processFrames(0);
        this._processAnimations();
        this._parseComplete();
      } else {
        this._nextBatch();
      }
    };
    Spritesheet2.prototype._processFrames = function(initialFrameIndex) {
      var frameIndex = initialFrameIndex;
      var maxFrames = Spritesheet2.BATCH_SIZE;
      while (frameIndex - initialFrameIndex < maxFrames && frameIndex < this._frameKeys.length) {
        var i = this._frameKeys[frameIndex];
        var data = this._frames[i];
        var rect = data.frame;
        if (rect) {
          var frame = null;
          var trim = null;
          var sourceSize = data.trimmed !== false && data.sourceSize ? data.sourceSize : data.frame;
          var orig = new Rectangle(0, 0, Math.floor(sourceSize.w) / this.resolution, Math.floor(sourceSize.h) / this.resolution);
          if (data.rotated) {
            frame = new Rectangle(Math.floor(rect.x) / this.resolution, Math.floor(rect.y) / this.resolution, Math.floor(rect.h) / this.resolution, Math.floor(rect.w) / this.resolution);
          } else {
            frame = new Rectangle(Math.floor(rect.x) / this.resolution, Math.floor(rect.y) / this.resolution, Math.floor(rect.w) / this.resolution, Math.floor(rect.h) / this.resolution);
          }
          if (data.trimmed !== false && data.spriteSourceSize) {
            trim = new Rectangle(Math.floor(data.spriteSourceSize.x) / this.resolution, Math.floor(data.spriteSourceSize.y) / this.resolution, Math.floor(rect.w) / this.resolution, Math.floor(rect.h) / this.resolution);
          }
          this.textures[i] = new Texture(this.baseTexture, frame, orig, trim, data.rotated ? 2 : 0, data.anchor);
          Texture.addToCache(this.textures[i], i);
        }
        frameIndex++;
      }
    };
    Spritesheet2.prototype._processAnimations = function() {
      var animations = this.data.animations || {};
      for (var animName in animations) {
        this.animations[animName] = [];
        for (var i = 0; i < animations[animName].length; i++) {
          var frameName = animations[animName][i];
          this.animations[animName].push(this.textures[frameName]);
        }
      }
    };
    Spritesheet2.prototype._parseComplete = function() {
      var callback = this._callback;
      this._callback = null;
      this._batchIndex = 0;
      callback.call(this, this.textures);
    };
    Spritesheet2.prototype._nextBatch = function() {
      var _this = this;
      this._processFrames(this._batchIndex * Spritesheet2.BATCH_SIZE);
      this._batchIndex++;
      setTimeout(function() {
        if (_this._batchIndex * Spritesheet2.BATCH_SIZE < _this._frameKeys.length) {
          _this._nextBatch();
        } else {
          _this._processAnimations();
          _this._parseComplete();
        }
      }, 0);
    };
    Spritesheet2.prototype.destroy = function(destroyBase) {
      var _a2;
      if (destroyBase === void 0) {
        destroyBase = false;
      }
      for (var i in this.textures) {
        this.textures[i].destroy();
      }
      this._frames = null;
      this._frameKeys = null;
      this.data = null;
      this.textures = null;
      if (destroyBase) {
        (_a2 = this._texture) === null || _a2 === void 0 ? void 0 : _a2.destroy();
        this.baseTexture.destroy();
      }
      this._texture = null;
      this.baseTexture = null;
    };
    Spritesheet2.BATCH_SIZE = 1e3;
    return Spritesheet2;
  }();
  var SpritesheetLoader = function() {
    function SpritesheetLoader2() {
    }
    SpritesheetLoader2.use = function(resource, next) {
      var loader = this;
      var imageResourceName = resource.name + "_image";
      if (!resource.data || resource.type !== LoaderResource.TYPE.JSON || !resource.data.frames || loader.resources[imageResourceName]) {
        next();
        return;
      }
      var loadOptions = {
        crossOrigin: resource.crossOrigin,
        metadata: resource.metadata.imageMetadata,
        parentResource: resource
      };
      var resourcePath = SpritesheetLoader2.getResourcePath(resource, loader.baseUrl);
      loader.add(imageResourceName, resourcePath, loadOptions, function onImageLoad(res) {
        if (res.error) {
          next(res.error);
          return;
        }
        var spritesheet2 = new Spritesheet(res.texture, resource.data, resource.url);
        spritesheet2.parse(function() {
          resource.spritesheet = spritesheet2;
          resource.textures = spritesheet2.textures;
          next();
        });
      });
    };
    SpritesheetLoader2.getResourcePath = function(resource, baseUrl) {
      if (resource.isDataUrl) {
        return resource.data.meta.image;
      }
      return url2.default.resolve(resource.url.replace(baseUrl, ""), resource.data.meta.image);
    };
    return SpritesheetLoader2;
  }();

  // node_modules/@pixi/sprite-tiling/lib/sprite-tiling.es.js
  /*!
   * @pixi/sprite-tiling - v5.3.3
   * Compiled Tue, 04 Aug 2020 16:23:09 UTC
   *
   * @pixi/sprite-tiling is licensed under the MIT License.
   * http://www.opensource.org/licenses/mit-license
   */
  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation. All rights reserved.
  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at http://www.apache.org/licenses/LICENSE-2.0
  
  THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
  WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
  MERCHANTABLITY OR NON-INFRINGEMENT.
  
  See the Apache Version 2.0 License for specific language governing permissions
  and limitations under the License.
  ***************************************************************************** */
  var extendStatics10 = function(d, b) {
    extendStatics10 = Object.setPrototypeOf || {__proto__: []} instanceof Array && function(d2, b2) {
      d2.__proto__ = b2;
    } || function(d2, b2) {
      for (var p in b2) {
        if (b2.hasOwnProperty(p)) {
          d2[p] = b2[p];
        }
      }
    };
    return extendStatics10(d, b);
  };
  function __extends10(d, b) {
    extendStatics10(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  }
  var tempPoint2 = new Point();
  var TilingSprite = function(_super) {
    __extends10(TilingSprite2, _super);
    function TilingSprite2(texture, width, height) {
      if (width === void 0) {
        width = 100;
      }
      if (height === void 0) {
        height = 100;
      }
      var _this = _super.call(this, texture) || this;
      _this.tileTransform = new Transform();
      _this._width = width;
      _this._height = height;
      _this.uvMatrix = texture.uvMatrix || new TextureMatrix(texture);
      _this.pluginName = "tilingSprite";
      _this.uvRespectAnchor = false;
      return _this;
    }
    Object.defineProperty(TilingSprite2.prototype, "clampMargin", {
      get: function() {
        return this.uvMatrix.clampMargin;
      },
      set: function(value) {
        this.uvMatrix.clampMargin = value;
        this.uvMatrix.update(true);
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TilingSprite2.prototype, "tileScale", {
      get: function() {
        return this.tileTransform.scale;
      },
      set: function(value) {
        this.tileTransform.scale.copyFrom(value);
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TilingSprite2.prototype, "tilePosition", {
      get: function() {
        return this.tileTransform.position;
      },
      set: function(value) {
        this.tileTransform.position.copyFrom(value);
      },
      enumerable: false,
      configurable: true
    });
    TilingSprite2.prototype._onTextureUpdate = function() {
      if (this.uvMatrix) {
        this.uvMatrix.texture = this._texture;
      }
      this._cachedTint = 16777215;
    };
    TilingSprite2.prototype._render = function(renderer) {
      var texture = this._texture;
      if (!texture || !texture.valid) {
        return;
      }
      this.tileTransform.updateLocalTransform();
      this.uvMatrix.update();
      renderer.batch.setObjectRenderer(renderer.plugins[this.pluginName]);
      renderer.plugins[this.pluginName].render(this);
    };
    TilingSprite2.prototype._calculateBounds = function() {
      var minX = this._width * -this._anchor._x;
      var minY = this._height * -this._anchor._y;
      var maxX = this._width * (1 - this._anchor._x);
      var maxY = this._height * (1 - this._anchor._y);
      this._bounds.addFrame(this.transform, minX, minY, maxX, maxY);
    };
    TilingSprite2.prototype.getLocalBounds = function(rect) {
      if (this.children.length === 0) {
        this._bounds.minX = this._width * -this._anchor._x;
        this._bounds.minY = this._height * -this._anchor._y;
        this._bounds.maxX = this._width * (1 - this._anchor._x);
        this._bounds.maxY = this._height * (1 - this._anchor._y);
        if (!rect) {
          if (!this._localBoundsRect) {
            this._localBoundsRect = new Rectangle();
          }
          rect = this._localBoundsRect;
        }
        return this._bounds.getRectangle(rect);
      }
      return _super.prototype.getLocalBounds.call(this, rect);
    };
    TilingSprite2.prototype.containsPoint = function(point) {
      this.worldTransform.applyInverse(point, tempPoint2);
      var width = this._width;
      var height = this._height;
      var x1 = -width * this.anchor._x;
      if (tempPoint2.x >= x1 && tempPoint2.x < x1 + width) {
        var y1 = -height * this.anchor._y;
        if (tempPoint2.y >= y1 && tempPoint2.y < y1 + height) {
          return true;
        }
      }
      return false;
    };
    TilingSprite2.prototype.destroy = function(options) {
      _super.prototype.destroy.call(this, options);
      this.tileTransform = null;
      this.uvMatrix = null;
    };
    TilingSprite2.from = function(source, options) {
      if (typeof options === "number") {
        deprecation("5.3.0", "TilingSprite.from use options instead of width and height args");
        options = {width: options, height: arguments[2]};
      }
      return new TilingSprite2(Texture.from(source, options), options.width, options.height);
    };
    Object.defineProperty(TilingSprite2.prototype, "width", {
      get: function() {
        return this._width;
      },
      set: function(value) {
        this._width = value;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TilingSprite2.prototype, "height", {
      get: function() {
        return this._height;
      },
      set: function(value) {
        this._height = value;
      },
      enumerable: false,
      configurable: true
    });
    return TilingSprite2;
  }(Sprite);
  var vertex3 = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\nuniform mat3 translationMatrix;\nuniform mat3 uTransform;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n\n    vTextureCoord = (uTransform * vec3(aTextureCoord, 1.0)).xy;\n}\n";
  var fragment3 = "varying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform vec4 uColor;\nuniform mat3 uMapCoord;\nuniform vec4 uClampFrame;\nuniform vec2 uClampOffset;\n\nvoid main(void)\n{\n    vec2 coord = vTextureCoord - floor(vTextureCoord - uClampOffset);\n    coord = (uMapCoord * vec3(coord, 1.0)).xy;\n    coord = clamp(coord, uClampFrame.xy, uClampFrame.zw);\n\n    vec4 texSample = texture2D(uSampler, coord);\n    gl_FragColor = texSample * uColor;\n}\n";
  var fragmentSimple = "varying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform vec4 uColor;\n\nvoid main(void)\n{\n    vec4 sample = texture2D(uSampler, vTextureCoord);\n    gl_FragColor = sample * uColor;\n}\n";
  var tempMat2 = new Matrix();
  var TilingSpriteRenderer = function(_super) {
    __extends10(TilingSpriteRenderer2, _super);
    function TilingSpriteRenderer2(renderer) {
      var _this = _super.call(this, renderer) || this;
      var uniforms = {globals: _this.renderer.globalUniforms};
      _this.shader = Shader.from(vertex3, fragment3, uniforms);
      _this.simpleShader = Shader.from(vertex3, fragmentSimple, uniforms);
      _this.quad = new QuadUv();
      _this.state = State.for2d();
      return _this;
    }
    TilingSpriteRenderer2.prototype.render = function(ts) {
      var renderer = this.renderer;
      var quad = this.quad;
      var vertices = quad.vertices;
      vertices[0] = vertices[6] = ts._width * -ts.anchor.x;
      vertices[1] = vertices[3] = ts._height * -ts.anchor.y;
      vertices[2] = vertices[4] = ts._width * (1 - ts.anchor.x);
      vertices[5] = vertices[7] = ts._height * (1 - ts.anchor.y);
      if (ts.uvRespectAnchor) {
        vertices = quad.uvs;
        vertices[0] = vertices[6] = -ts.anchor.x;
        vertices[1] = vertices[3] = -ts.anchor.y;
        vertices[2] = vertices[4] = 1 - ts.anchor.x;
        vertices[5] = vertices[7] = 1 - ts.anchor.y;
      }
      quad.invalidate();
      var tex = ts._texture;
      var baseTex = tex.baseTexture;
      var lt = ts.tileTransform.localTransform;
      var uv = ts.uvMatrix;
      var isSimple = baseTex.isPowerOfTwo && tex.frame.width === baseTex.width && tex.frame.height === baseTex.height;
      if (isSimple) {
        if (!baseTex._glTextures[renderer.CONTEXT_UID]) {
          if (baseTex.wrapMode === WRAP_MODES.CLAMP) {
            baseTex.wrapMode = WRAP_MODES.REPEAT;
          }
        } else {
          isSimple = baseTex.wrapMode !== WRAP_MODES.CLAMP;
        }
      }
      var shader = isSimple ? this.simpleShader : this.shader;
      var w = tex.width;
      var h = tex.height;
      var W = ts._width;
      var H = ts._height;
      tempMat2.set(lt.a * w / W, lt.b * w / H, lt.c * h / W, lt.d * h / H, lt.tx / W, lt.ty / H);
      tempMat2.invert();
      if (isSimple) {
        tempMat2.prepend(uv.mapCoord);
      } else {
        shader.uniforms.uMapCoord = uv.mapCoord.toArray(true);
        shader.uniforms.uClampFrame = uv.uClampFrame;
        shader.uniforms.uClampOffset = uv.uClampOffset;
      }
      shader.uniforms.uTransform = tempMat2.toArray(true);
      shader.uniforms.uColor = premultiplyTintToRgba(ts.tint, ts.worldAlpha, shader.uniforms.uColor, baseTex.alphaMode);
      shader.uniforms.translationMatrix = ts.transform.worldTransform.toArray(true);
      shader.uniforms.uSampler = tex;
      renderer.shader.bind(shader);
      renderer.geometry.bind(quad);
      this.state.blendMode = correctBlendMode(ts.blendMode, baseTex.alphaMode);
      renderer.state.set(this.state);
      renderer.geometry.draw(this.renderer.gl.TRIANGLES, 6, 0);
    };
    return TilingSpriteRenderer2;
  }(ObjectRenderer);

  // node_modules/@pixi/mesh/lib/mesh.es.js
  /*!
   * @pixi/mesh - v5.3.3
   * Compiled Tue, 04 Aug 2020 16:23:09 UTC
   *
   * @pixi/mesh is licensed under the MIT License.
   * http://www.opensource.org/licenses/mit-license
   */
  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation. All rights reserved.
  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at http://www.apache.org/licenses/LICENSE-2.0
  
  THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
  WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
  MERCHANTABLITY OR NON-INFRINGEMENT.
  
  See the Apache Version 2.0 License for specific language governing permissions
  and limitations under the License.
  ***************************************************************************** */
  var extendStatics11 = function(d, b) {
    extendStatics11 = Object.setPrototypeOf || {__proto__: []} instanceof Array && function(d2, b2) {
      d2.__proto__ = b2;
    } || function(d2, b2) {
      for (var p in b2) {
        if (b2.hasOwnProperty(p)) {
          d2[p] = b2[p];
        }
      }
    };
    return extendStatics11(d, b);
  };
  function __extends11(d, b) {
    extendStatics11(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  }
  var MeshBatchUvs = function() {
    function MeshBatchUvs2(uvBuffer, uvMatrix) {
      this.uvBuffer = uvBuffer;
      this.uvMatrix = uvMatrix;
      this.data = null;
      this._bufferUpdateId = -1;
      this._textureUpdateId = -1;
      this._updateID = 0;
    }
    MeshBatchUvs2.prototype.update = function(forceUpdate) {
      if (!forceUpdate && this._bufferUpdateId === this.uvBuffer._updateID && this._textureUpdateId === this.uvMatrix._updateID) {
        return;
      }
      this._bufferUpdateId = this.uvBuffer._updateID;
      this._textureUpdateId = this.uvMatrix._updateID;
      var data = this.uvBuffer.data;
      if (!this.data || this.data.length !== data.length) {
        this.data = new Float32Array(data.length);
      }
      this.uvMatrix.multiplyUvs(data, this.data);
      this._updateID++;
    };
    return MeshBatchUvs2;
  }();
  var tempPoint3 = new Point();
  var tempPolygon = new Polygon();
  var Mesh = function(_super) {
    __extends11(Mesh2, _super);
    function Mesh2(geometry, shader, state, drawMode) {
      if (drawMode === void 0) {
        drawMode = DRAW_MODES.TRIANGLES;
      }
      var _this = _super.call(this) || this;
      _this.geometry = geometry;
      geometry.refCount++;
      _this.shader = shader;
      _this.state = state || State.for2d();
      _this.drawMode = drawMode;
      _this.start = 0;
      _this.size = 0;
      _this.uvs = null;
      _this.indices = null;
      _this.vertexData = new Float32Array(1);
      _this.vertexDirty = 0;
      _this._transformID = -1;
      _this.tint = 16777215;
      _this.blendMode = BLEND_MODES.NORMAL;
      _this._roundPixels = settings.ROUND_PIXELS;
      _this.batchUvs = null;
      return _this;
    }
    Object.defineProperty(Mesh2.prototype, "uvBuffer", {
      get: function() {
        return this.geometry.buffers[1];
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Mesh2.prototype, "verticesBuffer", {
      get: function() {
        return this.geometry.buffers[0];
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Mesh2.prototype, "material", {
      get: function() {
        return this.shader;
      },
      set: function(value) {
        this.shader = value;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Mesh2.prototype, "blendMode", {
      get: function() {
        return this.state.blendMode;
      },
      set: function(value) {
        this.state.blendMode = value;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Mesh2.prototype, "roundPixels", {
      get: function() {
        return this._roundPixels;
      },
      set: function(value) {
        if (this._roundPixels !== value) {
          this._transformID = -1;
        }
        this._roundPixels = value;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Mesh2.prototype, "tint", {
      get: function() {
        return this.shader.tint;
      },
      set: function(value) {
        this.shader.tint = value;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Mesh2.prototype, "texture", {
      get: function() {
        return this.shader.texture;
      },
      set: function(value) {
        this.shader.texture = value;
      },
      enumerable: false,
      configurable: true
    });
    Mesh2.prototype._render = function(renderer) {
      var vertices = this.geometry.buffers[0].data;
      if (this.shader.batchable && this.drawMode === DRAW_MODES.TRIANGLES && vertices.length < Mesh2.BATCHABLE_SIZE * 2) {
        this._renderToBatch(renderer);
      } else {
        this._renderDefault(renderer);
      }
    };
    Mesh2.prototype._renderDefault = function(renderer) {
      var shader = this.shader;
      shader.alpha = this.worldAlpha;
      if (shader.update) {
        shader.update();
      }
      renderer.batch.flush();
      if (shader.program.uniformData.translationMatrix) {
        shader.uniforms.translationMatrix = this.transform.worldTransform.toArray(true);
      }
      renderer.shader.bind(shader);
      renderer.state.set(this.state);
      renderer.geometry.bind(this.geometry, shader);
      renderer.geometry.draw(this.drawMode, this.size, this.start, this.geometry.instanceCount);
    };
    Mesh2.prototype._renderToBatch = function(renderer) {
      var geometry = this.geometry;
      if (this.shader.uvMatrix) {
        this.shader.uvMatrix.update();
        this.calculateUvs();
      }
      this.calculateVertices();
      this.indices = geometry.indexBuffer.data;
      this._tintRGB = this.shader._tintRGB;
      this._texture = this.shader.texture;
      var pluginName = this.material.pluginName;
      renderer.batch.setObjectRenderer(renderer.plugins[pluginName]);
      renderer.plugins[pluginName].render(this);
    };
    Mesh2.prototype.calculateVertices = function() {
      var geometry = this.geometry;
      var vertices = geometry.buffers[0].data;
      if (geometry.vertexDirtyId === this.vertexDirty && this._transformID === this.transform._worldID) {
        return;
      }
      this._transformID = this.transform._worldID;
      if (this.vertexData.length !== vertices.length) {
        this.vertexData = new Float32Array(vertices.length);
      }
      var wt = this.transform.worldTransform;
      var a = wt.a;
      var b = wt.b;
      var c = wt.c;
      var d = wt.d;
      var tx = wt.tx;
      var ty = wt.ty;
      var vertexData = this.vertexData;
      for (var i = 0; i < vertexData.length / 2; i++) {
        var x = vertices[i * 2];
        var y = vertices[i * 2 + 1];
        vertexData[i * 2] = a * x + c * y + tx;
        vertexData[i * 2 + 1] = b * x + d * y + ty;
      }
      if (this._roundPixels) {
        var resolution = settings.RESOLUTION;
        for (var i = 0; i < vertexData.length; ++i) {
          vertexData[i] = Math.round((vertexData[i] * resolution | 0) / resolution);
        }
      }
      this.vertexDirty = geometry.vertexDirtyId;
    };
    Mesh2.prototype.calculateUvs = function() {
      var geomUvs = this.geometry.buffers[1];
      if (!this.shader.uvMatrix.isSimple) {
        if (!this.batchUvs) {
          this.batchUvs = new MeshBatchUvs(geomUvs, this.shader.uvMatrix);
        }
        this.batchUvs.update();
        this.uvs = this.batchUvs.data;
      } else {
        this.uvs = geomUvs.data;
      }
    };
    Mesh2.prototype._calculateBounds = function() {
      this.calculateVertices();
      this._bounds.addVertexData(this.vertexData, 0, this.vertexData.length);
    };
    Mesh2.prototype.containsPoint = function(point) {
      if (!this.getBounds().contains(point.x, point.y)) {
        return false;
      }
      this.worldTransform.applyInverse(point, tempPoint3);
      var vertices = this.geometry.getBuffer("aVertexPosition").data;
      var points = tempPolygon.points;
      var indices2 = this.geometry.getIndex().data;
      var len = indices2.length;
      var step = this.drawMode === 4 ? 3 : 1;
      for (var i = 0; i + 2 < len; i += step) {
        var ind0 = indices2[i] * 2;
        var ind1 = indices2[i + 1] * 2;
        var ind2 = indices2[i + 2] * 2;
        points[0] = vertices[ind0];
        points[1] = vertices[ind0 + 1];
        points[2] = vertices[ind1];
        points[3] = vertices[ind1 + 1];
        points[4] = vertices[ind2];
        points[5] = vertices[ind2 + 1];
        if (tempPolygon.contains(tempPoint3.x, tempPoint3.y)) {
          return true;
        }
      }
      return false;
    };
    Mesh2.prototype.destroy = function(options) {
      _super.prototype.destroy.call(this, options);
      this.geometry.refCount--;
      if (this.geometry.refCount === 0) {
        this.geometry.dispose();
      }
      this.geometry = null;
      this.shader = null;
      this.state = null;
      this.uvs = null;
      this.indices = null;
      this.vertexData = null;
    };
    Mesh2.BATCHABLE_SIZE = 100;
    return Mesh2;
  }(Container);
  var fragment4 = "varying vec2 vTextureCoord;\nuniform vec4 uColor;\n\nuniform sampler2D uSampler;\n\nvoid main(void)\n{\n    gl_FragColor = texture2D(uSampler, vTextureCoord) * uColor;\n}\n";
  var vertex4 = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\nuniform mat3 translationMatrix;\nuniform mat3 uTextureMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n\n    vTextureCoord = (uTextureMatrix * vec3(aTextureCoord, 1.0)).xy;\n}\n";
  var MeshMaterial = function(_super) {
    __extends11(MeshMaterial2, _super);
    function MeshMaterial2(uSampler, options) {
      var _this = this;
      var uniforms = {
        uSampler,
        alpha: 1,
        uTextureMatrix: Matrix.IDENTITY,
        uColor: new Float32Array([1, 1, 1, 1])
      };
      options = Object.assign({
        tint: 16777215,
        alpha: 1,
        pluginName: "batch"
      }, options);
      if (options.uniforms) {
        Object.assign(uniforms, options.uniforms);
      }
      _this = _super.call(this, options.program || Program.from(vertex4, fragment4), uniforms) || this;
      _this._colorDirty = false;
      _this.uvMatrix = new TextureMatrix(uSampler);
      _this.batchable = options.program === void 0;
      _this.pluginName = options.pluginName;
      _this.tint = options.tint;
      _this.alpha = options.alpha;
      return _this;
    }
    Object.defineProperty(MeshMaterial2.prototype, "texture", {
      get: function() {
        return this.uniforms.uSampler;
      },
      set: function(value) {
        if (this.uniforms.uSampler !== value) {
          this.uniforms.uSampler = value;
          this.uvMatrix.texture = value;
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(MeshMaterial2.prototype, "alpha", {
      get: function() {
        return this._alpha;
      },
      set: function(value) {
        if (value === this._alpha) {
          return;
        }
        this._alpha = value;
        this._colorDirty = true;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(MeshMaterial2.prototype, "tint", {
      get: function() {
        return this._tint;
      },
      set: function(value) {
        if (value === this._tint) {
          return;
        }
        this._tint = value;
        this._tintRGB = (value >> 16) + (value & 65280) + ((value & 255) << 16);
        this._colorDirty = true;
      },
      enumerable: false,
      configurable: true
    });
    MeshMaterial2.prototype.update = function() {
      if (this._colorDirty) {
        this._colorDirty = false;
        var baseTexture = this.texture.baseTexture;
        premultiplyTintToRgba(this._tint, this._alpha, this.uniforms.uColor, baseTexture.alphaMode);
      }
      if (this.uvMatrix.update()) {
        this.uniforms.uTextureMatrix = this.uvMatrix.mapCoord;
      }
    };
    return MeshMaterial2;
  }(Shader);
  var MeshGeometry = function(_super) {
    __extends11(MeshGeometry2, _super);
    function MeshGeometry2(vertices, uvs, index2) {
      var _this = _super.call(this) || this;
      var verticesBuffer = new Buffer2(vertices);
      var uvsBuffer = new Buffer2(uvs, true);
      var indexBuffer = new Buffer2(index2, true, true);
      _this.addAttribute("aVertexPosition", verticesBuffer, 2, false, TYPES.FLOAT).addAttribute("aTextureCoord", uvsBuffer, 2, false, TYPES.FLOAT).addIndex(indexBuffer);
      _this._updateId = -1;
      return _this;
    }
    Object.defineProperty(MeshGeometry2.prototype, "vertexDirtyId", {
      get: function() {
        return this.buffers[0]._updateID;
      },
      enumerable: false,
      configurable: true
    });
    return MeshGeometry2;
  }(Geometry);

  // node_modules/@pixi/text-bitmap/lib/text-bitmap.es.js
  /*!
   * @pixi/text-bitmap - v5.3.3
   * Compiled Tue, 04 Aug 2020 16:23:09 UTC
   *
   * @pixi/text-bitmap is licensed under the MIT License.
   * http://www.opensource.org/licenses/mit-license
   */
  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation. All rights reserved.
  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at http://www.apache.org/licenses/LICENSE-2.0
  
  THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
  WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
  MERCHANTABLITY OR NON-INFRINGEMENT.
  
  See the Apache Version 2.0 License for specific language governing permissions
  and limitations under the License.
  ***************************************************************************** */
  var extendStatics12 = function(d, b) {
    extendStatics12 = Object.setPrototypeOf || {__proto__: []} instanceof Array && function(d2, b2) {
      d2.__proto__ = b2;
    } || function(d2, b2) {
      for (var p in b2) {
        if (b2.hasOwnProperty(p)) {
          d2[p] = b2[p];
        }
      }
    };
    return extendStatics12(d, b);
  };
  function __extends12(d, b) {
    extendStatics12(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  }
  var BitmapFontData = function() {
    function BitmapFontData2() {
      this.info = [];
      this.common = [];
      this.page = [];
      this.char = [];
      this.kerning = [];
    }
    return BitmapFontData2;
  }();
  var TextFormat = function() {
    function TextFormat2() {
    }
    TextFormat2.test = function(data) {
      return typeof data === "string" && data.indexOf("info face=") === 0;
    };
    TextFormat2.parse = function(txt) {
      var items = txt.match(/^[a-z]+\s+.+$/gm);
      var rawData = {
        info: [],
        common: [],
        page: [],
        char: [],
        chars: [],
        kerning: []
      };
      for (var i in items) {
        var name = items[i].match(/^[a-z]+/gm)[0];
        var attributeList = items[i].match(/[a-zA-Z]+=([^\s"']+|"([^"]*)")/gm);
        var itemData = {};
        for (var i_1 in attributeList) {
          var split = attributeList[i_1].split("=");
          var key = split[0];
          var strValue = split[1].replace(/"/gm, "");
          var floatValue = parseFloat(strValue);
          var value = isNaN(floatValue) ? strValue : floatValue;
          itemData[key] = value;
        }
        rawData[name].push(itemData);
      }
      var font = new BitmapFontData();
      rawData.info.forEach(function(info) {
        return font.info.push({
          face: info.face,
          size: parseInt(info.size, 10)
        });
      });
      rawData.common.forEach(function(common) {
        return font.common.push({
          lineHeight: parseInt(common.lineHeight, 10)
        });
      });
      rawData.page.forEach(function(page) {
        return font.page.push({
          id: parseInt(page.id, 10),
          file: page.file
        });
      });
      rawData.char.forEach(function(char) {
        return font.char.push({
          id: parseInt(char.id, 10),
          page: parseInt(char.page, 10),
          x: parseInt(char.x, 10),
          y: parseInt(char.y, 10),
          width: parseInt(char.width, 10),
          height: parseInt(char.height, 10),
          xoffset: parseInt(char.xoffset, 10),
          yoffset: parseInt(char.yoffset, 10),
          xadvance: parseInt(char.xadvance, 10)
        });
      });
      rawData.kerning.forEach(function(kerning) {
        return font.kerning.push({
          first: parseInt(kerning.first, 10),
          second: parseInt(kerning.second, 10),
          amount: parseInt(kerning.amount, 10)
        });
      });
      return font;
    };
    return TextFormat2;
  }();
  var XMLFormat = function() {
    function XMLFormat2() {
    }
    XMLFormat2.test = function(data) {
      return data instanceof XMLDocument && data.getElementsByTagName("page").length && data.getElementsByTagName("info")[0].getAttribute("face") !== null;
    };
    XMLFormat2.parse = function(xml) {
      var data = new BitmapFontData();
      var info = xml.getElementsByTagName("info");
      var common = xml.getElementsByTagName("common");
      var page = xml.getElementsByTagName("page");
      var char = xml.getElementsByTagName("char");
      var kerning = xml.getElementsByTagName("kerning");
      for (var i = 0; i < info.length; i++) {
        data.info.push({
          face: info[i].getAttribute("face"),
          size: parseInt(info[i].getAttribute("size"), 10)
        });
      }
      for (var i = 0; i < common.length; i++) {
        data.common.push({
          lineHeight: parseInt(common[i].getAttribute("lineHeight"), 10)
        });
      }
      for (var i = 0; i < page.length; i++) {
        data.page.push({
          id: parseInt(page[i].getAttribute("id"), 10) || 0,
          file: page[i].getAttribute("file")
        });
      }
      for (var i = 0; i < char.length; i++) {
        var letter = char[i];
        data.char.push({
          id: parseInt(letter.getAttribute("id"), 10),
          page: parseInt(letter.getAttribute("page"), 10) || 0,
          x: parseInt(letter.getAttribute("x"), 10),
          y: parseInt(letter.getAttribute("y"), 10),
          width: parseInt(letter.getAttribute("width"), 10),
          height: parseInt(letter.getAttribute("height"), 10),
          xoffset: parseInt(letter.getAttribute("xoffset"), 10),
          yoffset: parseInt(letter.getAttribute("yoffset"), 10),
          xadvance: parseInt(letter.getAttribute("xadvance"), 10)
        });
      }
      for (var i = 0; i < kerning.length; i++) {
        data.kerning.push({
          first: parseInt(kerning[i].getAttribute("first"), 10),
          second: parseInt(kerning[i].getAttribute("second"), 10),
          amount: parseInt(kerning[i].getAttribute("amount"), 10)
        });
      }
      return data;
    };
    return XMLFormat2;
  }();
  var formats = [
    TextFormat,
    XMLFormat
  ];
  function autoDetectFormat(data) {
    for (var i = 0; i < formats.length; i++) {
      if (formats[i].test(data)) {
        return formats[i];
      }
    }
    return null;
  }
  function generateFillStyle(canvas2, context2, style, resolution, lines, metrics) {
    var fillStyle = style.fill;
    if (!Array.isArray(fillStyle)) {
      return fillStyle;
    } else if (fillStyle.length === 1) {
      return fillStyle[0];
    }
    var gradient;
    var dropShadowCorrection = style.dropShadow ? style.dropShadowDistance : 0;
    var padding = style.padding || 0;
    var width = Math.ceil(canvas2.width / resolution) - dropShadowCorrection - padding * 2;
    var height = Math.ceil(canvas2.height / resolution) - dropShadowCorrection - padding * 2;
    var fill = fillStyle.slice();
    var fillGradientStops = style.fillGradientStops.slice();
    if (!fillGradientStops.length) {
      var lengthPlus1 = fill.length + 1;
      for (var i = 1; i < lengthPlus1; ++i) {
        fillGradientStops.push(i / lengthPlus1);
      }
    }
    fill.unshift(fillStyle[0]);
    fillGradientStops.unshift(0);
    fill.push(fillStyle[fillStyle.length - 1]);
    fillGradientStops.push(1);
    if (style.fillGradientType === TEXT_GRADIENT.LINEAR_VERTICAL) {
      gradient = context2.createLinearGradient(width / 2, padding, width / 2, height + padding);
      var lastIterationStop = 0;
      var textHeight = metrics.fontProperties.fontSize + style.strokeThickness;
      var gradStopLineHeight = textHeight / height;
      for (var i = 0; i < lines.length; i++) {
        var thisLineTop = metrics.lineHeight * i;
        for (var j = 0; j < fill.length; j++) {
          var lineStop = 0;
          if (typeof fillGradientStops[j] === "number") {
            lineStop = fillGradientStops[j];
          } else {
            lineStop = j / fill.length;
          }
          var globalStop = thisLineTop / height + lineStop * gradStopLineHeight;
          var clampedStop = Math.max(lastIterationStop, globalStop);
          clampedStop = Math.min(clampedStop, 1);
          gradient.addColorStop(clampedStop, fill[j]);
          lastIterationStop = clampedStop;
        }
      }
    } else {
      gradient = context2.createLinearGradient(padding, height / 2, width + padding, height / 2);
      var totalIterations = fill.length + 1;
      var currentIteration = 1;
      for (var i = 0; i < fill.length; i++) {
        var stop = void 0;
        if (typeof fillGradientStops[i] === "number") {
          stop = fillGradientStops[i];
        } else {
          stop = currentIteration / totalIterations;
        }
        gradient.addColorStop(stop, fill[i]);
        currentIteration++;
      }
    }
    return gradient;
  }
  function drawGlyph(canvas2, context2, metrics, x, y, resolution, style) {
    var char = metrics.text;
    var fontProperties = metrics.fontProperties;
    context2.translate(x, y);
    context2.scale(resolution, resolution);
    var tx = style.strokeThickness / 2;
    var ty = -(style.strokeThickness / 2);
    context2.font = style.toFontString();
    context2.lineWidth = style.strokeThickness;
    context2.textBaseline = style.textBaseline;
    context2.lineJoin = style.lineJoin;
    context2.miterLimit = style.miterLimit;
    context2.fillStyle = generateFillStyle(canvas2, context2, style, resolution, [char], metrics);
    context2.strokeStyle = style.stroke;
    context2.font = style.toFontString();
    context2.lineWidth = style.strokeThickness;
    context2.textBaseline = style.textBaseline;
    context2.lineJoin = style.lineJoin;
    context2.miterLimit = style.miterLimit;
    context2.fillStyle = generateFillStyle(canvas2, context2, style, resolution, [char], metrics);
    context2.strokeStyle = style.stroke;
    var dropShadowColor = style.dropShadowColor;
    var rgb = hex2rgb(typeof dropShadowColor === "number" ? dropShadowColor : string2hex(dropShadowColor));
    if (style.dropShadow) {
      context2.shadowColor = "rgba(" + rgb[0] * 255 + "," + rgb[1] * 255 + "," + rgb[2] * 255 + "," + style.dropShadowAlpha + ")";
      context2.shadowBlur = style.dropShadowBlur;
      context2.shadowOffsetX = Math.cos(style.dropShadowAngle) * style.dropShadowDistance;
      context2.shadowOffsetY = Math.sin(style.dropShadowAngle) * style.dropShadowDistance;
    } else {
      context2.shadowColor = "0";
      context2.shadowBlur = 0;
      context2.shadowOffsetX = 0;
      context2.shadowOffsetY = 0;
    }
    if (style.stroke && style.strokeThickness) {
      context2.strokeText(char, tx, ty + metrics.lineHeight - fontProperties.descent);
    }
    if (style.fill) {
      context2.fillText(char, tx, ty + metrics.lineHeight - fontProperties.descent);
    }
    context2.setTransform();
    context2.fillStyle = "rgba(0, 0, 0, 0)";
  }
  function resolveCharacters(chars) {
    if (typeof chars === "string") {
      chars = [chars];
    }
    var result = [];
    for (var i = 0, j = chars.length; i < j; i++) {
      var item = chars[i];
      if (Array.isArray(item)) {
        if (item.length !== 2) {
          throw new Error("[BitmapFont]: Invalid character range length, expecting 2 got " + item.length + ".");
        }
        var startCode = item[0].charCodeAt(0);
        var endCode = item[1].charCodeAt(0);
        if (endCode < startCode) {
          throw new Error("[BitmapFont]: Invalid character range.");
        }
        for (var i_1 = startCode, j_1 = endCode; i_1 <= j_1; i_1++) {
          result.push(String.fromCharCode(i_1));
        }
      } else {
        result.push.apply(result, item.split(""));
      }
    }
    if (result.length === 0) {
      throw new Error("[BitmapFont]: Empty set when resolving characters.");
    }
    return result;
  }
  var BitmapFont = function() {
    function BitmapFont2(data, textures) {
      var info = data.info[0];
      var common = data.common[0];
      var page = data.page[0];
      var res = getResolutionOfUrl(page.file);
      var pageTextures = {};
      this.font = info.face;
      this.size = info.size;
      this.lineHeight = common.lineHeight / res;
      this.chars = {};
      this.pageTextures = pageTextures;
      for (var i = 0; i < data.page.length; i++) {
        var _a2 = data.page[i], id = _a2.id, file = _a2.file;
        pageTextures[id] = textures instanceof Array ? textures[i] : textures[file];
      }
      for (var i = 0; i < data.char.length; i++) {
        var _b = data.char[i], id = _b.id, page_1 = _b.page;
        var _c = data.char[i], x = _c.x, y = _c.y, width = _c.width, height = _c.height, xoffset = _c.xoffset, yoffset = _c.yoffset, xadvance = _c.xadvance;
        x /= res;
        y /= res;
        width /= res;
        height /= res;
        xoffset /= res;
        yoffset /= res;
        xadvance /= res;
        var rect = new Rectangle(x + pageTextures[page_1].frame.x / res, y + pageTextures[page_1].frame.y / res, width, height);
        this.chars[id] = {
          xOffset: xoffset,
          yOffset: yoffset,
          xAdvance: xadvance,
          kerning: {},
          texture: new Texture(pageTextures[page_1].baseTexture, rect),
          page: page_1
        };
      }
      for (var i = 0; i < data.kerning.length; i++) {
        var _d = data.kerning[i], first = _d.first, second = _d.second, amount = _d.amount;
        first /= res;
        second /= res;
        amount /= res;
        if (this.chars[second]) {
          this.chars[second].kerning[first] = amount;
        }
      }
    }
    BitmapFont2.prototype.destroy = function() {
      for (var id in this.chars) {
        this.chars[id].texture.destroy();
        this.chars[id].texture = null;
      }
      for (var id in this.pageTextures) {
        this.pageTextures[id].destroy(true);
        this.pageTextures[id] = null;
      }
      this.chars = null;
      this.pageTextures = null;
    };
    BitmapFont2.install = function(data, textures) {
      var fontData;
      if (data instanceof BitmapFontData) {
        fontData = data;
      } else {
        var format = autoDetectFormat(data);
        if (!format) {
          throw new Error("Unrecognized data format for font.");
        }
        fontData = format.parse(data);
      }
      if (textures instanceof Texture) {
        textures = [textures];
      }
      var font = new BitmapFont2(fontData, textures);
      BitmapFont2.available[font.font] = font;
      return font;
    };
    BitmapFont2.uninstall = function(name) {
      var font = BitmapFont2.available[name];
      if (!font) {
        throw new Error("No font found named '" + name + "'");
      }
      font.destroy();
      delete BitmapFont2.available[name];
    };
    BitmapFont2.from = function(name, textStyle, options) {
      if (!name) {
        throw new Error("[BitmapFont] Property `name` is required.");
      }
      var _a2 = Object.assign({}, BitmapFont2.defaultOptions, options), chars = _a2.chars, padding = _a2.padding, resolution = _a2.resolution, textureWidth = _a2.textureWidth, textureHeight = _a2.textureHeight;
      var charsList = resolveCharacters(chars);
      var style = textStyle instanceof TextStyle ? textStyle : new TextStyle(textStyle);
      var lineWidth = textureWidth;
      var fontData = new BitmapFontData();
      fontData.info[0] = {
        face: style.fontFamily,
        size: style.fontSize
      };
      fontData.common[0] = {
        lineHeight: style.fontSize
      };
      var positionX = 0;
      var positionY = 0;
      var canvas2;
      var context2;
      var baseTexture;
      var maxCharHeight = 0;
      var textures = [];
      for (var i = 0; i < charsList.length; i++) {
        if (!canvas2) {
          canvas2 = document.createElement("canvas");
          canvas2.width = textureWidth;
          canvas2.height = textureHeight;
          context2 = canvas2.getContext("2d");
          baseTexture = new BaseTexture(canvas2, {resolution});
          textures.push(new Texture(baseTexture));
          fontData.page.push({
            id: textures.length - 1,
            file: ""
          });
        }
        var metrics = TextMetrics.measureText(charsList[i], style, false, canvas2);
        var width = metrics.width;
        var height = Math.ceil(metrics.height);
        var textureGlyphWidth = Math.ceil((style.fontStyle === "italic" ? 2 : 1) * width);
        if (positionY >= textureHeight - height * resolution) {
          if (positionY === 0) {
            throw new Error("[BitmapFont] textureHeight " + textureHeight + "px is " + ("too small for " + style.fontSize + "px fonts"));
          }
          --i;
          canvas2 = null;
          context2 = null;
          baseTexture = null;
          positionY = 0;
          positionX = 0;
          maxCharHeight = 0;
          continue;
        }
        maxCharHeight = Math.max(height + metrics.fontProperties.descent, maxCharHeight);
        if (textureGlyphWidth * resolution + positionX >= lineWidth) {
          --i;
          positionY += maxCharHeight * resolution;
          positionY = Math.ceil(positionY);
          positionX = 0;
          maxCharHeight = 0;
          continue;
        }
        drawGlyph(canvas2, context2, metrics, positionX, positionY, resolution, style);
        var id = metrics.text.charCodeAt(0);
        fontData.char.push({
          id,
          page: textures.length - 1,
          x: positionX / resolution,
          y: positionY / resolution,
          width: textureGlyphWidth,
          height,
          xoffset: 0,
          yoffset: 0,
          xadvance: Math.ceil(width - (style.dropShadow ? style.dropShadowDistance : 0) - (style.stroke ? style.strokeThickness : 0))
        });
        positionX += (textureGlyphWidth + 2 * padding) * resolution;
        positionX = Math.ceil(positionX);
      }
      var font = new BitmapFont2(fontData, textures);
      if (BitmapFont2.available[name] !== void 0) {
        BitmapFont2.uninstall(name);
      }
      BitmapFont2.available[name] = font;
      return font;
    };
    BitmapFont2.ALPHA = [["a", "z"], ["A", "Z"], " "];
    BitmapFont2.NUMERIC = [["0", "9"]];
    BitmapFont2.ALPHANUMERIC = [["a", "z"], ["A", "Z"], ["0", "9"], " "];
    BitmapFont2.ASCII = [[" ", "~"]];
    BitmapFont2.defaultOptions = {
      resolution: 1,
      textureWidth: 512,
      textureHeight: 512,
      padding: 4,
      chars: BitmapFont2.ALPHANUMERIC
    };
    BitmapFont2.available = {};
    return BitmapFont2;
  }();
  var pageMeshDataPool = [];
  var charRenderDataPool = [];
  var BitmapText = function(_super) {
    __extends12(BitmapText2, _super);
    function BitmapText2(text3, style) {
      if (style === void 0) {
        style = {};
      }
      var _this = _super.call(this) || this;
      _this._tint = 16777215;
      if (style.font) {
        deprecation("5.3.0", "PIXI.BitmapText constructor style.font property is deprecated.");
        _this._upgradeStyle(style);
      }
      var _a2 = Object.assign({}, BitmapText2.styleDefaults, style), align = _a2.align, tint = _a2.tint, maxWidth = _a2.maxWidth, letterSpacing = _a2.letterSpacing, fontName = _a2.fontName, fontSize = _a2.fontSize;
      if (!BitmapFont.available[fontName]) {
        throw new Error('Missing BitmapFont "' + fontName + '"');
      }
      _this._activePagesMeshData = [];
      _this._textWidth = 0;
      _this._textHeight = 0;
      _this._align = align;
      _this._tint = tint;
      _this._fontName = fontName;
      _this._fontSize = fontSize || BitmapFont.available[fontName].size;
      _this._text = text3;
      _this._maxWidth = maxWidth;
      _this._maxLineHeight = 0;
      _this._letterSpacing = letterSpacing;
      _this._anchor = new ObservablePoint(function() {
        _this.dirty = true;
      }, _this, 0, 0);
      _this.roundPixels = settings.ROUND_PIXELS;
      _this.dirty = true;
      return _this;
    }
    BitmapText2.prototype.updateText = function() {
      var _a2;
      var data = BitmapFont.available[this._fontName];
      var scale = this._fontSize / data.size;
      var pos = new Point();
      var chars = [];
      var lineWidths = [];
      var text3 = this._text.replace(/(?:\r\n|\r)/g, "\n") || " ";
      var textLength = text3.length;
      var maxWidth = this._maxWidth * data.size / this._fontSize;
      var prevCharCode = null;
      var lastLineWidth = 0;
      var maxLineWidth = 0;
      var line = 0;
      var lastBreakPos = -1;
      var lastBreakWidth = 0;
      var spacesRemoved = 0;
      var maxLineHeight = 0;
      for (var i = 0; i < textLength; i++) {
        var charCode = text3.charCodeAt(i);
        var char = text3.charAt(i);
        if (/(?:\s)/.test(char)) {
          lastBreakPos = i;
          lastBreakWidth = lastLineWidth;
        }
        if (char === "\r" || char === "\n") {
          lineWidths.push(lastLineWidth);
          maxLineWidth = Math.max(maxLineWidth, lastLineWidth);
          ++line;
          ++spacesRemoved;
          pos.x = 0;
          pos.y += data.lineHeight;
          prevCharCode = null;
          continue;
        }
        var charData = data.chars[charCode];
        if (!charData) {
          continue;
        }
        if (prevCharCode && charData.kerning[prevCharCode]) {
          pos.x += charData.kerning[prevCharCode];
        }
        var charRenderData = charRenderDataPool.pop() || {
          texture: Texture.EMPTY,
          line: 0,
          charCode: 0,
          position: new Point()
        };
        charRenderData.texture = charData.texture;
        charRenderData.line = line;
        charRenderData.charCode = charCode;
        charRenderData.position.x = pos.x + charData.xOffset + this._letterSpacing / 2;
        charRenderData.position.y = pos.y + charData.yOffset;
        chars.push(charRenderData);
        pos.x += charData.xAdvance + this._letterSpacing;
        lastLineWidth = pos.x;
        maxLineHeight = Math.max(maxLineHeight, charData.yOffset + charData.texture.height);
        prevCharCode = charCode;
        if (lastBreakPos !== -1 && maxWidth > 0 && pos.x > maxWidth) {
          ++spacesRemoved;
          removeItems(chars, 1 + lastBreakPos - spacesRemoved, 1 + i - lastBreakPos);
          i = lastBreakPos;
          lastBreakPos = -1;
          lineWidths.push(lastBreakWidth);
          maxLineWidth = Math.max(maxLineWidth, lastBreakWidth);
          line++;
          pos.x = 0;
          pos.y += data.lineHeight;
          prevCharCode = null;
        }
      }
      var lastChar = text3.charAt(text3.length - 1);
      if (lastChar !== "\r" && lastChar !== "\n") {
        if (/(?:\s)/.test(lastChar)) {
          lastLineWidth = lastBreakWidth;
        }
        lineWidths.push(lastLineWidth);
        maxLineWidth = Math.max(maxLineWidth, lastLineWidth);
      }
      var lineAlignOffsets = [];
      for (var i = 0; i <= line; i++) {
        var alignOffset = 0;
        if (this._align === "right") {
          alignOffset = maxLineWidth - lineWidths[i];
        } else if (this._align === "center") {
          alignOffset = (maxLineWidth - lineWidths[i]) / 2;
        }
        lineAlignOffsets.push(alignOffset);
      }
      var lenChars = chars.length;
      var pagesMeshData = {};
      var newPagesMeshData = [];
      var activePagesMeshData = this._activePagesMeshData;
      for (var i = 0; i < activePagesMeshData.length; i++) {
        pageMeshDataPool.push(activePagesMeshData[i]);
      }
      for (var i = 0; i < lenChars; i++) {
        var texture = chars[i].texture;
        var baseTextureUid = texture.baseTexture.uid;
        if (!pagesMeshData[baseTextureUid]) {
          var pageMeshData = pageMeshDataPool.pop();
          if (!pageMeshData) {
            var geometry = new MeshGeometry();
            var material = new MeshMaterial(Texture.EMPTY);
            var mesh3 = new Mesh(geometry, material);
            pageMeshData = {
              index: 0,
              indexCount: 0,
              vertexCount: 0,
              uvsCount: 0,
              total: 0,
              mesh: mesh3,
              vertices: null,
              uvs: null,
              indices: null
            };
          }
          pageMeshData.index = 0;
          pageMeshData.indexCount = 0;
          pageMeshData.vertexCount = 0;
          pageMeshData.uvsCount = 0;
          pageMeshData.total = 0;
          pageMeshData.mesh.texture = new Texture(texture.baseTexture);
          pageMeshData.mesh.tint = this._tint;
          newPagesMeshData.push(pageMeshData);
          pagesMeshData[baseTextureUid] = pageMeshData;
        }
        pagesMeshData[baseTextureUid].total++;
      }
      for (var i = 0; i < activePagesMeshData.length; i++) {
        if (newPagesMeshData.indexOf(activePagesMeshData[i]) === -1) {
          this.removeChild(activePagesMeshData[i].mesh);
        }
      }
      for (var i = 0; i < newPagesMeshData.length; i++) {
        if (newPagesMeshData[i].mesh.parent !== this) {
          this.addChild(newPagesMeshData[i].mesh);
        }
      }
      this._activePagesMeshData = newPagesMeshData;
      for (var i in pagesMeshData) {
        var pageMeshData = pagesMeshData[i];
        var total = pageMeshData.total;
        if (!(((_a2 = pageMeshData.indices) === null || _a2 === void 0 ? void 0 : _a2.length) > 6 * total) || pageMeshData.vertices.length < Mesh.BATCHABLE_SIZE * 2) {
          pageMeshData.vertices = new Float32Array(4 * 2 * total);
          pageMeshData.uvs = new Float32Array(4 * 2 * total);
          pageMeshData.indices = new Uint16Array(6 * total);
        }
        pageMeshData.mesh.size = 6 * total;
      }
      for (var i = 0; i < lenChars; i++) {
        var char = chars[i];
        var xPos = (char.position.x + lineAlignOffsets[char.line]) * scale;
        var yPos = char.position.y * scale;
        var texture = char.texture;
        var pageMesh = pagesMeshData[texture.baseTexture.uid];
        var textureFrame = texture.frame;
        var textureUvs = texture._uvs;
        var index2 = pageMesh.index++;
        pageMesh.indices[index2 * 6 + 0] = 0 + index2 * 4;
        pageMesh.indices[index2 * 6 + 1] = 1 + index2 * 4;
        pageMesh.indices[index2 * 6 + 2] = 2 + index2 * 4;
        pageMesh.indices[index2 * 6 + 3] = 0 + index2 * 4;
        pageMesh.indices[index2 * 6 + 4] = 2 + index2 * 4;
        pageMesh.indices[index2 * 6 + 5] = 3 + index2 * 4;
        pageMesh.vertices[index2 * 8 + 0] = xPos;
        pageMesh.vertices[index2 * 8 + 1] = yPos;
        pageMesh.vertices[index2 * 8 + 2] = xPos + textureFrame.width * scale;
        pageMesh.vertices[index2 * 8 + 3] = yPos;
        pageMesh.vertices[index2 * 8 + 4] = xPos + textureFrame.width * scale;
        pageMesh.vertices[index2 * 8 + 5] = yPos + textureFrame.height * scale;
        pageMesh.vertices[index2 * 8 + 6] = xPos;
        pageMesh.vertices[index2 * 8 + 7] = yPos + textureFrame.height * scale;
        pageMesh.uvs[index2 * 8 + 0] = textureUvs.x0;
        pageMesh.uvs[index2 * 8 + 1] = textureUvs.y0;
        pageMesh.uvs[index2 * 8 + 2] = textureUvs.x1;
        pageMesh.uvs[index2 * 8 + 3] = textureUvs.y1;
        pageMesh.uvs[index2 * 8 + 4] = textureUvs.x2;
        pageMesh.uvs[index2 * 8 + 5] = textureUvs.y2;
        pageMesh.uvs[index2 * 8 + 6] = textureUvs.x3;
        pageMesh.uvs[index2 * 8 + 7] = textureUvs.y3;
      }
      this._textWidth = maxLineWidth * scale;
      this._textHeight = (pos.y + data.lineHeight) * scale;
      for (var i in pagesMeshData) {
        var pageMeshData = pagesMeshData[i];
        if (this.anchor.x !== 0 || this.anchor.y !== 0) {
          var vertexCount = 0;
          var anchorOffsetX = this._textWidth * this.anchor.x;
          var anchorOffsetY = this._textHeight * this.anchor.y;
          for (var i_1 = 0; i_1 < pageMeshData.total; i_1++) {
            pageMeshData.vertices[vertexCount++] -= anchorOffsetX;
            pageMeshData.vertices[vertexCount++] -= anchorOffsetY;
            pageMeshData.vertices[vertexCount++] -= anchorOffsetX;
            pageMeshData.vertices[vertexCount++] -= anchorOffsetY;
            pageMeshData.vertices[vertexCount++] -= anchorOffsetX;
            pageMeshData.vertices[vertexCount++] -= anchorOffsetY;
            pageMeshData.vertices[vertexCount++] -= anchorOffsetX;
            pageMeshData.vertices[vertexCount++] -= anchorOffsetY;
          }
        }
        this._maxLineHeight = maxLineHeight * scale;
        var vertexBuffer = pageMeshData.mesh.geometry.getBuffer("aVertexPosition");
        var textureBuffer = pageMeshData.mesh.geometry.getBuffer("aTextureCoord");
        var indexBuffer = pageMeshData.mesh.geometry.getIndex();
        vertexBuffer.data = pageMeshData.vertices;
        textureBuffer.data = pageMeshData.uvs;
        indexBuffer.data = pageMeshData.indices;
        vertexBuffer.update();
        textureBuffer.update();
        indexBuffer.update();
      }
      for (var i = 0; i < chars.length; i++) {
        charRenderDataPool.push(chars[i]);
      }
    };
    BitmapText2.prototype.updateTransform = function() {
      this.validate();
      this.containerUpdateTransform();
    };
    BitmapText2.prototype.getLocalBounds = function() {
      this.validate();
      return _super.prototype.getLocalBounds.call(this);
    };
    BitmapText2.prototype.validate = function() {
      if (this.dirty) {
        this.updateText();
        this.dirty = false;
      }
    };
    Object.defineProperty(BitmapText2.prototype, "tint", {
      get: function() {
        return this._tint;
      },
      set: function(value) {
        if (this._tint === value) {
          return;
        }
        this._tint = value;
        for (var i = 0; i < this._activePagesMeshData.length; i++) {
          this._activePagesMeshData[i].mesh.tint = value;
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(BitmapText2.prototype, "align", {
      get: function() {
        return this._align;
      },
      set: function(value) {
        if (this._align !== value) {
          this._align = value;
          this.dirty = true;
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(BitmapText2.prototype, "fontName", {
      get: function() {
        return this._fontName;
      },
      set: function(value) {
        if (!BitmapFont.available[value]) {
          throw new Error('Missing BitmapFont "' + value + '"');
        }
        if (this._fontName !== value) {
          this._fontName = value;
          this.dirty = true;
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(BitmapText2.prototype, "fontSize", {
      get: function() {
        return this._fontSize;
      },
      set: function(value) {
        if (this._fontSize !== value) {
          this._fontSize = value;
          this.dirty = true;
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(BitmapText2.prototype, "anchor", {
      get: function() {
        return this._anchor;
      },
      set: function(value) {
        if (typeof value === "number") {
          this._anchor.set(value);
        } else {
          this._anchor.copyFrom(value);
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(BitmapText2.prototype, "text", {
      get: function() {
        return this._text;
      },
      set: function(text3) {
        text3 = String(text3 === null || text3 === void 0 ? "" : text3);
        if (this._text === text3) {
          return;
        }
        this._text = text3;
        this.dirty = true;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(BitmapText2.prototype, "maxWidth", {
      get: function() {
        return this._maxWidth;
      },
      set: function(value) {
        if (this._maxWidth === value) {
          return;
        }
        this._maxWidth = value;
        this.dirty = true;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(BitmapText2.prototype, "maxLineHeight", {
      get: function() {
        this.validate();
        return this._maxLineHeight;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(BitmapText2.prototype, "textWidth", {
      get: function() {
        this.validate();
        return this._textWidth;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(BitmapText2.prototype, "letterSpacing", {
      get: function() {
        return this._letterSpacing;
      },
      set: function(value) {
        if (this._letterSpacing !== value) {
          this._letterSpacing = value;
          this.dirty = true;
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(BitmapText2.prototype, "textHeight", {
      get: function() {
        this.validate();
        return this._textHeight;
      },
      enumerable: false,
      configurable: true
    });
    BitmapText2.prototype._upgradeStyle = function(style) {
      if (typeof style.font === "string") {
        var valueSplit = style.font.split(" ");
        style.fontName = valueSplit.length === 1 ? valueSplit[0] : valueSplit.slice(1).join(" ");
        if (valueSplit.length >= 2) {
          style.fontSize = parseInt(valueSplit[0], 10);
        }
      } else {
        style.fontName = style.font.name;
        style.fontSize = typeof style.font.size === "number" ? style.font.size : parseInt(style.font.size, 10);
      }
    };
    BitmapText2.registerFont = function(data, textures) {
      deprecation("5.3.0", "PIXI.BitmapText.registerFont is deprecated, use PIXI.BitmapFont.install");
      return BitmapFont.install(data, textures);
    };
    Object.defineProperty(BitmapText2, "fonts", {
      get: function() {
        deprecation("5.3.0", "PIXI.BitmapText.fonts is deprecated, use PIXI.BitmapFont.available");
        return BitmapFont.available;
      },
      enumerable: false,
      configurable: true
    });
    BitmapText2.styleDefaults = {
      align: "left",
      tint: 16777215,
      maxWidth: 0,
      letterSpacing: 0
    };
    return BitmapText2;
  }(Container);
  var BitmapFontLoader = function() {
    function BitmapFontLoader2() {
    }
    BitmapFontLoader2.add = function() {
      LoaderResource.setExtensionXhrType("fnt", LoaderResource.XHR_RESPONSE_TYPE.DOCUMENT);
    };
    BitmapFontLoader2.use = function(resource, next) {
      var format = autoDetectFormat(resource.data);
      if (!format) {
        next();
        return;
      }
      var baseUrl = BitmapFontLoader2.getBaseUrl(this, resource);
      var data = format.parse(resource.data);
      var textures = {};
      var completed = function(page) {
        textures[page.metadata.pageFile] = page.texture;
        if (Object.keys(textures).length === data.page.length) {
          resource.bitmapFont = BitmapFont.install(data, textures);
          next();
        }
      };
      for (var i = 0; i < data.page.length; ++i) {
        var pageFile = data.page[i].file;
        var url3 = baseUrl + pageFile;
        var exists = false;
        for (var name in this.resources) {
          var bitmapResource = this.resources[name];
          if (bitmapResource.url === url3) {
            bitmapResource.metadata.pageFile = pageFile;
            if (bitmapResource.texture) {
              completed(bitmapResource);
            } else {
              bitmapResource.onAfterMiddleware.add(completed);
            }
            exists = true;
            break;
          }
        }
        if (!exists) {
          var options = {
            crossOrigin: resource.crossOrigin,
            loadType: LoaderResource.LOAD_TYPE.IMAGE,
            metadata: Object.assign({pageFile}, resource.metadata.imageMetadata),
            parentResource: resource
          };
          this.add(url3, options, completed);
        }
      }
    };
    BitmapFontLoader2.getBaseUrl = function(loader, resource) {
      var resUrl = !resource.isDataUrl ? BitmapFontLoader2.dirname(resource.url) : "";
      if (resource.isDataUrl) {
        if (resUrl === ".") {
          resUrl = "";
        }
        if (loader.baseUrl && resUrl) {
          if (loader.baseUrl.charAt(loader.baseUrl.length - 1) === "/") {
            resUrl += "/";
          }
        }
      }
      resUrl = resUrl.replace(loader.baseUrl, "");
      if (resUrl && resUrl.charAt(resUrl.length - 1) !== "/") {
        resUrl += "/";
      }
      return resUrl;
    };
    BitmapFontLoader2.dirname = function(url3) {
      var dir = url3.replace(/\\/g, "/").replace(/\/$/, "").replace(/\/[^\/]*$/, "");
      if (dir === url3) {
        return ".";
      } else if (dir === "") {
        return "/";
      }
      return dir;
    };
    return BitmapFontLoader2;
  }();

  // node_modules/@pixi/filter-alpha/lib/filter-alpha.es.js
  /*!
   * @pixi/filter-alpha - v5.3.3
   * Compiled Tue, 04 Aug 2020 16:23:09 UTC
   *
   * @pixi/filter-alpha is licensed under the MIT License.
   * http://www.opensource.org/licenses/mit-license
   */
  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation. All rights reserved.
  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at http://www.apache.org/licenses/LICENSE-2.0
  
  THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
  WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
  MERCHANTABLITY OR NON-INFRINGEMENT.
  
  See the Apache Version 2.0 License for specific language governing permissions
  and limitations under the License.
  ***************************************************************************** */
  var extendStatics13 = function(d, b) {
    extendStatics13 = Object.setPrototypeOf || {__proto__: []} instanceof Array && function(d2, b2) {
      d2.__proto__ = b2;
    } || function(d2, b2) {
      for (var p in b2) {
        if (b2.hasOwnProperty(p)) {
          d2[p] = b2[p];
        }
      }
    };
    return extendStatics13(d, b);
  };
  function __extends13(d, b) {
    extendStatics13(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  }
  var fragment5 = "varying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform float uAlpha;\n\nvoid main(void)\n{\n   gl_FragColor = texture2D(uSampler, vTextureCoord) * uAlpha;\n}\n";
  var AlphaFilter = function(_super) {
    __extends13(AlphaFilter2, _super);
    function AlphaFilter2(alpha) {
      if (alpha === void 0) {
        alpha = 1;
      }
      var _this = _super.call(this, _default, fragment5, {uAlpha: 1}) || this;
      _this.alpha = alpha;
      return _this;
    }
    Object.defineProperty(AlphaFilter2.prototype, "alpha", {
      get: function() {
        return this.uniforms.uAlpha;
      },
      set: function(value) {
        this.uniforms.uAlpha = value;
      },
      enumerable: false,
      configurable: true
    });
    return AlphaFilter2;
  }(Filter);

  // node_modules/@pixi/filter-blur/lib/filter-blur.es.js
  /*!
   * @pixi/filter-blur - v5.3.3
   * Compiled Tue, 04 Aug 2020 16:23:09 UTC
   *
   * @pixi/filter-blur is licensed under the MIT License.
   * http://www.opensource.org/licenses/mit-license
   */
  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation. All rights reserved.
  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at http://www.apache.org/licenses/LICENSE-2.0
  
  THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
  WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
  MERCHANTABLITY OR NON-INFRINGEMENT.
  
  See the Apache Version 2.0 License for specific language governing permissions
  and limitations under the License.
  ***************************************************************************** */
  var extendStatics14 = function(d, b) {
    extendStatics14 = Object.setPrototypeOf || {__proto__: []} instanceof Array && function(d2, b2) {
      d2.__proto__ = b2;
    } || function(d2, b2) {
      for (var p in b2) {
        if (b2.hasOwnProperty(p)) {
          d2[p] = b2[p];
        }
      }
    };
    return extendStatics14(d, b);
  };
  function __extends14(d, b) {
    extendStatics14(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  }
  var vertTemplate = "\n    attribute vec2 aVertexPosition;\n\n    uniform mat3 projectionMatrix;\n\n    uniform float strength;\n\n    varying vec2 vBlurTexCoords[%size%];\n\n    uniform vec4 inputSize;\n    uniform vec4 outputFrame;\n\n    vec4 filterVertexPosition( void )\n    {\n        vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;\n\n        return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);\n    }\n\n    vec2 filterTextureCoord( void )\n    {\n        return aVertexPosition * (outputFrame.zw * inputSize.zw);\n    }\n\n    void main(void)\n    {\n        gl_Position = filterVertexPosition();\n\n        vec2 textureCoord = filterTextureCoord();\n        %blur%\n    }";
  function generateBlurVertSource(kernelSize, x) {
    var halfLength = Math.ceil(kernelSize / 2);
    var vertSource = vertTemplate;
    var blurLoop = "";
    var template;
    if (x) {
      template = "vBlurTexCoords[%index%] =  textureCoord + vec2(%sampleIndex% * strength, 0.0);";
    } else {
      template = "vBlurTexCoords[%index%] =  textureCoord + vec2(0.0, %sampleIndex% * strength);";
    }
    for (var i = 0; i < kernelSize; i++) {
      var blur = template.replace("%index%", i.toString());
      blur = blur.replace("%sampleIndex%", i - (halfLength - 1) + ".0");
      blurLoop += blur;
      blurLoop += "\n";
    }
    vertSource = vertSource.replace("%blur%", blurLoop);
    vertSource = vertSource.replace("%size%", kernelSize.toString());
    return vertSource;
  }
  var GAUSSIAN_VALUES = {
    5: [0.153388, 0.221461, 0.250301],
    7: [0.071303, 0.131514, 0.189879, 0.214607],
    9: [0.028532, 0.067234, 0.124009, 0.179044, 0.20236],
    11: [93e-4, 0.028002, 0.065984, 0.121703, 0.175713, 0.198596],
    13: [2406e-6, 9255e-6, 0.027867, 0.065666, 0.121117, 0.174868, 0.197641],
    15: [489e-6, 2403e-6, 9246e-6, 0.02784, 0.065602, 0.120999, 0.174697, 0.197448]
  };
  var fragTemplate2 = [
    "varying vec2 vBlurTexCoords[%size%];",
    "uniform sampler2D uSampler;",
    "void main(void)",
    "{",
    "    gl_FragColor = vec4(0.0);",
    "    %blur%",
    "}"
  ].join("\n");
  function generateBlurFragSource(kernelSize) {
    var kernel = GAUSSIAN_VALUES[kernelSize];
    var halfLength = kernel.length;
    var fragSource = fragTemplate2;
    var blurLoop = "";
    var template = "gl_FragColor += texture2D(uSampler, vBlurTexCoords[%index%]) * %value%;";
    var value;
    for (var i = 0; i < kernelSize; i++) {
      var blur = template.replace("%index%", i.toString());
      value = i;
      if (i >= halfLength) {
        value = kernelSize - i - 1;
      }
      blur = blur.replace("%value%", kernel[value].toString());
      blurLoop += blur;
      blurLoop += "\n";
    }
    fragSource = fragSource.replace("%blur%", blurLoop);
    fragSource = fragSource.replace("%size%", kernelSize.toString());
    return fragSource;
  }
  var ENV2;
  (function(ENV3) {
    ENV3[ENV3["WEBGL_LEGACY"] = 0] = "WEBGL_LEGACY";
    ENV3[ENV3["WEBGL"] = 1] = "WEBGL";
    ENV3[ENV3["WEBGL2"] = 2] = "WEBGL2";
  })(ENV2 || (ENV2 = {}));
  var RENDERER_TYPE2;
  (function(RENDERER_TYPE3) {
    RENDERER_TYPE3[RENDERER_TYPE3["UNKNOWN"] = 0] = "UNKNOWN";
    RENDERER_TYPE3[RENDERER_TYPE3["WEBGL"] = 1] = "WEBGL";
    RENDERER_TYPE3[RENDERER_TYPE3["CANVAS"] = 2] = "CANVAS";
  })(RENDERER_TYPE2 || (RENDERER_TYPE2 = {}));
  var BUFFER_BITS2;
  (function(BUFFER_BITS3) {
    BUFFER_BITS3[BUFFER_BITS3["COLOR"] = 16384] = "COLOR";
    BUFFER_BITS3[BUFFER_BITS3["DEPTH"] = 256] = "DEPTH";
    BUFFER_BITS3[BUFFER_BITS3["STENCIL"] = 1024] = "STENCIL";
  })(BUFFER_BITS2 || (BUFFER_BITS2 = {}));
  var BLEND_MODES2;
  (function(BLEND_MODES3) {
    BLEND_MODES3[BLEND_MODES3["NORMAL"] = 0] = "NORMAL";
    BLEND_MODES3[BLEND_MODES3["ADD"] = 1] = "ADD";
    BLEND_MODES3[BLEND_MODES3["MULTIPLY"] = 2] = "MULTIPLY";
    BLEND_MODES3[BLEND_MODES3["SCREEN"] = 3] = "SCREEN";
    BLEND_MODES3[BLEND_MODES3["OVERLAY"] = 4] = "OVERLAY";
    BLEND_MODES3[BLEND_MODES3["DARKEN"] = 5] = "DARKEN";
    BLEND_MODES3[BLEND_MODES3["LIGHTEN"] = 6] = "LIGHTEN";
    BLEND_MODES3[BLEND_MODES3["COLOR_DODGE"] = 7] = "COLOR_DODGE";
    BLEND_MODES3[BLEND_MODES3["COLOR_BURN"] = 8] = "COLOR_BURN";
    BLEND_MODES3[BLEND_MODES3["HARD_LIGHT"] = 9] = "HARD_LIGHT";
    BLEND_MODES3[BLEND_MODES3["SOFT_LIGHT"] = 10] = "SOFT_LIGHT";
    BLEND_MODES3[BLEND_MODES3["DIFFERENCE"] = 11] = "DIFFERENCE";
    BLEND_MODES3[BLEND_MODES3["EXCLUSION"] = 12] = "EXCLUSION";
    BLEND_MODES3[BLEND_MODES3["HUE"] = 13] = "HUE";
    BLEND_MODES3[BLEND_MODES3["SATURATION"] = 14] = "SATURATION";
    BLEND_MODES3[BLEND_MODES3["COLOR"] = 15] = "COLOR";
    BLEND_MODES3[BLEND_MODES3["LUMINOSITY"] = 16] = "LUMINOSITY";
    BLEND_MODES3[BLEND_MODES3["NORMAL_NPM"] = 17] = "NORMAL_NPM";
    BLEND_MODES3[BLEND_MODES3["ADD_NPM"] = 18] = "ADD_NPM";
    BLEND_MODES3[BLEND_MODES3["SCREEN_NPM"] = 19] = "SCREEN_NPM";
    BLEND_MODES3[BLEND_MODES3["NONE"] = 20] = "NONE";
    BLEND_MODES3[BLEND_MODES3["SRC_OVER"] = 0] = "SRC_OVER";
    BLEND_MODES3[BLEND_MODES3["SRC_IN"] = 21] = "SRC_IN";
    BLEND_MODES3[BLEND_MODES3["SRC_OUT"] = 22] = "SRC_OUT";
    BLEND_MODES3[BLEND_MODES3["SRC_ATOP"] = 23] = "SRC_ATOP";
    BLEND_MODES3[BLEND_MODES3["DST_OVER"] = 24] = "DST_OVER";
    BLEND_MODES3[BLEND_MODES3["DST_IN"] = 25] = "DST_IN";
    BLEND_MODES3[BLEND_MODES3["DST_OUT"] = 26] = "DST_OUT";
    BLEND_MODES3[BLEND_MODES3["DST_ATOP"] = 27] = "DST_ATOP";
    BLEND_MODES3[BLEND_MODES3["ERASE"] = 26] = "ERASE";
    BLEND_MODES3[BLEND_MODES3["SUBTRACT"] = 28] = "SUBTRACT";
    BLEND_MODES3[BLEND_MODES3["XOR"] = 29] = "XOR";
  })(BLEND_MODES2 || (BLEND_MODES2 = {}));
  var DRAW_MODES2;
  (function(DRAW_MODES3) {
    DRAW_MODES3[DRAW_MODES3["POINTS"] = 0] = "POINTS";
    DRAW_MODES3[DRAW_MODES3["LINES"] = 1] = "LINES";
    DRAW_MODES3[DRAW_MODES3["LINE_LOOP"] = 2] = "LINE_LOOP";
    DRAW_MODES3[DRAW_MODES3["LINE_STRIP"] = 3] = "LINE_STRIP";
    DRAW_MODES3[DRAW_MODES3["TRIANGLES"] = 4] = "TRIANGLES";
    DRAW_MODES3[DRAW_MODES3["TRIANGLE_STRIP"] = 5] = "TRIANGLE_STRIP";
    DRAW_MODES3[DRAW_MODES3["TRIANGLE_FAN"] = 6] = "TRIANGLE_FAN";
  })(DRAW_MODES2 || (DRAW_MODES2 = {}));
  var FORMATS2;
  (function(FORMATS3) {
    FORMATS3[FORMATS3["RGBA"] = 6408] = "RGBA";
    FORMATS3[FORMATS3["RGB"] = 6407] = "RGB";
    FORMATS3[FORMATS3["ALPHA"] = 6406] = "ALPHA";
    FORMATS3[FORMATS3["LUMINANCE"] = 6409] = "LUMINANCE";
    FORMATS3[FORMATS3["LUMINANCE_ALPHA"] = 6410] = "LUMINANCE_ALPHA";
    FORMATS3[FORMATS3["DEPTH_COMPONENT"] = 6402] = "DEPTH_COMPONENT";
    FORMATS3[FORMATS3["DEPTH_STENCIL"] = 34041] = "DEPTH_STENCIL";
  })(FORMATS2 || (FORMATS2 = {}));
  var TARGETS2;
  (function(TARGETS3) {
    TARGETS3[TARGETS3["TEXTURE_2D"] = 3553] = "TEXTURE_2D";
    TARGETS3[TARGETS3["TEXTURE_CUBE_MAP"] = 34067] = "TEXTURE_CUBE_MAP";
    TARGETS3[TARGETS3["TEXTURE_2D_ARRAY"] = 35866] = "TEXTURE_2D_ARRAY";
    TARGETS3[TARGETS3["TEXTURE_CUBE_MAP_POSITIVE_X"] = 34069] = "TEXTURE_CUBE_MAP_POSITIVE_X";
    TARGETS3[TARGETS3["TEXTURE_CUBE_MAP_NEGATIVE_X"] = 34070] = "TEXTURE_CUBE_MAP_NEGATIVE_X";
    TARGETS3[TARGETS3["TEXTURE_CUBE_MAP_POSITIVE_Y"] = 34071] = "TEXTURE_CUBE_MAP_POSITIVE_Y";
    TARGETS3[TARGETS3["TEXTURE_CUBE_MAP_NEGATIVE_Y"] = 34072] = "TEXTURE_CUBE_MAP_NEGATIVE_Y";
    TARGETS3[TARGETS3["TEXTURE_CUBE_MAP_POSITIVE_Z"] = 34073] = "TEXTURE_CUBE_MAP_POSITIVE_Z";
    TARGETS3[TARGETS3["TEXTURE_CUBE_MAP_NEGATIVE_Z"] = 34074] = "TEXTURE_CUBE_MAP_NEGATIVE_Z";
  })(TARGETS2 || (TARGETS2 = {}));
  var TYPES2;
  (function(TYPES3) {
    TYPES3[TYPES3["UNSIGNED_BYTE"] = 5121] = "UNSIGNED_BYTE";
    TYPES3[TYPES3["UNSIGNED_SHORT"] = 5123] = "UNSIGNED_SHORT";
    TYPES3[TYPES3["UNSIGNED_SHORT_5_6_5"] = 33635] = "UNSIGNED_SHORT_5_6_5";
    TYPES3[TYPES3["UNSIGNED_SHORT_4_4_4_4"] = 32819] = "UNSIGNED_SHORT_4_4_4_4";
    TYPES3[TYPES3["UNSIGNED_SHORT_5_5_5_1"] = 32820] = "UNSIGNED_SHORT_5_5_5_1";
    TYPES3[TYPES3["FLOAT"] = 5126] = "FLOAT";
    TYPES3[TYPES3["HALF_FLOAT"] = 36193] = "HALF_FLOAT";
  })(TYPES2 || (TYPES2 = {}));
  var SCALE_MODES2;
  (function(SCALE_MODES3) {
    SCALE_MODES3[SCALE_MODES3["NEAREST"] = 0] = "NEAREST";
    SCALE_MODES3[SCALE_MODES3["LINEAR"] = 1] = "LINEAR";
  })(SCALE_MODES2 || (SCALE_MODES2 = {}));
  var WRAP_MODES2;
  (function(WRAP_MODES3) {
    WRAP_MODES3[WRAP_MODES3["CLAMP"] = 33071] = "CLAMP";
    WRAP_MODES3[WRAP_MODES3["REPEAT"] = 10497] = "REPEAT";
    WRAP_MODES3[WRAP_MODES3["MIRRORED_REPEAT"] = 33648] = "MIRRORED_REPEAT";
  })(WRAP_MODES2 || (WRAP_MODES2 = {}));
  var MIPMAP_MODES2;
  (function(MIPMAP_MODES3) {
    MIPMAP_MODES3[MIPMAP_MODES3["OFF"] = 0] = "OFF";
    MIPMAP_MODES3[MIPMAP_MODES3["POW2"] = 1] = "POW2";
    MIPMAP_MODES3[MIPMAP_MODES3["ON"] = 2] = "ON";
  })(MIPMAP_MODES2 || (MIPMAP_MODES2 = {}));
  var ALPHA_MODES2;
  (function(ALPHA_MODES3) {
    ALPHA_MODES3[ALPHA_MODES3["NPM"] = 0] = "NPM";
    ALPHA_MODES3[ALPHA_MODES3["UNPACK"] = 1] = "UNPACK";
    ALPHA_MODES3[ALPHA_MODES3["PMA"] = 2] = "PMA";
    ALPHA_MODES3[ALPHA_MODES3["NO_PREMULTIPLIED_ALPHA"] = 0] = "NO_PREMULTIPLIED_ALPHA";
    ALPHA_MODES3[ALPHA_MODES3["PREMULTIPLY_ON_UPLOAD"] = 1] = "PREMULTIPLY_ON_UPLOAD";
    ALPHA_MODES3[ALPHA_MODES3["PREMULTIPLY_ALPHA"] = 2] = "PREMULTIPLY_ALPHA";
  })(ALPHA_MODES2 || (ALPHA_MODES2 = {}));
  var CLEAR_MODES2;
  (function(CLEAR_MODES3) {
    CLEAR_MODES3[CLEAR_MODES3["NO"] = 0] = "NO";
    CLEAR_MODES3[CLEAR_MODES3["YES"] = 1] = "YES";
    CLEAR_MODES3[CLEAR_MODES3["AUTO"] = 2] = "AUTO";
    CLEAR_MODES3[CLEAR_MODES3["BLEND"] = 0] = "BLEND";
    CLEAR_MODES3[CLEAR_MODES3["CLEAR"] = 1] = "CLEAR";
    CLEAR_MODES3[CLEAR_MODES3["BLIT"] = 2] = "BLIT";
  })(CLEAR_MODES2 || (CLEAR_MODES2 = {}));
  var GC_MODES2;
  (function(GC_MODES3) {
    GC_MODES3[GC_MODES3["AUTO"] = 0] = "AUTO";
    GC_MODES3[GC_MODES3["MANUAL"] = 1] = "MANUAL";
  })(GC_MODES2 || (GC_MODES2 = {}));
  var PRECISION2;
  (function(PRECISION3) {
    PRECISION3["LOW"] = "lowp";
    PRECISION3["MEDIUM"] = "mediump";
    PRECISION3["HIGH"] = "highp";
  })(PRECISION2 || (PRECISION2 = {}));
  var MASK_TYPES2;
  (function(MASK_TYPES3) {
    MASK_TYPES3[MASK_TYPES3["NONE"] = 0] = "NONE";
    MASK_TYPES3[MASK_TYPES3["SCISSOR"] = 1] = "SCISSOR";
    MASK_TYPES3[MASK_TYPES3["STENCIL"] = 2] = "STENCIL";
    MASK_TYPES3[MASK_TYPES3["SPRITE"] = 3] = "SPRITE";
  })(MASK_TYPES2 || (MASK_TYPES2 = {}));
  var MSAA_QUALITY2;
  (function(MSAA_QUALITY3) {
    MSAA_QUALITY3[MSAA_QUALITY3["NONE"] = 0] = "NONE";
    MSAA_QUALITY3[MSAA_QUALITY3["LOW"] = 2] = "LOW";
    MSAA_QUALITY3[MSAA_QUALITY3["MEDIUM"] = 4] = "MEDIUM";
    MSAA_QUALITY3[MSAA_QUALITY3["HIGH"] = 8] = "HIGH";
  })(MSAA_QUALITY2 || (MSAA_QUALITY2 = {}));
  var BlurFilterPass = function(_super) {
    __extends14(BlurFilterPass2, _super);
    function BlurFilterPass2(horizontal, strength, quality, resolution, kernelSize) {
      if (strength === void 0) {
        strength = 8;
      }
      if (quality === void 0) {
        quality = 4;
      }
      if (resolution === void 0) {
        resolution = settings.RESOLUTION;
      }
      if (kernelSize === void 0) {
        kernelSize = 5;
      }
      var _this = this;
      var vertSrc = generateBlurVertSource(kernelSize, horizontal);
      var fragSrc = generateBlurFragSource(kernelSize);
      _this = _super.call(this, vertSrc, fragSrc) || this;
      _this.horizontal = horizontal;
      _this.resolution = resolution;
      _this._quality = 0;
      _this.quality = quality;
      _this.blur = strength;
      return _this;
    }
    BlurFilterPass2.prototype.apply = function(filterManager, input3, output, clearMode) {
      if (output) {
        if (this.horizontal) {
          this.uniforms.strength = 1 / output.width * (output.width / input3.width);
        } else {
          this.uniforms.strength = 1 / output.height * (output.height / input3.height);
        }
      } else {
        if (this.horizontal) {
          this.uniforms.strength = 1 / filterManager.renderer.width * (filterManager.renderer.width / input3.width);
        } else {
          this.uniforms.strength = 1 / filterManager.renderer.height * (filterManager.renderer.height / input3.height);
        }
      }
      this.uniforms.strength *= this.strength;
      this.uniforms.strength /= this.passes;
      if (this.passes === 1) {
        filterManager.applyFilter(this, input3, output, clearMode);
      } else {
        var renderTarget = filterManager.getFilterTexture();
        var renderer = filterManager.renderer;
        var flip = input3;
        var flop = renderTarget;
        this.state.blend = false;
        filterManager.applyFilter(this, flip, flop, CLEAR_MODES2.CLEAR);
        for (var i = 1; i < this.passes - 1; i++) {
          filterManager.bindAndClear(flip, CLEAR_MODES2.BLIT);
          this.uniforms.uSampler = flop;
          var temp2 = flop;
          flop = flip;
          flip = temp2;
          renderer.shader.bind(this);
          renderer.geometry.draw(5);
        }
        this.state.blend = true;
        filterManager.applyFilter(this, flop, output, clearMode);
        filterManager.returnFilterTexture(renderTarget);
      }
    };
    Object.defineProperty(BlurFilterPass2.prototype, "blur", {
      get: function() {
        return this.strength;
      },
      set: function(value) {
        this.padding = 1 + Math.abs(value) * 2;
        this.strength = value;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(BlurFilterPass2.prototype, "quality", {
      get: function() {
        return this._quality;
      },
      set: function(value) {
        this._quality = value;
        this.passes = value;
      },
      enumerable: false,
      configurable: true
    });
    return BlurFilterPass2;
  }(Filter);
  var BlurFilter = function(_super) {
    __extends14(BlurFilter2, _super);
    function BlurFilter2(strength, quality, resolution, kernelSize) {
      if (strength === void 0) {
        strength = 8;
      }
      if (quality === void 0) {
        quality = 4;
      }
      if (resolution === void 0) {
        resolution = settings.RESOLUTION;
      }
      if (kernelSize === void 0) {
        kernelSize = 5;
      }
      var _this = _super.call(this) || this;
      _this.blurXFilter = new BlurFilterPass(true, strength, quality, resolution, kernelSize);
      _this.blurYFilter = new BlurFilterPass(false, strength, quality, resolution, kernelSize);
      _this.resolution = resolution;
      _this.quality = quality;
      _this.blur = strength;
      _this.repeatEdgePixels = false;
      return _this;
    }
    BlurFilter2.prototype.apply = function(filterManager, input3, output, clearMode) {
      var xStrength = Math.abs(this.blurXFilter.strength);
      var yStrength = Math.abs(this.blurYFilter.strength);
      if (xStrength && yStrength) {
        var renderTarget = filterManager.getFilterTexture();
        this.blurXFilter.apply(filterManager, input3, renderTarget, CLEAR_MODES2.CLEAR);
        this.blurYFilter.apply(filterManager, renderTarget, output, clearMode);
        filterManager.returnFilterTexture(renderTarget);
      } else if (yStrength) {
        this.blurYFilter.apply(filterManager, input3, output, clearMode);
      } else {
        this.blurXFilter.apply(filterManager, input3, output, clearMode);
      }
    };
    BlurFilter2.prototype.updatePadding = function() {
      if (this._repeatEdgePixels) {
        this.padding = 0;
      } else {
        this.padding = Math.max(Math.abs(this.blurXFilter.strength), Math.abs(this.blurYFilter.strength)) * 2;
      }
    };
    Object.defineProperty(BlurFilter2.prototype, "blur", {
      get: function() {
        return this.blurXFilter.blur;
      },
      set: function(value) {
        this.blurXFilter.blur = this.blurYFilter.blur = value;
        this.updatePadding();
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(BlurFilter2.prototype, "quality", {
      get: function() {
        return this.blurXFilter.quality;
      },
      set: function(value) {
        this.blurXFilter.quality = this.blurYFilter.quality = value;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(BlurFilter2.prototype, "blurX", {
      get: function() {
        return this.blurXFilter.blur;
      },
      set: function(value) {
        this.blurXFilter.blur = value;
        this.updatePadding();
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(BlurFilter2.prototype, "blurY", {
      get: function() {
        return this.blurYFilter.blur;
      },
      set: function(value) {
        this.blurYFilter.blur = value;
        this.updatePadding();
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(BlurFilter2.prototype, "blendMode", {
      get: function() {
        return this.blurYFilter.blendMode;
      },
      set: function(value) {
        this.blurYFilter.blendMode = value;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(BlurFilter2.prototype, "repeatEdgePixels", {
      get: function() {
        return this._repeatEdgePixels;
      },
      set: function(value) {
        this._repeatEdgePixels = value;
        this.updatePadding();
      },
      enumerable: false,
      configurable: true
    });
    return BlurFilter2;
  }(Filter);

  // node_modules/@pixi/filter-color-matrix/lib/filter-color-matrix.es.js
  /*!
   * @pixi/filter-color-matrix - v5.3.3
   * Compiled Tue, 04 Aug 2020 16:23:09 UTC
   *
   * @pixi/filter-color-matrix is licensed under the MIT License.
   * http://www.opensource.org/licenses/mit-license
   */
  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation. All rights reserved.
  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at http://www.apache.org/licenses/LICENSE-2.0
  
  THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
  WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
  MERCHANTABLITY OR NON-INFRINGEMENT.
  
  See the Apache Version 2.0 License for specific language governing permissions
  and limitations under the License.
  ***************************************************************************** */
  var extendStatics15 = function(d, b) {
    extendStatics15 = Object.setPrototypeOf || {__proto__: []} instanceof Array && function(d2, b2) {
      d2.__proto__ = b2;
    } || function(d2, b2) {
      for (var p in b2) {
        if (b2.hasOwnProperty(p)) {
          d2[p] = b2[p];
        }
      }
    };
    return extendStatics15(d, b);
  };
  function __extends15(d, b) {
    extendStatics15(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  }
  var fragment6 = "varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform float m[20];\nuniform float uAlpha;\n\nvoid main(void)\n{\n    vec4 c = texture2D(uSampler, vTextureCoord);\n\n    if (uAlpha == 0.0) {\n        gl_FragColor = c;\n        return;\n    }\n\n    // Un-premultiply alpha before applying the color matrix. See issue #3539.\n    if (c.a > 0.0) {\n      c.rgb /= c.a;\n    }\n\n    vec4 result;\n\n    result.r = (m[0] * c.r);\n        result.r += (m[1] * c.g);\n        result.r += (m[2] * c.b);\n        result.r += (m[3] * c.a);\n        result.r += m[4];\n\n    result.g = (m[5] * c.r);\n        result.g += (m[6] * c.g);\n        result.g += (m[7] * c.b);\n        result.g += (m[8] * c.a);\n        result.g += m[9];\n\n    result.b = (m[10] * c.r);\n       result.b += (m[11] * c.g);\n       result.b += (m[12] * c.b);\n       result.b += (m[13] * c.a);\n       result.b += m[14];\n\n    result.a = (m[15] * c.r);\n       result.a += (m[16] * c.g);\n       result.a += (m[17] * c.b);\n       result.a += (m[18] * c.a);\n       result.a += m[19];\n\n    vec3 rgb = mix(c.rgb, result.rgb, uAlpha);\n\n    // Premultiply alpha again.\n    rgb *= result.a;\n\n    gl_FragColor = vec4(rgb, result.a);\n}\n";
  var ColorMatrixFilter = function(_super) {
    __extends15(ColorMatrixFilter2, _super);
    function ColorMatrixFilter2() {
      var _this = this;
      var uniforms = {
        m: new Float32Array([
          1,
          0,
          0,
          0,
          0,
          0,
          1,
          0,
          0,
          0,
          0,
          0,
          1,
          0,
          0,
          0,
          0,
          0,
          1,
          0
        ]),
        uAlpha: 1
      };
      _this = _super.call(this, defaultFilter, fragment6, uniforms) || this;
      _this.alpha = 1;
      return _this;
    }
    ColorMatrixFilter2.prototype._loadMatrix = function(matrix, multiply) {
      if (multiply === void 0) {
        multiply = false;
      }
      var newMatrix = matrix;
      if (multiply) {
        this._multiply(newMatrix, this.uniforms.m, matrix);
        newMatrix = this._colorMatrix(newMatrix);
      }
      this.uniforms.m = newMatrix;
    };
    ColorMatrixFilter2.prototype._multiply = function(out, a, b) {
      out[0] = a[0] * b[0] + a[1] * b[5] + a[2] * b[10] + a[3] * b[15];
      out[1] = a[0] * b[1] + a[1] * b[6] + a[2] * b[11] + a[3] * b[16];
      out[2] = a[0] * b[2] + a[1] * b[7] + a[2] * b[12] + a[3] * b[17];
      out[3] = a[0] * b[3] + a[1] * b[8] + a[2] * b[13] + a[3] * b[18];
      out[4] = a[0] * b[4] + a[1] * b[9] + a[2] * b[14] + a[3] * b[19] + a[4];
      out[5] = a[5] * b[0] + a[6] * b[5] + a[7] * b[10] + a[8] * b[15];
      out[6] = a[5] * b[1] + a[6] * b[6] + a[7] * b[11] + a[8] * b[16];
      out[7] = a[5] * b[2] + a[6] * b[7] + a[7] * b[12] + a[8] * b[17];
      out[8] = a[5] * b[3] + a[6] * b[8] + a[7] * b[13] + a[8] * b[18];
      out[9] = a[5] * b[4] + a[6] * b[9] + a[7] * b[14] + a[8] * b[19] + a[9];
      out[10] = a[10] * b[0] + a[11] * b[5] + a[12] * b[10] + a[13] * b[15];
      out[11] = a[10] * b[1] + a[11] * b[6] + a[12] * b[11] + a[13] * b[16];
      out[12] = a[10] * b[2] + a[11] * b[7] + a[12] * b[12] + a[13] * b[17];
      out[13] = a[10] * b[3] + a[11] * b[8] + a[12] * b[13] + a[13] * b[18];
      out[14] = a[10] * b[4] + a[11] * b[9] + a[12] * b[14] + a[13] * b[19] + a[14];
      out[15] = a[15] * b[0] + a[16] * b[5] + a[17] * b[10] + a[18] * b[15];
      out[16] = a[15] * b[1] + a[16] * b[6] + a[17] * b[11] + a[18] * b[16];
      out[17] = a[15] * b[2] + a[16] * b[7] + a[17] * b[12] + a[18] * b[17];
      out[18] = a[15] * b[3] + a[16] * b[8] + a[17] * b[13] + a[18] * b[18];
      out[19] = a[15] * b[4] + a[16] * b[9] + a[17] * b[14] + a[18] * b[19] + a[19];
      return out;
    };
    ColorMatrixFilter2.prototype._colorMatrix = function(matrix) {
      var m = new Float32Array(matrix);
      m[4] /= 255;
      m[9] /= 255;
      m[14] /= 255;
      m[19] /= 255;
      return m;
    };
    ColorMatrixFilter2.prototype.brightness = function(b, multiply) {
      var matrix = [
        b,
        0,
        0,
        0,
        0,
        0,
        b,
        0,
        0,
        0,
        0,
        0,
        b,
        0,
        0,
        0,
        0,
        0,
        1,
        0
      ];
      this._loadMatrix(matrix, multiply);
    };
    ColorMatrixFilter2.prototype.greyscale = function(scale, multiply) {
      var matrix = [
        scale,
        scale,
        scale,
        0,
        0,
        scale,
        scale,
        scale,
        0,
        0,
        scale,
        scale,
        scale,
        0,
        0,
        0,
        0,
        0,
        1,
        0
      ];
      this._loadMatrix(matrix, multiply);
    };
    ColorMatrixFilter2.prototype.blackAndWhite = function(multiply) {
      var matrix = [
        0.3,
        0.6,
        0.1,
        0,
        0,
        0.3,
        0.6,
        0.1,
        0,
        0,
        0.3,
        0.6,
        0.1,
        0,
        0,
        0,
        0,
        0,
        1,
        0
      ];
      this._loadMatrix(matrix, multiply);
    };
    ColorMatrixFilter2.prototype.hue = function(rotation, multiply) {
      rotation = (rotation || 0) / 180 * Math.PI;
      var cosR = Math.cos(rotation);
      var sinR = Math.sin(rotation);
      var sqrt = Math.sqrt;
      var w = 1 / 3;
      var sqrW = sqrt(w);
      var a00 = cosR + (1 - cosR) * w;
      var a01 = w * (1 - cosR) - sqrW * sinR;
      var a02 = w * (1 - cosR) + sqrW * sinR;
      var a10 = w * (1 - cosR) + sqrW * sinR;
      var a11 = cosR + w * (1 - cosR);
      var a12 = w * (1 - cosR) - sqrW * sinR;
      var a20 = w * (1 - cosR) - sqrW * sinR;
      var a21 = w * (1 - cosR) + sqrW * sinR;
      var a22 = cosR + w * (1 - cosR);
      var matrix = [
        a00,
        a01,
        a02,
        0,
        0,
        a10,
        a11,
        a12,
        0,
        0,
        a20,
        a21,
        a22,
        0,
        0,
        0,
        0,
        0,
        1,
        0
      ];
      this._loadMatrix(matrix, multiply);
    };
    ColorMatrixFilter2.prototype.contrast = function(amount, multiply) {
      var v = (amount || 0) + 1;
      var o = -0.5 * (v - 1);
      var matrix = [
        v,
        0,
        0,
        0,
        o,
        0,
        v,
        0,
        0,
        o,
        0,
        0,
        v,
        0,
        o,
        0,
        0,
        0,
        1,
        0
      ];
      this._loadMatrix(matrix, multiply);
    };
    ColorMatrixFilter2.prototype.saturate = function(amount, multiply) {
      if (amount === void 0) {
        amount = 0;
      }
      var x = amount * 2 / 3 + 1;
      var y = (x - 1) * -0.5;
      var matrix = [
        x,
        y,
        y,
        0,
        0,
        y,
        x,
        y,
        0,
        0,
        y,
        y,
        x,
        0,
        0,
        0,
        0,
        0,
        1,
        0
      ];
      this._loadMatrix(matrix, multiply);
    };
    ColorMatrixFilter2.prototype.desaturate = function() {
      this.saturate(-1);
    };
    ColorMatrixFilter2.prototype.negative = function(multiply) {
      var matrix = [
        -1,
        0,
        0,
        1,
        0,
        0,
        -1,
        0,
        1,
        0,
        0,
        0,
        -1,
        1,
        0,
        0,
        0,
        0,
        1,
        0
      ];
      this._loadMatrix(matrix, multiply);
    };
    ColorMatrixFilter2.prototype.sepia = function(multiply) {
      var matrix = [
        0.393,
        0.7689999,
        0.18899999,
        0,
        0,
        0.349,
        0.6859999,
        0.16799999,
        0,
        0,
        0.272,
        0.5339999,
        0.13099999,
        0,
        0,
        0,
        0,
        0,
        1,
        0
      ];
      this._loadMatrix(matrix, multiply);
    };
    ColorMatrixFilter2.prototype.technicolor = function(multiply) {
      var matrix = [
        1.9125277891456083,
        -0.8545344976951645,
        -0.09155508482755585,
        0,
        11.793603434377337,
        -0.3087833385928097,
        1.7658908555458428,
        -0.10601743074722245,
        0,
        -70.35205161461398,
        -0.231103377548616,
        -0.7501899197440212,
        1.847597816108189,
        0,
        30.950940869491138,
        0,
        0,
        0,
        1,
        0
      ];
      this._loadMatrix(matrix, multiply);
    };
    ColorMatrixFilter2.prototype.polaroid = function(multiply) {
      var matrix = [
        1.438,
        -0.062,
        -0.062,
        0,
        0,
        -0.122,
        1.378,
        -0.122,
        0,
        0,
        -0.016,
        -0.016,
        1.483,
        0,
        0,
        0,
        0,
        0,
        1,
        0
      ];
      this._loadMatrix(matrix, multiply);
    };
    ColorMatrixFilter2.prototype.toBGR = function(multiply) {
      var matrix = [
        0,
        0,
        1,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        1,
        0
      ];
      this._loadMatrix(matrix, multiply);
    };
    ColorMatrixFilter2.prototype.kodachrome = function(multiply) {
      var matrix = [
        1.1285582396593525,
        -0.3967382283601348,
        -0.03992559172921793,
        0,
        63.72958762196502,
        -0.16404339962244616,
        1.0835251566291304,
        -0.05498805115633132,
        0,
        24.732407896706203,
        -0.16786010706155763,
        -0.5603416277695248,
        1.6014850761964943,
        0,
        35.62982807460946,
        0,
        0,
        0,
        1,
        0
      ];
      this._loadMatrix(matrix, multiply);
    };
    ColorMatrixFilter2.prototype.browni = function(multiply) {
      var matrix = [
        0.5997023498159715,
        0.34553243048391263,
        -0.2708298674538042,
        0,
        47.43192855600873,
        -0.037703249837783157,
        0.8609577587992641,
        0.15059552388459913,
        0,
        -36.96841498319127,
        0.24113635128153335,
        -0.07441037908422492,
        0.44972182064877153,
        0,
        -7.562075277591283,
        0,
        0,
        0,
        1,
        0
      ];
      this._loadMatrix(matrix, multiply);
    };
    ColorMatrixFilter2.prototype.vintage = function(multiply) {
      var matrix = [
        0.6279345635605994,
        0.3202183420819367,
        -0.03965408211312453,
        0,
        9.651285835294123,
        0.02578397704808868,
        0.6441188644374771,
        0.03259127616149294,
        0,
        7.462829176470591,
        0.0466055556782719,
        -0.0851232987247891,
        0.5241648018700465,
        0,
        5.159190588235296,
        0,
        0,
        0,
        1,
        0
      ];
      this._loadMatrix(matrix, multiply);
    };
    ColorMatrixFilter2.prototype.colorTone = function(desaturation, toned, lightColor, darkColor, multiply) {
      desaturation = desaturation || 0.2;
      toned = toned || 0.15;
      lightColor = lightColor || 16770432;
      darkColor = darkColor || 3375104;
      var lR = (lightColor >> 16 & 255) / 255;
      var lG = (lightColor >> 8 & 255) / 255;
      var lB = (lightColor & 255) / 255;
      var dR = (darkColor >> 16 & 255) / 255;
      var dG = (darkColor >> 8 & 255) / 255;
      var dB = (darkColor & 255) / 255;
      var matrix = [
        0.3,
        0.59,
        0.11,
        0,
        0,
        lR,
        lG,
        lB,
        desaturation,
        0,
        dR,
        dG,
        dB,
        toned,
        0,
        lR - dR,
        lG - dG,
        lB - dB,
        0,
        0
      ];
      this._loadMatrix(matrix, multiply);
    };
    ColorMatrixFilter2.prototype.night = function(intensity, multiply) {
      intensity = intensity || 0.1;
      var matrix = [
        intensity * -2,
        -intensity,
        0,
        0,
        0,
        -intensity,
        0,
        intensity,
        0,
        0,
        0,
        intensity,
        intensity * 2,
        0,
        0,
        0,
        0,
        0,
        1,
        0
      ];
      this._loadMatrix(matrix, multiply);
    };
    ColorMatrixFilter2.prototype.predator = function(amount, multiply) {
      var matrix = [
        11.224130630493164 * amount,
        -4.794486999511719 * amount,
        -2.8746118545532227 * amount,
        0 * amount,
        0.40342438220977783 * amount,
        -3.6330697536468506 * amount,
        9.193157196044922 * amount,
        -2.951810836791992 * amount,
        0 * amount,
        -1.316135048866272 * amount,
        -3.2184197902679443 * amount,
        -4.2375030517578125 * amount,
        7.476448059082031 * amount,
        0 * amount,
        0.8044459223747253 * amount,
        0,
        0,
        0,
        1,
        0
      ];
      this._loadMatrix(matrix, multiply);
    };
    ColorMatrixFilter2.prototype.lsd = function(multiply) {
      var matrix = [
        2,
        -0.4,
        0.5,
        0,
        0,
        -0.5,
        2,
        -0.4,
        0,
        0,
        -0.4,
        -0.5,
        3,
        0,
        0,
        0,
        0,
        0,
        1,
        0
      ];
      this._loadMatrix(matrix, multiply);
    };
    ColorMatrixFilter2.prototype.reset = function() {
      var matrix = [
        1,
        0,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        0,
        1,
        0
      ];
      this._loadMatrix(matrix, false);
    };
    Object.defineProperty(ColorMatrixFilter2.prototype, "matrix", {
      get: function() {
        return this.uniforms.m;
      },
      set: function(value) {
        this.uniforms.m = value;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(ColorMatrixFilter2.prototype, "alpha", {
      get: function() {
        return this.uniforms.uAlpha;
      },
      set: function(value) {
        this.uniforms.uAlpha = value;
      },
      enumerable: false,
      configurable: true
    });
    return ColorMatrixFilter2;
  }(Filter);
  ColorMatrixFilter.prototype.grayscale = ColorMatrixFilter.prototype.greyscale;

  // node_modules/@pixi/filter-displacement/lib/filter-displacement.es.js
  /*!
   * @pixi/filter-displacement - v5.3.3
   * Compiled Tue, 04 Aug 2020 16:23:09 UTC
   *
   * @pixi/filter-displacement is licensed under the MIT License.
   * http://www.opensource.org/licenses/mit-license
   */
  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation. All rights reserved.
  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at http://www.apache.org/licenses/LICENSE-2.0
  
  THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
  WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
  MERCHANTABLITY OR NON-INFRINGEMENT.
  
  See the Apache Version 2.0 License for specific language governing permissions
  and limitations under the License.
  ***************************************************************************** */
  var extendStatics16 = function(d, b) {
    extendStatics16 = Object.setPrototypeOf || {__proto__: []} instanceof Array && function(d2, b2) {
      d2.__proto__ = b2;
    } || function(d2, b2) {
      for (var p in b2) {
        if (b2.hasOwnProperty(p)) {
          d2[p] = b2[p];
        }
      }
    };
    return extendStatics16(d, b);
  };
  function __extends16(d, b) {
    extendStatics16(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  }
  var fragment7 = "varying vec2 vFilterCoord;\nvarying vec2 vTextureCoord;\n\nuniform vec2 scale;\nuniform mat2 rotation;\nuniform sampler2D uSampler;\nuniform sampler2D mapSampler;\n\nuniform highp vec4 inputSize;\nuniform vec4 inputClamp;\n\nvoid main(void)\n{\n  vec4 map =  texture2D(mapSampler, vFilterCoord);\n\n  map -= 0.5;\n  map.xy = scale * inputSize.zw * (rotation * map.xy);\n\n  gl_FragColor = texture2D(uSampler, clamp(vec2(vTextureCoord.x + map.x, vTextureCoord.y + map.y), inputClamp.xy, inputClamp.zw));\n}\n";
  var vertex5 = "attribute vec2 aVertexPosition;\n\nuniform mat3 projectionMatrix;\nuniform mat3 filterMatrix;\n\nvarying vec2 vTextureCoord;\nvarying vec2 vFilterCoord;\n\nuniform vec4 inputSize;\nuniform vec4 outputFrame;\n\nvec4 filterVertexPosition( void )\n{\n    vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;\n\n    return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);\n}\n\nvec2 filterTextureCoord( void )\n{\n    return aVertexPosition * (outputFrame.zw * inputSize.zw);\n}\n\nvoid main(void)\n{\n	gl_Position = filterVertexPosition();\n	vTextureCoord = filterTextureCoord();\n	vFilterCoord = ( filterMatrix * vec3( vTextureCoord, 1.0)  ).xy;\n}\n";
  var DisplacementFilter = function(_super) {
    __extends16(DisplacementFilter2, _super);
    function DisplacementFilter2(sprite5, scale) {
      var _this = this;
      var maskMatrix = new Matrix();
      sprite5.renderable = false;
      _this = _super.call(this, vertex5, fragment7, {
        mapSampler: sprite5._texture,
        filterMatrix: maskMatrix,
        scale: {x: 1, y: 1},
        rotation: new Float32Array([1, 0, 0, 1])
      }) || this;
      _this.maskSprite = sprite5;
      _this.maskMatrix = maskMatrix;
      if (scale === null || scale === void 0) {
        scale = 20;
      }
      _this.scale = new Point(scale, scale);
      return _this;
    }
    DisplacementFilter2.prototype.apply = function(filterManager, input3, output, clearMode) {
      this.uniforms.filterMatrix = filterManager.calculateSpriteMatrix(this.maskMatrix, this.maskSprite);
      this.uniforms.scale.x = this.scale.x;
      this.uniforms.scale.y = this.scale.y;
      var wt = this.maskSprite.worldTransform;
      var lenX = Math.sqrt(wt.a * wt.a + wt.b * wt.b);
      var lenY = Math.sqrt(wt.c * wt.c + wt.d * wt.d);
      if (lenX !== 0 && lenY !== 0) {
        this.uniforms.rotation[0] = wt.a / lenX;
        this.uniforms.rotation[1] = wt.b / lenX;
        this.uniforms.rotation[2] = wt.c / lenY;
        this.uniforms.rotation[3] = wt.d / lenY;
      }
      filterManager.applyFilter(this, input3, output, clearMode);
    };
    Object.defineProperty(DisplacementFilter2.prototype, "map", {
      get: function() {
        return this.uniforms.mapSampler;
      },
      set: function(value) {
        this.uniforms.mapSampler = value;
      },
      enumerable: false,
      configurable: true
    });
    return DisplacementFilter2;
  }(Filter);

  // node_modules/@pixi/filter-fxaa/lib/filter-fxaa.es.js
  /*!
   * @pixi/filter-fxaa - v5.3.3
   * Compiled Tue, 04 Aug 2020 16:23:09 UTC
   *
   * @pixi/filter-fxaa is licensed under the MIT License.
   * http://www.opensource.org/licenses/mit-license
   */
  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation. All rights reserved.
  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at http://www.apache.org/licenses/LICENSE-2.0
  
  THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
  WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
  MERCHANTABLITY OR NON-INFRINGEMENT.
  
  See the Apache Version 2.0 License for specific language governing permissions
  and limitations under the License.
  ***************************************************************************** */
  var extendStatics17 = function(d, b) {
    extendStatics17 = Object.setPrototypeOf || {__proto__: []} instanceof Array && function(d2, b2) {
      d2.__proto__ = b2;
    } || function(d2, b2) {
      for (var p in b2) {
        if (b2.hasOwnProperty(p)) {
          d2[p] = b2[p];
        }
      }
    };
    return extendStatics17(d, b);
  };
  function __extends17(d, b) {
    extendStatics17(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  }
  var vertex6 = "\nattribute vec2 aVertexPosition;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 v_rgbNW;\nvarying vec2 v_rgbNE;\nvarying vec2 v_rgbSW;\nvarying vec2 v_rgbSE;\nvarying vec2 v_rgbM;\n\nvarying vec2 vFragCoord;\n\nuniform vec4 inputPixel;\nuniform vec4 outputFrame;\n\nvec4 filterVertexPosition( void )\n{\n    vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;\n\n    return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);\n}\n\nvoid texcoords(vec2 fragCoord, vec2 inverseVP,\n               out vec2 v_rgbNW, out vec2 v_rgbNE,\n               out vec2 v_rgbSW, out vec2 v_rgbSE,\n               out vec2 v_rgbM) {\n    v_rgbNW = (fragCoord + vec2(-1.0, -1.0)) * inverseVP;\n    v_rgbNE = (fragCoord + vec2(1.0, -1.0)) * inverseVP;\n    v_rgbSW = (fragCoord + vec2(-1.0, 1.0)) * inverseVP;\n    v_rgbSE = (fragCoord + vec2(1.0, 1.0)) * inverseVP;\n    v_rgbM = vec2(fragCoord * inverseVP);\n}\n\nvoid main(void) {\n\n   gl_Position = filterVertexPosition();\n\n   vFragCoord = aVertexPosition * outputFrame.zw;\n\n   texcoords(vFragCoord, inputPixel.zw, v_rgbNW, v_rgbNE, v_rgbSW, v_rgbSE, v_rgbM);\n}\n";
  var fragment8 = `varying vec2 v_rgbNW;
varying vec2 v_rgbNE;
varying vec2 v_rgbSW;
varying vec2 v_rgbSE;
varying vec2 v_rgbM;

varying vec2 vFragCoord;
uniform sampler2D uSampler;
uniform highp vec4 inputPixel;


/**
 Basic FXAA implementation based on the code on geeks3d.com with the
 modification that the texture2DLod stuff was removed since it's
 unsupported by WebGL.

 --

 From:
 https://github.com/mitsuhiko/webgl-meincraft

 Copyright (c) 2011 by Armin Ronacher.

 Some rights reserved.

 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions are
 met:

 * Redistributions of source code must retain the above copyright
 notice, this list of conditions and the following disclaimer.

 * Redistributions in binary form must reproduce the above
 copyright notice, this list of conditions and the following
 disclaimer in the documentation and/or other materials provided
 with the distribution.

 * The names of the contributors may not be used to endorse or
 promote products derived from this software without specific
 prior written permission.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

#ifndef FXAA_REDUCE_MIN
#define FXAA_REDUCE_MIN   (1.0/ 128.0)
#endif
#ifndef FXAA_REDUCE_MUL
#define FXAA_REDUCE_MUL   (1.0 / 8.0)
#endif
#ifndef FXAA_SPAN_MAX
#define FXAA_SPAN_MAX     8.0
#endif

//optimized version for mobile, where dependent
//texture reads can be a bottleneck
vec4 fxaa(sampler2D tex, vec2 fragCoord, vec2 inverseVP,
          vec2 v_rgbNW, vec2 v_rgbNE,
          vec2 v_rgbSW, vec2 v_rgbSE,
          vec2 v_rgbM) {
    vec4 color;
    vec3 rgbNW = texture2D(tex, v_rgbNW).xyz;
    vec3 rgbNE = texture2D(tex, v_rgbNE).xyz;
    vec3 rgbSW = texture2D(tex, v_rgbSW).xyz;
    vec3 rgbSE = texture2D(tex, v_rgbSE).xyz;
    vec4 texColor = texture2D(tex, v_rgbM);
    vec3 rgbM  = texColor.xyz;
    vec3 luma = vec3(0.299, 0.587, 0.114);
    float lumaNW = dot(rgbNW, luma);
    float lumaNE = dot(rgbNE, luma);
    float lumaSW = dot(rgbSW, luma);
    float lumaSE = dot(rgbSE, luma);
    float lumaM  = dot(rgbM,  luma);
    float lumaMin = min(lumaM, min(min(lumaNW, lumaNE), min(lumaSW, lumaSE)));
    float lumaMax = max(lumaM, max(max(lumaNW, lumaNE), max(lumaSW, lumaSE)));

    mediump vec2 dir;
    dir.x = -((lumaNW + lumaNE) - (lumaSW + lumaSE));
    dir.y =  ((lumaNW + lumaSW) - (lumaNE + lumaSE));

    float dirReduce = max((lumaNW + lumaNE + lumaSW + lumaSE) *
                          (0.25 * FXAA_REDUCE_MUL), FXAA_REDUCE_MIN);

    float rcpDirMin = 1.0 / (min(abs(dir.x), abs(dir.y)) + dirReduce);
    dir = min(vec2(FXAA_SPAN_MAX, FXAA_SPAN_MAX),
              max(vec2(-FXAA_SPAN_MAX, -FXAA_SPAN_MAX),
                  dir * rcpDirMin)) * inverseVP;

    vec3 rgbA = 0.5 * (
                       texture2D(tex, fragCoord * inverseVP + dir * (1.0 / 3.0 - 0.5)).xyz +
                       texture2D(tex, fragCoord * inverseVP + dir * (2.0 / 3.0 - 0.5)).xyz);
    vec3 rgbB = rgbA * 0.5 + 0.25 * (
                                     texture2D(tex, fragCoord * inverseVP + dir * -0.5).xyz +
                                     texture2D(tex, fragCoord * inverseVP + dir * 0.5).xyz);

    float lumaB = dot(rgbB, luma);
    if ((lumaB < lumaMin) || (lumaB > lumaMax))
        color = vec4(rgbA, texColor.a);
    else
        color = vec4(rgbB, texColor.a);
    return color;
}

void main() {

      vec4 color;

      color = fxaa(uSampler, vFragCoord, inputPixel.zw, v_rgbNW, v_rgbNE, v_rgbSW, v_rgbSE, v_rgbM);

      gl_FragColor = color;
}
`;
  var FXAAFilter = function(_super) {
    __extends17(FXAAFilter2, _super);
    function FXAAFilter2() {
      return _super.call(this, vertex6, fragment8) || this;
    }
    return FXAAFilter2;
  }(Filter);

  // node_modules/@pixi/filter-noise/lib/filter-noise.es.js
  /*!
   * @pixi/filter-noise - v5.3.3
   * Compiled Tue, 04 Aug 2020 16:23:09 UTC
   *
   * @pixi/filter-noise is licensed under the MIT License.
   * http://www.opensource.org/licenses/mit-license
   */
  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation. All rights reserved.
  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at http://www.apache.org/licenses/LICENSE-2.0
  
  THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
  WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
  MERCHANTABLITY OR NON-INFRINGEMENT.
  
  See the Apache Version 2.0 License for specific language governing permissions
  and limitations under the License.
  ***************************************************************************** */
  var extendStatics18 = function(d, b) {
    extendStatics18 = Object.setPrototypeOf || {__proto__: []} instanceof Array && function(d2, b2) {
      d2.__proto__ = b2;
    } || function(d2, b2) {
      for (var p in b2) {
        if (b2.hasOwnProperty(p)) {
          d2[p] = b2[p];
        }
      }
    };
    return extendStatics18(d, b);
  };
  function __extends18(d, b) {
    extendStatics18(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  }
  var fragment9 = "precision highp float;\n\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\n\nuniform float uNoise;\nuniform float uSeed;\nuniform sampler2D uSampler;\n\nfloat rand(vec2 co)\n{\n    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);\n}\n\nvoid main()\n{\n    vec4 color = texture2D(uSampler, vTextureCoord);\n    float randomValue = rand(gl_FragCoord.xy * uSeed);\n    float diff = (randomValue - 0.5) * uNoise;\n\n    // Un-premultiply alpha before applying the color matrix. See issue #3539.\n    if (color.a > 0.0) {\n        color.rgb /= color.a;\n    }\n\n    color.r += diff;\n    color.g += diff;\n    color.b += diff;\n\n    // Premultiply alpha again.\n    color.rgb *= color.a;\n\n    gl_FragColor = color;\n}\n";
  var NoiseFilter = function(_super) {
    __extends18(NoiseFilter2, _super);
    function NoiseFilter2(noise, seed) {
      if (noise === void 0) {
        noise = 0.5;
      }
      if (seed === void 0) {
        seed = Math.random();
      }
      var _this = _super.call(this, defaultFilter, fragment9, {
        uNoise: 0,
        uSeed: 0
      }) || this;
      _this.noise = noise;
      _this.seed = seed;
      return _this;
    }
    Object.defineProperty(NoiseFilter2.prototype, "noise", {
      get: function() {
        return this.uniforms.uNoise;
      },
      set: function(value) {
        this.uniforms.uNoise = value;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(NoiseFilter2.prototype, "seed", {
      get: function() {
        return this.uniforms.uSeed;
      },
      set: function(value) {
        this.uniforms.uSeed = value;
      },
      enumerable: false,
      configurable: true
    });
    return NoiseFilter2;
  }(Filter);

  // node_modules/@pixi/mixin-cache-as-bitmap/lib/mixin-cache-as-bitmap.es.js
  /*!
   * @pixi/mixin-cache-as-bitmap - v5.3.3
   * Compiled Tue, 04 Aug 2020 16:23:09 UTC
   *
   * @pixi/mixin-cache-as-bitmap is licensed under the MIT License.
   * http://www.opensource.org/licenses/mit-license
   */
  var _tempMatrix = new Matrix();
  DisplayObject.prototype._cacheAsBitmap = false;
  DisplayObject.prototype._cacheData = null;
  var CacheData = function() {
    function CacheData2() {
      this.textureCacheId = null;
      this.originalRender = null;
      this.originalRenderCanvas = null;
      this.originalCalculateBounds = null;
      this.originalGetLocalBounds = null;
      this.originalUpdateTransform = null;
      this.originalDestroy = null;
      this.originalMask = null;
      this.originalFilterArea = null;
      this.originalContainsPoint = null;
      this.sprite = null;
    }
    return CacheData2;
  }();
  Object.defineProperties(DisplayObject.prototype, {
    cacheAsBitmap: {
      get: function() {
        return this._cacheAsBitmap;
      },
      set: function(value) {
        if (this._cacheAsBitmap === value) {
          return;
        }
        this._cacheAsBitmap = value;
        var data;
        if (value) {
          if (!this._cacheData) {
            this._cacheData = new CacheData();
          }
          data = this._cacheData;
          data.originalRender = this.render;
          data.originalRenderCanvas = this.renderCanvas;
          data.originalUpdateTransform = this.updateTransform;
          data.originalCalculateBounds = this.calculateBounds;
          data.originalGetLocalBounds = this.getLocalBounds;
          data.originalDestroy = this.destroy;
          data.originalContainsPoint = this.containsPoint;
          data.originalMask = this._mask;
          data.originalFilterArea = this.filterArea;
          this.render = this._renderCached;
          this.renderCanvas = this._renderCachedCanvas;
          this.destroy = this._cacheAsBitmapDestroy;
        } else {
          data = this._cacheData;
          if (data.sprite) {
            this._destroyCachedDisplayObject();
          }
          this.render = data.originalRender;
          this.renderCanvas = data.originalRenderCanvas;
          this.calculateBounds = data.originalCalculateBounds;
          this.getLocalBounds = data.originalGetLocalBounds;
          this.destroy = data.originalDestroy;
          this.updateTransform = data.originalUpdateTransform;
          this.containsPoint = data.originalContainsPoint;
          this._mask = data.originalMask;
          this.filterArea = data.originalFilterArea;
        }
      }
    }
  });
  DisplayObject.prototype._renderCached = function _renderCached(renderer) {
    if (!this.visible || this.worldAlpha <= 0 || !this.renderable) {
      return;
    }
    this._initCachedDisplayObject(renderer);
    this._cacheData.sprite.transform._worldID = this.transform._worldID;
    this._cacheData.sprite.worldAlpha = this.worldAlpha;
    this._cacheData.sprite._render(renderer);
  };
  DisplayObject.prototype._initCachedDisplayObject = function _initCachedDisplayObject(renderer) {
    if (this._cacheData && this._cacheData.sprite) {
      return;
    }
    var cacheAlpha = this.alpha;
    this.alpha = 1;
    renderer.batch.flush();
    var bounds = this.getLocalBounds(null, true).clone();
    if (this.filters) {
      var padding = this.filters[0].padding;
      bounds.pad(padding);
    }
    bounds.ceil(settings.RESOLUTION);
    var cachedRenderTexture = renderer.renderTexture.current;
    var cachedSourceFrame = renderer.renderTexture.sourceFrame.clone();
    var cachedProjectionTransform = renderer.projection.transform;
    var renderTexture = RenderTexture.create({width: bounds.width, height: bounds.height});
    var textureCacheId = "cacheAsBitmap_" + uid();
    this._cacheData.textureCacheId = textureCacheId;
    BaseTexture.addToCache(renderTexture.baseTexture, textureCacheId);
    Texture.addToCache(renderTexture, textureCacheId);
    var m = this.transform.localTransform.copyTo(_tempMatrix).invert().translate(-bounds.x, -bounds.y);
    this.render = this._cacheData.originalRender;
    renderer.render(this, renderTexture, true, m, false);
    renderer.projection.transform = cachedProjectionTransform;
    renderer.renderTexture.bind(cachedRenderTexture, cachedSourceFrame);
    this.render = this._renderCached;
    this.updateTransform = this.displayObjectUpdateTransform;
    this.calculateBounds = this._calculateCachedBounds;
    this.getLocalBounds = this._getCachedLocalBounds;
    this._mask = null;
    this.filterArea = null;
    var cachedSprite = new Sprite(renderTexture);
    cachedSprite.transform.worldTransform = this.transform.worldTransform;
    cachedSprite.anchor.x = -(bounds.x / bounds.width);
    cachedSprite.anchor.y = -(bounds.y / bounds.height);
    cachedSprite.alpha = cacheAlpha;
    cachedSprite._bounds = this._bounds;
    this._cacheData.sprite = cachedSprite;
    this.transform._parentID = -1;
    if (!this.parent) {
      this.enableTempParent();
      this.updateTransform();
      this.disableTempParent(null);
    } else {
      this.updateTransform();
    }
    this.containsPoint = cachedSprite.containsPoint.bind(cachedSprite);
  };
  DisplayObject.prototype._renderCachedCanvas = function _renderCachedCanvas(renderer) {
    if (!this.visible || this.worldAlpha <= 0 || !this.renderable) {
      return;
    }
    this._initCachedDisplayObjectCanvas(renderer);
    this._cacheData.sprite.worldAlpha = this.worldAlpha;
    this._cacheData.sprite._renderCanvas(renderer);
  };
  DisplayObject.prototype._initCachedDisplayObjectCanvas = function _initCachedDisplayObjectCanvas(renderer) {
    if (this._cacheData && this._cacheData.sprite) {
      return;
    }
    var bounds = this.getLocalBounds(null, true);
    var cacheAlpha = this.alpha;
    this.alpha = 1;
    var cachedRenderTarget = renderer.context;
    var cachedProjectionTransform = renderer._projTransform;
    bounds.ceil(settings.RESOLUTION);
    var renderTexture = RenderTexture.create({width: bounds.width, height: bounds.height});
    var textureCacheId = "cacheAsBitmap_" + uid();
    this._cacheData.textureCacheId = textureCacheId;
    BaseTexture.addToCache(renderTexture.baseTexture, textureCacheId);
    Texture.addToCache(renderTexture, textureCacheId);
    var m = _tempMatrix;
    this.transform.localTransform.copyTo(m);
    m.invert();
    m.tx -= bounds.x;
    m.ty -= bounds.y;
    this.renderCanvas = this._cacheData.originalRenderCanvas;
    renderer.render(this, renderTexture, true, m, false);
    renderer.context = cachedRenderTarget;
    renderer._projTransform = cachedProjectionTransform;
    this.renderCanvas = this._renderCachedCanvas;
    this.updateTransform = this.displayObjectUpdateTransform;
    this.calculateBounds = this._calculateCachedBounds;
    this.getLocalBounds = this._getCachedLocalBounds;
    this._mask = null;
    this.filterArea = null;
    var cachedSprite = new Sprite(renderTexture);
    cachedSprite.transform.worldTransform = this.transform.worldTransform;
    cachedSprite.anchor.x = -(bounds.x / bounds.width);
    cachedSprite.anchor.y = -(bounds.y / bounds.height);
    cachedSprite.alpha = cacheAlpha;
    cachedSprite._bounds = this._bounds;
    this._cacheData.sprite = cachedSprite;
    this.transform._parentID = -1;
    if (!this.parent) {
      this.parent = renderer._tempDisplayObjectParent;
      this.updateTransform();
      this.parent = null;
    } else {
      this.updateTransform();
    }
    this.containsPoint = cachedSprite.containsPoint.bind(cachedSprite);
  };
  DisplayObject.prototype._calculateCachedBounds = function _calculateCachedBounds() {
    this._bounds.clear();
    this._cacheData.sprite.transform._worldID = this.transform._worldID;
    this._cacheData.sprite._calculateBounds();
    this._bounds.updateID = this._boundsID;
  };
  DisplayObject.prototype._getCachedLocalBounds = function _getCachedLocalBounds() {
    return this._cacheData.sprite.getLocalBounds(null);
  };
  DisplayObject.prototype._destroyCachedDisplayObject = function _destroyCachedDisplayObject() {
    this._cacheData.sprite._texture.destroy(true);
    this._cacheData.sprite = null;
    BaseTexture.removeFromCache(this._cacheData.textureCacheId);
    Texture.removeFromCache(this._cacheData.textureCacheId);
    this._cacheData.textureCacheId = null;
  };
  DisplayObject.prototype._cacheAsBitmapDestroy = function _cacheAsBitmapDestroy(options) {
    this.cacheAsBitmap = false;
    this.destroy(options);
  };

  // node_modules/@pixi/mixin-get-child-by-name/lib/mixin-get-child-by-name.es.js
  /*!
   * @pixi/mixin-get-child-by-name - v5.3.3
   * Compiled Tue, 04 Aug 2020 16:23:09 UTC
   *
   * @pixi/mixin-get-child-by-name is licensed under the MIT License.
   * http://www.opensource.org/licenses/mit-license
   */
  DisplayObject.prototype.name = null;
  Container.prototype.getChildByName = function getChildByName(name, deep) {
    for (var i = 0, j = this.children.length; i < j; i++) {
      if (this.children[i].name === name) {
        return this.children[i];
      }
    }
    if (deep) {
      for (var i = 0, j = this.children.length; i < j; i++) {
        var child = this.children[i];
        if (!child.getChildByName) {
          continue;
        }
        var target = this.children[i].getChildByName(name, true);
        if (target) {
          return target;
        }
      }
    }
    return null;
  };

  // node_modules/@pixi/mixin-get-global-position/lib/mixin-get-global-position.es.js
  /*!
   * @pixi/mixin-get-global-position - v5.3.3
   * Compiled Tue, 04 Aug 2020 16:23:09 UTC
   *
   * @pixi/mixin-get-global-position is licensed under the MIT License.
   * http://www.opensource.org/licenses/mit-license
   */
  DisplayObject.prototype.getGlobalPosition = function getGlobalPosition(point, skipUpdate) {
    if (point === void 0) {
      point = new Point();
    }
    if (skipUpdate === void 0) {
      skipUpdate = false;
    }
    if (this.parent) {
      this.parent.toGlobal(this.position, point, skipUpdate);
    } else {
      point.x = this.position.x;
      point.y = this.position.y;
    }
    return point;
  };

  // node_modules/@pixi/mesh-extras/lib/mesh-extras.es.js
  /*!
   * @pixi/mesh-extras - v5.3.3
   * Compiled Tue, 04 Aug 2020 16:23:09 UTC
   *
   * @pixi/mesh-extras is licensed under the MIT License.
   * http://www.opensource.org/licenses/mit-license
   */
  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation. All rights reserved.
  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at http://www.apache.org/licenses/LICENSE-2.0
  
  THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
  WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
  MERCHANTABLITY OR NON-INFRINGEMENT.
  
  See the Apache Version 2.0 License for specific language governing permissions
  and limitations under the License.
  ***************************************************************************** */
  var extendStatics19 = function(d, b) {
    extendStatics19 = Object.setPrototypeOf || {__proto__: []} instanceof Array && function(d2, b2) {
      d2.__proto__ = b2;
    } || function(d2, b2) {
      for (var p in b2) {
        if (b2.hasOwnProperty(p)) {
          d2[p] = b2[p];
        }
      }
    };
    return extendStatics19(d, b);
  };
  function __extends19(d, b) {
    extendStatics19(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  }
  var PlaneGeometry = function(_super) {
    __extends19(PlaneGeometry2, _super);
    function PlaneGeometry2(width, height, segWidth, segHeight) {
      if (width === void 0) {
        width = 100;
      }
      if (height === void 0) {
        height = 100;
      }
      if (segWidth === void 0) {
        segWidth = 10;
      }
      if (segHeight === void 0) {
        segHeight = 10;
      }
      var _this = _super.call(this) || this;
      _this.segWidth = segWidth;
      _this.segHeight = segHeight;
      _this.width = width;
      _this.height = height;
      _this.build();
      return _this;
    }
    PlaneGeometry2.prototype.build = function() {
      var total = this.segWidth * this.segHeight;
      var verts = [];
      var uvs = [];
      var indices2 = [];
      var segmentsX = this.segWidth - 1;
      var segmentsY = this.segHeight - 1;
      var sizeX = this.width / segmentsX;
      var sizeY = this.height / segmentsY;
      for (var i = 0; i < total; i++) {
        var x = i % this.segWidth;
        var y = i / this.segWidth | 0;
        verts.push(x * sizeX, y * sizeY);
        uvs.push(x / segmentsX, y / segmentsY);
      }
      var totalSub = segmentsX * segmentsY;
      for (var i = 0; i < totalSub; i++) {
        var xpos = i % segmentsX;
        var ypos = i / segmentsX | 0;
        var value = ypos * this.segWidth + xpos;
        var value2 = ypos * this.segWidth + xpos + 1;
        var value3 = (ypos + 1) * this.segWidth + xpos;
        var value4 = (ypos + 1) * this.segWidth + xpos + 1;
        indices2.push(value, value2, value3, value2, value4, value3);
      }
      this.buffers[0].data = new Float32Array(verts);
      this.buffers[1].data = new Float32Array(uvs);
      this.indexBuffer.data = new Uint16Array(indices2);
      this.buffers[0].update();
      this.buffers[1].update();
      this.indexBuffer.update();
    };
    return PlaneGeometry2;
  }(MeshGeometry);
  var RopeGeometry = function(_super) {
    __extends19(RopeGeometry2, _super);
    function RopeGeometry2(width, points, textureScale) {
      if (width === void 0) {
        width = 200;
      }
      if (textureScale === void 0) {
        textureScale = 0;
      }
      var _this = _super.call(this, new Float32Array(points.length * 4), new Float32Array(points.length * 4), new Uint16Array((points.length - 1) * 6)) || this;
      _this.points = points;
      _this._width = width;
      _this.textureScale = textureScale;
      _this.build();
      return _this;
    }
    Object.defineProperty(RopeGeometry2.prototype, "width", {
      get: function() {
        return this._width;
      },
      enumerable: false,
      configurable: true
    });
    RopeGeometry2.prototype.build = function() {
      var points = this.points;
      if (!points) {
        return;
      }
      var vertexBuffer = this.getBuffer("aVertexPosition");
      var uvBuffer = this.getBuffer("aTextureCoord");
      var indexBuffer = this.getIndex();
      if (points.length < 1) {
        return;
      }
      if (vertexBuffer.data.length / 4 !== points.length) {
        vertexBuffer.data = new Float32Array(points.length * 4);
        uvBuffer.data = new Float32Array(points.length * 4);
        indexBuffer.data = new Uint16Array((points.length - 1) * 6);
      }
      var uvs = uvBuffer.data;
      var indices2 = indexBuffer.data;
      uvs[0] = 0;
      uvs[1] = 0;
      uvs[2] = 0;
      uvs[3] = 1;
      var amount = 0;
      var prev = points[0];
      var textureWidth = this._width * this.textureScale;
      var total = points.length;
      for (var i = 0; i < total; i++) {
        var index2 = i * 4;
        if (this.textureScale > 0) {
          var dx = prev.x - points[i].x;
          var dy = prev.y - points[i].y;
          var distance = Math.sqrt(dx * dx + dy * dy);
          prev = points[i];
          amount += distance / textureWidth;
        } else {
          amount = i / (total - 1);
        }
        uvs[index2] = amount;
        uvs[index2 + 1] = 0;
        uvs[index2 + 2] = amount;
        uvs[index2 + 3] = 1;
      }
      var indexCount = 0;
      for (var i = 0; i < total - 1; i++) {
        var index2 = i * 2;
        indices2[indexCount++] = index2;
        indices2[indexCount++] = index2 + 1;
        indices2[indexCount++] = index2 + 2;
        indices2[indexCount++] = index2 + 2;
        indices2[indexCount++] = index2 + 1;
        indices2[indexCount++] = index2 + 3;
      }
      uvBuffer.update();
      indexBuffer.update();
      this.updateVertices();
    };
    RopeGeometry2.prototype.updateVertices = function() {
      var points = this.points;
      if (points.length < 1) {
        return;
      }
      var lastPoint = points[0];
      var nextPoint;
      var perpX = 0;
      var perpY = 0;
      var vertices = this.buffers[0].data;
      var total = points.length;
      for (var i = 0; i < total; i++) {
        var point = points[i];
        var index2 = i * 4;
        if (i < points.length - 1) {
          nextPoint = points[i + 1];
        } else {
          nextPoint = point;
        }
        perpY = -(nextPoint.x - lastPoint.x);
        perpX = nextPoint.y - lastPoint.y;
        var perpLength = Math.sqrt(perpX * perpX + perpY * perpY);
        var num = this.textureScale > 0 ? this.textureScale * this._width / 2 : this._width / 2;
        perpX /= perpLength;
        perpY /= perpLength;
        perpX *= num;
        perpY *= num;
        vertices[index2] = point.x + perpX;
        vertices[index2 + 1] = point.y + perpY;
        vertices[index2 + 2] = point.x - perpX;
        vertices[index2 + 3] = point.y - perpY;
        lastPoint = point;
      }
      this.buffers[0].update();
    };
    RopeGeometry2.prototype.update = function() {
      if (this.textureScale > 0) {
        this.build();
      } else {
        this.updateVertices();
      }
    };
    return RopeGeometry2;
  }(MeshGeometry);
  var SimpleRope = function(_super) {
    __extends19(SimpleRope2, _super);
    function SimpleRope2(texture, points, textureScale) {
      if (textureScale === void 0) {
        textureScale = 0;
      }
      var _this = this;
      var ropeGeometry = new RopeGeometry(texture.height, points, textureScale);
      var meshMaterial = new MeshMaterial(texture);
      if (textureScale > 0) {
        texture.baseTexture.wrapMode = WRAP_MODES.REPEAT;
      }
      _this = _super.call(this, ropeGeometry, meshMaterial) || this;
      _this.autoUpdate = true;
      return _this;
    }
    SimpleRope2.prototype._render = function(renderer) {
      var geometry = this.geometry;
      if (this.autoUpdate || geometry._width !== this.shader.texture.height) {
        geometry._width = this.shader.texture.height;
        geometry.update();
      }
      _super.prototype._render.call(this, renderer);
    };
    return SimpleRope2;
  }(Mesh);
  var SimplePlane = function(_super) {
    __extends19(SimplePlane2, _super);
    function SimplePlane2(texture, verticesX, verticesY) {
      var _this = this;
      var planeGeometry = new PlaneGeometry(texture.width, texture.height, verticesX, verticesY);
      var meshMaterial = new MeshMaterial(Texture.WHITE);
      _this = _super.call(this, planeGeometry, meshMaterial) || this;
      _this.texture = texture;
      return _this;
    }
    SimplePlane2.prototype.textureUpdated = function() {
      this._textureID = this.shader.texture._updateID;
      var geometry = this.geometry;
      geometry.width = this.shader.texture.width;
      geometry.height = this.shader.texture.height;
      geometry.build();
    };
    Object.defineProperty(SimplePlane2.prototype, "texture", {
      get: function() {
        return this.shader.texture;
      },
      set: function(value) {
        if (this.shader.texture === value) {
          return;
        }
        this.shader.texture = value;
        this._textureID = -1;
        if (value.baseTexture.valid) {
          this.textureUpdated();
        } else {
          value.once("update", this.textureUpdated, this);
        }
      },
      enumerable: false,
      configurable: true
    });
    SimplePlane2.prototype._render = function(renderer) {
      if (this._textureID !== this.shader.texture._updateID) {
        this.textureUpdated();
      }
      _super.prototype._render.call(this, renderer);
    };
    return SimplePlane2;
  }(Mesh);
  var SimpleMesh = function(_super) {
    __extends19(SimpleMesh2, _super);
    function SimpleMesh2(texture, vertices, uvs, indices2, drawMode) {
      if (texture === void 0) {
        texture = Texture.EMPTY;
      }
      var _this = this;
      var geometry = new MeshGeometry(vertices, uvs, indices2);
      geometry.getBuffer("aVertexPosition").static = false;
      var meshMaterial = new MeshMaterial(texture);
      _this = _super.call(this, geometry, meshMaterial, null, drawMode) || this;
      _this.autoUpdate = true;
      return _this;
    }
    Object.defineProperty(SimpleMesh2.prototype, "vertices", {
      get: function() {
        return this.geometry.getBuffer("aVertexPosition").data;
      },
      set: function(value) {
        this.geometry.getBuffer("aVertexPosition").data = value;
      },
      enumerable: false,
      configurable: true
    });
    SimpleMesh2.prototype._render = function(renderer) {
      if (this.autoUpdate) {
        this.geometry.getBuffer("aVertexPosition").update();
      }
      _super.prototype._render.call(this, renderer);
    };
    return SimpleMesh2;
  }(Mesh);
  var DEFAULT_BORDER_SIZE = 10;
  var NineSlicePlane = function(_super) {
    __extends19(NineSlicePlane2, _super);
    function NineSlicePlane2(texture, leftWidth, topHeight, rightWidth, bottomHeight) {
      if (leftWidth === void 0) {
        leftWidth = DEFAULT_BORDER_SIZE;
      }
      if (topHeight === void 0) {
        topHeight = DEFAULT_BORDER_SIZE;
      }
      if (rightWidth === void 0) {
        rightWidth = DEFAULT_BORDER_SIZE;
      }
      if (bottomHeight === void 0) {
        bottomHeight = DEFAULT_BORDER_SIZE;
      }
      var _this = _super.call(this, Texture.WHITE, 4, 4) || this;
      _this._origWidth = texture.orig.width;
      _this._origHeight = texture.orig.height;
      _this._width = _this._origWidth;
      _this._height = _this._origHeight;
      _this._leftWidth = leftWidth;
      _this._rightWidth = rightWidth;
      _this._topHeight = topHeight;
      _this._bottomHeight = bottomHeight;
      _this.texture = texture;
      return _this;
    }
    NineSlicePlane2.prototype.textureUpdated = function() {
      this._textureID = this.shader.texture._updateID;
      this._refresh();
    };
    Object.defineProperty(NineSlicePlane2.prototype, "vertices", {
      get: function() {
        return this.geometry.getBuffer("aVertexPosition").data;
      },
      set: function(value) {
        this.geometry.getBuffer("aVertexPosition").data = value;
      },
      enumerable: false,
      configurable: true
    });
    NineSlicePlane2.prototype.updateHorizontalVertices = function() {
      var vertices = this.vertices;
      var scale = this._getMinScale();
      vertices[9] = vertices[11] = vertices[13] = vertices[15] = this._topHeight * scale;
      vertices[17] = vertices[19] = vertices[21] = vertices[23] = this._height - this._bottomHeight * scale;
      vertices[25] = vertices[27] = vertices[29] = vertices[31] = this._height;
    };
    NineSlicePlane2.prototype.updateVerticalVertices = function() {
      var vertices = this.vertices;
      var scale = this._getMinScale();
      vertices[2] = vertices[10] = vertices[18] = vertices[26] = this._leftWidth * scale;
      vertices[4] = vertices[12] = vertices[20] = vertices[28] = this._width - this._rightWidth * scale;
      vertices[6] = vertices[14] = vertices[22] = vertices[30] = this._width;
    };
    NineSlicePlane2.prototype._getMinScale = function() {
      var w = this._leftWidth + this._rightWidth;
      var scaleW = this._width > w ? 1 : this._width / w;
      var h = this._topHeight + this._bottomHeight;
      var scaleH = this._height > h ? 1 : this._height / h;
      var scale = Math.min(scaleW, scaleH);
      return scale;
    };
    Object.defineProperty(NineSlicePlane2.prototype, "width", {
      get: function() {
        return this._width;
      },
      set: function(value) {
        this._width = value;
        this._refresh();
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(NineSlicePlane2.prototype, "height", {
      get: function() {
        return this._height;
      },
      set: function(value) {
        this._height = value;
        this._refresh();
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(NineSlicePlane2.prototype, "leftWidth", {
      get: function() {
        return this._leftWidth;
      },
      set: function(value) {
        this._leftWidth = value;
        this._refresh();
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(NineSlicePlane2.prototype, "rightWidth", {
      get: function() {
        return this._rightWidth;
      },
      set: function(value) {
        this._rightWidth = value;
        this._refresh();
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(NineSlicePlane2.prototype, "topHeight", {
      get: function() {
        return this._topHeight;
      },
      set: function(value) {
        this._topHeight = value;
        this._refresh();
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(NineSlicePlane2.prototype, "bottomHeight", {
      get: function() {
        return this._bottomHeight;
      },
      set: function(value) {
        this._bottomHeight = value;
        this._refresh();
      },
      enumerable: false,
      configurable: true
    });
    NineSlicePlane2.prototype._refresh = function() {
      var texture = this.texture;
      var uvs = this.geometry.buffers[1].data;
      this._origWidth = texture.orig.width;
      this._origHeight = texture.orig.height;
      var _uvw = 1 / this._origWidth;
      var _uvh = 1 / this._origHeight;
      uvs[0] = uvs[8] = uvs[16] = uvs[24] = 0;
      uvs[1] = uvs[3] = uvs[5] = uvs[7] = 0;
      uvs[6] = uvs[14] = uvs[22] = uvs[30] = 1;
      uvs[25] = uvs[27] = uvs[29] = uvs[31] = 1;
      uvs[2] = uvs[10] = uvs[18] = uvs[26] = _uvw * this._leftWidth;
      uvs[4] = uvs[12] = uvs[20] = uvs[28] = 1 - _uvw * this._rightWidth;
      uvs[9] = uvs[11] = uvs[13] = uvs[15] = _uvh * this._topHeight;
      uvs[17] = uvs[19] = uvs[21] = uvs[23] = 1 - _uvh * this._bottomHeight;
      this.updateHorizontalVertices();
      this.updateVerticalVertices();
      this.geometry.buffers[0].update();
      this.geometry.buffers[1].update();
    };
    return NineSlicePlane2;
  }(SimplePlane);

  // node_modules/@pixi/sprite-animated/lib/sprite-animated.es.js
  /*!
   * @pixi/sprite-animated - v5.3.3
   * Compiled Tue, 04 Aug 2020 16:23:09 UTC
   *
   * @pixi/sprite-animated is licensed under the MIT License.
   * http://www.opensource.org/licenses/mit-license
   */
  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation. All rights reserved.
  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at http://www.apache.org/licenses/LICENSE-2.0
  
  THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
  WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
  MERCHANTABLITY OR NON-INFRINGEMENT.
  
  See the Apache Version 2.0 License for specific language governing permissions
  and limitations under the License.
  ***************************************************************************** */
  var extendStatics20 = function(d, b) {
    extendStatics20 = Object.setPrototypeOf || {__proto__: []} instanceof Array && function(d2, b2) {
      d2.__proto__ = b2;
    } || function(d2, b2) {
      for (var p in b2) {
        if (b2.hasOwnProperty(p)) {
          d2[p] = b2[p];
        }
      }
    };
    return extendStatics20(d, b);
  };
  function __extends20(d, b) {
    extendStatics20(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  }
  var AnimatedSprite = function(_super) {
    __extends20(AnimatedSprite2, _super);
    function AnimatedSprite2(textures, autoUpdate) {
      if (autoUpdate === void 0) {
        autoUpdate = true;
      }
      var _this = _super.call(this, textures[0] instanceof Texture ? textures[0] : textures[0].texture) || this;
      _this._textures = null;
      _this._durations = null;
      _this._autoUpdate = autoUpdate;
      _this._isConnectedToTicker = false;
      _this.animationSpeed = 1;
      _this.loop = true;
      _this.updateAnchor = false;
      _this.onComplete = null;
      _this.onFrameChange = null;
      _this.onLoop = null;
      _this._currentTime = 0;
      _this._playing = false;
      _this._previousFrame = null;
      _this.textures = textures;
      return _this;
    }
    AnimatedSprite2.prototype.stop = function() {
      if (!this._playing) {
        return;
      }
      this._playing = false;
      if (this._autoUpdate && this._isConnectedToTicker) {
        Ticker.shared.remove(this.update, this);
        this._isConnectedToTicker = false;
      }
    };
    AnimatedSprite2.prototype.play = function() {
      if (this._playing) {
        return;
      }
      this._playing = true;
      if (this._autoUpdate && !this._isConnectedToTicker) {
        Ticker.shared.add(this.update, this, UPDATE_PRIORITY.HIGH);
        this._isConnectedToTicker = true;
      }
    };
    AnimatedSprite2.prototype.gotoAndStop = function(frameNumber) {
      this.stop();
      var previousFrame = this.currentFrame;
      this._currentTime = frameNumber;
      if (previousFrame !== this.currentFrame) {
        this.updateTexture();
      }
    };
    AnimatedSprite2.prototype.gotoAndPlay = function(frameNumber) {
      var previousFrame = this.currentFrame;
      this._currentTime = frameNumber;
      if (previousFrame !== this.currentFrame) {
        this.updateTexture();
      }
      this.play();
    };
    AnimatedSprite2.prototype.update = function(deltaTime) {
      var elapsed = this.animationSpeed * deltaTime;
      var previousFrame = this.currentFrame;
      if (this._durations !== null) {
        var lag = this._currentTime % 1 * this._durations[this.currentFrame];
        lag += elapsed / 60 * 1e3;
        while (lag < 0) {
          this._currentTime--;
          lag += this._durations[this.currentFrame];
        }
        var sign2 = Math.sign(this.animationSpeed * deltaTime);
        this._currentTime = Math.floor(this._currentTime);
        while (lag >= this._durations[this.currentFrame]) {
          lag -= this._durations[this.currentFrame] * sign2;
          this._currentTime += sign2;
        }
        this._currentTime += lag / this._durations[this.currentFrame];
      } else {
        this._currentTime += elapsed;
      }
      if (this._currentTime < 0 && !this.loop) {
        this.gotoAndStop(0);
        if (this.onComplete) {
          this.onComplete();
        }
      } else if (this._currentTime >= this._textures.length && !this.loop) {
        this.gotoAndStop(this._textures.length - 1);
        if (this.onComplete) {
          this.onComplete();
        }
      } else if (previousFrame !== this.currentFrame) {
        if (this.loop && this.onLoop) {
          if (this.animationSpeed > 0 && this.currentFrame < previousFrame) {
            this.onLoop();
          } else if (this.animationSpeed < 0 && this.currentFrame > previousFrame) {
            this.onLoop();
          }
        }
        this.updateTexture();
      }
    };
    AnimatedSprite2.prototype.updateTexture = function() {
      var currentFrame = this.currentFrame;
      if (this._previousFrame === currentFrame) {
        return;
      }
      this._previousFrame = currentFrame;
      this._texture = this._textures[currentFrame];
      this._textureID = -1;
      this._textureTrimmedID = -1;
      this._cachedTint = 16777215;
      this.uvs = this._texture._uvs.uvsFloat32;
      if (this.updateAnchor) {
        this._anchor.copyFrom(this._texture.defaultAnchor);
      }
      if (this.onFrameChange) {
        this.onFrameChange(this.currentFrame);
      }
    };
    AnimatedSprite2.prototype.destroy = function(options) {
      this.stop();
      _super.prototype.destroy.call(this, options);
      this.onComplete = null;
      this.onFrameChange = null;
      this.onLoop = null;
    };
    AnimatedSprite2.fromFrames = function(frames) {
      var textures = [];
      for (var i = 0; i < frames.length; ++i) {
        textures.push(Texture.from(frames[i]));
      }
      return new AnimatedSprite2(textures);
    };
    AnimatedSprite2.fromImages = function(images) {
      var textures = [];
      for (var i = 0; i < images.length; ++i) {
        textures.push(Texture.from(images[i]));
      }
      return new AnimatedSprite2(textures);
    };
    Object.defineProperty(AnimatedSprite2.prototype, "totalFrames", {
      get: function() {
        return this._textures.length;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(AnimatedSprite2.prototype, "textures", {
      get: function() {
        return this._textures;
      },
      set: function(value) {
        if (value[0] instanceof Texture) {
          this._textures = value;
          this._durations = null;
        } else {
          this._textures = [];
          this._durations = [];
          for (var i = 0; i < value.length; i++) {
            this._textures.push(value[i].texture);
            this._durations.push(value[i].time);
          }
        }
        this._previousFrame = null;
        this.gotoAndStop(0);
        this.updateTexture();
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(AnimatedSprite2.prototype, "currentFrame", {
      get: function() {
        var currentFrame = Math.floor(this._currentTime) % this._textures.length;
        if (currentFrame < 0) {
          currentFrame += this._textures.length;
        }
        return currentFrame;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(AnimatedSprite2.prototype, "playing", {
      get: function() {
        return this._playing;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(AnimatedSprite2.prototype, "autoUpdate", {
      get: function() {
        return this._autoUpdate;
      },
      set: function(value) {
        if (value !== this._autoUpdate) {
          this._autoUpdate = value;
          if (!this._autoUpdate && this._isConnectedToTicker) {
            Ticker.shared.remove(this.update, this);
            this._isConnectedToTicker = false;
          } else if (this._autoUpdate && !this._isConnectedToTicker && this._playing) {
            Ticker.shared.add(this.update, this);
            this._isConnectedToTicker = true;
          }
        }
      },
      enumerable: false,
      configurable: true
    });
    return AnimatedSprite2;
  }(Sprite);

  // node_modules/pixi.js/lib/pixi.es.js
  /*!
   * pixi.js - v5.3.3
   * Compiled Tue, 04 Aug 2020 16:23:09 UTC
   *
   * pixi.js is licensed under the MIT License.
   * http://www.opensource.org/licenses/mit-license
   */
  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation. All rights reserved.
  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at http://www.apache.org/licenses/LICENSE-2.0
  
  THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
  WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
  MERCHANTABLITY OR NON-INFRINGEMENT.
  
  See the Apache Version 2.0 License for specific language governing permissions
  and limitations under the License.
  ***************************************************************************** */
  Renderer.registerPlugin("accessibility", AccessibilityManager);
  Renderer.registerPlugin("extract", Extract);
  Renderer.registerPlugin("interaction", InteractionManager);
  Renderer.registerPlugin("particle", ParticleRenderer);
  Renderer.registerPlugin("prepare", Prepare);
  Renderer.registerPlugin("batch", BatchRenderer);
  Renderer.registerPlugin("tilingSprite", TilingSpriteRenderer);
  Loader2.registerPlugin(BitmapFontLoader);
  Loader2.registerPlugin(SpritesheetLoader);
  Application.registerPlugin(TickerPlugin);
  Application.registerPlugin(AppLoaderPlugin);
  var filters = {
    AlphaFilter,
    BlurFilter,
    BlurFilterPass,
    ColorMatrixFilter,
    DisplacementFilter,
    FXAAFilter,
    NoiseFilter
  };

  // code/game.js
  const yy_fps = __toModule(require_yy_fps());

  // code/view.js
  const size = 50;
  class View {
    init() {
      this.renderer = new Renderer({
        view: document.querySelector(".view"),
        resolution: window.devicePixelRatio,
        transparent: true,
        antialias: true
      });
      this.stage = new Container();
      this.resize();
    }
    get width() {
      return Math.floor(window.innerWidth / this.stage.scale.x);
    }
    get height() {
      return Math.floor(window.innerHeight / this.stage.scale.x);
    }
    get size() {
      return size;
    }
    resize() {
      this.stage.scale.set((window.innerWidth > window.innerHeight ? window.innerWidth : window.innerHeight) / size);
      this.renderer.resize(window.innerWidth, window.innerHeight);
      this.max = Math.max(window.innerWidth, window.innerHeight) / this.stage.scale.x;
    }
    update() {
      this.renderer.render(this.stage);
    }
  }
  const view = new View();

  // code/laser.js
  const yy_random2 = __toModule(require_yy_random());

  // code/moon.js
  const intersects = __toModule(require_intersects());
  const yy_random = __toModule(require_yy_random());
  const radius = 4;
  const colors = 2;
  const shakeTime = 250;
  const shakeDistance = 1;
  const explosionSpeed = [0.1, 0.3];
  class Moon extends Container {
    constructor() {
      super();
      this.moon = this.addChild(new Container());
      this.leaving = this.addChild(new Container());
    }
    closestOnLine(x0, y0, x1, y1) {
      const list = [];
      for (const point of this.moon.children) {
        if (intersects.default.boxLine(point.x, point.y, 1, 1, x0, y0, x1, y1)) {
          list.push(point);
        }
      }
      let distance = Infinity, p;
      for (const point of list) {
        const d = Math.pow(point.x + 0.5 - x0, 2) + Math.pow(point.y + 0.5 - y0, 2);
        if (d < distance) {
          distance = d;
          p = point;
        }
      }
      return p;
    }
    box(x, y, tint, alpha = 1) {
      const point = this.moon.addChild(new Sprite(Texture.WHITE));
      point.tint = tint;
      point.alpha = alpha;
      point.anchor.set(0.5);
      point.width = point.height = 1;
      point.position.set(x, y);
      return point;
    }
    draw() {
      this.moon.removeChildren();
      this.colors = [];
      for (let i = 0; i < colors; i++) {
        this.colors.push(yy_random.default.color());
      }
      const radiusSquared = radius * radius;
      const center = radius;
      this.middle = view.size / 2 - center;
      for (let y = 0; y <= radius * 2; y++) {
        for (let x = 0; x <= radius * 2; x++) {
          const dx = x - center;
          const dy = y - center;
          const distanceSquared = dx * dx + dy * dy;
          if (distanceSquared <= radiusSquared) {
            const box = this.box(x + this.middle, y + this.middle, yy_random.default.pick(this.colors));
            box.coordinate = {x, y};
          }
        }
      }
    }
    detach(block) {
      this.leaving.addChild(block);
      const angle = Math.atan2(block.y - view.size / 2, block.x - view.size / 2) + yy_random.default.middle(0, 0.25, true);
      const speed = yy_random.default.range(...explosionSpeed, true);
      block.velocity = [Math.cos(angle) * speed, Math.sin(angle) * speed];
    }
    findNeighbor(tint) {
      for (const child of this.moon.children) {
        if (child.tint === tint) {
          for (const detach of this.list) {
            if (Math.abs(child.x - detach.x) <= 1 && Math.abs(child.y - detach.y) <= 1) {
              this.list.push(child);
              this.detach(child);
              return true;
            }
          }
        }
      }
    }
    target(block) {
      this.detach(block);
      this.list = [block];
      while (this.findNeighbor(block.tint)) {
      }
      this.shaking = Date.now();
      this.compress();
    }
    hasBlock(x, y) {
      for (const child of this.moon.children) {
        if (child.coordinate.x === x && child.coordinate.y === y) {
          let conflict = false;
          for (const move of this.moving) {
            if (move.x === child.coordinate.x && move.y === child.coordinate.y) {
              conflict = true;
              console.log("conflict!!!");
              break;
            }
          }
          if (!conflict) {
            return true;
          }
        }
      }
    }
    isCenter(block) {
      return Math.abs(block.coordinate.x - radius) < 1 && Math.abs(block.coordinate.y - radius) < 1;
    }
    compress() {
      this.moving = [];
      for (const block of this.moon.children) {
        if (!this.isCenter(block)) {
          const angle = Math.atan2(view.size / 2 - block.y, view.size / 2 - block.x);
          const x = Math.round(block.coordinate.x + Math.cos(angle));
          const y = Math.round(block.coordinate.y + Math.sin(angle));
          if (!this.hasBlock(x, y)) {
            this.moving.push({child: block, x, y});
          }
        }
      }
      for (const move of this.moving) {
        move.child.coordinate.x = move.x;
        move.child.coordinate.y = move.y;
        move.child.x = move.x + this.middle;
        move.child.y = move.y + this.middle;
      }
      if (this.moving.length) {
        this.compress();
      }
    }
    update() {
      for (const child of this.leaving.children) {
        child.position.set(child.x + child.velocity[0], child.y + child.velocity[1]);
        if (child.x - 0.5 > view.width || child.x + 0.5 < 0 || child.y - 0.5 > view.height || child.y + 0.5 < 0) {
          child.visible = false;
        }
      }
      if (this.shaking) {
        if (Date.now() > this.shaking + shakeTime) {
          this.shaking = null;
          this.moon.position.set(0);
        } else {
          this.moon.position.set(yy_random.default.middle(0, shakeDistance, true), yy_random.default.middle(0, shakeDistance, true));
        }
      }
    }
  }
  const moon = new Moon();

  // code/laser.js
  const fireTime = 150;
  const fadeTime = 300;
  class Laser extends Container {
    constructor() {
      super();
      this.state = "";
      this.angleOfLine = Infinity;
    }
    box(x, y, tint, alpha = 1) {
      const point = this.addChild(new Sprite(Texture.WHITE));
      point.tint = tint;
      point.alpha = alpha;
      point.anchor.set(0.5);
      point.width = point.height = 1;
      point.position.set(x, y);
    }
    line(x0, y0, x1, y1, tint, alpha) {
      const points = {};
      points[`${x0}-${y0}`] = true;
      let dx = x1 - x0;
      let dy = y1 - y0;
      let adx = Math.abs(dx);
      let ady = Math.abs(dy);
      let eps = 0;
      let sx = dx > 0 ? 1 : -1;
      let sy = dy > 0 ? 1 : -1;
      if (adx > ady) {
        for (let x = x0, y = y0; sx < 0 ? x >= x1 : x <= x1; x += sx) {
          points[`${x}-${y}`] = true;
          eps += ady;
          if (eps << 1 >= adx) {
            y += sy;
            eps -= adx;
          }
        }
      } else {
        for (let x = x0, y = y0; sy < 0 ? y >= y1 : y <= y1; y += sy) {
          points[`${x}-${y}`] = true;
          eps += adx;
          if (eps << 1 >= ady) {
            x += sx;
            eps -= ady;
          }
        }
      }
      for (const key in points) {
        this.box(...key.split("-"), tint, alpha);
      }
    }
    update() {
      if (this.state === "fire") {
        if (Date.now() >= this.time + fireTime) {
          this.state = "fade";
          this.time = Date.now();
        }
      } else if (this.state === "fade") {
        if (Date.now() >= this.time + fadeTime) {
          this.state = "";
          this.removeChildren();
        }
      }
      if (this.state !== "" && this.angleOfLine !== this.last) {
        this.removeChildren();
        const center = view.size / 2;
        if (this.state === "aim") {
          const p2 = moon.closestOnLine(center + Math.cos(this.angleOfLine) * view.max, center + Math.sin(this.angleOfLine) * view.max, center, center);
          this.target = p2;
          this.aim = [p2.x, p2.y];
        }
        let tint, alpha;
        if (this.state === "aim") {
          tint = 16777215;
          alpha = 0.4;
        } else if (this.state === "fire") {
          tint = 16711680;
          alpha = yy_random2.default.range(0.75, 1, true);
        } else if (this.state === "fade") {
          tint = 16711680;
          alpha = 1 - (Date.now() - this.time) / fadeTime;
        }
        this.line(Math.round(center + Math.cos(this.angleOfLine) * view.max), Math.round(center + Math.sin(this.angleOfLine) * view.max), ...this.aim, tint, alpha);
      }
    }
    down(point) {
      this.state = "aim";
      this.angleOfLine = Math.atan2(point.y - window.innerHeight / 2, point.x - window.innerWidth / 2);
    }
    move(point) {
      if (this.state === "aim") {
        this.angleOfLine = Math.atan2(point.y - window.innerHeight / 2, point.x - window.innerWidth / 2);
      }
    }
    up() {
      if (this.state === "aim") {
        this.state = "fire";
        this.time = Date.now();
        moon.target(this.target);
      }
    }
  }
  const laser = new Laser();

  // code/input.js
  class Input {
    init() {
      const view6 = document.querySelector(".view");
      view6.addEventListener("mousedown", (e) => this.down(e));
      view6.addEventListener("mousemove", (e) => this.move(e));
      view6.addEventListener("mouseup", (e) => this.up(e));
      view6.addEventListener("touchstart", (e) => this.down(e));
      view6.addEventListener("touchmove", (e) => this.move(e));
      view6.addEventListener("touchend", (e) => this.up(e));
      window.addEventListener("keydown", (e) => this.keyDown(e));
      window.addEventListener("keydown", (e) => this.keyUp(e));
    }
    translateEvent(e) {
      let x, y;
      if (typeof e.touches === "undefined") {
        x = e.clientX;
        y = e.clientY;
      } else {
        if (e.touches.length) {
          x = e.touches[0].clientX;
          y = e.touches[0].clientY;
        } else {
          x = e.changedTouches[0].clientX;
          y = e.changedTouches[0].clientY;
        }
      }
      return {x, y};
    }
    down(e) {
      const point = this.translateEvent(e);
      laser.down(point);
    }
    move(e) {
      const point = this.translateEvent(e);
      laser.move(point);
    }
    up(e) {
      const point = this.translateEvent(e);
      laser.up(point);
    }
    keyDown(e) {
      switch (e.code) {
      }
    }
    keyUp(e) {
      switch (e.code) {
      }
    }
  }
  const input = new Input();

  // code/stars.js
  const yy_random3 = __toModule(require_yy_random());
  const count = 20;
  const maxTwinkle = 0.1;
  class Stars extends Container {
    draw() {
      for (let i = 0; i < count; i++) {
        const star = this.addChild(new Sprite(Texture.WHITE));
        const x = yy_random3.default.range(1, view.width) - 0.5;
        const y = yy_random3.default.range(1, view.height) - 0.5;
        star.position.set(x, y);
        star.width = star.height = 1;
        star.alpha = star.alphaSave = yy_random3.default.range(0.2, 0.75, true);
        star.twinkle = yy_random3.default.range(0.01, 0.02);
        star.direction = yy_random3.default.sign();
      }
    }
    update() {
      for (const star of this.children) {
        if (star.direction === 1) {
          star.alpha += star.twinkle;
          if (star.alpha >= star.alphaSave + maxTwinkle) {
            star.direction = -1;
            star.alpha = star.alphaSave + maxTwinkle;
          }
        } else {
          star.alpha -= star.twinkle;
          if (star.alpha <= star.alphaSave - maxTwinkle) {
            star.direction = 1;
            star.alpha = star.alphaSave - maxTwinkle;
          }
        }
      }
    }
  }
  const stars = new Stars();

  // code/levels.js
  const levels = [
    {count: 10, colors: 2, radius: 4}
  ];

  // code/game.js
  class Game {
    start() {
      this.fps = new yy_fps.default();
      view.init();
      this.prepareLevels();
      this.create();
      this.update();
      input.init();
    }
    prepareLevels() {
      this.levels = [];
      for (const level of levels) {
        for (let i = 0; i < level.count; i++) {
          this.levels.push({seed: i, colors: level.colors, radius: level.radius});
        }
      }
    }
    create() {
      moon.draw();
      stars.draw();
      this.level = new Container();
      this.level.addChild(stars);
      this.level.addChild(moon);
      this.level.addChild(laser);
      view.stage.addChild(this.level);
    }
    update() {
      stars.update();
      moon.update();
      laser.update();
      view.update();
      this.fps.frame();
      requestAnimationFrame(() => this.update());
    }
  }
  const game = new Game();

  // code/default.js
  window.addEventListener("DOMContentLoaded", () => game.start());
})();
//# sourceMappingURL=index.js.map
