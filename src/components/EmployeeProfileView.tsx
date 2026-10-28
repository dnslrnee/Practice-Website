import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Phone, 
  Mail, 
  GraduationCap, 
  Briefcase, 
  CreditCard, 
  Award, 
  BookOpen, 
  Printer, 
  Edit3, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Employee, InstitutionSettings } from '../types';
import { formatCurrency } from '../utils/payrollCalculator';

interface EmployeeProfileViewProps {
  employee: Employee | null;
  onClose: () => void;
  onEdit: (employee: Employee) => void;
  onGeneratePayslip: (employee: Employee) => void;
  institutionSettings: InstitutionSettings;
}

export const EmployeeProfileView: React.FC<EmployeeProfileViewProps> = ({
  employee,
  onClose,
  onEdit,
  onGeneratePayslip,
  institutionSettings,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'education' | 'workload' | 'compensation'>('overview');

  if (!employee) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header with Academic Branding */}
        <div className="no-print bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <span className="font-mono text-xs uppercase bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
              {employee.employeeNumber}
            </span>
            <span className="text-xs text-slate-400">Institutional Faculty Dossier</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              title="Print Dossier"
            >
              <Printer className="w-3.5 h-3.5 mr-1" />
              Print
            </button>
            <button
              onClick={() => {
                onClose();
                onEdit(employee);
              }}
              className="inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5 mr-1" />
              Edit
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Hero Card with Profile Overview */}
        <div className="p-6 bg-linear-to-r from-slate-50 to-indigo-50/40 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-5">
            <div className={`w-16 h-16 rounded-xl ${employee.avatarColor || 'bg-indigo-600'} text-white font-bold text-xl flex items-center justify-center shadow-md shrink-0 ring-4 ring-white`}>
              {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {employee.fullName}
                </h2>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {employee.status}
                </span>
              </div>

              <p className="text-sm font-semibold text-indigo-700">
                {employee.facultyRank} &bull; <span className="text-slate-600">{employee.department}</span>
              </p>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-slate-500">
                <span className="flex items-center">
                  <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  Age: <strong className="ml-1 text-slate-700">{employee.age} yrs</strong> ({employee.birthDate})
                </span>
                <span className="flex items-center">
                  <Briefcase className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  {employee.employmentStatus}
                </span>
                <span className="flex items-center">
                  <GraduationCap className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  {employee.highestAttainment}
                </span>
              </div>
            </div>

            <div className="no-print shrink-0">
              <button
                onClick={() => {
                  onClose();
                  onGeneratePayslip(employee);
                }}
                className="inline-flex items-center px-3 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-colors"
              >
                <CreditCard className="w-4 h-4 mr-1.5" />
                Process Payslip
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="no-print bg-white border-b border-slate-200 px-6">
          <div className="flex space-x-6 text-xs sm:text-sm font-medium">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-3 border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-indigo-600 text-indigo-700 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Personal & Contact Information
            </button>
            <button
              onClick={() => setActiveTab('education')}
              className={`py-3 border-b-2 transition-colors ${
                activeTab === 'education'
                  ? 'border-indigo-600 text-indigo-700 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Academic Pedigree & Credentials
            </button>
            <button
              onClick={() => setActiveTab('workload')}
              className={`py-3 border-b-2 transition-colors ${
                activeTab === 'workload'
                  ? 'border-indigo-600 text-indigo-700 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Teaching Load & Courses
            </button>
            <button
              onClick={() => setActiveTab('compensation')}
              className={`py-3 border-b-2 transition-colors ${
                activeTab === 'compensation'
                  ? 'border-indigo-600 text-indigo-700 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Compensation & Payroll Structure
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: OVERVIEW & CONTACT/ADDRESS */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Detailed Demographics */}
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                  Civil Demographics & Identity
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 block">Full Legal Name</span>
                    <span className="font-semibold text-slate-800">{employee.fullName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Age</span>
                    <span className="font-semibold text-indigo-700 text-sm">{employee.age} years old</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Date of Birth</span>
                    <span className="font-semibold text-slate-800">{employee.birthDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Gender & Civil Status</span>
                    <span className="font-semibold text-slate-800">{employee.gender} &bull; {employee.civilStatus}</span>
                  </div>
                </div>
              </div>

              {/* Residential Address Details */}
              <div className="border border-slate-200 rounded-lg p-4 bg-white space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-indigo-600" />
                  Official Residential Address
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-1">
                  <div className="sm:col-span-2">
                    <span className="text-slate-500 block">Street / Unit / Barangay</span>
                    <span className="font-semibold text-slate-800 text-sm">{employee.streetAddress}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">City & Province</span>
                    <span className="font-semibold text-slate-800 text-sm">{employee.city}, {employee.provinceState}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Postal / ZIP Code</span>
                    <span className="font-semibold text-slate-800">{employee.postalCode || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Country</span>
                    <span className="font-semibold text-slate-800">{employee.country}</span>
                  </div>
                </div>
              </div>

              {/* Contact Lines */}
              <div className="border border-slate-200 rounded-lg p-4 bg-white space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center">
                  <Phone className="w-3.5 h-3.5 mr-1 text-indigo-600" />
                  Contact Details & Communication
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
                  <div className="flex items-center space-x-3 p-2.5 bg-slate-50 rounded-lg">
                    <Phone className="w-4 h-4 text-indigo-600 shrink-0" />
                    <div>
                      <span className="text-slate-500 block text-[11px]">Primary Mobile</span>
                      <span className="font-semibold text-slate-900">{employee.mobile || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-2.5 bg-slate-50 rounded-lg">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <div>
                      <span className="text-slate-500 block text-[11px]">Landline / Extension</span>
                      <span className="font-semibold text-slate-900">{employee.phone || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-2.5 bg-slate-50 rounded-lg">
                    <Mail className="w-4 h-4 text-indigo-600 shrink-0" />
                    <div className="truncate">
                      <span className="text-slate-500 block text-[11px]">Institutional Email</span>
                      <span className="font-semibold text-indigo-700 truncate">{employee.email}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-2.5 bg-slate-50 rounded-lg">
                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                    <div className="truncate">
                      <span className="text-slate-500 block text-[11px]">Personal Email</span>
                      <span className="font-semibold text-slate-700 truncate">{employee.personalEmail || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Emergency Contact Protocol
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block">Contact Name</span>
                    <span className="font-semibold text-slate-800">{employee.emergencyContact.name || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Relationship</span>
                    <span className="font-semibold text-slate-800">{employee.emergencyContact.relationship || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Emergency Phone</span>
                    <span className="font-semibold text-slate-800">{employee.emergencyContact.phone || 'N/A'}</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: EDUCATION & CREDENTIALS */}
          {activeTab === 'education' && (
            <div className="space-y-6">
              
              {/* Specialization & Interests */}
              <div className="bg-indigo-50/60 rounded-lg p-4 border border-indigo-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900 mb-1">
                  Academic Specialization & Scholarly Focus
                </h4>
                <p className="text-sm text-indigo-950 font-medium">
                  {employee.specialization || 'General Educational Instruction'}
                </p>
                {employee.researchInterests && employee.researchInterests.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {employee.researchInterests.map((r, i) => (
                      <span key={i} className="text-xs bg-white text-indigo-800 px-2 py-0.5 rounded border border-indigo-200 font-medium">
                        {r}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Earned Degrees */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center">
                  <Award className="w-3.5 h-3.5 mr-1 text-indigo-600" />
                  Earned Academic Degrees
                </h3>
                <div className="space-y-3">
                  {employee.degrees.map((deg, i) => (
                    <div key={deg.id || i} className="p-3.5 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <span className="text-xs font-bold text-indigo-700 block">{deg.level}</span>
                          <h4 className="text-sm font-bold text-slate-900">{deg.degreeName}</h4>
                          <p className="text-xs text-slate-600">
                            Major in <strong>{deg.major}</strong> &bull; {deg.institution}
                          </p>
                        </div>
                        <div className="mt-1 sm:mt-0 text-left sm:text-right">
                          <span className="text-xs font-mono font-semibold text-slate-700 block">Class of {deg.graduationYear}</span>
                          {deg.honors && (
                            <span className="text-xs text-amber-700 font-medium italic">{deg.honors}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Professional Licenses */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center">
                  <BookOpen className="w-3.5 h-3.5 mr-1 text-indigo-600" />
                  Professional Licenses & Board Certifications
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {employee.licensesCertifications.map((lic, i) => (
                    <div key={i} className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-medium text-slate-800 flex items-center">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2 shrink-0"></div>
                      <span>{lic}</span>
                    </div>
                  ))}
                  {employee.licensesCertifications.length === 0 && (
                    <p className="text-xs text-slate-400 italic">No board licenses or certifications listed.</p>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: WORKLOAD & COURSES */}
          {activeTab === 'workload' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500 block">Total Teaching Units</span>
                  <span className="text-lg font-bold text-indigo-700">{employee.totalTeachingUnits} units</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Weekly Contact Hours</span>
                  <span className="text-lg font-bold text-slate-800">{employee.weeklyTeachingHours} hrs/wk</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Courses Assigned</span>
                  <span className="text-lg font-bold text-slate-800">{employee.assignedSubjects.length} courses</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Tenure Date</span>
                  <span className="text-sm font-semibold text-slate-800">{employee.dateHired}</span>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                  Current Term Course Schedule
                </h3>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">Course Code</th>
                        <th className="py-2.5 px-3">Course Title</th>
                        <th className="py-2.5 px-3">Units</th>
                        <th className="py-2.5 px-3">Hours/Wk</th>
                        <th className="py-2.5 px-3">Section</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {employee.assignedSubjects.map((sub, i) => (
                        <tr key={sub.id || i} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-mono font-bold text-indigo-700">{sub.code}</td>
                          <td className="py-2.5 px-3 font-medium text-slate-800">{sub.title}</td>
                          <td className="py-2.5 px-3">{sub.units}</td>
                          <td className="py-2.5 px-3">{sub.hoursPerWeek} hrs</td>
                          <td className="py-2.5 px-3 font-semibold text-slate-600">{sub.section}</td>
                        </tr>
                      ))}
                      {employee.assignedSubjects.length === 0 && (
                        <tr>
                          <td colSpan={5} className="py-4 text-center text-slate-400 italic">
                            No courses assigned for this semester.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {employee.notes && (
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                  <span className="font-bold text-slate-700 block mb-0.5">Academic Dean / HR Remarks:</span>
                  <p className="text-slate-600">{employee.notes}</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: COMPENSATION & PAYROLL */}
          {activeTab === 'compensation' && (
            <div className="space-y-6">
              
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-indigo-50/50 border border-indigo-200">
                  <span className="text-xs font-semibold text-indigo-900 block mb-1">Base Monthly Pay</span>
                  <span className="text-xl font-extrabold text-indigo-700 font-mono">
                    {formatCurrency(employee.baseMonthlySalary, institutionSettings.currencySymbol)}
                  </span>
                  <span className="text-[11px] text-indigo-900 block mt-1">Semi-Monthly: {formatCurrency(employee.baseMonthlySalary / 2, institutionSettings.currencySymbol)}</span>
                </div>

                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-xs font-semibold text-slate-600 block mb-1">Hourly Teaching Rate</span>
                  <span className="text-xl font-extrabold text-slate-800 font-mono">
                    {formatCurrency(employee.hourlyTeachingRate, institutionSettings.currencySymbol)}/hr
                  </span>
                  <span className="text-[11px] text-slate-500 block mt-1">Overload: {formatCurrency(employee.overloadRatePerHour, institutionSettings.currencySymbol)}/hr</span>
                </div>

                <div className="p-4 rounded-lg bg-emerald-50/50 border border-emerald-200">
                  <span className="text-xs font-semibold text-emerald-900 block mb-1">Total Monthly Allowances</span>
                  <span className="text-xl font-extrabold text-emerald-700 font-mono">
                    {formatCurrency(
                      (employee.allowances.chalkInstructional || 0) +
                      (employee.allowances.advisoryHomeroom || 0) +
                      (employee.allowances.researchPublication || 0) +
                      (employee.allowances.transportationRice || 0) +
                      (employee.allowances.otherAllowance || 0),
                      institutionSettings.currencySymbol
                    )}
                  </span>
                  <span className="text-[11px] text-emerald-800 block mt-1">Instructional, research & advisory</span>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                
                {/* Allowances */}
                <div className="border border-slate-200 rounded-lg p-4 bg-white">
                  <h4 className="font-bold uppercase tracking-wider text-slate-700 mb-3">Itemized Allowances</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-600">Chalk & Instructional Supplies</span>
                      <span className="font-mono font-medium">{formatCurrency(employee.allowances.chalkInstructional, institutionSettings.currencySymbol)}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-600">Section Advisory / Homeroom</span>
                      <span className="font-mono font-medium">{formatCurrency(employee.allowances.advisoryHomeroom, institutionSettings.currencySymbol)}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-600">Research & Publication Grant</span>
                      <span className="font-mono font-medium">{formatCurrency(employee.allowances.researchPublication, institutionSettings.currencySymbol)}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-600">Rice & Transportation Subsidy</span>
                      <span className="font-mono font-medium">{formatCurrency(employee.allowances.transportationRice, institutionSettings.currencySymbol)}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-600">Special Administrative Honorarium</span>
                      <span className="font-mono font-medium">{formatCurrency(employee.allowances.otherAllowance, institutionSettings.currencySymbol)}</span>
                    </div>
                  </div>
                </div>

                {/* Deductions & Bank */}
                <div className="space-y-4">
                  <div className="border border-slate-200 rounded-lg p-4 bg-white">
                    <h4 className="font-bold uppercase tracking-wider text-slate-700 mb-3">Monthly Statutory & Loan Amortizations</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-600">SSS / GSIS Pension</span>
                        <span className="font-mono font-medium text-rose-700">-{formatCurrency(employee.statutoryDeductions.sssGsis, institutionSettings.currencySymbol)}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-600">PhilHealth Insurance</span>
                        <span className="font-mono font-medium text-rose-700">-{formatCurrency(employee.statutoryDeductions.philHealth, institutionSettings.currencySymbol)}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-600">Pag-IBIG / Provident Fund</span>
                        <span className="font-mono font-medium text-rose-700">-{formatCurrency(employee.statutoryDeductions.pagIbigProvident, institutionSettings.currencySymbol)}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-slate-600">Monthly Faculty Loan</span>
                        <span className="font-mono font-medium text-rose-700">-{formatCurrency(employee.loanMonthlyDeduction, institutionSettings.currencySymbol)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                    <h4 className="font-bold uppercase tracking-wider text-slate-700 mb-2">Disbursement Bank Account</h4>
                    <p className="text-slate-800 font-semibold">{employee.bankDetails.bankName}</p>
                    <p className="text-slate-600 font-mono text-sm">{employee.bankDetails.accountNumber || 'Account number not configured'}</p>
                    <span className="text-[11px] text-slate-500 block mt-1">Disbursement Mode: {employee.bankDetails.disbursementMethod}</span>
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="no-print px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-800 text-white hover:bg-slate-700 transition-colors"
          >
            Close Dossier
          </button>
        </div>

      </div>
    </div>
  );
};
