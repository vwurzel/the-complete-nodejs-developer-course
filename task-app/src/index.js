require('./db/mongoose')
const express = require('express')

// Requiring route/middleware files
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

// Instancing and port variable
const app = express()
const port = process.env.PORT || 3000

// Configuring to understand JSON
app.use(express.json())

// Setting routes
app.use(userRouter)
app.use(taskRouter)

// Starting Server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})