const mongoose = require('mongoose');
require('dotenv').config();
const ObjectId = require('mongoose').Types.ObjectId; 
const dbURL = process.env.DB_URL;

mongoose.connect(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex : true,
});
const db = mongoose.connection;
const Schema = mongoose.Schema;
const bookingSchema = new Schema({
    _bookingId: Schema.Types.ObjectId,
    username: {
        type: String
    },
    room_id: Schema.Types.ObjectId,
    room_name: {
        type: String
    },
    bookingStart: Date,
    bookingEnd: Date,
});
const booking = module.exports = mongoose.model("booking", bookingSchema);
module.exports.createBooking = (newBooking, callBack) => {
    newBooking.save(callBack);
}
module.exports.checkOverlap = (startDate, endDate, roomId, callBack) => {
    booking.find({ 
        room_id: new ObjectId(roomId),
        $or: [ 
          { bookingStart: { $lt: endDate, $gte: startDate } }, 
          { bookingEnd: { $lte: endDate, $gt: startDate } }
        ] 
      },callBack);
}
module.exports.checkOverlapWithoutRoom = (startDate, endDate, callBack) => {
    booking.find({ 
        $or: [ 
          { bookingStart: { $lt: endDate, $gte: startDate } }, 
          { bookingEnd: { $lte: endDate, $gt: startDate } }
        ] 
      },callBack);
}
module.exports.getAllData = (callBack) => {
    booking.find({}, callBack);
}