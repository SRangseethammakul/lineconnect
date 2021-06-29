const Booking = require('../models/booking');
function createBooking(newBooking){
    return new Promise((resolve, reject) => {
        Booking.createBooking(newBooking, function(err, data){
            if(err){
                reject(err);
            }
            else{
                resolve(data);
            }
        });
    });
}

function checkTimeOverlab(startDate, endDate, roomId){
    return new Promise((resolve, reject) => {
        Booking.checkOverlap(startDate, endDate, roomId, function(err, data){
            if(err){
                reject(err);
            }
            else{
                resolve(data);
            }
        });
    });
}

module.exports = {
    createBooking,
    checkTimeOverlab
}