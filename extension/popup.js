const chatEl = document.getElementById('chat');
const modeEl = document.getElementById('mode');
const promptEl = document.getElementById('prompt');
const sendBtn = document.getElementById('send');
const micBtn = document.getElementById('mic');
const stopVoiceBtn = document.getElementById('stopVoice');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const canRecognize = Boolean(SpeechRecognition);

if (!canRecognize) {
  micBtn.disabled = true;
  micBtn.title = 'Speech recognition is not available in this browser.';
}

function pushBubble(text, role) {
  const bubble = document.createElement('div');
  bubble.className = `bubble bubble--${role}`;
  bubble.textContent = text;
  chatEl.appendChild(bubble);
  chatEl.scrollTop = chatEl.scrollHeight;
}

function generateAgentReply(input) {
  const clean = input.trim().toLowerCase();

  if (clean.includes('hello') || clean.includes('hi') || clean.includes('hey')) {
    return 'Hey! Main ready hoon. Aap jo chahein puchho 🚀';
  }

  if (clean.includes('task') || clean.includes('plan')) {
    return 'Bilkul. Main aapke liye task ko small steps me tod sakta hoon, priority set kar sakta hoon, aur action plan de sakta hoon.';
  }

  if (clean.includes('code') || clean.includes('program')) {
    return 'Main coding help de sakta hoon: idea, architecture, bug fix strategy, aur sample code snippets.';
  }

  if (clean.includes('voice')) {
    return 'Voice mode ON rakhoge to main jawab bol kar sunaunga bhi.';
  }

  return `Samajh gaya: "${input}". Main is request ke liye ek structured answer bana sakta hoon, step-by-step.`;
}

function speak(text) {
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  window.speechSynthesis.speak(utterance);
}

function handleSend() {
  const userText = promptEl.value.trim();
  if (!userText) return;

  pushBubble(userText, 'user');
  promptEl.value = '';

  const reply = generateAgentReply(userText);
  const mode = modeEl.value;

  if (mode === 'text' || mode === 'both') {
    pushBubble(reply, 'agent');
  }

  if (mode === 'voice' || mode === 'both') {
    speak(reply);
  }
}

sendBtn.addEventListener('click', handleSend);
promptEl.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') handleSend();
});

micBtn.addEventListener('click', () => {
  if (!canRecognize) return;

  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.start();
  micBtn.textContent = '🎙️ Listening...';

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    promptEl.value = transcript;
    handleSend();
  };

  recognition.onerror = () => {
    pushBubble('Voice input me issue aaya. Please phir se try karo.', 'agent');
  };

  recognition.onend = () => {
    micBtn.textContent = '🎤 Speak';
  };
});

stopVoiceBtn.addEventListener('click', () => {
  window.speechSynthesis.cancel();
});

pushBubble('Assalam-o-alaikum! Main Meow AI Agent hoon. Type karo ya mic use karo.', 'agent');
