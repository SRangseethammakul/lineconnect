const express = require('express');
const router = express.Router();
const axios = require('axios');
const logger = require('morgan');
const format = require('date-fns/format');
const parseISO = require('date-fns/parseISO');
const formatRFC3339 = require('date-fns/formatRFC3339')
require('dotenv').config();
const {
  Payload
} = require('dialogflow-fulfillment');
const {
  reserveRoom, reserveRoomEnd, reserveRoomSuccess,appintmentRoomEnd,appintmentRoomSuccess,appointmentRoomEnd
} = require('../controller/room');
const {
  getPolution
} = require('../controller/linemessage');
const LINE_MESSAGING_API = 'https://api.line.me/v2/bot/message';
const LINE_HEADER = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${process.env.LINE}`
}
router.get('/', async (req, res) => {
  return res.status(200).json({
    status: true
  });
});
router.post('/', async (req, res) => {
  if (req.method === "POST") {
    let event = req.body.events[0];
    if ((event.type === "message" && event.message.type === "text")) {
      postToDialogflow(req);
    } else if (event.type === "postback") {
      let result = '';
      let payLoad = '';
      let resultStartDate = '';
      let checkRoomId = event.postback.data;
      checkRoomId = checkRoomId.split("=");
      if(checkRoomId[0] === 'from'){
        if(checkRoomId[1] === 'appointment&dateStart'){
          const {data, params} = event.postback;
          const dateStart = data.split("=");
          let startDate = parseISO(dateStart[2]);
          let endDate = parseISO(params.datetime);
          payLoad = await appintmentRoomSuccess(endDate, startDate);
        }
        else{
          if (checkRoomId[1] === 'select&roomId') {
            payLoad = await appointmentRoomEnd(event.postback.data,event.source.userId);
          }else{
            let startDate = parseISO(event.postback.params.datetime);
            payLoad = await appintmentRoomEnd(event.postback, startDate);
          }
        }
      }else{
      if (event.postback.params) {
        let checkStartDate = event.postback.data;
        checkStartDate = checkStartDate.split("=");
        if (checkStartDate[3]) {
          let resultEndDate = parseISO(event.postback.params.datetime);
          resultStartDate = parseISO(checkStartDate[3]);
          payLoad = await reserveRoomSuccess(checkRoomId[2], resultEndDate, resultStartDate, event.source.userId);
        } else {
          result = parseISO(event.postback.params.datetime);
          payLoad = await reserveRoomEnd(checkRoomId[2], event.postback.data, result);
        }
      } else {
        payLoad = await reserveRoom(checkRoomId[2], event.postback.data);
      }
      }
      await reply(event.replyToken, payLoad);
    } else if (event.message.type === "location") {
      try {
        let payload = await getPolution(event.message.latitude, event.message.longitude);
        await reply(event.replyToken, payload);
      } catch (err) {
        console.log(err);
      }
    } else {
      reply(event.replyToken, {
        type: "text",
        text: event.message.type
      });
    }

  }
  return res.status(200).send(req.method);
});
const reply = async (replyToken, message) => {
  try {
    await axios({
      url: `${LINE_MESSAGING_API}/reply`,
      headers: LINE_HEADER,
      method: "post",
      data: JSON.stringify({
        replyToken: replyToken,
        messages: Array.isArray(message)? message :[message]
      })
    });
  } catch (err) {
    console.log('err');
  }
};
const postToDialogflow = async payloadRequest => {
  payloadRequest.headers.host = "dialogflow.cloud.google.com";
  await axios({
    url: process.env.DIALOGFLOW,
    headers: payloadRequest.headers,
    method: "post",
    data: payloadRequest.body
  });
};
module.exports = router;