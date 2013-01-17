define(['zombie/coreshape'], function(CoreShape) {
    var set = Ember.set, get = Ember.get;

    return CoreShape.extend({
        shapes: null,

        draw: function(bridge) {
            (get(this, 'shapes') || []).forEach(function(shape) {
                shape.draw(bridge);
            });
        },

        shapesChanged: function() {
            this.draw(get(this, 'bridge'));
        }.observes('shapes.@each'),

        getContainedPoints: function(x,y,w,h) {
            return (get(this, 'shapes') || []).map(function(shape) {
                return shape.getContainedPoints(x,y,w,h);
            }).reduce(function(a, b) {
                a.pushObjects(b);
                return a;
            }, []);
        },

        copy: function(deep) {
            return this.constructor.create({
                shapes: (get(this, 'shapes') || []).map(function(shape) {
                    return shape.copy(deep);
                })
            });
        },

        addToStage: function(bridge) {
            bridge = bridge || get(this, 'bridge');
            set(this, 'bridge', bridge);

            this.draw(bridge);
            (get(this, 'shapes') || []).forEach(function(shape) {
                bridge.addShapeToStage(shape);
            });
        },

        removeFromStage: function(bridge) {
            bridge = bridge || get(this, 'bridge');
            set(this, 'bridge', bridge);

            (get(this, 'shapes') || []).forEach(function(shape) {
                bridge.removeShapeFromStage(shape);
            });
        },

        clear: function(bridge) {
            (get(this, 'shapes') || []).forEach(function(shape) {
                (bridge || get(this, 'bridge')).clearShape(shape);
            });
        },

    });
});

