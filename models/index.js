let messages = {
  1: {
    id: '1',
    text: 'Hello World',
    userId: 1
  },
  2: {
    id: '2',
    text: '2222 By World',
    userId: 2
  },
};

let users = {
  1: {
    id: 1,
    firstname: 'Robin',
    lastname: 'Wieruch',
    messageIds: [1],
  },
  2: {
    id: 2,
    firstname: 'Dave',
    lastname: 'Davids',
    messageIds: [2],
  },
};

module.exports = {
  users,
  messages
}