define(['zombie'], function(Zombie) {
  return Zombie.PathTemplate.extend({
    copyProperties: Zombie.copyProperties('width', 'height'),

    width: Zombie.PathTemplateProperty('width'),
    height: Zombie.PathTemplateProperty('height')
  });
});
