const blessed = require('blessed');
const io = require('socket.io-client');

const config = require('../config');
const events = require('../events');

const { CHAT_MESSAGE } = events;

const screen = blessed.screen({
  smartCSR: true,
  title: 'chat',
});

const chatBox = blessed.box({
  label: 'Chats',
  width: '100%',
  height: '100%-3',
  border: {
    type: 'line',
  },
});

const chatLog = blessed.log({
  parent: chatBox,
  tags: true,
  scrollable: true,
  alwaysScroll: true,
  scrollbar: {
    ch: '',
    inverse: true,
  },
  mouse: true,
});

const inputBox = blessed.box({
  label: 'Type your message (press enter to send)',
  bottom: '0',
  width: '100%',
  height: 3,
  border: {
    type: 'line',
  },
});

const form = blessed.form({
  parent: inputBox,
});

const input = blessed.textbox({
  parent: form,
  inputOnFocus: true,
});

const socket = io(`http://localhost:${config.port}`);

socket.on(CHAT_MESSAGE, msg => {
  chatLog.log(`-> ${msg}`);
});

input.key('enter', () => {
  const text = input.getValue();
  chatLog.log(`{right}${text} <-{/right}`);
  socket.emit(CHAT_MESSAGE, text);

  input.clearValue();
  input.focus();
});

input.key(['C-c'], () => process.exit(0));

screen.append(chatBox);
screen.append(inputBox);

screen.render();

input.focus();
