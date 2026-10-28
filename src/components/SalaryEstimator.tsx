import React, { useState } from 'react';
import { Calculator, DollarSign, TrendingUp, HelpCircle, Shield, Award, Check } from 'lucide-react';
import { InstitutionSettings } from '../types';
import { calculateTax, formatCurrency } from '../utils/payrollCalculator';

interface SalaryEstimatorProps {
  institutionSettings: InstitutionSettings;
  onApplyToNewEmployee?: (preset: any) => void;
}

export const SalaryEstimator: React.FC<SalaryEstimatorProps> = ({
  institutionSettings,
  onApplyToNewEmployee,
}) => {
  const [baseMonthlySalary, setBaseMonthlySalary] = useState<number>(55000);
  const [overloadHours, setOverloadHours] = useState<number>(6);
  const [overloadRate, setOverloadRate] = useState<number>(650);
  const [chalkAllowance, setChalkAllowance] = useState<number>(2500);
  const [advisoryAllowance, setAdvisoryAllowance] = useState<number>(2000);
  const [researchAllowance, setResearchAllowance] = useState<number>(3000);
  const [riceTransportAllowance, setRiceTransportAllowance] = useState<number>(3500);
  const [viewFrequency, setViewFrequency] = useState<'semi-monthly' | 'monthly'>('semi-monthly');

  const divisor = viewFrequency === 'semi-monthly' ? 2 : 1;

  // Computations
  const periodicBase = baseMonthlySalary / divisor;
  const periodicOverload = (overloadHours * overloadRate) / (viewFrequency === 'semi-monthly' ? 2 : 1);
  const periodicChalk = chalkAllowance / divisor;
  const periodicAdvisory = advisoryAllowance / divisor;
  const periodicResearch = researchAllowance / divisor;
  const periodicRice = riceTransportAllowance / divisor;

  const totalAllowances = periodicChalk + periodicAdvisory + periodicResearch + periodicRice;
  const grossEarnings = periodicBase + periodicOverload + totalAllowances;

  // Estimated standard statutory
  const sssMonthly = Math.min(3000, Math.max(1000, baseMonthlySalary * 0.045));
  const philHealthMonthly = Math.min(3200, Math.max(800, baseMonthlySalary * 0.025));
  const pagIbigMonthly = 500;

  const sssPeriodic = sssMonthly / divisor;
  const philHealthPeriodic = philHealthMonthly / divisor;
  const pagIbigPeriodic = pagIbigMonthly / divisor;
  const totalStatutory = sssPeriodic + philHealthPeriodic + pagIbigPeriodic;

  // Taxable income
  const taxableIncome = Math.max(0, grossEarnings - totalStatutory);
  const withholdingTax = calculateTax(taxableIncome, viewFrequency === 'semi-monthly');

  const totalDeductions = withholdingTax + totalStatutory;
  const netTakeHome = Math.max(0, grossEarnings - totalDeductions);

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs uppercase font-bold tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                Institutional Tools
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                Academic Compensation Simulation
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
              Faculty Salary & Tax Estimator
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Interactive compensation calculator for hiring proposals, promotion rank increments, and workload honorarium analysis.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewFrequency('semi-monthly')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                viewFrequency === 'semi-monthly'
                  ? 'bg-white shadow-xs text-indigo-700'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semi-Monthly View (15th/30th)
            </button>
            <button
              onClick={() => setViewFrequency('monthly')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                viewFrequency === 'monthly'
                  ? 'bg-white shadow-xs text-indigo-700'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Full Monthly View
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Inputs vs Real-time Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Base Compensation Card */}
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center">
              <DollarSign className="w-4 h-4 mr-1 text-indigo-600" />
              Base Salary & Teaching Overload
            </h3>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Base Monthly Salary</span>
                  <span className="font-mono text-indigo-700 text-sm">
                    {formatCurrency(baseMonthlySalary, institutionSettings.currencySymbol)}
                  </span>
                </div>
                <input
                  type="range"
                  min="25000"
                  max="150000"
                  step="1000"
                  value={baseMonthlySalary}
                  onChange={(e) => setBaseMonthlySalary(parseFloat(e.target.value))}
                  className="w-full accent-indigo-600"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-0.5">
                  <span>₱25,000 (Instructor I)</span>
                  <span>₱75,000 (Assoc. Prof)</span>
                  <span>₱150,000 (Full Prof / Dean)</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Weekly Overload Hours</label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={overloadHours}
                    onChange={(e) => setOverloadHours(parseFloat(e.target.value) || 0)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold"
                  />
                  <span className="text-[11px] text-slate-500">Above 18 contact units</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Overload Rate / Hour (₱)</label>
                  <input
                    type="number"
                    min="200"
                    max="2000"
                    step="50"
                    value={overloadRate}
                    onChange={(e) => setOverloadRate(parseFloat(e.target.value) || 0)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold"
                  />
                  <span className="text-[11px] text-slate-500">Rank-specific tier</span>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Allowances Card */}
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center">
              <Award className="w-4 h-4 mr-1 text-emerald-600" />
              Monthly Academic Allowances
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Chalk & Teaching Supplies</label>
                <input
                  type="number"
                  value={chalkAllowance}
                  onChange={(e) => setChalkAllowance(parseFloat(e.target.value) || 0)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Section Advisory / Homeroom</label>
                <input
                  type="number"
                  value={advisoryAllowance}
                  onChange={(e) => setAdvisoryAllowance(parseFloat(e.target.value) || 0)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Research & Publication Grant</label>
                <input
                  type="number"
                  value={researchAllowance}
                  onChange={(e) => setResearchAllowance(parseFloat(e.target.value) || 0)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Rice & Transportation Subsidy</label>
                <input
                  type="number"
                  value={riceTransportAllowance}
                  onChange={(e) => setRiceTransportAllowance(parseFloat(e.target.value) || 0)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Right Output: Live Net Take-Home Statement (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs uppercase font-bold text-slate-500">
                {viewFrequency === 'semi-monthly' ? 'Semi-Monthly Projection' : 'Monthly Projection'}
              </span>
              <span className="text-xs bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded">
                Live Calculation
              </span>
            </div>

            {/* Net Hero */}
            <div className="bg-linear-to-br from-indigo-900 to-slate-900 rounded-xl p-5 text-white shadow-md">
              <span className="text-xs uppercase font-semibold tracking-wider text-indigo-200 block mb-1">
                Estimated Net Take-Home Pay
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-white">
                {formatCurrency(netTakeHome, institutionSettings.currencySymbol)}
              </div>
              <span className="text-xs text-indigo-300 block mt-1">
                Gross: {formatCurrency(grossEarnings, institutionSettings.currencySymbol)} &bull; Deductions: {formatCurrency(totalDeductions, institutionSettings.currencySymbol)}
              </span>
            </div>

            {/* Line items */}
            <div className="space-y-2 text-xs divide-y divide-slate-100">
              <div className="flex justify-between pt-2">
                <span className="text-slate-600">Period Base Pay:</span>
                <span className="font-mono font-semibold">{formatCurrency(periodicBase, institutionSettings.currencySymbol)}</span>
              </div>

              <div className="flex justify-between pt-2">
                <span className="text-slate-600">Overload Honorarium:</span>
                <span className="font-mono font-semibold text-emerald-700">+{formatCurrency(periodicOverload, institutionSettings.currencySymbol)}</span>
              </div>

              <div className="flex justify-between pt-2">
                <span className="text-slate-600">Total Academic Allowances:</span>
                <span className="font-mono font-semibold text-emerald-700">+{formatCurrency(totalAllowances, institutionSettings.currencySymbol)}</span>
              </div>

              <div className="flex justify-between pt-2 font-bold text-slate-800">
                <span>Gross Compensation:</span>
                <span className="font-mono">{formatCurrency(grossEarnings, institutionSettings.currencySymbol)}</span>
              </div>

              <div className="flex justify-between pt-2">
                <span className="text-slate-600">Withholding Tax (Progressive):</span>
                <span className="font-mono font-medium text-rose-700">-{formatCurrency(withholdingTax, institutionSettings.currencySymbol)}</span>
              </div>

              <div className="flex justify-between pt-2">
                <span className="text-slate-600">SSS / GSIS Pension:</span>
                <span className="font-mono font-medium text-rose-700">-{formatCurrency(sssPeriodic, institutionSettings.currencySymbol)}</span>
              </div>

              <div className="flex justify-between pt-2">
                <span className="text-slate-600">PhilHealth Insurance:</span>
                <span className="font-mono font-medium text-rose-700">-{formatCurrency(philHealthPeriodic, institutionSettings.currencySymbol)}</span>
              </div>

              <div className="flex justify-between pt-2">
                <span className="text-slate-600">Pag-IBIG / Provident:</span>
                <span className="font-mono font-medium text-rose-700">-{formatCurrency(pagIbigPeriodic, institutionSettings.currencySymbol)}</span>
              </div>

              <div className="flex justify-between pt-2 font-bold text-rose-700">
                <span>Total Statutory & Taxes:</span>
                <span className="font-mono">-{formatCurrency(totalDeductions, institutionSettings.currencySymbol)}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400">
              * Calculations use standard academic bracket estimates. Actual deductions may vary based on exact tax exemptions and campus loan programs.
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
