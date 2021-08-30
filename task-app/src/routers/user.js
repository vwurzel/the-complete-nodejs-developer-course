const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const { sendWelcomeEmail, sendByeEmail } = require('../emails/account')

// Starting router and multer
const router = new express.Router()
const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpeg|jpg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }
        cb(undefined, true)
    }
})

// Setting routes
router.get('/users/me', auth ,async (req, res) => {
    res.send(req.user)
})

router.post('/users/signup', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    } catch (err) {
        res.status(400).send(err)
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()

        res.send({ user, token })
    } catch (err) {
        res.status(400).send()
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch (err) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()

        res.send()
    } catch (err) {
        res.status(500).send()
    }
})

router.patch('/users/me',auth, async (req, res) => {

    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    
    const isValidOperation = updates.every((item) => {
        return allowedUpdates.includes(item)
    })
    
    if(!isValidOperation){
        return res.status(400).send('Error: Invalid updates')
    }

    try {
        
        updates.forEach((update) => {
            req.user[update] = req.body[update]
        })
        
        await req.user.save()
        res.send(req.user)
    } catch (err) {
        res.status(500).send(err)
    }
})

router.delete('/users/me', auth, async (req, res) => {

    try {
        await req.user.remove()
        sendByeEmail(req.user.email, req.user.name)
        res.send(req.user)
    } catch (err) {
        res.status(500).send(err)
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).png().resize({ width: 250, height: 250 }).toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send(error.message)
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    try {
        req.user.avatar = undefined
        await req.user.save()
        res.send(req.user)
    } catch (err) {
        res.status(500).send(err)
    }
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if(!user || !user.avatar) {
            return new Error()
        }
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)

    } catch (err) {
        res.status(404).send()
    }
})

module.exports = router