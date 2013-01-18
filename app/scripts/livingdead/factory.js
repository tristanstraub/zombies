define(['ember', 'livingdead/object', 'livingdead/gameloop', 'livingdead/shape', 'livingdead/path'], function(Ember, LivingDeadObject, LivingDeadGameLoop, LivingDeadShape, LivingDeadPath) {    
    var set = Ember.set, get = Ember.get;

    return Ember.Object.extend({
        bridge: null,

        createType: function(type, options) {
            options = options || {};
            return type.create({ bridge: get(this, 'bridge')}).setProperties(options);
        },

        createObject: function(options) {
            return this.createType(LivingDeadObject, options);
        },

        createGameLoop: function(options) {
            return this.createType(LivingDeadGameLoop, options);
        },

        createShape: function(options) {
            return this.createType(LivingDeadShape, options);
        },

        createPath: function(options) {
            return this.createType(LivingDeadPath, options);
        }
    });
});
