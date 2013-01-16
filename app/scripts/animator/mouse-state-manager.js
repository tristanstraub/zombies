define(['ember', 'canvas/mouse-state', 'animator/mouse-state-manager/state.tool.edit', 'animator/mouse-state-manager/state.tool.pencil', 'animator/mouse-state-manager/state.tool.pencil', 'animator/mouse-state-manager/state.tool.pencil'], function(Ember, MouseState, StateToolEdit, StateToolPencil, StateToolSelect, StateToolBrush) {
  var set = Ember.set;
  var get = Ember.get;

  var highlightShapesAndPoints = function(manager, event) {
    var router = event.targetObject;
    var canvasView = event.context;
    
    var offset = canvasView.$().offset();
    var px = event.pageX - offset.left;
    var py = event.pageY - offset.top;
    var shapesPoints = canvasView.shapesAtPoint(px, py);

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
        pencil: StateToolPencil.create(),
        edit: StateToolEdit.create(),
        select: StateToolSelect.create(),
        brush: StateToolBrush.create()
      })
    }
  });

  return MouseStateManager;
});
