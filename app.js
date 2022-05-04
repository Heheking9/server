const Koa = require("koa");
const app = new Koa();
const views = require("koa-views");
const json = require("koa-json");
const onerror = require("koa-onerror");
const bodyparser = require("koa-bodyparser");
const logger = require("koa-logger");
const cors = require("koa2-cors"); // 新增部分处理跨域
const mongoose = require("mongoose");
const index = require("./routes/index");
const users = require("./routes/users");
//引入users数据表
const User = require("./model/User");
// error handler
onerror(app);

app.use(cors()); // 新增部分处理跨域

//连接数据库 数据库名webstack
mongoose
  .connect("mongodb://localhost:27017/admin", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("数据库连接成功");
    //监听端口
    app.listen(8888, () => {
      console.log("服务端已开启: http://localhost:8888");
    });
  })
  .catch(() => {
    console.log("数据库连接失败");
  });

// middlewares
app.use(
  bodyparser({
    enableTypes: ["json", "form", "text"],
  })
);
app.use(json());
app.use(logger());
app.use(require("koa-static")(__dirname + "/public"));

app.use(
  views(__dirname + "/views", {
    extension: "pug",
  })
);

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// routes
app.use(index.routes(), index.allowedMethods());
app.use(users.routes(), users.allowedMethods());

// error-handling
app.on("error", (err, ctx) => {
  console.error("server error", err, ctx);
});

module.exports = app;
