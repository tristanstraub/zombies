/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/
(function() {
  QUnit.config.testTimeout = 500;

  require.config({
    shim: {
      'ember': {
        deps: ['jquery','handlebars'],
        exports: 'Ember'
      },

      'handlebars': {
        deps: ['jquery'],
        exports: 'Handlebars'
      },

      'easeljs': {
        exports: 'createjs'
      },

      'tweenjs': {
        exports: 'createjs'
      },

      'livingdead/tweenjs-ember-plugin': {
        deps: ['tweenjs'],
        exports: 'createjs.TweenEmberPlugin'
      }
    },

    paths: {
      hm: 'vendor/hm',
      esprima: 'vendor/esprima',
      jquery: 'vendor/jquery.min',
      easeljs: 'vendor/easeljs-0.5.0.min',
      tweenjs: 'vendor/tweenjs-0.3.0.min',
      handlebars: 'vendor/handlebars-1.0.rc.1',
      ember: 'vendor/ember',
      'underscore':'vendor/underscore-min'
    },

    baseUrl: '../app/scripts'
  });

  require(['ember'], function(Ember) {
    /*
     ======== A Handy Little QUnit Reference ========
     http://docs.jquery.com/QUnit

     Test methods:
     expect(numAssertions)
     stop(increment)
     start(decrement)
     Test assertions:
     ok(value, [message])
     equal(actual, expected, [message])
     notEqual(actual, expected, [message])
     deepEqual(actual, expected, [message])
     notDeepEqual(actual, expected, [message])
     strictEqual(actual, expected, [message])
     notStrictEqual(actual, expected, [message])
     raises(block, [expected], [message])
     */
    var globalSetup = function() {
      QUnit.config.notrycatch = true;
      
      stop();
      var self = this;
      require(['livingdead/livingdead', 'reanimator/mouse-state-manager/mouse-state-manager'], function(LivingDead, MouseStateManager) {
        self.LivingDead = LivingDead;
        self.MouseStateManager = MouseStateManager;
        start();
      });      
    };

    module('livingdead', {
      setup: function() {
        globalSetup.apply(this);
      }
    });

    var log = function() { console.log.apply(console, arguments); };
    var get = Ember.get, set = Ember.set;

    test('create coreshape', 0, function() {
      var shape = this.LivingDead.CoreShape.create();
    });

    test('create shape and set coords', 1, function() {
      var shape = this.LivingDead.Shape.create();
      var x = 10;
      set(shape, 'x', x);
      equal(get(shape, 'shape.x'), x, "x set on createjs shape");
    });

    test('highlight on hover', 0, function() {
      var manager = this.MouseStateManager.create({
        enableLogging: true,
        shapes: []
      });
      var event = { 
        pageX: 150, 
        pageY: 150, 
        context: {
          tool: 'pencil',
          $: function() {
            return {
              offset: function() {
                return { top: 100, left: 100 };
              }            
            };
          },
          addShapeToStage: Ember.K
        } 
      };
      manager.send('mouseDown', event);

      event.pageX = 200;
      event.pageY = 200;

      manager.send('mouseMove', event);
      manager.send('mouseUp', event);

    });
  });
}());


