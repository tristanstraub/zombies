define(['zombie/shape'], function(ZombieShape) {
    var set = Ember.set, get = Ember.get;

    return ZombieShape.extend({
        edge: null,

        draw: function(bridge) {
            bridge = bridge || get(this, 'bridge');
            if (get(this, 'edge')) {
                this.clear(bridge);
                bridge.shapeDrawLine(this);
            }
        },

        edgeChanged: function() {
            this.draw(get(this, 'bridge'));
        }.observes('edge.@each'),

        getContainedPoints: function(x,y,w,h) {
            var cx = get(this, 'x') + (get(this, 'parent.x')||0);
            var cy = get(this, 'y') + (get(this, 'parent.y')||0);

            return get(this, 'edge').map(function(point) {
                return [point.objectAt(0)+cx, point.objectAt(1)+cy];
            }).filter(function(point) {
                return this.boxContainsPoint(x,y,w,h, point.objectAt(0), point.objectAt(1));
            }, this);
        }
    });
});
