// Webcam Service for handling browser webcam access and IP camera connections
export class WebcamService {
  constructor() {
    this.stream = null;
    this.isActive = false;
    this.constraints = {
      video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        frameRate: { ideal: 30 }
      },
      audio: false
    };
  }

  // Start webcam capture
  async startWebcam(videoElement) {
    try {
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('getUserMedia is not supported in this browser');
      }

      // Request camera access
      this.stream = await navigator.mediaDevices.getUserMedia(this.constraints);
      
      if (videoElement) {
        videoElement.srcObject = this.stream;
        videoElement.play();
      }
      
      this.isActive = true;
      
      return {
        success: true,
        stream: this.stream,
        message: 'Webcam started successfully'
      };
    } catch (error) {
      console.error('Error starting webcam:', error);
      
      let errorMessage = 'Failed to start webcam';
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Camera access denied. Please allow camera permissions and try again.';
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'No camera found. Please connect a camera and try again.';
      } else if (error.name === 'NotReadableError') {
        errorMessage = 'Camera is already in use by another application.';
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  }

  // Stop webcam capture
  stopWebcam() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => {
        track.stop();
      });
      this.stream = null;
      this.isActive = false;
      
      return {
        success: true,
        message: 'Webcam stopped successfully'
      };
    }
    
    return {
      success: false,
      message: 'No active webcam to stop'
    };
  }

  // Get available cameras
  async getAvailableCameras() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cameras = devices.filter(device => device.kind === 'videoinput');
      
      return {
        success: true,
        cameras: cameras.map(camera => ({
          deviceId: camera.deviceId,
          label: camera.label || `Camera ${cameras.indexOf(camera) + 1}`,
          groupId: camera.groupId
        }))
      };
    } catch (error) {
      console.error('Error getting cameras:', error);
      return {
        success: false,
        error: 'Failed to get available cameras'
      };
    }
  }

  // Switch to specific camera
  async switchCamera(deviceId, videoElement) {
    if (this.isActive) {
      this.stopWebcam();
    }
    
    const newConstraints = {
      ...this.constraints,
      video: {
        ...this.constraints.video,
        deviceId: { exact: deviceId }
      }
    };
    
    try {
      this.stream = await navigator.mediaDevices.getUserMedia(newConstraints);
      
      if (videoElement) {
        videoElement.srcObject = this.stream;
        videoElement.play();
      }
      
      this.isActive = true;
      
      return {
        success: true,
        message: 'Camera switched successfully'
      };
    } catch (error) {
      console.error('Error switching camera:', error);
      return {
        success: false,
        error: 'Failed to switch camera'
      };
    }
  }

  // Capture screenshot from webcam
  captureScreenshot(videoElement) {
    if (!videoElement || !this.isActive) {
      return {
        success: false,
        error: 'No active webcam or video element'
      };
    }
    
    try {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      
      context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
      
      const imageData = canvas.toDataURL('image/png');
      
      return {
        success: true,
        imageData: imageData,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error capturing screenshot:', error);
      return {
        success: false,
        error: 'Failed to capture screenshot'
      };
    }
  }

  // Connect to IP camera (simulated)
  async connectIPCamera(cameraConfig) {
    try {
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Validate camera configuration
      if (!cameraConfig.ipAddress || !cameraConfig.username || !cameraConfig.password) {
        throw new Error('Missing required camera configuration');
      }
      
      // In real implementation, this would:
      // 1. Construct RTSP/HTTP URL based on camera brand
      // 2. Authenticate with camera
      // 3. Establish video stream connection
      // 4. Handle different camera protocols (RTSP, HTTP, ONVIF)
      
      const streamUrl = this.constructStreamUrl(cameraConfig);
      
      console.log('Connecting to IP camera:', {
        name: cameraConfig.name,
        ip: cameraConfig.ipAddress,
        streamUrl: streamUrl
      });
      
      return {
        success: true,
        message: 'Successfully connected to IP camera',
        streamUrl: streamUrl,
        cameraInfo: {
          name: cameraConfig.name,
          ip: cameraConfig.ipAddress,
          status: 'connected',
          lastSeen: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Error connecting to IP camera:', error);
      return {
        success: false,
        error: error.message || 'Failed to connect to IP camera'
      };
    }
  }

  // Construct stream URL based on camera configuration
  constructStreamUrl(config) {
    const { ipAddress, port = '80', username, password } = config;
    
    // Common RTSP URL patterns for different camera brands
    const patterns = {
      default: `rtsp://${username}:${password}@${ipAddress}:${port}/stream1`,
      hikvision: `rtsp://${username}:${password}@${ipAddress}:554/Streaming/Channels/101`,
      dahua: `rtsp://${username}:${password}@${ipAddress}:554/cam/realmonitor?channel=1&subtype=0`,
      axis: `rtsp://${username}:${password}@${ipAddress}/axis-media/media.amp`,
      foscam: `rtsp://${username}:${password}@${ipAddress}:88/videoMain`
    };
    
    // For demo purposes, return default pattern
    return patterns.default;
  }

  // Get webcam status
  getStatus() {
    return {
      isActive: this.isActive,
      hasStream: !!this.stream,
      constraints: this.constraints
    };
  }
}

// Create singleton instance
export const webcamService = new WebcamService();