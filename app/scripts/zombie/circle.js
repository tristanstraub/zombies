define(['ember', 'zombie/shape'], function(Ember, ZombieShape) {
    var set = Ember.set, get = Ember.get;

    return ZombieShape.extend({
        radiusBinding: 'properties.circle.radius',

        draw: function(bridge) {
            bridge = bridge || get(this, 'bridge');

            this.clear(bridge);
            bridge.shapeDrawCircle(this);

        }.observes('radius')
    });
});
