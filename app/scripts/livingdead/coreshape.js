define(['ember', 'livingdead/object', 'livingdead/bridged'], function(Ember, LivingDeadObject, LivingDeadBridged) {
  var set = Ember.set, get = Ember.get;

  var propertyAdder = function(aname, bname) {
    return function() {
      var a = get(this, aname) || 0;
      var b = get(this, bname) || 0;
      return a + b;
    }.property(aname, bname);
  };

  var propertyMultiplier = function(aname, bname) {
    return function() {
      var a = get(this, aname) || 1;
      var b = get(this, bname) || 1;
      return a * b;
    }.observes(aname, bname);
  };

  var shapeSetter = function(toName, fromName) {
    return function() {
      var shape = get(this, 'shape');
      if (shape) {
        shape[toName] = get(this, fromName);
      }
    }.observes(fromName);
  };

  return LivingDeadObject.extend(Ember.Copyable, LivingDeadBridged, {
    id: function() { return Ember.guidFor(this); }.property(),
    parent: null,

    x: 0,
    y: 0,
    scaleX: 1,
    scaleY: 1,

    realX: propertyAdder('x', 'parent.realX'),
    realY: propertyAdder('y', 'parent.realY'),
    realScaleX: propertyMultiplier('scaleX', 'parent.realScaleX'),
    realScaleY: propertyMultiplier('scaleY', 'parent.realScaleY'),

    xChanged: shapeSetter('x','realX'),
    yChanged: shapeSetter('y','realY'),
    scaleXChanged: shapeSetter('scaleX','realScaleX'),
    scaleYChanged: shapeSetter('scaleY','realScaleY'),

    getPropertyNames: function() {
      return ['x','y','scaleX','scaleY'];
    },

    getPropertyObserverNames: function() {
      return [];
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
