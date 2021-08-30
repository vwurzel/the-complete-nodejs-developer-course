const app = require('./app')

// Setting port variable
const port = process.env.PORT

// Starting Server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})