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
           @property draggedShapes
           @return {Object} the shapes being dragged
        */              
        draggedShapes: [],

        /**
           @property highlightedShapes
           @return {Object} the shapes hovered over
        */              
        highlightedShapes: [],

        /**
           @property highlightedPoints
           @return {Object} the points hovered over
        */              
        highlightedPoints: [],

        /**
           @property previousHighlightedPoints
           @return {Object} the previous points that were hovered over
        */
        previousHighlightedPoints: [],

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

    draggingShapes: function(router, canvasView, shapes) {
      set(this, 'context.draggedShapes', shapes.mapProperty('brush'));
    },

    highlightShapes: function(router, canvasView, shapes) {
      set(this, 'context.highlightedShapes', shapes.mapProperty('brush'));
    },

    highlightPoints: function(manager, canvasView, points) {
      var ps = get(this, 'context.previousHighlightedPoints');
      ps.forEach(function(shape) {
        canvasView.removeShape(shape);
      });

      pointShapes = points.map(function(point) {
        var shape = Zombie.Circle.create({
          properties: P({
            shape: P({
              x: point[0], y: point[1]
            }),
            circle: P({
              radius: 2
            })
          })
        });

        canvasView.addShape(shape);
        return shape;
      });

      set(this, 'context.previousHighlightedPoints', pointShapes);
    },
    
    chooseTool: function(tool) {
      set(this, 'context.tool', tool);
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

    canvasClicked: function(router, event, shapesAtPoint, x, y) {
      var canvas = event.context;
      var brush = get(this, 'context.selectedBrush');

      if (brush) {
        var canvasDelegate = brush.createDelegate(true);
        var shapeDelegate = brush.createDelegate(true);
        
        set(canvasDelegate, 'brush', shapeDelegate);

        set(canvasDelegate, 'properties.shape.x', x);
        set(canvasDelegate, 'properties.shape.y', y);

        canvas.addShape(canvasDelegate);
        get(this, 'context.shapes').addObject(shapeDelegate);
      }
    },

    highlightShapesAndPoints: function(router, event) {
      var router = event.targetObject;
      var canvasView = event.context;
      
      var offset = canvasView.$().offset();
      var px = event.pageX - offset.left;
      var py = event.pageY - offset.top;
      var shapesPoints = canvasView.shapesAtPoint(px, py);

      var shapes = [];
      var points = [];

      if (shapesPoints.length > 0) {
        var id = Ember.guidFor({});

        points = shapesPoints.map(function(data) { 
          var x = get(data.shape, 'properties.shape.x');
          var y = get(data.shape, 'properties.shape.y');

          var points = data.points;

          return points.map(function(point) {
            return [point[0] + x, point[1] + y];
          });
        }).reduce(function(a,b) { 
          b.forEach(function(point) {
            a.pushObject(point);
          })
          return a;
        }, []);

        shapes = shapesPoints.mapProperty('shape');
      }

      router.send('highlightShapes', canvasView, shapes);
      router.send('highlightPoints', canvasView, points);
    },

    addShape: function(router, event) {
      var shape = event.context;
      get(this, 'context.shapes').addObject(shape);      
    }
  })
});
