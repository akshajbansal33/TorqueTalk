import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import BudgetCard from '../components/BudgetCard';
import Footer from '../components/Footer';

// Data imports
import { budgets } from '../data/budgets';
import { cars } from '../data/cars';
import './Home.css';

function BudgetsPage() {
  const navigate = useNavigate();

  const handleBudgetClick = (budgetValue) => {
    // Navigate back to home page and pass budget as query param
    navigate(`/?budget=${encodeURIComponent(budgetValue)}&mode=budget`);
  };

  const getBudgetCount = (value) => {
    // default new cars count
    const matchesTab = (car) => !car.isUsed;
    if (value === '9000000') {
      return cars.filter(car => car.price <= 9000000 && matchesTab(car)).length;
    }
    if (value === '12000000') {
      return cars.filter(car => car.price > 9000000 && car.price <= 12000000 && matchesTab(car)).length;
    }
    if (value === '18000000') {
      return cars.filter(car => car.price > 12000000 && car.price <= 18000000 && matchesTab(car)).length;
    }
    if (value === '25000000') {
      return cars.filter(car => car.price > 18000000 && car.price <= 25000000 && matchesTab(car)).length;
    }
    if (value === '40000000') {
      return cars.filter(car => car.price > 25000000 && car.price <= 40000000 && matchesTab(car)).length;
    }
    if (value === 'luxury') {
      return cars.filter(car => car.price > 40000000 && matchesTab(car)).length;
    }
    return 0;
  };

  return (
    <div className="budgets-page-wrapper" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* 1. Header */}
      <Header />

      {/* 2. Page Hero with Photo Background */}
      <div className="budgets-hero">
        <img 
          src="/video/budget_car.png" 
          alt="Budget car background" 
          className="budgets-hero-img" 
        />
        <div className="budgets-hero-overlay"></div>

        {/* Back button shifted to top left */}
        <button className="budgets-back-btn" onClick={() => navigate('/')} title="Back to Home">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '6px' }} className="back-arrow-svg">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Home
        </button>
      </div>

      {/* 3. Budgets Grid */}
      <main style={{ flexGrow: 1 }} className="page-container">
        <div className="budgets-grid" style={{ margin: '0' }}>
          {budgets.map((budget) => {
            const dynamicCount = getBudgetCount(budget.value);
            return (
              <BudgetCard
                key={budget.id}
                budget={budget}
                dynamicCount={dynamicCount}
                onClick={handleBudgetClick}
              />
            );
          })}
        </div>
      </main>

      {/* 4. Footer */}
      <Footer />
    </div>
  );
}

export default BudgetsPage;
