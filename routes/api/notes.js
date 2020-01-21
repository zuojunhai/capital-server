//备忘录
const express = require('express')
const router = express.Router()
const Note = require('../../models/Note')


// @route  POST api/notes/add
// @desc   添加信息接口
// @access private
router.post('/add', (req, res) => {
    const noteFields = {}
    if (req.body.name) {
        noteFields.name = req.body.name
    }
    if (req.body.date) {
        noteFields.date = req.body.date
    }
    if (req.body.content) {
        noteFields.content = req.body.content
    }
    new Note(noteFields).save().then(note => {
        res.json(note)
    })
})


// @route  GET api/notes/findAll
// @desc   获取所有信息接口
// @access private
router.get('/findAll', (req, res) => {
    Note.find()
        .then(note => {
            if (!note) {
                return res.status(404).json('没有任何内容')
            }
            res.json(note)
        })
        .catch(err => {
            res.status(404).json(err)
        })
})


// @route  DELETE api/notes/delete/:id
// @desc   删除信息接口
// @access private
router.delete('/delete/:id', (req, res) => {
    Note.findOneAndRemove({ _id: req.params.id })
        .then(note => {
            note.save()
                .then(note=>{
                    res.json(note)
                })
        })
        .catch(err=>{
            res.status(404).json(err)
        })
})


module.exports = router
