define(['ember', 'livingdead/soul'], function(Ember, LivingDeadSoul) {
  var set = Ember.set, get = Ember.get;

  return Ember.Object.extend(LivingDeadSoul, {
    dump: function() {
      return Ember.inspect(this);
    }.property().volatile()
  });
});
