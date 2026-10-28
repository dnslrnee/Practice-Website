import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  FileText, 
  LayoutGrid, 
  List, 
  Download, 
  UserPlus, 
  Phone, 
  Mail, 
  MapPin, 
  GraduationCap, 
  Briefcase,
  Calendar
} from 'lucide-react';
import { Employee, DepartmentName, FacultyRank, InstitutionSettings } from '../types';
import { formatCurrency } from '../utils/payrollCalculator';

interface EmployeeDirectoryProps {
  employees: Employee[];
  onAddEmployee: () => void;
  onEditEmployee: (employee: Employee) => void;
  onViewEmployee: (employee: Employee) => void;
  onDeleteEmployee: (employeeId: string) => void;
  onGeneratePayslip: (employee: Employee) => void;
  institutionSettings: InstitutionSettings;
}

export const EmployeeDirectory: React.FC<EmployeeDirectoryProps> = ({
  employees,
  onAddEmployee,
  onEditEmployee,
  onViewEmployee,
  onDeleteEmployee,
  onGeneratePayslip,
  institutionSettings,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('ALL');
  const [rankFilter, setRankFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Filtered employees
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        emp.fullName.toLowerCase().includes(q) ||
        emp.firstName.toLowerCase().includes(q) ||
        emp.lastName.toLowerCase().includes(q) ||
        emp.employeeNumber.toLowerCase().includes(q) ||
        emp.email.toLowerCase().includes(q) ||
        emp.mobile.includes(q) ||
        emp.city.toLowerCase().includes(q) ||
        emp.streetAddress.toLowerCase().includes(q) ||
        emp.specialization.toLowerCase().includes(q) ||
        emp.highestAttainment.toLowerCase().includes(q);

      const matchesDept = departmentFilter === 'ALL' || emp.department === departmentFilter;
      const matchesRank = rankFilter === 'ALL' || emp.facultyRank === rankFilter;
      const matchesStatus = statusFilter === 'ALL' || emp.status === statusFilter;

      return matchesSearch && matchesDept && matchesRank && matchesStatus;
    });
  }, [employees, searchQuery, departmentFilter, rankFilter, statusFilter]);

  // Unique departments for filter
  const departments = useMemo(() => {
    const set = new Set(employees.map((e) => e.department));
    return Array.from(set);
  }, [employees]);

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'Employee Number',
      'Full Name',
      'Age',
      'Date of Birth',
      'Gender',
      'Civil Status',
      'Mobile Phone',
      'Institutional Email',
      'Street Address',
      'City',
      'Province/State',
      'Highest Attainment',
      'Specialization',
      'Faculty Rank',
      'Department',
      'Employment Status',
      'Date Hired',
      'Teaching Units',
      'Base Monthly Salary',
      'Disbursement Bank',
      'Bank Account Number'
    ];

    const rows = filteredEmployees.map((e) => [
      `"${e.employeeNumber}"`,
      `"${e.fullName}"`,
      e.age,
      `"${e.birthDate}"`,
      `"${e.gender}"`,
      `"${e.civilStatus}"`,
      `"${e.mobile}"`,
      `"${e.email}"`,
      `"${e.streetAddress}"`,
      `"${e.city}"`,
      `"${e.provinceState}"`,
      `"${e.highestAttainment}"`,
      `"${e.specialization}"`,
      `"${e.facultyRank}"`,
      `"${e.department}"`,
      `"${e.employmentStatus}"`,
      `"${e.dateHired}"`,
      e.totalTeachingUnits,
      e.baseMonthlySalary,
      `"${e.bankDetails.bankName}"`,
      `"${e.bankDetails.accountNumber}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `EduCore_Faculty_Records_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Page Title & Actions Header */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Faculty & Academic Personnel Directory
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Manage complete educational profiles, personal information (address, age, contacts), academic load, and payroll settings.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center px-3 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors"
              title="Export filtered records to spreadsheet CSV"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={onAddEmployee}
              className="inline-flex items-center px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-colors"
            >
              <UserPlus className="w-4 h-4 mr-1.5" />
              <span>Add Staff / Faculty</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          
          {/* Search Box */}
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by full name, ID, phone, email, address, or degree..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Department Filter */}
          <div className="sm:col-span-3">
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full py-1.5 px-2.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">All Departments ({employees.length})</option>
              {departments.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="sm:col-span-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-1.5 px-2.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">All Status</option>
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Sabbatical">Sabbatical</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* View Toggle */}
          <div className="sm:col-span-2 flex items-center justify-end space-x-1">
            <span className="text-xs text-slate-500 mr-2">
              Showing <strong>{filteredEmployees.length}</strong> of {employees.length}
            </span>
            <div className="bg-slate-100 p-0.5 rounded-lg border border-slate-200 flex">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1 rounded ${viewMode === 'table' ? 'bg-white shadow-xs text-indigo-700' : 'text-slate-500 hover:text-slate-800'}`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`p-1 rounded ${viewMode === 'cards' ? 'bg-white shadow-xs text-indigo-700' : 'text-slate-500 hover:text-slate-800'}`}
                title="Card Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Main Content: Table or Cards */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Faculty Member & Age</th>
                  <th className="py-3 px-4">ID & Department</th>
                  <th className="py-3 px-4">Address & Location</th>
                  <th className="py-3 px-4">Contact Info</th>
                  <th className="py-3 px-4">Highest Degree</th>
                  <th className="py-3 px-4 text-right">Base Salary</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                    
                    {/* Name & Age */}
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-9 h-9 rounded-lg ${emp.avatarColor || 'bg-indigo-600'} text-white font-bold flex items-center justify-center shrink-0`}>
                          {emp.firstName.charAt(0)}{emp.lastName.charAt(0)}
                        </div>
                        <div>
                          <button
                            onClick={() => onViewEmployee(emp)}
                            className="font-bold text-slate-900 hover:text-indigo-600 text-sm block text-left"
                          >
                            {emp.fullName}
                          </button>
                          <div className="flex items-center space-x-2 text-[11px] text-slate-500">
                            <span><strong>{emp.age} yrs old</strong> ({emp.gender})</span>
                            <span>&bull;</span>
                            <span>{emp.facultyRank}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* ID & Department */}
                    <td className="py-3 px-4">
                      <span className="font-mono text-xs font-semibold text-slate-700 block">
                        {emp.employeeNumber}
                      </span>
                      <span className="text-[11px] text-slate-500 block truncate max-w-[200px]" title={emp.department}>
                        {emp.department}
                      </span>
                      <span className="text-[10px] text-indigo-600 font-medium">
                        {emp.totalTeachingUnits} units &bull; {emp.employmentStatus}
                      </span>
                    </td>

                    {/* Address */}
                    <td className="py-3 px-4">
                      <div className="flex items-start space-x-1 text-slate-700 max-w-[220px]">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-medium block truncate" title={emp.streetAddress}>
                            {emp.streetAddress}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            {emp.city}, {emp.provinceState}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Contact Info */}
                    <td className="py-3 px-4">
                      <div className="space-y-0.5 text-slate-700">
                        <div className="flex items-center space-x-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span className="font-medium text-[11px]">{emp.mobile}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Mail className="w-3 h-3 text-indigo-500" />
                          <span className="text-[11px] text-indigo-700 truncate max-w-[150px]" title={emp.email}>
                            {emp.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Highest Degree */}
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200">
                        {emp.highestAttainment}
                      </span>
                      <span className="text-[11px] text-slate-500 block truncate max-w-[180px] mt-0.5" title={emp.specialization}>
                        {emp.specialization || 'General Faculty'}
                      </span>
                    </td>

                    {/* Base Salary */}
                    <td className="py-3 px-4 text-right">
                      <span className="font-mono font-bold text-slate-900 text-sm block">
                        {formatCurrency(emp.baseMonthlySalary, institutionSettings.currencySymbol)}
                      </span>
                      <span className="text-[10px] text-slate-500">Monthly Base</span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${
                        emp.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : emp.status === 'On Leave'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-800'
                      }`}>
                        {emp.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          onClick={() => onViewEmployee(emp)}
                          className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded transition-colors"
                          title="View Full Academic Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onGeneratePayslip(emp)}
                          className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-slate-100 rounded transition-colors"
                          title="Generate Payslip"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEditEmployee(emp)}
                          className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded transition-colors"
                          title="Edit Information"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to remove ${emp.fullName} from the educational personnel directory?`)) {
                              onDeleteEmployee(emp.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                          title="Delete Faculty Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}

                {filteredEmployees.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      <UserPlus className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                      <p className="text-sm font-semibold text-slate-700">No faculty members found</p>
                      <p className="text-xs text-slate-400 mt-1">Try adjusting your search criteria or register a new faculty member.</p>
                      <button
                        onClick={onAddEmployee}
                        className="mt-3 inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded bg-indigo-600 text-white"
                      >
                        <Plus className="w-3.5 h-3.5 mr-1" />
                        Add New Faculty Member
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Card Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEmployees.map((emp) => (
            <div
              key={emp.id}
              className="bg-white rounded-xl shadow-xs border border-slate-200 p-4 hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-11 h-11 rounded-xl ${emp.avatarColor || 'bg-indigo-600'} text-white font-bold flex items-center justify-center shrink-0 shadow-xs`}>
                      {emp.firstName.charAt(0)}{emp.lastName.charAt(0)}
                    </div>
                    <div>
                      <h3
                        onClick={() => onViewEmployee(emp)}
                        className="font-bold text-slate-900 hover:text-indigo-600 cursor-pointer text-sm leading-tight"
                      >
                        {emp.fullName}
                      </h3>
                      <p className="text-xs text-indigo-700 font-semibold mt-0.5">{emp.facultyRank}</p>
                      <p className="text-[11px] text-slate-500 font-mono">{emp.employeeNumber}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                    emp.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {emp.status}
                  </span>
                </div>

                {/* Details Pill/Data */}
                <div className="mt-3.5 pt-3 border-t border-slate-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" /> Age & DOB:
                    </span>
                    <strong className="text-slate-800">{emp.age} yrs ({emp.birthDate})</strong>
                  </div>

                  <div className="flex items-start space-x-1.5 text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span className="truncate" title={emp.streetAddress}>
                      {emp.streetAddress}, {emp.city}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1.5 text-slate-600">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-mono text-slate-800">{emp.mobile}</span>
                  </div>

                  <div className="flex items-center space-x-1.5 text-slate-600">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate text-indigo-600" title={emp.email}>{emp.email}</span>
                  </div>

                  <div className="flex items-center space-x-1.5 text-slate-600">
                    <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate font-medium">{emp.highestAttainment}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Monthly Base</span>
                  <span className="font-mono font-bold text-sm text-slate-900">
                    {formatCurrency(emp.baseMonthlySalary, institutionSettings.currencySymbol)}
                  </span>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => onViewEmployee(emp)}
                    className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded"
                    title="View Full Profile"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onGeneratePayslip(emp)}
                    className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-slate-100 rounded"
                    title="Generate Payslip"
                  >
                    <FileText className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onEditEmployee(emp)}
                    className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded"
                    title="Edit Profile"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete record for ${emp.fullName}?`)) {
                        onDeleteEmployee(emp.id);
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                    title="Delete Record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
