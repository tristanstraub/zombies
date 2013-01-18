define(['ember', 'zombie/zombie'], function(Ember, Zombie) {
    var set = Ember.set;
    var get = Ember.get;

    var Z = Zombie.Z;
    var P = Zombie.P;

    return Ember.Object.extend({
        highlightedPoints: [],
        
        previousHighlightedPoints: [],

        highlightPoints: function(canvasView, points) {
            var ps = get(this, 'previousHighlightedPoints');
            ps.forEach(function(shape) {
                canvasView.removeShape(shape);
            });

            pointShapes = points.map(function(point) {
                var shape = Zombie.Circle.create({
                    x: point[0], 
                    y: point[1],
                    radius: 2
                });

                canvasView.addShapeToStage(shape);
                return shape;
            });

            set(this, 'previousHighlightedPoints', pointShapes);
        }
    });
});
