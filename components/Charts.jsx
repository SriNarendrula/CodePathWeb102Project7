// components/Charts.jsx
import React from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  Cell
} from 'recharts';

function Charts({ data }) {
  // Prepare data for Media Type Distribution (Pie Chart)
  const imageCount = data.filter(item => item.media_type === 'image').length;
  const videoCount = data.filter(item => item.media_type === 'video').length;
  
  const mediaTypeData = [
    { name: 'Images', value: imageCount, color: '#ffd89b' },
    { name: 'Videos', value: videoCount, color: '#c7e9fb' }
  ];

  // Prepare data for Title Length Distribution (Bar Chart) - Fixed horizontal layout
  const titleLengthData = data
    .filter(item => item.title)
    .map(item => ({
      title: item.title?.length > 25 ? item.title.substring(0, 22) + '...' : item.title,
      length: item.title?.length || 0,
      fullTitle: item.title
    }))
    .sort((a, b) => b.length - a.length)
    .slice(0, 10);

  // Prepare data for Monthly Distribution (Line Chart)
  const monthlyData = {};
  data.forEach(item => {
    if (item.date && item.date.length >= 7) {
      const month = item.date.substring(0, 7); // YYYY-MM format
      if (!monthlyData[month]) {
        monthlyData[month] = { month, count: 0 };
      }
      monthlyData[month].count++;
    }
  });
  
  const monthlyChartData = Object.values(monthlyData).sort((a, b) => 
    a.month.localeCompare(b.month)
  );

  // Prepare data for Copyright Distribution (Bar Chart)
  const copyrightCounts = {};
  data.forEach(item => {
    if (item.copyright && item.copyright.trim()) {
      const copyright = item.copyright;
      copyrightCounts[copyright] = (copyrightCounts[copyright] || 0) + 1;
    } else {
      copyrightCounts['NASA/Public Domain'] = (copyrightCounts['NASA/Public Domain'] || 0) + 1;
    }
  });
  
  const copyrightData = Object.entries(copyrightCounts)
    .map(([name, count]) => ({ 
      name: name.length > 18 ? name.substring(0, 15) + '...' : name, 
      count, 
      fullName: name 
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  // Custom colors for charts
  const COLORS = ['#ffd89b', '#c7e9fb', '#ffaaaa', '#aaffaa', '#ffaaff', '#aaffff', '#ffaacc', '#ccffaa'];

  // Custom tooltip for charts with better contrast
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip">
          <p className="tooltip-label" style={{ color: '#1a1a3a', fontWeight: 'bold' }}>{label}</p>
          <p className="tooltip-value" style={{ color: '#ffd89b', fontWeight: 'bold' }}>{payload[0].value} items</p>
        </div>
      );
    }
    return null;
  };

  if (data.length === 0) {
    return (
      <div className="charts-container">
        <div className="chart-card">
          <p>Loading chart data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="charts-container">
      <div className="chart-card">
        <h3 style={{ color: '#ffd89b' }}>Media Type Distribution</h3>
        <p className="chart-description" style={{ color: '#ccc' }}>Images make up the majority of APOD content, with videos appearing less frequently</p>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={mediaTypeData}
              cx="50%"
              cy="50%"
              labelLine={true}
              label={({ name, percent }) => percent > 0 ? `${name}: ${(percent * 100).toFixed(0)}%` : name}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {mediaTypeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ color: '#ddd' }} />
          </PieChart>
        </ResponsiveContainer>
        <div className="chart-insight">
          💡 <strong>Insight:</strong> Only {((videoCount / (imageCount + videoCount)) * 100).toFixed(1)}% of content is video, 
          making images the primary format for astronomical education.
        </div>
      </div>

      <div className="chart-card">
        <h3 style={{ color: '#ffd89b' }}>Title Length Distribution</h3>
        <p className="chart-description" style={{ color: '#ccc' }}>Top 10 items by title character count (sorted longest to shortest)</p>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart 
            data={titleLengthData} 
            layout="vertical" 
            margin={{ left: 120, right: 30, top: 20, bottom: 20 }}
            barSize={20}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis 
              type="number" 
              label={{ 
                value: 'Title Length (characters)', 
                position: 'insideBottom', 
                offset: -5,
                style: { fill: '#ccc', fontSize: 12 }
              }}
              tick={{ fill: '#ccc' }}
            />
            <YAxis 
              type="category" 
              dataKey="title" 
              width={110}
              tick={{ fill: '#ddd', fontSize: 11 }}
            />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="chart-tooltip" style={{ background: '#1a1a3a', border: '1px solid #ffd89b', borderRadius: '8px', padding: '10px' }}>
                      <p style={{ margin: 0, color: '#ffd89b', fontWeight: 'bold' }}><strong>{payload[0].payload.fullTitle}</strong></p>
                      <p style={{ margin: '5px 0 0 0', color: '#fff' }}>📝 {payload[0].value} characters</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="length" fill="#ffd89b" radius={[0, 5, 5, 0]}>
              {titleLengthData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.length > 50 ? '#ffaaff' : '#ffd89b'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="chart-insight">
          💡 <strong>Insight:</strong> Title lengths vary significantly, with descriptive titles often exceeding 50 characters. The longest titles provide detailed astronomical context.
        </div>
      </div>

      {monthlyChartData.length > 0 && (
        <div className="chart-card">
          <h3 style={{ color: '#ffd89b' }}>Content Distribution Over Time</h3>
          <p className="chart-description" style={{ color: '#ccc' }}>Number of featured items by month</p>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="month" tick={{ fill: '#ccc' }} />
              <YAxis tick={{ fill: '#ccc' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ color: '#ddd' }} />
              <Area type="monotone" dataKey="count" stroke="#ffd89b" fill="#ffd89b" fillOpacity={0.3} />
              <Line type="monotone" dataKey="count" stroke="#c7e9fb" strokeWidth={2} dot={{ fill: '#ffd89b', r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="chart-insight">
            💡 <strong>Insight:</strong> Monthly content distribution shows consistent coverage, 
            with some months featuring more astronomical events.
          </div>
        </div>
      )}

      <div className="chart-card">
        <h3 style={{ color: '#ffd89b' }}>Top Contributors</h3>
        <p className="chart-description" style={{ color: '#ccc' }}>Most frequent photographers and organizations</p>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart 
            data={copyrightData} 
            layout="vertical"
            margin={{ left: 120, right: 30, top: 20, bottom: 20 }}
            barSize={25}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis 
              type="number" 
              label={{ 
                value: 'Number of Contributions', 
                position: 'insideBottom', 
                offset: -5,
                style: { fill: '#ccc', fontSize: 12 }
              }}
              tick={{ fill: '#ccc' }}
            />
            <YAxis 
              type="category" 
              dataKey="name" 
              width={115}
              tick={{ fill: '#ddd', fontSize: 11 }}
            />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="chart-tooltip" style={{ background: '#1a1a3a', border: '1px solid #c7e9fb', borderRadius: '8px', padding: '10px' }}>
                      <p style={{ margin: 0, color: '#c7e9fb', fontWeight: 'bold' }}><strong>{payload[0].payload.fullName}</strong></p>
                      <p style={{ margin: '5px 0 0 0', color: '#fff' }}>📸 {payload[0].value} contribution{payload[0].value !== 1 ? 's' : ''}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="count" fill="#c7e9fb" radius={[0, 5, 5, 0]}>
              {copyrightData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="chart-insight">
          💡 <strong>Insight:</strong> NASA and public domain content form the backbone of APOD, 
          while individual astrophotographers make significant contributions.
        </div>
      </div>
    </div>
  );
}

export default Charts;