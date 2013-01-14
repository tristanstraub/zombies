define(['canvas/mouse-state'], function(MouseState) {
  return MouseState.create({
    down: MouseState.create({
      setup: function(manager, event) {
        var router = event.targetObject;
        var canvasView = event.context;

        var offset = canvasView.$().offset();
        var cx = event.pageX - offset.left;
        var cy = event.pageY - offset.top;
        var shapesPoints = canvasView.shapesAtPoint(cx, cy);              
        
        shapesPoints

        if (shapes.length > 0) {
          manager.transitionTo('dragging', { event: event, shapesPoints: shapesPoints, x: cx, y: cy });
        }

        highlightShapesAndPoints(manager, event);
      },
      mouseUp: function(router, event) {
        router.transitionTo('up');
      }
    }),
    dragging: MouseState.create({
      shapesPoints: null,
      startx: null,
      starty: null,

      coords: null,

      setup: function(manager, context) {
        set(this, 'shapesPoints', context.shapesPoints);
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
    }),

  })
});
