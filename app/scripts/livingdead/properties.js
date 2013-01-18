define(['ember'], function(Ember) {
    var Properties = Ember.Object.extend();

    Properties.reopenClass({
        copyProperties: function() {
            var names = Array.prototype.slice.apply(arguments);
            return function(deep, properties) {
                properties = this._super.call(this, properties);
                
                names.forEach(function(name) {
                    properties[name] = Ember.copy(get(this, name));
                }, this);
                return properties;
            };
        }
    });

    return Properties;
});
