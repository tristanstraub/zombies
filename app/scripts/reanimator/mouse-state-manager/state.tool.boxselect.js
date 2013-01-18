define(['ember', 'reanimator/mouse-state-manager/mouse-state', 'reanimator/mouse-state-manager/state.tool.boxselect.selecting'], function(Ember, MouseState, StateToolSelectSelecting) {
  var set = Ember.set;
  var get = Ember.get;

  return MouseState.extend({
    down: MouseState.extend({
      setup: function(manager, event) {
        var offsets = manager.getOffsets(event);
		var shapes = manager.shapesAtPoint(offsets.cx, offsets.cy).mapProperty('shape');
        
        manager.transitionTo('selecting', { event: event, cx: offsets.cx, cy: offsets.cy});
      }
    }),

    selecting: StateToolSelectSelecting
  });
});
