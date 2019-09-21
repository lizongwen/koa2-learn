const mongoose = require('mongoose')

let personSchema = new mongoose.Schema({
	name: String,
	age: Number
});

let Person = mongoose.model('Person', personSchema)
module.exports = Person