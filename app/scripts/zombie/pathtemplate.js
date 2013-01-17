define(['handlebars', 'zombie/properties'], function(Handlebars, ZombieProperties) {
    var set = Ember.set, get = Ember.get;

    return ZombieProperties.extend({
        copyProperties: ZombieProperties.copyProperties('pathTemplate'),

        pathTemplate: '',

        compiledPathTemplate: function() {
            return Handlebars.compile(get(this, 'pathTemplate'));
        }.property('pathTemplate'),

        path: function() { 
            return get(this, 'compiledPathTemplate')(this);
        }.property('compiledPathTemplate'),

        observes: function() {
            var properties = Array.prototype.slice.apply(arguments);
            var notify = function() {
                this.notifyPropertyChange('pathTemplate');
            };
            properties.forEach(function(property) {
                this.addObserver(property, notify);
            }, this);
            return this;
        }
    });
});
