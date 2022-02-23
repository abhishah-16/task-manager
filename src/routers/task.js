const express = require('express')
const Task = require('../models/task')
const auth = require('../middeleware/auth')
const router = new express.Router()

// create task
router.post('/tasks', auth, async (req, res) => {
    // const newtask = new Task(req.body)
    const newtask = new Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        await newtask.save()
        res.send(newtask)
    } catch (e) {
        res.status(500).send(e)
    }

})
// read task
router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}
    if (req.query.status) {
        match.status = req.query.status === 'true'
    }
    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc'?-1:1
    }
    try {
        // const task = await Task.find({owner:req.user._id})
        await req.user.populate({
            path: 'task',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
                sort
            }
        })
        res.send(req.user.task)
    } catch (e) {
        res.status(500).send(e)
    }
})
// read single task
router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        // const task = await Task.findById(_id)
        const task = await Task.findOne({ _id, owner: req.user._id })
        if (!task) {
            res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})
//  update task
router.patch('/tasks/:id', auth, async (req, res) => {
    const updatebyuser = Object.keys(req.body)
    const availableupdate = ['discription', 'status']
    const isvalidops = updatebyuser.every((update) => availableupdate.includes(update))
    if (!isvalidops) {
        return res.send('you can not update property that not exist in task')
    }
    try {
        // const task = await Task.findById(req.params.id)
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runvalidator: true })
        if (!task) {
            res.status(404).send()
        }
        updatebyuser.forEach((update) => {
            task[update] = req.body[update]
        })
        await task.save()
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})
// delete task
router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
        if (!task) {
            return res.status(404).send()
        }
        res.send('task is deleted')
    } catch (e) {
        res.status(500).send(e)
    }
})
module.exports = router