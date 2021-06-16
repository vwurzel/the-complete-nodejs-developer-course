const express = require('express')
const Task = require('./models/task')
require('./db/mongoose')
const User = require('./models/user')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.get('/users', (req, res) => {
    User.find({}).then((users) => {
        res.send(users)
    }).catch((err) => {
        res.status('500').send()
    })
})
app.get('/users/:id', (req, res) => {
    const id = req.params.id
    User.findById(id).then((user) => {
        res.send(user)
    }).catch((err) => {
        res.status('500').send()
    })
})
app.get('/tasks', (req, res) => {
    Task.find({}).then((tasks) => {
        res.send(tasks)
    }).catch((err) => {
        res.status('500').send()
    })
})
app.get('/tasks/:id', (req, res) => {
    Task.findById(req.params.id).then((task) => {
        res.send(task)
    }).catch((err) => {
        res.status('404').send()
    })
})
app.post('/users', (req, res) => {
    const user = new User(req.body)

    user.save().then(() => {
        res.send(user)
    }).catch((err) => {
        res.status('400').send(err)
    })
})
app.post('/tasks', (req, res) => {
    const task = new Task(req.body)

    task.save().then(() => {
        res.send(task)
    }).catch((err) => {
        res.status('400').send(err)
    })
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})

// const updateAgeAndCount = async (id, age) => {
//     const user = await User.findByIdAndUpdate(id, {age})
//     const count = await User.countDocuments({age})
//     return count
// }

// updateAgeAndCount('60c944061a976836512a025a', 2).then((count) => {
//     console.log(count)
// }).catch((err) => {
//     console.log(err)
// })

// const deleteAndCountTasks = async (id) => {
//     const deleted = await Task.findByIdAndDelete(id)
//     const countIncompleteTasks = Task.countDocuments({completed: false})
//     return countIncompleteTasks
// }

// deleteAndCountTasks('60c9471cbdb70f36f28b7b32').then((count) => {
//     console.log(count)
// }).catch((err) => {
//     console.log(err)
// })