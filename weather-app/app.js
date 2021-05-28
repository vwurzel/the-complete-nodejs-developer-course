require('dotenv').config()
const geoCode = require('./utils/geoCode')
const forecast = require('./utils/forecast')


if(process.argv.length === 3) {
geoCode(process.argv[2], (err, data) => {
    if (err) {
        return console.log(err)
    }
    forecast(data.latitude, data.longitude, (err, forecastData) => {
        if (err) {
            return console.log('error: ', err)
        }
        console.log(data.location)
        console.log(forecastData)
    })
})} else {
    console.log('Please, provide a address')
}