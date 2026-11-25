import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { cars } from '../data/cars';
import { formatIndianPrice } from '../components/CarCard';
import {
  FormField,
  TextInput,
  CustomSelect,
  RangeSliderInput,
  ToggleSwitch
} from '../components/common';
import { useUserPreferencesStore } from '../store/userPreferencesStore';
import './FinancePage.css';

/* 
  FinancePage Component (Syllabus Module 1, 2, 3: Reusable Form Inputs, Validation & State)
  - Complete Luxury Vehicle Finance & EMI Calculator
  - Built entirely using custom reusable input components (TextInput, CustomSelect, RangeSliderInput)
  - Mathematical EMI Calculation with SVG Donut Chart breakdown
  - Amortization Schedule Table & Loan Pre-Approval Eligibility Engine
  - Saves calculations directly to Zustand store (useUserPreferencesStore)
*/
function FinancePage() {
  const [searchParams] = useSearchParams();
  const preselectedCarId = searchParams.get('carId');

  // Zustand store actions
  const saveCalculation = useUserPreferencesStore((s) => s.saveCalculation);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Selected vehicle state (default to first supercar or pre-selected car)
  const [selectedCarId, setSelectedCarId] = useState(() => {
    if (preselectedCarId && cars.some((c) => String(c.id) === String(preselectedCarId))) {
      return String(preselectedCarId);
    }
    return String(cars[0]?.id || '1');
  });

  const activeCar = useMemo(() => {
    return cars.find((c) => String(c.id) === String(selectedCarId)) || cars[0];
  }, [selectedCarId]);

  // Financial Controlled Slider Inputs
  const [downPaymentPercent, setDownPaymentPercent] = useState(25); // 25% down payment
  const [tenureYears, setTenureYears] = useState(5); // 5 years (60 months)
  const [interestRate, setInterestRate] = useState(8.5); // 8.5% annual interest
  const [includeInsuranceInLoan, setIncludeInsuranceInLoan] = useState(false);
  const [showAmortization, setShowAmortization] = useState(false);

  // Pre-approval Form State
  const [preApprovalData, setPreApprovalData] = useState({
    applicantName: '',
    monthlyIncome: '',
    existingEmis: '0',
    employmentType: 'business',
    creditScore: '750+'
  });
  const [preApprovalResult, setPreApprovalResult] = useState(null);

  // Mathematical Calculation of EMI
  const financeMetrics = useMemo(() => {
    const basePrice = Number(activeCar?.price || 10000000);
    const insuranceAddon = includeInsuranceInLoan ? Math.round(basePrice * 0.03) : 0;
    const finalAssetPrice = basePrice + insuranceAddon;

    const downPaymentAmount = Math.round(finalAssetPrice * (downPaymentPercent / 100));
    const principalLoanAmount = finalAssetPrice - downPaymentAmount;

    const tenureMonths = tenureYears * 12;
    const monthlyRate = interestRate / (12 * 100);

    // Standard EMI formula: E = P * r * (1 + r)^n / ((1 + r)^n - 1)
    let monthlyEmi = 0;
    if (monthlyRate > 0) {
      const compoundFactor = Math.pow(1 + monthlyRate, tenureMonths);
      monthlyEmi = Math.round((principalLoanAmount * monthlyRate * compoundFactor) / (compoundFactor - 1));
    } else {
      monthlyEmi = Math.round(principalLoanAmount / tenureMonths);
    }

    const totalRepayment = monthlyEmi * tenureMonths;
    const totalInterestPayable = Math.max(0, totalRepayment - principalLoanAmount);
    const interestPercent = Math.round((totalInterestPayable / (totalRepayment || 1)) * 100);
    const principalPercent = 100 - interestPercent;

    // Generate yearly amortization table
    const amortizationSchedule = [];
    let remainingPrincipal = principalLoanAmount;
    for (let yr = 1; yr <= tenureYears; yr++) {
      let yearlyInterest = 0;
      let yearlyPrincipal = 0;
      for (let m = 1; m <= 12; m++) {
        const interestForMonth = remainingPrincipal * monthlyRate;
        const principalForMonth = monthlyEmi - interestForMonth;
        yearlyInterest += interestForMonth;
        yearlyPrincipal += principalForMonth;
        remainingPrincipal = Math.max(0, remainingPrincipal - principalForMonth);
      }
      amortizationSchedule.push({
        year: yr,
        principalPaid: Math.round(yearlyPrincipal),
        interestPaid: Math.round(yearlyInterest),
        remainingBalance: Math.round(remainingPrincipal)
      });
    }

    return {
      finalAssetPrice,
      downPaymentAmount,
      principalLoanAmount,
      tenureMonths,
      monthlyEmi,
      totalInterestPayable,
      totalRepayment,
      interestPercent,
      principalPercent,
      amortizationSchedule
    };
  }, [activeCar, downPaymentPercent, tenureYears, interestRate, includeInsuranceInLoan]);

  // Car select options
  const carSelectOptions = useMemo(() => {
    return cars.map((c) => ({
      value: String(c.id),
      label: `${c.brand} ${c.name} (${formatIndianPrice(c.price)})`
    }));
  }, []);

  // Handle Save Calculation to Zustand Store
  const handleSaveToStore = () => {
    saveCalculation({
      carId: activeCar.id,
      carName: `${activeCar.brand} ${activeCar.name}`,
      carPrice: activeCar.price,
      carImage: activeCar.image,
      downPayment: financeMetrics.downPaymentAmount,
      loanAmount: financeMetrics.principalLoanAmount,
      monthlyEmi: financeMetrics.monthlyEmi,
      tenureYears,
      interestRate
    });

    setSaveSuccessMsg('Calculation saved to your personal portfolio!');
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  // Pre-approval Form Submit
  const handlePreApprovalSubmit = (e) => {
    e.preventDefault();
    const income = Number(preApprovalData.monthlyIncome);
    if (!preApprovalData.applicantName || !income) {
      alert('Please provide your legal name and monthly income.');
      return;
    }

    const debtRatio = (financeMetrics.monthlyEmi / income) * 100;
    const isApproved = debtRatio <= 45;

    setPreApprovalResult({
      isApproved,
      applicantName: preApprovalData.applicantName,
      maxEligibleEmi: Math.round(income * 0.45),
      recommendedBank: income > 1500000 ? 'HDFC Infinia Private Wealth' : 'ICICI Bank Luxury Desk'
    });
  };

  return (
    <div className="finance-page-wrapper">
      <Header />

      <main className="finance-main-container">
        {/* Breadcrumb Navigation */}
        <div className="finance-breadcrumb">
          <Link to="/" className="breadcrumb-link">Home</Link>
          <span className="breadcrumb-separator">/</span>
          <Link to="/new-cars" className="breadcrumb-link">Inventory</Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">Auto Finance & EMI Calculator</span>
        </div>

        {/* Hero Section */}
        <div className="finance-hero-section">
          <div className="finance-badge">
            <span className="finance-badge-dot"></span>
            <span>TORQUE PRIVATE CLIENT WEALTH & FINANCING</span>
          </div>
          <h1 className="finance-page-title">Supercar Finance & EMI Calculator</h1>
          <p className="finance-page-desc">
            Model bespoke financing terms with real-time interest simulations, transparent amortization schedules, and instant luxury banking eligibility pre-approval.
          </p>
        </div>

        {/* 2-Column Calculator Layout */}
        <div className="finance-calculator-grid">
          {/* LEFT: Interactive Controls Built with Reusable Inputs */}
          <div className="finance-controls-panel">
            <h2 className="panel-title">Financing Parameters</h2>

            {/* Reusable Select: Vehicle Selector */}
            <FormField 
              label="Selected Luxury Vehicle"
              helperText="Choose any supercar or luxury SUV from our certified fleet"
              required
            >
              <CustomSelect 
                name="carSelector"
                value={selectedCarId}
                onChange={(e) => setSelectedCarId(e.target.value)}
                options={carSelectOptions}
              />
            </FormField>

            {/* Vehicle Active Preview Bar */}
            {activeCar && (
              <div className="active-car-banner">
                <img src={activeCar.image} alt={activeCar.name} className="active-car-thumb" />
                <div className="active-car-meta">
                  <span className="brand">{activeCar.brand}</span>
                  <strong>{activeCar.name}</strong>
                  <span className="specs">{activeCar.fuel} • {activeCar.transmission}</span>
                </div>
                <div className="active-car-price">
                  <span>Ex-Showroom</span>
                  <strong>{formatIndianPrice(activeCar.price)}</strong>
                </div>
              </div>
            )}

            {/* Reusable Range Slider: Down Payment Percentage */}
            <RangeSliderInput 
              label="Down Payment Contribution"
              name="downPayment"
              min={15}
              max={80}
              step={5}
              value={downPaymentPercent}
              onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
              formatValue={(val) => `${val}% (${formatIndianPrice(financeMetrics.downPaymentAmount)})`}
            />

            {/* Reusable Range Slider: Loan Tenure in Years */}
            <RangeSliderInput 
              label="Loan Tenure Period"
              name="tenure"
              min={1}
              max={7}
              step={1}
              value={tenureYears}
              onChange={(e) => setTenureYears(Number(e.target.value))}
              formatValue={(val) => `${val} Years (${val * 12} Months)`}
            />

            {/* Reusable Range Slider: Interest Rate */}
            <RangeSliderInput 
              label="Annual Interest Rate (Fixed OEM Rate)"
              name="interestRate"
              min={7.0}
              max={14.0}
              step={0.25}
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              formatValue={(val) => `${val.toFixed(2)}% p.a.`}
            />

            {/* Reusable Toggle Switch: Include Insurance */}
            <ToggleSwitch 
              name="insuranceToggle"
              checked={includeInsuranceInLoan}
              onChange={(e) => setIncludeInsuranceInLoan(e.target.checked)}
              label="Capitalize 3-Year Zero-Dep Comprehensive Insurance in Loan"
              description={`Adds ~3% (${formatIndianPrice(activeCar?.price * 0.03 || 0)}) directly into financed principal.`}
            />

            <div className="calculator-action-buttons">
              <button 
                type="button" 
                className="btn-save-calculation"
                onClick={handleSaveToStore}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                  <polyline points="17 21 17 13 7 13 7 21" />
                  <polyline points="7 3 7 8 15 8" />
                </svg>
                <span>Save to Personal Portfolio</span>
              </button>
            </div>

            {saveSuccessMsg && (
              <div className="save-success-pill" role="status">
                ✓ {saveSuccessMsg}
              </div>
            )}
          </div>

          {/* RIGHT: Financial Breakdown & Interactive Visual Donut Chart */}
          <div className="finance-results-panel">
            <div className="emi-highlight-card">
              <span className="emi-eyebrow">Estimated Monthly Installment (EMI)</span>
              <div className="emi-headline-amount">
                ₹ {financeMetrics.monthlyEmi.toLocaleString('en-IN')}
                <span className="per-month">/ Month</span>
              </div>
              <p className="emi-subtext">
                Calculated on ₹ {(financeMetrics.principalLoanAmount).toLocaleString('en-IN')} principal for {financeMetrics.tenureMonths} installments.
              </p>
            </div>

            {/* Visual SVG Donut Chart for Principal vs. Interest Split */}
            <div className="donut-chart-container">
              <h3 className="chart-title">Payment Breakdown</h3>

              <div className="donut-flex-layout">
                <div className="svg-donut-wrap">
                  <svg width="140" height="140" viewBox="0 0 36 36" className="donut-svg">
                    {/* Background circle */}
                    <path
                      className="donut-bg-ring"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    {/* Principal ring (Green) */}
                    <path
                      className="donut-principal-ring"
                      strokeDasharray={`${financeMetrics.principalPercent}, 100`}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    {/* Interest ring (Red) */}
                    <path
                      className="donut-interest-ring"
                      strokeDasharray={`${financeMetrics.interestPercent}, 100`}
                      strokeDashoffset={`-${financeMetrics.principalPercent}`}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="donut-center-text">
                    <span className="pct-num">{financeMetrics.principalPercent}%</span>
                    <span className="pct-label">Principal</span>
                  </div>
                </div>

                <div className="donut-legend-list">
                  <div className="legend-item">
                    <span className="legend-color-dot principal-dot"></span>
                    <div>
                      <span className="legend-label">Principal Financed ({financeMetrics.principalPercent}%)</span>
                      <strong className="legend-value">{formatIndianPrice(financeMetrics.principalLoanAmount)}</strong>
                    </div>
                  </div>

                  <div className="legend-item">
                    <span className="legend-color-dot interest-dot"></span>
                    <div>
                      <span className="legend-label">Total Interest Payable ({financeMetrics.interestPercent}%)</span>
                      <strong className="legend-value">{formatIndianPrice(financeMetrics.totalInterestPayable)}</strong>
                    </div>
                  </div>

                  <div className="legend-item">
                    <span className="legend-color-dot total-dot"></span>
                    <div>
                      <span className="legend-label">Total Repayment Over {tenureYears} Yrs</span>
                      <strong className="legend-value">{formatIndianPrice(financeMetrics.totalRepayment)}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action to toggle Amortization Table */}
            <button 
              type="button" 
              className="btn-toggle-amortization"
              onClick={() => setShowAmortization((prev) => !prev)}
            >
              <span>{showAmortization ? 'Hide Amortization Schedule ▲' : 'View Full Amortization Schedule ▼'}</span>
            </button>

            {/* Expandable Amortization Schedule Table */}
            {showAmortization && (
              <div className="amortization-table-wrap">
                <table className="amortization-table">
                  <thead>
                    <tr>
                      <th>Year</th>
                      <th>Principal Paid</th>
                      <th>Interest Paid</th>
                      <th>Remaining Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {financeMetrics.amortizationSchedule.map((row) => (
                      <tr key={row.year}>
                        <td>Year {row.year}</td>
                        <td>{formatIndianPrice(row.principalPaid)}</td>
                        <td className="text-red">{formatIndianPrice(row.interestPaid)}</td>
                        <td>{formatIndianPrice(row.remainingBalance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* SECTION 2: INSTANT PRE-APPROVAL APPLICATION FORM (Form Handling & Validation) */}
        <div className="pre-approval-section">
          <div className="section-header-wrap">
            <span className="section-pill">EXCLUSIVE LUXURY TIER</span>
            <h2>Instant Loan Eligibility Check</h2>
            <p>Get a confidential credit assessment for {activeCar.brand} India financing without impacting your bureau score.</p>
          </div>

          <form className="pre-approval-form" onSubmit={handlePreApprovalSubmit}>
            <div className="form-fields-grid">
              <FormField label="Applicant Full Legal Name" required>
                <TextInput 
                  name="applicantName"
                  placeholder="e.g., Rajeshwar Rao"
                  value={preApprovalData.applicantName}
                  onChange={(e) => setPreApprovalData({ ...preApprovalData, applicantName: e.target.value })}
                />
              </FormField>

              <FormField label="Monthly Net In-Hand Income (₹)" required>
                <TextInput 
                  type="number"
                  name="monthlyIncome"
                  prefixText="₹"
                  placeholder="e.g., 2500000"
                  value={preApprovalData.monthlyIncome}
                  onChange={(e) => setPreApprovalData({ ...preApprovalData, monthlyIncome: e.target.value })}
                />
              </FormField>

              <FormField label="Current Monthly EMI Commitments (₹)">
                <TextInput 
                  type="number"
                  name="existingEmis"
                  prefixText="₹"
                  placeholder="0"
                  value={preApprovalData.existingEmis}
                  onChange={(e) => setPreApprovalData({ ...preApprovalData, existingEmis: e.target.value })}
                />
              </FormField>

              <FormField label="Employment Classification">
                <CustomSelect 
                  name="employmentType"
                  value={preApprovalData.employmentType}
                  onChange={(e) => setPreApprovalData({ ...preApprovalData, employmentType: e.target.value })}
                  options={[
                    { value: 'business', label: 'Business Owner / Industrialist' },
                    { value: 'corporate', label: 'C-Suite / Corporate Executive' },
                    { value: 'professional', label: 'High-Net-Worth Professional' }
                  ]}
                />
              </FormField>
            </div>

            <button type="submit" className="btn-check-eligibility">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span>Assess VIP Eligibility Instantly</span>
            </button>
          </form>

          {/* Pre-Approval Result Banner */}
          {preApprovalResult && (
            <div className={`eligibility-result-card ${preApprovalResult.isApproved ? 'is-approved' : 'is-review'}`}>
              <div className="result-icon-wrap">
                {preApprovalResult.isApproved ? '✓' : '!'}
              </div>
              <div className="result-text">
                <h3>
                  {preApprovalResult.isApproved 
                    ? `Pre-Approval Approved for ${preApprovalResult.applicantName}!` 
                    : `Conditional Review Required for ${preApprovalResult.applicantName}`}
                </h3>
                <p>
                  {preApprovalResult.isApproved 
                    ? `Based on your debt-to-income ratio, you qualify for full priority allocation underwriting via ${preApprovalResult.recommendedBank}. Max eligible monthly EMI: ₹ ${preApprovalResult.maxEligibleEmi.toLocaleString('en-IN')}.`
                    : `Your current debt-to-income ratio indicates a higher down payment may be required. A dedicated concierge banker will contact you.`}
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default FinancePage;
