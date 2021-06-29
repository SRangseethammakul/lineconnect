var express = require('express');
var router = express.Router();
const formatISO = require('date-fns/formatISO');
const Booking = require('../models/booking');
const { createBooking } = require('../controller/BookingController');
let data = new Booking({
  username : 'act',
  room_id : 12,
  bookingStart : formatISO(new Date()),
  bookingEnd : formatISO(new Date()),
});
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/new',async function(req, res, next) {
  try{
    let aa = await(createBooking(data));
    console.log(aa);
    res.send('respond with a resource');
  }catch(err){
    console.log(err);
  }
});
module.exports = router;
