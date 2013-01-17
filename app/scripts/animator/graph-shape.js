define(['ember', 'zombie/path'], function(Ember, ZombiePath) {
  // Animator.addsPropertiesAndSet = function(coords, a, b) {
  //   return function() {
  //     var parent = get(this, a) || 0;
  //     var child = get(this, b) || 0;

  //     set(this, coords, get(this, a) + get(this, b));
  //   }.observes(a, b);
  // };

  return ZombiePath.extend({
    parentBinding: 'properties.parent',

    parentShapePropertiesBinding: Ember.Binding.oneWay('parent.properties.shape'),

    pathPropertyBinding: Ember.Binding.oneWay('properties.path'),
    shapePropertiesBinding: Ember.Binding.oneWay('properties.shape'),

    pathBinding: Ember.Binding.oneWay('pathProperty.path')
  });
});
