var EventEmitter = require('events').EventEmitter;

exports.queue = function() {
	
	
	var next = function() {
		var callback = queue.pop();

		if(!callback || !started) {
			running = false;
			return;
		}

		callback.apply(next, arguments);
	},
	running = false,
	started = false,
	queue = [],
	em = new EventEmitter();

	var self = {

		/**
		 * add a queue to the end
		 */

		push: function(callback) {
			queue.unshift(callback);

			if(!running && started) {
				next();
			}
			return this;
		},


		/**
		 * adds a queue to the begning
		 */

		unshift: function(callback) {
			queue.push(callback);
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
		 * stops the queue
		 */

		stop: function() {
			started = running = false;
			return this;
		}
	};


	Array.apply(null, arguments).forEach(function(fn) {
		self.push(fn);
	});

	return self;
}