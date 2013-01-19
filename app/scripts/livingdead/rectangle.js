define(['livingdead/shape', 'livingdead/properties'], function(LivingDeadShape, LivingDeadProperties) {
  var set = Ember.set, get = Ember.get;

  return LivingDeadShape.extend({
    getPropertyNames: LivingDeadProperties.propertyNames('width', 'height'),
    getPropertyObserverNames: LivingDeadProperties.propertyObserverNames('x','y','width','height'),

    width: 0,
    height: 0,

    draw: function(bridge) {
      bridge = bridge || get(this, 'bridge');
      if (bridge) {
        this.clear(bridge);
        bridge.shapeDrawRectangle(this);
      }
    },

    getContainedPoints: function(x,y,w,h) {
      var cx = get(this, 'x');
      var cy = get(this, 'y');
      var width = get(this, 'width');
      var height = get(this, 'height');

      var points = [[cx,cy],[cx+width, cy],[cx+width,cy+height],[cx,cy+height]];

      return points.filter(function(point) {
        return this.boxContainsPoint(x,y,w,h, point.objectAt(0), point.objectAt(1));
      }, this);
    }
  });
});


