define(['ember', 'canvas/mouse-state'], function(Ember, MouseState) {
  var set = Ember.set;
  var get = Ember.get;

  return MouseState.extend({
    down: MouseState.create({})
  });
});

