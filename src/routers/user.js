const express = require('express')
const User = require('../models/user')
const auth = require('../middeleware/auth')
const {sendwlcemail,sendrmvemail} = require('../emails/account')
const multer = require('multer')
const sharp = require('sharp')
const router = new express.Router()

// create user
router.post('/users', async (req, res) => {
    const me = new User(req.body)
    try {
        await me.save()
        sendwlcemail(me.email,me.name)
        const token = await me.getjwttoken()
        res.status(200).send({ me, token })

    } catch (e) {
        res.status(400).send(e)
    }
})

// login user
router.post('/users/log-in', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.getjwttoken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

// log out user
router.post('/users/log-out', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.status(200).send()
    } catch (e) {
        res.status(400).send(e)
    }
})

// logout all user
router.post('/users/logout-all', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.status(200).send()
    } catch (e) {
        res.status(500).send(e)
    }
})

// read users
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)

})

// read user by id ( one user)
router.get('/users/:id', async (req, res) => {
    const _id = req.params.id
    try {
        const user = await User.findById(_id)
        if (!user) {
            res.status(404).send()
        }
        res.status(200).send(user)
    } catch (e) {
        res.status(500).send(e)
    }

})

// update user
router.patch('/users/me', auth, async (req, res) => {
    const updatebyuser = Object.keys(req.body)
    const availableupdate = ['name', 'lastname', 'email', 'password', 'age']
    const isvalidops = updatebyuser.every((update) => availableupdate.includes(update))
    if (!isvalidops) {
        return res.send('you can not update property that not exist in user')
    }
    try {
        const user = await User.findById(req.user._id)
        updatebyuser.forEach((update) => {
            user[update] = req.body[update]
        })
        await user.save()
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runvalidator: true })
        if (!user) {
            res.status(404).send()
        }
        res.send(user)
    } catch (e) {
        res.status(500).send(e)
    }
})

// delete user
router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        sendrmvemail(req.user.email,req.user.name)
        res.send('user is deleted')
    } catch (e) {
        res.status(500).send(e)
    }
})

// upload avatar of user
const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('PLEASE UPLOAD ONLY jpg,jpeg,png FILES'))
        }
        cb(undefined, true)
    }
})
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

// delete avatar
router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.status(200).send()
})

// for serving up avatar
router.get('/users/:id/avatar', async (req, res) => {
    const user = await User.findById(req.params.id)
    if (!user || !user.avatar) {
        throw new Error()
    }
    res.set('Content-type', 'image/png')
    res.send(user.avatar)

})
module.exports = router