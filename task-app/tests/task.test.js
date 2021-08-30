const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const User = require('../src/models/user')
const { userTestOne, userTestTwo, setupDatabase, taskTestOne } = require('./fixtures/db')

// Jest setup
beforeEach(setupDatabase)

test('Should create a new task for user', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userTestOne.tokens[0].token}`)
        .send({description: 'Task One (Created by test case)'})
        .expect(200)

        const task = await Task.findById(response.body._id)
        expect(task.description).toEqual('Task One (Created by test case)')
        expect(task.completed).toBe(false)
})

test('Should get all tasks for userTestOne', async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userTestOne.tokens[0].token}`)
        .send()
        .expect(200)

    const tasks = response.body
    expect(tasks.length).toEqual(2)
})

test('Attempt to second user to delete first task (should fail)', async () => {
    request(app)
        .delete(`/tasks/${taskTestOne._id}`)
        .set('Authorization', `Bearer ${userTestTwo.tokens[0].token}`)
        .expect(401)

    const task = await Task.findById(taskTestOne._id)
    expect(task).not.toBeNull()
})