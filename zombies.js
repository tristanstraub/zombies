
requirejs.config({
  paths: { jquery: 'jquery-1.8.3.min',
           easeljs: 'easeljs-0.5.0.min',
           tweenjs: 'tweenjs-0.3.0.min',
           handlebars: 'handlebars-1.0.rc.1',
           ember: 'ember',
           path: 'path',
           zombie: 'zombie',
           'tweenjs-ember-plugin': 'tweenjs-ember-plugin'
         }
});

require(['handlebars'], function() {
  require(['jquery', 'easeljs', 'tweenjs', 'ember', 'path', 'zombie', 'tweenjs-ember-plugin'], function() {
    createjs.TweenEmberPlugin.install();
    var Z = function() { return Zombie.Object.create.apply(Zombie.Object, arguments); };

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

      pathBinding: Ember.Binding.oneWay('pathProperty.path'),

      xBinding: 'properties.shape.x',
      yBinding: 'properties.shape.y'

      // xDidChange: Animator.addsPropertiesAndSet('x', 'parentShapeProperties.x', 'shapeProperties.x'),
      // yDidChange: Animator.addsPropertiesAndSet('y', 'parentShapeProperties.y', 'shapeProperties.y'),
    });

    var BoxPathTemplate = Zombie.PathTemplate.extend({
      copyProperties: Zombie.copyProperties('width', 'height'),

      width: Zombie.PathTemplateProperty('width'),
      height: Zombie.PathTemplateProperty('height')
    });

    // var robot = Z({
    //   head: Z({
    //     properties: Z({
    //       path: BoxPathTemplate.create({
    //         width: 100,
    //         height: 100,
    //         pathTemplate: 'M 0 0 L {{width}} 0 L 0 {{height}} L -{{width}} 0 L 0 -{{height}}'
    //       }).observes('width','height'),

    //       shape: Z({ 
    //         x: 5, 
    //         y: 0 
    //       }),

    //       animations: function() {
    //         return [{ name: 'move', 
    //                   animate: function(part) {
    //                     createjs.Tween.get(part.properties.shape,{loop:true})
		//                       .to({'x':300,'y':300},10000);
    //                   }
    //                 }];
    //       }.property()
    //     })
    //   }),

    //   body: Z({
    //     properties: Z({
    //       path: BoxPathTemplate.create({
    //         width: 200,
    //         height: 200,
    //         pathTemplate: 'M 0 0 L {{width}} 0 L 0 {{height}} L -{{width}} 0 L 0 -{{height}}'
    //       }).observes('width','height'),
          
    //       shape: Z({ 
    //         x: 0, 
    //         y: 10 
    //       })
    //     })
    //   }),

    //   properties: Z({
    //     shape: Z({
    //       x: 0, 
    //       y: 0
    //     })
    //   })
    // });

    // robot.reopen({
    //   head: robot.head.reopen({
    //     shape: GraphShape.create({ 
    //       properties: robot.head.properties
    //     })
    //   }),

    //   body: robot.body.reopen({
    //     shape: GraphShape.create({ 
    //       properties: robot.body.properties
    //     })
    //   })
    // });

    Animator.ApplicationController = Ember.Controller.extend({});
    Animator.ApplicationView = Ember.View.extend({
      templateName: 'application'
    });

    Animator.TimelineView = Ember.View.extend({
	    templateName: 'timeline'
    });
    Animator.WorkspaceView = Ember.View.extend({
	    templateName: 'workspace'
    });
    Animator.WorkspaceController = Ember.Controller.extend({});

    var stateProperty = Ember.computed(function(key) {
      var parent = get(this, 'parentState');
      if (parent) {
        return get(parent, key);
      }
    }).property();

    var MouseState = Ember.State.extend({
      isDragging: stateProperty,
      
      mouseDown: function(event) {},
      mouseUp: function(event) {},
      mouseMove: function(event) {},
      mouseEnter: function(event) {},
      mouseLeave: function(event) {}
    });
 
    var highlightShapes = function(manager, event) {
      var router = event.targetObject;
      var canvasView = event.context;
      
      var offset = canvasView.$().offset();
      var shapes = canvasView.shapesAtPoint(event.clientX - offset.left, event.clientY - offset.top);
      
      if (shapes.length > 0) {
        router.send('highlightShapes', shapes);
      }
    };

    var MouseDragManager = Ember.StateManager.extend({
//      enableLogging: true,
      initialState: 'up',
      states: {
        up: MouseState.create({
          mouseDown: function(manager, event) {
            manager.transitionTo('down', event);
          },

          mouseMove: function(manager, event) {
            highlightShapes(manager, event);
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
            highlightShapes(manager, event);

            var canvasView = event.context;
            var offset = canvasView.$().offset();

            var dx = (event.clientX - offset.left) - get(this, 'startx');
            var dy = (event.clientY - offset.top) - get(this, 'starty');

            var coords = get(this, 'coords');
            get(this, 'shapes').forEach(function(shape, index) {
              var newX = coords[index].x + dx;
              var newY = coords[index].y + dy;

              set(shape, 'properties.shape.x', newX);
              set(shape, 'properties.shape.y', newY);
            });
          },

          mouseUp: function(manager, event) {
            var router = event.targetObject;

            router.send('draggingShapes', []);

            manager.transitionTo('up');
          }
        }),

        down: MouseState.create({
          setup: function(manager, event) {
            var router = event.targetObject;
            var canvasView = event.context;

            var offset = canvasView.$().offset();
            var shapes = canvasView.shapesAtPoint(event.clientX - offset.left, event.clientY - offset.top);

            if (shapes.length > 0) {
              router.send('draggingShapes', shapes);

              manager.transitionTo('dragging', { event: event, shapes: shapes, x: event.clientX - offset.left, y: event.clientY - offset.top });
            }
          },

          mouseUp: function(manager, event) {
            var router = event.targetObject;
            var canvasView = event.context;

            var offset = canvasView.$().offset();
            var shapes = canvasView.shapesAtPoint(event.clientX - offset.left, event.clientY - offset.top);
            
            manager.transitionTo('up');

            router.send('canvasClicked', event, shapes, event.clientX - offset.left, event.clientY - offset.top);
          }
        }),
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

//        set(this, 'mouseStateManager', get(this, 'mouseStateManager').create());
      },

     
      shapesAtPoint: function(x, y) {
        return get(this, 'shapes').map(function(shape) {
          var w=20;
          var h=20;
          var points = shape.getContainedPoints(x-w/2,y-h/2,w,h);
          return points.length > 0 ? shape : null;
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

        this.updateShapes();        

        factory.createGameLoop().start();

        var self = this;
      },

      addShape: function(shape) {
        get(this, 'shapes').addObject(shape);
        this.updateShapes();
      },

      updateShapes: function() {
        var bridge = get(this, 'bridge');
        if (bridge) {
          (get(this, 'shapes') || []).forEach(function(shape) {
            shape.addToStage(bridge);
          }, this);
        }
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

          canvasMouseDown: function(router, event, shapesAtPoint, x, y) {
          },

          draggingShapes: function(router, shapes) {
            set(this, 'context.draggedShapes', shapes.mapProperty('brush'));
          },

          highlightShapes: function(router, shapes) {
            set(this, 'context.highlightedShapes', shapes.mapProperty('brush'));
          },

          canvasClicked: function(router, event, shapesAtPoint, x, y) {
            var canvas = event.context;
            var brush = get(this, 'context.selectedBrush');

            if (brush && shapesAtPoint.length == 0) {
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
            var brushProperties = Zombie.Properties.create({
              copyProperties: Zombie.copyProperties('path', 'shape', 'animations'),

              path: BoxPathTemplate.create({
                width: 100,
                height: 100,
                pathTemplate: 'M 0 0 L {{width}} 0 L 0 {{height}} L -{{width}} 0 L 0 -{{height}}'
              }).observes('width','height'),
              
              shape: Zombie.Properties.create({
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
              brushes:[shape],
              shapes: [],
              selectedBrush: null,
              draggedShapes: [],
              highlightedShapes: [],
              canvasMouseStateManager: MouseDragManager.create()
            });

            set(this, 'context', context);
            get(router, 'applicationController').connectOutlet('main', 'workspace', context);
          }
        })
      })
    }));
  });
});
