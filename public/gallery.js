(function () {

    'use strict'


    function Gallery() {

        this.elem = document.getElementById('gallery')
        this.template = document.getElementById('template-gallery-item')

        // default
        this.resizeWidth = 340
        this.debug = false

        // declares
        this.files = []

        DOM.delegate(this.elem, '.gallery-item', 'mouseenter', this._noob.bind(this))
           .delegate(this.elem, '.gallery-item', 'click', this._showInfo.bind(this))

       return this
    }


    Gallery.prototype.add = function (files) {

        if (this.files.length === 0) {
            this.show()
        }

        var files = Array.isArray(files) ? files : [files]
        files.forEach(this._addFile.bind(this))
        async.eachOfSeries(files, this._asyncReadFile.bind(this), () => {
            if (this.debug && window.env === 'development') {
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

        if (this.debug && index === 0 && window.env === 'development') {
            console.time('處理照片')
        }

        let image = new Image()

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


    Gallery.prototype._showInfo = function (event, nodes) {
        let selected = this.files.filter((file) => { return file.elem === nodes[0] })

        if (selected.length > 0) {
            let file = selected[0]

            let fNumber         = file.exifdata['FNumber'].valueOf()
            let focalLength     = file.exifdata['FocalLength'].valueOf()
            let model           = file.exifdata['Model'].valueOf()
            let isoSpeedRatings = file.exifdata['ISOSpeedRatings'].valueOf()
            let exposureTime    = file.exifdata['ExposureTime']
            exposureTime        = [exposureTime.numerator, exposureTime.denominator].join('/')

            console.log('Model',           model)
            console.log('ISOSpeedRatings', isoSpeedRatings)
            console.log('FNumber',         fNumber)
            console.log('FocalLength',     focalLength)
            console.log('ExposureTime',    exposureTime)
        }
    }


    Gallery.prototype._noob = function () {
        return undefined
    }


    window.Gallery = new Gallery()


})()
