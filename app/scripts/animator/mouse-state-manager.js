define(['ember', 
        'canvas/mouse-state', 
        'animator/mouse-state-manager/state.tool.edit', 
        'animator/mouse-state-manager/state.tool.pencil', 
        'animator/mouse-state-manager/state.tool.select', 
        'animator/mouse-state-manager/state.tool.brush'], function(
          Ember, 
          MouseState, 
          StateToolEdit, 
          StateToolPencil, 
          StateToolSelect, 
          StateToolBrush) {
  var set = Ember.set;
  var get = Ember.get;

  var MouseStateManager = Ember.StateManager.extend({
//    enableLogging: true,
    initialState: 'idle',
    states: {
      idle: MouseState.create({
        mouseDown: function(manager, event) {
          var router = event.targetObject;
          router.send('highlightShapesAndPoints', event);

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
          var router = event.targetObject;
          router.send('highlightShapesAndPoints', event);
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
