define(['ember'], function(Ember) {
    var set = Ember.set;
    var get = Ember.get;

    var stateProperty = Ember.computed(function(key) {
        var parent = get(this, 'parentState');
        if (parent) {
            return get(parent, key);
        }

        return null;
    }).property();

    return Ember.State.extend({
        isDragging: stateProperty,
        
        mouseDown: function(event) {},
        mouseUp: function(event) {},
        mouseMove: function(event) {},
        mouseEnter: function(event) {},
        mouseLeave: function(event) {},

        getOffsets: function(event) {
            var canvasView = event.context;

            var offset = canvasView.$().offset();
            var cx = event.pageX - offset.left;
            var cy = event.pageY - offset.top;

            return { offset: offset, cx: cx, cy: cy };
        }
    });
});
