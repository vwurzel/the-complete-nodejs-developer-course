const socket = io()

// Elements
const messageForm = document.querySelector('#message-form')
const messageFormInput = messageForm.querySelector('input')
const messageFormButton = messageForm.querySelector('button')
const sendLocationButton = document.querySelector('#send-location')
const messageDiv = document.querySelector('#messages')


// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

// Option
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

// Setting autoscroll
const autoscroll = () => {
    const newMessage = messageDiv.lastElementChild

    const newMessageStyles = getComputedStyle(newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = newMessage.offsetHeight + newMessageMargin

    const visibleHeight = messageDiv.offsetHeight

    const containerHeight = messageDiv.scrollHeight

    const scrollOffset = messageDiv.scrollTop + visibleHeight

    if(containerHeight - newMessageHeight <= scrollOffset) {
        messageDiv.scrollTop = messageDiv.scrollHeight
    }
}


// Mesage display
socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, { 
        message: message.text,
        createdAt: moment(message.createdAt).format('HH:mm:ss'),
        username: message.username
    })
    messageDiv.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

// Location display
socket.on('locationMessage', (location) => {
    console.log(location)
    const html = Mustache.render(locationTemplate, {
        location: location.url,
        createdAt: moment(location.createdAt).format('HH:mm:ss'),
        username: location.username
    })
    messageDiv.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

// List users in room
socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})

// Mesage sender/Handler
messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    messageFormButton.setAttribute('disabled', 'disabled')

    const content = e.target.elements.message.value
    socket.emit('sendMessage', content, (err) => {
        messageFormButton.removeAttribute('disabled')
        messageFormInput.value = ''
        messageFormInput.focus()
        if (err) {
            return console.log(err)
        }

        console.log('Message delivered!')
    })
})

// Location sender/Handler
sendLocationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser')
    }
    sendLocationButton.setAttribute('disabled', 'disabled')
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            long: position.coords.longitude,
            lat: position.coords.latitude
        }, (err) => {
            sendLocationButton.removeAttribute('disabled')
            if (err) {
                return console.log(err)
            }

            console.log('Location shared!')
        })
    })
})

socket.emit('join', { username, room }, (error) => {
    if(error) {
        alert(error)
        location.href = '/'
    }
})