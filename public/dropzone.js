
(function () {

    'use strict'

    var dz = document.getElementById('dropzone')

    window.addEventListener('dragover', function onDragOver(event) {
        dz.style.display = 'flex'
        event.preventDefault()
    })

    window.addEventListener('drop', function onDrop(event) {
        dz.classList.remove('dragging')
        event.preventDefault()



        let files    = event.dataTransfer.files
        var promises = []

        for (let i = 0; i < files.length; i++) {
            let promise = new Promise(function (resolve, reject) {
                EXIF.getData(files[i], resolve)
            })
            promises.push(promise)
        }

        Promise.all(promises).then(function (files) {

            Gallery.add(files)

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

                let latLng = Mapper.latLng(lat, lng)
                Mapper.add(latLng)

                return bounds
            }, [])

            Mapper.fit(bounds)
        })




        Mapper.addControl('topright')
        dz.style.display = 'none'
    })


    dz.addEventListener('dragenter', function () {
        dz.classList.add('dragging')
    })


    dz.addEventListener('dragleave', function () {
        dz.classList.remove('dragging')
    })

})()
