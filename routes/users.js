const router = require("koa-router")();

//引入users数据表
const User = require("../model/User");
let path = require("path");
let fs = require("fs");
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
      role: ctx.request.body.role || "user",
      checkedKeys: ctx.request.body.checkedKeys,
      level: ctx.request.body.level,
    });
    //返回给客户端 一定要await 否则会返回Not Found
    await newUser
      .save()
      .then((user) => {
        // console.log(user);
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
  // console.log(ctx.request.body);
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
    // console.log(result);

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

router.get("/list", async (ctx) => {
  //接收参数 post
  const findResult = await User.find();
  console.log(findResult);
  if (findResult) {
    ctx.body = {
      code: 200,
      msg: "用户删除成功",
      data: findResult,
    };
  }
});

router.post("/upload", async (ctx) => {
  //接收参数 post
  // console.log(ctx.request.body);
  const fileData = [ctx.request.body];
  var myDate = new Date();
  var date = myDate.toLocaleDateString();
  var hours = myDate.getHours();
  var minutes = myDate.getMinutes();
  var seconds = myDate.getSeconds();
  console.log(fileData);
  fileData[0].fileData.map((el, ind) => {
    // if(el.key==='')
    el.key = ind;
  });
  fileData[0].creatTime = date + " " + hours + ":" + minutes + ":" + seconds;
  let file = path.join(__dirname, `../public/upload/data.json`);

  fs.exists(file, function (exists) {
    if (exists) {
      const data = fs.readFileSync(file, "utf8");

      // parse JSON string to JSON object
      const config = JSON.parse(data);
      // console.log(config);
      let sum = config.concat(fileData);
      // console.log(fileData);
      fs.writeFile(file, JSON.stringify(sum), function (err) {});
    } else {
      fs.writeFile(file, JSON.stringify(fileData), function (err) {
        if (err) {
          console.log(err);
        } else {
        }
      });
    }
  });
  ctx.body = {
    code: 200,
    msg: "文件创建成功~",
  };
  // let file = path.join(__dirname, `../public/upload/data.json`);
  // fs.writeFile(file, JSON.stringify(fileData), function (err) {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //   }
  // });
  // ctx.body = {
  //   code: 200,
  //   msg: "文件创建成功~",
  // };
  // if (findResult) {
  //
  // }
});

router.post("/editAcess", async (ctx) => {
  //接收参数 post
  console.log(ctx.request.body);
  let findResult = await User.find({
    adminname: ctx.request.body.adminName,
  });

  findResult = await User.updateOne(
    {
      adminname: ctx.request.body.adminname,
    },
    {
      role: ctx.request.body.role,
      checkedKeys: ctx.request.body.checkedKeys,
      level: ctx.request.body.level,
    }
  );
  console.log(findResult);
  if (findResult.acknowledged) {
    // ctx.status = 404;
    ctx.body = {
      status: 200,
      message: "修改成功",
    };
    // ctx.body = {
    //   status: 404,
    //   message: "用户不存在",
    // };
  }
  // console.log(findResult);
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
  // console.log(findResult);
});

router.post("/getAdminData", async (ctx) => {
  //接收参数 post
  // console.log(ctx.request.body);
  // const findResult = await User.find({
  //   adminname: ctx.request.body.Oldadminname,
  // });
  const { adminname } = ctx.request.body;
  const findResult = await User.find({ adminname });
  let file = path.join(__dirname, `../public/upload/data.json`);

  const data = fs.readFileSync(file, "utf8");

  // parse JSON string to JSON object
  let config = JSON.parse(data);
  console.log(findResult);
  if (findResult[0].role === "user") {
    config = config.filter((el) => {
      console.log(el.level, 123123);
      if (el.level) {
        return (
          el.author === findResult[0].adminname ||
          el.level.some((ele) => {
            return findResult[0].level.indexOf(ele) !== -1;
          })
        );
      } else {
        return true;
      }

      // if (el.level) {
      //   return (
      //     el.level.length + findResult[0].level.length !==
      //     Array.from(new Set([...el.level, ...findResult[0].level])).length
      //   );
      // } else {
      //   return el.level == "";
      // }
    });
  }
  // console.log(config);
  // console.log(config);
  ctx.body = {
    data: config,
    code: 200,
  };
});

router.post("/getLineData", async (ctx) => {
  //接收参数 post
  // console.log(ctx.request.body);
  // const findResult = await User.find({
  //   adminname: ctx.request.body.Oldadminname,
  // });
  let file = path.join(__dirname, `../public/upload/data.json`);

  const data = fs.readFileSync(file, "utf8");

  // parse JSON string to JSON object
  const config = JSON.parse(data);
  console.log(ctx.request.body);
  const { creatTime } = ctx.request.body;
  let lineData = config.filter((el) => {
    return el.creatTime === creatTime;
  });
  // console.log(config);
  ctx.body = {
    data: lineData,
    code: 200,
  };
});

router.post("/deleteData", async (ctx) => {
  //接收参数 post
  // console.log(ctx.request.body);
  // const findResult = await User.find({
  //   adminname: ctx.request.body.Oldadminname,
  // });
  console.log(ctx.request.body);
  const { creatTime } = ctx.request.body;

  let file = path.join(__dirname, `../public/upload/data.json`);

  const data = fs.readFileSync(file, "utf8");

  // parse JSON string to JSON object
  let config = JSON.parse(data);
  config = config.filter((el) => {
    return el.creatTime !== creatTime;
  });
  fs.writeFile(file, JSON.stringify(config), function (err) {});

  console.log(config);
  ctx.body = {
    data: config,
    code: 200,
  };
});
router.post("/updateData", async (ctx) => {
  //接收参数 post
  // console.log(ctx.request.body);
  // const findResult = await User.find({
  //   adminname: ctx.request.body.Oldadminname,
  // });
  console.log(ctx.request.body);

  let file = path.join(__dirname, `../public/upload/data.json`);

  // const data = fs.readFileSync(file, "utf8");

  // // parse JSON string to JSON object
  // let config = JSON.parse(data);
  // config = config.filter((el) => {
  //   return el.creatTime !== creatTime;
  // });
  fs.writeFile(file, JSON.stringify(ctx.request.body), function (err) {});

  ctx.body = {
    code: 200,
  };
});

module.exports = router;
