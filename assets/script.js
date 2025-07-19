// assets/script.js
const inputBox = document.getElementById('inputBox');
const sendBtn = document.getElementById('sendBtn');
const chatBox = document.getElementById('chatBox');
const statusEl = document.getElementById('status');
const toggleThemeBtn = document.getElementById('toggleTheme');

auth.signInAnonymously().catch(console.error);

// Theme toggle
toggleThemeBtn.onclick = () => {
  document.body.classList.toggle('bg-white');
  document.body.classList.toggle('text-black');
  document.body.classList.toggle('bg-dark');
  document.body.classList.toggle('text-white');
};

// Check online/offline status
function updateStatus() {
  statusEl.textContent = navigator.onLine ? '🟢 Online' : '🔌 Offline';
}
window.addEventListener('online', updateStatus);
window.addEventListener('offline', updateStatus);
updateStatus();

// Load chat in realtime
db.collection("messages").orderBy("timestamp", "asc")
  .onSnapshot(snapshot => {
    chatBox.innerHTML = '';
    snapshot.forEach(doc => {
      const msg = doc.data();
      const div = document.createElement('div');
      div.className = 'bubble ' + (msg.sender === 'user' ? 'user' : 'ai');
      div.textContent = msg.text;
      chatBox.appendChild(div);
    });
    chatBox.scrollTop = chatBox.scrollHeight;
  });

// Send new message
sendBtn.onclick = async () => {
  const text = inputBox.value.trim();
  if (!text) return;
  inputBox.value = '';

  await db.collection("messages").add({
    text,
    sender: 'user',
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
  });

  // Simulated AI response (replace with API later)
  await db.collection("messages").add({
    text: `You said: ${text}`,
    sender: 'ai',
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
  });
};
