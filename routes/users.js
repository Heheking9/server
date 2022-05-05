const router = require("koa-router")();

//引入users数据表
const User = require("../model/User");

router.prefix("/admin");

router.get("/", function (ctx, next) {
  ctx.body = "this is a users response!";
});

router.get("/bar", function (ctx, next) {
  ctx.body = "this is a users/bar response";
});

router.post("/register", async (ctx) => {
  //接收参数 post
  console.log(ctx.request.body);
  const findResult = await User.find({
    adminname: ctx.request.body.adminname,
  });
  //判断是否存在该用户
  if (findResult.length > 0) {
    //状态码
    ctx.body = {
      status: 400,
      message: "用户名已经被占用",
    };
  } else {
    //存储到数据库
    const newUser = new User({
      password: ctx.request.body.password,
      adminname: ctx.request.body.adminname,
      role: "admin",
    });
    //返回给客户端 一定要await 否则会返回Not Found
    await newUser
      .save()
      .then((user) => {
        console.log(user);
        ctx.status = 200;
        ctx.body = {
          status: 200,
          message: "注册成功",
          userInfo: user,
        };
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

router.post("/login", async (ctx) => {
  //接收参数 post
  console.log(ctx.request.body);
  const findResult = await User.find({
    adminname: ctx.request.body.adminname,
  });
  if (findResult.length == 0) {
    // ctx.status = 404;
    ctx.body = {
      status: 404,
      message: "用户不存在",
    };
  } else {
    //验证密码是否正确
    var result = await User.find({
      adminname: ctx.request.body.adminname,
      password: ctx.request.body.password,
    });
    console.log(result);

    if (result.length > 0) {
      //返回用户信息
      ctx.status = 200;
      ctx.body = {
        status: 200,
        message: "登录成功",
        data: findResult[0],
      };
    } else {
      ctx.body = {
        status: 400,
        message: "密码错误",
      };
    }
  }
});

router.post("/delete", async (ctx) => {
  //接收参数 post
  const findResult = await User.findOneAndDelete({
    adminname: ctx.request.body.adminname,
  });
  if (findResult) {
    ctx.body = {
      code: 200,
      msg: "用户删除成功",
    };
  }
});

router.post("/edit", async (ctx) => {
  //接收参数 post
  console.log(ctx.request.body);
  let findResult = await User.find({
    adminname: ctx.request.body.adminName,
  });
  if (findResult.length > 0) {
    ctx.body = {
      status: 1007,
      message: "用户名已存在",
    };
    return;
  }

  findResult = await User.updateOne(
    {
      adminname: ctx.request.body.Oldadminname,
    },
    {
      adminname: ctx.request.body.adminName,
      password: ctx.request.body.password,
    }
  );
  if (findResult.acknowledged) {
    // ctx.status = 404;
    ctx.body = {
      status: 200,
      message: "用户信息修改成功",
    };
    // ctx.body = {
    //   status: 404,
    //   message: "用户不存在",
    // };
  }
  console.log(findResult);
});

router.get("/list", async (ctx) => {
  //接收参数 post
  console.log(ctx.request.body);
  // const findResult = await User.find({
  //   adminname: ctx.request.body.Oldadminname,
  // });
  const findResult = await User.find();
  // if (findResult.acknowledged) {
  //   // ctx.status = 404;
  ctx.body = {
    status: 200,
    message: "用户信息修改成功",
    data: findResult,
  };
  // ctx.body = {
  //   status: 404,
  //   message: "用户不存在",
  // };
  // }
  console.log(findResult);
});

module.exports = router;
