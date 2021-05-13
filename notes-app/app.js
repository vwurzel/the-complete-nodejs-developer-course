const { argv } = require('yargs')
const yargs = require('yargs')

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
        console.log(`Title: ${argv.title}`)
        console.log(`Body: ${argv.body}`)
    }
})

// Remove command
yargs.command({
    command: 'remove',
    describe: 'Removes one note',
    handler: function () {
        console.log('removing the note')
    }
})

// List command
yargs.command({
    command: 'list',
    describe: 'List the notes',
    handler: function () {
        console.log('listing notes')
    }
})

// Read command
yargs.command({
    command: 'read',
    describe: 'Read one note',
    handler: function () {
        console.log('Reading a note')
    }
})

yargs.parse()