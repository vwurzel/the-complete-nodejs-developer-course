const mongoose = require('mongoose')
const validator = require('validator')

const User = new mongoose.model('User', {
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        default: 0,
        min: [0, 'Age must be a positive number']
    },
    password: {
        type: String,
        required: true,
        minLength: [7, 'Minimun length for password is 7'],
        validate(value) {
            if(value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain \'password\'')
            }
        }
    },
    email: {
        type: String,
        required: true,
        trim: true,
        toLowerCase: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('Invalid email')
            }
        }
    }
})

module.exports = User