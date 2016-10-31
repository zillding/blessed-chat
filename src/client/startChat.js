const blessed = require('blessed');

const events = require('../events');

const { CHAT_MESSAGE } = events;

module.exports = ({ screen, socket, name }) => {
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

  socket.on(CHAT_MESSAGE, ({ username, text }) => {
    chatLog.log(`-> ${username}: ${text}`);
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

  const input = blessed.textbox({
    parent: inputBox,
    inputOnFocus: true,
  });

  input.key('enter', () => {
    const text = input.getValue();
    chatLog.log(`{right}${text} <-{/right}`);
    socket.emit(CHAT_MESSAGE, {
      username: name,
      text,
    });

    input.clearValue();
    input.focus();
  });

  input.key(['C-c'], () => process.exit(0));

  screen.append(chatBox);
  screen.append(inputBox);

  screen.render();

  input.focus();
};
