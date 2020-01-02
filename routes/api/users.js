//登录和注册
const express=require('express')
const router=express.Router()
//这里用第三方包bcryptjs不用bcrypt,后者依赖多,总报错
const bcrypt = require('bcryptjs')
const gravatar = require('gravatar')
const jwt = require('jsonwebtoken')
const keys=require('../../config/keys')
const passport=require('passport')
//导入User模型
const User=require('../../models/User')

// @route  GET api/users/register
// @desc   返回的请求的json数据
// @access public
router.post('/register',(req,res) => {
    //查询数据库中有没有邮箱
    User.findOne({email: req.body.email}).then((user)=>{
        if(user){
            return res.json({
                errCode:1,
                email:'邮箱已经被注册'
            })
        }else{
            //第三方包gravatar头像处理
            //gravatar.url(email, options, protocol)
            //options：参数size或者s指定头像大小，default或者d指定缺省头像，rating或者r指定头像评级
            const avatar = gravatar.url(req.body.email, {s: '200', r: 'pg', d: 'mm'});
            //新建数据对象
            const newUser=new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                identity:req.body.identity,
                avatar:avatar,
            })
            //Bcrypt是一个跨平台的文件加密工具。Bcrypt是单向Hash加密算法
            //第三方包bcryptjs的genSalt方法对密码进行加密
            //Bcrypt是怎么加密的？
            //Bcrypt有四个变量：
            //saltRounds: 正数，代表hash杂凑次数，数值越高越安全，默认10次。
            //myPassword: 明文密码字符串。
            //salt: 盐，一个128bits随机字符串，22字符
            //myHash: 经过明文密码password和盐salt进行hash，个人的理解是默认10次下 ，循环加盐hash10次，得到myHash
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err){ throw err}
                    newUser.password=hash
                    //调用mongoose的save方法将数据存进数据库
                    newUser.save()
                        .then((user)=>{res.json({
                            errCode:0,
                            user
                        })})
                        .catch((err)=>{console.log(err)})
                })
            })
        }
    })
})

// @route  GET api/users/login
// @desc   返回token jwt passport
// @access public
router.post('/login',(req,res) => {
    const email=req.body.email
    const password=req.body.password
    //查询数据库
    User.findOne({email})
        .then((user)=>{
            //邮箱匹配
           if(!user){
               return res.status(404).json({email:'邮箱不存在'})
           }
           //密码匹配(数据库保存的密码是经过bcrypt加密的，所以不能直接拿密码与数据库中的比较，要调用bcrypt的compare的方法)
            bcrypt.compare(password, user.password)
                .then((isMatch)=>{   //isMatch是一个boolean值,密码匹配一致为true
                    if(isMatch){
                        const rule = {
                            id: user.id,
                            name: user.name,
                            avatar: user.avatar,
                            identity: user.identity
                        }
                        //使用基于 Token 的身份验证方法，在服务端不需要存储用户的登录记录。大概的流程是这样的：
                        //1、客户端使用用户名跟密码请求登录
                        //2、 服务端收到请求，去验证用户名与密码
                        //3、验证成功后，服务端会签发一个 Token，再把这个 Token 发送给客户端
                        //4、客户端收到 Token 以后可以把它存储起来，比如放在 Cookie 里或者 Local Storage 里
                        //5、客户端每次向服务端请求资源的时候需要带着服务端签发的 Token
                        //6、服务端收到请求，然后去验证客户端请求里面带着的 Token，如果验证成功，就向客户端返回请求的数据
                        //playload：签发的 token 里面要包含的一些数据。
                        //secret：签发 token 用的密钥，在验证 token 的时候同样需要用到这个密钥。
                        //options：一些其它的选项。(expiresIn为过期时间)
                        //Bearer代表Authorization头定义的schema
                        //Authorization: Bearer <token>
                        jwt.sign(rule, keys.secretOrKey, { expiresIn: 7200 }, (err, token) => {
                            if(err){throw err}
                            res.json({
                                success:true,
                                token:'Bearer '+token
                            })
                        })
                    }else{
                        return res.status(400).json({password:'密码错误'})
                    }
                })
        })
})


// @route  GET api/users/current
// @desc   return current user
// @access Private
//Passport提供了一个authenticate()功能，用作路由中间件来对请求进行身份验证。
//使用passport.authenticate()指定'JWT'作为策略。
//---
//验证token得到用户信息
//使用passport-jwt验证token
router.get('/current',passport.authenticate('jwt', { session: false }),(req,res)=>{
    res.json({
        id:req.user.id,
        name:req.user.name,
        email:req.user.email,
        identity:req.user.identity
    })
})

module.exports=router