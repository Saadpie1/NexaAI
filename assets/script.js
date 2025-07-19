import { auth, db } from '../firebase/firebase-config.js';

const inputBox = document.getElementById('inputBox');
const sendBtn = document.getElementById('sendBtn');
const chatBox = document.getElementById('chatBox');
const statusEl = document.getElementById('status');
const aiSelect = document.getElementById('aiSelect');

function updateStatus() {
  statusEl.textContent = navigator.onLine ? '🟢 Online' : '🔌 Offline';
}
window.addEventListener('online', updateStatus);
window.addEventListener('offline', updateStatus);
updateStatus();

auth.onAuthStateChanged(user => {
  if (!user) {
    window.location.href = "signup.html";
    return;
  }
  const uid = user.uid;
  const messagesRef = db.collection("messages").doc(uid).collection("convo");

  messagesRef.orderBy("timestamp").onSnapshot(snapshot => {
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

  sendBtn.onclick = async () => {
    const text = inputBox.value.trim();
    if (!text) return;
    inputBox.value = '';
    await messagesRef.add({
      text,
      sender: 'user',
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    let aiResponse = "Processing...";

    if (aiSelect.value === 'steve') {
      const res = await fetch("https://steveai-api.example.com/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text })
      });
      const data = await res.json();
      aiResponse = data.reply || "SteveAI: (no reply)";
    } else {
      aiResponse = "ChatGPT is not yet connected.";
    }

    await messagesRef.add({
      text: aiResponse,
      sender: 'ai',
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
  };
});

window.logout = function () {
  auth.signOut().then(() => window.location.href = "signup.html");
};
