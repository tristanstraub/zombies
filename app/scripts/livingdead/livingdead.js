define(['livingdead/easel-bridge', 'livingdead/object', 'livingdead/factory', 'livingdead/gameloop', 'livingdead/properties', 'livingdead/coreshape', 'livingdead/shape', 'livingdead/circle', 'livingdead/line', 'livingdead/rectangle', 'livingdead/path', 'livingdead/pathtemplate', 'livingdead/group'], function(EaselBridge, Object, Factory, GameLoop, Properties, CoreShape, Shape, Circle, Line, Rectangle, Path, PathTemplate, Group) {
    var set = Ember.set, get = Ember.get;
    var LivingDead = Ember.Namespace.create({toString:function(){return 'LivingDead';}});

    LivingDead.EaselBridge = EaselBridge;
    LivingDead.Object = Object;
    LivingDead.Factory = Factory;
    LivingDead.GameLoop = GameLoop;
    LivingDead.Properties = Properties;
    LivingDead.CoreShape = CoreShape;
    LivingDead.Shape = Shape;
    LivingDead.Circle = Circle;
    LivingDead.Line = Line;
    LivingDead.Rectangle = Rectangle;
    LivingDead.Path = Path;
    LivingDead.PathTemplate = PathTemplate;
    LivingDead.Group = Group;

    LivingDead.Z = function() { return LivingDead.Object.create.apply(LivingDead.Object, arguments); };
    LivingDead.P = function() { return LivingDead.Properties.create.apply(LivingDead.Properties, arguments); };

    return LivingDead;
});
