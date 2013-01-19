define(['livingdead/shape', 'livingdead/properties'], function(LivingDeadShape, LivingDeadProperties) {
  var set = Ember.set, get = Ember.get;

  return LivingDeadShape.extend({
    getPropertyNames: LivingDeadProperties.propertyNames('edge'),

    edge: null,

    draw: function(bridge) {
      bridge = bridge || get(this, 'bridge');
      if (get(this, 'edge') && bridge) {
        this.clear(bridge);
        bridge.shapeDrawLine(this);
      }
    },

    getPropertyObserverNames: LivingDeadProperties.propertyObserverNames('edge.@each'),

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
