/**
 * tts.js
 * Wraps SpeechSynthesis API.
 */

export class TTSManager {
    constructor() {
        this.synth = window.speechSynthesis;
        this.useNative = true;
        this.voice = null;
    }

    // PUBLIC_INTERFACE
    setUseNative(useNative) {
        this.useNative = useNative;
    }

    // PUBLIC_INTERFACE
    speak(text) {
        if (!text) return;
        
        // Cancel any existing speech
        this.stop();

        if (this.useNative && this.synth) {
            const utterance = new SpeechSynthesisUtterance(text);
            
            // Try to select a decent voice
            const voices = this.synth.getVoices();
            // Prefer a natural sounding English voice
            this.voice = voices.find(v => v.lang.includes('en') && v.name.includes('Google')) || voices[0];
            if (this.voice) utterance.voice = this.voice;

            utterance.onstart = () => console.log('[TTS] Speaking...');
            utterance.onend = () => console.log('[TTS] Finished');
            
            this.synth.speak(utterance);
        } else {
            console.log(`[TTS Stub] Playing audio for: "${text}"`);
            // In a real app, this might play an audio file from the server
        }
    }

    // PUBLIC_INTERFACE
    stop() {
        if (this.synth) {
            this.synth.cancel();
        }
    }
}
