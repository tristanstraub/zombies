define(['ember', 'livingdead/object'], function(Ember, LivingDeadObject) {
  var set = Ember.set, get = Ember.get;
  
  var Properties = LivingDeadObject.extend();

  var recursiveNames = function() {
      var names = Array.prototype.slice.apply(arguments);
      var getNames = function() {
        var all = [];
        all.pushObjects(this._super.apply(this));
        all.pushObjects(names);
        return all;
      };

      return getNames;
    };

  Properties.reopenClass({
    propertyNames: recursiveNames,
    propertyObserverNames: recursiveNames
  });

  return Properties;
});
