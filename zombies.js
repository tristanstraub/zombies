
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

    var bridge = Zombie.EaselBridge.create({
      stage: new createjs.Stage($('#canvas').get(0))
    });

    var factory = Zombie.Factory.create({
      bridge: bridge
    });

    Zombie.addsPropertiesAndSets = function(x, a, b) {
      return function() {
        set(this, x, get(this, a) + get(this, b));
      }.observes(a, b);
    };

    var GraphShape = Zombie.Path.extend({
      parent: null,
      part: null,

      pathBinding: 'part.properties.path.path',

      parentShapePropertiesBinding: 'parent.properties.shape',
      shapePropertiesBinding: 'part.properties.shape',

      xDidChange: Zombie.addsPropertiesAndSets('x', 'parentShapeProperties.x', 'shapeProperties.x'),
      yDidChange: Zombie.addsPropertiesAndSets('y', 'parentShapeProperties.y', 'shapeProperties.y')
    });

    var Z = function() { return Zombie.Object.create.apply(Zombie.Object, arguments); };

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
          })
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
        shape: factory.createType(GraphShape, { 
          part: robot.head,
          parent: robot
        })
      }),

      body: robot.body.reopen({
        shape: factory.createType(GraphShape, { 
          part: robot.body,
          parent: robot
        })
      })
    });

    $(canvas).on("click", function(event) {
console.log(event);
      var square = Z({
        properties: Z({
          path: Zombie.PathTemplate.create({
            width: 100,
            height: 100,
            pathTemplate: 'M 0 0 L {{width}} 0 L 0 {{height}} L -{{width}} 0 L 0 -{{height}}'
          }).observes('width','height'),
          
          shape: Z({ 
            x: event.clientX, 
            y: event.clientY 
          })
        })
      });

      square.reopen({
        shape: factory.createType(GraphShape, { 
          part: square,
        })
      });

		  createjs.Tween.get(square.properties.shape,{loop:true})
		    .to({'x':event.clientX+Math.random()*100-50, 'y':300},500);
    });

		createjs.Tween.get(robot.properties.shape,{loop:true})
		  .to({'x':300,'y':300},10000);
    
		createjs.Tween.get(robot.head.properties.shape,{loop:true})
		  .to({'x':10},250)
      .to({'x':0},250)
      .to({'x':5},250);

    factory.createGameLoop().start();
  });
});
