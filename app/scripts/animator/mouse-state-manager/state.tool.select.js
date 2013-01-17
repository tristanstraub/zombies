define(['ember', 'animator/mouse-state', 'animator/mouse-state-manager/state.tool.select.dragging'], function(Ember, MouseState, StateToolSelectDragging) {
  var set = Ember.set;
  var get = Ember.get;

  return MouseState.extend({
    down: MouseState.extend({
      setup: function(manager, event) {
        var router = event.targetObject;
        var canvasView = event.context;

        var offset = canvasView.$().offset();
        var shapes = canvasView.shapesAtPoint(event.pageX - offset.left, event.pageY - offset.top).mapProperty('shape');

        if (shapes.length > 0) {
          router.send('draggingShapes', canvasView, shapes);

          manager.transitionTo('dragging', { event: event, shapes: shapes, x: event.pageX - offset.left, y: event.pageY - offset.top });
        }

        router.send('highlightShapesAndPoints', event);
      },
      mouseUp: function(manager, event) {
        manager.transitionTo('idle');
      }
    }),
    dragging: StateToolSelectDragging
  });
});
