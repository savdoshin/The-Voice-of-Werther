import { API_KEY } from './API_KEY.js';
import { SYSTEM_PROMPT } from './prompt.js';

const chat = document.getElementById('chat');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const statusEl = document.getElementById('status');

let conversation = [
    { role: "system", content: SYSTEM_PROMPT }
];

function addMessage(text, type) {
    const div = document.createElement('div');
    div.className = `message ${type}`;
    div.textContent = text;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
}

sendBtn.addEventListener('click', async () => {
    const message = userInput.value.trim();
    if (!message) return;

    addMessage(message, 'user');
    conversation.push({ role: "user", content: message });
    userInput.value = '';
    statusEl.textContent = 'Сократ думает...';

    try {
        const response = await fetch('https://api.x.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "grok-4.5", // или grok-4
                messages: conversation,
                temperature: 0.7,
                max_tokens: 1200
            })
        });

        const data = await response.json();
        const reply = data.choices[0].message.content;
        
        addMessage(reply, 'socrates');
        conversation.push({ role: "assistant", content: reply });
    } catch (e) {
        addMessage('Ошибка соединения. Проверь API ключ.', 'socrates');
    }
    
    statusEl.textContent = '';
});

// Enter для отправки
userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendBtn.click();
    }
});