var suite = require('chuhai');
var test = require('blue-tape');
var setup = require('../subjects');

test('emit with context', function (t) {
  return suite('emit with context', function (s) {
    s.set('maxTime', setup.maxTime);
    s.set('minSamples', setup.minSamples);

    var called = null;
    var called2 = null;

    s.cycle(function (e) {
      t.false(e.target.error, e.target.name + ' runs without error');
      t.equal(called, 1, 'handle called one time');
      t.equal(called2, 1, 'handle2 called one time');
      called = called2 = null;
    });

    var ctx = {
      foo: 'bar'
    };

    var subjects = setup.createInstances();

    subjects.ee1.on('foo', handle.bind(ctx));
    subjects.ee1.on('foo', handle2);
    subjects.ee2.on('foo', handle.bind(ctx));
    subjects.ee2.on('foo', handle2);
    subjects.ee3.on('foo', handle, ctx);
    subjects.ee3.on('foo', handle2);
    subjects.dripEmitter.on('foo', handle.bind(ctx));
    subjects.dripEmitter.on('foo', handle2);
    subjects.dripEmitterEnhanced.on('foo', handle.bind(ctx));
    subjects.dripEmitterEnhanced.on('foo', handle2);
    subjects.signal.add(handle, ctx);
    subjects.signal.add(handle2);
    subjects.miniSignal.add(handle, ctx);
    subjects.miniSignal.add(handle2);
    subjects.signalEmitter.on(handle, ctx);
    subjects.signalEmitter.on(handle2);
    subjects.eventSignal.addListener(handle, ctx);
    subjects.eventSignal.addListener(handle2);
    subjects.signalLite.add(handle, ctx);
    subjects.signalLite.add(handle2);
    subjects.subject.subscribe(handle.bind(ctx));
    subjects.subject.subscribe(handle2);
    subjects.rProperty.on(handle.bind(ctx));
    subjects.rProperty.on(handle2);

    var bHandel = handle.bind(ctx);

    s.burn('Theoretical max', function () {
      called = called2 = 0;
      bHandel('bar');
      handle2('bar');
    });

    s.bench('EventEmitter', function () {
      called = called2 = 0;
      subjects.ee1.emit('foo', 'bar');
    });

    s.bench('EventEmitter2', function () {
      called = called2 = 0;
      subjects.ee2.emit('foo', 'bar');
    });

    s.bench('EventEmitter3', function () {
      called = called2 = 0;
      subjects.ee3.emit('foo', 'bar');
    });

    s.bench('dripEmitter', function () {
      called = called2 = 0;
      subjects.dripEmitter.emit('foo', 'bar');
    });

    s.bench('dripEmitterEnhanced', function () {
      called = called2 = 0;
      subjects.dripEmitterEnhanced.emit('foo', 'bar');
    });

    s.bench('RXJS', function () {
      called = called2 = 0;
      subjects.subject.next('bar');
    });

    s.bench('ReactiveProperty', function () {
      called = called2 = 0;
      subjects.rProperty('bar');
    });

    s.bench('JS-Signals', function () {
      called = called2 = 0;
      subjects.signal.dispatch('bar');
    });

    s.bench('MiniSignals', function () {
      called = called2 = 0;
      subjects.miniSignal.dispatch('bar');
    });

    s.bench('signal-emitter', function () {
      called = called2 = 0;
      subjects.signalEmitter.emit('bar');
    });

    s.bench('event-signal', function () {
      called = called2 = 0;
      subjects.eventSignal.emit('bar');
    });

    s.bench('signal-lite', function () {
      called = called2 = 0;
      subjects.signalLite.broadcast('bar');
    });

    function handle() {
      if (arguments.length === 0 || arguments.length > 2) {
        throw new Error('invalid arguments length');
      }
      if (this !== ctx) {
        throw new Error('invalid context');
      }
      called++;
    }

    function handle2() {
      if (arguments.length === 0 || arguments.length > 2) {
        throw new Error('invalid arguments length');
      }
      called2++;
    }
  });
});
