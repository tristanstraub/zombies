define(['ember', 'zombie', 'animator/graph-shape', 'animator/box-path-template', 'animator/mouse-state-manager'], function(ember, Zombie, GraphShape, BoxPathTemplate, MouseStateManager) {
  var set = Ember.set;
  var get = Ember.get;

  var Z = function() { return Zombie.Object.create.apply(Zombie.Object, arguments); };
  var P = function() { return Zombie.Properties.create.apply(Zombie.Properties, arguments); };

  return Ember.Route.extend({
    route: '/',

    context: null,

    setup: function() {
      var context = Z({
        /**
           Tools: select, pencil, edit, brush

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
      // var brushProperties = P({
      //   copyProperties: Zombie.copyProperties('path', 'shape', 'animations'),

      //   path: BoxPathTemplate.create({
      //     width: 100,
      //     height: 100,
      //     pathTemplate: 'M 0 0 L {{width}} 0 L 0 {{height}} L -{{width}} 0 L 0 -{{height}}'
      //   }).observes('width','height'),
        
      //   shape: P({
      //     copyProperties: Zombie.copyProperties('x','y'),
      //     x: 5,
      //     y: 0
      //   }),
        
      //   animations: function() {
      //     return [{ name: 'move',
      //               animate: function(part) {
      //                 createjs.Tween.get(part.properties.shape,{loop:true})
		  //                   .to({'x':300,'y':300},10000);
      //               }
      //             }];
      //   }.property()
      // });

      // var shape = GraphShape.create({
      //   properties: brushProperties 
      // });


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
    },


    // addShape: function(router, event) {
    //   var shape = event.context;
    //   get(this, 'context.shapes').addObject(shape);      
    // }
  })
});
