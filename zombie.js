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

  shapeEncodePath: function(path, listener) {
    return encodePath(get(path, 'path'), listener);
  },

  shapeDecodePath: function(path) {
    var shape = get(path, 'shape');
    var graphics = shape.graphics;

    graphics.setStrokeStyle(1);
    graphics.beginStroke("#113355");
    graphics.decodePath(this.shapeEncodePath(path));
  },

  shapeDrawCircle: function(circle) {
    var radius = get(circle, 'radius');
    var shape = get(circle, 'shape');
    var graphics = shape.graphics;

    graphics.setStrokeStyle(1);
    graphics.beginStroke("#113355");
    graphics.drawCircle(0,0,radius);
  }
});

Zombie.Object = Ember.Object.extend({
  bridge: null,

  dump: function() {
    return Ember.inspect(this);
  }.property().volatile()
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

Zombie.copyProperties = function() {
  var names = Array.prototype.slice.apply(arguments);
  return function(properties) {
    this._super.call(this, properties);
    
    names.forEach(function(name) {
      properties[name] = Ember.copy(get(this, name));
    }, this);
  };
};

Zombie.Properties = Ember.Object.extend(Ember.Copyable, {
  copyProperties: Ember.K,

  copy: function() {
    var properties = {};
    this.copyProperties(properties);
    return this.constructor.create(properties);
  }
});

Zombie.shapePropertySetter = Ember.computed(function(key, value, oldvalue) {
  if (arguments.length > 1) {
    var shape = get(this, 'shape');
    shape[key] = value;
  }

  return value;
});

Zombie.NeedsProperties = Ember.Mixin.create({
  properties: null
});

Zombie.Shape = Zombie.Object.extend(Ember.Copyable, Zombie.NeedsProperties, {
  id: function() { return Ember.guidFor(this); }.property(),

  shape: function() {
    return new createjs.Shape();
  }.property(),

  getContainedPoints: Ember.K,

  x: Zombie.shapePropertySetter,
  y: Zombie.shapePropertySetter,
  scaleX: Zombie.shapePropertySetter,
  scaleY: Zombie.shapePropertySetter,

  xBinding: 'properties.shape.x',
  yBinding: 'properties.shape.y',

  draw: Ember.K,

  createDelegate: function(deep) {
    return Ember.copy(this, deep);
  },

  copy: function(deep) {
    if (deep) {
      properties = get(this, 'properties').copy(deep);
    } else {
      properties = get(this, 'properties');
    }

    return this.constructor.create({
      properties: properties
    });
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

  clear: function(bridge) {
    (bridge || get(this, 'bridge')).clearShape(this);
  }  
});

Zombie.Circle = Zombie.Shape.extend(Ember.Copyable, {
  radiusBinding: 'properties.circle.radius',

  draw: function(bridge) {
    bridge = bridge || get(this, 'bridge');

    this.clear(bridge);
    bridge.shapeDrawCircle(this);

  }.observes('radius')
});

Zombie.Path = Zombie.Shape.extend(Ember.Copyable, {
  pathBinding: 'properties.path',

  getContainedPoints: function(x,y,w,h) {
    var self = this;
    var points = [];

    var lastpoint = null;
    var traverseSegment = function(name, dx, dy) {
      dx/=10;
      dy/=10;

      var point = null;

      if (name === 'M') {
        point = [dx, dy];
      } else if (name === 'L') {
        point = [lastpoint[0] + dx, lastpoint[1] + dy];
      }

      if (self.boxContainsPoint(x,y,w,h, point[0] + get(self, 'x'), point[1] + get(self, 'y'))) {
        points.push(point);
      }
      lastpoint = point;
    };
    this.traversePath(traverseSegment);
    return points;
  },

  wedge: function(a, b) {
    return a[0]*b[1]-a[1]*b[0];
  },

  boxContainsPoint: function(x, y, w, h, x0, y0)  {
    return (x <= x0 && x0 <= x + w && y <= y0 && y0 <= y + h);
  },

  // boxContainsLine: function(x, y, w, h, lx0, ly0, lx1, ly1)  {
  //   // 1) poly on one side, or 2) one of two points inside poly 3) other of two points inside poly
  
  //   var sgn = function(x) { return x < 0 ? -1 : 1 };

  //   var x0=x, x1=x+w, x2=x+w, x3=x;
  //   var y0=y, y1=y,   y2=y+h, y2=y+h;

  //   // 2) lx0, ly0
  //   var s = sgn(wedge([lx1-lx0,ly1-lx0],[x-lx0, y-ly0]))
  //     +sgn(wedge([lx1-lx0,ly1-lx0],[w+x-lx0, h+y-ly0]))
  //     +sgn(wedge([lx1-lx0,ly1-lx0],[w+x-lx0, y-ly0]))
  //     +sgn(wedge([lx1-lx0,ly1-lx0],[x-lx0, h+y-ly0]));
  //   if (Math.abs(s) == 4)
  //     return true;

  //   // 3) lx1, ly1
  //   var s = sgn(wedge([x1-x0,y1-y0],[x-lx0, y-ly0]))
  //     +sgn(wedge([lx1-lx0,ly1-lx0],[w+x-lx0, h+y-ly0]))
  //     +sgn(wedge([lx1-lx0,ly1-lx0],[w+x-lx0, y-ly0]))
  //     +sgn(wedge([lx1-lx0,ly1-lx0],[x-lx0, h+y-ly0]));
  //   if (Math.abs(s) == 4)
  //     return true;

  //   // 1)
  //   var s = (wedge([lx1-lx0,ly1-lx0],[x-lx0, y-ly0]) < 0 ? -1 : 1)
  //     +(wedge([lx1-lx0,ly1-lx0],[w+x-lx0, h+y-ly0]) < 0 ? -1 : 1)
  //     +(wedge([lx1-lx0,ly1-lx0],[w+x-lx0, y-ly0]) < 0 ? -1 : 1)
  //     +(wedge([lx1-lx0,ly1-lx0],[x-lx0, h+y-ly0]) < 0 ? -1 : 1);
  //   return (Math.abs(s) !== 4);
  // },

  draw: function(bridge) {
    if (get(this, 'path')) {
      this.clear(bridge);
      (bridge || get(this, 'bridge')).shapeDecodePath(this);
    }
  },

  traversePath: function(listener) {
    get(this, 'bridge').shapeEncodePath(this, listener);
  },

  pathChanged: function() {
    this.draw(get(this, 'bridge'));
  }.observes('path')
});

Zombie.PathTemplate = Zombie.Properties.extend({
  copyProperties: Zombie.copyProperties('pathTemplate'),

  pathTemplate: '',

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

Zombie.PathTemplateProperty = function(name) {
  return function() {
    this.notifyPropertyChange('pathTemplate');    
  }.observes(name);
};
