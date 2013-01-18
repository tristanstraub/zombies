define(['ember'], function(Ember) {
  return Ember.View.extend({
    layout: Ember.Handlebars.compile('{{yield}}'),
	  templateName: 'timeline'
  });
});
