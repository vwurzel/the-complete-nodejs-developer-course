const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')

// User data
const userTestOneId = new mongoose.Types.ObjectId()
const userTestOne = {
    _id: userTestOneId,
    name: 'Test One',
    email: 'one@test.com',
    password: 'passUser1',
    tokens: [{
        token: jwt.sign({ _id: userTestOneId }, process.env.JWT_SECRET)
    }]
}

const userTestTwoId = new mongoose.Types.ObjectId()
const userTestTwo = {
    _id: userTestTwoId,
    name: 'Test Two',
    email: 'two@test.com',
    password: 'passUser2',
    tokens: [{
        token: jwt.sign({ _id: userTestTwoId }, process.env.JWT_SECRET)
    }]
}

// Task data
const taskTestOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Task one',
    completed: false,
    owner: userTestOne._id
}

const taskTestTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Task two',
    completed: true,
    owner: userTestOne._id
}

const taskTestThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Task three',
    completed: false,
    owner: userTestTwo._id
}

// Runs before every execution
const setupDatabase = async () => {
    await User.deleteMany()
    await Task.deleteMany()
    await new User(userTestOne).save()
    await new User(userTestTwo).save()
    await new Task(taskTestOne).save()
    await new Task(taskTestTwo).save()
    await new Task(taskTestThree).save()
}

module.exports = { 
    userTestOne,
    userTestOneId,
    userTestTwo,
    taskTestOne,
    setupDatabase
}