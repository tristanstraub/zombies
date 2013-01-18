define(['ember', 'reanimator/canvas-view'], function(Ember, CanvasView) {
  var set = Ember.set, get = Ember.get;

  return CanvasView.extend({
    shape: null,
    didInsertElement: function() {
      this._super.apply(this, arguments);
      this.addShape(get(this, 'shape').createDelegate());
    }
  });
});


