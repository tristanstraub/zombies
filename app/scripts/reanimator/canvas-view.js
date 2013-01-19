define(['ember', 'livingdead/livingdead'], function(Ember, LivingDead) {
    var set = Ember.set, get = Ember.get;

    var mouseMethod = function(name) {
        return function(event) {
            var manager = get(this, 'mouseStateManager');
            event.context = this;
//            event.targetObject = get(this, 'controller.target');

            if (manager) {
                manager.send(name, event);
                manager.send(name + '_after', event);
            }
        };
    };

    return Ember.View.extend({
        attributeBindings: ['width','height','style'],
        tagName: 'canvas',

        tool: 'brush',

        classNames: ['canvas'],

        toolChanged: function() {
            this.$().removeClass('edit');
            this.$().removeClass('select');
            this.$().removeClass('pencil');

            this.$().addClass(get(this, 'tool'));
        }.observes('tool'),

        canvas: function() {
            return this.$();
        }.property(),

        style: function() {
            return "border: 1px dotted black; width: %@px; height: %@px;".fmt(get(this, 'canvasWidth'), get(this, 'canvasHeight'));
        }.property(),

        bridge: null,

        shapes: Ember.computed(function(key, value, oldvalue) {
          if (oldvalue) {
            oldvalue.removeEnumerableObserver(this);
          }
          
          if (value) {
            value.addEnumerableObserver(this);
          }

          return value || [];
        }),

        enumerableWillChange: function(content, removed, added) {
          if (removed) {
            var bridge = get(this, 'bridge');
            removed.forEach(function(shape) {
              shape.removeFromStage(bridge);
            });
          }
        },
        
        enumerableDidChange: function(content, removed, added) {
          if (added) {
            var bridge = get(this, 'bridge');

            added.forEach(function(shape) {
              shape.addToStage(bridge);
            });
          }
        },

        canvasWidth: null,
        canvasHeight: null,

        width: function() {
            //        return '%@px'.fmt(get(this, 'canvasWidth')*2);
            return get(this, 'canvasWidth');
        }.property(),

        height: function() {
            //        return '%@px'.fmt(get(this, 'canvasHeight')*2);
            return get(this, 'canvasHeight');
        }.property(),

        init: function() {
            this._super.apply(this, arguments);

            if (!get(this, 'shapes')) {
                set(this, 'shapes', []);
            }
        },
        
        mouseDown: mouseMethod('mouseDown'),
        mouseUp: mouseMethod('mouseUp'),
        mouseMove: mouseMethod('mouseMove'),
        mouseEnter: mouseMethod('mouseEnter'),
        mouseLeave: mouseMethod('mouseLeave'),

        didInsertElement: function() {
            var canvas = get(this, 'canvas');

            var bridge = LivingDead.EaselBridge.create({
                stage: new createjs.Stage(canvas.get(0))
            });

            var factory = LivingDead.Factory.create({
                bridge: bridge
            });

            set(this, 'bridge', bridge);

            get(this, 'shapes').forEach(function(shape) {
                shape.addToStage(bridge);
            });

            factory.createGameLoop().start();
        }
    });
});
