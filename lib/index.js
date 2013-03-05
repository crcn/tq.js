var EventEmitter = require('events').EventEmitter;

exports.create = function() {

	
	var next = function() {
		var callback = self.current = queue.pop();

		if(!callback || !started) {
			pargs = arguments;
			running = false;
			return;
		}

		running = true;


		/*var args = Arraay.prototype.slice(arguments),
		orgFn;

		if(typeof args[args.length - 1] == "function") {
			orgFn = args.pop();
		} else {
			orgFn = 
		}*/


		callback.apply(this, [next]);
	},
	running = false,
	started = false,
	queue = [],
	em = new EventEmitter(),
	pargs = [];

	var self = {

		/**
		 */

		stack: queue,

		/**
		 * add a queue to the end
		 */

		push: function(callback) {
			queue.unshift(callback);

			if(!running && started) {
				next.apply(null, pargs);
			}

			return this;
		},

		/**
		 */

		then: function(callback) {
			self.push(function(next) {
				callback();
				next();
			});
		},

		/**
		 * adds a queue to the begning
		 */

		unshift: function(callback) {
			queue.push(callback);
			if(!running && started) {
				next.apply(null, pargs);
			}
			return this;
		},

		/**
		 */

		on: function(type, callback) {
			em.addListener(type, callback);
		},


		/**
		 * starts the queue
		 */

		start: function() {
			if(started) return this;
			started = running = true;
			em.emit('start');
			next();
			return this;
		},

		/**
		 * returns a function that's added to the queue
		 * when invoked
		 */

		fn: function(fn) {
			return function() {
				var args = arguments, listeners = [];


				return self.push(function() {

					var next = this;

					fn.apply({
						next: function() {
							args = arguments;
							listeners.forEach(function(listener) {
								listener.apply(null, args);
							});
							next();
						},
						attach: function(listener) {
							listeners.push(listener);
						}
					}, args);
				});
			}
		},

		/**
		 * stops the queue
		 */

		stop: function() {
			started = running = false;
			return this;
		}
	};

	return self;
}