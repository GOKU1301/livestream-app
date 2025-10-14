import React, { useState } from 'react';

const OverlayManager = ({ overlays, onOverlayCreate, onOverlayUpdate, onOverlayDelete }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingOverlay, setEditingOverlay] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'text',
    content: '',
    position: { x: 50, y: 50 },
    size: { width: 200, height: 50 },
    style: {
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      color: 'white',
      fontSize: '16px',
      fontWeight: 'normal',
      textAlign: 'left'
    },
    visible: true
  });

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'text',
      content: '',
      position: { x: 50, y: 50 },
      size: { width: 200, height: 50 },
      style: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        fontSize: '16px',
        fontWeight: 'normal',
        textAlign: 'left'
      },
      visible: true
    });
    setEditingOverlay(null);
    setShowCreateForm(false);
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.content) {
      alert('Please fill in all required fields');
      return;
    }

    if (editingOverlay) {
      onOverlayUpdate(editingOverlay._id, formData);
    } else {
      onOverlayCreate(formData);
    }
    
    resetForm();
  };

  const handleEdit = (overlay) => {
    setFormData({
      name: overlay.name,
      type: overlay.type,
      content: overlay.content,
      position: overlay.position,
      size: overlay.size,
      style: overlay.style || {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        fontSize: '16px',
        fontWeight: 'normal',
        textAlign: 'left'
      },
      visible: overlay.visible
    });
    setEditingOverlay(overlay);
    setShowCreateForm(true);
  };

  const handleToggleVisibility = (overlay) => {
    onOverlayUpdate(overlay._id, { visible: !overlay.visible });
  };

  return (
    <div>
      <h3>Overlay Manager</h3>
      
      <button 
        className="btn btn-success" 
        onClick={() => setShowCreateForm(!showCreateForm)}
        style={{ marginBottom: '1rem', width: '100%' }}
      >
        {showCreateForm ? '❌ Cancel' : '➕ Add Overlay'}
      </button>

      {showCreateForm && (
        <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
          <div className="form-group">
            <label>Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter overlay name"
              required
            />
          </div>

          <div className="form-group">
            <label>Type</label>
            <select
              value={formData.type}
              onChange={(e) => handleInputChange('type', e.target.value)}
            >
              <option value="text">Text</option>
              <option value="logo">Logo/Image</option>
            </select>
          </div>

          <div className="form-group">
            <label>Content *</label>
            {formData.type === 'text' ? (
              <textarea
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                placeholder="Enter text content"
                rows="3"
                required
              />
            ) : (
              <input
                type="url"
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                placeholder="Enter image URL"
                required
              />
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div className="form-group">
              <label>X Position</label>
              <input
                type="number"
                value={formData.position.x}
                onChange={(e) => handleInputChange('position.x', parseInt(e.target.value))}
                min="0"
              />
            </div>
            <div className="form-group">
              <label>Y Position</label>
              <input
                type="number"
                value={formData.position.y}
                onChange={(e) => handleInputChange('position.y', parseInt(e.target.value))}
                min="0"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div className="form-group">
              <label>Width</label>
              <input
                type="number"
                value={formData.size.width}
                onChange={(e) => handleInputChange('size.width', parseInt(e.target.value))}
                min="50"
              />
            </div>
            <div className="form-group">
              <label>Height</label>
              <input
                type="number"
                value={formData.size.height}
                onChange={(e) => handleInputChange('size.height', parseInt(e.target.value))}
                min="30"
              />
            </div>
          </div>

          {formData.type === 'text' && (
            <>
              <div className="form-group">
                <label>Text Color</label>
                <input
                  type="color"
                  value={formData.style.color === 'white' ? '#ffffff' : formData.style.color}
                  onChange={(e) => handleInputChange('style.color', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Font Size</label>
                <input
                  type="number"
                  value={parseInt(formData.style.fontSize)}
                  onChange={(e) => handleInputChange('style.fontSize', e.target.value + 'px')}
                  min="8"
                  max="72"
                />
              </div>

              <div className="form-group">
                <label>Text Align</label>
                <select
                  value={formData.style.textAlign}
                  onChange={(e) => handleInputChange('style.textAlign', e.target.value)}
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
              </div>
            </>
          )}

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn btn-success">
              {editingOverlay ? '💾 Update' : '➕ Create'}
            </button>
            <button type="button" className="btn" onClick={resetForm}>
              ❌ Cancel
            </button>
          </div>
        </form>
      )}

      <div>
        <h4>Existing Overlays ({overlays.length})</h4>
        {overlays.length === 0 ? (
          <p style={{ color: '#666', fontStyle: 'italic' }}>No overlays created yet</p>
        ) : (
          overlays.map((overlay) => (
            <div key={overlay._id} className="overlay-item">
              <h4 style={{ margin: '0 0 10px 0' }}>
                {overlay.name}
                <span style={{ 
                  marginLeft: '10px', 
                  fontSize: '12px', 
                  background: overlay.type === 'text' ? '#3498db' : '#e67e22',
                  color: 'white',
                  padding: '2px 6px',
                  borderRadius: '3px'
                }}>
                  {overlay.type}
                </span>
              </h4>
              
              <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>
                Position: ({overlay.position.x}, {overlay.position.y}) | 
                Size: {overlay.size.width}×{overlay.size.height}
              </p>
              
              <p style={{ margin: '5px 0', fontSize: '14px' }}>
                {overlay.type === 'text' ? `"${overlay.content}"` : 'Image URL'}
              </p>

              <div className="overlay-controls">
                <button 
                  className="btn" 
                  onClick={() => handleEdit(overlay)}
                >
                  ✏️ Edit
                </button>
                <button 
                  className={`btn ${overlay.visible ? '' : 'btn-success'}`}
                  onClick={() => handleToggleVisibility(overlay)}
                >
                  {overlay.visible ? '👁️ Hide' : '👁️ Show'}
                </button>
                <button 
                  className="btn btn-danger" 
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this overlay?')) {
                      onOverlayDelete(overlay._id);
                    }
                  }}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OverlayManager;
