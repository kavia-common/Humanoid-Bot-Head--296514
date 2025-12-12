/**
 * main.js
 * Application entry point and state management.
 */
import { CameraManager } from './camera.js';
import { SpeechManager } from './speech.js';
import { NLPManager } from './nlp.js';
import { TTSManager } from './tts.js';
import * as API from './api.js';

// DOM Elements
const els = {
    video: document.getElementById('camera-feed'),
    canvas: document.getElementById('camera-canvas'),
    btnStartCam: document.getElementById('btn-start-camera'),
    btnStopCam: document.getElementById('btn-stop-camera'),
    btnCapture: document.getElementById('btn-capture'),
    
    btnStartMic: document.getElementById('btn-start-mic'),
    btnStopMic: document.getElementById('btn-stop-mic'),
    transcript: document.getElementById('transcript-display'),
    
    chatLog: document.getElementById('chat-log'),
    input: document.getElementById('user-input'),
    btnSend: document.getElementById('btn-send'),
    
    responseText: document.getElementById('nlp-response-text'),
    btnTtsSpeak: document.getElementById('btn-tts-speak'),
    btnTtsStop: document.getElementById('btn-tts-stop'),
    
    faceBadge: document.querySelector('#face-badge .value'),
    emotionBadge: document.querySelector('#emotion-badge .value'),
    
    btnSettings: document.getElementById('btn-settings'),
    settingsModal: document.getElementById('settings-modal'),
    chkUseBrowserApis: document.getElementById('chk-use-browser-apis')
};

// Managers
const camera = new CameraManager(els.video, els.canvas);
const speech = new SpeechManager();
const tts = new TTSManager();
const nlp = new NLPManager();

// State
let lastResponseText = "";

// --- Initialization ---

function init() {
    setupEventListeners();
    updateSettings(); // Apply default settings
    console.log("Humanoid Robot Interface Initialized");
}

function setupEventListeners() {
    // Camera
    els.btnStartCam.addEventListener('click', async () => {
        const success = await camera.start();
        if (success) {
            els.btnStartCam.disabled = true;
            els.btnStopCam.disabled = false;
            els.btnCapture.disabled = false;
            
            // Set up frame analysis loop
            camera.setOnFrame(async (imageData) => {
                // Parallel API calls for analysis
                const [faceRes, emotionRes] = await Promise.all([
                    API.identifyFace(imageData),
                    API.detectEmotion(imageData)
                ]);
                
                updateVisualBadges(faceRes, emotionRes);
            });
        }
    });

    els.btnStopCam.addEventListener('click', () => {
        camera.stop();
        els.btnStartCam.disabled = false;
        els.btnStopCam.disabled = true;
        els.btnCapture.disabled = true;
        updateVisualBadges({ name: '--' }, { emotion: '--' });
    });

    els.btnCapture.addEventListener('click', () => {
        const data = camera.captureFrameData();
        if (data) {
            console.log('Frame captured manually');
            // Flash effect could go here
        }
    });

    // Speech
    els.btnStartMic.addEventListener('click', () => {
        els.btnStartMic.disabled = true;
        els.btnStopMic.disabled = false;
        els.transcript.textContent = "Listening...";
        
        speech.start((final, interim) => {
            if (final) {
                els.transcript.textContent = final;
                handleUserMessage(final);
            } else {
                els.transcript.textContent = interim;
            }
        }, (error) => {
            els.btnStartMic.disabled = false;
            els.btnStopMic.disabled = true;
            if (error) els.transcript.textContent = "Error: " + error;
            else els.transcript.textContent = "Mic stopped.";
        });
    });

    els.btnStopMic.addEventListener('click', () => {
        speech.stop();
        els.btnStartMic.disabled = false;
        els.btnStopMic.disabled = true;
        els.transcript.textContent = "Mic stopped.";
    });

    // Chat
    els.btnSend.addEventListener('click', () => {
        const text = els.input.value.trim();
        if (text) {
            handleUserMessage(text);
            els.input.value = '';
        }
    });

    els.input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') els.btnSend.click();
    });

    // TTS
    els.btnTtsSpeak.addEventListener('click', () => {
        if (lastResponseText) {
            tts.speak(lastResponseText);
        }
    });

    els.btnTtsStop.addEventListener('click', () => {
        tts.stop();
    });

    // Settings
    els.btnSettings.addEventListener('click', () => {
        els.settingsModal.showModal();
    });
    
    els.settingsModal.querySelector('button').addEventListener('click', () => {
        els.settingsModal.close();
    });

    els.chkUseBrowserApis.addEventListener('change', updateSettings);
}

function updateSettings() {
    const useNative = els.chkUseBrowserApis.checked;
    speech.setUseNative(useNative);
    tts.setUseNative(useNative);
    console.log(`Settings updated: Native APIs = ${useNative}`);
}

function updateVisualBadges(faceData, emotionData) {
    if (faceData) els.faceBadge.textContent = faceData.name || "Unknown";
    if (emotionData) els.emotionBadge.textContent = emotionData.emotion || "Unknown";
}

async function handleUserMessage(text) {
    // 1. Add to chat log
    appendChatLog(text, 'user');
    
    // 2. Process via NLP
    els.responseText.textContent = "Thinking...";
    const response = await nlp.processUserMessage(text);
    lastResponseText = response;
    
    // 3. Update UI
    els.responseText.textContent = response;
    appendChatLog(response, 'system');
    
    // 4. Speak response
    tts.speak(response);
    
    els.btnTtsSpeak.disabled = false;
    els.btnTtsStop.disabled = false;
}

function appendChatLog(text, sender) {
    const div = document.createElement('div');
    div.className = `chat-message ${sender}`;
    div.textContent = text;
    els.chatLog.appendChild(div);
    els.chatLog.scrollTop = els.chatLog.scrollHeight;
}

// Boot
init();
