define(['ember'], function(Ember) {
    var Properties = Ember.Object.extend(Ember.Copyable, {
        copyProperties: Ember.K,

        copy: function() {
            var properties = {};
            this.copyProperties(properties);
            return this.constructor.create(properties);
        }
    });

    Properties.reopenClass({
        copyProperties: function() {
            var names = Array.prototype.slice.apply(arguments);
            return function(properties) {
                this._super.call(this, properties);
                
                names.forEach(function(name) {
                    properties[name] = Ember.copy(get(this, name));
                }, this);
            };
        }
    });

    return Properties;
});
