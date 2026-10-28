import React from 'react';
import { X, Printer, Download, GraduationCap, CheckCircle, ShieldCheck } from 'lucide-react';
import { Payslip, InstitutionSettings } from '../types';
import { formatCurrency } from '../utils/payrollCalculator';

interface PayslipViewerModalProps {
  payslip: Payslip | null;
  onClose: () => void;
  institutionSettings: InstitutionSettings;
}

export const PayslipViewerModal: React.FC<PayslipViewerModalProps> = ({
  payslip,
  onClose,
  institutionSettings,
}) => {
  if (!payslip) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadText = () => {
    const textData = JSON.stringify(payslip, null, 2);
    const blob = new Blob([textData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Payslip_${payslip.employeeNumber}_${payslip.periodTitle.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[95vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Top Control Bar (Hidden when printing) */}
        <div className="no-print bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-5 h-5 text-indigo-400" />
            <span className="font-bold text-sm">Official Institutional Payslip</span>
            <span className="text-xs text-slate-400 font-mono">({payslip.id})</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-colors"
            >
              <Printer className="w-3.5 h-3.5 mr-1.5" />
              Print Official Slip
            </button>
            <button
              onClick={handleDownloadText}
              className="inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <Download className="w-3.5 h-3.5 mr-1" />
              JSON
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-md"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Payslip Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-white text-slate-900 print:p-0">
          
          <div className="border border-slate-300 rounded-lg p-6 bg-white shadow-xs print:border-none print:shadow-none print:p-0">
            
            {/* Institution Header & Seal */}
            <div className="text-center pb-4 border-b-2 border-slate-800">
              <div className="flex items-center justify-center space-x-2 mb-1">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h1 className="text-lg sm:text-xl font-extrabold tracking-tight uppercase text-slate-900">
                  {institutionSettings.schoolName}
                </h1>
              </div>
              <p className="text-xs text-slate-600 font-medium">
                {institutionSettings.schoolCampus}
              </p>
              <p className="text-[11px] text-slate-500">
                {institutionSettings.address} &bull; TIN: {institutionSettings.tinNumber}
              </p>
              <div className="mt-2 inline-block bg-slate-100 text-slate-800 text-[11px] font-bold uppercase tracking-wider px-3 py-0.5 rounded border border-slate-300">
                Official Faculty & Staff Compensation Payslip
              </div>
            </div>

            {/* Pay Period & Employee Information Grid */}
            <div className="grid grid-cols-2 gap-4 py-4 text-xs border-b border-slate-200">
              <div className="space-y-1">
                <div>
                  <span className="text-slate-500 font-medium">Faculty / Staff Name:</span>{' '}
                  <strong className="text-slate-900 text-sm">{payslip.employeeName}</strong>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Employee Number:</span>{' '}
                  <span className="font-mono font-bold text-slate-800">{payslip.employeeNumber}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Academic Rank / Role:</span>{' '}
                  <span className="font-semibold text-slate-800">{payslip.facultyRank}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Academic Department:</span>{' '}
                  <span className="text-slate-700">{payslip.department}</span>
                </div>
              </div>

              <div className="space-y-1 text-right">
                <div>
                  <span className="text-slate-500 font-medium">Payroll Period:</span>{' '}
                  <strong className="text-slate-900">{payslip.periodTitle}</strong>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Inclusive Dates:</span>{' '}
                  <span className="text-slate-700 font-mono">{payslip.periodDates}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Scheduled Pay Date:</span>{' '}
                  <span className="font-semibold text-slate-800">{payslip.payDate}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Disbursement Account:</span>{' '}
                  <span className="font-mono text-slate-700">{payslip.paymentMethod} ({payslip.bankAccountNumber})</span>
                </div>
              </div>
            </div>

            {/* Attendance & Workload Summary Line */}
            <div className="py-2.5 px-3 my-3 bg-slate-50 rounded border border-slate-200 text-xs flex flex-wrap items-center justify-between gap-2">
              <span>Days Worked: <strong>{payslip.actualDaysWorked}</strong> of {payslip.expectedDays} days</span>
              <span>Regular Hours: <strong>{payslip.regularHoursWorked} hrs</strong></span>
              <span>Overload Hours: <strong>{payslip.overloadHours} hrs</strong></span>
              <span>Tardiness: <strong>{payslip.tardinessMinutes} mins</strong></span>
              <span>Unexcused Absences: <strong>{payslip.absentDays} days</strong></span>
            </div>

            {/* Two-Column Earnings and Deductions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-4 text-xs">
              
              {/* Earnings Column */}
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="bg-slate-100 px-3 py-2 border-b border-slate-200 font-bold uppercase tracking-wider text-slate-700 flex justify-between">
                  <span>Gross Earnings</span>
                  <span>Amount</span>
                </div>
                <div className="p-3 space-y-2">
                  <div className="flex justify-between py-0.5">
                    <span className="text-slate-700">Basic Period Pay</span>
                    <span className="font-mono font-semibold">{formatCurrency(payslip.basicPay, institutionSettings.currencySymbol)}</span>
                  </div>

                  {payslip.overloadPay > 0 && (
                    <div className="flex justify-between py-0.5">
                      <span className="text-slate-700">Teaching Overload Honorarium ({payslip.overloadHours} hrs)</span>
                      <span className="font-mono font-semibold text-emerald-700">+{formatCurrency(payslip.overloadPay, institutionSettings.currencySymbol)}</span>
                    </div>
                  )}

                  {payslip.chalkAllowance > 0 && (
                    <div className="flex justify-between py-0.5">
                      <span className="text-slate-700">Chalk & Instructional Supplies</span>
                      <span className="font-mono">{formatCurrency(payslip.chalkAllowance, institutionSettings.currencySymbol)}</span>
                    </div>
                  )}

                  {payslip.advisoryAllowance > 0 && (
                    <div className="flex justify-between py-0.5">
                      <span className="text-slate-700">Class Advisory / Homeroom</span>
                      <span className="font-mono">{formatCurrency(payslip.advisoryAllowance, institutionSettings.currencySymbol)}</span>
                    </div>
                  )}

                  {payslip.researchAllowance > 0 && (
                    <div className="flex justify-between py-0.5">
                      <span className="text-slate-700">Academic Research & Publication</span>
                      <span className="font-mono">{formatCurrency(payslip.researchAllowance, institutionSettings.currencySymbol)}</span>
                    </div>
                  )}

                  {payslip.riceTransportAllowance > 0 && (
                    <div className="flex justify-between py-0.5">
                      <span className="text-slate-700">Rice & Transportation Subsidy</span>
                      <span className="font-mono">{formatCurrency(payslip.riceTransportAllowance, institutionSettings.currencySymbol)}</span>
                    </div>
                  )}

                  {payslip.otherAllowances > 0 && (
                    <div className="flex justify-between py-0.5">
                      <span className="text-slate-700">Special Honorarium / Allowance</span>
                      <span className="font-mono">{formatCurrency(payslip.otherAllowances, institutionSettings.currencySymbol)}</span>
                    </div>
                  )}
                </div>

                <div className="bg-slate-50 px-3 py-2 border-t border-slate-200 font-bold flex justify-between text-slate-900">
                  <span>Total Gross Earnings</span>
                  <span className="font-mono text-sm">{formatCurrency(payslip.grossEarnings, institutionSettings.currencySymbol)}</span>
                </div>
              </div>

              {/* Deductions Column */}
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="bg-slate-100 px-3 py-2 border-b border-slate-200 font-bold uppercase tracking-wider text-slate-700 flex justify-between">
                  <span>Itemized Deductions</span>
                  <span>Amount</span>
                </div>
                <div className="p-3 space-y-2">
                  <div className="flex justify-between py-0.5">
                    <span className="text-slate-700">Withholding Tax (Progressive)</span>
                    <span className="font-mono text-rose-700 font-medium">-{formatCurrency(payslip.withholdingTax, institutionSettings.currencySymbol)}</span>
                  </div>

                  <div className="flex justify-between py-0.5">
                    <span className="text-slate-700">SSS / GSIS Pension Contribution</span>
                    <span className="font-mono text-rose-700 font-medium">-{formatCurrency(payslip.sssGsis, institutionSettings.currencySymbol)}</span>
                  </div>

                  <div className="flex justify-between py-0.5">
                    <span className="text-slate-700">PhilHealth Medical Insurance</span>
                    <span className="font-mono text-rose-700 font-medium">-{formatCurrency(payslip.philHealth, institutionSettings.currencySymbol)}</span>
                  </div>

                  <div className="flex justify-between py-0.5">
                    <span className="text-slate-700">Pag-IBIG / Provident Fund</span>
                    <span className="font-mono text-rose-700 font-medium">-{formatCurrency(payslip.pagIbigProvident, institutionSettings.currencySymbol)}</span>
                  </div>

                  {payslip.tardinessDeduction > 0 && (
                    <div className="flex justify-between py-0.5">
                      <span className="text-slate-700">Tardiness / Lateness ({payslip.tardinessMinutes} mins)</span>
                      <span className="font-mono text-rose-700 font-medium">-{formatCurrency(payslip.tardinessDeduction, institutionSettings.currencySymbol)}</span>
                    </div>
                  )}

                  {payslip.absenceDeduction > 0 && (
                    <div className="flex justify-between py-0.5">
                      <span className="text-slate-700">Unexcused Absences ({payslip.absentDays} days)</span>
                      <span className="font-mono text-rose-700 font-medium">-{formatCurrency(payslip.absenceDeduction, institutionSettings.currencySymbol)}</span>
                    </div>
                  )}

                  {payslip.loanAmortization > 0 && (
                    <div className="flex justify-between py-0.5">
                      <span className="text-slate-700">Faculty Loan Amortization</span>
                      <span className="font-mono text-rose-700 font-medium">-{formatCurrency(payslip.loanAmortization, institutionSettings.currencySymbol)}</span>
                    </div>
                  )}
                </div>

                <div className="bg-slate-50 px-3 py-2 border-t border-slate-200 font-bold flex justify-between text-slate-900">
                  <span>Total Deductions</span>
                  <span className="font-mono text-sm text-rose-700">-{formatCurrency(payslip.totalDeductions, institutionSettings.currencySymbol)}</span>
                </div>
              </div>

            </div>

            {/* NET PAY HIGHLIGHT BANNER */}
            <div className="bg-indigo-50 border-2 border-indigo-500 rounded-lg p-4 my-4 flex flex-col sm:flex-row items-center justify-between text-indigo-950">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-indigo-700 block">
                  Net Take-Home Pay (Disbursed via {payslip.paymentMethod})
                </span>
                <span className="text-xs text-indigo-900 font-medium">
                  Confidential payroll document issued for personal academic record.
                </span>
              </div>
              <div className="mt-2 sm:mt-0 text-right">
                <span className="text-2xl sm:text-3xl font-black font-mono text-indigo-700 tracking-tight">
                  {formatCurrency(payslip.netPay, institutionSettings.currencySymbol)}
                </span>
              </div>
            </div>

            {/* Signatures & Approvals */}
            <div className="grid grid-cols-3 gap-6 pt-8 mt-6 border-t border-slate-300 text-[11px] text-center print:pt-6">
              <div>
                <div className="border-b border-slate-400 pb-1 mb-1 font-semibold text-slate-800">
                  {institutionSettings.preparedByName}
                </div>
                <span className="text-slate-500 block">{institutionSettings.preparedByTitle}</span>
                <span className="text-[10px] text-slate-400">Verified & Processed</span>
              </div>

              <div>
                <div className="border-b border-slate-400 pb-1 mb-1 font-semibold text-slate-800">
                  {institutionSettings.approvedByName}
                </div>
                <span className="text-slate-500 block">{institutionSettings.approvedByTitle}</span>
                <span className="text-[10px] text-slate-400">Comptroller Approval</span>
              </div>

              <div>
                <div className="border-b border-slate-400 pb-1 mb-1 font-semibold text-slate-800">
                  {payslip.employeeName}
                </div>
                <span className="text-slate-500 block">Faculty / Staff Member</span>
                <span className="text-[10px] text-slate-400">Employee Acknowledgment</span>
              </div>
            </div>

            {/* Verification Footer */}
            <div className="mt-6 pt-2 text-center text-[10px] text-slate-400 border-t border-slate-100 flex items-center justify-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>EduCore Academic Payroll Engine &bull; System Verified &bull; Generated: {new Date(payslip.generatedAt).toLocaleString()}</span>
            </div>

          </div>

        </div>

        {/* Modal Footer Controls */}
        <div className="no-print px-6 py-3 bg-slate-100 border-t border-slate-200 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-800 text-white hover:bg-slate-700 transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
