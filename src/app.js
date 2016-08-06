import "babel-polyfill"
import koa from "koa"
import koaRouter from "koa-router"
import bodyParser from "koa-bodyparser"
import {sendAllData, query, createTables, update} from "./db"
import {CronJob} from "cron";
const app = new koa()
const router = new koaRouter({prefix: '/list'})
router.get('/', async(ctx, next) => {
    ctx.response.set("Access-Control-Allow-Origin", "*")
    await next()
    ctx.response.body = await sendAllData()
})
router.get('/:key', async(ctx, next) => {
    ctx.response.set("Access-Control-Allow-Origin", "*")
    await next()
    ctx.response.body = await query(ctx.params.key)
})
router.get('/:key/:key2', async(ctx, next) => {
    ctx.response.set("Access-Control-Allow-Origin", "*")
    await next()
    ctx.response.body = await query(ctx.params.key + ctx.params.key2)
})
router.get('/:key/:key2/:key3', async(ctx, next) => {
    ctx.response.set("Access-Control-Allow-Origin", "*")
    await next()
    ctx.response.body = await query(ctx.params.key + ctx.params.key2 + ctx.params.key3)
})
router.get('/:key/:key2/:key3/:key4', async(ctx, next) => {
    ctx.response.set("Access-Control-Allow-Origin", "*")
    await next()
    ctx.response.body = await query(ctx.params.key + ctx.params.key2 + ctx.params.key3 + ctx.params.key4)
})
app.listen(process.env.PORT || 3000, () => {
    console.log("listening on port " + (process.env.PORT || 3000))
})
app.use(bodyParser()).use(router.routes()).use(router.allowedMethods())
const init = async() => {
    await createTables()
    await update()
    await console.log("table is updated!")
    await console.log('cron start!');
    await new CronJob('00 30 11 * * 1-5', async() => {
        await update()
        await console.log("table is updated!")
    }, null, true, 'America/Los_Angeles')
}
init()
