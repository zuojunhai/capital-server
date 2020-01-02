const express=require('express')
const mongoose=require('mongoose')
const bodyParser=require('body-parser')
const passport=require('passport')
const app=express()

//findOneAndUpdate()内部会使用findAndModify驱动，驱动即将被废弃，所以弹出警告.在使用mongose时全局设置一下
mongoose.set('useFindAndModify', false)

//引入user.js
const users=require('./routes/api/users')
//引入profiles.js
const profiles=require('./routes/api/profiles')

//把数据库连接地址导入进来
const db=require('./config/keys').mongoURI
//连接mongodb数据库
mongoose.connect(db,{ useNewUrlParser: true, useUnifiedTopology: true })
    .then(()=>console.log('MongoDB Connected'))
    .catch(err=>console.log(err))

//使用body-parser中间件
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//初始化passport
app.use(passport.initialize())
//引入passport.js并把passport传进去(所有的配置在passport.js文件中写,passport.js导出一个function,可以在这里传参)
require('./config/passport')(passport)

//使用routes
app.use('/api/users',users)
app.use('/api/profiles',profiles)

//设置端口号
const port=process.env.PORT || 5000

app.listen(port,()=>{
    console.log(`Server running on port ${port}`)
})

