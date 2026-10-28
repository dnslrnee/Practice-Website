import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  DollarSign, 
  CheckCircle, 
  Clock, 
  Printer, 
  Download, 
  RefreshCw, 
  FileText, 
  Plus, 
  AlertTriangle,
  ChevronRight,
  Send
} from 'lucide-react';
import { Employee, PayrollPeriod, Payslip, InstitutionSettings } from '../types';
import { generateEmployeePayslip, formatCurrency, AttendanceInput } from '../utils/payrollCalculator';

interface PayrollManagerProps {
  employees: Employee[];
  payrollPeriods: PayrollPeriod[];
  currentPeriod: PayrollPeriod;
  onSelectPeriod: (period: PayrollPeriod) => void;
  onCreatePeriod: (newPeriod: PayrollPeriod) => void;
  onUpdatePeriodStatus: (periodId: string, status: PayrollPeriod['status']) => void;
  payslips: Payslip[];
  onSavePayslips: (slips: Payslip[]) => void;
  onViewPayslip: (slip: Payslip) => void;
  institutionSettings: InstitutionSettings;
}

export const PayrollManager: React.FC<PayrollManagerProps> = ({
  employees,
  payrollPeriods,
  currentPeriod,
  onSelectPeriod,
  onCreatePeriod,
  onUpdatePeriodStatus,
  payslips,
  onSavePayslips,
  onViewPayslip,
  institutionSettings,
}) => {
  // Local attendance overrides state map: employeeId -> AttendanceInput
  const [attendanceOverrides, setAttendanceOverrides] = useState<Record<string, AttendanceInput>>({});
  const [showNewPeriodModal, setShowNewPeriodModal] = useState(false);
  const [newPeriodForm, setNewPeriodForm] = useState<Partial<PayrollPeriod>>({
    title: 'November 01 - 15, 2026 (1st Half Pay Period)',
    startDate: '2026-11-01',
    endDate: '2026-11-15',
    payDate: '2026-11-15',
    status: 'Draft',
    periodType: 'Semi-Monthly (1st-15th)',
  });

  // Filter payslips for currently selected period
  const currentPeriodPayslips = useMemo(() => {
    return payslips.filter((p) => p.periodId === currentPeriod.id);
  }, [payslips, currentPeriod]);

  // Compute live preview for all active employees based on current period and attendance overrides
  const computedList = useMemo(() => {
    return employees
      .filter((e) => e.status !== 'Inactive')
      .map((emp) => {
        // If an existing saved payslip matches, use it as baseline
        const existing = currentPeriodPayslips.find((p) => p.employeeId === emp.id);
        const override = attendanceOverrides[emp.id] || {
          actualDaysWorked: existing ? existing.actualDaysWorked : undefined,
          expectedDays: existing ? existing.expectedDays : undefined,
          overloadHours: existing ? existing.overloadHours : (emp.assignedSubjects.length > 3 ? 4 : 0),
          tardinessMinutes: existing ? existing.tardinessMinutes : 0,
          absentDays: existing ? existing.absentDays : 0,
        };

        const calculated = generateEmployeePayslip(emp, currentPeriod, override);
        return {
          employee: emp,
          payslip: calculated,
          override,
        };
      });
  }, [employees, currentPeriod, currentPeriodPayslips, attendanceOverrides]);

  // Totals for this period
  const totals = useMemo(() => {
    return computedList.reduce(
      (acc, item) => {
        acc.gross += item.payslip.grossEarnings;
        acc.tax += item.payslip.withholdingTax;
        acc.statutory += item.payslip.sssGsis + item.payslip.philHealth + item.payslip.pagIbigProvident;
        acc.deductions += item.payslip.totalDeductions;
        acc.net += item.payslip.netPay;
        return acc;
      },
      { gross: 0, tax: 0, statutory: 0, deductions: 0, net: 0 }
    );
  }, [computedList]);

  // Update attendance field
  const handleUpdateAttendance = (employeeId: string, field: keyof AttendanceInput, value: number) => {
    setAttendanceOverrides((prev) => ({
      ...prev,
      [employeeId]: {
        ...(prev[employeeId] || {}),
        [field]: value,
      },
    }));
  };

  // Batch Save / Commit Payslips
  const handleCommitPayroll = (newStatus?: PayrollPeriod['status']) => {
    const slipsToSave: Payslip[] = computedList.map((item) => ({
      ...item.payslip,
      status: newStatus === 'Disbursed' ? 'Paid' : 'Pending',
    }));

    onSavePayslips(slipsToSave);

    if (newStatus) {
      onUpdatePeriodStatus(currentPeriod.id, newStatus);
    }
  };

  // Export Period Payroll Sheet to CSV
  const handleExportPayrollCSV = () => {
    const headers = [
      'Faculty ID',
      'Faculty Name',
      'Department',
      'Days Worked',
      'Overload Hours',
      'Tardiness (Mins)',
      'Basic Pay',
      'Overload Pay',
      'Allowances',
      'Gross Earnings',
      'Withholding Tax',
      'SSS/GSIS',
      'PhilHealth',
      'Pag-IBIG',
      'Total Deductions',
      'Net Pay',
      'Disbursement Bank',
      'Account Number',
    ];

    const rows = computedList.map(({ employee, payslip }) => [
      `"${employee.employeeNumber}"`,
      `"${employee.fullName}"`,
      `"${employee.department}"`,
      payslip.actualDaysWorked,
      payslip.overloadHours,
      payslip.tardinessMinutes,
      payslip.basicPay.toFixed(2),
      payslip.overloadPay.toFixed(2),
      (payslip.chalkAllowance + payslip.advisoryAllowance + payslip.researchAllowance + payslip.riceTransportAllowance + payslip.otherAllowances).toFixed(2),
      payslip.grossEarnings.toFixed(2),
      payslip.withholdingTax.toFixed(2),
      payslip.sssGsis.toFixed(2),
      payslip.philHealth.toFixed(2),
      payslip.pagIbigProvident.toFixed(2),
      payslip.totalDeductions.toFixed(2),
      payslip.netPay.toFixed(2),
      `"${employee.bankDetails.bankName}"`,
      `"${employee.bankDetails.accountNumber}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Payroll_Register_${currentPeriod.title.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Create New Pay Period Handler
  const handleCreatePeriod = () => {
    if (!newPeriodForm.startDate || !newPeriodForm.endDate || !newPeriodForm.title) return;
    const period: PayrollPeriod = {
      id: `prd-${newPeriodForm.startDate.replace(/-/g, '')}`,
      title: newPeriodForm.title,
      startDate: newPeriodForm.startDate,
      endDate: newPeriodForm.endDate,
      payDate: newPeriodForm.payDate || newPeriodForm.endDate,
      status: 'Draft',
      periodType: (newPeriodForm.periodType as any) || 'Semi-Monthly (1st-15th)',
    };
    onCreatePeriod(period);
    setShowNewPeriodModal(false);
  };

  return (
    <div className="space-y-5">
      
      {/* Top Banner & Period Selector */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs uppercase font-bold tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                Payroll Management
              </span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                currentPeriod.status === 'Disbursed'
                  ? 'bg-emerald-100 text-emerald-800'
                  : currentPeriod.status === 'Approved'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {currentPeriod.status}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
              {currentPeriod.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Coverage: <strong>{currentPeriod.startDate}</strong> to <strong>{currentPeriod.endDate}</strong> &bull; Scheduled Disbursement: <strong>{currentPeriod.payDate}</strong>
            </p>
          </div>

          {/* Period selector dropdown & Create button */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center space-x-2">
              <label className="text-xs font-semibold text-slate-600">Select Pay Period:</label>
              <select
                value={currentPeriod.id}
                onChange={(e) => {
                  const sel = payrollPeriods.find((p) => p.id === e.target.value);
                  if (sel) onSelectPeriod(sel);
                }}
                className="text-xs sm:text-sm rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {payrollPeriods.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} ({p.status})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setShowNewPeriodModal(true)}
              className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              New Pay Period
            </button>
          </div>

        </div>

        {/* Financial KPI Summary Cards for this period */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-5 pt-4 border-t border-slate-100">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 uppercase block">Total Gross Pay</span>
            <span className="text-base sm:text-lg font-extrabold text-slate-900 font-mono">
              {formatCurrency(totals.gross, institutionSettings.currencySymbol)}
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Base + Overload + Allowances</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 uppercase block">Withholding Tax</span>
            <span className="text-base sm:text-lg font-extrabold text-rose-700 font-mono">
              -{formatCurrency(totals.tax, institutionSettings.currencySymbol)}
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Progressive withholding</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 uppercase block">Statutory Deductions</span>
            <span className="text-base sm:text-lg font-extrabold text-amber-700 font-mono">
              -{formatCurrency(totals.statutory, institutionSettings.currencySymbol)}
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">SSS/GSIS, PhilHealth, Pag-IBIG</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 uppercase block">Total Deductions</span>
            <span className="text-base sm:text-lg font-extrabold text-slate-700 font-mono">
              -{formatCurrency(totals.deductions, institutionSettings.currencySymbol)}
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Taxes, stat, loans & tardiness</span>
          </div>

          <div className="col-span-2 sm:col-span-1 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
            <span className="text-[11px] font-semibold text-emerald-900 uppercase block">Net Disbursable</span>
            <span className="text-base sm:text-lg font-extrabold text-emerald-700 font-mono">
              {formatCurrency(totals.net, institutionSettings.currencySymbol)}
            </span>
            <span className="text-[10px] text-emerald-800 block mt-0.5">{computedList.length} Faculty Members</span>
          </div>
        </div>

      </div>

      {/* Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-100 p-3 rounded-lg border border-slate-200">
        <div className="flex items-center space-x-2 text-xs text-slate-600">
          <Clock className="w-4 h-4 text-slate-500" />
          <span>Edit hours, overload, or absences below. Calculations update in real time.</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportPayrollCSV}
            className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 transition-colors"
          >
            <Download className="w-3.5 h-3.5 mr-1" />
            Export Payroll Register
          </button>

          <button
            onClick={() => handleCommitPayroll('Computed')}
            className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1" />
            Save / Compute Batch
          </button>

          {currentPeriod.status !== 'Approved' && currentPeriod.status !== 'Disbursed' && (
            <button
              onClick={() => handleCommitPayroll('Approved')}
              className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors"
            >
              <CheckCircle className="w-3.5 h-3.5 mr-1" />
              Approve Period
            </button>
          )}

          {currentPeriod.status === 'Approved' && (
            <button
              onClick={() => handleCommitPayroll('Disbursed')}
              className="inline-flex items-center px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
            >
              <Send className="w-3.5 h-3.5 mr-1" />
              Disburse / Mark Paid
            </button>
          )}
        </div>
      </div>

      {/* Interactive Payroll Register Table */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-3">Faculty / Staff Member</th>
                <th className="py-3 px-3 text-center">Worked Days</th>
                <th className="py-3 px-3 text-center">Overload (Hrs)</th>
                <th className="py-3 px-3 text-center">Tardiness (Min)</th>
                <th className="py-3 px-3 text-right">Period Basic</th>
                <th className="py-3 px-3 text-right">Allowances</th>
                <th className="py-3 px-3 text-right">Gross Pay</th>
                <th className="py-3 px-3 text-right">Tax & Stat</th>
                <th className="py-3 px-3 text-right font-bold text-slate-800">Net Take-Home</th>
                <th className="py-3 px-3 text-center">Payslip</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {computedList.map(({ employee, payslip, override }) => {
                const totalAllowances = 
                  payslip.chalkAllowance +
                  payslip.advisoryAllowance +
                  payslip.researchAllowance +
                  payslip.riceTransportAllowance +
                  payslip.otherAllowances;

                return (
                  <tr key={employee.id} className="hover:bg-slate-50/80 transition-colors">
                    
                    {/* Faculty Member */}
                    <td className="py-2.5 px-3">
                      <div className="flex items-center space-x-2.5">
                        <div className={`w-8 h-8 rounded-lg ${employee.avatarColor || 'bg-indigo-600'} text-white font-bold text-xs flex items-center justify-center shrink-0`}>
                          {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">{employee.fullName}</span>
                          <span className="text-[11px] text-slate-500">
                            {employee.employeeNumber} &bull; {employee.facultyRank}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Worked Days input */}
                    <td className="py-2.5 px-3 text-center">
                      <input
                        type="number"
                        min="0"
                        max="31"
                        value={override.actualDaysWorked ?? payslip.actualDaysWorked}
                        onChange={(e) => handleUpdateAttendance(employee.id, 'actualDaysWorked', parseFloat(e.target.value) || 0)}
                        className="w-14 text-center py-1 rounded border border-slate-300 font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                      />
                      <span className="text-[10px] text-slate-400 block mt-0.5">/{payslip.expectedDays} d</span>
                    </td>

                    {/* Overload Hours */}
                    <td className="py-2.5 px-3 text-center">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={override.overloadHours ?? payslip.overloadHours}
                        onChange={(e) => handleUpdateAttendance(employee.id, 'overloadHours', parseFloat(e.target.value) || 0)}
                        className="w-14 text-center py-1 rounded border border-slate-300 font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                      />
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        {payslip.overloadPay > 0 ? `+${formatCurrency(payslip.overloadPay, institutionSettings.currencySymbol)}` : '0 hrs'}
                      </span>
                    </td>

                    {/* Tardiness */}
                    <td className="py-2.5 px-3 text-center">
                      <input
                        type="number"
                        min="0"
                        max="600"
                        value={override.tardinessMinutes ?? payslip.tardinessMinutes}
                        onChange={(e) => handleUpdateAttendance(employee.id, 'tardinessMinutes', parseInt(e.target.value, 10) || 0)}
                        className="w-14 text-center py-1 rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                      />
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        {payslip.tardinessDeduction > 0 ? `-${formatCurrency(payslip.tardinessDeduction, institutionSettings.currencySymbol)}` : '0 min'}
                      </span>
                    </td>

                    {/* Basic Pay */}
                    <td className="py-2.5 px-3 text-right font-mono font-medium text-slate-800">
                      {formatCurrency(payslip.basicPay, institutionSettings.currencySymbol)}
                    </td>

                    {/* Allowances */}
                    <td className="py-2.5 px-3 text-right font-mono text-emerald-700">
                      +{formatCurrency(totalAllowances, institutionSettings.currencySymbol)}
                    </td>

                    {/* Gross Pay */}
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                      {formatCurrency(payslip.grossEarnings, institutionSettings.currencySymbol)}
                    </td>

                    {/* Tax & Deductions */}
                    <td className="py-2.5 px-3 text-right font-mono text-rose-700">
                      -{formatCurrency(payslip.totalDeductions, institutionSettings.currencySymbol)}
                      <span className="text-[10px] text-slate-400 block">
                        Tax: {formatCurrency(payslip.withholdingTax, institutionSettings.currencySymbol)}
                      </span>
                    </td>

                    {/* Net Pay */}
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-sm text-indigo-700">
                      {formatCurrency(payslip.netPay, institutionSettings.currencySymbol)}
                    </td>

                    {/* Payslip View Action */}
                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={() => onViewPayslip(payslip)}
                        className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 border border-slate-200 transition-colors"
                        title="View & Print Official Payslip"
                      >
                        <FileText className="w-3.5 h-3.5 mr-1" />
                        Slip
                      </button>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Pay Period Modal */}
      {showNewPeriodModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-indigo-600" />
                Initialize New Pay Period
              </h3>
              <button
                onClick={() => setShowNewPeriodModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Period Title</label>
                <input
                  type="text"
                  placeholder="e.g. November 01 - 15, 2026 (1st Half Pay Period)"
                  value={newPeriodForm.title || ''}
                  onChange={(e) => setNewPeriodForm({ ...newPeriodForm, title: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Period Type</label>
                <select
                  value={newPeriodForm.periodType}
                  onChange={(e) => setNewPeriodForm({ ...newPeriodForm, periodType: e.target.value as any })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900"
                >
                  <option value="Semi-Monthly (1st-15th)">Semi-Monthly (1st-15th)</option>
                  <option value="Semi-Monthly (16th-End)">Semi-Monthly (16th-End)</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Mid-Year / 13th Month">Mid-Year / 13th Month</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={newPeriodForm.startDate || ''}
                    onChange={(e) => setNewPeriodForm({ ...newPeriodForm, startDate: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={newPeriodForm.endDate || ''}
                    onChange={(e) => setNewPeriodForm({ ...newPeriodForm, endDate: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Scheduled Pay / Disbursement Date</label>
                <input
                  type="date"
                  value={newPeriodForm.payDate || ''}
                  onChange={(e) => setNewPeriodForm({ ...newPeriodForm, payDate: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowNewPeriodModal(false)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreatePeriod}
                className="px-4 py-1.5 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-500"
              >
                Create Period
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
