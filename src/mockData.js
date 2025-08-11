// Mock Data for UchitTech AI Surveillance System

export const mockStats = {
  dashboard: {
    onlineCameras: 24,
    todayAlerts: 47,
    activeRecordings: 18,
    systemUptime: 99.9,
    totalStorage: 2.4, // TB
    usedStorage: 1.8, // TB
    networkBandwidth: 85.3, // %
    activeUsers: 12
  }
};

export const mockChartData = {
  alertTrends: [
    { time: '00:00', alerts: 5, motionDetection: 3, unauthorized: 1, faceRecognition: 1 },
    { time: '02:00', alerts: 3, motionDetection: 2, unauthorized: 0, faceRecognition: 1 },
    { time: '04:00', alerts: 2, motionDetection: 1, unauthorized: 0, faceRecognition: 1 },
    { time: '06:00', alerts: 8, motionDetection: 5, unauthorized: 2, faceRecognition: 1 },
    { time: '08:00', alerts: 15, motionDetection: 8, unauthorized: 4, faceRecognition: 3 },
    { time: '10:00', alerts: 12, motionDetection: 7, unauthorized: 3, faceRecognition: 2 },
    { time: '12:00', alerts: 18, motionDetection: 10, unauthorized: 5, faceRecognition: 3 },
    { time: '14:00', alerts: 22, motionDetection: 12, unauthorized: 6, faceRecognition: 4 },
    { time: '16:00', alerts: 20, motionDetection: 11, unauthorized: 5, faceRecognition: 4 },
    { time: '18:00', alerts: 25, motionDetection: 14, unauthorized: 7, faceRecognition: 4 },
    { time: '20:00', alerts: 19, motionDetection: 10, unauthorized: 6, faceRecognition: 3 },
    { time: '22:00', alerts: 14, motionDetection: 8, unauthorized: 4, faceRecognition: 2 }
  ],

  alertDistribution: [
    { name: 'Motion Detection', value: 145, color: '#ffc107' },
    { name: 'Unauthorized Access', value: 67, color: '#dc3545' },
    { name: 'Face Recognition', value: 89, color: '#28a745' },
    { name: 'Object Detection', value: 34, color: '#17a2b8' },
    { name: 'Loitering', value: 23, color: '#6f42c1' },
    { name: 'Abandoned Object', value: 12, color: '#fd7e14' }
  ],

  weeklyTrends: [
    { day: 'Monday', alerts: 156, cameras: 24, uptime: 99.5 },
    { day: 'Tuesday', alerts: 134, cameras: 24, uptime: 99.8 },
    { day: 'Wednesday', alerts: 178, cameras: 23, uptime: 98.9 },
    { day: 'Thursday', alerts: 145, cameras: 24, uptime: 99.9 },
    { day: 'Friday', alerts: 189, cameras: 24, uptime: 99.2 },
    { day: 'Saturday', alerts: 98, cameras: 24, uptime: 99.7 },
    { day: 'Sunday', alerts: 87, cameras: 24, uptime: 99.9 }
  ],

  monthlyComparison: [
    { month: 'Oct', alerts: 2340, incidents: 45, resolved: 43 },
    { month: 'Nov', alerts: 2156, incidents: 38, resolved: 36 },
    { month: 'Dec', alerts: 2789, incidents: 52, resolved: 50 },
    { month: 'Jan', alerts: 2567, incidents: 41, resolved: 39 }
  ],

  cameraPerformance: [
    { camera: 'Cam 1', alerts: 45, uptime: 99.8, location: 'Front Gate' },
    { camera: 'Cam 2', alerts: 32, uptime: 98.9, location: 'Parking' },
    { camera: 'Cam 3', alerts: 67, uptime: 99.5, location: 'Main Hall' },
    { camera: 'Cam 4', alerts: 23, uptime: 99.9, location: 'Storage' },
    { camera: 'Cam 5', alerts: 54, uptime: 97.8, location: 'Entrance' },
    { camera: 'Cam 6', alerts: 41, uptime: 99.2, location: 'Rooftop' }
  ],

  networkHealth: [
    { metric: 'Bandwidth Usage', value: 85.3, max: 100 },
    { metric: 'Latency', value: 12.5, max: 50 },
    { metric: 'Packet Loss', value: 0.2, max: 5 },
    { metric: 'Connection Stability', value: 99.1, max: 100 }
  ]
};

export const mockHeatmapData = Array.from({ length: 24 }, (_, hour) => 
  Array.from({ length: 7 }, (_, day) => ({
    hour,
    day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day],
    value: Math.floor(Math.random() * 100) + 1,
    alerts: Math.floor(Math.random() * 15) + 1
  }))
).flat();

export const mockAlerts = [
  {
    id: 1,
    timestamp: '2024-01-15 14:30:25',
    camera: 'Camera 3',
    type: 'Motion Detected',
    severity: 'warning',
    location: 'Front Gate',
    description: 'Unusual movement detected in restricted area',
    resolved: false,
    assignedTo: 'Security Team A'
  },
  {
    id: 2,
    timestamp: '2024-01-15 14:28:15',
    camera: 'Camera 7',
    type: 'Unauthorized Access',
    severity: 'error',
    location: 'Storage Room',
    description: 'Access attempt without proper credentials',
    resolved: true,
    assignedTo: 'Security Team B'
  },
  {
    id: 3,
    timestamp: '2024-01-15 14:25:40',
    camera: 'Camera 1',
    type: 'Face Recognition',
    severity: 'info',
    location: 'Main Hall',
    description: 'Unrecognized individual detected',
    resolved: false,
    assignedTo: 'Security Team A'
  },
  {
    id: 4,
    timestamp: '2024-01-15 14:20:10',
    camera: 'Camera 5',
    type: 'Loitering Detected',
    severity: 'warning',
    location: 'Parking Lot',
    description: 'Person lingering in parking area for extended time',
    resolved: true,
    assignedTo: 'Security Team C'
  },
  {
    id: 5,
    timestamp: '2024-01-15 14:15:33',
    camera: 'Camera 2',
    type: 'Object Left Behind',
    severity: 'error',
    location: 'Front Gate',
    description: 'Suspicious package detected in entrance area',
    resolved: false,
    assignedTo: 'Security Team A'
  },
  // New mock alert for fire detection
  {
    id: 6,
    timestamp: '2024-08-07 10:00:00',
    camera: 'Camera 1',
    type: 'Fire Detected',
    severity: 'critical', // Using 'critical' for high severity
    location: 'Main Hall - Near Camera 1',
    description: 'Potential fire detected by AI on Camera 1. Immediate action required.',
    resolved: false,
    assignedTo: 'Emergency Response Team'
  }
];

export const mockCameras = Array.from({ length: 25 }, (_, i) => {
  const camera = {
    id: i + 1,
    name: `Camera ${i + 1}`,
    location: [
      'Front Gate', 'Parking Lot', 'Main Hall', 'Storage Room', 'Reception',
      'Corridor A', 'Corridor B', 'Emergency Exit', 'Elevator', 'Stairwell',
      'Conference Room', 'Server Room', 'Loading Dock', 'Rooftop', 'Garden',
      'Security Office', 'Cafeteria', 'Break Room', 'Entrance Lobby', 'Back Gate',
      'Perimeter North', 'Perimeter South', 'Perimeter East', 'Perimeter West', 'Central Court'
    ][i],
    status: Math.random() > 0.15 ? 'online' : 'offline',
    recording: Math.random() > 0.2,
    motion: Math.random() > 0.8,
    lastActivity: new Date(Date.now() - Math.random() * 86400000).toISOString(),
    alertCount: Math.floor(Math.random() * 50),
    uptime: (Math.random() * 5 + 95).toFixed(1),
    resolution: ['1080p', '4K', '720p'][Math.floor(Math.random() * 3)],
    nightVision: Math.random() > 0.3,
    audioRecording: Math.random() > 0.5
  };

  // Assign local video sources to specific cameras
  if (camera.id === 1) {
    camera.videoSrc = '/sample1.mp4';
  } else if (camera.id === 2) {
    camera.videoSrc = '/sample2.mp4';
  }

  return camera;
});

export const mockReports = [
  {
    id: 1,
    title: 'Daily Security Summary - January 15, 2024',
    type: 'Daily Summary',
    date: '2024-01-15',
    generatedBy: 'System',
    size: '2.4 MB',
    format: 'PDF',
    alerts: 47,
    incidents: 3,
    cameras: 24
  },
  {
    id: 2,
    title: 'Weekly Analysis Report - Week 2',
    type: 'Weekly Analysis',
    date: '2024-01-14',
    generatedBy: 'Admin',
    size: '5.8 MB',
    format: 'PDF',
    alerts: 298,
    incidents: 12,
    cameras: 24
  },
  {
    id: 3,
    title: 'Incident Report - Unauthorized Access',
    type: 'Incident Report',
    date: '2024-01-13',
    generatedBy: 'Security Team',
    size: '1.2 MB',
    format: 'PDF',
    alerts: 5,
    incidents: 1,
    cameras: 3
  },
  {
    id: 4,
    title: 'Monthly Overview - December 2023',
    type: 'Monthly Overview',
    date: '2024-01-01',
    generatedBy: 'System',
    size: '12.4 MB',
    format: 'PDF',
    alerts: 1245,
    incidents: 28,
    cameras: 24
  }
];

export const mockSystemInfo = {
  device: {
    os: 'Windows 11 Pro',
    browser: 'Chrome 120.0.6099.129',
    resolution: '1920x1080',
    colorDepth: '24-bit',
    timezone: 'UTC+05:30'
  },
  network: {
    publicIP: '203.192.45.123',
    location: 'Mumbai, Maharashtra, India',
    isp: 'Reliance Jio',
    connectionType: 'Fiber',
    downloadSpeed: '100 Mbps',
    uploadSpeed: '50 Mbps'
  },
  system: {
    cpuUsage: 23.5,
    memoryUsage: 67.8,
    diskUsage: 45.2,
    networkUsage: 15.3,
    activeConnections: 156,
    lastLogin: '2024-01-15 09:30:22'
  }
};

export const generateCSVData = (data, filename) => {
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(field => 
      typeof row[field] === 'string' && row[field].includes(',') 
        ? `"${row[field]}"` 
        : row[field]
    ).join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
};