import "babel-polyfill"
import koa from "koa"
import koaRouter from "koa-router"
import bodyParser from "koa-bodyparser"
import {sendData, query, createTables, update} from "./db"
import {CronJob} from "cron";
const app = new koa()
const router = new koaRouter()
router.get('/', async(ctx, next) => {
    ctx.response.set("Access-Control-Allow-Origin", "*")
    await next()
    ctx.response.body = await sendData()
})
router.get('/:key', async(ctx, next) => {
    ctx.response.set("Access-Control-Allow-Origin", "*")
    await next()
    ctx.response.body = await query(ctx.params.key)
})
app.listen(process.env.PORT || 3000, () => {
    console.log("listening on port " + (process.env.PORT || 3000))
})
app.use(bodyParser()).use(router.routes()).use(router.allowedMethods())
const init = async() => {
    await createTables()
    await update()
    await console.log("table is updated!")
}
init()
