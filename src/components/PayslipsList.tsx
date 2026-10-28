import React, { useState, useMemo } from 'react';
import { FileText, Printer, Search, Download, Calendar, CheckCircle } from 'lucide-react';
import { Payslip, PayrollPeriod, InstitutionSettings } from '../types';
import { formatCurrency } from '../utils/payrollCalculator';

interface PayslipsListProps {
  payslips: Payslip[];
  payrollPeriods: PayrollPeriod[];
  onViewPayslip: (slip: Payslip) => void;
  institutionSettings: InstitutionSettings;
}

export const PayslipsList: React.FC<PayslipsListProps> = ({
  payslips,
  payrollPeriods,
  onViewPayslip,
  institutionSettings,
}) => {
  const [selectedPeriodId, setSelectedPeriodId] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPayslips = useMemo(() => {
    return payslips.filter((slip) => {
      const matchesPeriod = selectedPeriodId === 'ALL' || slip.periodId === selectedPeriodId;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        slip.employeeName.toLowerCase().includes(q) ||
        slip.employeeNumber.toLowerCase().includes(q) ||
        slip.department.toLowerCase().includes(q) ||
        slip.periodTitle.toLowerCase().includes(q);

      return matchesPeriod && matchesSearch;
    });
  }, [payslips, selectedPeriodId, searchQuery]);

  const totalDisbursed = useMemo(() => {
    return filteredPayslips.reduce((sum, s) => sum + s.netPay, 0);
  }, [filteredPayslips]);

  const totalGross = useMemo(() => {
    return filteredPayslips.reduce((sum, s) => sum + s.grossEarnings, 0);
  }, [filteredPayslips]);

  const totalDeductions = useMemo(() => {
    return filteredPayslips.reduce((sum, s) => sum + s.totalDeductions, 0);
  }, [filteredPayslips]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Official Institutional Payslips
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Access, inspect, print, and archive official compensation slips for faculty and staff.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-white shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4 mr-1.5" />
              <span>Print Visible Slips</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by faculty name, employee number, department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={selectedPeriodId}
              onChange={(e) => setSelectedPeriodId(e.target.value)}
              className="w-full py-1.5 px-3 text-xs sm:text-sm rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">All Payroll Periods</option>
              {payrollPeriods.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2 text-right text-xs text-slate-500">
            <strong>{filteredPayslips.length}</strong> payslips found
          </div>
        </div>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200">
          <span className="text-xs font-semibold text-slate-500 uppercase block">Total Gross In View</span>
          <span className="text-lg font-bold font-mono text-slate-900">
            {formatCurrency(totalGross, institutionSettings.currencySymbol)}
          </span>
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-200">
          <span className="text-xs font-semibold text-slate-500 uppercase block">Total Deductions In View</span>
          <span className="text-lg font-bold font-mono text-rose-700">
            -{formatCurrency(totalDeductions, institutionSettings.currencySymbol)}
          </span>
        </div>
        <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-200">
          <span className="text-xs font-semibold text-indigo-900 uppercase block">Total Net Disbursed In View</span>
          <span className="text-lg font-bold font-mono text-indigo-700">
            {formatCurrency(totalDisbursed, institutionSettings.currencySymbol)}
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase">
              <tr>
                <th className="py-3 px-4">Faculty Member</th>
                <th className="py-3 px-4">Pay Period & Dates</th>
                <th className="py-3 px-4 text-center">Work Days</th>
                <th className="py-3 px-4 text-right">Gross Earnings</th>
                <th className="py-3 px-4 text-right">Total Deductions</th>
                <th className="py-3 px-4 text-right font-bold">Net Pay</th>
                <th className="py-3 px-4">Disbursement Account</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredPayslips.map((slip) => (
                <tr key={slip.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 text-sm block">{slip.employeeName}</span>
                    <span className="text-[11px] text-slate-500">
                      {slip.employeeNumber} &bull; {slip.facultyRank}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-800 block">{slip.periodTitle}</span>
                    <span className="text-[11px] text-slate-500 font-mono">{slip.periodDates}</span>
                  </td>

                  <td className="py-3 px-4 text-center">
                    <span className="font-medium text-slate-800">{slip.actualDaysWorked} / {slip.expectedDays} d</span>
                    {slip.overloadHours > 0 && (
                      <span className="text-[10px] text-indigo-600 block">+{slip.overloadHours}h overload</span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-right font-mono font-medium text-slate-900">
                    {formatCurrency(slip.grossEarnings, institutionSettings.currencySymbol)}
                  </td>

                  <td className="py-3 px-4 text-right font-mono text-rose-700">
                    -{formatCurrency(slip.totalDeductions, institutionSettings.currencySymbol)}
                  </td>

                  <td className="py-3 px-4 text-right font-mono font-extrabold text-sm text-indigo-700">
                    {formatCurrency(slip.netPay, institutionSettings.currencySymbol)}
                  </td>

                  <td className="py-3 px-4">
                    <span className="text-slate-800 font-medium block">{slip.paymentMethod}</span>
                    <span className="text-[11px] text-slate-500 font-mono">{slip.bankAccountNumber}</span>
                  </td>

                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => onViewPayslip(slip)}
                      className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5 mr-1" />
                      View / Print
                    </button>
                  </td>
                </tr>
              ))}

              {filteredPayslips.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <FileText className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                    <p className="text-sm font-semibold text-slate-700">No payslips found</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Go to the Payroll Processing tab to compute and save payslips for the current cycle.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
