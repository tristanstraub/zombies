define(['ember', 'zombie', 'canvas/mouse-state'], function(Ember, Zombie, MouseState) {
  var set = Ember.set;
  var get = Ember.get;

  var Z = function() { return Zombie.Object.create.apply(Zombie.Object, arguments); };
  var P = function() { return Zombie.Properties.create.apply(Zombie.Properties, arguments); };

  var getFirstNearestLineEndPoint = function(canvasView, cx, cy) {
    var shapesPoints = canvasView.shapesAtPoint(cx, cy);

    if (shapesPoints.length > 0) {
      var lines = shapesPoints.filter(function(shapePoint) {
        return Zombie.Line.detectInstance(shapePoint.shape);
      });
      if (lines.length > 0) {
        line = lines.objectAt(0);
        return shapesPoints.objectAt(0).points.objectAt(0);
      }
    }
  };

  return MouseState.extend({    
    down: MouseState.extend({
      setup: function(manager, event) {
        var canvasView = event.context;

        var offset = canvasView.$().offset();
        var cx = event.pageX - offset.left;
        var cy = event.pageY - offset.top;

        var startPoint = getFirstNearestLineEndPoint(canvasView, cx, cy);
        if (!startPoint) {
          startPoint = [cx,cy];
        }

        var line = Zombie.Line.create({
          properties: P({
            line: P({
              edge: [Ember.copy(startPoint),[cx,cy]]
            }),
            shape: P({
              x: 0,
              y: 0
            })
          })
        });

        canvasView.addShape(line);

        manager.transitionTo('drawing', { line: line, cx: cx, cy: cy });
      },

      mouseUp: function(manager, event) {
        manager.transitionTo('up');
      }
    }),

    drawing: MouseState.extend({
      context: null,

      setup: function(manager, context) {
        set(this, 'context', context);
      },

      mouseMove: function(manager, event) {
        var router = event.targetObject;
        router.send('highlightShapesAndPoints', event);

        var canvasView = event.context;
        var offset = canvasView.$().offset();

        var cx = (event.pageX - offset.left);
        var cy = (event.pageY - offset.top);

        var edge = get(this, 'context.line.edge');

        edge.replace(1, 1, [[cx, cy]]);
      },

      mouseUp: function(manager, event) {
        var router = event.targetObject;
        var canvasView = event.context;
        var offset = canvasView.$().offset();

        var cx = (event.pageX - offset.left);
        var cy = (event.pageY - offset.top);

        var endPoint = getFirstNearestLineEndPoint(canvasView, cx, cy);
        if (!endPoint) {
          endPoint = [cx,cy];
        }

        var edge = get(this, 'context.line.edge');

        edge.replace(1, 1, [Ember.copy(endPoint)]);

        router.send('addShape', { context: get(this, 'context.line').createDelegate() });
        manager.transitionTo('idle');
      }
    })
  });
});



