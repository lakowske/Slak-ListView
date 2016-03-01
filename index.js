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
function ListView(items, itemToTree, name, emptyMessage, add, remove) {
    var message = emptyMessage || '';
    var add     = add || false;
    
    return {
        items : items,
        name : name,
        emptyMessage : message,
        add : add,
        remove : remove,
        
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
function renderItem(state, item, emit) {
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
function render (state, emit) {
    var subtrees = h('li', state.emptyMessage);

    if (state.items.length > 0) {
        subtrees = state.items.map(function(item) {
            return h('li', renderItem(state, item, emit));
        })
    }

    return h('ul', subtrees);
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
