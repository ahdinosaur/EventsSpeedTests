var suite = require('chuhai');
var test = require('blue-tape');

test('emit', function (t) {
  return suite('emit', function (s) {
    s.set('maxTime', 0.01);
    s.set('minSamples', 10);

    var subjects = require('../subjects').createInstancesOn(handle, handle2);

    var called = 0;

    s.cycle(function (e) {
      t.false(e.target.error, 'runs without error');
      t.equal(called, 4, 'called four times');
    });

    s.burn('Theoretical max', function () {
      called = 0;
      handle();
      handle2();
      handle('bar');
      handle2('bar');
      handle('bar', 'baz');
      handle2('bar', 'baz');
      handle('bar', 'baz', 'boom');
      handle2('bar', 'baz', 'boom');
    });

    s.bench('EventEmitter', function () {
      called = 0;
      subjects.ee1.emit('foo');
      subjects.ee1.emit('foo', 'bar');
      subjects.ee1.emit('foo', 'bar', 'baz');
      subjects.ee1.emit('foo', 'bar', 'baz', 'boom');
    });

    s.bench('EventEmitter2', function () {
      called = 0;
      subjects.ee2.emit('foo');
      subjects.ee2.emit('foo', 'bar');
      subjects.ee2.emit('foo', 'bar', 'baz');
      subjects.ee2.emit('foo', 'bar', 'baz', 'boom');
    });

    s.bench('EventEmitter3', function () {
      called = 0;
      subjects.ee3.emit('foo');
      subjects.ee3.emit('foo', 'bar');
      subjects.ee3.emit('foo', 'bar', 'baz');
      subjects.ee3.emit('foo', 'bar', 'baz', 'boom');
    });

    s.xbench('dripEmitter', function () {  // see https://github.com/qualiancy/drip/pull/4
      called = 0;
      subjects.dripEmitter.emit('foo');
      subjects.dripEmitter.emit('foo', 'bar');
      subjects.dripEmitter.emit('foo', 'bar', 'baz');
      subjects.dripEmitter.emit('foo', 'bar', 'baz', 'boom');
    });

    s.bench('dripEmitterEnhanced', function () {
      called = 0;
      subjects.dripEmitterEnhanced.emit('foo');
      subjects.dripEmitterEnhanced.emit('foo', 'bar');
      subjects.dripEmitterEnhanced.emit('foo', 'bar', 'baz');
      subjects.dripEmitterEnhanced.emit('foo', 'bar', 'baz', 'boom');
    });

    s.bench('JS-Signals', function () {
      called = 0;
      subjects.signal.dispatch();
      subjects.signal.dispatch('bar');
      subjects.signal.dispatch('bar', 'baz');
      subjects.signal.dispatch('bar', 'baz', 'boom');
    });

    s.bench('MiniSignals', function () {
      called = 0;
      subjects.miniSignal.dispatch();
      subjects.miniSignal.dispatch('bar');
      subjects.miniSignal.dispatch('bar', 'baz');
      subjects.miniSignal.dispatch('bar', 'baz', 'boom');
    });

    s.bench('signal-emitter', function () {
      called = 0;
      subjects.signalEmitter.emit();
      subjects.signalEmitter.emit('bar');
      subjects.signalEmitter.emit('bar', 'baz');
      subjects.signalEmitter.emit('bar', 'baz', 'boom');
    });

    s.bench('signal-lite', function () {
      called = 0;
      subjects.signalLite.broadcast();
      subjects.signalLite.broadcast('bar');
      subjects.signalLite.broadcast('bar', 'baz');
      subjects.signalLite.broadcast('bar', 'baz', 'boom');
    });

    function handle(a, b) {
      if (arguments.length === 1 && a === undefined) {
        return;
      }
      if (arguments.length > 0 && a !== 'bar') {
        throw new Error('invalid arguments');
      }
      if (arguments.length > 1 && b !== 'baz') {
        throw new Error('invalid arguments');
      }
      if (arguments.length > 100) {
        throw new Error('invalid arguments');
      }
      called++;
    }

    function handle2() {
      if (arguments.length > 100) {
        throw new Error('invalid arguments');
      }
    }
  });
});
