import React, { useState, useEffect } from 'react';
import { 
  Employee, 
  PayrollPeriod, 
  Payslip, 
  InstitutionSettings 
} from './types';
import { 
  INITIAL_EMPLOYEES, 
  INITIAL_PAYROLL_PERIODS, 
  INITIAL_INSTITUTION_SETTINGS 
} from './data/mockData';
import { generateEmployeePayslip } from './utils/payrollCalculator';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { EmployeeDirectory } from './components/EmployeeDirectory';
import { EmployeeModal } from './components/EmployeeModal';
import { EmployeeProfileView } from './components/EmployeeProfileView';
import { PayrollManager } from './components/PayrollManager';
import { PayslipsList } from './components/PayslipsList';
import { PayslipViewerModal } from './components/PayslipViewerModal';
import { SalaryEstimator } from './components/SalaryEstimator';

const STORAGE_KEYS = {
  EMPLOYEES: 'educore_faculty_staff_v1',
  PERIODS: 'educore_payroll_periods_v1',
  PAYSLIPS: 'educore_payroll_slips_v1',
  SETTINGS: 'educore_institution_settings_v1',
};

export default function App() {
  // Navigation
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'directory' | 'payroll' | 'payslips' | 'estimator'>('dashboard');

  // Institution Settings
  const [institutionSettings, setInstitutionSettings] = useState<InstitutionSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved ? JSON.parse(saved) : INITIAL_INSTITUTION_SETTINGS;
    } catch {
      return INITIAL_INSTITUTION_SETTINGS;
    }
  });

  // Employees Roster
  const [employees, setEmployees] = useState<Employee[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EMPLOYEES);
      return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
    } catch {
      return INITIAL_EMPLOYEES;
    }
  });

  // Payroll Periods
  const [payrollPeriods, setPayrollPeriods] = useState<PayrollPeriod[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PERIODS);
      return saved ? JSON.parse(saved) : INITIAL_PAYROLL_PERIODS;
    } catch {
      return INITIAL_PAYROLL_PERIODS;
    }
  });

  // Currently Selected Period
  const [currentPeriod, setCurrentPeriod] = useState<PayrollPeriod>(() => {
    return payrollPeriods[0] || INITIAL_PAYROLL_PERIODS[0];
  });

  // Payslips Archive
  const [payslips, setPayslips] = useState<Payslip[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PAYSLIPS);
      if (saved) return JSON.parse(saved);
      // Generate default sample payslips for the initial approved period
      const initialPeriod = INITIAL_PAYROLL_PERIODS[0];
      return INITIAL_EMPLOYEES.map((emp) =>
        generateEmployeePayslip(emp, initialPeriod, {
          overloadHours: emp.assignedSubjects.length > 2 ? 4 : 0,
        })
      );
    } catch {
      return [];
    }
  });

  // Modals State
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [viewingEmployee, setViewingEmployee] = useState<Employee | null>(null);
  const [viewingPayslip, setViewingPayslip] = useState<Payslip | null>(null);

  // Toast / Notification banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Persist to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PERIODS, JSON.stringify(payrollPeriods));
  }, [payrollPeriods]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PAYSLIPS, JSON.stringify(payslips));
  }, [payslips]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(institutionSettings));
  }, [institutionSettings]);

  // Handlers
  const handleSaveEmployee = (emp: Employee) => {
    setEmployees((prev) => {
      const exists = prev.some((e) => e.id === emp.id);
      if (exists) {
        showToast(`Updated academic record for ${emp.fullName}`);
        return prev.map((e) => (e.id === emp.id ? emp : e));
      } else {
        showToast(`Registered new faculty member: ${emp.fullName}`);
        return [emp, ...prev];
      }
    });
    setIsEmployeeModalOpen(false);
    setEditingEmployee(null);
  };

  const handleDeleteEmployee = (id: string) => {
    const target = employees.find((e) => e.id === id);
    setEmployees((prev) => prev.filter((e) => e.id !== id));
    showToast(`Removed ${target?.fullName || 'employee'} from institution roster`);
  };

  const handleCreatePeriod = (period: PayrollPeriod) => {
    setPayrollPeriods((prev) => [period, ...prev]);
    setCurrentPeriod(period);
    showToast(`Created pay period: ${period.title}`);
  };

  const handleUpdatePeriodStatus = (periodId: string, status: PayrollPeriod['status']) => {
    setPayrollPeriods((prev) =>
      prev.map((p) => (p.id === periodId ? { ...p, status } : p))
    );
    if (currentPeriod.id === periodId) {
      setCurrentPeriod((prev) => ({ ...prev, status }));
    }
    showToast(`Period status updated to: ${status}`);
  };

  const handleSaveBatchPayslips = (slipsToSave: Payslip[]) => {
    setPayslips((prev) => {
      // Filter out existing for this period & merge new
      const currentPeriodId = slipsToSave[0]?.periodId;
      const filtered = prev.filter((p) => p.periodId !== currentPeriodId);
      return [...slipsToSave, ...filtered];
    });
    showToast(`Successfully processed and saved ${slipsToSave.length} payslips.`);
  };

  // Quick single payslip generator trigger
  const handleQuickPayslip = (emp: Employee) => {
    const slip = generateEmployeePayslip(emp, currentPeriod);
    setViewingPayslip(slip);
  };

  // Reset demo data
  const handleResetData = () => {
    if (window.confirm('Reset all faculty profiles, pay periods, and payslips to institutional demo defaults?')) {
      setEmployees(INITIAL_EMPLOYEES);
      setPayrollPeriods(INITIAL_PAYROLL_PERIODS);
      setCurrentPeriod(INITIAL_PAYROLL_PERIODS[0]);
      const initialPeriod = INITIAL_PAYROLL_PERIODS[0];
      const defaultSlips = INITIAL_EMPLOYEES.map((emp) =>
        generateEmployeePayslip(emp, initialPeriod, {
          overloadHours: emp.assignedSubjects.length > 2 ? 4 : 0,
        })
      );
      setPayslips(defaultSlips);
      setInstitutionSettings(INITIAL_INSTITUTION_SETTINGS);
      showToast('System data reset to initial academic defaults.');
    }
  };

  // Export full JSON backup
  const handleExportData = () => {
    const exportBundle = {
      institutionSettings,
      employees,
      payrollPeriods,
      payslips,
      exportedAt: new Date().toISOString(),
      version: '1.0.0',
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportBundle, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', `EduCore_Backup_${new Date().toISOString().slice(0, 10)}.json`);
    dlAnchorElem.click();
    showToast('Downloaded institutional JSON backup');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="no-print fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-lg shadow-xl border border-slate-700 animate-in fade-in slide-in-from-bottom-3 duration-200 flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Primary Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenAddModal={() => {
          setEditingEmployee(null);
          setIsEmployeeModalOpen(true);
        }}
        onResetData={handleResetData}
        onExportData={handleExportData}
        institutionSettings={institutionSettings}
        facultyCount={employees.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {currentTab === 'dashboard' && (
          <Dashboard
            employees={employees}
            payrollPeriods={payrollPeriods}
            currentPeriod={currentPeriod}
            payslips={payslips}
            onNavigateTab={setCurrentTab}
            onOpenAddModal={() => {
              setEditingEmployee(null);
              setIsEmployeeModalOpen(true);
            }}
            onViewEmployee={(emp) => setViewingEmployee(emp)}
            onViewPayslip={(slip) => setViewingPayslip(slip)}
            institutionSettings={institutionSettings}
          />
        )}

        {currentTab === 'directory' && (
          <EmployeeDirectory
            employees={employees}
            onAddEmployee={() => {
              setEditingEmployee(null);
              setIsEmployeeModalOpen(true);
            }}
            onEditEmployee={(emp) => {
              setEditingEmployee(emp);
              setIsEmployeeModalOpen(true);
            }}
            onViewEmployee={(emp) => setViewingEmployee(emp)}
            onDeleteEmployee={handleDeleteEmployee}
            onGeneratePayslip={handleQuickPayslip}
            institutionSettings={institutionSettings}
          />
        )}

        {currentTab === 'payroll' && (
          <PayrollManager
            employees={employees}
            payrollPeriods={payrollPeriods}
            currentPeriod={currentPeriod}
            onSelectPeriod={(p) => setCurrentPeriod(p)}
            onCreatePeriod={handleCreatePeriod}
            onUpdatePeriodStatus={handleUpdatePeriodStatus}
            payslips={payslips}
            onSavePayslips={handleSaveBatchPayslips}
            onViewPayslip={(slip) => setViewingPayslip(slip)}
            institutionSettings={institutionSettings}
          />
        )}

        {currentTab === 'payslips' && (
          <PayslipsList
            payslips={payslips}
            payrollPeriods={payrollPeriods}
            onViewPayslip={(slip) => setViewingPayslip(slip)}
            institutionSettings={institutionSettings}
          />
        )}

        {currentTab === 'estimator' && (
          <SalaryEstimator
            institutionSettings={institutionSettings}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="no-print bg-white border-t border-slate-200 py-4 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            {institutionSettings.schoolName} &bull; Faculty & Staff Information and Automated Educational Payroll System
          </span>
          <span className="font-mono text-slate-400">
            Current Academic Session &bull; 2026-2027
          </span>
        </div>
      </footer>

      {/* Add / Edit Employee Modal */}
      <EmployeeModal
        isOpen={isEmployeeModalOpen}
        onClose={() => {
          setIsEmployeeModalOpen(false);
          setEditingEmployee(null);
        }}
        onSave={handleSaveEmployee}
        editingEmployee={editingEmployee}
      />

      {/* Detailed Faculty Profile Modal */}
      <EmployeeProfileView
        employee={viewingEmployee}
        onClose={() => setViewingEmployee(null)}
        onEdit={(emp) => {
          setViewingEmployee(null);
          setEditingEmployee(emp);
          setIsEmployeeModalOpen(true);
        }}
        onGeneratePayslip={handleQuickPayslip}
        institutionSettings={institutionSettings}
      />

      {/* Official Payslip Printable Viewer Modal */}
      <PayslipViewerModal
        payslip={viewingPayslip}
        onClose={() => setViewingPayslip(null)}
        institutionSettings={institutionSettings}
      />

    </div>
  );
}
