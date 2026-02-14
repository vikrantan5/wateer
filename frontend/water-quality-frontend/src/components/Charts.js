import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

const Charts = ({ stationId }) => {
  // Mock data representing the readings from your backend models (pH, value, etc.)
  const lineData = [
    { time: '2026-02-04', ph: 7.2, do: 5.5, turbidity: 2.1 },
    { time: '2026-02-05', ph: 7.1, do: 5.8, turbidity: 4.3 },
    { time: '2026-02-09', ph: 8.4, do: 5.2, turbidity: 2.2 },
    { time: '2026-02-11', ph: 7.3, do: 5.9, turbidity: 2.5 },
  ];

  const radarData = [
    { subject: 'pH', A: 7.5, fullMark: 14 },
    { subject: 'DO', A: 6.0, fullMark: 10 },
    { subject: 'turbidity', A: 3.5, fullMark: 10 },
  ];

  return (
    <div className="charts-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
      {/* Line Chart Section */}
      <div className="glass-card" style={{ flex: '1', minWidth: '400px', height: '400px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
            <XAxis dataKey="time" stroke="#a3aed0" />
            <YAxis stroke="#a3aed0" />
            <Tooltip contentStyle={{ backgroundColor: '#111c44', border: 'none' }} />
            <Legend />
            <Line type="monotone" dataKey="ph" stroke="#8884d8" dot={{ r: 4 }} />
            <Line type="monotone" dataKey="do" stroke="#82ca9d" dot={{ r: 4 }} />
            <Line type="monotone" dataKey="turbidity" stroke="#ff4b5c" dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Radar Chart Section */}
      <div className="glass-card" style={{ flex: '0.4', minWidth: '300px', height: '400px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
            <PolarGrid stroke="#2d3748" />
            <PolarAngleAxis dataKey="subject" stroke="#a3aed0" />
            <PolarRadiusAxis stroke="#a3aed0" />
            <Radar
              name="Current Quality"
              dataKey="A"
              stroke="#0081ff"
              fill="#0081ff"
              fillOpacity={0.6}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Charts;