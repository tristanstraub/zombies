define(['jquery', 'handlebars', 'easeljs', 'tweenjs', 'ember', 'path', 'tweenjs-ember-plugin','underscore'], function() {
    Zombie = Ember.Namespace.create({toString:function(){return 'Zombie';}});

    var set = Ember.set, get = Ember.get;

    var boxContainsPoint = function(x, y, w, h, x0, y0)  {
        return (x <= x0 && x0 <= x + w && y <= y0 && y0 <= y + h);
    };


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
        },

        shapeDrawLine: function(line) {
            var edge = get(line, 'edge');
            var shape = get(line, 'shape');
            var graphics = shape.graphics;

            graphics.setStrokeStyle(1);
            graphics.beginStroke("#113355");
            var a = edge.objectAt(0);
            var b = edge.objectAt(1);
            graphics.moveTo(a.objectAt(0), a.objectAt(1));
            graphics.lineTo(b.objectAt(0), b.objectAt(1));
        },

        shapeDrawRectangle: function(rectangle) {
            var width = get(rectangle, 'width');
            var height = get(rectangle, 'height');
            var shape = get(rectangle, 'shape');
            var graphics = shape.graphics;

            graphics.setStrokeStyle(1);
            graphics.beginStroke("#113355");

            graphics.drawRect(0, 0, width, height);
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

        getContainedPoints: function() {
            return [];
        },

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

    Zombie.Circle = Zombie.Shape.extend({
        radiusBinding: 'properties.circle.radius',

        draw: function(bridge) {
            bridge = bridge || get(this, 'bridge');

            this.clear(bridge);
            bridge.shapeDrawCircle(this);

        }.observes('radius')
    });

    Zombie.Line = Zombie.Shape.extend({
        edgeBinding: 'properties.line.edge',

        draw: function(bridge) {
            bridge = bridge || get(this, 'bridge');
            if (get(this, 'edge')) {
                this.clear(bridge);
                bridge.shapeDrawLine(this);
            }
        },

        edgeChanged: function() {
            this.draw(get(this, 'bridge'));
        }.observes('edge.@each'),

        getContainedPoints: function(x,y,w,h) {
            var cx = get(this, 'x');
            var cy = get(this, 'y');

            return get(this, 'edge').map(function(point) {
                return [point.objectAt(0)+cx, point.objectAt(1)+cy];
            }).filter(function(point) {
                return boxContainsPoint(x,y,w,h, point.objectAt(0), point.objectAt(1));
            }).map(function(point, index) {
                return { point: point, index: index };
            });
        }
    });

    Zombie.Rectangle = Zombie.Shape.extend({
        width: 'properties.rectangle.width',
        height: 'properties.rectangle.height',

        draw: function(bridge) {
            bridge = bridge || get(this, 'bridge');
            this.clear(bridge);
            bridge.shapeDrawRectangle(this);
        },

        propertiesChanged: function() {
            this.draw(get(this, 'bridge'));
        }.observes('width', 'height'),

        getContainedPoints: function(x,y,w,h) {
            var cx = get(this, 'x');
            var cy = get(this, 'y');
            var width = get(this, 'width');
            var height = get(this, 'height');

            var points = [[0,0],[width, 0],[width,height],[0,height]];

            return points.filter(function(point) {
                return boxContainsPoint(x,y,w,h, cx + point.objectAt(0), cy + point.objectAt(1));
            }).map(function(point, index) {
                return { point: point, index: index };
            });
        }
    });

    // Zombie.PolyLine = Zombie.Shape.extend({
    //   pointsBinding: 'properties.polyline.points',

    //   draw: function(bridge) {
    //     bridge = bridge || get(this, 'bridge');
    //     if (get(this, 'path')) {
    //       this.clear(bridge);
    //       ((this);
    //     }
    //   },
    // });

    Zombie.Path = Zombie.Shape.extend({
        pathBinding: 'properties.path',

        getContainedPoints: function(x,y,w,h) {
            var self = this;
            var points = [];

            var lastpoint = null;
            var traverseSegment = function(index, name, dx, dy) {
                dx/=10;
                dy/=10;

                var point = null;

                if (name === 'M') {
                    point = [dx, dy];
                } else if (name === 'L') {
                    point = [lastpoint[0] + dx, lastpoint[1] + dy];
                }

                if (boxContainsPoint(x,y,w,h, point[0] + get(self, 'x'), point[1] + get(self, 'y'))) {
                    points.push({ point: point, index: index });
                }
                lastpoint = point;
            };
            this.traversePath(traverseSegment);
            return points;
        },

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

    var Z = function() { return Zombie.Object.create.apply(Zombie.Object, arguments); };
    var P = function() { return Zombie.Properties.create.apply(Zombie.Properties, arguments); };

    Zombie.Z = Z;
    Zombie.P = P;

    return Zombie;
});
