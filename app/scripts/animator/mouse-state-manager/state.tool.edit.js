define(['ember', 'canvas/mouse-state'], function(Ember, MouseState) {
  var set = Ember.set;
  var get = Ember.get;

  return MouseState.extend({
    down: MouseState.extend({
      setup: function(manager, event) {
        var router = event.targetObject;
        var canvasView = event.context;

        var offset = canvasView.$().offset();
        var cx = event.pageX - offset.left;
        var cy = event.pageY - offset.top;
        var shapesPoints = canvasView.shapesAtPoint(cx, cy);
        
        if (shapes.length > 0) {
          manager.transitionTo('dragging', { event: event, shapesPoints: shapesPoints, x: cx, y: cy });
        }

        router.send('highlightShapesAndPoints', event);
      },
      mouseUp: function(router, event) {
        router.transitionTo('up');
      }
    }),
    dragging: MouseState.extend({
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

        var router = event.targetObject;
        router.send('highlightShapesAndPoints', event);
      },

      mouseUp: function(manager, event) {
        var router = event.targetObject;
        var canvasView = event.context;

        router.send('draggingShapes', canvasView, []);

        manager.transitionTo('up');

        router.send('highlightShapesAndPoints', event);
      }
    }),

  });


});
