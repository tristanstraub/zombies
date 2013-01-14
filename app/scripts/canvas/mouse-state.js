define(['ember'], function() {
  var stateProperty = Ember.computed(function(key) {
    var parent = get(this, 'parentState');
    if (parent) {
      return get(parent, key);
    }
  }).property();

  return Ember.State.extend({
    isDragging: stateProperty,
    
    mouseDown: function(event) {},
    mouseUp: function(event) {},
    mouseMove: function(event) {},
    mouseEnter: function(event) {},
    mouseLeave: function(event) {}
  });
});
