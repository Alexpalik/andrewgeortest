"use client";

import React from 'react';
import PhoneInputComponent from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

interface PhoneInputProps {
  value: string;
  onChange: (value: string | undefined) => void;
  onBlur?: () => void;
  placeholder?: string;
  className?: string;
  error?: boolean;
  disabled?: boolean;
  defaultCountry?: string;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  onBlur,
  placeholder = "Enter phone number",
  className = "",
  error = false,
  disabled = false,
  defaultCountry = "GR"
}) => {
  return (
    <div className={`phone-input-wrapper ${error ? 'phone-input-error' : ''} ${disabled ? 'phone-input-disabled' : ''} ${className}`}>
      <PhoneInputComponent
        international
        defaultCountry={defaultCountry as any}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        className="phone-input"
        countrySelectProps={{
          className: "phone-country-select"
        }}
        inputProps={{
          className: `
            flex-1 px-4 py-0 border-0 rounded-none focus:outline-none focus:ring-0 
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-transparent'}
            text-base h-full placeholder-gray-400
          `,
          style: { height: '100%' }
        }}
      />
      
      <style jsx global>{`
        .phone-input-wrapper .phone-input {
          display: flex;
          align-items: center;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          background: white;
          transition: all 0.2s ease;
          height: 48px;
        }
        
        .phone-input-wrapper .phone-input:focus-within {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }
        
        .phone-input-wrapper.phone-input-error .phone-input {
          border-color: #dc2626;
        }
        
        .phone-input-wrapper.phone-input-error .phone-input:focus-within {
          border-color: #dc2626;
          box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
        }
        
        .phone-input .PhoneInputCountry {
          display: flex;
          align-items: center;
          padding: 0 12px;
          border-right: 1px solid #e5e7eb;
          background: white;
        }
        
        .phone-input .PhoneInputCountrySelect {
          border: none;
          background: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 0;
          font-size: 14px;
          color: #374151;
          transition: color 0.2s ease;
          min-width: 60px;
        }
        
        .phone-input .PhoneInputCountrySelect:focus {
          outline: none;
          color: #1f2937;
        }
        
        .phone-input .PhoneInputCountrySelect:hover {
          color: #1f2937;
        }
        
        .phone-input .PhoneInputCountrySelectArrow {
          width: 12px !important;
          height: 12px !important;
          opacity: 0.5;
          transition: opacity 0.2s ease;
          margin-left: 4px;
          flex-shrink: 0;
        }
        
        .phone-input .PhoneInputCountrySelectArrow svg {
          width: 12px !important;
          height: 12px !important;
          display: block;
        }
        
        .phone-input .PhoneInputCountrySelect:hover .PhoneInputCountrySelectArrow {
          opacity: 0.7;
        }
        
        .phone-input .PhoneInputCountryIcon {
          width: 24px;
          height: 16px;
          border-radius: 2px;
          object-fit: cover;
          border: 1px solid #e5e7eb;
        }
        
        .phone-input-disabled .phone-input {
          background-color: #f9fafb;
          border-color: #e5e7eb;
          cursor: not-allowed;
          opacity: 0.7;
        }
        
        .phone-input .PhoneInputInput {
          flex: 1;
        }
        
        /* Custom dropdown styles */
        .PhoneInputCountrySelectDropdown {
          max-height: 240px;
          overflow-y: auto;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          background: white;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          z-index: 50;
          margin-top: 4px;
        }
        
        .PhoneInputCountrySelectOption {
          padding: 10px 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          color: #374151;
          transition: all 0.15s ease;
          border-bottom: 1px solid #f3f4f6;
        }
        
        .PhoneInputCountrySelectOption:last-child {
          border-bottom: none;
        }
        
        .PhoneInputCountrySelectOption:hover {
          background-color: #f8fafc;
          color: #1f2937;
        }
        
        .PhoneInputCountrySelectOption--selected {
          background-color: #2563eb;
          color: white;
        }
        
        .PhoneInputCountrySelectOption--focused {
          background-color: #eff6ff;
          color: #1d4ed8;
        }
        
        .PhoneInputCountrySelectOption .PhoneInputCountryIcon {
          width: 20px;
          height: 14px;
          border-radius: 2px;
          border: 1px solid rgba(0, 0, 0, 0.1);
        }
        
        .PhoneInputCountrySelectOption .PhoneInputCountrySelectOptionLabel {
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};

export default PhoneInput; 