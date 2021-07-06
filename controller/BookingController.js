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
function checkTimeOverlabWithoutRoom(startDate, endDate){
    return new Promise((resolve, reject) => {
        Booking.checkOverlapWithoutRoom(startDate, endDate, function(err, data){
            if(err){
                reject(err);
            }
            else{
                resolve(data);
            }
        });
    });
}
function getAllData(){
    return new Promise((resolve, reject) => {
        Booking.getAllData(function(err, data){
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
    checkTimeOverlab,
    checkTimeOverlabWithoutRoom,
    getAllData
}