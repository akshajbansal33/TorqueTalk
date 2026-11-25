import React, { createContext, useContext, useState, useEffect } from 'react';

/* 
  CompareContext (Syllabus Module 2: State Architecture & Context API)
  - Global state managing selected vehicles for comparison across all SPA pages
  - Synchronizes with localStorage to persist selections on page refreshes
  - Provides helper methods: addToCompare, removeFromCompare, toggleCompare, clearCompare
*/

const CompareContext = createContext();

export function CompareProvider({ children }) {
  // Initialize state lazily from localStorage
  const [compareCars, setCompareCars] = useState(() => {
    try {
      const saved = localStorage.getItem('torque_compare_cars');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to parse compare cars from localStorage', e);
      return [];
    }
  });

  // Persist compareCars whenever the list updates
  useEffect(() => {
    try {
      localStorage.setItem('torque_compare_cars', JSON.stringify(compareCars));
    } catch (e) {
      console.error('Failed to save compare cars to localStorage', e);
    }
  }, [compareCars]);

  const addToCompare = (car) => {
    if (!car) return;
    if (compareCars.some((c) => c.id === car.id)) return;
    if (compareCars.length >= 4) {
      alert('You can compare a maximum of 4 vehicles at a time.');
      return;
    }
    setCompareCars((prev) => [...prev, car]);
  };

  const removeFromCompare = (carId) => {
    setCompareCars((prev) => prev.filter((c) => c.id !== carId));
  };

  const toggleCompare = (car) => {
    if (!car) return;
    if (compareCars.some((c) => c.id === car.id)) {
      removeFromCompare(car.id);
    } else {
      addToCompare(car);
    }
  };

  const clearCompare = () => {
    setCompareCars([]);
  };

  const isCarCompared = (carId) => {
    return compareCars.some((c) => c.id === carId);
  };

  return (
    <CompareContext.Provider
      value={{
        compareCars,
        addToCompare,
        removeFromCompare,
        toggleCompare,
        clearCompare,
        isCarCompared
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
}
