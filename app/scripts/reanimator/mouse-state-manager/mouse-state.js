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

    var mouse_event_after = function(manager, event) {
        manager.send('highlightShapesAndPoints', event);
    };

    return Ember.State.extend({
        isDragging: stateProperty,

        mouseDown: function(manager, event) {},
        mouseUp: function(manager, event) {},
        mouseMove: function(manager, event) {},
        mouseEnter: function(manager, event) {},
        mouseLeave: function(manager, event) {},

        mouseDown_after: mouse_event_after,
        mouseUp_after: mouse_event_after,
        mouseMove_after: mouse_event_after,
        mouseEnter_after: mouse_event_after,
        mouseLeave_after: mouse_event_after
    });
});
