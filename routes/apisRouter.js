var express = require('express');
const fs = require('fs');
var router = express.Router();
const formatISO = require('date-fns/formatISO');
const datas = './models/data.json';
const dataRooms = JSON.parse(fs.readFileSync(datas));
const {
  getAllData
} = require('../controller/BookingController');
function getName(element) {
  let getData = dataRooms.find(ele => ele.id === element.room_id);
  return getData.name;
}
router.get('/',async function (req, res) {
  try{
    let reps = await getAllData();
    let data = reps.map(item => {
      try{
        let rObj = {};
        rObj['title'] = getName(item);
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
router.get('/room',async function (req, res) {
  return res.status(200).json({
    status: true,
    data : dataRooms
  });
});
router.post('/room',async function (req, res) {
  const maxId = dataRooms.reduce(
    (max = 0, room) => (room.id > max ? room.id : max),
    dataRooms[0].id
  );
  let {name, status} = req.body;
  let created = {
    id: maxId+1,
    name:name,
    status: JSON.parse(status),
    useable: true,
    img : 'https://www.antaresoffices.com/wp-content/uploads/2020/04/IMG_4299.jpg'
  };
  dataRooms.push(created);
  fs.writeFileSync(datas, JSON.stringify(dataRooms));
  return res.status(200).json({
    status: true,
    data : dataRooms
  });
});
router.put("/room", (req, res) => {
  try {
    console.log(req.body);
    let {id, status, name} = req.body;
    let found = dataRooms.find((el) => el.id === id);
    if (!found) { 
      return res.status(400).json({
        status: false,
        message: "Data Not Found",
      });
    } else {
      let updated = {
        id: found.id,
        name:name,
        status: JSON.parse(status),
        useable: true,
        img : found.img
      };
      let targetIndex = dataRooms.indexOf(found);
      dataRooms.splice(targetIndex, 1, updated);
      fs.writeFileSync(datas, JSON.stringify(dataRooms));
      return res.status(200).json({
        status: true,
        data: updated,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: false,
      data: error,
    });
  }
});
module.exports = router;