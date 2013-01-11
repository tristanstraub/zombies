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
  bridge: null
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
    get(this, 'bridge').setShapeProperty(this, key, value);
  }

  return value;
});

Zombie.Shape = Zombie.Object.extend({
  shape: null,

  x: Zombie.shapePropertySetter,
  y: Zombie.shapePropertySetter,
  scaleX: Zombie.shapePropertySetter,
  scaleY: Zombie.shapePropertySetter,

  init: function() {
    this._super.apply(this, arguments);
    set(this, 'shape', new createjs.Shape());
    
    get(this, 'bridge').addShapeToStage(this);
  },

  clear: function() {
    get(this, 'bridge').clearShape(this);
  }  
});

Zombie.Path = Zombie.Shape.extend({
  path: null,

  didPathChange: function() {
    if (get(this, 'path')) {
      this.clear();
      get(this, 'bridge').shapeDecodePath(this);
    }
  }.observes('path')
});

Zombie.PathTemplate = Zombie.Object.extend({
  pathTemplate: '',

  compiledPathTemplate: function() {
    return Handlebars.compile(get(this, 'pathTemplate'));
  }.property('pathTemplate'),

  path: function() { 
    console.log('change');
    console.log(get(this, 'compiledPathTemplate')(this));
    return get(this, 'compiledPathTemplate')(this);
  }.property('compiledPathTemplate'),

  observes: function() {
    var properties = Array.prototype.slice.apply(arguments);
    var notify = function() {
      console.log('something chnged');
      this.notifyPropertyChange('pathTemplate');
    };
    properties.forEach(function(property) {
      this.addObserver(property, notify);
    }, this);
    return this;
  }
});

