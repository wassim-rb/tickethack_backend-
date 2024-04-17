const mongoose = require('mongoose');

const bookingsSchema = mongoose.Schema({
	trips : [{ type: mongoose.Schema.Types.ObjectId, ref: 'trips' }],
    departure: String,
});

const Booking = mongoose.model('bookings', bookingsSchema);

module.exports = Booking;
