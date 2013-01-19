define(['livingdead/coreshape'], function(CoreShape) {
  var set = Ember.set, get = Ember.get;

  return CoreShape.extend({
    shapes: null,

    draw: function(bridge) {
      (get(this, 'shapes') || []).forEach(function(shape) {
        shape.draw(bridge);
      });
    },

    init: function() {
      this._super.apply(this, arguments);

      this.updateParents();
    },

    updateParents: function() {
      console.log('children', (get(this, 'shapes')||[]).length);
      (get(this, 'shapes') || []).forEach(function(shape) {
        set(shape, 'parent', this);
      }, this);
    },

    shapesChanged: function() {
      this.updateParents();
      this.draw(get(this, 'bridge'));
    }.observes('shapes', 'shapes.@each'),

    getContainedPoints: function(x,y,w,h) {
      var points = (get(this, 'shapes') || []).map(function(shape) {
        var spoints = shape.getContainedPoints(x,y,w,h);
        return spoints;
      }).reduce(function(a, b) {
        a.pushObjects(b);
        return a;
      }, []);
      return points;
    },

    createMirror: function() {
      var mirror = this._super.apply(this, arguments);
        var shapesMirrors = (get(this, 'shapes') || []).map(function(shape) {
          return shape.createMirror();
        });

      set(mirror, 'shapes', shapesMirrors);
      return mirror;
    },

    copy: function(deep) {
      return new this.constructor({
        shapes: (get(this, 'shapes') || []).map(function(shape) {
          return shape.copy(deep);
        })
      });
    },

    addToStage: function(bridge) {
      bridge = bridge || get(this, 'bridge');
      set(this, 'bridge', bridge);

      this.draw(bridge);
      (get(this, 'shapes') || []).forEach(function(shape) {
        bridge.addShapeToStage(shape);
      });
    },

    removeFromStage: function(bridge) {
      bridge = bridge || get(this, 'bridge');
      set(this, 'bridge', bridge);

      (get(this, 'shapes') || []).forEach(function(shape) {
        bridge.removeShapeFromStage(shape);
      });
    },

    clear: function(bridge) {
      (get(this, 'shapes') || []).forEach(function(shape) {
        (bridge || get(this, 'bridge')).clearShape(shape);
      });
    }

  });
});

