define(['ember', 'zombie/path'], function(Ember, ZombiePath) {
  return ZombiePath.extend({
    parentShapePropertiesBinding: Ember.Binding.oneWay('parent.properties.shape'),

    pathPropertyBinding: Ember.Binding.oneWay('properties.path'),
    shapePropertiesBinding: Ember.Binding.oneWay('properties.shape'),

    pathBinding: Ember.Binding.oneWay('pathProperty.path')
  });
});
