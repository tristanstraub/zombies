define(['ember', 'livingdead/livingdead'], function(Ember, LivingDead) {
  var set = Ember.set, get = Ember.get;

  return LivingDead.Object.extend({
    init: function() {
      this._super.apply(this, arguments);
      set(this, 'canvas', get(this, 'canvas').create());
    },

    canvas: LivingDead.Object.extend({
      view: function() {
        console.log(Ember.View.views[('main-canvas')]);
        return Ember.View.views[('main-canvas')];
      }.property(),

      createEventFromRelativeCoords: function(x, y) {
        var offset = get(this, 'view').$().offset();
        var event = {
          pageX: offset.left + x,
          pageY: offset.top + y
        };        
        return event;
      },

      mouseDown: function(x, y) {
        get(this, 'view').mouseDown(this.createEventFromRelativeCoords(x,y));
      },
      mouseMoveTo: function(x, y) {
        get(this, 'view').mouseMove(this.createEventFromRelativeCoords(x,y));
      },
      mouseUp: function(x, y) {
        get(this, 'view').mouseUp(this.createEventFromRelativeCoords(x,y));
      }
    })
  });
});