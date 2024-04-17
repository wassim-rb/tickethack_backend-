var express = require('express');
var router = express.Router();


const Trip = require('../models/trips');
const Booking = require('../models/bookings');
const Cart = require('../models/carts');





/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET trips from search*/
router.get('/trips/:departure/:arrival/:date', async (req, res) => {
  const { departure, arrival, date } = req.params;

   
  if (!departure || !arrival || !date) {
    return res.send('Departure, arrival, and date must be provided.');
  }

  const searchDate = new Date(date);
  searchDate.setUTCHours(0, 0, 0, 0);
  console.log(searchDate)

  const endDate = new Date(date);
  endDate.setUTCHours(23, 59, 59, 999);
  console.log(endDate)
 
    const availableTrips = await Trip.find({
      departure: departure,
      arrival: arrival,
      date: {
        $gte: searchDate,
        $lte: endDate
      }
    });
    console.log(availableTrips)
    
    if (!availableTrips.length) {
      return res.json({ message: 'No trips found.' });
    }

    res.json(availableTrips);
  
});

/* POST trips in cart */
router.post('/cart', async (req, res) => {
    
    const tripId = req.body._id;
    const trip = await Trip.findById(tripId);

    if (!trip) {
      return res.json({ result: false, error: 'No ticket found with the given ID' });
    }
   
    let cart = await new Cart({ trips: [], total: 0 });

    
    cart.trips.push(trip._id);
    cart.total += trip.price;
    
    await cart.save();
    
    const response = {
      result: true,
      cart: {
        departure: trip.departure,
        arrival: trip.arrival,
        price: trip.price,
        total: cart.total,
        _id: cart._id,
        __v: cart.__v
      }
    };  
    res.json(response);
});

/* GET trips in cart */
router.get('/cart', (req, res) => {
  Cart.find().then(data => {
    res.json({ allTrips: data });
  })
})

/* POST trips in booking */
router.post('/booking', async (req, res) => {
    
  const tripId = req.body._id;
  const trip = await Trip.findById(tripId);

  if (!trip) {
    return res.json({ result: false, error: 'No booking found with the given ID' });
  }
  
  let booking = await new Booking({ trips: []});
  
  booking.trips.push(trip._id);
  
  await booking.save();

  const response = {
    result: true,
    booking: {
      departure: trip.departure,
      arrival: trip.arrival,
      price: trip.price,
      _id: booking._id,
    }
  };

  res.json(response);
});

/* GET trips in booking */
router.get('/booking', (req, res) => {
  Booking.find().then(data => {
    res.json({ allTrips: data });
  })
})


/* DELETE trips in cart 
router.delete('/cart/:_id', async (req, res) => {
  const searchedTrip = Cart.find(e => e._id === req.params._id);
  
 if (searchedTrip) {
    Cart = Cart.filter(e => e._id !== req.params._id);
    res.json({ result: true, Cart });
  } else {
    res.json({ result: false, error: 'Trip not found' });
  }
});*/
const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart'); // Make sure to require the Cart model correctly based on your project structure

// DELETE route to remove a trip from the cart by the trip's ID
router.delete('/trip/:tripId', async (req, res) => {
  try {
    const tripIdToRemove = req.params.tripId;
    // Since there's no user context, we'll assume there's a single cart in your DB
    const cart = await Cart.findOne(); // This would need to be adjusted if there are multiple carts

    if (cart) {
      const tripIndex = cart.trips.findIndex((tripId) => tripId.toString() === tripIdToRemove);
      if (tripIndex > -1) {
        cart.trips.splice(tripIndex, 1); // Remove the trip from the array
        // Optionally, recalculate the total price here if necessary
        await cart.save(); // Save the updated cart
        res.json({ result: true, cart });
      } else {
        res.status(404).json({ result: false, error: 'Trip not found in the cart' });
      }
    } else {
      res.status(404).json({ result: false, error: 'Cart not found' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ result: false, error: 'An internal error occurred' });
  }
});

module.exports = router;





module.exports = router;
