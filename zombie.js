Zombie = Ember.Namespace.create({toString:function(){return 'Zombie';}});

var set = Ember.set, get = Ember.get;

Zombie.EaselBridge = Ember.Object.extend({
  stage: null,

  updateStage: function() {
    var stage = get(this, 'stage');
    stage.update();
  },

  addTickerListener: function(listener) {
		createjs.Ticker.addListener(function() { listener.tick(); });
  },

  removeShapeFromStage: function(shape) {
    var stage = get(this, 'stage');
    stage.removeChild(get(shape, 'shape'));
  },

  addShapeToStage: function(shape) {
    var stage = get(this, 'stage');
    stage.addChild(get(shape, 'shape'));
  },

  clearShape: function(shape) {
    get(shape, 'shape').graphics.clear();
  },

  setShapeProperty: function(shape, key, value) {
    shape = get(shape, 'shape');
    if (shape) {
      shape[key] = value;
    }
  },

  shapeDecodePath: function(path) {
    var rendered = get(path, 'path');
    var shape = get(path, 'shape');
    var graphics = shape.graphics;

    graphics.setStrokeStyle(1);
    graphics.beginStroke("#113355");
    graphics.decodePath(encodePath(rendered));
  }
});

Zombie.Object = Ember.Object.extend({
  bridge: null,

  // createPropertyDelegates: function(names) {
  //   names.forEach(function(name) {
  //     var value = get(this, name);
  //     if (Zombie.Object.detectInstance(value)) {
  //       var delegate = value.createDelegate();
  //       set(this, name, delegate);
  //     }
  //   }, this);
  // },

  // init: function() {
  //   this._super.apply(this, arguments);

  //   if (get(this, 'isDelegate')) {
  //     Ember.beginPropertyChanges();

  //     this.createPropertyDelegates([]);

  //     Ember.endPropertyChanges();
  //   }
  // },

  createDelegate: function() {
    return Ember.copy(this);
  }
});

Zombie.Factory = Ember.Object.extend({
  bridge: null,

  createType: function(type, options) {
    options = options || {};
    return type.create({ bridge: get(this, 'bridge')}).setProperties(options);
  },

  createObject: function(options) {
    return this.createType(Zombie.Object, options);
  },

  createGameLoop: function(options) {
    return this.createType(Zombie.GameLoop, options);
  },

  createShape: function(options) {
    return this.createType(Zombie.Shape, options);
  },

  createPath: function(options) {
    return this.createType(Zombie.Path, options);
  }
});

Zombie.GameLoop = Zombie.Object.extend({
  start: function() {
    get(this, 'bridge').addTickerListener(this);
  },

  tick: function() {
    get(this, 'bridge').updateStage();
  }
});

Zombie.shapePropertySetter = Ember.computed(function(key, value, oldvalue) {
  if (arguments.length > 1) {
    var shape = get(this, 'shape');
    if (shape) {
      shape[key] = value;
    }
  }

  return value;
});

Zombie.Shape = Zombie.Object.extend({
  shape: null,

  x: Zombie.shapePropertySetter,
  y: Zombie.shapePropertySetter,
  scaleX: Zombie.shapePropertySetter,
  scaleY: Zombie.shapePropertySetter,

  draw: Ember.K,

  init: function() {
    this._super.apply(this, arguments);
    set(this, 'shape', new createjs.Shape());
  },

  removeFromStage: function(bridge) {
    bridge = bridge || get(this, 'bridge');
    set(this, 'bridge', bridge);

    bridge.removeShapeFromStage(this);
  },

  addToStage: function(bridge) {
    bridge = bridge || get(this, 'bridge');
    set(this, 'bridge', bridge);

    this.draw(bridge);
    bridge.addShapeToStage(this);
  },

  removeFromStage: Ember.K,

  clear: function(bridge) {
    (bridge || get(this, 'bridge')).clearShape(this);
  }  
});

Zombie.Path = Zombie.Shape.extend(Ember.Copyable, {
  path: null,

  copy: function(deep) {
    return Zombie.Path.create({
      path: get(this, 'path')
    });
  },

  // createPropertyDelegates: function(names) {
  //   names.addObject('pathTemplate');
  //   this._super.apply(this, arguments);
  // },

  draw: function(bridge) {
    if (get(this, 'path')) {
      this.clear(bridge);
      (bridge || get(this, 'bridge')).shapeDecodePath(this);
    }
  },

  pathChanged: function() {
    this.draw();
  }.observes('path')
});

Zombie.PathTemplate = Zombie.Object.extend({
  pathTemplate: '',

  // createPropertyDelegates: function(names) {
  //   names.addObject('pathTemplate');
  //   this._super.apply(this, arguments);
  // },

  compiledPathTemplate: function() {
    return Handlebars.compile(get(this, 'pathTemplate'));
  }.property('pathTemplate'),

  path: function() { 
    return get(this, 'compiledPathTemplate')(this);
  }.property('compiledPathTemplate'),

  observes: function() {
    var properties = Array.prototype.slice.apply(arguments);
    var notify = function() {
      this.notifyPropertyChange('pathTemplate');
    };
    properties.forEach(function(property) {
      this.addObserver(property, notify);
    }, this);
    return this;
  }
});

