define(['livingdead/shape', 'livingdead/properties'], function(LivingDeadShape, LivingDeadProperties) {
  var set = Ember.set, get = Ember.get;

  return LivingDeadShape.extend({
    getPropertyNames: LivingDeadProperties.propertyNames('edge'),
    getPropertyObserverNames: LivingDeadProperties.propertyObserverNames('edge.@each'),

    edge: null,

    draw: function(bridge) {
      bridge = bridge || get(this, 'bridge');
      if (get(this, 'edge') && bridge) {
        this.clear(bridge);
        bridge.shapeDrawLine(this);
      }
    },

    getContainedPoints: function(x,y,w,h) {
      var cx = get(this, 'realX');
      var cy = get(this, 'realY');

      return get(this, 'edge').map(function(point) {
        return [point.objectAt(0)+cx, point.objectAt(1)+cy];
      }).filter(function(point) {
        return this.boxContainsPoint(x,y,w,h, point.objectAt(0), point.objectAt(1));
      }, this);
    }
  });
});
