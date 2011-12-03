### Example

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