define(['ember'], function(Ember) {
  var set = Ember.set, get = Ember.get;
  
  var Properties = Ember.Object.extend();

  Properties.reopenClass({
    propertyNames: function() {
      var names = Array.prototype.slice.apply(arguments);
      var getNames = function() {
        var all = [];
        all.pushObjects(this._super.apply(this));
        all.pushObjects(names);
        return all;
      };

      return getNames;
    }
  });

  return Properties;
});
