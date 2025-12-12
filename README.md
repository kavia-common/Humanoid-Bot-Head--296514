# Humanoid Robot Head Interface

This is a web-based frontend interface for the Humanoid Robot Head project. It provides a multimodal dashboard for testing and demonstrating interaction capabilities, including vision, speech, and emotion recognition.

## Features

-   **Visual Input**: Camera preview with placeholder overlays for Face Identification and Emotion Detection.
-   **Audio Input**: Integration with Web Speech API for Speech-to-Text (STT/ASR).
-   **Conversation**: Chat interface for text-based interaction.
-   **Response**: Visual display of robot responses and Text-to-Speech (TTS) playback.
-   **Modular Design**: Structured using ES6 modules (`camera.js`, `speech.js`, `tts.js`, `nlp.js`, `api.js`) for easy extensibility.

## Project Structure

-   `index.html`: Main application entry point.
-   `css/styles.css`: Styling and layout.
-   `js/`:
    -   `main.js`: App orchestration and UI logic.
    -   `camera.js`: Manages `getUserMedia` and frame capture.
    -   `speech.js`: Wraps `SpeechRecognition` API.
    -   `tts.js`: Wraps `SpeechSynthesis` API.
    -   `nlp.js`: Handles message processing.
    -   `api.js`: Stubbed asynchronous functions for future backend integration.

## Usage

1.  **Serve the files**: Since this uses ES modules, you must serve it via a local web server (opening `index.html` directly as a file may cause CORS errors).
    
    Example using Python:
    ```bash
    python3 -m http.server 3000
    ```

2.  **Open in Browser**: Navigate to `http://localhost:3000`.

3.  **Permissions**: Allow Camera and Microphone access when prompted to use the full feature set.

4.  **Configuration**: Click the "Settings" button to toggle between native browser APIs (Chrome/Edge/Safari support required for Web Speech) or simulation stubs.

## Future Integration

To connect this frontend to a real backend (e.g., Python/FastAPI):

1.  Open `js/api.js`.
2.  Replace the `setTimeout` mock implementations with `fetch()` calls to your backend endpoints.
3.  Ensure your backend accepts the data formats defined in the stubs (e.g., base64 images for vision, text for NLP).
