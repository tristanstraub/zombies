define(['ember', 'reanimator/mouse-state-manager/mouse-state', 'reanimator/highlighter', 'reanimator/mouse-state-manager/state.tool', 'livingdead/livingdead'], function(Ember, MouseState, Highlighter, StateTool, LivingDead) {
  var set = Ember.set, get = Ember.get;

  return Ember.StateManager.extend(LivingDead.Soul, {
    //    enableLogging: true,
    initialState: 'idle',

    highlightedShapes: null,

    rectangleHighlighter: null,

    shapes: null,
    foregroundShapes: null,

    init: function() {
      this._super.apply(this, arguments);

      set(this, 'highlightedShapes', []);
      set(this, 'rectangleHighlighter', new Highlighter());

      set(this, 'layers', new Ember.Map());
    },

    getOffsets: function(event) {
      var canvasView = event.context;

      var offset = canvasView.$().offset();
      var cx = event.pageX - offset.left;
      var cy = event.pageY - offset.top;

      return { offset: offset, cx: cx, cy: cy };
    },

    shapesAtPoint: function(x, y) {
      return this.getLayer('foreground').map(function(shape) {
        var w=20;
        var h=20;
        var points = shape.getContainedPoints(x-w/2,y-h/2,w,h);
        return points.length > 0 ? { shape: shape, points: points } : null;
      }).filter(function(a) { return a; });
    },

    getContainedShapesPoints: function(x, y, w, h) {
      return this.getLayer('foreground').map(function(shape) {
        var points = shape.getContainedPoints(x,y,w,h);
        return points.length > 0 ? { shape: shape, points: points } : null;
      }).filter(function(a) { return a; });
    },

    states: {
      idle: MouseState.create({
        mouseDown: function(manager, event) {
          var canvasView = event.context;
          var tool = get(canvasView, 'tool');
          if (tool === 'pencil') {
            manager.transitionTo('tool.pencil.down', event);
          } else if (tool === 'edit') {
            manager.transitionTo('tool.edit.down', event);
          } else if (tool === 'boxselect') {
            manager.transitionTo('tool.boxselect.down', event);
          } else if (tool === 'select') {
            manager.transitionTo('tool.select.down', event);
          } else if (tool === 'brush') {
            manager.transitionTo('tool.brush.down', event);
          }
        }
      }),

      tool: StateTool.create()
    },
    
    layers: null,

    clearLayer: function(name) {
      var layer = this.getLayer(name);
      layer.forEach(function(shape) {
        get(this, 'shapes').removeObject(shape);

        if (name === "foreground") {
          get(this, 'foregroundShapes').removeObject(shape);          
        }
      }, this);
    },

    getLayer: function(name) {
      var layers = get(this, 'layers');
      if (layers.has(name)) {
        return layers.get(name);
      } else {
        var layer = new Ember.Set();
        layers.set(name, layer);
        return layer;
      }
    },

    removeShape: function(shape) {
      var layers = get(this, 'layers');
      layers.keys.forEach(function(key) {
        this.removeShapeFromLayer(shape, key);
      }, this);
    },

    addShapeToLayer: function(shape, layerName) {
      var layer = this.getLayer(layerName);
      layer.addObject(shape);

      get(this, 'shapes').addObject(shape);

      if (layerName === "foreground") {
        get(this, 'foregroundShapes').addObject(shape);
      }
    },

    removeShapeFromLayer: function(shape, layerName) {
      var layer = this.getLayer(layerName);
      layer.removeObject(shape);

      get(this, 'shapes').removeObject(shape);

      if (layerName === "foreground") {
        get(this, 'foregroundShapes').removeObject(shape);
      }
    },

    highlightShapesAndPoints: function(manager, event) {
      var offsets = manager.getOffsets(event);
      var shapesPoints = manager.shapesAtPoint(offsets.cx, offsets.cy);

      var shapes = [];
      var points = [];

      if (shapesPoints.length > 0) {
        var id = Ember.guidFor({});

        points = shapesPoints.map(function(data) { 
          var points = data.points;

          return points.map(function(point) {
            return [point[0], point[1]];
          });
        }).reduce(function(a,b) { 
          a.pushObjects(b);
          return a;
        }, []);

        shapes = shapesPoints.mapProperty('shape');
      }

      this.highlightShapes(manager, shapes);
//      get(this, 'cursorHighlighter').highlightPoints(manager, points);

      
      manager.clearLayer('pointHighlights');
      points.forEach(function(point) {
        var shape = new LivingDead.Circle({
          x: point[0], 
          y: point[1],
          radius: 2
        });

        manager.addShapeToLayer(shape, 'pointHighlights');
      });
    },

    highlightShapes: function(canvasView, shapes) {
      // set(this, 'highlightedShapes', shapes.mapProperty('brush'));
    },

    highlightPointsInRectangle: function(manager, x, y, width, height) {
      var shapesPoints = manager.getContainedShapesPoints(x,y,width,height);
      var points = shapesPoints.map(function(data) { 
        var points = data.points;
        
        return points.map(function(point) {
          return [point[0], point[1]];
        });
      }).reduce(function(a,b) { 
        a.pushObjects(b);
        return a;
      }, []);

      manager.clearLayer('rectangleHighlights');
      points.forEach(function(point) {
        var shape = new LivingDead.Circle({
          x: point[0], 
          y: point[1],
          radius: 2
        });
        manager.addShapeToLayer(shape, 'rectangleHighlights');
      });
    }
  });
});

