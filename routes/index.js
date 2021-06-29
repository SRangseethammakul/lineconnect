var express = require('express');
var router = express.Router();
const formatISO = require('date-fns/formatISO');
const Booking = require('../models/booking');
const { createBooking } = require('../controller/BookingController');
let data = new Booking({
  username : 'act',
  room_id : 1,
  bookingEnd : formatISO(new Date()),
  bookingEnd : formatISO(new Date()),
});
router.get('/',async function(req, res, next) {
  try{
    let aa = await(createBooking(data));
    console.log(aa);
    res.render('index', { title: 'Express' });
  }catch(err){
    console.log(err);
  }
});
router.get('/booking', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
