(function () {

    'use strict'


    function Gallery() {

        this.elem = document.getElementById('gallery')
        this.template = document.getElementById('template-gallery-item')

        // default
        this.resizeWidth = 680

        // declares
        this.photos = []

    }


    Gallery.prototype.add = function (files) {
        let that = this

        if (that.photos.length === 0) {
            that.elem.classList.remove('empty')
            that.elem.textContent = ""
        }

        var photos = Array.isArray(files) ? files : [files]
        photos.forEach(function (photo, index) {

            let clone = document.importNode(that.template.content, true)
            let imgtag = clone.querySelectorAll('img')[0]
            let reader = new FileReader()

            that.elem.appendChild(clone)

            reader.onload = function () {
                that._createThumb(reader.result, function (image) {
                    imgtag.width  = image.thumb.width
                    imgtag.setAttribute('data-origin-url', reader.result)
                    imgtag.src = image.thumb.url
                })
            }

            reader.readAsDataURL(photo)

            that.photos.push(photo)
        })
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
