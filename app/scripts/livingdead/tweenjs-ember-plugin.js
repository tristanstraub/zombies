/*
* TweenEmberPlugin
* Copyright (c) 2012 Tristan Straub.
*/

// namespace:
this.createjs = this.createjs||{};

(function() {
var TweenEmberPlugin = function() {
  throw("TweenEmberPlugin cannot be instantiated.")
};
	
// static interface:
	/**
	 * Used by TweenJS to determine when to call this plugin. Plugins with higher priority
	 * have their methods called before plugins with lower priority. The priority value
	 * can be any positive or negative number.
	 * @property priority
	 * @static
	 **/
	TweenEmberPlugin.priority = 0;

	/**
	 * Installs this plugin for use with TweenJS, and registers for a list of properties
	 * that this plugin will operate with. Call this once after TweenJS is loaded
	 * to enable this plugin.
	 * @method install
	 * @static
	 **/
	TweenEmberPlugin.install = function() {
		// this registers this plugin to work with the "test" property.
		createjs.Tween.installPlugin(TweenEmberPlugin, ['x','y','xScale','yScale']);
	};
	
	/**
	 * Called by TweenJS when a new tween property initializes that this plugin is
	 * registered for. Generally, the call to Plugin.init will be immediately followed by a
	 * call to Plugin.to.
	 * @method init
	 * @param {Tween} tween The related tween instance.
	 * @param {String} prop The name of the property that is being initialized.
	 * @param {any} value The current value of the property on the tween's target.
	 * @return {any} The starting tween value for the property. In most cases, you would simply
	 * return the value parameter, but some plugins may need to modify the starting value.
	 * @static
	 **/
	TweenEmberPlugin.init = function(tween, prop, value) {
		return value;
	};
	
	/**
	 * Called by TweenJS when a new step is added to a tween that includes a property the
	 * plugin is registered for (ie. a new "to" action is added to a tween).
	 * @method init
	 * @param {Tween} tween The related tween instance.
	 * @param {String} prop The name of the property being tweened.
	 * @param {any} startValue The value of the property at the beginning of the step. This will
	 * be the same as the init value if this is the first step, or the same as the
	 * endValue of the previous step if not.
	 * @param {Object} injectProps A generic object to which the plugin can append other properties which should be updated on this step.
	 * @param {any} endValue The value of the property at the end of the step.
	 * @static
	 **/
	TweenEmberPlugin.step = function(tween, prop, startValue, endValue, injectProps) {
	};
	
	/**
	 * Called when a tween property advances that this plugin is registered for.
	 * @method tween
	 * @param {Tween} tween The related tween instance.
	 * @param {String} prop The name of the property being tweened.
	 * @param {any} value The current tweened value of the property, as calculated by TweenJS.
	 * @param {Object} startValues A hash of all of the property values at the start of the current
	 * step. You could access the start value of the current property using
	 * startValues[prop].
	 * @param {Object} endValues A hash of all of the property values at the end of the current
	 * step.
	 * @param {Number} ratio A value indicating the eased progress through the current step. This
	 * number is generally between 0 and 1, though some eases will generate values outside
	 * this range.
	 * @param {Boolean} wait Indicates whether the current step is a "wait" step.
	 * @param {Boolean} end Indicates that the tween has reached the end.
	 * @return {any} Return the value that should be assigned to the target property. For example
	 * returning <code>Math.round(value)</code> would assign the default calculated value
	 * as an integer. Returning Tween.IGNORE will prevent Tween from assigning a value to
	 * the target property.
	 * @static
	 **/
	TweenEmberPlugin.tween = function(tween, prop, value, startValues, endValues, ratio, wait, end) {
		Ember.set(tween.target, prop, value);
    return createjs.Tween.IGNORE;
	};
	
createjs.TweenEmberPlugin = TweenEmberPlugin;
}());
