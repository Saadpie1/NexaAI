// Shared functions for signup and chat:
function showMsg(el, text, isError = false) {
  el.innerText = (isError ? '❌ ' : '') + text;
}

// Signup
window.signUp = function() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const msg = document.getElementById("msg");
  auth.createUserWithEmailAndPassword(email, password)
    .then(ucred => db.collection("users").doc(ucred.user.uid)
      .set({ email: ucred.user.email, createdAt: firebase.firestore.FieldValue.serverTimestamp() }))
    .then(() => showMsg(msg, "Signup complete! Redirecting…"))
    .then(() => setTimeout(() => location.href = "index.html", 1500))
    .catch(e => showMsg(msg, e.message, true));
};

// Sign-in
window.signIn = function() {
  const email = document.getElementById("si_email").value;
  const password = document.getElementById("si_password").value;
  const msg = document.getElementById("si_msg");
  auth.signInWithEmailAndPassword(email, password)
    .then(() => showMsg(msg, "✅ Logged in! Redirecting…"))
    .then(() => setTimeout(() => location.href = "index.html", 1000))
    .catch(e => showMsg(msg, e.message, true));
};

// Sign-out
window.signOut = function() {
  auth.signOut().then(() => location.href = "signup.html");
};

// Auth state and chat init
auth.onAuthStateChanged(user => {
  if (!user) return;

  // If on chat page:
  if (document.getElementById("chatBox")) {
    const chatBox = document.getElementById("chatBox");
    const inputBox = document.getElementById("inputBox");
    const sendBtn = document.getElementById("sendBtn");
    const status = document.getElementById("status");
    const toggleTheme = document.getElementById("toggleTheme");

    toggleTheme.onclick = () => {
      document.body.classList.toggle('bg-dark');
      document.body.classList.toggle('bg-white');
      document.body.classList.toggle('text-white');
      document.body.classList.toggle('text-black');
    };

    const updateStatus = () => status.textContent = navigator.onLine ? '🟢 Online' : '🔌 Offline';
    updateStatus();
    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);

    const scrollToBottom = () => chatBox.scrollTop = chatBox.scrollHeight;

    const createBubble = (msg, from) => {
      const el = document.createElement('div');
      el.className = `bubble max-w-[90%] w-fit rounded-xl px-4 py-3 ${
        from === 'user' ? 'bg-primary self-end text-white' : 'bg-surface self-start text-gray-100'
      }`;
      el.innerText = msg;
      chatBox.appendChild(el);
      scrollToBottom();
      return el;
    };

    const sendPrompt = async () => {
      const prompt = inputBox.value.trim();
      if (!prompt) return;
      inputBox.value = '';
      createBubble(prompt, 'user');
      const botB = createBubble('Typing…', 'bot');
      let dots = 0, typo = setInterval(() => botB.innerText = 'Typing' + '.'.repeat(dots = ++dots % 4), 300);

      try {
        const res = await fetch("https://steveai-production.up.railway.app/chat", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: prompt })
        });
        const data = await res.json();
        clearInterval(typo);
        botB.innerText = data.content || "Error: no response.";
      } catch {
        clearInterval(typo);
        botB.innerText = "❌ Server error.";
      }
    };

    sendBtn.onclick = sendPrompt;
    inputBox.onkeypress = e => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendPrompt(); }
    };
  }
});
