const fs = require('fs')
const chalk = require('chalk')

// Load notes function
const loadNotes = () => {
    try {
        const dataBuffer = fs.readFileSync('notes.json')
        const dataJSON = dataBuffer.toString()
        return JSON.parse(dataJSON)
    } catch (error) {
        return []
    }
}

// Save notes function
const saveNotes = (notes) => {
    const dataJSON = JSON.stringify(notes)
    fs.writeFileSync('notes.json', dataJSON)
}

// Add note function
const addNote = (title, body) => {
    const notes = loadNotes()
    const duplicateNotes = notes.filter((note) => {
        return note.title === title
    })
    if (duplicateNotes.length === 0) {
        notes.push({
            title: title,
            body: body
        })
        saveNotes(notes)
        console.log(chalk.green.inverse('New note added, your actual note list is:'))
    } else {
        console.log(chalk.red.inverse('Duplicated note, please check below:'))
    }
    console.log(notes)
}
// Remove note function
const removeNote = (title) => {
    const notes = loadNotes()
    const newNotes = notes.filter((note) => {
        return note.title !== title
    })
    if (newNotes.length !== notes.length) {
        saveNotes(newNotes)
        console.log(chalk.green.inverse('Note deleted, your actual note list is:'))
    } else {
        console.log(chalk.red.inverse('Chek your note title, your actual note list is:'))
    }
    console.log(newNotes)
}
// List notes function
const listNotes = () => {
    const notes = loadNotes()
    console.log(chalk.green.inverse('Your actual titles list is'))
    notes.forEach(note => {
        console.log(note.title)
    });
}
// Read note function
const readNote = (title) => {
    const notes = loadNotes()
    const note = notes.filter((note) => {
        return note.title === title
    })
    if(note.length === 0){
        console.log(chalk.red.inverse('Note title not found'))
    } else {
        console.log(chalk.green.inverse('Your note is:'))
        console.log(note)
    }
}

module.exports = {
    addNote,
    listNotes,
    removeNote,
    readNote
}