define(['livingdead/object', 'livingdead/bridged'], function(LivingDeadObject, LivingDeadBridged) {
    var set = Ember.set, get = Ember.get;

    return LivingDeadObject.extend(LivingDeadBridged, {
        start: function() {
            get(this, 'bridge').addTickerListener(this);
        },

        tick: function() {
            get(this, 'bridge').updateStage();
        }
    });
});
