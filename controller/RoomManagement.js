const room = require('../models/rooms');
function createRoom(newRoom){
    return new Promise((resolve, reject) => {
        room.createRoom(newRoom, function(err, data){
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
        room.getAllData(function(err, data){
            if(err){
                reject(err);
            }
            else{
                resolve(data);
            }
        });
    });
}
function getRoomById(id){
    return new Promise((resolve, reject) => {
        room.getRoomById(id,function(err, data){
            if(err){
                reject(err);
            }
            else{
                resolve(data);
            }
        });
    });
}
function getRoomByFilter(filter){
    return new Promise((resolve, reject) => {
        room.getRoomByFilter(filter,function(err, data){
            if(err){
                reject(err);
            }
            else{
                resolve(data);
            }
        });
    });
}

function updateById(id, dataUpdate){
    return new Promise((resolve, reject) => {
        room.updateById(id,dataUpdate,function(err, data){
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
    createRoom,
    getAllData,
    getRoomById,
    getRoomByFilter,
    updateById
}