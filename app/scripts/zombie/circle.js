define(['ember', 'zombie/shape', 'zombie/properties'], function(Ember, ZombieShape, ZombieProperties) {
    var set = Ember.set, get = Ember.get;

    return ZombieShape.extend({
        copyProperties: ZombieProperties.copyProperties('radius'),

        radius: 0,

        draw: function(bridge) {
            bridge = bridge || get(this, 'bridge');

            this.clear(bridge);
            bridge.shapeDrawCircle(this);

        }.observes('radius')
    });
});
