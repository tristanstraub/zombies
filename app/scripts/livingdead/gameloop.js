define(['livingdead/object'], function(LivingDeadObject) {
    var set = Ember.set, get = Ember.get;

    return LivingDeadObject.extend({
        start: function() {
            get(this, 'bridge').addTickerListener(this);
        },

        tick: function() {
            get(this, 'bridge').updateStage();
        }
    });
});
