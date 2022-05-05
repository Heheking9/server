const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//定义数据类型
const userSchema = new Schema({
  adminname: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  role: {
    type: String,
    require: true,
  },
  isAdmin: {
    type: Boolean, //是否是管理员
    default: false, //默认false 管理员身份修改数据库即可
  },
  date: {
    type: Date,
    default: Date,
  },
});
//基于数据结构创建一个叫User的表(首字母大写) 数据库中自动生成叫users
module.exports = mongoose.model("User", userSchema);
