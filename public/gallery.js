(function () {

    'use strict'


    function Gallery() {

        this.elem = document.getElementById('gallery')
        this.template = document.getElementById('template-gallery-item')

        // default
        this.resizeWidth = 340

        // declares
        this.files = []

        this.delegate(this.elem, '.gallery-item', 'mouseenter', this._noob)
            .delegate(this.elem, '.gallery-item', 'click', this._showInfo)
    }


    Gallery.prototype.add = function (files) {
        if (this.files.length === 0) {
            this.show()
        }

        var files = Array.isArray(files) ? files : [files]
        files.forEach(this._addFile.bind(this))
        async.eachOfSeries(files, this._asyncReadFile.bind(this), function () {
            if (window.env === 'development') {
                console.timeEnd('處理照片')
            }
        })
    }


    Gallery.prototype._addFile = function (file) {
        let clone  = document.importNode(this.template.content, true)
        this.elem.appendChild(clone)
        file.elem  = this.elem.lastElementChild
        this.files.push(file)
    }


    Gallery.prototype._asyncReadFile = function (file, index, next) {

        if (index === 0 && window.env === 'development') {
            console.time('處理照片')
        }

        let image = new Image()
        let that = this

        image.onload = function () {
            let imgtag = file.elem.querySelectorAll('img')[0]
            imgtag.src = this.src
            next()
        }

        image.src = window.URL.createObjectURL(file)
    }


    Gallery.prototype.show = function () {
        this.elem.classList.remove('empty')
    }


    Gallery.prototype.delegate = function (elem, selector, type, handler) {

        let that = this
        let eventType = this._eventFix(type)

        elem.addEventListener(eventType, function (event) {
            let nodes = that._closest(event.target, selector, elem)
            if (nodes.length > 0) {
                handler.call(this, nodes)
            }
        })

        return this
    }


    Gallery.prototype._showInfo = function (nodes) {
        debugger
    }


    Gallery.prototype._noob = function () {
        return undefined
    }


    Gallery.prototype._isDocument = function (obj) {
        return obj != null && obj.nodeType == obj.DOCUMENT_NODE
    }


    Gallery.prototype._closest = function (node, selector, context) {

        let nodes = []
        let collection = (context || document).querySelectorAll(selector)

        while (node && !(collection ? [].indexOf.call(collection, node) >= 0 : this._matches(node, selector))) {
            node = !this._isDocument(node) && node.parentNode
        }

        if (node && nodes.indexOf(node) < 0){
            nodes.push(node)
        }

        return nodes
    }


    // polyfill matches
    Gallery.prototype._matches = function (elem, selector) {

        let matches = elem.matches ||
                      elem.webkitMatchesSelector ||
                      elem.mozMatchesSelector ||
                      elem.oMatchesSelector ||
                      elem.matchesSelector

        return matches(selector)
    }


    Gallery.prototype._eventFix = function (type) {

        let events = {
            'mouseenter': 'mouseover'
        }

        return events[type] || type

    }


    window.Gallery = new Gallery()


})()
