require('dotenv').config()
const request = require('request')

const geoCode = (address, callback) => {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${process.env.GEO_API_KEY}&limit=1`

    request({
        url: url,
        json: true
    }, (err, res) => {
        if (err) {
            callback('Unable to connect to location services!', undefined)
        } else if (res.body.features.length === 0) {
            callback('Unable to find location. Try another search', undefined)
        } else {
            const data = {
                latitude: res.body.features[0].center[1],
                longitude: res.body.features[0].center[0],
                location: res.body.features[0].place_name
            }
            callback(undefined, data)
        }
    })
}

module.exports = geoCode