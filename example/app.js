const path = require("path");
const fs = require("fs");
const Koa = require("koa");
const KoaStatic = require("koa-static");
const KoaBody = require("koa-body");
const KoaLogger = require("koa-logger");
const router = require("koa-router")();

const app = new Koa();

app.use(KoaLogger());
app.use(KoaBody());

router.get("/", (ctx) => {
  // 设置头类型, 如果不设置，会直接下载该页面
  ctx.type = "html";
  const pathUrl = path.join(__dirname, "/views/index.html");
  ctx.body = fs.createReadStream(pathUrl);
});

router.get("/download", (ctx) => {
  ctx.set({
    "Content-Type": "application/octet-stream", //告诉浏览器这是一个二进制文件
    // "Content-Disposition": "attachment; filename=demo.pdf", //告诉浏览器这是一个需要下载的文件
  });
  const file = fs.readFileSync(path.resolve(__dirname,"./demo.pdf"));
  ctx.body = file;
});

app.use(KoaStatic(path.join(__dirname, "../dist")));

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => {
  console.log("server is listen in 3000!");
});
