(function () {

    'use strict'

    var DOM = {}

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


    window.DOM = DOM

})()
