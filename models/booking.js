const mongoose = require('mongoose');
const mongo = require('mongodb');
const dbURL = "mongodb+srv://suttipong:f4KT023ogZTcrw7X@cluster0.katod.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
mongoose.connect(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
const Schema = mongoose.Schema;
const bookingSchema = new Schema({
    _bookingId: Schema.Types.ObjectId,
    username: {
        type: String
    },
    room_id: {
        type: Number,
        require: true
    },
    bookingStart: Date,
    bookingEnd: Date,
});
const booking = module.exports = mongoose.model("booking", bookingSchema);
module.exports.createBooking = (newBooking, callBack) => {
    newBooking.save(callBack);
}
module.exports.getAllUser = (filter, callBack) => {
    booking.find(filter, callBack);
}
module.exports.checkOverlap = (startDate, endDate, roomId, callBack) => {
    booking.find({ 
        room_id: roomId,
        $or: [ 
          { bookingStart: { $lt: endDate, $gte: startDate } }, 
          { bookingEnd: { $lte: endDate, $gt: startDate } }
        ] 
      },callBack);
}