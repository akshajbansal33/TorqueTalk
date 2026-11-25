import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

/* 
  GarageContext (Syllabus Module 2: State Architecture & Context API)
  - Global state managing saved vehicles in the user's "Luxury Garage" (Shopping Cart / Reservation System)
  - Distinguishes Global State (garageItems, drawerOpen, activeNotification) from Local State (checkout forms, filters)
  - Synchronizes with localStorage for cross-session state persistence
  - Implements dynamic pricing calculations (Ex-Showroom, RTO, Insurance, Luxury Cess, Reservation Token)
*/

const GarageContext = createContext(null);

export const PROTECTION_PACKAGES = {
  standard: {
    id: 'standard',
    name: 'Manufacturer Standard Warranty',
    price: 0,
    description: '3-Year Factory Warranty & 24/7 Roadside Assistance'
  },
  ceramic: {
    id: 'ceramic',
    name: '9H Diamond Ceramic Protection',
    price: 85000,
    description: 'Hydrophobic paint protection, interior leather guard & wheel ceramic shield'
  },
  vipShield: {
    id: 'vipShield',
    name: 'Torque VIP Shield & Extended 5-Year Care',
    price: 240000,
    description: '5-Year bumper-to-bumper warranty, zero-depreciation coverage & priority track access'
  }
};

export const DELIVERY_OPTIONS = {
  hub: {
    id: 'hub',
    name: 'Dealership Hub Handover',
    price: 0,
    description: 'VIP delivery lounge celebration at your nearest official brand studio'
  },
  doorstep: {
    id: 'doorstep',
    name: 'Hydraulic Enclosed Flatbed Delivery',
    price: 25000,
    description: 'White-glove doorstep delivery anywhere in India in a temperature-controlled transporter'
  }
};

export const RESERVATION_TOKEN_PER_CAR = 50000; // ₹ 50,000 refundable token deposit per car

export function GarageProvider({ children }) {
  // Global cart items state, initialized lazily from localStorage
  const [garageItems, setGarageItems] = useState(() => {
    try {
      const saved = localStorage.getItem('torque_garage_items');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to load garage items from localStorage', e);
      return [];
    }
  });

  // Global Slide-over Drawer visibility state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Global temporary toast notification state
  const [toastNotification, setToastNotification] = useState(null);

  // Persist garage items to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('torque_garage_items', JSON.stringify(garageItems));
    } catch (e) {
      console.error('Failed to save garage items to localStorage', e);
    }
  }, [garageItems]);

  // Helper: Trigger transient toast message
  const triggerToast = (message, type = 'success') => {
    setToastNotification({ message, type, id: Date.now() });
    setTimeout(() => {
      setToastNotification(null);
    }, 3500);
  };

  /* Add car to Garage / Cart */
  const addToGarage = (car, customization = {}) => {
    if (!car) return;

    setGarageItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.car.id === car.id);
      
      const newCustomization = {
        color: customization.color || 'Standard Metallic',
        protectionPackage: customization.protectionPackage || 'standard',
        deliveryOption: customization.deliveryOption || 'hub',
        ...customization
      };

      if (existingIndex > -1) {
        // Update existing car configuration
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          customization: newCustomization,
          updatedAt: new Date().toISOString()
        };
        triggerToast(`Updated configuration for ${car.brand} ${car.name}`);
        return updated;
      }

      // Add new vehicle to garage
      triggerToast(`Added ${car.brand} ${car.name} to your Luxury Garage!`);
      return [
        ...prevItems,
        {
          id: car.id,
          car,
          customization: newCustomization,
          reservationToken: RESERVATION_TOKEN_PER_CAR,
          addedAt: new Date().toISOString()
        }
      ];
    });

    // Auto open drawer to provide immediate feedback
    setIsDrawerOpen(true);
  };

  /* Remove car from Garage */
  const removeFromGarage = (carId) => {
    const itemToRemove = garageItems.find((item) => item.id === carId);
    if (itemToRemove) {
      triggerToast(`Removed ${itemToRemove.car.brand} ${itemToRemove.car.name} from Garage`, 'info');
    }
    setGarageItems((prev) => prev.filter((item) => item.id !== carId));
  };

  /* Update vehicle options (e.g., color, warranty, delivery) */
  const updateItemCustomization = (carId, updates) => {
    setGarageItems((prev) =>
      prev.map((item) => {
        if (item.id === carId) {
          return {
            ...item,
            customization: {
              ...item.customization,
              ...updates
            }
          };
        }
        return item;
      })
    );
  };

  /* Clear entire garage */
  const clearGarage = () => {
    setGarageItems([]);
    triggerToast('Luxury Garage cleared', 'info');
  };

  /* Check if a car is in the garage */
  const isInGarage = (carId) => {
    return garageItems.some((item) => item.id === carId);
  };

  /* Derived financial calculations using useMemo for high performance */
  const financialSummary = useMemo(() => {
    let exShowroomTotal = 0;
    let addOnsTotal = 0;

    garageItems.forEach((item) => {
      exShowroomTotal += Number(item.car.price || 0);

      const pkg = PROTECTION_PACKAGES[item.customization?.protectionPackage] || PROTECTION_PACKAGES.standard;
      const del = DELIVERY_OPTIONS[item.customization?.deliveryOption] || DELIVERY_OPTIONS.hub;
      addOnsTotal += (pkg.price || 0) + (del.price || 0);
    });

    // Estimated Indian Luxury Auto Taxes: RTO Registration (~12%), Comprehensive Insurance (~3%), TCS (~1%)
    const rtoEstimate = Math.round(exShowroomTotal * 0.12);
    const insuranceEstimate = Math.round(exShowroomTotal * 0.03);
    const tcsEstimate = Math.round(exShowroomTotal * 0.01);
    const totalOnRoadPrice = exShowroomTotal + addOnsTotal + rtoEstimate + insuranceEstimate + tcsEstimate;
    const totalReservationToken = garageItems.length * RESERVATION_TOKEN_PER_CAR;

    return {
      itemsCount: garageItems.length,
      exShowroomTotal,
      addOnsTotal,
      rtoEstimate,
      insuranceEstimate,
      tcsEstimate,
      totalOnRoadPrice,
      totalReservationToken
    };
  }, [garageItems]);

  return (
    <GarageContext.Provider
      value={{
        garageItems,
        isDrawerOpen,
        setIsDrawerOpen,
        openDrawer: () => setIsDrawerOpen(true),
        closeDrawer: () => setIsDrawerOpen(false),
        addToGarage,
        removeFromGarage,
        updateItemCustomization,
        clearGarage,
        isInGarage,
        toastNotification,
        financialSummary
      }}
    >
      {children}
    </GarageContext.Provider>
  );
}

export function useGarage() {
  const context = useContext(GarageContext);
  if (!context) {
    throw new Error('useGarage must be used within a GarageProvider');
  }
  return context;
}
