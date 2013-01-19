define(['ember'], function(Ember) {
  var set = Ember.set, get = Ember.get;

  return Ember.Object.extend({
    init: function(properties) {
      this._super.apply(this, arguments);

      if (properties) {
        this.setProperties(properties);
      }
    },

    dump: function() {
      return Ember.inspect(this);
    }.property().volatile()
  });
});
