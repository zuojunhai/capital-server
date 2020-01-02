const mongoose=require('mongoose')
const Schema=mongoose.Schema

//创建Schema
const ProfileSchema=new Schema({
    type1: {
        type: String
    },
    type2: {
        type: String
    },
    describe: {
        type: String
    },
    income: {
        type: Number,
        required: true
    },
    expend: {
        type: Number,
        required: true
    },
    cash: {
        type: Number,
    },
    remark: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
})

//将模型暴露出去
module.exports=mongoose.model('Profile',ProfileSchema)