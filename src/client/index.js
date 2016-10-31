const blessed = require('blessed');
const io = require('socket.io-client');

const config = require('../config');

const startChat = require('./startChat');

const socket = io(`http://localhost:${config.port}`);

const screen = blessed.screen({
  smartCSR: true,
  title: 'Blessed Chat 🚀',
});

const initBox = blessed.box({
  label: 'Please input your name',
  top: 'center',
  left: 'center',
  width: '50%',
  height: 3,
  border: {
    type: 'line',
  },
});

const initInput = blessed.textbox({
  parent: initBox,
  inputOnFocus: true,
});

initInput.key('enter', () => {
  const name = initInput.getValue();
  if (!name) return;

  screen.remove(initBox);

  startChat({
    screen,
    socket,
    name,
  });
});

initInput.key(['C-c'], () => process.exit(0));

screen.append(initBox);
screen.render();
initInput.focus();
