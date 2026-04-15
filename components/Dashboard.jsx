// components/Dashboard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Charts from './Charts';

function Dashboard({ data, error }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [mediaTypeFilter, setMediaTypeFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [showCharts, setShowCharts] = useState(true);
  const [imageErrors, setImageErrors] = useState({});

  // Calculate summary statistics
  const totalItems = data.length;
  const imageCount = data.filter(item => item.media_type === 'image').length;
  const videoCount = data.filter(item => item.media_type === 'video').length;
  const avgTitleLength = data.length > 0 
    ? (data.reduce((sum, item) => sum + (item.title?.length || 0), 0) / data.length).toFixed(1)
    : 0;
  const copyrightHolders = data.filter(item => item.copyright).map(item => item.copyright);
  const uniqueCopyrightHolders = new Set(copyrightHolders).size;
  
  // Get date range for statistics
  const dates = data.map(item => new Date(item.date)).filter(d => !isNaN(d));
  const oldestDate = dates.length > 0 ? new Date(Math.min(...dates)).toLocaleDateString() : 'N/A';
  const newestDate = dates.length > 0 ? new Date(Math.max(...dates)).toLocaleDateString() : 'N/A';

  // Filter data
  const filteredData = data.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.explanation?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesMediaType = mediaTypeFilter === 'all' || item.media_type === mediaTypeFilter;
    
    let matchesDateRange = true;
    if (dateRange.start && dateRange.end) {
      const itemDate = new Date(item.date);
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      matchesDateRange = itemDate >= startDate && itemDate <= endDate;
    } else if (dateRange.start) {
      const itemDate = new Date(item.date);
      const startDate = new Date(dateRange.start);
      matchesDateRange = itemDate >= startDate;
    } else if (dateRange.end) {
      const itemDate = new Date(item.date);
      const endDate = new Date(dateRange.end);
      matchesDateRange = itemDate <= endDate;
    }
    
    return matchesSearch && matchesMediaType && matchesDateRange;
  });

  // Function to generate a safe ID from title and date
  const getItemId = (item) => {
    return `${item.title?.replace(/[^a-z0-9]/gi, '_')}_${item.date}`;
  };

  // Handle image errors with a simple data URL fallback (no external service)
  const handleImageError = (itemId) => {
    setImageErrors(prev => ({ ...prev, [itemId]: true }));
  };

  // Simple SVG data URL fallback (no external dependencies)
  const getFallbackImage = () => {
    return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Crect width="100" height="100" fill="%23222"%3E%3C/rect%3E%3Ctext x="50" y="50" text-anchor="middle" dy=".3em" fill="%23666" font-size="12"%3E🌌%3C/text%3E%3C/svg%3E';
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>🌌 Astronomy Picture of the Day Dashboard</h1>
        <p className="subtitle">Explore cosmic wonders from NASA's daily astronomy feature</p>
        {error && (
          <div className="warning-banner">
            ⚠️ NASA API temporarily unavailable. Showing sample data. Please try again later.
          </div>
        )}
      </div>

      {/* Summary Statistics Dashboard */}
      <div className="stats-dashboard">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-value">{totalItems}</div>
          <div className="stat-label">Total Items</div>
          <div className="stat-sub">Cosmic wonders</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🖼️</div>
          <div className="stat-value">{imageCount}</div>
          <div className="stat-label">Images</div>
          <div className="stat-sub">{totalItems > 0 ? ((imageCount/totalItems)*100).toFixed(0) : 0}% of collection</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🎬</div>
          <div className="stat-value">{videoCount}</div>
          <div className="stat-label">Videos</div>
          <div className="stat-sub">{totalItems > 0 ? ((videoCount/totalItems)*100).toFixed(0) : 0}% of collection</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-value">{avgTitleLength}</div>
          <div className="stat-label">Avg Title Length</div>
          <div className="stat-sub">characters per title</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🎨</div>
          <div className="stat-value">{uniqueCopyrightHolders}</div>
          <div className="stat-label">Unique Contributors</div>
          <div className="stat-sub">photographers & agencies</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-value">{oldestDate !== 'N/A' ? oldestDate.substring(0, 10) : 'N/A'} - {newestDate !== 'N/A' ? newestDate.substring(0, 10) : 'N/A'}</div>
          <div className="stat-label">Date Range</div>
          <div className="stat-sub">coverage period</div>
        </div>
      </div>

      {/* Charts Section with Toggle */}
      <div className="charts-section">
        <div className="charts-header">
          <h2>📈 Data Visualizations</h2>
          <button 
            className="toggle-charts-btn"
            onClick={() => setShowCharts(!showCharts)}
          >
            {showCharts ? 'Hide Charts ▲' : 'Show Charts ▼'}
          </button>
        </div>
        {showCharts && <Charts data={data} />}
      </div>

      {/* Search and Filter Controls */}
      <div className="controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Search by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-group">
          <label>Media Type:</label>
          <select 
            value={mediaTypeFilter} 
            onChange={(e) => setMediaTypeFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Media</option>
            <option value="image">📷 Images Only</option>
            <option value="video">🎥 Videos Only</option>
          </select>
        </div>

        <div className="filter-group date-range">
          <label>Date Range:</label>
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
            className="date-input"
          />
          <span>to</span>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
            className="date-input"
          />
        </div>
      </div>

      {/* Results Summary */}
      <div className="results-summary">
        <p>Showing {filteredData.length} of {totalItems} cosmic wonders</p>
        {(searchTerm || mediaTypeFilter !== 'all' || dateRange.start || dateRange.end) && (
          <button 
            className="clear-filters"
            onClick={() => {
              setSearchTerm('');
              setMediaTypeFilter('all');
              setDateRange({ start: '', end: '' });
            }}
          >
            Clear All Filters
          </button>
        )}
      </div>

      {/* List View of Data with Links */}
      <div className="data-list">
        {filteredData.length === 0 ? (
          <div className="no-results">
            <p>✨ No cosmic wonders match your filters. Try adjusting your search! ✨</p>
          </div>
        ) : (
          filteredData.map((item, index) => {
            const itemId = getItemId(item);
            const hasImageError = imageErrors[item.date + index];
            return (
              <Link to={`/item/${encodeURIComponent(itemId)}`} key={item.date + index} className="data-row-link">
                <div className="data-row">
                  <div className="row-media">
                    {item.media_type === 'image' ? (
                      <img 
                        src={hasImageError ? getFallbackImage() : (item.url || getFallbackImage())}
                        alt={item.title || 'Space image'}
                        className="row-thumbnail"
                        onError={() => handleImageError(item.date + index)}
                      />
                    ) : (
                      <div className="video-placeholder">
                        🎬
                      </div>
                    )}
                  </div>
                  <div className="row-content">
                    <div className="row-header">
                      <h3>{item.title || 'Untitled'}</h3>
                      <span className="date-badge">{item.date || 'Date unknown'}</span>
                    </div>
                    <p className="row-explanation">
                      {(item.explanation || 'No description available.').substring(0, 120)}
                      {(item.explanation?.length || 0) > 120 ? '...' : ''}
                    </p>
                    <div className="row-meta">
                      {item.copyright && (
                        <span className="meta-tag">📸 {item.copyright}</span>
                      )}
                      <span className="meta-tag">
                        {item.media_type === 'image' ? '🖼️ Image' : '🎥 Video'}
                      </span>
                      {item.hdurl && (
                        <span className="meta-tag">✨ HD Available</span>
                      )}
                    </div>
                  </div>
                  <div className="row-action">
                    <span className="view-details">View Details →</span>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>

      <footer className="footer">
        <p>Data provided by NASA APOD API | Click on any item to see detailed information</p>
      </footer>
    </div>
  );
}

export default Dashboard;