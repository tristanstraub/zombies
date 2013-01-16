define(['ember', 'animator', 'canvas/canvas-view'], function(ember, Animator, CanvasView) {
  var set = Ember.set;
  var get = Ember.get;

  Animator.ShapeView = CanvasView.extend({
    shape: null,
    didInsertElement: function() {
      this._super.apply(this, arguments);
      this.addShape(get(this, 'shape'));
    }
  });
});


