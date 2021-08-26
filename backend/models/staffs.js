const { staffs } = require("../utils/db")

const findStaff = (staffsName) => {
    return staffs.findOne({ staffsName })
}

const inserStaffs = ({ staffsName, staffsSex, entryDate, department, station, education, phoneNumber, position, remark }) => {
    console.log(department)
    console.log(staffsName)

    const data = new staffs({
        staffsName,
        staffsSex,
        entryDate,
        department,
        station,
        education,
        phoneNumber,
        position,
        remark
    })
    return data.save()
}
const findAll = async () => {
    let totalElements = staffs.count({}, function (err, doc) {
        if (!err) {
            return doc
        }
    });
    return totalElements
}

const queryStaffs = async ({ staffsName, staffsSex, size, page }) => {
    let data = staffs.find({}).skip((page - 1) * parseInt(size)).limit(parseInt(size)).sort({ _id: -1 })
    return data
}
const remove = (id) => {
    return staffs.deleteOne({ _id: id })
}
const update = (data) => {
    return staffs.findByIdAndUpdate(data._id, data)
}
exports.inserStaffs = inserStaffs
exports.findStaff = findStaff
exports.queryStaffs = queryStaffs
exports.findAll = findAll
exports.remove = remove
exports.update = update
