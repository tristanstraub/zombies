define(['ember', 'animator/mouse-state', 'animator/mouse-state-manager/state.tool.edit', 'animator/mouse-state-manager/state.tool.pencil', 'animator/mouse-state-manager/state.tool.select', 'animator/mouse-state-manager/state.tool.boxselect', 'animator/mouse-state-manager/state.tool.brush', 'animator/highlighter'], function(Ember, MouseState, StateToolEdit, StateToolPencil, StateToolSelect, StateToolBoxSelect, StateToolBrush, Highlighter) {

    var set = Ember.set;
    var get = Ember.get;

    var Z = Zombie.Z;
    var P = Zombie.P;

    var MouseStateManager = Ember.StateManager.extend({
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
                },

                mouseMove: function(manager, event) {

                }
            }),

            tool: MouseState.create({
                pencil: StateToolPencil.create(),
                edit: StateToolEdit.create(),
                select: StateToolSelect.create(),
                brush: StateToolBrush.create(),
                boxselect: StateToolBoxSelect.create()
            })
        },

        highlightShapesAndPoints: function(manager, event) {
            var canvasView = event.context;
            
            var offset = canvasView.$().offset();
            var px = event.pageX - offset.left;
            var py = event.pageY - offset.top;
            var shapesPoints = canvasView.shapesAtPoint(px, py);

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
            var points = canvasView.getContainedShapesPoints(x,y,width,height)
                .mapProperty('points')
                .reduce(function(a,b) {
                    a.pushObject(b);
                    return b;
                }, []);
            get(this, 'rectangleHighlighter').highlightPoints(canvasView, points);
        }
    });

    return MouseStateManager;
});

