define(['zombie/easel-bridge', 'zombie/object', 'zombie/factory', 'zombie/gameloop', 'zombie/properties', 'zombie/shape', 'zombie/circle', 'zombie/line', 'zombie/rectangle', 'zombie/path', 'zombie/pathtemplate', 'zombie/group'], function(EaselBridge, Object, Factory, GameLoop, Properties, Shape, Circle, Line, Rectangle, Path, PathTemplate, Group) {
    var set = Ember.set, get = Ember.get;
    var Zombie = Ember.Namespace.create({toString:function(){return 'Zombie';}});

    Zombie.EaselBridge = EaselBridge;
    Zombie.Object = Object;
    Zombie.Factory = Factory;
    Zombie.GameLoop = GameLoop;
    Zombie.Properties = Properties;
    Zombie.Shape = Shape;
    Zombie.Circle = Circle;
    Zombie.Line = Line;
    Zombie.Rectangle = Rectangle;
    Zombie.Path = Path;
    Zombie.PathTemplate = PathTemplate;
    Zombie.Group = Group;

    Zombie.Z = function() { return Zombie.Object.create.apply(Zombie.Object, arguments); };
    Zombie.P = function() { return Zombie.Properties.create.apply(Zombie.Properties, arguments); };

    return Zombie;
});
