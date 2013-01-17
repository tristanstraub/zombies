require.config({
    shim: {
        'ember': {
            deps: ['jquery','handlebars'],
            exports: 'Ember'
        },

        'handlebars': {
            deps: ['jquery'],
            exports: 'Handlebars'
        },

        'easeljs': {
            exports: 'createjs'
        },

        'tweenjs': {
            exports: 'createjs'
        },

        'zombie/tweenjs-ember-plugin': {
            deps: ['tweenjs'],
            exports: 'createjs.TweenEmberPlugin'
        }
    },

    paths: {
        hm: 'vendor/hm',
        esprima: 'vendor/esprima',
        jquery: 'vendor/jquery.min',
        easeljs: 'vendor/easeljs-0.5.0.min',
        tweenjs: 'vendor/tweenjs-0.3.0.min',
        handlebars: 'vendor/handlebars-1.0.rc.1',
        ember: 'vendor/ember',
        'underscore':'vendor/underscore-min'
    }
});

require(['animator/animator'], function(Animator) {

});
