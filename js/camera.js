/**
 * camera.js
 * Handles video stream acquisition and frame capture.
 */

export class CameraManager {
    constructor(videoElement, canvasElement) {
        this.video = videoElement;
        this.canvas = canvasElement;
        this.stream = null;
        this.active = false;
        this.processingInterval = null;
        this.onFrameCallback = null;
    }

    // PUBLIC_INTERFACE
    async start() {
        if (this.active) return;
        
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({ 
                video: { width: 640, height: 480, facingMode: 'user' }, 
                audio: false 
            });
            this.video.srcObject = this.stream;
            this.active = true;
            this.video.parentElement.querySelector('.placeholder-overlay').style.display = 'none';
            this._startProcessingLoop();
            return true;
        } catch (error) {
            console.error('[Camera] Error starting camera:', error);
            alert('Could not access camera. Please check permissions.');
            return false;
        }
    }

    // PUBLIC_INTERFACE
    stop() {
        if (!this.active || !this.stream) return;

        this.stream.getTracks().forEach(track => track.stop());
        this.video.srcObject = null;
        this.active = false;
        this.video.parentElement.querySelector('.placeholder-overlay').style.display = 'flex';
        this._stopProcessingLoop();
    }

    // PUBLIC_INTERFACE
    captureFrameData() {
        if (!this.active) return null;
        
        const context = this.canvas.getContext('2d');
        this.canvas.width = this.video.videoWidth;
        this.canvas.height = this.video.videoHeight;
        context.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
        
        // Return data URL (base64)
        return this.canvas.toDataURL('image/jpeg', 0.8);
    }

    // PUBLIC_INTERFACE
    setOnFrame(callback) {
        this.onFrameCallback = callback;
    }

    _startProcessingLoop() {
        // Process frames periodically (e.g., every 2 seconds) to avoid overloading the browser
        this.processingInterval = setInterval(() => {
            if (this.onFrameCallback && this.active) {
                const imageData = this.captureFrameData();
                if (imageData) {
                    this.onFrameCallback(imageData);
                }
            }
        }, 2000);
    }

    _stopProcessingLoop() {
        if (this.processingInterval) {
            clearInterval(this.processingInterval);
            this.processingInterval = null;
        }
    }
}
