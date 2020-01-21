const express = require('express')
const router = express.Router()
const passport = require('passport')
//导入Profile模型
const Profile = require('../../models/Profile')

// @route  POST api/profiles/add
// @desc   添加信息接口
// @access private
router.post('/add', passport.authenticate('jwt', { session: false }), (req, res) => {
    const profileFields = {}
    if (req.body.type1) profileFields.type1 = req.body.type1
    if (req.body.type2) profileFields.type2 = req.body.type2
    if (req.body.describe) profileFields.describe = req.body.describe
    if (req.body.income) profileFields.income = req.body.income
    if (req.body.expend) profileFields.expend = req.body.expend
    profileFields.cash = req.body.cash//盈损情况可能为0,不做if判断
    if (req.body.remark) profileFields.remark = req.body.remark
    new Profile(profileFields).save().then(profile => {
        res.json(profile)
    })
})

// @route  GET api/profiles/findAll
// @desc   获取所有信息接口
// @access private
router.get('/findAll', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.find()
        .then(profile => {
            if (!profile) {
                return res.status(404).json('没有任何内容')
            }
            res.json(profile)
        })
        .catch(err => {
            res.status(404).json(err)
        })
})

// @route  GET api/profiles/one:id
// @desc   获取单个信息接口
// @access private
//目前没有用到
router.get('/one:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    //req.params,req.query是用在get请求当中
    //1.req.params
    //所对应的url长这个样子 http://localhost:3000/10
    //就是把请求 / 后面的参数当成id，通过req.params就能获取到id
    //2.req.query
    //所对应的url长这个样子http://localhost:3000/?id=10
    //也就是说是问号后面的
    //区别：req.params包含路由参数（在URL的路径部分），而req.query包含URL的查询参数（在URL的？后的参数）
    Profile.findOne({ _id: req.params.id })
        .then(profile => {
            if (!profile) {
                return res.status(404).json('没有任何内容')
            }
            res.json(profile)
        })
        .catch(err => {
            res.status(404).json(err)
        })
})


// @route  GET api/profiles/date:date
// @desc   根据日期获取信息接口（获取某一天的数据）
// @access private
router.get('/date:date', passport.authenticate('jwt', { session: false }), (req, res) => {
    //拿到传过来的日期字符串，格式是xxxx-xx-xx
    var oneDate = req.params.date
    //创建时间对象，将日期字符串传进去
    var newDate = new Date(oneDate)
    //调用getTime()方法得到时间戳
    var mm = newDate.getTime()
    //将时间戳加一天,得到一个新的时间戳，比传入的日期多了一天
    var nextMm = mm + (1000 * 60 * 60 * 24)
    //创建时间对象，将新的时间戳传进去
    var nextMmDate = new Date(nextMm)
    //调用方法，将时间戳转换成日期
    var nextDate = nextMmDate.toLocaleDateString()
    //lt小于 gte大于
    Profile.find({ date: { "$lt": new Date(nextDate), "$gte": new Date(oneDate) } })
        .then(profile => {
            if (!profile) {
                return res.status(404).json('没有任何内容')
            }
            res.json(profile)
        })
        .catch(err => {
            res.status(404).json(err)
        })
})



// @route  GET api/profiles/dates/:date1/:date2
// @desc   根据日期范围获取信息接口（获取几天的数据）
// @access private
router.get('/dates/:date1/:date2',passport.authenticate('jwt', { session: false }), (req, res) => {
    var preDate = req.params.date1
    var numberDate=new Date(req.params.date2).getTime()+(1000 * 60 * 60 * 24)
    var nextDate = new Date(numberDate).toLocaleDateString()
    Profile.find({ date: { "$lt": new Date(nextDate), "$gte": new Date(preDate) } })
        .then(profile=>{
            if(!profile){
                return res.status(404).json('没有任何内容')
            }
            res.json(profile)
        })
        .catch(err=>{
            res.status(404).json(err)
        })
})


// @route  POST api/profiles/edit:id
// @desc   编辑信息接口
// @access private
router.post('/edit:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    const profileFields = {}
    if (req.body.type1) profileFields.type1 = req.body.type1
    if (req.body.type2) profileFields.type2 = req.body.type2
    if (req.body.describe) profileFields.describe = req.body.describe
    if (req.body.income) profileFields.income = req.body.income
    if (req.body.expend) profileFields.expend = req.body.expend
    profileFields.cash = req.body.cash//盈损情况可能为0,不做if判断
    if (req.body.remark) profileFields.remark = req.body.remark
    Profile.findOneAndUpdate(
        { _id: req.params.id },
        { $set: profileFields },
        { new: true }
    ).then(profile => {
        res.json(profile)
    })
})

// @route  delete api/profiles/delete:id
// @desc   删除信息接口
// @access private
router.delete('/delete:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOneAndRemove({ _id: req.params.id })
        .then(profile => {
            profile.save().then(profile => { res.json(profile) })
        })
        .catch(err => {
            res.status(404).json(err)
        })
})






module.exports = router