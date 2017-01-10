(function () {

    'use strict'


    function Gallery() {

        this.elem = document.getElementById('gallery')
        this.template = document.getElementById('template-gallery-item')

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
        photos.forEach(function (photo) {
            let clone = document.importNode(that.template.content, true)
            let imgtag = clone.querySelectorAll('img')
            let reader = new FileReader()

            reader.onload = function (event) {
                imgtag[0].src = event.target.result
            }

            reader.readAsDataURL(photo)

            that.elem.appendChild(clone)
            that.photos.push(photo)
        })
    }


    window.Gallery = new Gallery()


})()
