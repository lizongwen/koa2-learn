const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const pv = require('./middleware/koa-pv')

//导入session中间件
const session = require('koa-generic-session')
//导入redis中间件
const Redis = require('koa-redis')
//导入mongoose中间件
const mongoose = require('mongoose')
//导入数据库自定义配置
const dbConfig = require('./dbs/config')

const index = require('./routes/index')
const users = require('./routes/users')

// error handler
onerror(app)
//定义session加密key值
app.keys = ['aaa']
//使用session中间件
app.use(session({
	key: 'session',
	prefix: '',
	store: new Redis()
}))
// middlewares
app.use(bodyparser({
	enableTypes: ['json', 'form', 'text']
}))
app.use(pv())
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
	extension: 'ejs'
}))

// logger
app.use(async (ctx, next) => {
	const start = new Date()
	await next()
	const ms = new Date() - start
	console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
console.log(index.routes())
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())

//使用mongoose链接mongodb数据库
mongoose.connect(dbConfig.dbs, {
	useNewUrlParser: true,
	useUnifiedTopology: true
})
// error-handling
app.on('error', (err, ctx) => {
	console.error('server error', err, ctx)
});

module.exports = app
