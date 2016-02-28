/*
 * (C) 2016 Seth Lakowske
 */

var h = require('virtual-dom/h');
var EventEmitter  = require('events');

/*
 * Manage a list of components.  Users can add, remove and render items.
 *
 * @param items to add to the list
 * @param name of the list
 * @param emptyMessage optional message to display when the list is empty
 * @param add is true if elements can be added to something
 */
function ListView(items, name, emptyMessage, add, remove) {
    var message = emptyMessage || '';
    var add     = add || false;
    
    return {
        items : items,
        name : name,
        emptyMessage : message,
        add : add,
        remove : remove,
        events : new EventEmitter()
    }
}

/*
 * Construct a ListView module with a given item renderer.
 *
 * @param itemToTree - a function that takes items (Object) containing a type
 * and transforms the item to a hyperscript tree.
 * @return a module used to construct ListViews
 */
function factory(itemToTree) {

    function renderItem(state, item, emit) {
        var elTree = itemToTree(item, emit, item.editMode);
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
    
    function render (state, emit) {
        var subtrees = h('li', state.emptyMessage);

        if (state.items.length > 0) {
            subtrees = state.items.map(function(item) {
                return h('li', renderItem(state, item, emit));
            })
        }

        return h('ul', subtrees);
    }
    
    return {
        add : function(state, item) {
            state.items.push(item);
        },
        set : function(state, items) {
            state.items = items;
        },
        remove : function(state, item) {
            var index = state.items.indexOf(item);
            state.items.splice(index, 1);
        },
        render : render,
        ListView : ListView
    }
}

module.exports = factory;
