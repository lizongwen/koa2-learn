function pv(ctx) {
	// console.log(ctx.session)
	// ctx.session.count++
	// console.log(ctx.session)
}

module.exports = function () {
	return async function (ctx, next) {
		pv(ctx)
		await next();
	}
}