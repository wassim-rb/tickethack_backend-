const mongoose = require('mongoose');

const tripsSchema = mongoose.Schema({
	departure: String,
	arrival: String,
	date: Date,
	price: Number,
});

const Trip = mongoose.model('trips', tripsSchema);

module.exports = Trip;
