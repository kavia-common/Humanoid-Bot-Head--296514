/**
 * api.js
 * 
 * Stubbed API client for future backend integration.
 * All functions currently return mock data.
 * 
 * Future integration: Replace mock resolves with fetch() calls to your backend services.
 */

// PUBLIC_INTERFACE
export async function identifyFace(imageData) {
    // Simulates sending an image frame to a face recognition service
    console.log('[API] identifyFace called');
    return new Promise(resolve => {
        setTimeout(() => {
            // Randomly return a known or unknown face for demo purposes
            const known = Math.random() > 0.5;
            resolve({
                identified: known,
                name: known ? "Authorized User" : "Unknown",
                confidence: 0.95
            });
        }, 500);
    });
}

// PUBLIC_INTERFACE
export async function detectEmotion(imageData) {
    // Simulates sending an image frame to an emotion detection service
    console.log('[API] detectEmotion called');
    return new Promise(resolve => {
        setTimeout(() => {
            const emotions = ['Neutral', 'Happy', 'Surprised', 'Focused'];
            const emotion = emotions[Math.floor(Math.random() * emotions.length)];
            resolve({
                emotion: emotion,
                confidence: 0.88
            });
        }, 600);
    });
}

// PUBLIC_INTERFACE
export async function nlpRespond(text, context = {}) {
    // Simulates sending text to an LLM or chatbot service
    console.log('[API] nlpRespond called with:', text);
    return new Promise(resolve => {
        setTimeout(() => {
            let response = "I received your message.";
            if (text.match(/hello|hi/i)) response = "Hello! I am ready to assist.";
            else if (text.match(/time/i)) response = `The current time is ${new Date().toLocaleTimeString()}.`;
            else if (text.match(/name/i)) response = "I am a humanoid robot interface prototype.";
            
            resolve({
                text: response,
                intent: 'chat',
                entities: {}
            });
        }, 800);
    });
}

// PUBLIC_INTERFACE
export async function uploadAudio(audioBlob) {
    // Simulates uploading audio for server-side ASR (Whisper, etc.)
    console.log('[API] uploadAudio called with blob size:', audioBlob.size);
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                transcript: "This is a simulated server-side transcription.",
                confidence: 0.9
            });
        }, 1000);
    });
}
