define(['ember', 'livingdead/object', 'livingdead/coreshape'], function(Ember, LivingDeadObject, CoreShape) {
  var set = Ember.set, get = Ember.get;

  var shapePropertyAdderSetter = function(name) {
    return Ember.computed(function(key, value, oldvalue) {
      if (arguments.length > 1) {
        var parentValue = get(this, name) || 0;

        var shape = get(this, 'shape');
        shape[key] = value + parentValue;
      }

      return value;
    }).property(name);
  };

  var shapePropertyMultSetter = function(name) {
    return Ember.computed(function(key, value, oldvalue) {
      if (arguments.length > 1) {
        var parentValue = get(this, name) || 1;

        var shape = get(this, 'shape');
        shape[key] = value * parentValue;
      }

      return value;
    }).property(name);
  };

  return CoreShape.extend({
    id: function() { return Ember.guidFor(this); }.property(),
    parent: null,

    shape: function() {
      return new createjs.Shape();
    }.property(),

    x: shapePropertyAdderSetter('parent.x'),
    y: shapePropertyAdderSetter('parent.y'),
    scaleX: shapePropertyMultSetter('parent.scaleX'),
    scaleY: shapePropertyMultSetter('parent.scaleY'),

    init: function() {
      this._super.apply(this, arguments);
    },

    createdelegate: function(deep) {
      return Ember.copy(this, deep);
    },

    copy: function(deep) {
      var properties = this.copyProperties();
      console.log(properties);
      return this.constructor.create(properties);
    },

    removeFromStage: function(bridge) {
      bridge = bridge || get(this, 'bridge');
      set(this, 'bridge', bridge);

      if (bridge) {
        bridge.removeShapeFromStage(this);
      }
    },

    addToStage: function(bridge) {
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

