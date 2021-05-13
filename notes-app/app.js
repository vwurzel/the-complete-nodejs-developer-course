const yargs = require('yargs')
const { addNote, listNotes, removeNote, readNote } = require('./notes')

// Customize version
yargs.version('0.0.1')

// Add command
yargs.command({
    command: 'add',
    describe: 'Add a new note',
    builder: {
        title: {
            describe: 'Note title',
            demandOption: true,
            type: 'string'
        },
        body: {
            describe: 'Note body',
            demandOption: true,
            type: 'string'
        }
    },
    handler: function () {
        addNote(yargs.argv.title, yargs.argv.body)
    }
})

// Remove command
yargs.command({
    command: 'remove',
    describe: 'Removes one note',
    builder: {
        title: {
            describe: 'Note title',
            demandOption: true,
            type: 'string'
        }
    },
    handler: function () {
        removeNote(yargs.argv.title)
    }
})

// List command
yargs.command({
    command: 'list',
    describe: 'List the notes',
    handler: function () {
        listNotes()
    }
})

// Read command
yargs.command({
    command: 'read',
    describe: 'Read one note',
    builder: {
        title: {
            describe: 'Note title',
            demandOption: true,
            type: 'string'
        }
    },
    handler: function () {
        readNote(yargs.argv.title)
    }
})


yargs.parse()