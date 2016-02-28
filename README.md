# Slak-ListView
A unidirectional virtual-dom list view

# Import

``` js

//Import and build the module with a given item to hyperscript tree renderer.
//The itemToTree function converts javascript "item" objects users provide to hyperscript trees
//  { type: 'mydata', ... } -> h('div', [myDataComponents, ...])

var view          = require('./view');
var ListView      = require('Slak-ListView')(view.itemToTree);
```

# Construct

``` js

//Constructs an empty ListView with no name, no message and add/remove buttons
var elementsView = ListView.ListView([], '', '', true, true);


```

# Render

``` js

//Renders elementsView passing an event emitter that child items can write
//events to.
var tree = ListView.render(elementsView, emit);

```
