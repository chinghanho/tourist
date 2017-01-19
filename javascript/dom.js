(function () {

    'use strict'

    var DOM = {}


    DOM.closest = function (node, selector, context) {

        let nodes = []
        let collection = (context || document).querySelectorAll(selector)

        while (node && !(collection ? [].indexOf.call(collection, node) >= 0 : DOM._matches(node, selector))) {
            node = !DOM._isDocument(node) && node.parentNode
        }

        if (node && nodes.indexOf(node) < 0){
            nodes.push(node)
        }

        return nodes
    }


    DOM.delegate = function (elem, selector, type, handler) {

        let eventType = this._eventFix(type)

        elem.addEventListener(eventType, (event) => {
            let nodes = DOM.closest(event.target, selector, elem)
            if (nodes.length > 0) {
                handler.call(this, event, nodes)
            }
        })

        return this
    }


    DOM._isDocument = function (obj) {
        return obj != null && obj.nodeType == obj.DOCUMENT_NODE
    }


    // polyfill matches
    DOM._matches = function (elem, selector) {

        let matches = elem.matches ||
                      elem.webkitMatchesSelector ||
                      elem.mozMatchesSelector ||
                      elem.oMatchesSelector ||
                      elem.matchesSelector

        return matches(selector)
    }


    DOM._eventFix = function (type) {

        let events = {
            'mouseenter': 'mouseover'
        }

        return events[type] || type

    }


    window.DOM = DOM

})()
