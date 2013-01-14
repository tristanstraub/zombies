define(['zombie', 'canvas/state-edit', 'canvas/mouse-state'], function(zombie, stateEdit, MouseState) { 
  var set = Ember.set;
  var get = Ember.get;

  createjs.TweenEmberPlugin.install();
  var Z = function() { return Zombie.Object.create.apply(Zombie.Object, arguments); };
  var P = function() { return Zombie.Properties.create.apply(Zombie.Properties, arguments); };

  Animator = Ember.Application.create({
	  autoinit: false
  });

  Animator.addsPropertiesAndSet = function(coords, a, b) {
    return function() {
      var parent = get(this, a) || 0;
      var child = get(this, b) || 0;

      set(this, coords, get(this, a) + get(this, b));
    }.observes(a, b);
  };

  Animator.GraphShape = Zombie.Path.extend({
    parentBinding: 'properties.parent',

    parentShapePropertiesBinding: Ember.Binding.oneWay('parent.properties.shape'),

    pathPropertyBinding: Ember.Binding.oneWay('properties.path'),
    shapePropertiesBinding: Ember.Binding.oneWay('properties.shape'),

    pathBinding: Ember.Binding.oneWay('pathProperty.path')
  });

  var BoxPathTemplate = Zombie.PathTemplate.extend({
    copyProperties: Zombie.copyProperties('width', 'height'),

    width: Zombie.PathTemplateProperty('width'),
    height: Zombie.PathTemplateProperty('height')
  });

  Animator.ApplicationController = Ember.Controller.extend({});
  Animator.ApplicationView = Ember.View.extend({
    layout: Ember.Handlebars.compile('{{yield}}'),
    templateName: 'application'
  });

  Animator.TimelineView = Ember.View.extend({
    layout: Ember.Handlebars.compile('{{yield}}'),
	  templateName: 'timeline'
  });
  Animator.WorkspaceView = Ember.View.extend({
    layout: Ember.Handlebars.compile('{{yield}}'),
	  templateName: 'workspace'
  });
  Animator.WorkspaceController = Ember.Controller.extend({});

  var highlightShapesAndPoints = function(manager, event) {
    var router = event.targetObject;
    var canvasView = event.context;
    
    var offset = canvasView.$().offset();
    var shapesPoints = canvasView.shapesAtPoint(event.pageX - offset.left, event.pageY - offset.top);

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
  };

  var MouseDragManager = Ember.StateManager.extend({
    //enableLogging: true,
    initialState: 'up',
    states: {
      up: MouseState.create({
        mouseDown: function(manager, event) {
          highlightShapesAndPoints(manager, event);

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
          highlightShapesAndPoints(manager, event);
        }
      }),

      tool: MouseState.create({
        pencil: MouseState.create({
          down: MouseState.create({})
        }),

        edit: stateEdit,

        select: MouseState.create({
          down: MouseState.create({
            setup: function(manager, event) {
              var router = event.targetObject;
              var canvasView = event.context;

              var offset = canvasView.$().offset();
              var shapes = canvasView.shapesAtPoint(event.pageX - offset.left, event.pageY - offset.top).mapProperty('shape');

              if (shapes.length > 0) {
                router.send('draggingShapes', canvasView, shapes);

                manager.transitionTo('dragging', { event: event, shapes: shapes, x: event.pageX - offset.left, y: event.pageY - offset.top });
              }

              highlightShapesAndPoints(manager, event);
            },
            mouseUp: function(router, event) {
              router.transitionTo('up');
            }
          }),
          dragging: MouseState.create({
            shapes: null,
            startx: null,
            starty: null,

            coords: null,

            setup: function(manager, context) {
              set(this, 'shapes', context.shapes);
              set(this, 'startx', context.x);
              set(this, 'starty', context.y);

              var coords = context.shapes.map(function(shape) {
                return { x:get(shape, 'properties.shape.x'), y: get(shape, 'properties.shape.y') };
              });
              set(this, 'coords', coords);
            },

            mouseMove: function(manager, event) {
              var canvasView = event.context;
              var offset = canvasView.$().offset();

              var dx = (event.pageX - offset.left) - get(this, 'startx');
              var dy = (event.pageY - offset.top) - get(this, 'starty');

              var coords = get(this, 'coords');
              get(this, 'shapes').forEach(function(shape, index) {
                var newX = coords[index].x + dx;
                var newY = coords[index].y + dy;

                set(shape, 'properties.shape.x', newX);
                set(shape, 'properties.shape.y', newY);
              });

              highlightShapesAndPoints(manager, event);
            },

            mouseUp: function(manager, event) {
              var router = event.targetObject;
              var canvasView = event.context;

              router.send('draggingShapes', canvasView, []);

              manager.transitionTo('up');

              highlightShapesAndPoints(manager, event);
            }
          }),

        }),
        brush: MouseState.create({
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
        })
      })
    }
  });

  var mouseMethod = function(name) {
    return function(event) {
      var manager = get(this, 'mouseStateManager');
      event.context = this;
      event.targetObject = get(this, 'controller.target');
      manager && manager.send(name, event);
    };
  };

  Animator.CanvasView = Ember.View.extend({
    attributeBindings: ['width','height','style'],
    tagName: 'canvas',

    tool: 'brush',

    classNames: ['canvas'],

    toolChanged: function() {
      this.$().removeClass('edit');
      this.$().removeClass('select');
      this.$().removeClass('pencil');

      this.$().addClass(get(this, 'tool'));
    }.observes('tool'),

    canvas: function() {
      return this.$();
    }.property(),

    style: function() {
      return "border: 1px dotted black; width: %@px; height: %@px;".fmt(get(this, 'canvasWidth'), get(this, 'canvasHeight'));
    }.property(),

    bridge: null,

    shapes: null,

    canvasWidth: null,
    canvasHeight: null,

    width: function() {
      //        return '%@px'.fmt(get(this, 'canvasWidth')*2);
      return get(this, 'canvasWidth');
    }.property(),

    height: function() {
      //        return '%@px'.fmt(get(this, 'canvasHeight')*2);
      return get(this, 'canvasHeight');
    }.property(),

    init: function() {
      this._super.apply(this, arguments);

      if (!get(this, 'shapes')) {
        set(this, 'shapes', []);
      }
    },
    
    shapesAtPoint: function(x, y) {
      return get(this, 'shapes').map(function(shape) {
        var w=20;
        var h=20;
        var pointsAndIndexes = shape.getContainedPoints(x-w/2,y-h/2,w,h);
        var points = pointsAndIndexes.mapProperty('point');
        return pointsAndIndexes.length > 0 ? { shape: shape, points: points, pointsAndIndexes: pointsAndIndexes } : null;
      }).filter(function(a) { return a; });
    },

    mouseDown: mouseMethod('mouseDown'),
    mouseUp: mouseMethod('mouseUp'),
    mouseMove: mouseMethod('mouseMove'),
    mouseEnter: mouseMethod('mouseEnter'),
    mouseLeave: mouseMethod('mouseLeave'),

    didInsertElement: function() {
      var canvas = get(this, 'canvas');

      var bridge = Zombie.EaselBridge.create({
        stage: new createjs.Stage(canvas.get(0))
      });

      var factory = Zombie.Factory.create({
        bridge: bridge
      });

      set(this, 'bridge', bridge);

      get(this, 'shapes').forEach(function(shape) {
        shape.addToStage(bridge);
      });

      factory.createGameLoop().start();
    },

    addShape: function(shape) {
      get(this, 'shapes').addObject(shape);
      shape.addToStage(get(this, 'bridge'));
    },

    removeShape: function(shape) {
      get(this, 'shapes').removeObject(shape);
      shape.removeFromStage(get(this, 'bridge'));
    }
  });

  Animator.ShapeView = Animator.CanvasView.extend({
    shape: null,
    didInsertElement: function() {
      this._super.apply(this, arguments);
      this.addShape(get(this, 'shape'));
    }
  });

  Animator.ComparisonView = Ember.View.extend({
    layout: Ember.Handlebars.compile('{{yield}}'),

    left: null,
    right: null,
    equal: function() {
      return get(this, 'left') === get(this, 'right');
    }.property('left','right'),
    contains: function() {
      var right = get(this, 'right');
      return right.indexOf(get(this, 'left')) >= 0;
    }.property('left','right'),
  });

  Animator.initialize(Ember.Router.create({
    //      enableLogging: true,
    location: 'hash',
    root: Ember.Route.extend({
      index: Ember.Route.extend({
        route: '/',

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

        canvasDragEvent: function(router, event) {
          // dragstart   : 'dragStart',
          // drag        : 'drag',
          // dragenter   : 'dragEnter',
          // dragleave   : 'dragLeave',
          // dragover    : 'dragOver',
          // drop        : 'drop',
          // dragend     : 'dragEnd'
        },

        context: null,

        connectOutlets: function(router) {
          var brushProperties = P({
            copyProperties: Zombie.copyProperties('path', 'shape', 'animations'),

            path: BoxPathTemplate.create({
              width: 100,
              height: 100,
              pathTemplate: 'M 0 0 L {{width}} 0 L 0 {{height}} L -{{width}} 0 L 0 -{{height}}'
            }).observes('width','height'),
            
            shape: P({
              copyProperties: Zombie.copyProperties('x','y'),
              x: 5,
              y: 0
            }),
            
            animations: function() {
              return [{ name: 'move',
                        animate: function(part) {
                          createjs.Tween.get(part.properties.shape,{loop:true})
		                        .to({'x':300,'y':300},10000);
                        }
                      }];
            }.property()
          });

          var shape = Animator.GraphShape.create({
            properties: brushProperties 
          });

          var context = Z({
            /**
               Tools: select, pencil, edit

               @property tool
               @return {Object} the canvas tool
            */
            tool: 'brush',

            /**
               @property brushes
               @return {Object} the user created brushes
            */
            brushes:[shape],

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
            canvasMouseStateManager: MouseDragManager.create()
          });

          set(context, 'selectedBrush', get(context, 'brushes').objectAt(0));

          set(this, 'context', context);
          get(router, 'applicationController').connectOutlet('main', 'workspace', context);
        }
      })
    })
  }));
});
