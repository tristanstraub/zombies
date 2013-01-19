define(['easeljs', 'ember', 'livingdead/object'], function(createjs, Ember, LivingDeadObject) {
    var set = Ember.set, get = Ember.get;

    return LivingDeadObject.extend({
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
});
