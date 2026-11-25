import React from 'react';
import './BodyTypeCard.css';

/* 
  BodyTypeCard Component
  Demonstrates:
  1. Prop usage: mapping individual `bodyType` details (name, iconName) and `dynamicCount`.
  2. Loading real-life images dynamically from the public directory.
  3. Interactive UI filter bubble navigation.
*/
function BodyTypeCard({ bodyType, dynamicCount, onClick }) {
  const { name, iconName } = bodyType;

  return (
    <div className="bodytype-card-wrapper">
      <div 
        className="bodytype-card" 
        onClick={() => onClick(name)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onClick(name);
          }
        }}
      >
        <div className="bodytype-card-content">
          <span className="bodytype-card-subtitle">Discover the models</span>
          <h2 className="bodytype-card-title">{name}</h2>
        </div>
        <div className="bodytype-image-wrapper">
          <img 
            src={`/${iconName}_bodytype.png`} 
            alt={`${name} Body Type`} 
            className="bodytype-image"
          />
        </div>
      </div>
      <div className="bodytype-card-count">
        {dynamicCount} {dynamicCount === 1 ? 'car' : 'cars'} available
      </div>
    </div>
  );
}

export default BodyTypeCard;
