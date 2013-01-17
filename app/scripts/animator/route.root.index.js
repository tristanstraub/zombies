define(['ember', 'zombie/zombie', 'animator/graph-shape', 'animator/box-path-template', 'animator/mouse-state-manager/mouse-state-manager'], function(Ember, Zombie, GraphShape, BoxPathTemplate, MouseStateManager) {
  var set = Ember.set, get = Ember.get, Z = Zombie.Z, P = Zombie.P;

  return Ember.Route.extend({
    route: '/',

    context: null,

    setup: function() {
      var context = Z({
        /**
           Tools: select, pencil, edit, brush, boxselect

           @property tool
           @return {Object} the canvas tool
        */
        tool: 'pencil',

        /**
           @property brushes
           @return {Object} the user created brushes
        */
        brushes:[],

        /**
           @property shapes
           @return {Object} the shapes active on the canvas
        */
        shapes: [],

        /**
           @property selectedBrush
           @return {Object} the selected brush or undefined
        */              
        selectedBrush: null,

        /**
           @property canvasMouseStateManager
           @return {Object} the state manager for the mouse
        */
        canvasMouseStateManager: MouseStateManager.create()
      });

      set(this, 'context', context);

      this._super.apply(this, arguments);
    },

    connectOutlets: function(router) {
      get(router, 'applicationController').connectOutlet('main', 'workspace', get(this, 'context'));
    },

    animate: function(router, event) {
      var part = event.contexts[0];
      var animation = event.contexts[1];

      animation.animate(part);
    },

    selectBrush: function(router, event) {
      var shape = event.context;
      
      if (shape === get(this, 'context.selectedBrush')) {
        set(this, 'context.selectedBrush', null);
      } else {
        set(this, 'context.selectedBrush', shape);
      }
    },

    chooseTool: function(tool) {
      set(this, 'context.tool', tool);
    },

    chooseBoxSelectTool: function(router) {
      this.chooseTool('boxselect');
    },

    chooseSelectTool: function(router) {
      this.chooseTool('select');
    },

    chooseBrushTool: function(router) {
      this.chooseTool('brush');
    },

    chooseEditTool: function(router) {
      this.chooseTool('edit');
    },

    choosePencilTool: function(router) {
      this.chooseTool('pencil');
    }
  })
});
