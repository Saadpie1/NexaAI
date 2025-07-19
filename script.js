// script.js
const chatBox = document.getElementById('chatBox');
const inputBox = document.getElementById('inputBox');
const sendBtn = document.getElementById('sendBtn');
const status = document.getElementById('status');
const toggleTheme = document.getElementById('toggleTheme');

let currentTheme = 'dark';
toggleTheme.onclick = () => {
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.body.classList.toggle('bg-dark');
  document.body.classList.toggle('bg-white');
  document.body.classList.toggle('text-white');
  document.body.classList.toggle('text-black');
};

inputBox.addEventListener('input', () => {
  inputBox.style.height = 'auto';
  inputBox.style.height = inputBox.scrollHeight + 'px';
});

function scrollToBottom() {
  chatBox.scrollTo({ top: chatBox.scrollHeight, behavior: 'smooth' });
}

function createBubble(message, from = 'user') {
  const bubble = document.createElement('div');
  bubble.className = `bubble max-w-[90%] w-fit rounded-xl px-4 py-3 whitespace-pre-wrap break-words ${
    from === 'user' ? 'bg-primary self-end text-white' : 'bg-surface self-start text-gray-100'
  }`;
  bubble.innerText = message;
  chatBox.appendChild(bubble);
  scrollToBottom();
  return bubble;
}

async function sendPrompt() {
  const prompt = inputBox.value.trim();
  if (!prompt) return;

  inputBox.value = '';
  inputBox.style.height = 'auto';

  createBubble(prompt, 'user');

  const botBubble = createBubble('Typing |', 'bot');
  let dots = 0;
  const typingInterval = setInterval(() => {
    dots = (dots + 1) % 4;
    botBubble.innerText = 'Typing' + '.'.repeat(dots);
  }, 300);

  try {
    const res = await fetch("https://steveai-production.up.railway.app/chat", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: prompt })
    });

    const data = await res.json();
    clearInterval(typingInterval);

    botBubble.innerText = data.content || 'Error: No response';

    const speakBtn = document.createElement('button');
    speakBtn.textContent = '🔊';
    speakBtn.className = 'ml-2 text-orange-400 hover:text-orange-300';
    speakBtn.onclick = () => {
      const utter = new SpeechSynthesisUtterance(botBubble.innerText);
      speechSynthesis.speak(utter);
    };

    const refreshBtn = document.createElement('button');
    refreshBtn.textContent = '↻';
    refreshBtn.className = 'ml-2 text-orange-400 hover:text-orange-300';
    refreshBtn.onclick = () => {
      inputBox.value = prompt;
      sendPrompt();
    };

    const btnRow = document.createElement('div');
    btnRow.className = 'flex justify-end gap-2 mt-1';
    btnRow.appendChild(speakBtn);
    btnRow.appendChild(refreshBtn);
    botBubble.appendChild(btnRow);
  } catch (err) {
    clearInterval(typingInterval);
    botBubble.innerText = 'Error connecting to server.';
  }
}

sendBtn.onclick = sendPrompt;
inputBox.addEventListener('keypress', e => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendPrompt();
  }
});

function updateStatus() {
  status.textContent = navigator.onLine ? '🟢 Online' : '🔌 Offline';
}
window.addEventListener('online', updateStatus);
window.addEventListener('offline', updateStatus);
updateStatus();
  
