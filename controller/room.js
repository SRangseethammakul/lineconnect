const data = './models/data.json';
const fs = require('fs');
const path = require('path');
const dataRoom = JSON.parse(fs.readFileSync(data));
const format = require('date-fns/format');
const parseISO = require('date-fns/parseISO');
async function getResponse() {
    let response = '';
    let res = await dataRoom.filter(item => item.status === true && item.useable === true).map((item) => ({
      imageUrl: item.img,
      action: {
        type: "postback",
        "label": `เลือกห้อง ${item.name}`,
        "data": `action=re&roomId=${item.id}`
      }
    }));
    if (res.length) {
      response = {
        "type": "template",
        "altText": "template",
        "template": {
          "type": "image_carousel",
          "columns": res
        }
      }
    } else {
      response = 
        {
          "type": "sticker",
          "packageId": "6136",
          "stickerId": "10551391"
        }
    }
      return response;
    }
    async function reserveRoom(roomId, dataMessage) {
      let res = await dataRoom.find(element => element.id === parseInt(roomId));
      let result = format(new Date(), "yyyy-MM-dd'T'HH:mm");
      let payLoad = {
        "type": "flex",
        "altText": "โปรดเลือกวันและเวลา",
        "contents": {
          "type": "bubble",
          "hero": {
            "type": "image",
            "url": `${res.img}`,
            "size": "full",
            "aspectRatio": "20:13",
            "aspectMode": "cover",
            "action": {
              "type": "uri",
              "uri": "http://linecorp.com/"
            }
          },
          "body": {
            "type": "box",
            "layout": "vertical",
            "contents": [{
                "type": "text",
                "text": `ห้องประชุม ${res.name}`,
                "weight": "bold",
                "size": "xl"
              },
              {
                "type": "box",
                "layout": "baseline",
                "margin": "md",
                "contents": [{
                    "type": "icon",
                    "size": "sm",
                    "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png"
                  },
                  {
                    "type": "icon",
                    "size": "sm",
                    "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png"
                  },
                  {
                    "type": "icon",
                    "size": "sm",
                    "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png"
                  },
                  {
                    "type": "icon",
                    "size": "sm",
                    "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png"
                  },
                  {
                    "type": "icon",
                    "size": "sm",
                    "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gray_star_28.png"
                  },
                  {
                    "type": "text",
                    "text": "4.0",
                    "size": "sm",
                    "color": "#999999",
                    "margin": "md",
                    "flex": 0
                  }
                ]
              },
              {
                "type": "box",
                "layout": "vertical",
                "margin": "lg",
                "spacing": "sm",
                "contents": [{
                  "type": "box",
                  "layout": "baseline",
                  "spacing": "sm",
                  "contents": [{
                      "type": "text",
                      "text": "Place",
                      "color": "#aaaaaa",
                      "size": "sm",
                      "flex": 1
                    },
                    {
                      "type": "text",
                      "text": "Miraina Tower, 4-1-6 Shinjuku, Tokyo",
                      "wrap": true,
                      "color": "#666666",
                      "size": "sm",
                      "flex": 5
                    }
                  ]
                }]
              }
            ]
          },
          "footer": {
            "type": "box",
            "layout": "vertical",
            "spacing": "sm",
            "contents": [{
                "type": "button",
                "style": "link",
                "height": "sm",
                "action": {
                  "type": "datetimepicker",
                  "label": "จองวันและเวลาเริ่มต้น",
                  "data": dataMessage,
                  "mode": "datetime",
                  "min": result
                }
              },
              {
                "type": "spacer",
                "size": "sm"
              }
            ],
            "flex": 0
          }
        }
      };
      return payLoad;
    }
    async function reserveRoomEnd(roomId, dataMessage, resultDate) {
      let res = await dataRoom.find(element => element.id === parseInt(roomId));
      let resultStartDate = format(resultDate, 'PPPPpp');
      let result = format(resultDate, "yyyy-MM-dd'T'HH:mm");
      let payLoad = {
        "type": "flex",
        "altText": "โปรดเลือกวันและเวลา",
        "contents": {
          "type": "bubble",
          "hero": {
            "type": "image",
            "url": res.img,
            "size": "full",
            "aspectRatio": "20:13",
            "aspectMode": "cover",
            "action": {
              "type": "uri",
              "uri": "http://linecorp.com/"
            }
          },
          "body": {
            "type": "box",
            "layout": "vertical",
            "contents": [{
                "type": "text",
                "text": `ห้องประชุม ${res.name}`,
                "weight": "bold",
                "size": "xl"
              },
              {
                "type": "box",
                "layout": "baseline",
                "margin": "md",
                "contents": [{
                    "type": "icon",
                    "size": "sm",
                    "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png"
                  },
                  {
                    "type": "icon",
                    "size": "sm",
                    "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png"
                  },
                  {
                    "type": "icon",
                    "size": "sm",
                    "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png"
                  },
                  {
                    "type": "icon",
                    "size": "sm",
                    "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png"
                  },
                  {
                    "type": "icon",
                    "size": "sm",
                    "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gray_star_28.png"
                  },
                  {
                    "type": "text",
                    "text": "4.0",
                    "size": "sm",
                    "color": "#999999",
                    "margin": "md",
                    "flex": 0
                  }
                ]
              },
              {
                "type": "box",
                "layout": "vertical",
                "margin": "lg",
                "spacing": "sm",
                "contents": [{
                  "type": "box",
                  "layout": "baseline",
                  "spacing": "sm",
                  "contents": [{
                      "type": "text",
                      "text": "เริ่มต้น",
                      "color": "#aaaaaa",
                      "size": "sm",
                      "flex": 1
                    },
                    {
                      "type": "text",
                      "text": `${resultStartDate}`,
                      "wrap": true,
                      "color": "#666666",
                      "size": "sm",
                      "flex": 5
                    }
                  ]
                }]
              },
              {
                "type": "box",
                "layout": "vertical",
                "margin": "lg",
                "spacing": "sm",
                "contents": [{
                  "type": "box",
                  "layout": "baseline",
                  "spacing": "sm",
                  "contents": [{
                      "type": "text",
                      "text": "Place",
                      "color": "#aaaaaa",
                      "size": "sm",
                      "flex": 1
                    },
                    {
                      "type": "text",
                      "text": "Miraina Tower, 4-1-6 Shinjuku, Tokyo",
                      "wrap": true,
                      "color": "#666666",
                      "size": "sm",
                      "flex": 5
                    }
                  ]
                }]
              }
            ]
          },
          "footer": {
            "type": "box",
            "layout": "vertical",
            "spacing": "sm",
            "contents": [{
                "type": "button",
                "style": "link",
                "height": "sm",
                "action": {
                  "type": "datetimepicker",
                  "label": "จองวันและเวลาสิ้นสุด",
                  "data": `${dataMessage}&dateStart=${result}`,
                  "mode": "datetime",
                  "initial": result,
                  "min": result
                }
              },
              {
                "type": "spacer",
                "size": "sm"
              }
            ],
            "flex": 0
          }
        }
      };
      return payLoad;
    }
    async function reserveRoomSuccess(roomId, resultEndDate, resultStartDate, userId) {
      console.log(userId);
      let res = await dataRoom.find(element => element.id === parseInt(roomId));
      let updated = {
        "id": res.id,
        "name": res.name,
        "status": false,
        "useable": false,
        "img": res.img
      }
      let targetIndex = dataRoom.indexOf(res);
      dataRoom.splice(targetIndex, 1, updated);
      fs.writeFileSync(data, JSON.stringify(dataRoom));
      let payLoad = {
        "type": "flex",
        "altText": "ข้อมูล",
        "contents": {
          "type": "bubble",
          "hero": {
            "type": "image",
            "url": res.img,
            "size": "full",
            "aspectRatio": "20:13",
            "aspectMode": "cover",
            "action": {
              "type": "uri",
              "uri": "http://linecorp.com/"
            }
          },
          "body": {
            "type": "box",
            "layout": "vertical",
            "spacing": "md",
            "contents": [{
                "type": "text",
                "text": res.name,
                "wrap": true,
                "weight": "bold",
                "gravity": "center",
                "size": "xl"
              },
              {
                "type": "box",
                "layout": "baseline",
                "margin": "md",
                "contents": [{
                    "type": "icon",
                    "size": "sm",
                    "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png"
                  },
                  {
                    "type": "icon",
                    "size": "sm",
                    "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png"
                  },
                  {
                    "type": "icon",
                    "size": "sm",
                    "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png"
                  },
                  {
                    "type": "icon",
                    "size": "sm",
                    "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png"
                  },
                  {
                    "type": "icon",
                    "size": "sm",
                    "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gray_star_28.png"
                  },
                  {
                    "type": "text",
                    "text": "4.0",
                    "size": "sm",
                    "color": "#999999",
                    "margin": "md",
                    "flex": 0
                  }
                ]
              },
              {
                "type": "box",
                "layout": "vertical",
                "margin": "lg",
                "spacing": "sm",
                "contents": [{
                    "type": "box",
                    "layout": "baseline",
                    "spacing": "sm",
                    "contents": [{
                        "type": "text",
                        "text": "เริ่มต้น",
                        "color": "#aaaaaa",
                        "size": "sm",
                        "flex": 1
                      },
                      {
                        "type": "text",
                        "text": resultStartDate,
                        "wrap": true,
                        "size": "sm",
                        "color": "#666666",
                        "flex": 4
                      }
                    ]
                  }, {
                    "type": "box",
                    "layout": "baseline",
                    "spacing": "sm",
                    "contents": [{
                        "type": "text",
                        "text": "สิ้นสุด",
                        "color": "#aaaaaa",
                        "size": "sm",
                        "flex": 1
                      },
                      {
                        "type": "text",
                        "text": resultEndDate,
                        "wrap": true,
                        "size": "sm",
                        "color": "#666666",
                        "flex": 4
                      }
                    ]
                  },
                  {
                    "type": "box",
                    "layout": "baseline",
                    "spacing": "sm",
                    "contents": [{
                        "type": "text",
                        "text": "Place",
                        "color": "#aaaaaa",
                        "size": "sm",
                        "flex": 1
                      },
                      {
                        "type": "text",
                        "text": "7 Floor, No.3",
                        "wrap": true,
                        "color": "#666666",
                        "size": "sm",
                        "flex": 4
                      }
                    ]
                  },
                  {
                    "type": "box",
                    "layout": "baseline",
                    "spacing": "sm",
                    "contents": [{
                        "type": "text",
                        "text": "Seats",
                        "color": "#aaaaaa",
                        "size": "sm",
                        "flex": 1
                      },
                      {
                        "type": "text",
                        "text": "C Row, 18 Seat",
                        "wrap": true,
                        "color": "#666666",
                        "size": "sm",
                        "flex": 4
                      }
                    ]
                  }
                ]
              },
              {
                "type": "box",
                "layout": "vertical",
                "margin": "xxl",
                "contents": [{
                    "type": "spacer"
                  },
                  {
                    "type": "image",
                    "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/linecorp_code_withborder.png",
                    "aspectMode": "cover",
                    "size": "xl"
                  },
                  {
                    "type": "text",
                    "text": "You can enter the theater by using this code instead of a ticket",
                    "color": "#aaaaaa",
                    "wrap": true,
                    "margin": "xxl",
                    "size": "xs"
                  }
                ]
              }
            ]
          }
        }
      };
      return payLoad;
    }
    module.exports = {
      getResponse,
      reserveRoom,
      reserveRoomEnd,
      reserveRoomSuccess
    }