import React, { useMemo } from 'react';
import { 
  Users, 
  DollarSign, 
  GraduationCap, 
  Calendar, 
  UserPlus, 
  FileText, 
  ArrowRight, 
  Briefcase, 
  MapPin, 
  Phone,
  Award,
  Clock,
  Printer
} from 'lucide-react';
import { Employee, PayrollPeriod, Payslip, InstitutionSettings } from '../types';
import { formatCurrency } from '../utils/payrollCalculator';

interface DashboardProps {
  employees: Employee[];
  payrollPeriods: PayrollPeriod[];
  currentPeriod: PayrollPeriod;
  payslips: Payslip[];
  onNavigateTab: (tab: 'dashboard' | 'directory' | 'payroll' | 'payslips' | 'estimator') => void;
  onOpenAddModal: () => void;
  onViewEmployee: (emp: Employee) => void;
  onViewPayslip: (slip: Payslip) => void;
  institutionSettings: InstitutionSettings;
}

export const Dashboard: React.FC<DashboardProps> = ({
  employees,
  payrollPeriods,
  currentPeriod,
  payslips,
  onNavigateTab,
  onOpenAddModal,
  onViewEmployee,
  onViewPayslip,
  institutionSettings,
}) => {
  // Key Stats
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter((e) => e.status === 'Active').length;
  
  // Total Monthly Payroll Commitment (Base + Allowances)
  const totalMonthlyBasePayroll = useMemo(() => {
    return employees.reduce((sum, e) => {
      const allowances = 
        (e.allowances.chalkInstructional || 0) +
        (e.allowances.advisoryHomeroom || 0) +
        (e.allowances.researchPublication || 0) +
        (e.allowances.transportationRice || 0) +
        (e.allowances.otherAllowance || 0);
      return sum + (e.baseMonthlySalary || 0) + allowances;
    }, 0);
  }, [employees]);

  // Average Age
  const averageAge = useMemo(() => {
    if (employees.length === 0) return 0;
    const totalAge = employees.reduce((sum, e) => sum + (e.age || 0), 0);
    return (totalAge / employees.length).toFixed(1);
  }, [employees]);

  // Total teaching units across campus
  const totalUnits = useMemo(() => {
    return employees.reduce((sum, e) => sum + (e.totalTeachingUnits || 0), 0);
  }, [employees]);

  // Department counts
  const departmentCounts = useMemo(() => {
    const map: Record<string, number> = {};
    employees.forEach((e) => {
      map[e.department] = (map[e.department] || 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [employees]);

  // Age distribution brackets
  const ageDistribution = useMemo(() => {
    let under30 = 0;
    let b30to39 = 0;
    let b40to49 = 0;
    let b50plus = 0;

    employees.forEach((e) => {
      if (e.age < 30) under30++;
      else if (e.age <= 39) b30to39++;
      else if (e.age <= 49) b40to49++;
      else b50plus++;
    });

    return { under30, b30to39, b40to49, b50plus };
  }, [employees]);

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-400/30 mb-3">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Academic Management & Payroll Control</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {institutionSettings.schoolName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Institutional management system for faculty and staff profiling — full legal names, residential addresses, multiple contact details, date of birth & age tracking, academic degree credentials, and automated semi-monthly payroll calculations.
          </p>

          <div className="mt-5 flex flex-wrap gap-2.5">
            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-colors"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Register New Faculty / Staff
            </button>

            <button
              onClick={() => onNavigateTab('payroll')}
              className="inline-flex items-center px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 transition-colors"
            >
              <FileText className="w-4 h-4 mr-2" />
              Process Current Pay Period
            </button>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute -right-8 -bottom-10 opacity-10 pointer-events-none text-white">
          <GraduationCap className="w-72 h-72" />
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Faculty */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Faculty & Staff
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
              {totalEmployees}
            </span>
            <span className="text-xs text-emerald-600 font-semibold">
              {activeEmployees} active on roster
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Professors, Instructors & Support Staff
          </p>
        </div>

        {/* Monthly Payroll Disbursement */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Monthly Payroll Commitment
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono">
              {formatCurrency(totalMonthlyBasePayroll, institutionSettings.currencySymbol)}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Semi-Monthly ~ {formatCurrency(totalMonthlyBasePayroll / 2, institutionSettings.currencySymbol)}
          </p>
        </div>

        {/* Average Age */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Faculty Demographics
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
              {averageAge}
            </span>
            <span className="text-xs font-semibold text-slate-600">years average age</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Recorded via Date of Birth verification
          </p>
        </div>

        {/* Teaching Load Units */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active Teaching Load
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
              {totalUnits}
            </span>
            <span className="text-xs font-semibold text-slate-600">teaching units</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Lecture, Laboratory & Overload assignments
          </p>
        </div>

      </div>

      {/* Two Column Grid: Department Breakdown & Age Brackets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Academic Departments & Load (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl shadow-xs border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Departmental Faculty Distribution
              </h2>
              <p className="text-xs text-slate-500">Staff allocation across colleges and administrative divisions</p>
            </div>
            <button
              onClick={() => onNavigateTab('directory')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center"
            >
              Directory <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>

          <div className="space-y-3 pt-1">
            {departmentCounts.map(([dept, count]) => {
              const percentage = Math.round((count / totalEmployees) * 100);
              return (
                <div key={dept} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-700 truncate max-w-xs sm:max-w-md">{dept}</span>
                    <span className="text-slate-500 font-mono">
                      {count} {count === 1 ? 'member' : 'members'} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Age Demographics & Pay Run Status (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Age Distribution Card */}
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-900">
              Age Cohort Demographics
            </h3>
            <p className="text-xs text-slate-500">Distribution of registered faculty by age range</p>

            <div className="grid grid-cols-2 gap-2.5 pt-1 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-[11px]">Under 30 years</span>
                <span className="text-lg font-bold text-slate-800 font-mono">{ageDistribution.under30}</span>
                <span className="text-[10px] text-slate-400 block">Junior Faculty</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-[11px]">30 - 39 years</span>
                <span className="text-lg font-bold text-slate-800 font-mono">{ageDistribution.b30to39}</span>
                <span className="text-[10px] text-slate-400 block">Mid-Career</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-[11px]">40 - 49 years</span>
                <span className="text-lg font-bold text-slate-800 font-mono">{ageDistribution.b40to49}</span>
                <span className="text-[10px] text-slate-400 block">Senior Faculty</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-[11px]">50+ years</span>
                <span className="text-lg font-bold text-slate-800 font-mono">{ageDistribution.b50plus}</span>
                <span className="text-[10px] text-slate-400 block">Professors & Chairs</span>
              </div>
            </div>
          </div>

          {/* Active Period Status Card */}
          <div className="bg-indigo-50/60 rounded-xl border border-indigo-200 p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">Active Pay Cycle</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                {currentPeriod.status}
              </span>
            </div>
            <h4 className="font-bold text-sm text-slate-900">{currentPeriod.title}</h4>
            <p className="text-xs text-slate-600">
              Pay Date: <strong>{currentPeriod.payDate}</strong> &bull; Coverage: {currentPeriod.startDate} to {currentPeriod.endDate}
            </p>
            <div className="pt-2">
              <button
                onClick={() => onNavigateTab('payroll')}
                className="w-full text-center py-2 px-3 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
              >
                Open Payroll Worksheet
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Recent Faculty Roster with Full Details (Address, Age, Contact) */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Faculty & Personnel Profiles
            </h2>
            <p className="text-xs text-slate-500">
              Personal information, full legal name, permanent address, contact details, and age records.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('directory')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center"
          >
            View All ({employees.length}) <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {employees.slice(0, 6).map((emp) => (
            <div
              key={emp.id}
              onClick={() => onViewEmployee(emp)}
              className="p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-xs transition-all cursor-pointer bg-white group"
            >
              <div className="flex items-start space-x-3">
                <div className={`w-10 h-10 rounded-lg ${emp.avatarColor || 'bg-indigo-600'} text-white font-bold flex items-center justify-center shrink-0`}>
                  {emp.firstName.charAt(0)}{emp.lastName.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-indigo-600 truncate">
                    {emp.fullName}
                  </h4>
                  <p className="text-[11px] text-indigo-700 font-semibold">{emp.facultyRank}</p>
                  <p className="text-[10px] text-slate-400 font-mono">{emp.employeeNumber}</p>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Age:</span>
                  <span className="font-semibold text-slate-800">{emp.age} years ({emp.birthDate})</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Address:</span>
                  <span className="text-slate-700 font-medium truncate max-w-[170px]" title={emp.streetAddress}>
                    {emp.city}, {emp.provinceState}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Contact:</span>
                  <span className="text-slate-800 font-mono text-[11px]">{emp.mobile}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Attainment:</span>
                  <span className="text-indigo-700 font-semibold text-[11px] truncate max-w-[170px]">
                    {emp.highestAttainment}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Payslips Section */}
      {payslips.length > 0 && (
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Recent Issued Payslips
              </h2>
              <p className="text-xs text-slate-500">Computed semi-monthly compensation records</p>
            </div>
            <button
              onClick={() => onNavigateTab('payslips')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center"
            >
              All Payslips ({payslips.length}) <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 font-semibold uppercase">
                <tr>
                  <th className="py-2.5 px-3">Faculty Member</th>
                  <th className="py-2.5 px-3">Period</th>
                  <th className="py-2.5 px-3 text-right">Gross Pay</th>
                  <th className="py-2.5 px-3 text-right">Deductions</th>
                  <th className="py-2.5 px-3 text-right">Net Take-Home</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payslips.slice(0, 5).map((slip) => (
                  <tr key={slip.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{slip.employeeName}</td>
                    <td className="py-2.5 px-3 text-slate-600">{slip.periodTitle}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-medium">{formatCurrency(slip.grossEarnings, institutionSettings.currencySymbol)}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-rose-700">-{formatCurrency(slip.totalDeductions, institutionSettings.currencySymbol)}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-indigo-700">{formatCurrency(slip.netPay, institutionSettings.currencySymbol)}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                        {slip.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => onViewPayslip(slip)}
                        className="inline-flex items-center text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                      >
                        <Printer className="w-3.5 h-3.5 mr-1" /> View & Print
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
