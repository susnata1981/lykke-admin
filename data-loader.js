// "-L52sQ0zG9MdZa5z4sLd" : {
//   "businessKey" : "MamarBari",
//   "order" : {
//     "gross" : 112330,
//     "items" : {
//       "Item 1" : "10",
//       "Item 11" : "110",
//       "Item 2" : "11",
//       "Item 3" : "1"
//     },
//     "total" : 1123300
//   },
//   "payment" : {
//     "amount" : 3000
//   },
//   "status" : "COMPLETE",
//   "timeCreated" : 1518336061610,
//   "userKey" : "-L44gd7KdtpFUxBU8C8D"
// }

const _ = require('lodash');
const moment = require('moment');
const checkins = {};

function randomString(len) {
  const alphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const L = alphabets.length - 1;
  let id = [];
  _.range(0, 19).forEach(i => id.push(alphabets[Math.floor(Math.random() * L)]));
  return id.join('');
}

function createKey() {
  return '-' + randomString(15)
}

const businesses = ['MamarBari', 'Masir Bari', 'Rubir Bari', 'Test', 'Test2'];

function getBusinessKey() {
  return businesses[_.random(0, businesses.length-1)]
}

const users = ['-L44fkSUkkGSBoP9v7Xo', '-L44gd7KdtpFUxBU8C8D'];
function getUserKey() {
  return users[_.random(0, users.length - 1)];
}

function createCheckin() {
  let checkin = {};
  checkin.businessKey = getBusinessKey();
  checkin.order = {
    gross: parseFloat((Math.random() * 9999).toFixed(2)),
    items: {
      "Item 1": parseInt(Math.floor(Math.random() * 999)),
      "Item 11": parseInt(Math.floor(Math.random() * 999)),
      "Item 2": parseInt(Math.floor(Math.random() * 999)),
      "Item 3": parseInt(Math.floor(Math.random() * 999))
    },
    total: parseFloat((Math.random() * 9999).toFixed(2)),
  }

  checkin.payment = {
    amount: parseFloat((Math.random() * 999).toFixed(2)),
  }

  checkin.status = "COMPLETE";
  checkin.timeCreated = moment().subtract(_.random(1, 100), 'days').subtract(_.random(180), 'minutes').valueOf()
  checkin.timeCompleted = moment(checkin.timeCreated).add(_.random(1800, 3600), 'seconds').valueOf()
  checkin.userKey = getUserKey();
  return checkin;
}

_.times(50, () => {
  checkins[createKey()] = createCheckin();
});

console.log(JSON.stringify(checkins));
