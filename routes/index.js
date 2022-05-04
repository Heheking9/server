const router = require("koa-router")();
var Mock = require("mockjs"); //引入mockjs

const Random = Mock.Random;

router.get("/", async (ctx, next) => {
  await ctx.render("index", {
    title: "Hello Koa 2!",
  });
});

// router.post("/admin/login", async (ctx, next) => {
//   await ctx.render("index", {
//     title: "Hello Koa 2!",
//   });

//   ctx.body = await Mock.mock({
//     status: "sucess",
//   });
// });

router.get("/string", async (ctx, next) => {
  //116到125 是mock的第一种使用方法，这种方法随机生成1到10个数组但是每个数组的author、title等都一样
  ctx.body = await Mock.mock({
    // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
    "arr|1-10": [
      {
        // 属性 id 是一个自增数，起始值为 1，每次增 1
        "id|+1": 1,
        "author|+1": Random.cname(),
        img: Random.image("100x100"),
        title: Random.csentence(5, 9),
      },
    ],
  });
  //127到141是mock的第二种方法主要使用Random函数来生成 这里生成的title、author等每个都不一样
  // const produceNewsData = function () {
  //   let articles = [];
  //   for (let i = 0; i < 50; i++) {
  //     let newArticleObject = {
  //       title: Random.csentence(5, 30), //  Random.csentence( min, max )
  //       author: Random.cname(), // Random.cname() 随机生成一个常见的中文姓名
  //     };
  //     articles.push(newArticleObject);
  //   }

  //   return {
  //     articles: articles,
  //   };
  // };
  // ctx.body = await produceNewsData();
});
router.get("/string", async (ctx, next) => {
  ctx.body = "koa2 string";
});

router.get("/json", async (ctx, next) => {
  ctx.body = {
    title: "koa2 json",
  };
});

module.exports = router;
