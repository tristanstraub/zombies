define(['zombie/object'], function(ZombieObject) {
    var set = Ember.set, get = Ember.get;

    return ZombieObject.extend({
        start: function() {
            get(this, 'bridge').addTickerListener(this);
        },

        tick: function() {
            get(this, 'bridge').updateStage();
        }
    });
});
