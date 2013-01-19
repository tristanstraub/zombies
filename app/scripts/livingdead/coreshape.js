define(['ember', 'livingdead/object', 'livingdead/bridged'], function(Ember, LivingDeadObject, LivingDeadBridged) {
  var set = Ember.set, get = Ember.get;

  return LivingDeadObject.extend(Ember.Copyable, LivingDeadBridged, {
    id: function() { return Ember.guidFor(this); }.property(),
    parent: null,

    x: 0,
    y: 0,
    scaleX: 1,
    scaleY: 1,

    getPropertyNames: function() {
      return ['x','y','scaleX','scaleY'];
    },

    getPropertyObserverNames: function() {
      return this.getPropertyNames();
    },

    init: function() {
      this.attachDrawingPropertyObserver();

      this._super.apply(this, arguments);
    },

    attachDrawingPropertyObserver: function() {
      var bindings = { };
      var self = this;
      this.getPropertyObserverNames().forEach(function(name) {
        bindings[name + 'DidChange'] = function() {
          self.draw();
        }.observes(name);
      });

      return this.reopen(bindings);
    },

    didBridgeChange: function() {
      this.draw(get(this, 'bridge'));
    }.observes('bridge'),

    copyProperties: function() {
      var names = this.getPropertyNames();
      var properties = {};
      names.forEach(function(name) {
        properties[name] = Ember.copy(get(this, name));
      }, this);

      return properties;
    },

    getContainedPoints: function() {
      return [];
    },

    createDelegate: function(deep) {
      return Ember.copy(this, deep);
    },

    createMirror: function() {
      var bindings = {
        inverseImage: this
      };

      this.getPropertyNames().forEach(function(name) {
        bindings[name + 'Binding'] = Ember.Binding.oneWay('inverseImage.' + name);
      });

      this.getPropertyObserverNames().forEach(function(name) {
        bindings[name + 'Binding'] = Ember.Binding.oneWay('inverseImage.' + name);
      });

      return this.constructor.create(bindings);
    },

    boxContainsPoint: function(x, y, w, h, x0, y0)  {
      return (x <= x0 && x0 <= x + w && y <= y0 && y0 <= y + h);
    },

    copy: Ember.K,

    draw: Ember.K,

    removeFromStage: Ember.K,

    addToStage: Ember.K,

    clear: Ember.K
  });
});
