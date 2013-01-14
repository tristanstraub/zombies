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
