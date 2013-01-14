require.config({
  shim: {
    'ember': {
      deps: ['jquery','handlebars'],
      exports: 'Ember'
    },

    'handlebars': {
      deps: ['jquery'],
      exports: 'Handlebars'
    }
  },

  paths: {
    hm: 'vendor/hm',
    esprima: 'vendor/esprima',
    jquery: 'vendor/jquery.min',
    easeljs: 'easeljs-0.5.0.min',
    tweenjs: 'tweenjs-0.3.0.min',
    handlebars: 'handlebars-1.0.rc.1',
    ember: 'ember',
    path: 'path',
    zombie: 'zombie',
    'tweenjs-ember-plugin': 'tweenjs-ember-plugin',
    'underscore':'underscore-min'
  }
});

require(['zombies'], function(zombies) {

});
