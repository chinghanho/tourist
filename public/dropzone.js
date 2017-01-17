
(function () {

    'use strict'


    function Dropzone() {

        let that = this

        this.debug = true

        this.dz = document.getElementById('dropzone')


        window.addEventListener('dragover', this._onDragOver.bind(this))
        window.addEventListener('drop', this._onDrop.bind(this))
        this.dz.addEventListener('dragenter', this._onDragEnter.bind(this))
        this.dz.addEventListener('dragleave', this._onDragLeave.bind(this))
    }


    Dropzone.prototype._onDragOver = function (event) {
        this.dz.style.display = 'flex'
        event.preventDefault()
    }


    Dropzone.prototype._onDrop = function (event) {

        let that = this

        that.dz.classList.remove('dragging')
        event.preventDefault()

        if (that.debug && window.env === 'development') {
            console.time('處理 EXIF 時間')
        }

        let files    = event.dataTransfer.files
        var promises = []

        for (let i = 0; i < files.length; i++) {
            let promise = new Promise(function (resolve, reject) {
                EXIF.getData(files[i], resolve)
            })
            promises.push(promise)
        }

        Promise.all(promises).then(function (files) {

            if (that.debug && window.env === 'development') {
                console.timeEnd('處理 EXIF 時間')
            }

            var markers = L.markerClusterGroup()

            let bounds = files.reduce(function (bounds, file, index) {

                let exifdata = file.exifdata

                // return early if there're not GPS info in EXIF
                if (!(exifdata.GPSLatitude && exifdata.GPSLongitude)) {
                    console.warn('GPS info not found in this file: ', file.name)
                    return bounds
                }

                let capturedDateTime = exifdata.DateTimeOriginal || exifdata.DateTimeDigitized || exifdata.DateTime

                let latDeg = exifdata.GPSLatitude[0].valueOf()
                let latMin = exifdata.GPSLatitude[1].valueOf()
                let latSec = exifdata.GPSLatitude[2].valueOf()
                let lngDeg = exifdata.GPSLongitude[0].valueOf()
                let lngMin = exifdata.GPSLongitude[1].valueOf()
                let lngSec = exifdata.GPSLongitude[2].valueOf()

                let lat = latDeg + (latMin / 60) + (latSec / 3600)
                let lng = lngDeg + (lngMin / 60) + (lngSec / 3600)

                bounds.push([lat, lng])

                let marker = Mapper.mark(Mapper.latLng(lat, lng))
                markers.addLayer(marker)

                return bounds
            }, [])

            Mapper.map.addLayer(markers);
            Mapper.fit(bounds)
        })

        Mapper.addControl('topright')
        this.dz.style.display = 'none'
    }


    Dropzone.prototype._onDragEnter = function () {
        this.dz.classList.add('dragging')
    }


    Dropzone.prototype._onDragLeave = function () {
        this.dz.classList.remove('dragging')
    }



    window.Dropzone = new Dropzone()


})()
