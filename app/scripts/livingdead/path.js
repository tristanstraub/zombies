define(['livingdead/shape'], function(LivingDeadShape) {
    var set = Ember.set, get = Ember.get;

    return LivingDeadShape.extend({
        path: '',

        getContainedPoints: function(x,y,w,h) {
            var self = this;
            var points = [];

            var lastpoint = null;
            var traverseSegment = function(index, name, dx, dy) {
                dx/=10;
                dy/=10;

                var point = null;

                if (name === 'M') {
                    point = [dx, dy];
                } else if (name === 'L') {
                    point = [lastpoint[0] + dx, lastpoint[1] + dy];
                }

                if (this.boxContainsPoint(x,y,w,h, point[0] + get(self, 'x'), point[1] + get(self, 'y'))) {
                    points.push({ point: point, index: index });
                }
                lastpoint = point;
            };
            this.traversePath(traverseSegment);
            return points;
        },

        draw: function(bridge) {
            if (get(this, 'path')) {
                this.clear(bridge);
                (bridge || get(this, 'bridge')).shapeDecodePath(this);
            }
        },

        traversePath: function(listener) {
            get(this, 'bridge').shapeEncodePath(this, listener);
        },

        pathChanged: function() {
            this.draw(get(this, 'bridge'));
        }.observes('path')
    });
});
