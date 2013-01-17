define(['ember', 'zombie/object'], function(Ember, ZombieObject) {
    var set = Ember.set, get = Ember.get;

    return ZombieObject.extend(Ember.Copyable, {
        id: function() { return Ember.guidFor(this); }.property(),
        properties: null,

        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,

        getContainedPoints: function() {
            return [];
        },

        createDelegate: function(deep) {
            return Ember.copy(this, deep);
        },

        boxContainsPoint: function(x, y, w, h, x0, y0)  {
            return (x <= x0 && x0 <= x + w && y <= y0 && y0 <= y + h);
        },

        copy: Ember.K,

        draw: Ember.K,

        removeFromStage: Ember.K,

        addToStage: Ember.K,

        clear: Ember.K,
    });
});
