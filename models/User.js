const mongoose=require('mongoose')
const Schema=mongoose.Schema

//创建Schema
const UserSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    avatar:{
        type:String,
    },
    identity:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now()
    }
})

//将模型暴露出去
module.exports=mongoose.model('User',UserSchema)