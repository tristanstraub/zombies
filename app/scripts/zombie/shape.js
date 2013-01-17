define(['ember', 'zombie/object', 'zombie/coreshape'], function(Ember, ZombieObject, CoreShape) {
    var set = Ember.set, get = Ember.get;

    var shapePropertySetter = Ember.computed(function(key, value, oldvalue) {
        if (arguments.length > 1) {
            var shape = get(this, 'shape');
            shape[key] = value;
        }

        return value;
    });

    return CoreShape.extend({
        id: function() { return Ember.guidFor(this); }.property(),
        properties: null,

        shape: function() {
            return new createjs.Shape();
        }.property(),

        x: shapePropertySetter,
        y: shapePropertySetter,
        scaleX: shapePropertySetter,
        scaleY: shapePropertySetter,

        xBinding: 'properties.shape.x',
        yBinding: 'properties.shape.y',

        draw: Ember.K,

        createDelegate: function(deep) {
            return Ember.copy(this, deep);
        },

        copy: function(deep) {
            if (deep) {
                properties = get(this, 'properties').copy(deep);
            } else {
                properties = get(this, 'properties');
            }

            return this.constructor.create({
                properties: properties
            });
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
