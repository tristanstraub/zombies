define(['ember', 'zombie', 'canvas/mouse-state'], function(Ember, Zombie, MouseState) {
  var set = Ember.set;
  var get = Ember.get;

  var Z = function() { return Zombie.Object.create.apply(Zombie.Object, arguments); };
  var P = function() { return Zombie.Properties.create.apply(Zombie.Properties, arguments); };

  return MouseState.extend({    
    down: MouseState.create({
      setup: function(manager, event) {
        var canvasView = event.context;

        var offset = canvasView.$().offset();
        var cx = event.pageX - offset.left;
        var cy = event.pageY - offset.top;

        var line = Zombie.Line.create({
          properties: P({
            line: P({
              edge: [[cx,cy],[cx,cy]]
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
        var canvasView = event.context;
        var offset = canvasView.$().offset();
        console.log(offset);

        var cx = (event.pageX - offset.left);
        var cy = (event.pageY - offset.top);

        var edge = get(this, 'context.line.edge');

        edge.replace(1, 1, [[cx, cy]]);

        console.log(edge);
      },

      mouseUp: function(manager, event) {
        manager.transitionTo('tool.pencil');
      }
    })
  });
});



