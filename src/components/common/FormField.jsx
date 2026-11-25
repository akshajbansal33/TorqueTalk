import React from 'react';
import './FormField.css';

/* 
  FormField Component (Syllabus Module 3: Form Handling & Reusable Input Components)
  - Universal accessible wrapper for form controls
  - Handles label, required indicator, helper text, and validation error messages
*/
export function FormField({
  label,
  error,
  helperText,
  required = false,
  className = '',
  children
}) {
  return (
    <div className={`form-field-wrapper ${error ? 'has-field-error' : ''} ${className}`}>
      {label && (
        <label className="field-top-label">
          <span>{label}</span>
          {required && <span className="field-required-star" aria-hidden="true">*</span>}
        </label>
      )}

      <div className="field-control-container">
        {children}
      </div>

      {error ? (
        <span className="field-error-message" role="alert">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{error}</span>
        </span>
      ) : helperText ? (
        <span className="field-helper-message">{helperText}</span>
      ) : null}
    </div>
  );
}

/* 
  TextInput Component (Syllabus Module 3: Reusable Input Components)
  - Reusable input with prefix/suffix icons, clear capability, and error state styling
*/
export function TextInput({
  value,
  onChange,
  onBlur,
  name,
  type = 'text',
  placeholder = '',
  prefixIcon = null,
  suffixIcon = null,
  prefixText = null,
  error = false,
  disabled = false,
  maxLength,
  className = '',
  ...rest
}) {
  return (
    <div className={`reusable-text-input-wrap ${error ? 'is-invalid' : ''} ${disabled ? 'is-disabled' : ''} ${className}`}>
      {prefixText && <span className="input-prefix-label">{prefixText}</span>}
      {prefixIcon && <span className="input-icon-left">{prefixIcon}</span>}
      
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        className="reusable-native-input"
        {...rest}
      />

      {suffixIcon && <span className="input-icon-right">{suffixIcon}</span>}
    </div>
  );
}

/* 
  CustomSelect Component (Syllabus Module 3 & 4: Dropdowns & Reusable Inputs)
  - Styled select dropdown with keyboard support and custom chevron
*/
export function CustomSelect({
  value,
  onChange,
  onBlur,
  name,
  options = [],
  placeholder = 'Select an option',
  disabled = false,
  error = false,
  className = '',
  ...rest
}) {
  return (
    <div className={`reusable-select-wrap ${error ? 'is-invalid' : ''} ${disabled ? 'is-disabled' : ''} ${className}`}>
      <select
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        className="reusable-native-select"
        {...rest}
      >
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <span className="select-chevron-icon" aria-hidden="true">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </span>
    </div>
  );
}

/* 
  RangeSliderInput Component (Syllabus Module 3: Controlled Form Sliders)
  - Interactive numeric slider with formatted live readout badge and min/max clamps
*/
export function RangeSliderInput({
  value,
  onChange,
  name,
  min,
  max,
  step = 1,
  unit = '',
  formatValue,
  label,
  error = false,
  disabled = false,
  className = ''
}) {
  const displayValue = formatValue ? formatValue(value) : `${value}${unit ? ` ${unit}` : ''}`;
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  return (
    <div className={`reusable-slider-wrap ${error ? 'is-invalid' : ''} ${className}`}>
      <div className="slider-header-row">
        {label && <span className="slider-label-text">{label}</span>}
        <span className="slider-value-badge">{displayValue}</span>
      </div>

      <div className="slider-track-container">
        <input
          type="range"
          name={name}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="reusable-range-element"
          style={{
            background: `linear-gradient(to right, #e50914 0%, #e50914 ${percentage}%, rgba(255, 255, 255, 0.15) ${percentage}%, rgba(255, 255, 255, 0.15) 100%)`
          }}
        />
      </div>

      <div className="slider-ticks-row">
        <span>{formatValue ? formatValue(min) : `${min}${unit}`}</span>
        <span>{formatValue ? formatValue(max) : `${max}${unit}`}</span>
      </div>
    </div>
  );
}

/* 
  ToggleSwitch Component (Syllabus Module 3: Reusable Switch Input)
*/
export function ToggleSwitch({
  checked,
  onChange,
  name,
  label,
  description,
  disabled = false,
  className = ''
}) {
  return (
    <label className={`reusable-toggle-wrap ${disabled ? 'is-disabled' : ''} ${className}`}>
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="reusable-toggle-checkbox"
      />
      <span className="toggle-slider-pill"></span>
      <div className="toggle-text-block">
        {label && <strong className="toggle-title">{label}</strong>}
        {description && <span className="toggle-desc">{description}</span>}
      </div>
    </label>
  );
}
