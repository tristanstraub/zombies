define(['ember', 'canvas/mouse-state', 'canvas/state-edit'], function(Ember, MouseState, stateEdit) {
  var set = Ember.set;
  var get = Ember.get;

  var highlightShapesAndPoints = function(manager, event) {
    var router = event.targetObject;
    var canvasView = event.context;
    
    var offset = canvasView.$().offset();
    var shapesPoints = canvasView.shapesAtPoint(event.pageX - offset.left, event.pageY - offset.top);

    var shapes = [];
    var points = [];

    if (shapesPoints.length > 0) {
      var id = Ember.guidFor({});

      points = shapesPoints.map(function(data) { 
        var x = get(data.shape, 'properties.shape.x');
        var y = get(data.shape, 'properties.shape.y');

        var points = data.points;

        return points.map(function(point) {
          return [point[0] + x, point[1] + y];
        });
      }).reduce(function(a,b) { 
        b.forEach(function(point) {
          a.pushObject(point);
        })
        return a;
      }, []);

      shapes = shapesPoints.mapProperty('shape');
    }

    router.send('highlightShapes', canvasView, shapes);
    router.send('highlightPoints', canvasView, points);
  };

  var MouseStateManager = Ember.StateManager.extend({
    //enableLogging: true,
    initialState: 'up',
    states: {
      up: MouseState.create({
        mouseDown: function(manager, event) {
          highlightShapesAndPoints(manager, event);

          var canvasView = event.context;
          var tool = get(canvasView, 'tool');
          if (tool === 'pencil') {
            manager.transitionTo('tool.pencil.down', event);
          } else if (tool === 'edit') {
            manager.transitionTo('tool.edit.down', event);
          } else if (tool === 'select') {
            manager.transitionTo('tool.select.down', event);
          } else if (tool === 'brush') {
            manager.transitionTo('tool.brush.down', event);
          }
        },

        mouseMove: function(manager, event) {
          highlightShapesAndPoints(manager, event);
        }
      }),

      tool: MouseState.create({
        pencil: MouseState.create({
          down: MouseState.create({})
        }),

        edit: stateEdit,

        select: MouseState.create({
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
          }),

        }),
        brush: MouseState.create({
          down: MouseState.create({
            mouseUp: function(manager, event) {
              var router = event.targetObject;
              var canvasView = event.context;

              var offset = canvasView.$().offset();
              var shapes = canvasView.shapesAtPoint(event.pageX - offset.left, event.pageY - offset.top).mapProperty('shape');
              
              manager.transitionTo('up');

              router.send('canvasClicked', event, shapes, event.pageX - offset.left, event.pageY - offset.top);

              highlightShapesAndPoints(manager, event);
            }
          })
        })
      })
    }
  });

  return MouseStateManager;
});
