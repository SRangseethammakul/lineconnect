const axios = require('axios');
const formatDistanceToNow = require('date-fns/formatDistanceToNow');
const parseISO = require('date-fns/parseISO');
async function getCovid() {
  try {
    const response = await axios.get('https://covid19.th-stat.com/api/open/today');
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

async function getPolution(lat, lng) {
  try {
    const AIR_KEY = process.env.AIR_KEY;
    const URL = `http://api.airvisual.com/v2/nearest_city?lat=${lat}&lon=${lng}&key=${AIR_KEY}`;
    const response = await axios.get(URL);
    const {
      city,
      state,
      country,
      location,
      current
    } = response.data.data;
    let _color = '';
    if(current.pollution.aqius <= 50){
      _color = '#5FB072';
    }else if(current.pollution.aqius > 50 && current.pollution.aqius <= 100) {
      _color = '#FFC38B';
    }else if(current.pollution.aqius > 100 && current.pollution.aqius <= 150) {
      _color = '#EB987A';
    }else if(current.pollution.aqius > 150 && current.pollution.aqius <= 200) {
      _color = '#D22C2C';
    }else if(current.pollution.aqius > 200 && current.pollution.aqius <= 300) {
      _color = '#6E1B09';
    }else{
      _color = '#451F1E';
    }
    const resultDate = formatDistanceToNow(parseISO(current.pollution.ts));
    let payloadJson = {
      "type": "flex",
      "altText": "คุณภาพอากาศ",
      "contents": {
        "type": "bubble",
        "size": "mega",
        "header": {
          "type": "box",
          "layout": "vertical",
          "contents": [{
            "type": "box",
            "layout": "vertical",
            "contents": [{
                "type": "text",
                "text": "คุณภาพอากาศ",
                "color": "#ffffff66",
                "size": "sm"
              },
              {
                "type": "text",
                "text": `${city}`,
                "color": "#ffffff",
                "size": "xl",
                "weight": "bold"
              },
              {
                "type": "text",
                "text": `${state}`,
                "color": "#ffffff",
                "size": "xl",
                "weight": "bold"
              },
              {
                "type": "text",
                "text": `${country}`,
                "color": "#ffffff",
                "size": "xl",
                "weight": "bold"
              }
            ]
          }],
          "paddingAll": "20px",
          "backgroundColor": _color,
          "spacing": "md",
          "height": "154px",
          "paddingTop": "25px",
          "paddingBottom": "none",
          "paddingStart": "xxl"
        },
        "body": {
          "type": "box",
          "layout": "vertical",
          "contents": [{
              "type": "text",
              "text": `${resultDate}`,
              "color": "#b7b7b7",
              "size": "xs"
            },
            {
              "type": "box",
              "layout": "horizontal",
              "contents": [{
                  "type": "text",
                  "text": "คุณภาพอากาศ",
                  "gravity": "center",
                  "size": "sm",
                  "position": "absolute"
                },
                {
                  "type": "text",
                  "text": `${current.pollution.aqius}`,
                  "gravity": "center",
                  "flex": 4,
                  "size": "sm",
                  "align": "end"
                }
              ],
              "spacing": "xxl",
              "cornerRadius": "30px",
              "margin": "md"
            },
            {
              "type": "box",
              "layout": "horizontal",
              "contents": [{
                  "type": "text",
                  "text": "อุณหภูมิ",
                  "gravity": "center",
                  "size": "sm",
                  "position": "absolute"
                },
                {
                  "type": "text",
                  "text": `${current.weather.tp}`,
                  "gravity": "center",
                  "flex": 4,
                  "size": "sm",
                  "align": "end"
                }
              ],
              "spacing": "lg",
              "cornerRadius": "30px",
              "margin": "sm"
            },
            {
              "type": "box",
              "layout": "horizontal",
              "contents": [{
                  "type": "text",
                  "text": "ความชื้น",
                  "gravity": "center",
                  "size": "sm",
                  "position": "absolute"
                },
                {
                  "type": "text",
                  "text": `${current.weather.hu}`,
                  "gravity": "center",
                  "flex": 4,
                  "size": "sm",
                  "align": "end"
                }
              ],
              "spacing": "lg",
              "cornerRadius": "30px",
              "margin": "sm"
            },
            {
              "type": "box",
              "layout": "horizontal",
              "contents": [{
                  "type": "text",
                  "text": "ลม",
                  "gravity": "center",
                  "size": "sm",
                  "position": "absolute"
                },
                {
                  "type": "text",
                  "text": `${current.weather.wd}`,
                  "gravity": "center",
                  "flex": 4,
                  "size": "sm",
                  "align": "end"
                }
              ],
              "spacing": "lg",
              "cornerRadius": "30px",
              "margin": "sm"
            }
          ],
          "paddingAll": "xxl"
        }
      }
    }
    return payloadJson;
  } catch (error) {
    console.error(error);
  }
}
module.exports = {
  getCovid,
  getPolution
}