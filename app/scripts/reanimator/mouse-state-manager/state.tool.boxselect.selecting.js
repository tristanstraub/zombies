define(['ember', 'livingdead/livingdead', 'reanimator/mouse-state-manager/mouse-state'], function(Ember, LivingDead, MouseState) {
  var set = Ember.set, get = Ember.get, Z = LivingDead.Z, P = LivingDead.P;

  return MouseState.extend({
    context: null,

    setup: function(manager, context) {
      var event = context.event;
      set(this, 'context', context);

      var rectangle = LivingDead.Rectangle.create({
        width: 0,
        height: 0,
        x: context.cx,
        y: context.cy
      });

      set(this, 'context.rectangle', rectangle);

      var canvasView = event.context;
      manager.addShapeToLayer(rectangle, 'overlay');

      this.highlights(manager, event);
    },

    highlights: function(manager, event) {
      var canvasView = event.context;

      var x = get(this, 'context.rectangle.x');
      var y = get(this, 'context.rectangle.y');
      var width = get(this, 'context.rectangle.width');
      var height = get(this, 'context.rectangle.height');
      
      manager.send('highlightPointsInRectangle', manager, x, y, width, height);
    },

    setCorners: function(manager, event) {
      var offsets = manager.getOffsets(event);

      var context = get(this, 'context');

      var dx = offsets.cx - context.cx;
      var dy = offsets.cy - context.cy;

      var x = context.cx;
      var y = context.cy;

      if (dx < 0) {
        x = context.cx + dx;
      }

      if (dy < 0) {
        y = context.cy + dy;
      }

      set(this, 'context.rectangle.x', x);
      set(this, 'context.rectangle.y', y);
      set(this, 'context.rectangle.width', Math.abs(dx));
      set(this, 'context.rectangle.height', Math.abs(dy));
    },

    mouseMove: function(manager, event) {
      this.setCorners(manager, event);
      this.highlights(manager, event);
    },

    mouseUp: function(manager, event) {
      this.setCorners(manager, event);

      var rectangle = get(this, 'context.rectangle');
      
      var x = get(this, 'context.rectangle.x');
      var y = get(this, 'context.rectangle.y');
      var width = get(this, 'context.rectangle.width');
      var height = get(this, 'context.rectangle.height');
      var shapesPoints = manager.getContainedShapesPoints(x,y,width,height);

      this.highlights(manager, event);
      manager.removeShapeFromLayer(rectangle, 'overlay');
      set(this, 'context.rectangle', null);

      if (shapesPoints.length > 1) {
        var shapes = shapesPoints.mapProperty('shape');
        shapes.forEach(function(shape) {
          manager.removeShape(shape);
        });

        manager.addShape(LivingDead.Group.create({
          shapes: shapes
        }));
      }

      manager.transitionTo('idle');
    }
  });
});
