const http = require('http')
const express = require('express')
const socketio =require('socket.io')
const Filter = require('bad-words')

const { generateMessage, generateLocationMessage } = require('./utils/messages')
const { addUser, getUser, getUsersInRoom, removeUser } = require('./utils/users.js')


const app = express()
const server = http.createServer(app)
const io = socketio(server)


const port = process.env.PORT || 3000
app.use(express.static('public'))


io.on('connection', (socket) => {
    console.log('Client connected')

    socket.on('join', ({ username, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, username, room })

        if(error) {
            return callback(error)
        }

        socket.join(user.room)
        socket.emit('message', generateMessage(`Welcome ${username}!!`))
        socket.broadcast.to(user.room).emit('message', generateMessage(`${username} has joined to room!`))

        callback()
    })

    socket.on('sendMessage', (text, callback) => {
        const filter = new Filter()
        if (filter.isProfane(text)) {
            return callback('Profanity is not allowed!')
        }
        io.to('1').emit('message', generateMessage(text))
        callback()
    })

    socket.on('sendLocation', (coords, callback) => {
        io.emit('locationMessage', generateLocationMessage(`https://www.google.com/maps?q=${coords.lat},${coords.long}`))
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if(user) {
            io.to(user.room).emit('message', generateMessage(`The user ${user.username} has left`))
        }
    })
})

server.listen(port, () => {console.log(`Server running on port ${port}`)})