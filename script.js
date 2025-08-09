// ⚠️ REPLACE 'YOUR_API_KEY_HERE' WITH YOUR ACTUAL GOOGLE GEMINI API KEY
const GOOGLE_API_KEY = "AIzaSyDc6Roevgxm9EQCRS5fqKPMUB9QB1rKucA";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GOOGLE_API_KEY}`;

// Create animated background particles
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
        particlesContainer.appendChild(particle);
    }
}

// Button ripple effect
function createRipple(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.className = 'btn-ripple';
    
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Actual API call to Google Gemini
async function translateText() {
    const input = document.getElementById('userInput').value.trim();
    const btn = document.getElementById('translateBtn');
    const btnText = document.getElementById('btnText');
    const resultContainer = document.getElementById('resultContainer');
    const resultText = document.getElementById('resultText');
    const warning = document.getElementById('warning');
    
    // Hide warning
    warning.style.display = 'none';
    
    if (!input) {
        warning.style.display = 'block';
        return;
    }

    // Check if API key is set
    if (GOOGLE_API_KEY === "YOUR_API_KEY_HERE") {
        showError('Please add your Google API key to the JavaScript code.');
        return;
    }
    
    // Show loading state
    btn.disabled = true;
    btnText.innerHTML = '<div class="loading"></div>';
    resultContainer.classList.remove('show');
    
    const prompt = `Translate the following text into modern Gen Z internet slang. Use abbreviations, short forms, and a casual tone. The output should be a single, short sentence. Do not add any extra explanations or phrases like 'Here is the translated text'. Only provide the translated sentence.

Original text: '${input}'
Translated text: `;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const translation = data.candidates[0].content.parts[0].text.trim();
        
        // Show result
        resultText.textContent = translation;
        resultContainer.classList.add('show');
        
    } catch (error) {
        console.error('Translation error:', error);
        showError(`Translation failed: ${error.message}`);
    } finally {
        // Reset button
        btn.disabled = false;
        btnText.textContent = 'Translate';
    }
}

function showError(message) {
    const warning = document.getElementById('warning');
    warning.textContent = message;
    warning.style.display = 'block';
}

function copyResult() {
    const resultText = document.getElementById('resultText').textContent;
    const copyBtn = document.getElementById('copyBtn');
    
    navigator.clipboard.writeText(resultText).then(() => {
        copyBtn.textContent = '✅';
        setTimeout(() => {
            copyBtn.textContent = '📋';
        }, 2000);
    });
}

// Add event listeners
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    
    const translateBtn = document.getElementById('translateBtn');
    translateBtn.addEventListener('click', createRipple);
    
    // Allow Enter key to translate
    document.getElementById('userInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            translateText();
        }
    });

});
