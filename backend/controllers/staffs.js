const staffsModel = require('../models/staffs')
// const queryString = require('querystring')

//新增
const add = async (req, res, next) => {
    res.set('content-type', 'application/json;charset=utf-8')
    // let obj = queryString.parse(req.query)
    const { staffsName } = req.query
    console.log(req.query)
    let findStaff = await staffsModel.findStaff(staffsName)
    if (findStaff) {
        res.render('fail', {
            data: JSON.stringify({
                message: '员工已存在'
            })
        })
    } else {
        let dbres = await staffsModel.inserStaffs(req.query)
        res.render('succ', {
            data: JSON.stringify({ message: '员工创建成功' })
        })
    }
}

//查询
const query = async (req, res, next) => {
    const { staffsName, staffsSex, size, page } = req.query
    console.log('size' + size, 'page' + page)
    const data = await staffsModel.queryStaffs(req.query)
    const totalElements = await staffsModel.findAll()
    console.log('totalElements', totalElements)
    res.render('succ', {
        data: JSON.stringify({
            content: data,
            totalElements: totalElements
        })
    })
}
const remove = async (req, res, next) => {
    res.set('content-type', 'application/json; charset=utf-8')
    const { id } = req.query
    console.log(id)
    let result = await staffsModel.remove(id)
    try {
        if (result.deletedCount > 0) {
            res.render('succ', {
                data: JSON.stringify({
                    message: '删除成功。'
                })
            })
        } else {
            res.render('fail', {
                data: JSON.stringify({
                    message: '删除失败。ID错误'
                })
            })
        }
    } catch (err) {
        res.render('fail', {
            data: JSON.stringify({
                message: '职位删除失败。'
            })
        })
    }
}
const update = async (req, res, next) => {
    res.set('content-type', 'application/json; charset=utf-8')
    console.log(req.query)
    let result = await staffsModel.update(req.query)
    if (result) {
        res.render('succ', {
            data: JSON.stringify({
                message: '职位编辑成功。'
            })
        })
    } else {
        res.render('fail', {
            data: JSON.stringify({
                message: '职位编辑失败。'
            })
        })
    }
}
exports.add = add
exports.query = query
exports.remove = remove
exports.update = update
