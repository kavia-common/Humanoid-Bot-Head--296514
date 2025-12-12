/**
 * nlp.js
 * High-level orchestration of text processing.
 */
import * as API from './api.js';

export class NLPManager {
    constructor() {
    }

    // PUBLIC_INTERFACE
    async processUserMessage(message) {
        if (!message) return null;
        
        try {
            const response = await API.nlpRespond(message);
            return response.text;
        } catch (error) {
            console.error('[NLP] Error processing message:', error);
            return "I'm sorry, I'm having trouble processing that right now.";
        }
    }
}
