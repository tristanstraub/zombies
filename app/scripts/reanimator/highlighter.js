define(['ember', 'livingdead/livingdead'], function(Ember, LivingDead) {
  var set = Ember.set;
  var get = Ember.get;

  var Z = LivingDead.Z;
  var P = LivingDead.P;

  return LivingDead.Object.extend({
    highlightedPoints: [],

    init: function() {
      this._super.apply(this, arguments);
      set(this, 'highlightedPoints', []);
    },
    
    highlightPoints: function(manager, points) {
      pointShapes = points.map(function(point) {
        var shape = new LivingDead.Circle({
          x: point[0], 
          y: point[1],
          radius: 2
        });

        return shape;
      });

      get(this, 'highlightedPoints').clear();
      get(this, 'highlightedPoints').addObjects(pointShapes);
    }
  });
});
