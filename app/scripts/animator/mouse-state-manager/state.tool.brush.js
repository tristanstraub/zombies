define(['ember', 'canvas/mouse-state'], function(Ember, MouseState) {
  var set = Ember.set;
  var get = Ember.get;

  return MouseState.extend({
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
  });
});
