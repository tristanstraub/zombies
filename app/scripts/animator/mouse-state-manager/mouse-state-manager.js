define(['ember', 'animator/mouse-state-manager/mouse-state', 'animator/highlighter', 'animator/mouse-state-manager/state.tool'], function(Ember, MouseState, Highlighter, StateTool) {
    var set = Ember.set, get = Ember.get;

    return Ember.StateManager.extend({
        //    enableLogging: true,
        initialState: 'idle',

        highlightedShapes: null,

        rectangleHighlighter: null,
        cursorHighlighter: null,

        init: function() {
            this._super.apply(this, arguments);

            set(this, 'highlightedShapes', []);
            set(this, 'rectangleHighlighter', Highlighter.create());
            set(this, 'cursorHighlighter', Highlighter.create());
        },

        getOffsets: function(event) {
            var canvasView = event.context;

            var offset = canvasView.$().offset();
            var cx = event.pageX - offset.left;
            var cy = event.pageY - offset.top;

            return { offset: offset, cx: cx, cy: cy };
        },

        states: {
            idle: MouseState.create({
                mouseDown: function(manager, event) {
                    var canvasView = event.context;
                    var tool = get(canvasView, 'tool');
                    if (tool === 'pencil') {
                        manager.transitionTo('tool.pencil.down', event);
                    } else if (tool === 'edit') {
                        manager.transitionTo('tool.edit.down', event);
                    } else if (tool === 'boxselect') {
                        manager.transitionTo('tool.boxselect.down', event);
                    } else if (tool === 'select') {
                        manager.transitionTo('tool.select.down', event);
                    } else if (tool === 'brush') {
                        manager.transitionTo('tool.brush.down', event);
                    }
                }
            }),

            tool: StateTool.create()
        },

        highlightShapesAndPoints: function(manager, event) {
            var canvasView = event.context;
          
            var offsets = manager.getOffsets(event);
            var shapesPoints = canvasView.shapesAtPoint(offsets.cx, offsets.cy);

            var shapes = [];
            var points = [];

            if (shapesPoints.length > 0) {
                var id = Ember.guidFor({});

                points = shapesPoints.map(function(data) { 
                    var points = data.points;

                    return points.map(function(point) {
                        return [point[0], point[1]];
                    });
                }).reduce(function(a,b) { 
                    a.pushObjects(b);
                    return a;
                }, []);

                shapes = shapesPoints.mapProperty('shape');
            }

            this.highlightShapes(canvasView, shapes);
            get(this, 'cursorHighlighter').highlightPoints(canvasView, points);
        },

        highlightShapes: function(canvasView, shapes) {
            set(this, 'highlightedShapes', shapes.mapProperty('brush'));
        },

        highlightPointsInRectangle: function(manager, canvasView, x, y, width, height) {
            var shapesPoints = canvasView.getContainedShapesPoints(x,y,width,height);
            var points = shapesPoints
                .mapProperty('points')
                .reduce(function(a,b) {
                    a.pushObjects(b);
                    return a;
                }, []);
            get(this, 'rectangleHighlighter').highlightPoints(canvasView, points);
        }
    });
});

