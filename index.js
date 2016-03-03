/*
 * (C) 2016 Seth Lakowske
 */

var h = require('virtual-dom/h');
var EventEmitter  = require('events');

/*
 * Manage a list of components.  Users can add, remove and render items.
 *
 * @param items to add to the list
 * @param itemToTree - a function that takes items (Object) containing a type
 * and transforms the item to a hyperscript tree.
 * @param name of the list
 * @param emptyMessage optional message to display when the list is empty
 * @param add is true if elements can be added to something
 */
function ListView(items, itemToTree, name, emptyMessage, add, remove, opts) {
    var message = emptyMessage || '';
    var add     = add || false;
    
    return {
        items : items,
        name : name,
        emptyMessage : message,
        add : add,
        remove : remove,
        opts : opts,
        
        itemToTree : itemToTree,
        events : new EventEmitter()
    }
}

/*
 * Render an item
 *
 * @param state of the ListView
 * @param item to render
 * @param emit function to write events to
 */
function renderItem(state, item) {
    var events = state.events;
    var emit = events.emit.bind(events);
    
    var elTree = state.itemToTree(item, emit, item.editMode);
    var components = [elTree]

    if (state.add) {
        components.push(h('input', {
            type : 'button',
            style: 'float:right',
            value : 'add', onclick : function() {
                state.events.emit('add', state, item);
            }}))
    }

    if (state.remove) {
        components.push(h('input', {
            type : 'button',
            style: 'float:right',
            value : 'remove',
            onclick : function() {
                state.events.emit('remove', state, item);
            }}));
    }
    
    return h('p', components);
}

/*
 * Render a ListView
 *
 * @param state of the ListView
 * @param emit function to write events to
 */
function render (state) {
    var components = []
    
    if (state.name !== '') {
        var header = h('h3', state.name);
        components.push(header)
    }


    var subtrees = h('li', state.emptyMessage);

    if (state.items.length > 0) {
        subtrees = state.items.map(function(item) {
            return h('li', renderItem(state, item));
        })
    }

    if (state.opts && state.opts.className) {
        components.push(h('ul', {className: state.opts.className}, subtrees));
    } else {
        components.push(h('ul', subtrees));
    }
    
    return h('div', components);
}

function add(state, item) {
    state.items.push(item);
}

function set(state, items) {
    state.items = items;
}

function remove(state, item) {
    var index = state.items.indexOf(item);
    state.items.splice(index, 1);
}

module.exports.add = add;
module.exports.set = set;
module.exports.remove = remove;
module.exports.render = render;
module.exports.ListView = ListView;
