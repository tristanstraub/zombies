define(['ember', 'livingdead/livingdead', 'reanimator/mouse-state-manager/mouse-state'], function(Ember, LivingDead, MouseState) {
  var set = Ember.set, get = Ember.get, Z = LivingDead.Z, P = LivingDead.P;

  var distance = function(a,b) {
    var dx = a.objectAt(0)-b.objectAt(0);
    var dy = a.objectAt(1)-b.objectAt(1);
    return Math.sqrt(dx*dx+dy*dy);
  };

  var getFirstNearestLineEndPoint = function(manager, cx, cy, shape) {
    var shapesPoints = manager.shapesAtPoint(cx, cy);

    if (shapesPoints.length > 0) {
      var lines = shapesPoints;

      if (lines.length > 0) {
        var point = shapesPoints.filter(function(sh) { 
          return (sh.shape !== shape);
        }).mapProperty('points').reduce(function(a,b) {
          a.pushObjects(b);
          return a;
        }, []).reduce(function(a, b) {
          if (!a)
            return b;

          var d1 = distance(a, [cx, cy]);
          var d2 = distance(b, [cx, cy]);
          
          if (d1 <= d2) {
            return a;
          } else {
            return b;
          }
        }, null);

        return point;
      }
    }

    return null;
  };

  return MouseState.extend({    
    down: MouseState.extend({
      setup: function(manager, event) {
        manager.transitionTo('draw', event);
      }
    }),

    draw: MouseState.extend({
      line: null,

      setup: function(manager, event) {
        var offsets = manager.getOffsets(event);

        var startPoint = getFirstNearestLineEndPoint(manager, offsets.cx, offsets.cy);
        if (!startPoint) {
          startPoint = [offsets.cx,offsets.cy];
        }

        var line = new LivingDead.Line({
          edge: [Ember.copy(startPoint),[offsets.cx,offsets.cy]],
          x: 0,
          y: 0
        });

        
        manager.addShapeToLayer(line, 'overlay');

        set(this, 'line', line);
      },

      mouseMove: function(manager, event) {
        var offsets = manager.getOffsets(event);

        var edge = get(this, 'line.edge');
        edge.replace(1, 1, [[offsets.cx, offsets.cy]]);
      },

      mouseUp: function(manager, event) {
        var canvasView = event.context;
        var offsets = manager.getOffsets(event);

        var edge = get(this, 'line.edge');
        var endPoint = getFirstNearestLineEndPoint(manager, offsets.cx, offsets.cy, get(this, 'line'));
        if (!endPoint) {
          endPoint = [offsets.cx,offsets.cy];
        }

        edge.replace(1, 1, [Ember.copy(endPoint)]);

        manager.removeShapeFromLayer(get(this, 'line'), 'overlay');
        manager.addShapeToLayer(get(this, 'line'), 'foreground');

        manager.transitionTo('idle');
      }
    })
  });
});



