require('dotenv').config()
const request = require('request')

const forecast = (latitude, longitude, callback) => {
    const url = `http://api.weatherstack.com/current?access_key=${process.env.WEATHER_API_KEY}&query=${latitude},${longitude}&units=m`

    request({
        url: url,
        json: true
    }, (err, res) => {
        if (err) {
            callback('Unable to connect to forecast services!', undefined)
        } else if (res.body.error) {
            callback('Unable to get the forecast. Try another search', undefined)
        } else {
            callback(undefined, `The current temp in ${res.body.location.name} is ${res.body.current.temperature} and the weather is ${res.body.current.weather_descriptions[0].toLowerCase()}`)
        }
    })
}

module.exports = forecast