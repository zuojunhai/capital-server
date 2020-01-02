//配置，它使用方案“ bearer”从http授权标头读取JWT：
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose=require('mongoose')
const User=mongoose.model('User')
const keys=require('./keys')

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = keys.secretOrKey

//JWT身份验证策略的构造如下
//new JwtStrategy(options, verify)
//options 是对象文字，其中包含用于控制如何从请求中提取令牌或验证令牌的选项。
//secretOrKey是包含用于验证令牌签名的秘密（对称）或PEM编码的公共密钥（非对称）的字符串或缓冲区。除非secretOrKeyProvider提供，否则为必填项。
//jwtFromRequest（必需）该函数接受请求作为唯一参数，并以字符串或null的形式返回JWT 
//verify 是带有参数的函数 verify(jwt_payload, done)
//jwt_payload 是包含已解码JWT有效负载的对象文字。
//done 是护照错误的第一个回调，接受了完成的参数（错误，用户，信息）
//具体配置去官方文档
module.exports=(passport)=>{
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        /*console.log(jwt_payload)*/
        User.findById(jwt_payload.id)
            .then((user)=>{
                if(user){
                    return done(null,user)
                }
                return done(null,false)
            })
            .catch(err => console.log(err))
    }))
}



//https://blog.csdn.net/djjj123456789/article/details/81980587  讲解的很清楚
//使用passport-jwt和passport中间件来验证token，
//passport-jwt是一个针对jsonwebtoken的插件，passport是express框架的一个针对密码的中间件