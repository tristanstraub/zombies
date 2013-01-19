define(['ember', 'reanimator/canvas-view'], function(Ember, CanvasView) {
  var set = Ember.set, get = Ember.get;

  return CanvasView.extend({
    shape: Ember.computed(function(key, value, oldvalue) {
      if (arguments.length > 1) {
        if (value) {
          get(this, 'shapes').addObject(value.createMirror());
        } else if (oldvalue) {
          get(this, 'shapes').removeObject(oldvalue);
        }
      }

      return value;
    })
  });
});


