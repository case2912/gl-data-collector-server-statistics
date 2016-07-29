import "babel-polyfill"
import koa from "koa"
import koaRouter from "koa-router"
import bodyParser from "koa-bodyparser"
const app = new koa()
const router = new koaRouter()
router.get('/', async(ctx, next) => {
    ctx.response.set("Access-Control-Allow-Origin", "*")
    await next();
    ctx.response.body = "this is test!";
})
app.listen(process.env.PORT || 3000, () => {
    console.log("listening on port" + (process.env.PORT || 3000))
})
app.use(bodyParser()).use(router.routes()).use(router.allowedMethods())
