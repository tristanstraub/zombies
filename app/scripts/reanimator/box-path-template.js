define(['livingdead/livingdead'], function(LivingDead) {
    var pathTemplateProperty = function(name) {
        return function() {
            this.notifyPropertyChange('pathTemplate');    
        }.observes(name);
    };

    return LivingDead.PathTemplate.extend({
        copyProperties: LivingDead.Properties.propertyNames('width', 'height'),

        width: pathTemplateProperty('width'),
        height: pathTemplateProperty('height')
    });
});
