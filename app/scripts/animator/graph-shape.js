define(['ember','zombie','animator/animator'], function(ember, Zombie, Animator) {
  // Animator.addsPropertiesAndSet = function(coords, a, b) {
  //   return function() {
  //     var parent = get(this, a) || 0;
  //     var child = get(this, b) || 0;

  //     set(this, coords, get(this, a) + get(this, b));
  //   }.observes(a, b);
  // };

  Animator.GraphShape = Zombie.Path.extend({
    parentBinding: 'properties.parent',

    parentShapePropertiesBinding: Ember.Binding.oneWay('parent.properties.shape'),

    pathPropertyBinding: Ember.Binding.oneWay('properties.path'),
    shapePropertiesBinding: Ember.Binding.oneWay('properties.shape'),

    pathBinding: Ember.Binding.oneWay('pathProperty.path')
  });

  return Animator.GraphShape;
});
