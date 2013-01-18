define(['ember', 'livingdead/path'], function(Ember, LivingDeadPath) {
  return LivingDeadPath.extend({
    parentShapePropertiesBinding: Ember.Binding.oneWay('parent.properties.shape'),

    pathPropertyBinding: Ember.Binding.oneWay('properties.path'),
    shapePropertiesBinding: Ember.Binding.oneWay('properties.shape'),

    pathBinding: Ember.Binding.oneWay('pathProperty.path')
  });
});
