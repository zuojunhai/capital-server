const mongoose = require('mongoose')
const Schema = mongoose.Schema

//创建Schema
const NoteSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    date:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    }
})

module.exports=mongoose.model('Note',NoteSchema)