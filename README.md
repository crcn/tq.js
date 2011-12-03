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