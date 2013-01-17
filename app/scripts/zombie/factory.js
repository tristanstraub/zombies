define(['ember', 'zombie/object', 'zombie/gameloop', 'zombie/shape', 'zombie/path'], function(Ember, ZombieObject, ZombieGameLoop, ZombieShape, ZombiePath) {    
    var set = Ember.set, get = Ember.get;

    return Ember.Object.extend({
        bridge: null,

        createType: function(type, options) {
            options = options || {};
            return type.create({ bridge: get(this, 'bridge')}).setProperties(options);
        },

        createObject: function(options) {
            return this.createType(ZombieObject, options);
        },

        createGameLoop: function(options) {
            return this.createType(ZombieGameLoop, options);
        },

        createShape: function(options) {
            return this.createType(ZombieShape, options);
        },

        createPath: function(options) {
            return this.createType(ZombiePath, options);
        }
    });
});
