// DOM Elements
const setupContainer = document.querySelector('.setup-container');
const chatContainer = document.querySelector('.chat-container');
const startChatBtn = document.getElementById('start-chat-btn');
const resetBtn = document.getElementById('reset-btn');
const apiKeyInput = document.getElementById('api-key');
const topicSelect = document.getElementById('topic-select');
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const loadingSpinner = document.getElementById('loading-spinner');
const apiKeyError = document.getElementById('api-key-error');
const topicError = document.getElementById('topic-error');
const customInstructionsContainer = document.getElementById('custom-instructions-container');
const customInstructions = document.getElementById('custom-instructions');
const topicCards = document.querySelectorAll('.topic-card');
const chatHeaderIcon = document.getElementById('chat-header-icon');
const chatHeaderTitle = document.getElementById('chat-header-title');
const chatHeader = document.querySelector('.chat-header');
const minimizeBtn = document.getElementById('minimize-btn');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon-path');

// State
let apiKey = '';
let currentTopic = '';
let chatHistory = [];
let currentTheme = localStorage.getItem('theme') || 'light';

// Theme icons paths
const themeIcons = {
    light: "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z",
    dark: "M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
};

// Topic configs with system prompts
const topics = {
    chess: {
        name: "Chess Strategist",
        systemPrompt: "You are an experienced chess coach. You can analyze positions, suggest openings, discuss strategies, explain concepts, and provide training advice. You can help with chess puzzles, game improvement, and understanding famous games. You understand chess notation and can discuss both classical and modern approaches to the game.",
        icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 22H5v-2h14v2M17.16 8.26A9.001 9.001 0 0 1 12 20c-2.9 0-5.44-1.37-7.08-3.5A9.001 9.001 0 0 1 9.54 6.63A3.62 3.62 0 0 1 12 2c1.5 0 2.5.5 3.5 2.32a3.62 3.62 0 0 1 1.66 3.94z"/></svg>`
    },
    photography: {
        name: "Photography Pro",
        systemPrompt: "You are an enthusiastic photography expert with deep knowledge of camera technology, composition techniques, lighting, and post-processing. You can advise on gear selection, shooting techniques for different scenarios, and photo editing workflows. You're familiar with both digital and film photography across all genres.",
        icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h3l2-2h6l2 2h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm8 3a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"/></svg>`
    },
    f1: {
        name: "F1 Analyst",
        systemPrompt: "You are a knowledgeable Formula 1 racing expert. You can discuss teams, drivers, race strategies, technical regulations, race history, and current season developments. You can analyze race performances, explain technical aspects of F1 cars, and provide insights into team dynamics and driver rivalries.",
        icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.08 3.11H5.77L6.85 7zM19 17H5v-5h14v5z"/></svg>`
    },
    fitness: {
        name: "Fitness Coach",
        systemPrompt: "You are a certified health and fitness coach. You provide expert advice on exercise routines, nutrition plans, recovery techniques, and overall wellness. You can create personalized workout plans, suggest healthy recipes, and offer tips for maintaining motivation. Your advice is science-based and tailored to individual needs and goals.",
        icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 16c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zm1-11h-2v3H8v2h3v3h2v-3h3v-2h-3V8z"/></svg>`   
    },
    tech: {
        name: "Tech Advisor",
        systemPrompt: "You are a technology expert with comprehensive knowledge of consumer electronics, software, and emerging tech trends. You can compare devices, troubleshoot technical issues, explain complex concepts in simple terms, and recommend products based on user needs. You stay updated on the latest developments in computing, mobile, smart home, and entertainment technologies.",
        icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1.06-5.17l-1.41-1.41 1.06-1.06 1.41 1.41 3.54-3.54 1.06 1.06-4.6 4.6zm-2.84-5.83h1.5v-1.5h-1.5v1.5zM10.5 8c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5z"/></svg>`
    },
    custom: {
        name: "Custom Assistant",
        systemPrompt: "",
        icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5zm7.43-2.53c.04-.32.07-.64.07-.97 0-.33-.03-.66-.07-.97l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65A.488.488 0 0 0 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.31-.07.64-.07.97 0 .33.03.66.07.97l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65z"/></svg>`
    }
};

// Initialize theme
function initTheme() {
    document.documentElement.setAttribute('data-theme', currentTheme);
    themeIcon.setAttribute('d', themeIcons[currentTheme]);
    localStorage.setItem('theme', currentTheme);
}

// Toggle theme
function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    initTheme();
}

// Event Listeners
startChatBtn.addEventListener('click', startChat);
resetBtn.addEventListener('click', resetChat);
sendBtn.addEventListener('click', sendMessage);
minimizeBtn.addEventListener('click', resetChat);
themeToggle.addEventListener('click', toggleTheme);

chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Topic card selection
topicCards.forEach(card => {
    card.addEventListener('click', () => {
        // Remove selected class from all cards
        topicCards.forEach(c => c.classList.remove('selected'));
        
        // Add selected class to this card
        card.classList.add('selected');
        
        // Update the hidden select value
        const topic = card.getAttribute('data-topic');
        topicSelect.value = topic;
        
        // Show/hide custom instructions
        if (topic === 'custom') {
            customInstructionsContainer.classList.add('active');
        } else {
            customInstructionsContainer.classList.remove('active');
        }
    });
});

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    
    const elements = document.querySelectorAll('.topic-card');
    elements.forEach((el, index) => {
        el.style.animationDelay = `${0.1 + index * 0.1}s`;
        el.classList.add('fade-in');
    });
});

// Functions
function startChat() {
    apiKey = apiKeyInput.value.trim();
    currentTopic = topicSelect.value;
    
    // Validate inputs
    let valid = true;
    
    if (!apiKey) {
        apiKeyError.textContent = "Please enter a valid API key";
        valid = false;
    } else {
        apiKeyError.textContent = "";
    }
    
    if (!currentTopic) {
        topicError.textContent = "Please select an expert";
        valid = false;
    } else {
        topicError.textContent = "";
    }
    
    if (currentTopic === 'custom' && !customInstructions.value.trim()) {
        topicError.textContent = "Please provide custom instructions";
        valid = false;
    }
    
    if (!valid) return;

    // If custom topic, use the custom instructions
    if (currentTopic === 'custom') {
        topics.custom.systemPrompt = customInstructions.value.trim();
    }

    // Setup chat
    setupContainer.style.display = 'none';
    chatContainer.style.display = 'flex';
    
    // Set expert-specific styling
    chatHeader.setAttribute('data-topic', currentTopic);
    
    // Set chat header
    chatHeaderIcon.innerHTML = topics[currentTopic].icon;
    chatHeaderTitle.textContent = topics[currentTopic].name;
    
    // Add initial bot message
    addBotMessage(`Hello! I'm your ${topics[currentTopic].name}. How can I assist you today?`);
}

function resetChat() {
    chatHistory = [];
    setupContainer.style.display = 'block';
    chatContainer.style.display = 'none';
    chatMessages.innerHTML = '';
    apiKeyInput.value = apiKey; // Preserve API key for convenience
    chatHeader.removeAttribute('data-topic');
}

async function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;
    
    // Add user message to chat
    addUserMessage(message);
    chatInput.value = '';
    
    // Save to history
    chatHistory.push({ role: "USER", message });
    
    // Show loading spinner
    loadingSpinner.style.display = 'block';
    
    try {
        const response = await getCohereResponse(message);
        addBotMessage(formatResponse(response));
        chatHistory.push({ role: "CHATBOT", message: response });
    } catch (error) {
        console.error("Error getting response:", error);
        addBotMessage("Sorry, I encountered an error. Please try again.");
    } finally {
        loadingSpinner.style.display = 'none';
    }
}

function formatResponse(text) {
    // Convert markdown-like formatting to HTML
    let formattedText = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
        .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italics
        .replace(/^-\s(.*$)/gm, '<li>$1</li>') // List items
        .replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>') // Wrap lists
        .replace(/\n\n/g, '</p><p>') // Paragraphs
        .replace(/\n/g, '<br>'); // Line breaks
    
    // Ensure proper paragraph wrapping
    if (!formattedText.startsWith('<p>')) {
        formattedText = '<p>' + formattedText;
    }
    if (!formattedText.endsWith('</p>')) {
        formattedText = formattedText + '</p>';
    }
    
    return formattedText;
}

async function getCohereResponse(message) {
    try {
        const response = await fetch('https://api.cohere.ai/v1/chat', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                message: message,
                model: "command",
                chat_history: formatChatHistory(),
                preamble: topics[currentTopic].systemPrompt,
                temperature: 0.7,
                max_tokens: 1000
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `API error: ${response.status}`);
        }
        
        const data = await response.json();
        return data.text;
    } catch (error) {
        console.error("Cohere API error:", error);
        throw error;
    }
}

function formatChatHistory() {
    return chatHistory.map(item => ({
        role: item.role,
        message: item.message
    }));
}

function addUserMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', 'user-message', 'fade-in');
    messageElement.textContent = message;
    chatMessages.appendChild(messageElement);
    scrollToBottom();
}

function addBotMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', 'bot-message', 'fade-in');
    messageElement.innerHTML = message;
    chatMessages.appendChild(messageElement);
    scrollToBottom();
}

function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
