async function loadMessages() {
  const res = await fetch('/messages');
  const messages = await res.json();
  const feed = document.getElementById('feed');
  feed.innerHTML = '';
  messages.forEach(msg => {
    const div = document.createElement('div');
    div.className = 'message';
    div.innerHTML = `
      <p>${msg.content}</p>
      ${msg.image ? `<img src="/uploads/${msg.image}" alt="image">` : ''}
      <span>${new Date(msg.date).toLocaleString()}</span>
    `;
    feed.appendChild(div);
  });
}
loadMessages();
setInterval(loadMessages, 10000);