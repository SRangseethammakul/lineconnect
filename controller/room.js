const data = './models/data.json';
const fs = require('fs');
const dataRoom = JSON.parse(fs.readFileSync(data));
const format = require('date-fns/format');
const parseISO = require('date-fns/parseISO');
const Booking = require('../models/booking');
const {
  getRoomById,
  getAllData,
  getRoomByFilter
} = require('../controller/RoomManagement');
const {
  createBooking,
  checkTimeOverlab,
  checkTimeOverlabWithoutRoom
} = require('../controller/BookingController');
async function getResponse() {
  let response = '';
  try {
    let filter = {
      status : true,
      useable : true
    }
    let mon_res = await getRoomByFilter(filter);
    let res = await mon_res.map((item) => ({
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
        "altText": "จองเวลา",
        "template": {
          "type": "image_carousel",
          "columns": res
        }
      }
    } else {
      response = {
        "type": "sticker",
        "packageId": "6136",
        "stickerId": "10551391"
      }
    }
  } catch (err) {
    console.log(err.message)
  }
  return response;
}
async function getAppointment() {
  let response = '';
  let result = format(new Date(), "yyyy-MM-dd'T'HH:mm");
  if (true) {
    response = {
      "type": "template",
      "altText": "จองเวลา",
      "template": {
        "type": "buttons",
        "thumbnailImageUrl": "https://www.aver.com/Upload/Expert/31/Main.jpg",
        "imageAspectRatio": "rectangle",
        "imageSize": "cover",
        "imageBackgroundColor": "#FFFFFF",
        "title": "จองเวลา",
        "text": "กรุณาเลือกวันและเวลาที่ต้องการ",
        "actions": [{
          "type": "datetimepicker",
          "label": "Select date",
          "data": "from=appointment",
          "mode": "datetime",
          "initial": result,
          "min": result,
        }]
      }
    }
  }
  return response;
}
async function reserveRoom(roomId, dataMessage) {
  try{
    let res = await getRoomById(roomId);
    // let res_old = await dataRoom.find(element => element.id === parseInt(roomId));
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
  }catch(err){
    console.log(err.message);
  }
}
async function reserveRoomEnd(roomId, dataMessage, resultDate) {
  // let res_old = await dataRoom.find(element => element.id === parseInt(roomId));
  let res = await getRoomById(roomId);
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
async function appintmentRoomEnd(resultDate, startDateISO) {
  startDateISO = format(startDateISO, "yyyy-MM-dd'T'HH:mm");
  let result = resultDate.params.datetime;
  let payLoad = {
    "type": "flex",
    "altText": "โปรดเลือกวันและเวลา",
    "contents": {
      "type": "bubble",
      "hero": {
        "type": "image",
        "url": 'https://www.aver.com/Upload/Expert/31/Main.jpg',
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
            "text": `ห้องประชุม`,
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
                  "text": startDateISO,
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
              "data": `${resultDate.data}&dateStart=${startDateISO}`,
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
async function appintmentRoomSuccess(resultEndDate, resultStartDate) {
  let booking_rooms = await (checkTimeOverlabWithoutRoom(resultStartDate, resultEndDate));
  let getAlldata = await getAllData();
  array1 = await getAlldata.filter(function (n) {
    for (var i = 0; i < booking_rooms.length; i++) {
      if (n.id == booking_rooms[i].room_id) {
        return false;
      }
    }
    return true;
  });
  resultEndDate = format(resultEndDate, "yyyy-MM-dd'T'HH:mm");
  resultStartDate = format(resultStartDate, "yyyy-MM-dd'T'HH:mm");
  let res = await array1.filter(item => item.status === true && item.useable === true).map((item) => ({
    imageUrl: item.img,
    action: {
      type: "postback",
      "label": `เลือกห้อง ${item.name}`,
      "data": `from=select&roomId=${item.id}&endDate=${resultEndDate}&startDate=${resultStartDate}`
    }
  }));
  if (res.length) {
    response = {
      "type": "template",
      "altText": "เลือกห้อง",
      "template": {
        "type": "image_carousel",
        "columns": res
      }
    }
  } else {
    response = {
      "type": "sticker",
      "packageId": "6136",
      "stickerId": "10551391"
    }
  }
  return response;
}
async function appointmentRoomEnd(dataFrom, userId) {
  const [red, ...set] = dataFrom.split('&');
  // let res = await dataRoom.find(element => element.id === parseInt(set[0].split('=')[1]));
  try{
    let res = await getRoomById(set[0].split('=')[1]);
    let dataCheckin = new Booking({
      username: userId,
      room_id: res.id,
      room_name : res.name,
      bookingStart: parseISO(set[2].split('=')[1]),
      bookingEnd: parseISO(set[1].split('=')[1]),
    });
    await (createBooking(dataCheckin));
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
                      "text": format(parseISO(set[2].split('=')[1]), 'PPPP kk:mm'),
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
                      "text": format(parseISO(set[1].split('=')[1]), 'PPPP kk:mm'),
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
  }catch(error){
    console.log(error.message);
  }
}
async function reserveRoomSuccess(roomId, resultEndDate_old, resultStartDate_old, userId) {
  try{
    let payLoad = '';
    let resultEndDate = format(resultEndDate_old, 'PPPP kk:mm');
    let resultStartDate = format(resultStartDate_old, 'PPPP kk:mm');
    // let res = await dataRoom.find(element => element.id === parseInt(roomId));
    let res = await getRoomById(roomId);
    let ckOver = await (checkTimeOverlab(resultStartDate_old, resultEndDate_old, res.id));
    console.log(ckOver);
    if (ckOver.length > 0) {
      payLoad = [{
        "type": "text",
        "text": "ห้องไม่ว่างน่ะจ๊ะ"
      }, {
        "type": "sticker",
        "packageId": "6136",
        "stickerId": "10551391"
      }]
  
      ;
    } else {
      let dataCheckin = new Booking({
        username: userId,
        room_id: res.id,
        room_name : res.name,
        bookingStart: resultStartDate_old,
        bookingEnd: resultEndDate_old,
      });
      await (createBooking(dataCheckin));
      payLoad = {
        "type": "flex",
        "altText": "ข้อมูลการจอง",
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
    }
    return payLoad;
  }catch(error){
    console.log(error.message);
  }
}
module.exports = {
  getResponse,
  getAppointment,
  reserveRoom,
  reserveRoomEnd,
  appintmentRoomSuccess,
  appintmentRoomEnd,
  reserveRoomSuccess,
  appointmentRoomEnd
}