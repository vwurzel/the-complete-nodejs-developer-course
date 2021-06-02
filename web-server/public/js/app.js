const weatherForm = document.querySelector('form')
const input = document.querySelector('input')
const display = document.querySelector('#forecast')
const displayTextOne = document.querySelector('#textOne')
const displayTextTwo = document.querySelector('#textTwo')
const loading = document.querySelector('.loading')
const button = document.querySelector('button')

weatherForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const searchTerm = encodeURI(input.value)
    button.classList.add('hidden')
    loading.classList.remove('hidden')
    fetch(`http://localhost:3000/weather?location=${searchTerm}`).then((res) => {
        res.json().then((data) => {
            if (data.success) {
                let textOne = `The temperature in ${data.data.location} is ${data.data.temp}ºC, the weather is ${data.data.desc}.`
                let textTwo = `The wind is ${data.data.wind}km/h, and the temperature feels like ${data.data.feelsLike}`
                displayTextOne.textContent = textOne
                displayTextTwo.textContent =textTwo
                loading.classList.add('hidden')
                button.classList.remove('hidden')
                display.classList.remove('hidden')
            } else {
                let textOne = `Sorry, something went wrog`
                let textTwo = `Error: ${data.error}`
                displayTextOne.textContent = textOne
                displayTextTwo.textContent =textTwo
                loading.classList.add('hidden')
                button.classList.remove('hidden')
                display.classList.remove('hidden')
            }
        })
    })
})