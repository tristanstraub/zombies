define(['ember', 'zombie', 'animator/mouse-state'], function(Ember, Zombie, MouseState) {
    var set = Ember.set;
    var get = Ember.get;

    var Z = Zombie.Z;
    var P = Zombie.P;

    var distance = function(a,b) {
        var dx = a.objectAt(0)-b.objectAt(0);
        var dy = a.objectAt(1)-b.objectAt(1);
        return Math.sqrt(dx*dx+dy*dy);
    };

    var getFirstNearestLineEndPoint = function(canvasView, cx, cy, shape) {
        var shapesPoints = canvasView.shapesAtPoint(cx, cy);

        if (shapesPoints.length > 0) {
            var lines = shapesPoints.filter(function(shapePoint) {
                return Zombie.Line.detectInstance(shapePoint.shape);
            });

            if (lines.length > 0) {
                var point = shapesPoints.filter(function(sh) { 
                    return (sh.shape !== shape);
                }).mapProperty('points').reduce(function(a,b) {
                    a.pushObjects(b);
                    return a;
                }, []).reduce(function(a, b) {
                    if (!a)
                        return b;

                    var d1 = distance(a, [cx, cy]);
                    var d2 = distance(b, [cx, cy]);
                    
                    if (d1 <= d2) {
                        return a;
                    } else {
                        return b;
                    }
                }, null);

                return point;
            }
        }
    };

    return MouseState.extend({    
        down: MouseState.extend({
            setup: function(manager, event) {
                var canvasView = event.context;

                var offsets = this.getOffsets(event);

                var startPoint = getFirstNearestLineEndPoint(canvasView, offsets.cx, offsets.cy);
                if (!startPoint) {
                    startPoint = [offsets.cx,offsets.cy];
                }

                var line = Zombie.Line.create({
                    properties: P({
                        line: P({
                            edge: [Ember.copy(startPoint),[offsets.cx,offsets.cy]]
                        }),
                        shape: P({
                            x: 0,
                            y: 0
                        })
                    })
                });

                canvasView.addShapeToStage(line);

                manager.transitionTo('drawing', { line: line, cx: offsets.cx, cy: offsets.cy });
            },

            mouseUp: function(manager, event) {
                manager.transitionTo('idle');
            }
        }),

        drawing: MouseState.extend({
            context: null,

            setup: function(manager, context) {
                set(this, 'context', context);
            },

            mouseMove: function(manager, event) {
                var canvasView = event.context;
                var offsets = this.getOffsets(event);

                var edge = get(this, 'context.line.edge');

                edge.replace(1, 1, [[offsets.cx, offsets.cy]]);

                manager.send('highlightShapesAndPoints', event);
            },

            mouseUp: function(manager, event) {
                var canvasView = event.context;
                var offsets = this.getOffsets(event);

                var edge = get(this, 'context.line.edge');
                var endPoint = getFirstNearestLineEndPoint(canvasView, offsets.cx, offsets.cy, get(this, 'context.line'));
                if (!endPoint) {
                    endPoint = [offsets.cx,offsets.cy];
                }

                edge.replace(1, 1, [Ember.copy(endPoint)]);

                canvasView.addShape(get(this, 'context.line'));

                manager.send('highlightShapesAndPoints', event);
                manager.transitionTo('idle');
            }
        })
    });
});



