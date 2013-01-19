define(['ember', 'livingdead/shape', 'livingdead/properties', 'livingdead/easel-bridge'], function(Ember, LivingDeadShape, LivingDeadProperties, EaselBridge) {
  var set = Ember.set, get = Ember.get;

  return LivingDeadShape.extend({
    getPropertyNames: LivingDeadProperties.propertyNames('radius'),

    radius: 0,

    draw: function(bridge) {
      Ember.assert("is bridge", !bridge || EaselBridge.detectInstance(bridge));

      bridge = bridge || get(this, 'bridge');

      if (bridge) {
        this.clear(bridge);
        bridge.shapeDrawCircle(this);
      }
    }
  });
});
