var EventEmitter = require('events').EventEmitter;

exports.create = function() {

	
	var running = false,
	started = false,
	queue = [],
	em = new EventEmitter(),
	pargs = [],

	next = function() {
		var callback = self.current = queue.pop();

		if(!callback || !started) {
			pargs = arguments;
			running = false;
			em.emit("complete");
			return;
		}

		running = true;

		callback.apply(this, [getNext()]);
	},
	currentQueue,
	tryRunning = function() {
		if(!running && started) {
			next.apply(null, pargs);
		}
	},
	getNext = function() {
		var called = false;
		return function() {
			if(called) throw new Error("next already called");
			called = true;
			return next.apply(this, arguments);
		}
	}

	var self = {

		/**
		 */

		stack: queue,


		/**
		 */

		cq: function() {
			return currentQueue || self;
		},


		/**
		 */

		running: function() {
			return running;
		},

		/**
		 * add a queue to the end
		 */

		push: function(callback) {
			self.cq().stack.unshift(callback);
			tryRunning();
			return this;
		},


		/**
		 * adds a queue to the begning
		 */

		unshift: function(callback) {
			self.cq().stack.push(callback);
			tryRunning();
			return this;
		},


		/**
		 * runs this block now
		 */

		now: function(callback) {
			var tq = exports.create().stop(),
			oldCurrent = currentQueue;
			
			currentQueue = tq;
			callback(tq);
			tq.start();
			currentQueue = oldCurrent;
			self.unshift(function(next) {
				if(!tq.running()) return next();
				tq.once("complete", next);
			});

			return this;
		},

		/**
		 * calls the following function immediately
		 */

		then: function(callback) {
			self.push(function(next) {
				callback();
				next();
			});
		},

		/**
		 */

		once: function() {
			em.once.apply(em, arguments);
		},


		/**
		 * returns a function which pauses the queue until it's called
		 */

		wait: function() {

			var n;

			self.push(function(next) {
				if(n === true) return next();
				n = next;
			});

			return function() {
				if(n) n();
				n = true;
			}
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

	return self.start();
}