define(['ember', 'livingdead/object', 'livingdead/coreshape', 'livingdead/easel-bridge'], function(Ember, LivingDeadObject, CoreShape, EaselBridge) {
  var set = Ember.set, get = Ember.get;

  return CoreShape.extend({
    id: function() { return Ember.guidFor(this); }.property(),
    parent: null,

    shape: function() {
      var shape = new createjs.Shape();

      return shape;
    }.property(),

    createdelegate: function(deep) {
      return Ember.copy(this, deep);
    },

    copy: function(deep) {
      var properties = this.copyProperties();

      return new this.constructor(properties);
    },

    removeFromStage: function(bridge) {
      bridge = bridge || get(this, 'bridge');
      set(this, 'bridge', bridge);

      if (bridge) {
        bridge.removeShapeFromStage(this);
      }
    },

    addToStage: function(bridge) {
      Ember.assert("is bridge", !bridge || EaselBridge.detectInstance(bridge));

      bridge = bridge || get(this, 'bridge');
 
      set(this, 'bridge', bridge);

      this.draw(bridge);
      bridge.addShapeToStage(this);
    },

    clear: function(bridge) {
      bridge = (bridge || get(this, 'bridge'));
      if (bridge) {
        bridge.clearShape(this);
      }
    },

    boxContainsPoint: function(x, y, w, h, x0, y0)  {
      return (x <= x0 && x0 <= x + w && y <= y0 && y0 <= y + h);
    }
  });
});

