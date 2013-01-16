define(['ember', 'canvas/mouse-state'], function(Ember, MouseState) {
  var set = Ember.set;
  var get = Ember.get;

  return MouseState.extend({
    down: MouseState.create({
      setup: function(manager, event) {
        var router = event.targetObject;
        var canvasView = event.context;

        var offset = canvasView.$().offset();
        var shapes = canvasView.shapesAtPoint(event.pageX - offset.left, event.pageY - offset.top).mapProperty('shape');

        if (shapes.length > 0) {
          router.send('draggingShapes', canvasView, shapes);

          manager.transitionTo('dragging', { event: event, shapes: shapes, x: event.pageX - offset.left, y: event.pageY - offset.top });
        }

        highlightShapesAndPoints(manager, event);
      },
      mouseUp: function(router, event) {
        router.transitionTo('up');
      }
    }),
    dragging: MouseState.create({
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

        highlightShapesAndPoints(manager, event);
      },

      mouseUp: function(manager, event) {
        var router = event.targetObject;
        var canvasView = event.context;

        router.send('draggingShapes', canvasView, []);

        manager.transitionTo('up');

        highlightShapesAndPoints(manager, event);
      }
    })
  });
});
