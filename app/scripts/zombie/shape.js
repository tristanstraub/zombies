define(['ember', 'zombie/object', 'zombie/coreshape'], function(Ember, ZombieObject, CoreShape) {
    var set = Ember.set, get = Ember.get;

    var shapePropertyAdderSetter = function(name) {
        return Ember.computed(function(key, value, oldvalue) {
            if (arguments.length > 1) {
                var parentValue = get(this, name) || 0;

                var shape = get(this, 'shape');
                shape[key] = value + parentValue;
            }

            return value;
        }).property();
    };

    var shapePropertyMultSetter = function(name) {
        return Ember.computed(function(key, value, oldvalue) {
            if (arguments.length > 1) {
                var parentValue = get(this, name) || 1;

                var shape = get(this, 'shape');
                shape[key] = value * parentValue;
            }

            return value;
        }).property(name);
    };

    return CoreShape.extend({
        id: function() { return Ember.guidFor(this); }.property(),
        parent: null,

        didParentChange: function() {
            console.log(get(this, 'parent.x'), get(this, 'parent.y'));
        }.observes('parent.x','parent.y'),

        shape: function() {
            return new createjs.Shape();
        }.property(),

        x: shapePropertyAdderSetter('parent.x'),
        y: shapePropertyAdderSetter('parent.y'),
        scaleX: shapePropertyMultSetter('parent.scaleX'),
        scaleY: shapePropertyMultSetter('parent.scaleY'),

        init: function() {
            set(this, 'x', (get(this, 'x') || 0));
            set(this, 'y', (get(this, 'y') || 0));
            set(this, 'scaleX', (get(this, 'scaleX') || 1));
            set(this, 'scaleY', (get(this, 'scaleY') || 1));
        },

        createdelegate: function(deep) {
            return Ember.copy(this, deep);
        },

        copy: function(deep) {
            return this.constructor.create(this.copyProperties(deep));
        },

        removeFromStage: function(bridge) {
            bridge = bridge || get(this, 'bridge');
            set(this, 'bridge', bridge);

            bridge.removeShapeFromStage(this);
        },

        addToStage: function(bridge) {
            bridge = bridge || get(this, 'bridge');
            set(this, 'bridge', bridge);

            this.draw(bridge);
            bridge.addShapeToStage(this);
        },

        clear: function(bridge) {
            (bridge || get(this, 'bridge')).clearShape(this);
        },

        boxContainsPoint: function(x, y, w, h, x0, y0)  {
            return (x <= x0 && x0 <= x + w && y <= y0 && y0 <= y + h);
        }
    });
});
