const path = require('path')
const express = require('express')
const hbs = require('hbs')

const app = express()

// Paths for express configs
const publicDir = path.join(__dirname, '../public')
const viewsDir = path.join(__dirname, '../templates/views')
const partialsDir = path.join(__dirname, '../templates/partials')

// Config to use handlebar and dir location
app.set('view engine', 'hbs');
app.set('views', viewsDir)
hbs.registerPartials(partialsDir)

// Config static directory
app.use(express.static(publicDir))

// Routes
app.get('/', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Vinicius'
    })
})
app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        name: 'Vinicius',
        text: 'Weather app to learn Nodejs API consuming and handlebar render'
    })
})
app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        text: 'Just enter your city name and get the wheater info',
        name: 'Vinicius',
    })
})

app.get('/weather', (req, res) => {
    res.send({
        location: 'Sao Leopoldo',
        temp: 17
    })
})
app.get('/help/*', (req, res) => {
    res.status(404).render('404', {
        title: 'Article not found',
        text: 'The article was not found',
        name: 'Vinicius',
    })
})
app.get('*', (req, res) => {
    res.status(404).render('404', {
        title: 'Page not found',
        text: 'The page was not found',
        name: 'Vinicius',
    })
})

// Starting server
app.listen(3000, () => {
    console.log('Server listening on port 3000')
})