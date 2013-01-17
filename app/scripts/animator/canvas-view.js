define(['ember','zombie', 'animator/animator'], function(ember, zombie, Animator) {
    var set = Ember.set;
    var get = Ember.get;

    var mouseMethod = function(name) {
        return function(event) {
            var manager = get(this, 'mouseStateManager');
            event.context = this;
            event.targetObject = get(this, 'controller.target');

            if (manager) {
                manager.send(name, event);
                manager.send(name + '_after', event);
            }
        };
    };

    Animator.CanvasView = Ember.View.extend({
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

        shapes: null,

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
        
        shapesAtPoint: function(x, y) {
            return get(this, 'shapes').map(function(shape) {
                var w=20;
                var h=20;
                var pointsAndIndexes = shape.getContainedPoints(x-w/2,y-h/2,w,h);
                var points = pointsAndIndexes.mapProperty('point');
                return pointsAndIndexes.length > 0 ? { shape: shape, points: points, pointsAndIndexes: pointsAndIndexes } : null;
            }).filter(function(a) { return a; });
        },

        getContainedShapesPoints: function(x, y, w, h) {
            return get(this, 'shapes').map(function(shape) {
                var pointsAndIndexes = shape.getContainedPoints(x,y,w,h);
                var points = pointsAndIndexes.mapProperty('point');
                return pointsAndIndexes.length > 0 ? { shape: shape, points: points, pointsAndIndexes: pointsAndIndexes } : null;
            }).filter(function(a) { return a; });
        },

        mouseDown: mouseMethod('mouseDown'),
        mouseUp: mouseMethod('mouseUp'),
        mouseMove: mouseMethod('mouseMove'),
        mouseEnter: mouseMethod('mouseEnter'),
        mouseLeave: mouseMethod('mouseLeave'),

        didInsertElement: function() {
            var canvas = get(this, 'canvas');

            var bridge = Zombie.EaselBridge.create({
                stage: new createjs.Stage(canvas.get(0))
            });

            var factory = Zombie.Factory.create({
                bridge: bridge
            });

            set(this, 'bridge', bridge);

            get(this, 'shapes').forEach(function(shape) {
                shape.addToStage(bridge);
            });

            factory.createGameLoop().start();
        },

        addShape: function(shape) {
            get(this, 'shapes').addObject(shape);
            shape.addToStage(get(this, 'bridge'));
        },

        addShapeToStage: function(shape) {
            shape.addToStage(get(this, 'bridge'));
        },

        removeShape: function(shape) {
            get(this, 'shapes').removeObject(shape);
            shape.removeFromStage(get(this, 'bridge'));
        }
    });

    return Animator.CanvasView;
});
