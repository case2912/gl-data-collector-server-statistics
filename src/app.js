import "babel-polyfill"
import koa from "koa"
import koaRouter from "koa-router"
import bodyParser from "koa-bodyparser"
import {sendData, query} from "./db"
const app = new koa()
const router = new koaRouter()
router.get('/', async(ctx, next) => {
    ctx.response.set("Access-Control-Allow-Origin", "*")
    await next()
    ctx.response.body = await sendData()
})
router.get('/index', async(ctx, next) => {
    ctx.response.set("Access-Control-Allow-Origin", "*")
    await next()
    ctx.response.body = await query("browser_name")
})
app.listen(process.env.PORT || 3000, () => {
    console.log("listening on port" + (process.env.PORT || 3000))
})
app.use(bodyParser()).use(router.routes()).use(router.allowedMethods())
