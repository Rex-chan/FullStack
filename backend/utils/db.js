var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/project", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

//构建users的model
var userSchema = mongoose.Schema({
    username: String,
    password: String
});

var Users = mongoose.model("users", userSchema);

//构建satffs的model
var staffsSchema = mongoose.Schema({
    staffsName: String,
    staffsSex: Number,
    entryDate: String,
    department: Number,
    station: String,
    education: Number,
    phoneNumber: String,
    position: String,
    remark: String
});

var staffs = mongoose.model("staffs", staffsSchema);
exports.Users = Users
exports.staffs = staffs
