# Slak-ListView
A unidirectional virtual-dom list view.  Renders a list of items to hyperscript.

List items are passed a event emitter.  Listeners can wait for events
and take whatever action is needed (e.g. rerender the list, play a sound, start a program, etc...)

# Import

``` js
//Import the module.
//
var ListView      = require('Slak-ListView')(view.itemToTree);
```

# Construct

``` js

//The itemToTree function converts javascript "item" objects users provide to hyperscript trees
//  i.e. { type: 'mydata', ... } -> h('div', [myDataComponents, ...])

//Constructs an empty ListView with no name, no message and add/remove buttons
var view          = require('./view');
var elementsView = ListView.ListView([], view.itemToTree, '', '', true, true);

```

# Render

``` js
//Renders elementsView passing an event emitter that child items can write
//events to.
var tree = ListView.render(elementsView, emit);
```
