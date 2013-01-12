
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

    Zombie.addsPropertiesAndSets = function(x, a, b) {
      return function() {
        set(this, x, get(this, a) + get(this, b));
      }.observes(a, b);
    };

    var GraphShape = Zombie.Path.extend({
      parent: null,
      parentShapePropertiesBinding: Ember.Binding.oneWay('parent.properties.shape'),

      part: null,
      pathPropertyBinding: Ember.Binding.oneWay('part.properties.path'),
      shapePropertiesBinding: Ember.Binding.oneWay('part.properties.shape'),

      pathBinding: Ember.Binding.oneWay('pathProperty.path'),

      xDidChange: Zombie.addsPropertiesAndSets('x', 'parentShapeProperties.x', 'shapeProperties.x'),
      yDidChange: Zombie.addsPropertiesAndSets('y', 'parentShapeProperties.y', 'shapeProperties.y'),

      // createPropertyDelegates: function(names) {
      //   names.addObjects(['pathProperty', 'parentShapeProperties', 'shapeProperties']);
      //   this._super.apply(this, arguments);
      // }
    });

    var robot = Z({
      head: Z({
        properties: Z({
          path: Zombie.PathTemplate.create({
            width: 100,
            height: 100,
            pathTemplate: 'M 0 0 L {{width}} 0 L 0 {{height}} L -{{width}} 0 L 0 -{{height}}'
          }).observes('width','height'),

          shape: Z({ 
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
        })
      }),

      body: Z({
        properties: Z({
          path: Zombie.PathTemplate.create({
            width: 200,
            height: 200,
            pathTemplate: 'M 0 0 L {{width}} 0 L 0 {{height}} L -{{width}} 0 L 0 -{{height}}'
          }).observes('width','height'),
          
          shape: Z({ 
            x: 0, 
            y: 10 
          })
        })
      }),

      properties: Z({
        shape: Z({
          x: 0, 
          y: 0
        })
      })
    });

    robot.reopen({
      head: robot.head.reopen({
        shape: GraphShape.create({ 
          part: robot.head,
          parent: robot
        })
      }),

      body: robot.body.reopen({
        shape: GraphShape.create({ 
          part: robot.body,
          parent: robot
        })
      })
    });

    Animator = Ember.Application.create({
	    autoinit: false
    });

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
      isDragging: stateProperty
    });

    Animator.CanvasView = Ember.View.extend({
      attributeBindings: ['width','height','style'],
      tagName: 'canvas',
//      templateName: 'canvas',

      canvas: function() {
        return this.$();
      }.property(),

      style: "border: 1px dotted black;",

      bridge: null,

      shapes: null,

      width: 256,
      height: 256,

      init: function() {
        this._super.apply(this, arguments);

        if (!get(this, 'shapes')) {
          set(this, 'shapes', []);
        }

        set(this, 'mouseStateManager', get(this, 'mouseStateManager').create());
      },

      mouseStateManager: Ember.StateManager.extend({
        isDragging: false,
        states: {
          start: MouseState.create(),
          down: MouseState.create({
            isDragging: true
          }),
          up: MouseState.create({})
        }
      }),

      mouseDown: function(event) {
        get(this, 'mouseStateManager').transitionTo('down', event);
      },

      mouseUp: function(event) {
        get(this, 'mouseStateManager').transitionTo('up', event);
      },

      mouseMove: function() {
//        console.log(get(this, 'mouseStateManager.currentState.isDragging'));
//        get(this, 'mouseStateManager').transitionTo('', event);
      },

      mouseEnter: Ember.K,
      mouseLeave: Ember.K,

      // eventManager: Ember.Object.create({
      //   dragStart: function(event, view){
      //     // will be called when when an instance's
      //     // rendered element or any rendering
      //     // of this views's descendent
      //     // elements is clicked
      //     console.log('dragStart');
      //   },

      // }),

      didInsertElement: function() {
        var canvas = get(this, 'canvas');

        var bridge = Zombie.EaselBridge.create({
          stage: new createjs.Stage(canvas.get(0))
        });

        var factory = Zombie.Factory.create({
          bridge: bridge
        });

        set(this, 'bridge', bridge);
        console.log('bridged');

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

    Animator.PartView = Animator.CanvasView.extend({
      part: null,
      didInsertElement: function() {
        this.addShape(get(this, 'part.shape'));

        this._super.apply(this, arguments);
      }
    });

    Animator.ShapeView = Animator.CanvasView.extend({
      shape: null,
      didInsertElement: function() {
        this.addShape(get(this, 'shape'));

        this._super.apply(this, arguments);
      }
    });

    Animator.ComparisonView = Ember.View.extend({
      left: null,
      right: null,
      equal: function() {
        return get(this, 'left') === get(this, 'right');
      }.property('left','right')
    });

    Animator.initialize(Ember.Router.create({
      enableLogging: true,
      location: 'hash',
      root: Ember.Route.extend({
        index: Ember.Route.extend({
          route: '/',

          animate: function(router, event) {
            console.log(event.contexts);
            var part = event.contexts[0];
            var animation = event.contexts[1];

            animation.animate(part);
          },

          selectBrush: function(router, event) {
            var part = event.context;
            if (part === get(this, 'context.selectedBrush')) {
              set(this, 'context.selectedBrush', null);
            } else {
              set(this, 'context.selectedBrush', part);
            }
          },

          canvasClicked: function(router, event) {
            var canvas = event.context;
            var brush = get(this, 'context.selectedBrush');
            if (brush) {
              var canvasDelegate = get(brush, 'shape').createDelegate();
              var shapeDelegate = get(brush, 'shape').createDelegate();
              
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
            console.log(event);
          },

          context: null,

          connectOutlets: function(router) {
            var part = Z({name:'test',
                          properties: Z({
                            path: Zombie.PathTemplate.create({
                              width: 100,
                              height: 100,
                              pathTemplate: 'M 0 0 L {{width}} 0 L 0 {{height}} L -{{width}} 0 L 0 -{{height}}'
                            }).observes('width','height'),

                            shape: Z({
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
                          }),
                          shape: null
                         });

            set(part, 'shape', GraphShape.create({
              part: part
            }));

            var context = Z({
              brushes:[part],
              shapes: [],
              selectedBrush: null
            });

            set(this, 'context', context);
            get(router, 'applicationController').connectOutlet('main', 'workspace', context);
          }
        })
      })
    }));

    Animator.router.transitionTo('root.index');
  });
});
