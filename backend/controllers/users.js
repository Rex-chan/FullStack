const userModel = require("../models/users")
const { hash } = require("../utils/tools")
//注册
const signup = async (req, res, next) => {
    res.set('content-type', 'application/json;charset=utf-8')
    const { username, password } = req.body
    console.log(password)
    //加密密码
    const bcryptPassword = await hash(password)

    //判断用户是否存在
    let findUser = await userModel.findUser(username)
    if (findUser) {
        res.render('fail', {
            data: JSON.stringify({
                message: '用户已存在'
            })
        })
    } else {
        let dbres = await userModel.signup({
            username,
            password: bcryptPassword
        })
        res.render('succ', {
            data: JSON.stringify({ message: '注册成功' })
        })
    }
}

exports.signup = signup