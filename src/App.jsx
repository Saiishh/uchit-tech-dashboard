import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import LoginPage from './LoginPage.jsx';
import { notificationService } from './utils/notificationService';
import { webcamService } from './utils/webcamService';
import { 
  mockStats, 
  mockChartData, 
  mockHeatmapData, 
  mockAlerts, 
  mockCameras, 
  mockReports, 
  mockSystemInfo,
  generateCSVData 
} from './mockData.js';

// Alert Popup Component
const AlertPopup = ({ alert, onClose }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5);

  useEffect(() => {
    if (!alert) return;

    // Play alert sound
    try {
      const audio = new Audio('/new-notification-09-352705.mp3');
      audio.volume = 0.5;
      audio.play().catch(e => console.log('Audio play failed:', e));
    } catch (e) {
      console.log('Audio not available:', e);
    }

    let timer;
    if (!isHovered) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            onClose();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [alert, isHovered, onClose]);

  useEffect(() => {
    if (isHovered) {
      setTimeLeft(5); // Reset timer when hovered
    }
  }, [isHovered]);

  if (!alert) return null;

  return (
    <div 
      className={`alert-popup ${alert.type} ${alert.closing ? 'closing' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClose}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
            {alert.title}
          </div>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>
            {alert.message}
          </div>
        </div>
        <div style={{ marginLeft: '15px', fontSize: '12px', opacity: 0.8 }}>
          {!isHovered && `${timeLeft}s`}
        </div>
      </div>
    </div>
  );
};

// Dashboard Component
const Dashboard = ({ showAlert }) => {
  const stats = [
    { label: 'Online Cameras', value: mockStats.dashboard.onlineCameras, color: '#28a745', suffix: '' },
    { label: "Today's Alerts", value: mockStats.dashboard.todayAlerts, color: '#dc3545', suffix: '' },
    { label: 'Active Recordings', value: mockStats.dashboard.activeRecordings, color: '#007bff', suffix: '' },
    { label: 'System Uptime', value: mockStats.dashboard.systemUptime, color: '#28a745', suffix: '%' },
    { label: 'Storage Used', value: mockStats.dashboard.usedStorage, color: '#ffc107', suffix: 'TB' },
    { label: 'Network Load', value: mockStats.dashboard.networkBandwidth, color: '#17a2b8', suffix: '%' },
    { label: 'Active Users', value: mockStats.dashboard.activeUsers, color: '#6f42c1', suffix: '' },
    { label: 'Total Storage', value: mockStats.dashboard.totalStorage, color: '#fd7e14', suffix: 'TB' }
  ];

  return (
    <div className="content-area">
      <div className="flex-between mb-30">
        <h1 style={{ fontSize: '32px', fontWeight: '700' }}>
          Surveillance Dashboard
        </h1>
        <div className="flex gap-15">
          <button 
            className="btn btn-success" 
            onClick={() => generateCSVData(mockChartData.alertTrends, 'dashboard_stats')}
          >
            Export Dashboard Data
          </button>
        </div>
      </div>
      
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="stat-number" style={{ color: stat.color }}>
              {stat.value}{stat.suffix}
            </div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h3 className="card-title">24-Hour Alert Trends</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={mockChartData.alertTrends}>
              <defs>
                <linearGradient id="colorAlerts" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#dc3545" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#dc3545" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="time" stroke="var(--text-secondary)" />
              <YAxis stroke="var(--text-secondary)" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--secondary-bg)', 
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px' 
                }} 
              />
              <Area type="monotone" dataKey="alerts" stroke="#dc3545" fillOpacity={1} fill="url(#colorAlerts)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="card">
          <h3 className="card-title">Alert Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={mockChartData.alertDistribution}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {mockChartData.alertDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">Weekly Performance Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={mockChartData.weeklyTrends}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
            <XAxis dataKey="day" stroke="var(--text-secondary)" />
            <YAxis stroke="var(--text-secondary)" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--secondary-bg)', 
                border: '1px solid var(--border-color)',
                borderRadius: '8px' 
              }} 
            />
            <Legend />
            <Bar dataKey="alerts" fill="#dc3545" name="Alerts" radius={[4, 4, 0, 0]} />
            <Bar dataKey="cameras" fill="#28a745" name="Active Cameras" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <h3 className="card-title">Real-time Activity Heatmap</h3>
        <div style={{ height: '300px', overflowY: 'auto' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(24, 1fr)', 
            gap: '2px',
            padding: '20px',
            minWidth: '800px'
          }}>
            {Array.from({ length: 168 }, (_, i) => {
              const hour = i % 24;
              const day = Math.floor(i / 24);
              const intensity = Math.random();
              return (
                <div
                  key={i}
                  style={{
                    width: '25px',
                    height: '25px',
                    backgroundColor: `rgba(220, 53, 69, ${intensity})`,
                    borderRadius: '3px',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  title={`${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day]} ${hour}:00 - ${Math.floor(intensity * 50)} alerts`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// Live View Component
const LiveView = ({ showAlert }) => {
  const [gridSize, setGridSize] = useState('2x2');
  const [cameraFilter, setCameraFilter] = useState('all');

  const gridOptions = {
    '2x2': { cols: 2, count: 4 },
    '3x3': { cols: 3, count: 9 },
    '4x4': { cols: 4, count: 16 },
    '5x5': { cols: 5, count: 25 }
  };

  const filteredCameras = mockCameras.filter(camera => {
    if (cameraFilter === 'online') return camera.status === 'online';
    if (cameraFilter === 'offline') return camera.status === 'offline';
    return true;
  }).slice(0, gridOptions[gridSize].count);

  // Function to trigger the fire alert for Camera 1
  const triggerFireAlert = () => {
    const fireAlert = mockAlerts.find(alert => alert.type === 'Fire Detected' && alert.camera === 'Camera 1');
    if (fireAlert) {
      showAlert({
        type: 'error', // Use 'error' for critical alerts like fire
        title: fireAlert.type,
        message: `${fireAlert.description} (Location: ${fireAlert.location})`
      });
      // Simulate sending email for this critical alert
      console.log(`SIMULATED EMAIL ALERT: Fire Detected on Camera 1. Details: ${fireAlert.description}. This would be sent via SMTP using your configured credentials.`);
    }
  };

  return (
    <div className="content-area">
      <div className="flex-between mb-30">
        <h1 style={{ fontSize: '32px', fontWeight: '700' }}>Live Camera View</h1>
        <div className="flex gap-15">
          <select 
            value={gridSize} 
            onChange={(e) => setGridSize(e.target.value)}
            className="form-input"
            style={{ width: 'auto' }}
          >
            <option value="2x2">2x2 Grid</option>
            <option value="3x3">3x3 Grid</option>
            <option value="4x4">4x4 Grid</option>
            <option value="5x5">5x5 Grid</option>
          </select>
          
          <select 
            value={cameraFilter} 
            onChange={(e) => setCameraFilter(e.target.value)}
            className="form-input"
            style={{ width: 'auto' }}
          >
            <option value="all">All Cameras</option>
            <option value="online">Online Only</option>
            <option value="offline">Offline Only</option>
          </select>
          
          <button 
            className="btn btn-success" 
            onClick={() => generateCSVData(mockCameras, 'camera_status')}
          >
            Export Camera Data
          </button>
        </div>
      </div>

      <div className="grid grid-3 mb-30">
        <div className="card">
          <h3 className="card-title">Camera Performance</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={mockChartData.cameraPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="camera" stroke="var(--text-secondary)" />
              <YAxis stroke="var(--text-secondary)" />
              <Tooltip />
              <Bar dataKey="alerts" fill="#dc3545" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="card-title">Network Health</h3>
          <ResponsiveContainer width="100%" height={200}>
            <RadialBarChart data={mockChartData.networkHealth}>
              <RadialBar dataKey="value" cornerRadius={10} fill="#28a745" />
              <Tooltip />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="card-title">System Status</h3>
          <div style={{ padding: '20px' }}>
            <div style={{ marginBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span>CPU Usage</span>
                <span>{mockSystemInfo.system.cpuUsage}%</span>
              </div>
              <div style={{ 
                height: '8px', 
                backgroundColor: 'var(--hover-bg)', 
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{ 
                  height: '100%', 
                  width: `${mockSystemInfo.system.cpuUsage}%`, 
                  backgroundColor: '#17a2b8',
                  transition: 'width 0.5s ease'
                }} />
              </div>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span>Memory</span>
                <span>{mockSystemInfo.system.memoryUsage}%</span>
              </div>
              <div style={{ 
                height: '8px', 
                backgroundColor: 'var(--hover-bg)', 
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{ 
                  height: '100%', 
                  width: `${mockSystemInfo.system.memoryUsage}%`, 
                  backgroundColor: '#ffc107',
                  transition: 'width 0.5s ease'
                }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div 
        className="camera-grid"
        style={{ 
          gridTemplateColumns: `repeat(${gridOptions[gridSize].cols}, 1fr)`,
          gap: '15px'
        }}
      >
        {filteredCameras.map(camera => (
          <div key={camera.id} className="camera-card">
            <div className="camera-preview">
              {camera.videoSrc ? (
                <video 
                  src={camera.videoSrc} 
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px' }}
                />
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '16px', marginBottom: '5px' }}>{camera.name}</div>
                  <div style={{ fontSize: '12px', opacity: 0.8 }}>{camera.location}</div>
                </div>
              )}
              <div className={`camera-status ${camera.status}`}></div>
              {camera.motion && (
                <div style={{
                  position: 'absolute',
                  top: '8px',
                  left: '8px',
                  background: '#dc3545',
                  color: 'white',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: 'bold'
                }}>
                  MOTION
                </div>
              )}
              {camera.recording && (
                <div style={{
                  position: 'absolute',
                  bottom: '8px',
                  right: '8px',
                  width: '8px',
                  height: '8px',
                  background: '#dc3545',
                  borderRadius: '50%',
                  animation: 'pulse 1s infinite'
                }}>
                </div>
              )}
            </div>
            <div className="camera-info">
              <div>Status: <strong style={{ color: camera.status === 'online' ? '#28a745' : '#dc3545' }}>
                {camera.status.toUpperCase()}
              </strong></div>
              <div>Recording: {camera.recording ? 'Active' : 'Inactive'}</div>
              {/* Add a button to trigger fire alert for Camera 1 */}
              {camera.id === 1 && (
                <button 
                  className="btn btn-danger mt-10" 
                  onClick={triggerFireAlert}
                  style={{ padding: '5px 10px', fontSize: '12px', width: '100%' }}
                >
                  Trigger Fire Alert 🔥
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Alerts Component
const Alerts = ({ showAlert }) => {
  const [alertFilter, setAlertFilter] = useState('all');
  
  // Use mockAlerts directly from mockData.js
  const filteredAlerts = mockAlerts.filter(alert => {
    if (alertFilter === 'error') return alert.severity === 'error' || alert.severity === 'critical';
    if (alertFilter === 'warning') return alert.severity === 'warning';
    if (alertFilter === 'info') return alert.severity === 'info';
    return true;
  });

  const handleTriggerAlert = () => {
    showAlert({
      type: 'warning',
      title: 'Manual Alert Triggered',
      message: 'Security personnel has been notified of the situation.'
    });
  };

  return (
    <div className="content-area">
      <div className="flex-between mb-30">
        <h1 style={{ fontSize: '32px', fontWeight: '700' }}>Security Alerts</h1>
        <div className="flex gap-15">
          <select 
            value={alertFilter} 
            onChange={(e) => setAlertFilter(e.target.value)}
            className="form-input"
            style={{ width: 'auto' }}
          >
            <option value="all">All Alerts</option>
            <option value="error">Critical</option>
            <option value="warning">Warning</option>
            <option value="info">Info</option>
          </select>
          <button className="btn btn-danger" onClick={handleTriggerAlert}>
            Trigger Manual Alert
          </button>
        </div>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Camera</th>
              <th>Alert Type</th>
              <th>Location</th>
              <th>Severity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAlerts.map(alert => (
              <tr key={alert.id}>
                <td>{alert.timestamp.split(' ')[1]}</td> {/* Display only time */}
                <td>{alert.camera}</td>
                <td>{alert.type}</td>
                <td>{alert.location}</td>
                <td>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    background: alert.severity === 'error' || alert.severity === 'critical' ? '#dc3545' : 
                               alert.severity === 'warning' ? '#ffc107' : '#17a2b8',
                    color: alert.severity === 'warning' ? '#000' : '#fff'
                  }}>
                    {alert.severity.toUpperCase()}
                  </span>
                </td>
                <td>
                  <button className="btn btn-primary" style={{ padding: '5px 10px', fontSize: '12px' }}>
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Analytics Component
const Analytics = ({ showAlert }) => {
  return (
    <div className="content-area">
      <div className="flex-between mb-30">
        <h1 style={{ fontSize: '32px', fontWeight: '700' }}>
          Analytics & Intelligence
        </h1>
        <div className="flex gap-15">
          <button 
            className="btn btn-success" 
            onClick={() => generateCSVData(mockChartData.monthlyComparison, 'analytics_monthly')}
          >
            Export Analytics
          </button>
        </div>
      </div>
      
      <div className="grid grid-2 mb-30">
        <div className="card">
          <h3 className="card-title">Alert Frequency by Camera</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={mockChartData.cameraPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="camera" stroke="var(--text-secondary)" />
              <YAxis stroke="var(--text-secondary)" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--secondary-bg)', 
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px' 
                }} 
              />
              <Bar dataKey="alerts" fill="#dc3545" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="card">
          <h3 className="card-title">Weekly Alert Trends</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={mockChartData.weeklyTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="day" stroke="var(--text-secondary)" />
              <YAxis stroke="var(--text-secondary)" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--secondary-bg)', 
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px' 
                }} 
              />
              <Line type="monotone" dataKey="alerts" stroke="#dc3545" strokeWidth={3} dot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card mb-30">
        <h3 className="card-title">Monthly Comparison Analysis</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={mockChartData.monthlyComparison}>
            <defs>
              <linearGradient id="colorAlerts2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#dc3545" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#dc3545" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorIncidents" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ffc107" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#ffc107" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
            <XAxis dataKey="month" stroke="var(--text-secondary)" />
            <YAxis stroke="var(--text-secondary)" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--secondary-bg)', 
                border: '1px solid var(--border-color)',
                borderRadius: '8px' 
              }} 
            />
            <Legend />
            <Area type="monotone" dataKey="alerts" stackId="1" stroke="#dc3545" fill="url(#colorAlerts2)" />
            <Area type="monotone" dataKey="incidents" stackId="1" stroke="#ffc107" fill="url(#colorIncidents)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-4 mb-30">
        <div className="card">
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#28a745', marginBottom: '10px' }}>98.5%</div>
            <div style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>Detection Accuracy</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '5px' }}>
              +2.3% from last month
            </div>
          </div>
        </div>
        <div className="card">
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#007bff', marginBottom: '10px' }}>2.3s</div>
            <div style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>Response Time</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '5px' }}>
              -0.5s improvement
            </div>
          </div>
        </div>
        <div className="card">
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#17a2b8', marginBottom: '10px' }}>99.1%</div>
            <div style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>System Uptime</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '5px' }}>
              99.9% target
            </div>
          </div>
        </div>
        <div className="card">
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#6f42c1', marginBottom: '10px' }}>847</div>
            <div style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>Total Events</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '5px' }}>
              This month
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">AI Prediction Models</h3>
        <div className="grid grid-2 gap-20 mt-20">
          <div>
            <h4 style={{ marginBottom: '15px', color: 'var(--text-primary)' }}>Threat Level Prediction</h4>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={mockChartData.alertTrends.slice(0, 8)}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="time" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <Tooltip />
                <Line type="monotone" dataKey="motionDetection" stroke="#28a745" strokeDasharray="5 5" />
                <Line type="monotone" dataKey="unauthorized" stroke="#dc3545" strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div>
            <h4 style={{ marginBottom: '15px', color: 'var(--text-primary)' }}>Resource Optimization</h4>
            <div style={{ padding: '20px' }}>
              <div style={{ marginBottom: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span>Processing Power</span>
                  <span style={{ color: '#28a745', fontWeight: 'bold' }}>Optimal</span>
                </div>
                <div style={{ height: '8px', backgroundColor: 'var(--hover-bg)', borderRadius: '4px' }}>
                  <div style={{ height: '100%', width: '78%', backgroundColor: '#28a745', borderRadius: '4px' }} />
                </div>
              </div>
              <div style={{ marginBottom: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span>Storage Efficiency</span>
                  <span style={{ color: '#ffc107', fontWeight: 'bold' }}>Good</span>
                </div>
                <div style={{ height: '8px', backgroundColor: 'var(--hover-bg)', borderRadius: '4px' }}>
                  <div style={{ height: '100%', width: '65%', backgroundColor: '#ffc107', borderRadius: '4px' }} />
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span>Network Utilization</span>
                  <span style={{ color: '#17a2b8', fontWeight: 'bold' }}>Excellent</span>
                </div>
                <div style={{ height: '8px', backgroundColor: 'var(--hover-bg)', borderRadius: '4px' }}>
                  <div style={{ height: '100%', width: '89%', backgroundColor: '#17a2b8', borderRadius: '4px' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reports Component
const Reports = ({ showAlert }) => {
  const handleExportCSV = () => {
    generateCSVData(mockReports, 'security_reports');
    showAlert({
      type: 'success',
      title: 'CSV Export Successful',
      message: 'Report has been exported as CSV file and downloaded.'
    });
  };

  const handleExportPDF = async () => {
    const pdf = new jsPDF();
    
    // Add title
    pdf.setFontSize(20);
    pdf.text('UchitTech AI - Security Reports', 20, 30);
    
    // Add timestamp
    pdf.setFontSize(12);
    pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 45);
    
    // Add summary
    pdf.setFontSize(14);
    pdf.text('Report Summary:', 20, 65);
    pdf.setFontSize(10);
    
    let yPosition = 80;
    mockReports.forEach((report, index) => {
      pdf.text(`${index + 1}. ${report.title}`, 20, yPosition);
      pdf.text(`   Type: ${report.type} | Date: ${report.date} | Size: ${report.size}`, 25, yPosition + 10);
      pdf.text(`   Alerts: ${report.alerts} | Incidents: ${report.incidents} | Cameras: ${report.cameras}`, 25, yPosition + 20);
      yPosition += 35;
      
      if (yPosition > 250) {
        pdf.addPage();
        yPosition = 20;
      }
    });
    
    pdf.save(`UchitTech_Security_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    
    showAlert({
      type: 'success',
      title: 'PDF Export Successful',
      message: 'Report has been generated as PDF file and downloaded.'
    });
  };

  return (
    <div className="content-area">
      <div className="flex-between mb-30">
        <h1 style={{ fontSize: '32px', fontWeight: '700' }}>Reports & Logs</h1>
        <div className="flex gap-15">
          <button className="btn btn-success" onClick={handleExportCSV}>
            Export CSV
          </button>
          <button className="btn btn-danger" onClick={handleExportPDF}>
            Export PDF
          </button>
        </div>
      </div>

      <div className="grid grid-2 mb-30">
        <div className="card">
          <h3 className="card-title">Generate Report</h3>
          <div className="form-group">
            <label className="form-label">Report Type</label>
            <select className="form-input">
              <option>Incident Report</option>
              <option>Daily Summary</option>
              <option>Weekly Analysis</option>
              <option>Monthly Overview</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Date Range</label>
            <input type="date" className="form-input" />
          </div>
          <div className="form-group">
            <label className="form-label">Camera Selection</label>
            <select className="form-input">
              <option>All Cameras</option>
              <option>Front Gate Cameras</option>
              <option>Indoor Cameras</option>
              <option>Parking Cameras</option>
            </select>
          </div>
          <button className="btn btn-primary">Generate Report</button>
        </div>

        <div className="card">
          <h3 className="card-title">Recent Reports</h3>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {mockReports.map((report, index) => (
              <div key={report.id} style={{
                padding: '15px',
                borderBottom: '1px solid var(--border-color)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'background-color 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--hover-bg)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', marginBottom: '5px' }}>{report.title}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '5px' }}>
                    {report.date} • {report.type} • Generated by {report.generatedBy}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    Size: {report.size} | Alerts: {report.alerts} | Incidents: {report.incidents} | Cameras: {report.cameras}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    className="btn btn-primary" 
                    style={{ padding: '5px 10px', fontSize: '12px' }}
                    onClick={() => showAlert({
                      type: 'info',
                      title: 'Report Downloaded',
                      message: `${report.title} has been downloaded successfully.`
                    })}
                  >
                    Download
                  </button>
                  <button 
                    className="btn btn-secondary" 
                    style={{ padding: '5px 10px', fontSize: '12px', background: 'var(--info-color)', color: 'white' }}
                    onClick={() => showAlert({
                      type: 'info',
                      title: 'Report Preview',
                      message: `Viewing preview of ${report.title}`
                    })}
                  >
                    Preview
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Network Management Component
const NetworkManagement = ({ showAlert }) => {
  const [ipAddress, setIpAddress] = useState('');
  const [subnet, setSubnet] = useState('');
  const [gateway, setGateway] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [cameraName, setCameraName] = useState('');
  const [port, setPort] = useState('80');
  const [scanning, setScanning] = useState(false);

  const validateIP = (ip) => {
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipRegex.test(ip);
  };

  const handleAddCamera = () => {
    if (!validateIP(ipAddress)) {
      showAlert({
        type: 'error',
        title: 'Invalid IP Address',
        message: 'Please enter a valid IP address format.'
      });
      return;
    }

    if (!username || !password || !cameraName) {
      showAlert({
        type: 'error',
        title: 'Missing Credentials',
        message: 'Please provide camera name, username, and password.'
      });
      return;
    }

    showAlert({
      type: 'success',
      title: 'Camera Added Successfully',
      message: `Camera "${cameraName}" with IP ${ipAddress}:${port} has been added with secure credentials.`
    });

    setIpAddress('');
    setSubnet('');
    setGateway('');
    setUsername('');
    setPassword('');
    setCameraName('');
    setPort('80');
  };

  const handleAutoScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      showAlert({
        type: 'info',
        title: 'Network Scan Complete',
        message: 'Found 3 new devices on the network. Check the results below.'
      });
    }, 3000);
  };

  return (
    <div className="content-area">
      <h1 style={{ marginBottom: '30px', fontSize: '32px', fontWeight: '700' }}>
        Network Management
      </h1>

      <div className="grid grid-2">
        <div className="card">
          <h3 className="card-title">Add Camera Manually</h3>
          <div className="form-group">
            <label className="form-label">Camera Name</label>
            <input
              type="text"
              className="form-input"
              value={cameraName}
              onChange={(e) => setCameraName(e.target.value)}
              placeholder="Front Gate Camera"
            />
          </div>
          <div className="form-group">
            <label className="form-label">IP Address</label>
            <input
              type="text"
              className="form-input"
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
              placeholder="192.168.1.100"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter camera password"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Subnet Mask</label>
            <input
              type="text"
              className="form-input"
              value={subnet}
              onChange={(e) => setSubnet(e.target.value)}
              placeholder="255.255.255.0"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Gateway</label>
            <input
              type="text"
              className="form-input"
              value={gateway}
              onChange={(e) => setGateway(e.target.value)}
              placeholder="192.168.1.1"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Port</label>
            <input
              type="text"
              className="form-input"
              value={port}
              onChange={(e) => setPort(e.target.value)}
              placeholder="80"
            />
          </div>
          <button className="btn btn-primary" onClick={handleAddCamera}>
            Add Camera Securely
          </button>
        </div>

        <div className="card">
          <h3 className="card-title">Auto Network Scan</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
            Automatically discover cameras and devices on your local network.
          </p>
          <button 
            className="btn btn-success" 
            onClick={handleAutoScan}
            disabled={scanning}
            style={{ opacity: scanning ? 0.7 : 1 }}
          >
            {scanning && <div className="loading-spinner"></div>}
            {scanning ? 'Scanning Network...' : 'Start Auto Scan'}
          </button>
          
          {scanning && (
            <div style={{ marginTop: '15px', color: 'var(--text-secondary)' }}>
              Scanning IP range 192.168.1.1 - 192.168.1.255...
            </div>
          )}
        </div>
      </div>

      <div className="card mt-20">
        <h3 className="card-title">Connected Devices</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Device Name</th>
              <th>IP Address</th>
              <th>MAC Address</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: 'Front Gate Camera', ip: '192.168.1.101', mac: '00:1B:44:11:3A:B7', status: 'online' },
              { name: 'Parking Camera 1', ip: '192.168.1.102', mac: '00:1B:44:11:3A:B8', status: 'online' },
              { name: 'Storage Room Camera', ip: '192.168.1.103', mac: '00:1B:44:11:3A:B9', status: 'offline' },
              { name: 'Main Hall Camera', ip: '192.168.1.104', mac: '00:1B:44:11:3A:BA', status: 'online' }
            ].map((device, index) => (
              <tr key={index}>
                <td>{device.name}</td>
                <td>{device.ip}</td>
                <td>{device.mac}</td>
                <td>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    background: device.status === 'online' ? '#28a745' : '#dc3545',
                    color: '#fff'
                  }}>
                    {device.status.toUpperCase()}
                  </span>
                </td>
                <td>
                  <button className="btn btn-primary" style={{ padding: '5px 10px', fontSize: '12px' }}>
                    Configure
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Client System Info Component
const ClientSystemInfo = ({ showAlert }) => {
  const [systemInfo, setSystemInfo] = useState({});

  useEffect(() => {
    // Gather system information
    const info = {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      colorDepth: window.screen.colorDepth,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      cookieEnabled: navigator.cookieEnabled,
      onlineStatus: navigator.onLine
    };

    // Try to get geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setSystemInfo({
            ...info,
            latitude: position.coords.latitude.toFixed(6),
            longitude: position.coords.longitude.toFixed(6),
            accuracy: position.coords.accuracy
          });
        },
        () => {
          setSystemInfo({ ...info, location: 'Permission denied or unavailable' });
        }
      );
    } else {
      setSystemInfo({ ...info, location: 'Geolocation not supported' });
    }

    // Fetch public IP (simulated)
    setTimeout(() => {
      setSystemInfo(prev => ({ ...prev, publicIP: '203.0.113.195' }));
    }, 1000);
  }, []);

  const infoItems = [
    { label: 'Operating System', value: systemInfo.platform || 'Unknown' },
    { label: 'Browser', value: systemInfo.userAgent?.split(' ').pop() || 'Unknown' },
    { label: 'Screen Resolution', value: `${systemInfo.screenWidth} x ${systemInfo.screenHeight}` },
    { label: 'Window Size', value: `${systemInfo.windowWidth} x ${systemInfo.windowHeight}` },
    { label: 'Color Depth', value: `${systemInfo.colorDepth} bits` },
    { label: 'Language', value: systemInfo.language },
    { label: 'Timezone', value: systemInfo.timezone },
    { label: 'Cookies Enabled', value: systemInfo.cookieEnabled ? 'Yes' : 'No' },
    { label: 'Online Status', value: systemInfo.onlineStatus ? 'Online' : 'Offline' },
    { label: 'Public IP', value: systemInfo.publicIP || 'Loading...' },
    { label: 'Location', value: systemInfo.latitude ? `${systemInfo.latitude}, ${systemInfo.longitude}` : systemInfo.location || 'Loading...' }
  ];

  return (
    <div className="content-area">
      <h1 style={{ marginBottom: '30px', fontSize: '32px', fontWeight: '700' }}>
        Client System Information
      </h1>

      <div className="card">
        <h3 className="card-title">System Details</h3>
        <div className="grid grid-2 gap-20">
          {infoItems.map((item, index) => (
            <div key={index} style={{ 
              padding: '15px', 
              background: 'var(--hover-bg)', 
              borderRadius: '8px',
              border: '1px solid var(--border-color)'
            }}>
              <div style={{ 
                fontSize: '12px', 
                color: 'var(--text-secondary)', 
                marginBottom: '5px',
                fontWeight: '500'
              }}>
                {item.label}
              </div>
              <div style={{ fontWeight: '600', wordBreak: 'break-all' }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">Browser Capabilities</h3>
        <div className="grid grid-3 gap-15">
          {[
            { name: 'WebRTC', supported: 'RTCPeerConnection' in window },
            { name: 'WebGL', supported: !!document.createElement('canvas').getContext('webgl') },
            { name: 'Web Workers', supported: typeof Worker !== 'undefined' },
            { name: 'Local Storage', supported: typeof Storage !== 'undefined' },
            { name: 'Session Storage', supported: typeof sessionStorage !== 'undefined' },
            { name: 'IndexedDB', supported: 'indexedDB' in window }
          ].map((capability, index) => (
            <div key={index} style={{
              padding: '12px',
              textAlign: 'center',
              background: capability.supported ? 'var(--success-color)' : 'var(--danger-color)',
              color: 'white',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              {capability.name}: {capability.supported ? 'Supported' : 'Not Supported'}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Settings Component
const Settings = ({ showAlert, theme, toggleTheme }) => {
  const [alertSound, setAlertSound] = useState(true);
  const [defaultGridView, setDefaultGridView] = useState('3x3');
  const [autoRefresh, setAutoRefresh] = useState(30);

  const handleSaveSettings = () => {
    showAlert({
      type: 'success',
      title: 'Settings Saved',
      message: 'Your preferences have been saved successfully.'
    });
  };

  return (
    <div className="content-area">
      <h1 style={{ marginBottom: '30px', fontSize: '32px', fontWeight: '700' }}>
        System Settings
      </h1>

      <div className="grid grid-2">
        <div className="card">
          <h3 className="card-title">Display Preferences</h3>
          
          <div className="form-group">
            <label className="form-label">Theme</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                className={`btn ${theme === 'light' ? 'btn-primary' : ''}`}
                onClick={() => theme !== 'light' && toggleTheme()}
                style={{ flex: 1 }}
              >
                Light Mode
              </button>
              <button 
                className={`btn ${theme === 'dark' ? 'btn-primary' : ''}`}
                onClick={() => theme !== 'dark' && toggleTheme()}
                style={{ flex: 1 }}
              >
                Dark Mode
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Default Grid View</label>
            <select 
              className="form-input"
              value={defaultGridView}
              onChange={(e) => setDefaultGridView(e.target.value)}
            >
              <option value="2x2">2x2 Grid</option>
              <option value="3x3">3x3 Grid</option>
              <option value="4x4">4x4 Grid</option>
              <option value="5x5">5x5 Grid</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Auto Refresh Interval (seconds)</label>
            <input
              type="number"
              className="form-input"
              value={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.value)}
              min="5"
              max="300"
            />
          </div>
        </div>

        <div className="card">
          <h3 className="card-title">Alert Settings</h3>
          
          <div className="form-group">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="checkbox"
                id="alertSound"
                checked={alertSound}
                onChange={(e) => setAlertSound(e.target.checked)}
              />
              <label htmlFor="alertSound" className="form-label" style={{ marginBottom: 0 }}>
                Enable Alert Sounds
              </label>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '5px' }}>
              Play sound notifications when alerts are triggered
            </p>
          </div>

          <div className="form-group">
            <label className="form-label">Alert Popup Duration</label>
            <select className="form-input">
              <option value="3">3 seconds</option>
              <option value="5" selected>5 seconds</option>
              <option value="10">10 seconds</option>
              <option value="0">Manual dismiss only</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Critical Alert Actions</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                <input type="checkbox" defaultChecked />
                Send email notifications
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                <input type="checkbox" defaultChecked />
                Log to security database
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                <input type="checkbox" />
                Auto-record for 30 seconds
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">System Configuration</h3>
        <div className="grid grid-3 gap-20">
          <div>
            <label className="form-label">Recording Quality</label>
            <select className="form-input">
              <option value="720p">720p HD</option>
              <option value="1080p" selected>1080p Full HD</option>
              <option value="4k">4K Ultra HD</option>
            </select>
          </div>
          <div>
            <label className="form-label">Storage Retention</label>
            <select className="form-input">
              <option value="7">7 days</option>
              <option value="30" selected>30 days</option>
              <option value="90">90 days</option>
              <option value="365">1 year</option>
            </select>
          </div>
          <div>
            <label className="form-label">Motion Sensitivity</label>
            <input 
              type="range" 
              min="1" 
              max="10" 
              defaultValue="7"
              className="form-input"
              style={{ marginTop: '8px' }}
            />
          </div>
        </div>
      </div>

      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <button className="btn btn-primary" onClick={handleSaveSettings}>
          Save All Settings
        </button>
      </div>
    </div>
  );
};

// Notifications Component  
const Notifications = ({ showAlert }) => {
  const [message, setMessage] = useState('');
  const [alertType, setAlertType] = useState('info');
  const [channels, setChannels] = useState({
    whatsapp: false,
    telegram: false,
    email: false,
    sms: false
  });

  const handleChannelChange = (channel) => {
    setChannels(prev => ({
      ...prev,
      [channel]: !prev[channel]
    }));
  };

  const handleSendNotification = async () => {
    if (!message.trim()) {
      showAlert({
        type: 'error',
        title: 'Message Required',
        message: 'Please enter a message before sending.'
      });
      return;
    }

    const selectedChannels = Object.keys(channels).filter(key => channels[key]);
    if (selectedChannels.length === 0) {
      showAlert({
        type: 'warning',
        title: 'No Channels Selected',
        message: 'Please select at least one communication channel.'
      });
      return;
    }

    // Simulate notification sending logic
    const notificationResults = {};
    
    for (const channel of selectedChannels) {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
        
        switch(channel) {
          case 'email':
            // In production: Use service like SendGrid, Nodemailer
            // SIMULATED EMAIL SENDING: This would use your SMTP_HOST, SMTP_PORT, etc. from .env
            console.log(`Simulating email send: To: recipient@example.com, From: ${'your_from_email_from_env'}, Subject: ${alertType.toUpperCase()} Alert, Body: "${message}"`);
            notificationResults.email = { success: true, details: 'Email sent successfully (simulated)' };
            break;
          case 'whatsapp':
            // In production: Use WhatsApp Business API
            notificationResults.whatsapp = { success: true, details: 'WhatsApp message delivered' };
            break;
          case 'telegram':
            // In production: Use Telegram Bot API
            notificationResults.telegram = { success: true, details: 'Telegram message sent' };
            break;
          case 'sms':
            // In production: Use Twilio, AWS SNS
            notificationResults.sms = { success: true, details: 'SMS delivered' };
            break;
        }
      } catch (error) {
        notificationResults[channel] = { success: false, details: error.message };
      }
    }

    const successChannels = Object.keys(notificationResults).filter(key => notificationResults[key].success);
    const failedChannels = Object.keys(notificationResults).filter(key => !notificationResults[key].success);

    if (successChannels.length > 0) {
      showAlert({
        type: 'success',
        title: 'Notifications Sent Successfully',
        message: `Message delivered via: ${successChannels.map(c => c.toUpperCase()).join(', ')}\n"${message}"`
      });
    }

    if (failedChannels.length > 0) {
      showAlert({
        type: 'warning',
        title: 'Some Notifications Failed',
        message: `Failed to send via: ${failedChannels.map(c => c.toUpperCase()).join(', ')}`
      });
    }

    setMessage('');
    setChannels({ whatsapp: false, telegram: false, email: false, sms: false });
  };

  return (
    <div className="content-area">
      <h1 style={{ marginBottom: '30px', fontSize: '32px', fontWeight: '700' }}>
        Broadcast Notifications
      </h1>

      <div className="card">
        <h3 className="card-title">Send Alert Message</h3>
        
        <div className="form-group">
          <label className="form-label">Message Content</label>
          <textarea
            className="form-input"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your alert message here..."
            rows="4"
            style={{ resize: 'vertical' }}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Alert Type</label>
          <select 
            className="form-input"
            value={alertType}
            onChange={(e) => setAlertType(e.target.value)}
          >
            <option value="info">Information</option>
            <option value="warning">Warning</option>
            <option value="error">Critical Alert</option>
            <option value="success">All Clear</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Communication Channels</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', marginTop: '10px' }}>
            {[
              { key: 'whatsapp', label: 'WhatsApp', icon: '📱' },
              { key: 'telegram', label: 'Telegram', icon: '✈️' },
              { key: 'email', label: 'Email', icon: '📧' },
              { key: 'sms', label: 'SMS', icon: '💬' }
            ].map(channel => (
              <label key={channel.key} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px',
                border: `2px solid ${channels[channel.key] ? 'var(--active-bg)' : 'var(--border-color)'}`,
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'var(--transition)',
                background: channels[channel.key] ? 'rgba(0,123,255,0.1)' : 'transparent'
              }}>
                <input
                  type="checkbox"
                  checked={channels[channel.key]}
                  onChange={() => handleChannelChange(channel.key)}
                />
                <span style={{ fontSize: '18px' }}>{channel.icon}</span>
                <span style={{ fontWeight: '500' }}>{channel.label}</span>
              </label>
            ))}
          </div>
        </div>

        <button 
          className="btn btn-primary"
          onClick={handleSendNotification}
          style={{ width: '100%', padding: '15px', fontSize: '16px' }}
        >
          Send Notification
        </button>
      </div>

      <div className="card">
        <h3 className="card-title">Recent Notifications</h3>
        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
          {[
            { time: '14:30', message: 'Security breach detected at front gate', type: 'error', channels: ['Email', 'SMS'] },
            { time: '14:15', message: 'System maintenance completed successfully', type: 'success', channels: ['WhatsApp'] },
            { time: '13:45', message: 'Camera 3 offline - please check connection', type: 'warning', channels: ['Telegram', 'Email'] },
            { time: '13:30', message: 'Daily security report generated', type: 'info', channels: ['Email'] }
          ].map((notification, index) => (
            <div key={index} style={{
              padding: '15px',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start'
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{notification.time}</span>
                  <span style={{
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    background: notification.type === 'error' ? '#dc3545' :
                               notification.type === 'warning' ? '#ffc107' :
                               notification.type === 'success' ? '#28a745' : '#17a2b8',
                    color: notification.type === 'warning' ? '#000' : '#fff'
                  }}>
                    {notification.type.toUpperCase()}
                  </span>
                </div>
                <div style={{ marginBottom: '5px' }}>{notification.message}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Sent via: {notification.channels.join(', ')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// User Manual Component
const UserManual = ({ showAlert }) => {
  return (
    <div className="content-area">
      <h1 style={{ marginBottom: '30px', fontSize: '32px', fontWeight: '700' }}>
        UchitTech AI - Complete User Manual
      </h1>

      <div className="manual-content">
        <div className="manual-section">
          <h2>1. System Overview</h2>
          <p>
            UchitTech AI is a comprehensive surveillance management system designed for professional security operations. 
            The platform provides real-time monitoring, intelligent analytics, and automated alert systems to ensure 
            maximum security coverage and response efficiency.
          </p>
          
          <h3>Key Features:</h3>
          <ul>
            <li>Real-time camera monitoring with multiple grid layouts</li>
            <li>Intelligent motion detection and facial recognition</li>
            <li>Automated alert system with multi-channel notifications</li>
            <li>Comprehensive analytics and reporting tools</li>
            <li>Network management and device auto-discovery</li>
            <li>Dark/Light theme support for 24/7 operations</li>
            <li>Professional export capabilities (CSV/PDF)</li>
          </ul>
        </div>

        <div className="manual-section">
          <h2>2. Getting Started</h2>
          
          <h3>2.1 Login Process</h3>
          <p>
            Access the system using your registered credentials. The login page features a professional interface 
            with form validation and secure authentication.
          </p>
          <ul>
            <li><strong>Email:</strong> Enter your registered email address</li>
            <li><strong>Password:</strong> Use the show/hide toggle for secure entry</li>
            <li><strong>Remember Me:</strong> Keep your session active (optional)</li>
            <li><strong>Demo Access:</strong> Use <code>admin@uchittechnology.com</code> / <code>admin123</code></li>
          </ul>

          <h3>2.2 Interface Layout</h3>
          <p>The system interface consists of:</p>
          <ul>
            <li><strong>Left Sidebar:</strong> Navigation menu with all system modules</li>
            <li><strong>Top Bar:</strong> Theme toggle and logout controls</li>
            <li><strong>Main Content:</strong> Active module display area</li>
            <li><strong>Alert Popups:</strong> Real-time notifications (5-second auto-dismiss unless hovered)</li>
          </ul>
        </div>

        <div className="manual-section">
          <h2>3. Navigation & Controls</h2>
          
          <h3>3.1 Sidebar Navigation</h3>
          <p>Click any menu item to navigate between modules. Active sections are highlighted in blue.</p>
          
          <h3>3.2 Theme Toggle</h3>
          <p>
            Switch between Light and Dark modes using the toggle in the top-right corner. 
            Your preference is automatically saved and applied across all sessions.
          </p>
          
          <h3>3.3 Logout</h3>
          <p>
            The logout button is always accessible in the top-right corner. 
            Clicking it will securely end your session and return you to the login page.
          </p>
        </div>

        <div className="manual-section">
          <h2>4. Dashboard Module</h2>
          
          <h3>4.1 Overview Statistics</h3>
          <p>The dashboard provides key metrics at a glance:</p>
          <ul>
            <li><strong>Online Cameras:</strong> Real-time count of active surveillance devices</li>
            <li><strong>Today's Alerts:</strong> Number of security alerts generated today</li>
            <li><strong>Active Recordings:</strong> Cameras currently recording</li>
            <li><strong>System Uptime:</strong> Overall system availability percentage</li>
          </ul>

          <h3>4.2 Visual Analytics</h3>
          <p>Interactive charts and visualizations include:</p>
          <ul>
            <li><strong>Recent Activity Chart:</strong> Timeline of security events</li>
            <li><strong>Alert Distribution:</strong> Categorized alert frequency</li>
            <li><strong>24-Hour Heatmap:</strong> Activity patterns throughout the day</li>
          </ul>
        </div>

        <div className="manual-section">
          <h2>5. Live View Module</h2>
          
          <h3>5.1 Grid Layout Options</h3>
          <p>Select from multiple viewing configurations:</p>
          <ul>
            <li><strong>2x2 Grid:</strong> 4 cameras for detailed monitoring</li>
            <li><strong>3x3 Grid:</strong> 9 cameras for balanced overview</li>
            <li><strong>4x4 Grid:</strong> 16 cameras for comprehensive coverage</li>
            <li><strong>5x5 Grid:</strong> 25 cameras for maximum surveillance</li>
          </ul>

          <h3>5.2 Camera Status Indicators</h3>
          <ul>
            <li><strong>Green Dot:</strong> Camera online and functioning</li>
            <li><strong>Red Dot:</strong> Camera offline or disconnected</li>
            <li><strong>Red Badge:</strong> Motion detected</li>
            <li><strong>Recording Indicator:</strong> Active recording status</li>
          </ul>

          <h3>5.3 Filtering Options</h3>
          <p>Use the filter dropdown to display:</p>
          <ul>
            <li>All cameras (default view)</li>
            <li>Online cameras only</li>
            <li>Offline cameras for troubleshooting</li>
          </ul>

          <h3>5.4 Interactive Features</h3>
          <ul>
            <li><strong>Hover Effects:</strong> Enhanced visual feedback on camera cards</li>
            <li><strong>Click Actions:</strong> Access detailed camera controls</li>
            <li><strong>Real-time Updates:</strong> Status changes reflected immediately</li>
          </ul>
        </div>

        <div className="manual-section">
          <h2>6. Alerts Module</h2>
          
          <h3>6.1 Alert Timeline</h3>
          <p>
            View chronological list of all security alerts with detailed information including 
            timestamp, camera source, alert type, location, and severity level.
          </p>

          <h3>6.2 Alert Types</h3>
          <ul>
            <li><strong>Motion Detected:</strong> Movement in monitored areas</li>
            <li><strong>Unauthorized Access:</strong> Security breach attempts</li>
            <li><strong>Face Recognition:</strong> Known/unknown person detection</li>
            <li><strong>Loitering Detected:</strong> Extended presence in restricted areas</li>
            <li><strong>Object Left Behind:</strong> Suspicious item detection</li>
          </ul>

          <h3>6.3 Severity Levels</h3>
          <ul>
            <li><strong>Critical (Red):</strong> Immediate security threats requiring instant response</li>
            <li><strong>Warning (Yellow):</strong> Potential security concerns needing attention</li>
            <li><strong>Info (Blue):</strong> General notifications and system updates</li>
          </ul>

          <h3>6.4 Manual Alert Trigger</h3>
          <p>
            Security personnel can manually trigger alerts using the "Trigger Manual Alert" button. 
            This immediately notifies all connected systems and personnel.
          </p>

          <h3>6.5 Alert Filtering</h3>
          <p>Filter alerts by severity level to focus on specific priority levels during monitoring.</p>
        </div>

        <div className="manual-section">
          <h2>7. Analytics Module</h2>
          
          <h3>7.1 Performance Metrics</h3>
          <p>Monitor system effectiveness with key performance indicators:</p>
          <ul>
            <li><strong>Detection Accuracy:</strong> AI system precision rate (target: 98%+)</li>
            <li><strong>Response Time:</strong> Average alert processing speed</li>
            <li><strong>System Uptime:</strong> Infrastructure reliability percentage</li>
          </ul>

          <h3>7.2 Trend Analysis</h3>
          <ul>
            <li><strong>Alert Frequency Charts:</strong> Camera-by-camera incident rates</li>
            <li><strong>Weekly Trends:</strong> Pattern identification and seasonal analysis</li>
            <li><strong>Historical Comparisons:</strong> Month-over-month performance tracking</li>
          </ul>

          <h3>7.3 Operational Insights</h3>
          <p>
            Use analytics data to optimize camera placement, adjust sensitivity settings, 
            and improve overall security coverage effectiveness.
          </p>
        </div>

        <div className="manual-section">
          <h2>8. Reports Module</h2>
          
          <h3>8.1 Report Generation</h3>
          <p>Create comprehensive security reports with customizable parameters:</p>
          <ul>
            <li><strong>Report Types:</strong> Incident, Daily Summary, Weekly Analysis, Monthly Overview</li>
            <li><strong>Date Range:</strong> Specify custom time periods for analysis</li>
            <li><strong>Camera Selection:</strong> Include specific cameras or camera groups</li>
          </ul>

          <h3>8.2 Export Formats</h3>
          <ul>
            <li><strong>CSV Export:</strong> Data format for spreadsheet analysis</li>
            <li><strong>PDF Export:</strong> Professional reports for documentation</li>
            <li><strong>Automated Scheduling:</strong> Set up regular report generation</li>
          </ul>

          <h3>8.3 Report Management</h3>
          <p>
            Access previously generated reports from the Recent Reports section. 
            Download or share reports as needed for compliance and documentation.
          </p>
        </div>

        <div className="manual-section">
          <h2>9. Network Management</h2>
          
          <h3>9.1 Manual Camera Addition</h3>
          <p>Add cameras to the network manually by specifying:</p>
          <ul>
            <li><strong>IP Address:</strong> Camera's network address (validated format)</li>
            <li><strong>Subnet Mask:</strong> Network configuration parameter</li>
            <li><strong>Gateway:</strong> Network routing information</li>
          </ul>

          <h3>9.2 Auto Network Scanning</h3>
          <p>
            Automatically discover cameras and devices on your local network. 
            The system scans IP ranges and identifies compatible surveillance devices.
          </p>

          <h3>9.3 Device Management</h3>
          <p>
            View and manage all connected devices with details including:
            device name, IP address, MAC address, connection status, and configuration options.
          </p>

          <h3>9.4 Network Troubleshooting</h3>
          <ul>
            <li>Verify IP address formats before adding devices</li>
            <li>Check network connectivity for offline devices</li>
            <li>Use auto-scan to detect configuration issues</li>
            <li>Monitor device status for proactive maintenance</li>
          </ul>
        </div>

        <div className="manual-section">
          <h2>10. Client System Information</h2>
          
          <h3>10.1 System Details</h3>
          <p>View comprehensive information about the client system:</p>
          <ul>
            <li><strong>Operating System:</strong> Platform and version details</li>
            <li><strong>Browser Information:</strong> Compatibility and version data</li>
            <li><strong>Browser Information:</strong> Compatibility and version data</li>
            <li><strong>Network Information:</strong> IP address and location data</li>
          </ul>

          <h3>10.2 Browser Capabilities</h3>
          <p>
            The system automatically detects browser capabilities including WebRTC support, 
            WebGL availability, storage options, and other features critical for optimal performance.
          </p>

          <h3>10.3 Diagnostic Use</h3>
          <p>
            Use this information for troubleshooting compatibility issues, 
            optimizing display settings, and ensuring optimal system performance.
          </p>
        </div>

        <div className="manual-section">
          <h2>11. Settings Module</h2>
          
          <h3>11.1 Display Preferences</h3>
          <ul>
            <li><strong>Theme Selection:</strong> Choose between Light and Dark modes</li>
            <li><strong>Default Grid View:</strong> Set preferred camera layout</li>
            <li><strong>Auto Refresh:</strong> Configure automatic page refresh intervals</li>
          </ul>

          <h3>11.2 Alert Configuration</h3>
          <ul>
            <li><strong>Sound Notifications:</strong> Enable/disable alert audio</li>
            <li><strong>Popup Duration:</strong> Set alert display time (3-10 seconds)</li>
            <li><strong>Critical Actions:</strong> Configure automatic responses to critical alerts</li>
          </ul>

          <h3>11.3 System Configuration</h3>
          <ul>
            <li><strong>Recording Quality:</strong> Set video resolution (720p to 4K)</li>
            <li><strong>Storage Retention:</strong> Configure data retention periods</li>
            <li><strong>Motion Sensitivity:</strong> Adjust detection sensitivity levels</li>
          </ul>

          <h3>11.4 Preference Persistence</h3>
          <p>
            All settings are automatically saved to local storage and persist across sessions. 
            Changes take effect immediately without requiring system restart.
          </p>
        </div>

        <div className="manual-section">
          <h2>12. Notifications Module</h2>
          
          <h3>12.1 Message Composition</h3>
          <p>Create and send alert messages with:</p>
          <ul>
            <li><strong>Message Content:</strong> Custom text for the notification</li>
            <li><strong>Alert Type:</strong> Information, Warning, Critical, or All Clear</li>
            <li><strong>Channel Selection:</strong> Choose delivery methods</li>
          </ul>

          <h3>12.2 Communication Channels</h3>
          <ul>
            <li><strong>WhatsApp:</strong> Instant messaging for mobile teams</li>
            <li><strong>Telegram:</strong> Secure messaging platform</li>
            <li><strong>Email:</strong> Professional documentation and records</li>
            <li><strong>SMS:</strong> Emergency text message alerts</li>
          </ul>

          <h3>12.3 Notification History</h3>
          <p>
            Track all sent notifications with timestamps, message content, 
            alert types, and delivery channels for audit and compliance purposes.
          </p>

          <h3>12.4 Best Practices</h3>
          <ul>
            <li>Use appropriate alert types for different severity levels</li>
            <li>Select multiple channels for critical alerts</li>
            <li>Keep messages clear and action-oriented</li>
            <li>Regularly review notification history for patterns</li>
          </ul>
        </div>

        <div className="manual-section">
          <h2>13. Alert Popup System</h2>
          
          <h3>13.1 Popup Behavior</h3>
          <ul>
            <li><strong>Auto-Display:</strong> Alerts appear automatically in top-right corner</li>
            <li><strong>5-Second Timer:</strong> Automatic dismissal after 5 seconds</li>
            <li><strong>Hover Persistence:</strong> Timer pauses when mouse hovers over popup</li>
            <li><strong>Click Dismissal:</strong> Click anywhere on popup to close immediately</li>
            <li><strong>Audio Notification:</strong> Sound plays when alerts appear (if enabled)</li>
          </ul>

          <h3>13.2 Alert Types and Colors</h3>
          <ul>
            <li><strong>Success (Green):</strong> Operations completed successfully</li>
            <li><strong>Error (Red):</strong> Critical issues requiring immediate attention</li>
            <li><strong>Warning (Yellow):</strong> Important notifications needing review</li>
            <li><strong>Info (Blue):</strong> General information and status updates</li>
          </ul>

          <h3>13.3 Audio System</h3>
          <p>
            Alert sounds are automatically played from the specified audio file: 
            <code>/new-notification-09-352705.mp3</code>. 
            Volume is set to 50% for professional environments.
          </p>
        </div>

        <div className="manual-section">
          <h2>14. Troubleshooting Guide</h2>
          
          <h3>14.1 Common Issues</h3>
          <ul>
            <li><strong>Login Problems:</strong> Verify credentials, check network connectivity</li>
            <li><strong>Camera Offline:</strong> Check IP configuration, network cables, power</li>
            <li><strong>No Alerts:</strong> Verify motion sensitivity, camera positioning</li>
            <li><strong>Slow Performance:</strong> Check browser compatibility, clear cache</li>
          </ul>

          <h3>14.2 Browser Requirements</h3>
          <ul>
            <li>Modern browser with JavaScript enabled</li>
            <li>WebRTC support for video streaming</li>
            <li>Local storage capability</li>
            <li>Minimum 1024x768 screen resolution</li>
          </ul>

          <h3>14.3 Network Requirements</h3>
          <ul>
            <li>Stable internet connection</li>
            <li>Properly configured local network</li>
            <li>Open ports for camera communication</li>
            <li>Sufficient bandwidth for video streaming</li>
          </ul>
        </div>

        <div className="manual-section">
          <h2>15. Security & Privacy</h2>
          
          <h3>15.1 Data Protection</h3>
          <ul>
            <li>All communications use secure protocols</li>
            <li>Local storage encryption for sensitive data</li>
            <li>Session timeout for security</li>
            <li>Audit logs for all user actions</li>
          </ul>

          <h3>15.2 Access Control</h3>
          <ul>
            <li>User authentication required for all access</li>
            <li>Session management and automatic logout</li>
            <li>Role-based access control (future enhancement)</li>
            <li>Secure password requirements</li>
          </ul>

          <h3>15.3 Compliance</h3>
          <p>
            The system is designed to support compliance with security industry standards 
            and provides comprehensive logging and audit trails for regulatory requirements.
          </p>
        </div>

        <div className="manual-section">
          <h2>16. Support & Maintenance</h2>
          
          <h3>16.1 Technical Support</h3>
          <p><strong>Contact Information:</strong></p>
          <ul>
            <li><strong>Email:</strong> support@uchittechnology.com</li>
            <li><strong>Emergency Support:</strong> Available 24/7 for critical issues</li>
            <li><strong>Documentation:</strong> Complete technical documentation available</li>
            <li><strong>Training:</strong> Professional training sessions available</li>
          </ul>

          <h3>16.2 System Maintenance</h3>
          <ul>
            <li>Regular software updates and security patches</li>
            <li>Camera firmware maintenance schedules</li>
            <li>Database optimization and cleanup procedures</li>
            <li>Backup and disaster recovery protocols</li>
          </ul>

          <h3>16.3 Performance Optimization</h3>
          <ul>
            <li>Monitor system resource usage regularly</li>
            <li>Optimize camera placement for coverage efficiency</li>
            <li>Adjust recording quality based on storage capacity</li>
            <li>Regular review of alert sensitivity settings</li>
          </ul>
        </div>

        <div className="manual-section">
          <h2>17. Advanced Features</h2>
          
          <h3>17.1 AI-Powered Analytics</h3>
          <ul>
            <li>Facial recognition with database matching</li>
            <li>Behavioral pattern analysis</li>
            <li>Predictive threat assessment</li>
            <li>Automated incident classification</li>
          </ul>

          <h3>17.2 Integration Capabilities</h3>
          <ul>
            <li>Third-party security system integration</li>
            <li>Access control system connectivity</li>
            <li>Emergency response system links</li>
            <li>Building management system integration</li>
          </ul>

          <h3>17.3 Mobile Access</h3>
          <ul>
            <li>Responsive design for mobile devices</li>
            <li>Touch-optimized interface</li>
            <li>Push notifications for mobile alerts</li>
            <li>Offline capability for critical functions</li>
          </ul>
        </div>

        <div style={{ 
          marginTop: '40px', 
          padding: '25px', 
          background: 'var(--active-bg)', 
          color: 'white', 
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <h3 style={{ marginBottom: '15px', color: 'white' }}>UchitTech AI Support</h3>
          <p style={{ marginBottom: '10px', fontSize: '16px' }}>
            For technical support, training, or additional information:
          </p>
          <p style={{ fontSize: '18px', fontWeight: 'bold' }}>
            📧 support@uchittechnology.com
          </p>
          <p style={{ fontSize: '14px', marginTop: '15px', opacity: 0.9 }}>
            Professional Surveillance Solutions • Available 24/7 • Expert Support Team
          </p>
        </div>
      </div>
    </div>
  );
};

// Layout Component
const Layout = ({ children, activeTab, setActiveTab, onLogout, theme, toggleTheme }) => {
  const navigate = useNavigate();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', path: '/dashboard' },
    { id: 'live-view', label: 'Live View', path: '/live-view' },
    { id: 'alerts', label: 'Alerts', path: '/alerts' },
    { id: 'analytics', label: 'Analytics', path: '/analytics' },
    { id: 'reports', label: 'Reports', path: '/reports' },
    { id: 'network', label: 'Network Management', path: '/network' },
    { id: 'system-info', label: 'Client System Info', path: '/system-info' },
    { id: 'settings', label: 'Settings', path: '/settings' },
    { id: 'notifications', label: 'Notifications', path: '/notifications' },
    { id: 'manual', label: 'User Manual', path: '/manual' }
  ];

  const handleNavClick = (item) => {
    setActiveTab(item.id);
    navigate(item.path);
  };

  return (
    <div className="app-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            <img 
              src="/logo.png" 
              alt="UchitTech AI Logo" 
              style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '8px',
                objectFit: 'contain',
                transition: 'transform 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.1) rotate(5deg)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1) rotate(0deg)'}
            />
            <h1 className="sidebar-title">UchitTech AI</h1>
          </div>
        </div>
        <nav className="sidebar-nav">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => handleNavClick(item)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="main-content">
        <div className="top-bar">
          <div></div>
          <div className="top-bar-controls">
            <button className="theme-toggle" onClick={toggleTheme}>
              {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
            </button>
            <button className="logout-btn" onClick={onLogout}>
              Logout
            </button>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState('light');
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    // Load saved theme
    const savedTheme = localStorage.getItem('uchittech-theme') || 'light';
    setTheme(savedTheme);
    document.body.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('uchittech-theme', newTheme);
    document.body.setAttribute('data-theme', newTheme);
  };

  const showAlert = ({ type, title, message }) => {
    setAlert({ type, title, message, closing: false });
  };

  const closeAlert = () => {
    if (alert) {
      setAlert({ ...alert, closing: true });
      setTimeout(() => setAlert(null), 400);
    }
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveTab('dashboard');
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} theme={theme} toggleTheme={toggleTheme} />;
  }

  return (
    <Router>
      <Layout 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout}
        theme={theme}
        toggleTheme={toggleTheme}
      >
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard showAlert={showAlert} />} />
          <Route path="/live-view" element={<LiveView showAlert={showAlert} />} />
          <Route path="/alerts" element={<Alerts showAlert={showAlert} />} />
          <Route path="/analytics" element={<Analytics showAlert={showAlert} />} />
          <Route path="/reports" element={<Reports showAlert={showAlert} />} />
          <Route path="/network" element={<NetworkManagement showAlert={showAlert} />} />
          <Route path="/system-info" element={<ClientSystemInfo showAlert={showAlert} />} />
          <Route path="/settings" element={<Settings showAlert={showAlert} theme={theme} toggleTheme={toggleTheme} />} />
          <Route path="/notifications" element={<Notifications showAlert={showAlert} />} />
          <Route path="/manual" element={<UserManual showAlert={showAlert} />} />
        </Routes>
      </Layout>
      
      <AlertPopup alert={alert} onClose={closeAlert} />
    </Router>
  );
};

export default App;