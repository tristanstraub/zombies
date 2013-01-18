define(['ember'], function(Ember) {
    return Ember.Object.extend({
        bridge: null,

        dump: function() {
            return Ember.inspect(this);
        }.property().volatile()
    });
});
