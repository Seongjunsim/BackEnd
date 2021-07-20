// @ts-check

//IIFE
(() => {
  const socket = new WebSocket(`ws://${window.location.host}/ws`);
  const formEl = document.getElementById('form');
  const chatsEl = document.getElementById('chats');
  /** @type {HTMLInputElement|null} */
  // @ts-ignore
  const inputEl = document.getElementById('input');

  if (!formEl || !inputEl || !chatsEl) throw new Error('Init failed!');

  /**
   * @typedef Chat
   * @property {string} message
   * @property {string} nickname
   *
   */

  /**
   * @type {Chat[]}
   */
  const chats = [];

  const adjectives = ['멋진', '훌륭한', '친절한', '새침한'];
  const animals = ['물법', '사자', '호랑이', '악어'];
  /**
   *
   * @param {string[]} array
   * @returns {string}
   */
  function pickRandom(array) {
    const randomINdex = Math.floor(Math.random() * array.length);
    const result = array[randomINdex];
    if (!result) throw new Error('errere');
    return result;
  }

  const nickname = `${pickRandom(adjectives)} ${pickRandom(animals)}`;

  formEl.addEventListener('submit', (event) => {
    event.preventDefault();
    socket.send(
      JSON.stringify({
        message: inputEl.value,
        nickname,
      })
    );
    inputEl.value = '';
  });

  const drawChats = () => {
    chatsEl.innerHTML = '';
    chats.forEach(({ message, nickname }) => {
      const div = document.createElement('div');
      div.innerText = `${nickname} : ${message}`;
      chatsEl.appendChild(div);
    });
  };

  socket.addEventListener('message', (event) => {
    const { type, payload } = JSON.parse(event.data);
    if (type === 'sync') {
      const { chats: syncedChats } = payload;
      chats.push(...syncedChats);
    } else if (type === 'chat') {
      const chat = payload;
      chats.push(chat);
    }

    drawChats();
  });
})();
