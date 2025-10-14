import React, { useState, useRef, useEffect } from 'react';

const DraggableOverlay = ({ overlay, containerRef, onPositionChange, onSizeChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState(overlay.position);
  const [size, setSize] = useState(overlay.size);
  const overlayRef = useRef(null);

  useEffect(() => {
    setPosition(overlay.position);
    setSize(overlay.size);
  }, [overlay.position, overlay.size]);

  const handleMouseDown = (e) => {
    if (e.target.classList.contains('resize-handle')) {
      setIsResizing(true);
    } else {
      setIsDragging(true);
    }
    
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
    
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging && !isResizing) return;

    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;

    if (isDragging) {
      const newX = Math.max(0, Math.min(
        containerRect.width - size.width,
        e.clientX - containerRect.left - dragStart.x
      ));
      const newY = Math.max(0, Math.min(
        containerRect.height - size.height,
        e.clientY - containerRect.top - dragStart.y
      ));

      const newPosition = { x: newX, y: newY };
      setPosition(newPosition);
    } else if (isResizing) {
      const newWidth = Math.max(50, e.clientX - containerRect.left - position.x);
      const newHeight = Math.max(30, e.clientY - containerRect.top - position.y);
      
      const newSize = { width: newWidth, height: newHeight };
      setSize(newSize);
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      onPositionChange(position);
      setIsDragging(false);
    } else if (isResizing) {
      onSizeChange(size);
      setIsResizing(false);
    }
  };

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, position, size, dragStart]);

  const overlayStyle = {
    position: 'absolute',
    left: `${position.x}px`,
    top: `${position.y}px`,
    width: `${size.width}px`,
    height: `${size.height}px`,
    cursor: isDragging ? 'grabbing' : 'grab',
    zIndex: 10,
  };

  const renderOverlayContent = () => {
    if (overlay.type === 'text') {
      return (
        <div 
          className="draggable-overlay text-overlay"
          style={{
            ...overlayStyle,
            background: overlay.style?.backgroundColor || 'rgba(0, 0, 0, 0.7)',
            color: overlay.style?.color || 'white',
            fontSize: overlay.style?.fontSize || '16px',
            fontWeight: overlay.style?.fontWeight || 'normal',
            textAlign: overlay.style?.textAlign || 'left',
            padding: '8px',
            border: '2px dashed #fff',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: overlay.style?.textAlign === 'center' ? 'center' : 'flex-start',
          }}
          ref={overlayRef}
          onMouseDown={handleMouseDown}
        >
          {overlay.content}
          <div 
            className="resize-handle"
            style={{
              position: 'absolute',
              bottom: '0',
              right: '0',
              width: '10px',
              height: '10px',
              background: '#3498db',
              cursor: 'se-resize',
            }}
          />
        </div>
      );
    } else if (overlay.type === 'logo') {
      return (
        <div 
          className="draggable-overlay logo-overlay"
          style={{
            ...overlayStyle,
            background: 'rgba(255, 255, 255, 0.9)',
            border: '2px dashed #3498db',
            borderRadius: '4px',
            padding: '4px',
          }}
          ref={overlayRef}
          onMouseDown={handleMouseDown}
        >
          <img 
            src={overlay.content} 
            alt="Overlay Logo"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              pointerEvents: 'none',
            }}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentNode.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #666;">Image not found</div>';
            }}
          />
          <div 
            className="resize-handle"
            style={{
              position: 'absolute',
              bottom: '0',
              right: '0',
              width: '10px',
              height: '10px',
              background: '#3498db',
              cursor: 'se-resize',
            }}
          />
        </div>
      );
    }
    
    return null;
  };

  return renderOverlayContent();
};

export default DraggableOverlay;
