define(['ember', 'livingdead/livingdead', 'reanimator/mouse-state-manager/mouse-state'], function(Ember, LivingDead, MouseState) {
  var set = Ember.set, get = Ember.get, Z = LivingDead.Z, P = LivingDead.P;

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

        var startPoint = manager.getFirstNearestLineEndPoint(offsets.cx, offsets.cy) || [offsets.cx,offsets.cy];

        var line = new LivingDead.Line({
          edge: [Ember.copy(startPoint), [offsets.cx,offsets.cy]],
          x: 0,
          y: 0
        });

        
        manager.addShapeToLayer(line, 'overlay');

        set(this, 'line', line);
      },

      mouseMove: function(manager, event) {
        var offsets = manager.getOffsets(event);

        var edge = get(this, 'line.edge');

        var endPoint = Ember.copy(manager.getFirstNearestLineEndPoint(offsets.cx, offsets.cy) || [offsets.cx,offsets.cy]);

        edge.replace(1, 1, [endPoint]);
      },

      mouseUp: function(manager, event) {
        var offsets = manager.getOffsets(event);

        var edge = get(this, 'line.edge');

        var endPoint = Ember.copy(manager.getFirstNearestLineEndPoint(offsets.cx, offsets.cy) || [offsets.cx,offsets.cy]);

        edge.replace(1, 1, [endPoint]);

        manager.removeShapeFromLayer(get(this, 'line'), 'overlay');
        manager.addShapeToLayer(get(this, 'line'), 'foreground');

        manager.transitionTo('idle');
      }
    })
  });
});



