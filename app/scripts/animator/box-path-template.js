define(['zombie/zombie'], function(Zombie) {
    var pathTemplateProperty = function(name) {
        return function() {
            this.notifyPropertyChange('pathTemplate');    
        }.observes(name);
    };

    return Zombie.PathTemplate.extend({
        copyProperties: Zombie.Properties.copyProperties('width', 'height'),

        width: pathTemplateProperty('width'),
        height: pathTemplateProperty('height')
    });
});
