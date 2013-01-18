define(['livingdead/shape', 'livingdead/properties'], function(LivingDeadShape, LivingDeadProperties) {
  var set = Ember.set, get = Ember.get;

  return LivingDeadShape.extend({
    copyProperties: LivingDeadProperties.copyProperties('width', 'height'),

    width: 0,
    height: 0,

    draw: function(bridge) {
      bridge = bridge || get(this, 'bridge');
      if (bridge) {
        this.clear(bridge);
        bridge.shapeDrawRectangle(this);
      }
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
      }, this);
    }
  });
});


