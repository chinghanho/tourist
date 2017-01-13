(function () {

    'use strict'


    function Gallery() {

        this.elem = document.getElementById('gallery')
        this.template = document.getElementById('template-gallery-item')

        // default
        this.resizeWidth = 680

        // declares
        this.files = []

    }


    Gallery.prototype.add = function (files) {
        if (this.files.length === 0) {
            this.show()
        }

        var files = Array.isArray(files) ? files : [files]
        files.forEach(this._addFile.bind(this))
        async.eachOfSeries(files, this._asyncReadFile.bind(this))
    }


    Gallery.prototype._addFile = function (file) {
        let clone  = document.importNode(this.template.content, true)
        this.elem.appendChild(clone)
        file.elem  = this.elem.lastElementChild
        this.files.push(file)
    }


    Gallery.prototype._asyncReadFile = function (file, index, next) {
        let reader = new FileReader()

        reader.onload = () => {
            this._createThumb(reader.result, function (image) {
                let imgtag = file.elem.querySelectorAll('img')[0]
                imgtag.width  = image.thumb.width
                imgtag.setAttribute('data-origin-url', reader.result)
                imgtag.src = image.thumb.url
                next()
            })
        }

        reader.readAsDataURL(file)
    }


    Gallery.prototype.show = function () {
        this.elem.classList.remove('empty')
    }


    Gallery.prototype._createThumb = function (imageURL, callback) {
        let that = this
        let img = new Image()

        img.onload = function () {
            let canvas = document.createElement('canvas')
            let ctx = canvas.getContext('2d')
            let delta = (that.resizeWidth / img.width)

            canvas.width  = img.width * delta
            canvas.height = img.height * delta

            ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

            let thumbDataURL = canvas.toDataURL('image/png')

            img.thumb = {
                url: thumbDataURL,
                width: canvas.width,
                height: canvas.height
            }

            if (callback) {
                callback(img)
            }
        }

        img.src = imageURL
    }


    window.Gallery = new Gallery()


})()
