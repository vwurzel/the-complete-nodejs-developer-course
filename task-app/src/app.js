require('./db/mongoose')
const express = require('express')

// Requiring route/middleware files
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

// Instancing and port variable
const app = express()

// Configuring to understand JSON
app.use(express.json())

// Setting routes
app.use(userRouter)
app.use(taskRouter)

module.exports = app