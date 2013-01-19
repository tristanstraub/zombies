define(['ember', 'livingdead/easel-bridge'], function(Ember, EaselBridge) {
  var set = Ember.set, get = Ember.get;

  return Ember.Mixin.create({
    bridge: null,

    didBridgeChange: function() {
      var bridge = get(this, 'bridge');
      Ember.assert("is bridge", !bridge || EaselBridge.detectInstance(bridge));      
    }.observes('bridge')
  });
});

