(function () {

    'use strict'


    function Mapper() {
        this.default = {
            id: 'mapper',
            latLng: [25.0380, 121.5354],
            zoomControl: false,
            zoom: 15
        }

        this.templateURL = 'https://api.mapbox.com/styles/v1/chho/ciwxakhkm00io2pnx1240bgc5/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY2hobyIsImEiOiJjaXd4YTNhbmUwMjVrMnlzYWVkOG52eW9oIn0.qFnpmGdE_4CK39lWX3ZjaQ'
        this.tileLayerOptions = {
            maxZoom: 18,
            id: 'mapbox.streets'
        }

        // declares
        this.map = null
        this.controlAdded = false

        this.init()
    }


    Mapper.prototype.init = function () {
        this.map = L.map(this.default.id, {
            attributionControl: false,
            zoomControl: this.default.zoomControl
        }).setView(this.default.latLng, this.default.zoom);

        L.tileLayer(this.templateURL, {
            maxZoom: this.tileLayerOptions.maxZoom,
            id:      this.tileLayerOptions.id
          }).addTo(this.map)
    }


    // doc: http://leafletjs.com/reference.html#latlng
    Mapper.prototype.latLng = L.latLng

    Mapper.prototype.mark = L.marker

    Mapper.prototype.add = function (latLng) {
        L.marker(latLng).addTo(this.map)
    }

    Mapper.prototype.fit = function (bounds) {
        this.map.fitBounds(bounds, {
            paddingTopLeft: [390, 25]
        })
    }

    Mapper.prototype.addControl = function (position) {

        if (this.controlAdded) {
            return
        }

        let positionOptions = ['topleft', 'topright', 'bottomleft', 'bottomright']

        if (positionOptions.indexOf(position) < 0) {
            return console.error('position must be the one of following: ' + positionOptions.join(', ') + '.')
        }

        L.control.zoom({
            position: position
        }).addTo(this.map)

        this.controlAdded = true
    }


    window.Mapper = new Mapper()

})()
