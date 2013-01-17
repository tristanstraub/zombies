define(['ember', 'animator/mouse-state', 'animator/mouse-state-manager/state.tool.edit', 'animator/mouse-state-manager/state.tool.pencil', 'animator/mouse-state-manager/state.tool.select', 'animator/mouse-state-manager/state.tool.boxselect', 'animator/mouse-state-manager/state.tool.brush'], function(Ember, MouseState, StateToolEdit, StateToolPencil, StateToolSelect, StateToolBoxSelect, StateToolBrush) {

    var set = Ember.set;
    var get = Ember.get;

    var Z = Zombie.Z;
    var P = Zombie.P;

    var MouseStateManager = Ember.StateManager.extend({
        //    enableLogging: true,
        initialState: 'idle',

        highlightedShapes: [],

        highlightedPoints: [],
        
        previousHighlightedPoints: [],

        states: {
            idle: MouseState.create({
                mouseDown: function(manager, event) {
                    manager.send('highlightShapesAndPoints', event);

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
                    manager.send('highlightShapesAndPoints', event);
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
                    b.forEach(function(point) {
                        a.pushObject(point);
                    })
                    return a;
                }, []);

                shapes = shapesPoints.mapProperty('shape');
            }

            this.highlightShapes(canvasView, shapes);
            this.highlightPoints(canvasView, points);
        },

        highlightShapes: function(canvasView, shapes) {
            set(this, 'highlightedShapes', shapes.mapProperty('brush'));
        },

        highlightPoints: function(canvasView, points) {
            var ps = get(this, 'previousHighlightedPoints');
            ps.forEach(function(shape) {
                canvasView.removeShape(shape);
            });

            pointShapes = points.map(function(point) {
                var shape = Zombie.Circle.create({
                    properties: P({
                        shape: P({
                            x: point[0], y: point[1]
                        }),
                        circle: P({
                            radius: 2
                        })
                    })
                });

                canvasView.addShapeToStage(shape);
                return shape;
            });

            set(this, 'previousHighlightedPoints', pointShapes);
        }
    });

    return MouseStateManager;
});

