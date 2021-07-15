const mongoose = require('mongoose');
const mongo = require('mongodb');
require('dotenv').config();
const dbURL = process.env.DB_URL
mongoose.connect(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex : true,
});
const db = mongoose.connection;
const Schema = mongoose.Schema;
const roomSchema = new Schema({
    _roomId: Schema.Types.ObjectId,
    name: {
        type: String,
        require: true
    },
    status:  Boolean,
    useable:  Boolean,
    img:  {
        type: String
    }
});
const room = module.exports = mongoose.model("rooms", roomSchema);
module.exports.createRoom = (newRoom, callBack) => {
    newRoom.save(callBack);
}
module.exports.getAllData = (callBack) => {
    room.find({}, callBack);
}
module.exports.getRoomById = (id, callBack) => {
    room.findById({
        _id : id
    }, callBack);
}
module.exports.getRoomByFilter = (filter, callBack) => {
    room.find(filter,callBack);
}
module.exports.updateById = (id, dataupdate, callBack) => {
    room.findByIdAndUpdate(id, dataupdate, callBack);
}