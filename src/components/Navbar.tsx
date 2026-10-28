import React from 'react';
import { 
  GraduationCap, 
  Users, 
  WalletCards, 
  FileText, 
  Calculator, 
  PlusCircle, 
  RotateCcw,
  Download,
  Building2
} from 'lucide-react';
import { InstitutionSettings } from '../types';

interface NavbarProps {
  currentTab: 'dashboard' | 'directory' | 'payroll' | 'payslips' | 'estimator';
  setCurrentTab: (tab: 'dashboard' | 'directory' | 'payroll' | 'payslips' | 'estimator') => void;
  onOpenAddModal: () => void;
  onResetData: () => void;
  onExportData: () => void;
  institutionSettings: InstitutionSettings;
  facultyCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenAddModal,
  onResetData,
  onExportData,
  institutionSettings,
  facultyCount,
}) => {
  return (
    <header className="no-print bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30 shadow-md">
      {/* Top institution bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Institution */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm ring-2 ring-indigo-400/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-white">EduCore</span>
                <span className="text-xs uppercase font-semibold tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                  Academic Portal
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium truncate max-w-xs sm:max-w-md">
                {institutionSettings.schoolName}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              title="Add New Faculty or Staff Member"
            >
              <PlusCircle className="w-4 h-4 mr-1.5" />
              <span>Add Staff / Faculty</span>
            </button>

            <button
              onClick={onExportData}
              className="hidden md:inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 transition-colors"
              title="Backup data to JSON"
            >
              <Download className="w-3.5 h-3.5 mr-1" />
              <span>Backup</span>
            </button>

            <button
              onClick={onResetData}
              className="inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-amber-300 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 transition-colors"
              title="Reset to initial demo data"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              <span className="hidden sm:inline">Reset Demo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main navigation tabs */}
      <div className="bg-slate-900/90 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto py-2 no-scrollbar">
            <button
              onClick={() => setCurrentTab('dashboard')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                currentTab === 'dashboard'
                  ? 'bg-slate-800 text-white shadow-inner font-semibold border-b-2 border-indigo-500'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setCurrentTab('directory')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                currentTab === 'directory'
                  ? 'bg-slate-800 text-white shadow-inner font-semibold border-b-2 border-indigo-500'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Faculty & Staff Directory</span>
              <span className="ml-1 text-[11px] px-1.5 py-0.2 rounded-full bg-slate-700 text-slate-300">
                {facultyCount}
              </span>
            </button>

            <button
              onClick={() => setCurrentTab('payroll')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                currentTab === 'payroll'
                  ? 'bg-slate-800 text-white shadow-inner font-semibold border-b-2 border-indigo-500'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <WalletCards className="w-4 h-4" />
              <span>Payroll Processing</span>
            </button>

            <button
              onClick={() => setCurrentTab('payslips')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                currentTab === 'payslips'
                  ? 'bg-slate-800 text-white shadow-inner font-semibold border-b-2 border-indigo-500'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Official Payslips</span>
            </button>

            <button
              onClick={() => setCurrentTab('estimator')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                currentTab === 'estimator'
                  ? 'bg-slate-800 text-white shadow-inner font-semibold border-b-2 border-indigo-500'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Calculator className="w-4 h-4" />
              <span>Salary & Tax Calculator</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
