[![Build Status](https://secure.travis-ci.org/crcn/tq.js.png)](https://secure.travis-ci.org/crcn/tq.js)

## Example

```javascript

var queue = require('tq').queue();



queue.push(function() {
	console.log('next');

	this();

}).
push(function() {
	
	console.log("next");

	this();
}).
start();

```

Another variation

```javascript
var queue = require('tq').queue();


[
	function() {
		this();
	},
	function() {
		this()
	},
	function() {
		this();
	}
].forEach(queue.push);

queue.start();
```


## Api


### queue.push 
pushes a queue to the end

### queue.unshift
pushes a queue to the beginning (next up)

### queue.now(callback)

### queue.then(callback)

### callback queue.wait()

### queue.start
starts a queue

### queue.stop
stops a queue