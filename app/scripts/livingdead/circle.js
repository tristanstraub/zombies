define(['ember', 'livingdead/shape', 'livingdead/properties'], function(Ember, LivingDeadShape, LivingDeadProperties) {
    var set = Ember.set, get = Ember.get;

    return LivingDeadShape.extend({
        copyProperties: LivingDeadProperties.copyProperties('radius'),

        radius: 0,

        draw: function(bridge) {
            bridge = bridge || get(this, 'bridge');

            this.clear(bridge);
            bridge.shapeDrawCircle(this);

        }.observes('radius')
    });
});
