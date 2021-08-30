const request = require('supertest')
const app = require('../src/app')

const User = require('../src/models/user')
const { userTestOne, userTestOneId, setupDatabase } = require('./fixtures/db')

// Jest setup
beforeEach(setupDatabase)

// Tests
test('Should signup a new user', async () => {
    const response = await request(app).post('/users/signup').send({
        name: 'Test user',
        email: 'test@test.com',
        password: '1234567'
    }).expect(201)

    // Assert that DB was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    // Assertions about the response body
    expect(response.body).toMatchObject({
        user: {
            name: 'Test user',
            email: 'test@test.com'
        },
        token: user.tokens[0].token
    })

    // Confirm password encryptation
    expect(user.password).not.toBe('1234567')
})

test('Should login existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userTestOne.email,
        password: userTestOne.password
    }).expect(200)

    // assert token on response
    const user = await User.findById(response.body.user._id)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should not login existing user', async () => {
    await request(app).post('/users/login').send({
        email: userTestOne.email,
        password: '123'
    }).expect(400)
})

test('should get profile for user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userTestOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get the profile unathenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should delete account for user', async () => {
    const user = await User.findById(userTestOneId)
    expect(user).not.toBeNull()

    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userTestOne.tokens[0].token}`)
        .expect(200)

    const notUser = await User.findById(userTestOneId)
    expect(notUser).toBeNull()
})

test('Should not delete account for unathenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .expect(401)
})

test('Should upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userTestOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200)

    const user = await User.findById(userTestOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('should update valid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userTestOne.tokens[0].token}`)
        .send({ name: 'Test one changed'})
        .expect(200)

        const user = await User.findById(userTestOneId)
        expect(user.name).toEqual('Test one changed')
})

test('Should not update invalid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userTestOne.tokens[0].token}`)
        .send({ location: 'City 01'})
        .expect(400)
})