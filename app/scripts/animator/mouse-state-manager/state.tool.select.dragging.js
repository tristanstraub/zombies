define(['ember', 'animator/mouse-state'], function(Ember, MouseState) {
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
        return { x:get(shape, 'properties.shape.x'), y: get(shape, 'properties.shape.y') };
      });
      set(this, 'coords', coords);
    },

    mouseMove: function(manager, event) {
      var canvasView = event.context;
      var offset = canvasView.$().offset();

      var dx = (event.pageX - offset.left) - get(this, 'startx');
      var dy = (event.pageY - offset.top) - get(this, 'starty');

      var coords = get(this, 'coords');
      get(this, 'shapes').forEach(function(shape, index) {
        var newX = coords[index].x + dx;
        var newY = coords[index].y + dy;

        set(shape, 'properties.shape.x', newX);
        set(shape, 'properties.shape.y', newY);
      });

      var router = event.targetObject;
      router.send('highlightShapesAndPoints', event);
    },

    mouseUp: function(manager, event) {
      var router = event.targetObject;
      var canvasView = event.context;

      router.send('draggingShapes', canvasView, []);

      manager.transitionTo('idle');

      router.send('highlightShapesAndPoints', event);
    }
  });
});
