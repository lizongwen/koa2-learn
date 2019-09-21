const router = require('koa-router')()
const Redis = require('koa-redis')
const Person = require('../dbs/models/person')

const Store = new Redis().client
router.prefix('/users')

router.get('/', function (ctx, next) {
	ctx.body = 'this is a users response!'
})

router.get('/bar', function (ctx, next) {
	ctx.body = 'this is a users/bar response'
})

router.get('/fix', async function (ctx) {
	const st = await Store.hset('fix', 'name', Math.random())
	ctx.body = {
		code: 0
	}
})

router.post('/addPerson', async function (ctx) {
	let person = new Person({
		name: ctx.request.body.name,
		age: ctx.request.body.age
	}), code;
	try {
		await person.save();
		code = 0
	} catch (error) {
		code = -1
	}

	ctx.body = {
		code
	}
})

router.post('/getPerson', async function (ctx) {
	let code, result, results;
	try {
		result = await Person.findOne({
			name: ctx.request.body.name
		});
		results = await Person.find({
			name: ctx.request.body.name
		});
		code = 0
	} catch (error) {
		code = -1
	}
	ctx.body = {
		code,
		result,
		results
	}
})

router.post('/updatePerson', async function (ctx) {
	let code;
	try {
		result = await Person.where({
			name: ctx.request.body.name
		}).update({
			age: ctx.request.body.age
		})
		code = 0
	} catch (error) {
		code = -1
	}
	ctx.body = {
		code
	}
})

router.post('/removePerson', async function (ctx) {
	let code;
	try {
		result = await Person.where({
			name: ctx.request.body.name
		}).remove()
		code = 0
	} catch (error) {
		code = -1
	}
	ctx.body = {
		code
	}
})

module.exports = router
