const express = require('express');
const data = './models/data.json';
const {
    WebhookClient
} = require('dialogflow-fulfillment');
const {
    Card,
    Suggestion,
    Payload
} = require('dialogflow-fulfillment');
const router = express.Router();
const {
    getCovid
} = require('../controller/linemessage');
const {
    getResponse,getAppointment
} = require('../controller/room');
router.get('/', async (req, res) => {
    const dataCovid = await getCovid();
    return res.status(200).json({
        status: true,
        data: dataCovid,
    });
});
router.post('/',async (req, res) => {
    const agent = new WebhookClient({
        request: req,
        response: res
    });
    async function welcome(agent) {
        try {
            console.log("---------------------line welcome---------------------------");
            let payloadJson = await getResponse();
            let messageText = payloadJson.type === 'sticker' ? 'ห้องถูกจองเต็มหมดแล้วครับ' : 'เลือกห้องต่อไปนี้';
            let payload = new Payload("LINE", payloadJson, {
                sendAsMessage: true
            });
            agent.add(messageText);
            agent.add(payload);
        } catch (error) {
            console.error(error);
        }
    }
    async function appointment(agent) {
        try {
            console.log("---------------------line welcome appointment---------------------------");
            let payloadJson = await getAppointment();
            console.log(payloadJson);
            let messageText = 'เลือกวันและเวลาที่ต้องการ';
            let payload = new Payload("LINE", payloadJson, {
                sendAsMessage: true
            });
            agent.add(messageText);
            agent.add(payload);
        } catch (error) {
            console.error(error);
        }
    }

    let intentMap = new Map();
    intentMap.set('Default Welcome Intent', welcome);
    intentMap.set('Reserve time', welcome);
    intentMap.set('appointment', appointment);
    agent.handleRequest(intentMap);
});
module.exports = router;