const {
    MongoClient,
    ObjectID
} = require('mongodb')

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

// const id = new ObjectID()

MongoClient.connect(connectionURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err, client) => {
    if (err) {
        console.log(`Unable to connect to database. Error: ${err}`)
    } else {
        console.log(`Connected correctly`)

        const db = client.db(databaseName)

        db.collection('tasks').deleteOne({description: 'Fazer compras'}).then((res) => {
            console.log(res)
        }).catch((err) => {
            console.log(err)
        })
    }
})