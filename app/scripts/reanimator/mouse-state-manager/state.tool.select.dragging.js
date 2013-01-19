define(['ember', 'reanimator/mouse-state-manager/mouse-state'], function(Ember, MouseState) {
  var set = Ember.set;
  var get = Ember.get;

  return MouseState.extend({
    shapes: null,
    startx: null,
    starty: null,

    coords: null,

    setup: function(manager, context) {
      set(this, 'shapes', context.shapes);
      set(this, 'startx', context.x);
      set(this, 'starty', context.y);

      var coords = context.shapes.map(function(shape) {
        return { x:get(shape, 'x'), y: get(shape, 'y') };
      });

      set(this, 'coords', coords);
    },

    mouseMove: function(manager, event) {
      var offsets = manager.getOffsets(event);

      var dx = offsets.cx - get(this, 'startx');
      var dy = offsets.cy - get(this, 'starty');

      var coords = get(this, 'coords');
      get(this, 'shapes').forEach(function(shape, index) {
        var newX = coords[index].x + dx;
        var newY = coords[index].y + dy;

        set(shape, 'x', newX);
        set(shape, 'y', newY);
      });
    },

    mouseUp: function(manager, event) {
      manager.transitionTo('idle');
    }
  });
});
