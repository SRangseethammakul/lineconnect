const express = require('express');
const fs = require('fs');
const router = express.Router();
const datas = './models/data.json';
const dataRooms = JSON.parse(fs.readFileSync(datas));
const { createRoom,updateById } = require('../controller/RoomManagement');
const passportJWT = require('./middleware/passportJWT');
const Room = require('../models/rooms');
const {
  getAllData
} = require('../controller/BookingController');
const {
  getAllData : allRoom
} = require('../controller/RoomManagement');
router.get('/', [passportJWT.isLogin],async function (req, res) {
  try{
    let reps = await getAllData();
    let data = await reps.map((item) => {
      try{
        let rObj = {};
        rObj['title'] = item.room_name;
        rObj['start'] = item.bookingStart;
        rObj['end'] = item.bookingEnd;
        rObj['extendedProps'] = {
          'room_id' : item.room_id
        };
        return rObj;
      }catch(error){
        console.log(error.message);
      }
    })
    return res.status(200).json({
      status: true,
      data : data
    });
  }catch(err){
    return res.status(200).json({
      status: false,
      data : err.message
    });
  }
});
router.get('/room', [passportJWT.isLogin],async function (req, res) {
  let data = await allRoom();
  return res.status(200).json({
    status: true,
    data : data
  });
});
router.post('/room',async function (req, res) {
  // const maxId = dataRooms.reduce(
  //   (max = 0, room) => (room.id > max ? room.id : max),
  //   dataRooms[0].id
  // );
  try{
    let {name, status} = req.body;
    let dd = new Room({
      "name": name,
      "status": JSON.parse(status),
      "useable": true,
      "img": "https://www.propdna.net/wp-content/uploads/2018/12/11-Meeting-room.jpg"
    });
    let data = await createRoom(dd);
    return res.status(200).json({
      status: true,
      data : data
    });
  }catch(error){
    console.log(error.message);
  }
});
router.put("/room",async (req, res) => {
  try {
    let {_id, status, name} = req.body;
    let found = dataRooms.find((el) => el.id === _id);
    let updated = await updateById(_id,{name : name, status : JSON.parse(status)});
    return res.status(200).json({
      status: true,
      data: updated,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({
      status: false,
      data: error.message,
    });
  }
});

router.get('/testroom',async function (req, res) {
  try{
    let dd = new Room({
      "name": "3A",
      "status": true,
      "useable": true,
      "img": "https://www.propdna.net/wp-content/uploads/2018/12/11-Meeting-room.jpg"
    });
    let data = await createRoom(dd);
    return res.status(200).json({
      status: true,
      data : data
    });
  }catch(err){
    return res.status(200).json({
      status: false,
      data : err.message
    });
  }
});
module.exports = router;