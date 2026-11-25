import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import NewCarsPage from './pages/NewCarsPage';
import BrandsPage from './pages/BrandsPage';
import BodyTypesPage from './pages/BodyTypesPage';
import BudgetsPage from './pages/BudgetsPage';
import AboutUsPage from './pages/AboutUsPage';
import LoginPage from './pages/LoginPage';
import CarDetailPage from './pages/CarDetailPage';
import ComparePage from './pages/ComparePage';
import BookTestDrivePage from './pages/BookTestDrivePage';
import GaragePage from './pages/GaragePage';
import FinancePage from './pages/FinancePage';
import { CompareProvider } from './context/CompareContext';
import { GarageProvider } from './context/GarageContext';

/* 
  App Component
  - Multi-page SPA Routing with React Router v7 (Syllabus Module 1)
  - Global State Architecture with CompareProvider & GarageProvider (Syllabus Module 2: Shopping Cart & State Architecture)
*/
function App() {
  return (
    <Router>
      <CompareProvider>
        <GarageProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/new-cars" element={<NewCarsPage />} />
            <Route path="/brands" element={<BrandsPage />} />
            <Route path="/body-types" element={<BodyTypesPage />} />
            <Route path="/budgets" element={<BudgetsPage />} />
            <Route path="/about-us" element={<AboutUsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/car/:id" element={<CarDetailPage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/book-test-drive" element={<BookTestDrivePage />} />
            <Route path="/garage" element={<GaragePage />} />
            <Route path="/finance" element={<FinancePage />} />
          </Routes>
        </GarageProvider>
      </CompareProvider>
    </Router>
  );
}

export default App;
