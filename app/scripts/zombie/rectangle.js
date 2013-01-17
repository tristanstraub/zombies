define(['zombie/shape'], function(ZombieShape) {
    var set = Ember.set, get = Ember.get;

    return ZombieShape.extend({
        width: 'properties.rectangle.width',
        height: 'properties.rectangle.height',

        draw: function(bridge) {
            bridge = bridge || get(this, 'bridge');
            this.clear(bridge);
            bridge.shapeDrawRectangle(this);
        },

        propertiesChanged: function() {
            this.draw(get(this, 'bridge'));
        }.observes('width', 'height'),

        getContainedPoints: function(x,y,w,h) {
            var cx = get(this, 'x');
            var cy = get(this, 'y');
            var width = get(this, 'width');
            var height = get(this, 'height');

            var points = [[0,0],[width, 0],[width,height],[0,height]];

            return points.filter(function(point) {
                return this.boxContainsPoint(x,y,w,h, cx + point.objectAt(0), cy + point.objectAt(1));
            }, this).map(function(point, index) {
                return { point: point, index: index };
            });
        }
    });
});


