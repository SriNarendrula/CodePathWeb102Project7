// components/DetailView.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function DetailView({ data }) {
  const { itemId } = useParams();
  const navigate = useNavigate();

  // Decode the itemId and find the matching item
  const findItem = () => {
    const decodedId = decodeURIComponent(itemId);
    // Extract the date from the ID (it's the part after the last underscore)
    const dateMatch = decodedId.match(/(\d{4}-\d{2}-\d{2})$/);
    if (dateMatch) {
      const date = dateMatch[1];
      return data.find(item => item.date === date);
    }
    // Fallback: try to match by title (remove the suffix)
    const titlePart = decodedId.replace(/_\d{4}-\d{2}-\d{2}$/, '');
    const cleanTitle = titlePart.replace(/_/g, ' ');
    return data.find(item => item.title === cleanTitle);
  };

  const item = findItem();

  if (!item) {
    return (
      <div className="detail-view">
        <div className="error-container">
          <h2>Item not found</h2>
          <button onClick={() => navigate('/')} className="back-button">
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="detail-view">
      <button onClick={() => navigate('/')} className="back-button">
        ← Back to Dashboard
      </button>
      
      <div className="detail-content">
        <div className="detail-header">
          <h1>{item.title}</h1>
          <div className="detail-meta">
            <span className="detail-date">📅 {item.date}</span>
            {item.copyright && (
              <span className="detail-copyright">📸 Credit: {item.copyright}</span>
            )}
            <span className="detail-type">
              {item.media_type === 'image' ? '🖼️ Image' : '🎥 Video'}
            </span>
          </div>
        </div>

        <div className="detail-media">
          {item.media_type === 'image' ? (
            <img 
              src={item.hdurl || item.url} 
              alt={item.title}
              className="detail-image"
              onError={(e) => {
                e.target.src = item.url;
              }}
            />
          ) : (
            <div className="detail-video">
              <iframe
                src={item.url}
                title={item.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}
        </div>

        <div className="detail-explanation">
          <h2>📖 About This Cosmic Wonder</h2>
          <p>{item.explanation}</p>
        </div>

        {/* Extra information not in dashboard view */}
        <div className="detail-extra">
          <h2>🔭 Additional Information</h2>
          <div className="extra-grid">
            <div className="extra-card">
              <h3>Technical Details</h3>
              <ul>
                <li><strong>Service Version:</strong> {item.service_version || 'v1'}</li>
                <li><strong>Media Type:</strong> {item.media_type === 'image' ? 'Still Image' : 'Video Content'}</li>
                <li><strong>HD Available:</strong> {item.hdurl ? 'Yes' : 'No'}</li>
              </ul>
            </div>
            <div className="extra-card">
              <h3>Viewing Options</h3>
              <ul>
                {item.hdurl && (
                  <li><a href={item.hdurl} target="_blank" rel="noopener noreferrer">View HD Version →</a></li>
                )}
                <li><a href={item.url} target="_blank" rel="noopener noreferrer">Open Original →</a></li>
                <li><a href={`https://apod.nasa.gov/apod/ap${item.date.replace(/-/g, '')}.html`} target="_blank" rel="noopener noreferrer">View on NASA Website →</a></li>
              </ul>
            </div>
            <div className="extra-card">
              <h3>Fun Facts</h3>
              <ul>
                <li>This image was featured on {new Date(item.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</li>
                <li>Title length: {item.title?.length || 0} characters</li>
                <li>Description length: {item.explanation?.length || 0} characters</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="detail-navigation">
          <button onClick={() => navigate('/')} className="nav-button">
            ← Explore More Cosmic Wonders
          </button>
        </div>
      </div>
    </div>
  );
}

export default DetailView;