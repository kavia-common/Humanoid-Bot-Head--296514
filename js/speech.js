/**
 * speech.js
 * Wraps the Web Speech API for ASR.
 */

export class SpeechManager {
    constructor() {
        this.recognition = null;
        this.isListening = false;
        this.useNative = true;
        
        // Check browser support
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = true;
            this.recognition.interimResults = true;
            this.recognition.lang = 'en-US';
        }
    }

    // PUBLIC_INTERFACE
    setUseNative(useNative) {
        this.useNative = useNative;
    }

    // PUBLIC_INTERFACE
    start(onResultCallback, onEndCallback) {
        if (this.isListening) return;

        if (this.useNative && this.recognition) {
            this.recognition.onresult = (event) => {
                let interimTranscript = '';
                let finalTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    } else {
                        interimTranscript += event.results[i][0].transcript;
                    }
                }
                onResultCallback(finalTranscript, interimTranscript);
            };

            this.recognition.onerror = (event) => {
                console.error('[Speech] Error:', event.error);
                // Handle no-speech error gracefully
                if (event.error === 'not-allowed') {
                    onEndCallback('Permission denied');
                }
            };

            this.recognition.onend = () => {
                if (this.isListening) {
                    // Auto-restart if it stopped but shouldn't have
                    try { this.recognition.start(); } catch(e) {}
                } else {
                    onEndCallback && onEndCallback();
                }
            };

            try {
                this.recognition.start();
                this.isListening = true;
                console.log('[Speech] Native recognition started');
            } catch (e) {
                console.error('[Speech] Start failed:', e);
            }
        } else {
            // Stub mode
            this.isListening = true;
            console.log('[Speech] Stub recognition started');
            // Simulate input after a delay
            setTimeout(() => {
                if (this.isListening) onResultCallback("This is a simulated voice input.", "");
            }, 2000);
        }
    }

    // PUBLIC_INTERFACE
    stop() {
        this.isListening = false;
        if (this.recognition) {
            this.recognition.stop();
        }
        console.log('[Speech] Stopped');
    }
}
