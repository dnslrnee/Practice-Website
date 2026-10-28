import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  MapPin, 
  Phone, 
  GraduationCap, 
  Briefcase, 
  DollarSign, 
  Plus, 
  Trash2, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import { 
  Employee, 
  TitlePrefix, 
  GenderType, 
  CivilStatus, 
  DegreeLevel, 
  AcademicDegree, 
  FacultyRank, 
  DepartmentName, 
  EmploymentStatus, 
  TeachingSubject 
} from '../types';
import { calculateAge } from '../utils/payrollCalculator';

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (employee: Employee) => void;
  editingEmployee?: Employee | null;
}

const TITLE_OPTIONS: TitlePrefix[] = ['Dr.', 'Prof.', 'Assoc. Prof.', 'Asst. Prof.', 'Engr.', 'Atty.', 'Mr.', 'Ms.', 'Mrs.'];
const GENDER_OPTIONS: GenderType[] = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];
const CIVIL_STATUS_OPTIONS: CivilStatus[] = ['Single', 'Married', 'Widowed', 'Separated'];
const DEGREE_LEVELS: DegreeLevel[] = [
  'Doctorate / Ph.D.',
  "Master's Degree",
  'Post-Graduate Diploma',
  "Bachelor's Degree",
  'Associate Degree',
  'High School Diploma',
];
const FACULTY_RANKS: FacultyRank[] = [
  'Full Professor',
  'Associate Professor',
  'Assistant Professor',
  'Senior Instructor',
  'Instructor III',
  'Instructor I',
  'Part-Time Lecturer',
  'Academic Program Head',
  'Department Chair',
  'Guidance Counselor',
  'Administrative Officer',
  'Laboratory Specialist',
];
const DEPARTMENTS: DepartmentName[] = [
  'College of Computer Studies & IT',
  'College of Education & Teacher Training',
  'College of Engineering & Architecture',
  'Department of Mathematics & Physical Sciences',
  'Department of Humanities & Languages',
  'School of Business & Accountancy',
  'Senior High School Academic Strand',
  'Administration, Library & Support Services',
];
const EMPLOYMENT_STATUSES: EmploymentStatus[] = [
  'Full-Time Tenured',
  'Full-Time Probationary',
  'Contractual / Fixed Term',
  'Part-Time Adjunct',
  'Visiting Lecturer',
];

const DEFAULT_AVATAR_COLORS = [
  'bg-indigo-600',
  'bg-emerald-600',
  'bg-blue-600',
  'bg-amber-600',
  'bg-purple-600',
  'bg-teal-600',
  'bg-rose-600',
  'bg-cyan-600',
];

export const EmployeeModal: React.FC<EmployeeModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingEmployee,
}) => {
  const [activeTab, setActiveTab] = useState<'personal' | 'contact_address' | 'education' | 'employment' | 'payroll'>('personal');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form State
  const [formData, setFormData] = useState<Partial<Employee>>({
    title: 'Prof.',
    firstName: '',
    middleName: '',
    lastName: '',
    suffix: '',
    birthDate: '1990-01-01',
    age: 36,
    gender: 'Female',
    civilStatus: 'Single',

    // Address
    streetAddress: '',
    city: '',
    provinceState: '',
    postalCode: '',
    country: 'Philippines',

    // Contact
    phone: '',
    mobile: '',
    email: '',
    personalEmail: '',
    emergencyContact: {
      name: '',
      relationship: 'Spouse',
      phone: '',
      address: '',
    },

    // Education
    highestAttainment: "Master's Degree",
    specialization: '',
    licensesCertifications: [],
    researchInterests: [],
    degrees: [
      {
        id: 'deg-init-1',
        level: "Bachelor's Degree",
        degreeName: 'Bachelor of Science in Education',
        major: 'General Education',
        institution: 'State University',
        graduationYear: 2012,
        honors: '',
      },
    ],

    // Employment
    employeeNumber: `FAC-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    facultyRank: 'Instructor I',
    department: 'College of Education & Teacher Training',
    employmentStatus: 'Full-Time Probationary',
    dateHired: new Date().toISOString().split('T')[0],
    status: 'Active',
    assignedSubjects: [],
    totalTeachingUnits: 0,
    weeklyTeachingHours: 0,

    // Compensation
    salaryBasis: 'Monthly',
    baseMonthlySalary: 45000,
    hourlyTeachingRate: 450,
    overloadRatePerHour: 550,
    allowances: {
      chalkInstructional: 2000,
      advisoryHomeroom: 2000,
      researchPublication: 1500,
      transportationRice: 3500,
      otherAllowance: 0,
    },
    statutoryDeductions: {
      sssGsis: 1950,
      philHealth: 1125,
      pagIbigProvident: 500,
    },
    loanMonthlyDeduction: 0,
    bankDetails: {
      bankName: 'Land Bank of the Philippines',
      accountName: '',
      accountNumber: '',
      disbursementMethod: 'Direct Bank Deposit',
    },
    notes: '',
  });

  const [newLicenseInput, setNewLicenseInput] = useState('');
  const [newResearchInput, setNewResearchInput] = useState('');

  // When editingEmployee changes or modal opens
  useEffect(() => {
    if (editingEmployee) {
      setFormData({ ...editingEmployee });
    } else {
      const randomColor = DEFAULT_AVATAR_COLORS[Math.floor(Math.random() * DEFAULT_AVATAR_COLORS.length)];
      setFormData({
        title: 'Prof.',
        firstName: '',
        middleName: '',
        lastName: '',
        suffix: '',
        birthDate: '1990-01-01',
        age: calculateAge('1990-01-01'),
        gender: 'Female',
        civilStatus: 'Single',
        streetAddress: '',
        city: 'Metro City',
        provinceState: 'Metro Manila',
        postalCode: '1100',
        country: 'Philippines',
        phone: '',
        mobile: '',
        email: '',
        personalEmail: '',
        emergencyContact: {
          name: '',
          relationship: '',
          phone: '',
          address: '',
        },
        highestAttainment: "Bachelor's Degree",
        specialization: '',
        licensesCertifications: ['Licensed Professional Teacher (LPT)'],
        researchInterests: [],
        degrees: [
          {
            id: 'deg-' + Date.now(),
            level: "Bachelor's Degree",
            degreeName: 'Bachelor of Secondary Education',
            major: 'General Science',
            institution: 'National University',
            graduationYear: 2012,
            honors: '',
          },
        ],
        employeeNumber: `FAC-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
        facultyRank: 'Instructor I',
        department: 'College of Education & Teacher Training',
        employmentStatus: 'Full-Time Probationary',
        dateHired: new Date().toISOString().split('T')[0],
        status: 'Active',
        assignedSubjects: [],
        totalTeachingUnits: 0,
        weeklyTeachingHours: 0,
        salaryBasis: 'Monthly',
        baseMonthlySalary: 42000,
        hourlyTeachingRate: 400,
        overloadRatePerHour: 500,
        allowances: {
          chalkInstructional: 2000,
          advisoryHomeroom: 1500,
          researchPublication: 1000,
          transportationRice: 3000,
          otherAllowance: 0,
        },
        statutoryDeductions: {
          sssGsis: 1850,
          philHealth: 1050,
          pagIbigProvident: 500,
        },
        loanMonthlyDeduction: 0,
        bankDetails: {
          bankName: 'Land Bank of the Philippines',
          accountName: '',
          accountNumber: '',
          disbursementMethod: 'Direct Bank Deposit',
        },
        notes: '',
        avatarColor: randomColor,
      });
    }
    setActiveTab('personal');
    setErrors({});
  }, [editingEmployee, isOpen]);

  if (!isOpen) return null;

  // Handle Birth Date change -> automatically update age
  const handleBirthDateChange = (dob: string) => {
    const computedAge = calculateAge(dob);
    setFormData((prev) => ({
      ...prev,
      birthDate: dob,
      age: computedAge,
    }));
  };

  // Handle Age change -> sync approximate birth year
  const handleAgeChange = (ageVal: number) => {
    const safeAge = Math.max(18, Math.min(100, ageVal || 18));
    const currentYear = new Date().getFullYear();
    const approxBirthYear = currentYear - safeAge;
    const currentMonthDay = formData.birthDate ? formData.birthDate.substring(4) : '-01-01';
    setFormData((prev) => ({
      ...prev,
      age: safeAge,
      birthDate: `${approxBirthYear}${currentMonthDay}`,
    }));
  };

  // Degree helpers
  const handleAddDegree = () => {
    const newDegree: AcademicDegree = {
      id: 'deg-' + Date.now(),
      level: "Bachelor's Degree",
      degreeName: '',
      major: '',
      institution: '',
      graduationYear: new Date().getFullYear(),
      honors: '',
    };
    setFormData((prev) => ({
      ...prev,
      degrees: [...(prev.degrees || []), newDegree],
    }));
  };

  const handleUpdateDegree = (index: number, field: keyof AcademicDegree, value: any) => {
    const currentDegrees = [...(formData.degrees || [])];
    currentDegrees[index] = { ...currentDegrees[index], [field]: value };
    setFormData((prev) => ({ ...prev, degrees: currentDegrees }));
  };

  const handleRemoveDegree = (index: number) => {
    const currentDegrees = [...(formData.degrees || [])];
    currentDegrees.splice(index, 1);
    setFormData((prev) => ({ ...prev, degrees: currentDegrees }));
  };

  // Subject helpers
  const handleAddSubject = () => {
    const newSubj: TeachingSubject = {
      id: 'subj-' + Date.now(),
      code: 'GEN-101',
      title: 'Course Title Here',
      units: 3,
      hoursPerWeek: 3,
      section: 'SEC-1A',
    };
    const updated = [...(formData.assignedSubjects || []), newSubj];
    const totalUnits = updated.reduce((sum, s) => sum + (Number(s.units) || 0), 0);
    const totalHours = updated.reduce((sum, s) => sum + (Number(s.hoursPerWeek) || 0), 0);
    setFormData((prev) => ({
      ...prev,
      assignedSubjects: updated,
      totalTeachingUnits: totalUnits,
      weeklyTeachingHours: totalHours,
    }));
  };

  const handleUpdateSubject = (index: number, field: keyof TeachingSubject, value: any) => {
    const currentSubjects = [...(formData.assignedSubjects || [])];
    currentSubjects[index] = { ...currentSubjects[index], [field]: value };
    const totalUnits = currentSubjects.reduce((sum, s) => sum + (Number(s.units) || 0), 0);
    const totalHours = currentSubjects.reduce((sum, s) => sum + (Number(s.hoursPerWeek) || 0), 0);
    setFormData((prev) => ({
      ...prev,
      assignedSubjects: currentSubjects,
      totalTeachingUnits: totalUnits,
      weeklyTeachingHours: totalHours,
    }));
  };

  const handleRemoveSubject = (index: number) => {
    const currentSubjects = [...(formData.assignedSubjects || [])];
    currentSubjects.splice(index, 1);
    const totalUnits = currentSubjects.reduce((sum, s) => sum + (Number(s.units) || 0), 0);
    const totalHours = currentSubjects.reduce((sum, s) => sum + (Number(s.hoursPerWeek) || 0), 0);
    setFormData((prev) => ({
      ...prev,
      assignedSubjects: currentSubjects,
      totalTeachingUnits: totalUnits,
      weeklyTeachingHours: totalHours,
    }));
  };

  // Add License / Certification
  const handleAddLicense = () => {
    if (!newLicenseInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      licensesCertifications: [...(prev.licensesCertifications || []), newLicenseInput.trim()],
    }));
    setNewLicenseInput('');
  };

  const handleRemoveLicense = (idx: number) => {
    const list = [...(formData.licensesCertifications || [])];
    list.splice(idx, 1);
    setFormData((prev) => ({ ...prev, licensesCertifications: list }));
  };

  // Validate and Save
  const handleSave = () => {
    const validationErrors: Record<string, string> = {};

    if (!formData.firstName?.trim()) validationErrors.firstName = 'First Name is required';
    if (!formData.lastName?.trim()) validationErrors.lastName = 'Last Name is required';
    if (!formData.age || formData.age < 18) validationErrors.age = 'Age must be 18 or older';
    if (!formData.streetAddress?.trim()) validationErrors.streetAddress = 'Street address is required';
    if (!formData.city?.trim()) validationErrors.city = 'City is required';
    if (!formData.mobile?.trim()) validationErrors.mobile = 'Contact mobile number is required';
    if (!formData.email?.trim()) validationErrors.email = 'Institutional email is required';

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Auto-switch to tab with error
      if (validationErrors.firstName || validationErrors.lastName || validationErrors.age) {
        setActiveTab('personal');
      } else if (validationErrors.streetAddress || validationErrors.city || validationErrors.mobile || validationErrors.email) {
        setActiveTab('contact_address');
      }
      return;
    }

    // Build Full Name
    const middleInitial = formData.middleName ? ` ${formData.middleName.charAt(0)}.` : '';
    const suffixPart = formData.suffix ? `, ${formData.suffix}` : '';
    const constructedFullName = `${formData.title} ${formData.firstName}${middleInitial} ${formData.lastName}${suffixPart}`;

    const completeEmployee: Employee = {
      id: formData.id || 'emp-' + Date.now(),
      employeeNumber: formData.employeeNumber || `FAC-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      title: formData.title as TitlePrefix,
      firstName: formData.firstName || '',
      middleName: formData.middleName || '',
      lastName: formData.lastName || '',
      suffix: formData.suffix || '',
      fullName: constructedFullName,
      age: Number(formData.age) || 30,
      birthDate: formData.birthDate || '1990-01-01',
      gender: formData.gender as GenderType,
      civilStatus: formData.civilStatus as CivilStatus,

      phone: formData.phone || '',
      mobile: formData.mobile || '',
      email: formData.email || '',
      personalEmail: formData.personalEmail || '',
      emergencyContact: {
        name: formData.emergencyContact?.name || '',
        relationship: formData.emergencyContact?.relationship || '',
        phone: formData.emergencyContact?.phone || '',
        address: formData.emergencyContact?.address || '',
      },

      streetAddress: formData.streetAddress || '',
      city: formData.city || '',
      provinceState: formData.provinceState || '',
      postalCode: formData.postalCode || '',
      country: formData.country || 'Philippines',

      highestAttainment: formData.highestAttainment as DegreeLevel,
      degrees: formData.degrees || [],
      licensesCertifications: formData.licensesCertifications || [],
      specialization: formData.specialization || '',
      researchInterests: formData.researchInterests || [],

      facultyRank: formData.facultyRank as FacultyRank,
      department: formData.department as DepartmentName,
      employmentStatus: formData.employmentStatus as EmploymentStatus,
      dateHired: formData.dateHired || new Date().toISOString().split('T')[0],
      status: formData.status || 'Active',
      assignedSubjects: formData.assignedSubjects || [],
      totalTeachingUnits: formData.totalTeachingUnits || 0,
      weeklyTeachingHours: formData.weeklyTeachingHours || 0,

      salaryBasis: formData.salaryBasis || 'Monthly',
      baseMonthlySalary: Number(formData.baseMonthlySalary) || 0,
      hourlyTeachingRate: Number(formData.hourlyTeachingRate) || 0,
      overloadRatePerHour: Number(formData.overloadRatePerHour) || 0,
      allowances: {
        chalkInstructional: Number(formData.allowances?.chalkInstructional) || 0,
        advisoryHomeroom: Number(formData.allowances?.advisoryHomeroom) || 0,
        researchPublication: Number(formData.allowances?.researchPublication) || 0,
        transportationRice: Number(formData.allowances?.transportationRice) || 0,
        otherAllowance: Number(formData.allowances?.otherAllowance) || 0,
      },
      statutoryDeductions: {
        sssGsis: Number(formData.statutoryDeductions?.sssGsis) || 0,
        philHealth: Number(formData.statutoryDeductions?.philHealth) || 0,
        pagIbigProvident: Number(formData.statutoryDeductions?.pagIbigProvident) || 0,
      },
      loanMonthlyDeduction: Number(formData.loanMonthlyDeduction) || 0,
      bankDetails: {
        bankName: formData.bankDetails?.bankName || 'Default Institution Bank',
        accountName: formData.bankDetails?.accountName || constructedFullName,
        accountNumber: formData.bankDetails?.accountNumber || '',
        disbursementMethod: formData.bankDetails?.disbursementMethod || 'Direct Bank Deposit',
      },
      notes: formData.notes || '',
      avatarColor: formData.avatarColor || 'bg-indigo-600',
    };

    onSave(completeEmployee);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">
                {editingEmployee ? 'Edit Academic Profile & Compensation' : 'Input New Faculty / Staff Record'}
              </h2>
              <p className="text-xs text-slate-400">
                Register complete personal details, contact, address, age, educational credentials, and payroll terms.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-2">
          <div className="flex space-x-2 sm:space-x-4 overflow-x-auto text-xs sm:text-sm font-medium">
            <button
              type="button"
              onClick={() => setActiveTab('personal')}
              className={`flex items-center space-x-1.5 py-2 px-3 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'personal'
                  ? 'border-indigo-600 text-indigo-700 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <User className="w-4 h-4" />
              <span>1. Personal & Age</span>
              {(errors.firstName || errors.lastName || errors.age) && (
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('contact_address')}
              className={`flex items-center space-x-1.5 py-2 px-3 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'contact_address'
                  ? 'border-indigo-600 text-indigo-700 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>2. Address & Contact</span>
              {(errors.streetAddress || errors.city || errors.mobile || errors.email) && (
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('education')}
              className={`flex items-center space-x-1.5 py-2 px-3 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'education'
                  ? 'border-indigo-600 text-indigo-700 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>3. Educational Pedigree</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('employment')}
              className={`flex items-center space-x-1.5 py-2 px-3 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'employment'
                  ? 'border-indigo-600 text-indigo-700 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>4. Appointment & Load</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('payroll')}
              className={`flex items-center space-x-1.5 py-2 px-3 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'payroll'
                  ? 'border-indigo-600 text-indigo-700 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>5. Compensation & Bank</span>
            </button>
          </div>
        </div>

        {/* Modal Body Form */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: PERSONAL & AGE */}
          {activeTab === 'personal' && (
            <div className="space-y-4">
              <div className="bg-indigo-50/60 border border-indigo-100 rounded-lg p-3.5 text-xs text-indigo-950 flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <span>
                  Please enter the employee's official full legal name, date of birth, age, and civil status for institutional records and payroll identification.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Prefix / Title</label>
                  <select
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value as TitlePrefix })}
                    className="w-full text-sm rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {TITLE_OPTIONS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-4">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    First Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maria Clara"
                    value={formData.firstName || ''}
                    onChange={(e) => {
                      setFormData({ ...formData, firstName: e.target.value });
                      if (errors.firstName) setErrors({ ...errors, firstName: '' });
                    }}
                    className={`w-full text-sm rounded-lg border px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.firstName ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                    }`}
                  />
                  {errors.firstName && <p className="text-xs text-rose-600 mt-1">{errors.firstName}</p>}
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Middle Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Santos"
                    value={formData.middleName || ''}
                    onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
                    className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Last Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Delos Reyes"
                    value={formData.lastName || ''}
                    onChange={(e) => {
                      setFormData({ ...formData, lastName: e.target.value });
                      if (errors.lastName) setErrors({ ...errors, lastName: '' });
                    }}
                    className={`w-full text-sm rounded-lg border px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.lastName ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                    }`}
                  />
                  {errors.lastName && <p className="text-xs text-rose-600 mt-1">{errors.lastName}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4">
                <div className="sm:col-span-3">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Suffix (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Jr., III, Ph.D., LPT"
                    value={formData.suffix || ''}
                    onChange={(e) => setFormData({ ...formData, suffix: e.target.value })}
                    className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Date of Birth <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.birthDate || ''}
                    onChange={(e) => handleBirthDateChange(e.target.value)}
                    className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="text-[11px] text-slate-500">Auto-syncs age</span>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Age <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="18"
                    max="100"
                    required
                    value={formData.age ?? ''}
                    onChange={(e) => handleAgeChange(parseInt(e.target.value, 10))}
                    className={`w-full text-sm rounded-lg border px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.age ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                    }`}
                  />
                  {errors.age && <p className="text-xs text-rose-600 mt-1">{errors.age}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as GenderType })}
                    className="w-full text-sm rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {GENDER_OPTIONS.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Civil Status</label>
                  <select
                    value={formData.civilStatus}
                    onChange={(e) => setFormData({ ...formData, civilStatus: e.target.value as CivilStatus })}
                    className="w-full text-sm rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {CIVIL_STATUS_OPTIONS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Full Name Preview Banner */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 block">Generated Full Institutional Name:</span>
                  <span className="text-sm font-semibold text-slate-800">
                    {formData.title} {formData.firstName || '(First)'} {formData.middleName ? `${formData.middleName.charAt(0)}.` : ''} {formData.lastName || '(Last)'} {formData.suffix}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 block">Age on Record:</span>
                  <span className="text-sm font-semibold text-indigo-700">{formData.age} years old</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ADDRESS & CONTACT DETAILS */}
          {activeTab === 'contact_address' && (
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 text-xs text-slate-700 flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <span>
                  Provide complete residential / postal address and multiple contact lines for official communications, notifications, and emergency protocols.
                </span>
              </div>

              {/* Residential Address Section */}
              <div className="border border-slate-200 rounded-lg p-4 bg-white space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-indigo-600" />
                  Residential / Permanent Address
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-6">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Street Address / House / Unit / Barangay <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Unit 302, Palm View Condominium, 12 Magnolia Street"
                      value={formData.streetAddress || ''}
                      onChange={(e) => {
                        setFormData({ ...formData, streetAddress: e.target.value });
                        if (errors.streetAddress) setErrors({ ...errors, streetAddress: '' });
                      }}
                      className={`w-full text-sm rounded-lg border px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        errors.streetAddress ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                      }`}
                    />
                    {errors.streetAddress && <p className="text-xs text-rose-600 mt-1">{errors.streetAddress}</p>}
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      City / Municipality <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Quezon City"
                      value={formData.city || ''}
                      onChange={(e) => {
                        setFormData({ ...formData, city: e.target.value });
                        if (errors.city) setErrors({ ...errors, city: '' });
                      }}
                      className={`w-full text-sm rounded-lg border px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        errors.city ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                      }`}
                    />
                    {errors.city && <p className="text-xs text-rose-600 mt-1">{errors.city}</p>}
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Province / State</label>
                    <input
                      type="text"
                      placeholder="e.g. Metro Manila / Rizal"
                      value={formData.provinceState || ''}
                      onChange={(e) => setFormData({ ...formData, provinceState: e.target.value })}
                      className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Postal / ZIP Code</label>
                    <input
                      type="text"
                      placeholder="e.g. 1100"
                      value={formData.postalCode || ''}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Country</label>
                    <input
                      type="text"
                      placeholder="Philippines"
                      value={formData.country || 'Philippines'}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Direct Contact Details */}
              <div className="border border-slate-200 rounded-lg p-4 bg-white space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center">
                  <Phone className="w-3.5 h-3.5 mr-1 text-indigo-600" />
                  Direct Contact Lines & Email
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Mobile Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +63 917 123 4567"
                      value={formData.mobile || ''}
                      onChange={(e) => {
                        setFormData({ ...formData, mobile: e.target.value });
                        if (errors.mobile) setErrors({ ...errors, mobile: '' });
                      }}
                      className={`w-full text-sm rounded-lg border px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        errors.mobile ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                      }`}
                    />
                    {errors.mobile && <p className="text-xs text-rose-600 mt-1">{errors.mobile}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Landline / Office Ext.</label>
                    <input
                      type="tel"
                      placeholder="e.g. +63 2 8920 4500 loc 102"
                      value={formData.phone || ''}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Institutional Email <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. faculty.name@institution.edu"
                      value={formData.email || ''}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (errors.email) setErrors({ ...errors, email: '' });
                      }}
                      className={`w-full text-sm rounded-lg border px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        errors.email ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                      }`}
                    />
                    {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Personal Alternate Email</label>
                    <input
                      type="email"
                      placeholder="e.g. personal.name@gmail.com"
                      value={formData.personalEmail || ''}
                      onChange={(e) => setFormData({ ...formData, personalEmail: e.target.value })}
                      className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/60 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Emergency Contact Person
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Maria Delos Reyes"
                      value={formData.emergencyContact?.name || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        emergencyContact: { ...formData.emergencyContact!, name: e.target.value }
                      })}
                      className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Relationship</label>
                    <input
                      type="text"
                      placeholder="e.g. Spouse / Parent / Sibling"
                      value={formData.emergencyContact?.relationship || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        emergencyContact: { ...formData.emergencyContact!, relationship: e.target.value }
                      })}
                      className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Emergency Phone Number</label>
                    <input
                      type="tel"
                      placeholder="e.g. +63 917 555 0000"
                      value={formData.emergencyContact?.phone || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        emergencyContact: { ...formData.emergencyContact!, phone: e.target.value }
                      })}
                      className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: EDUCATIONAL PEDIGREE */}
          {activeTab === 'education' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Academic Attainment & Degrees</h3>
                  <p className="text-xs text-slate-500">Document degrees, alma maters, majors, and professional qualifications.</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddDegree}
                  className="inline-flex items-center text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg border border-indigo-200 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Add Another Degree
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Highest Degree Attainment</label>
                  <select
                    value={formData.highestAttainment}
                    onChange={(e) => setFormData({ ...formData, highestAttainment: e.target.value as DegreeLevel })}
                    className="w-full text-sm rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {DEGREE_LEVELS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Academic Specialization</label>
                  <input
                    type="text"
                    placeholder="e.g. Distributed Computing, STEM Pedagogy"
                    value={formData.specialization || ''}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Degrees List */}
              <div className="space-y-3">
                {(formData.degrees || []).map((deg, idx) => (
                  <div key={deg.id || idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2 relative">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">Degree #{idx + 1}</span>
                      {(formData.degrees?.length || 0) > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveDegree(idx)}
                          className="text-xs text-rose-600 hover:text-rose-700 flex items-center"
                        >
                          <Trash2 className="w-3.5 h-3.5 mr-0.5" /> Remove
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                      <div className="sm:col-span-3">
                        <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Level</label>
                        <select
                          value={deg.level}
                          onChange={(e) => handleUpdateDegree(idx, 'level', e.target.value)}
                          className="w-full text-xs rounded border border-slate-300 bg-white px-2 py-1.5 text-slate-800"
                        >
                          {DEGREE_LEVELS.map((dl) => (
                            <option key={dl} value={dl}>{dl}</option>
                          ))}
                        </select>
                      </div>

                      <div className="sm:col-span-5">
                        <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Degree Title</label>
                        <input
                          type="text"
                          placeholder="e.g. Bachelor of Science in Education"
                          value={deg.degreeName}
                          onChange={(e) => handleUpdateDegree(idx, 'degreeName', e.target.value)}
                          className="w-full text-xs rounded border border-slate-300 px-2 py-1.5 text-slate-800"
                        />
                      </div>

                      <div className="sm:col-span-4">
                        <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Major / Concentration</label>
                        <input
                          type="text"
                          placeholder="e.g. Mathematics / Physics"
                          value={deg.major}
                          onChange={(e) => handleUpdateDegree(idx, 'major', e.target.value)}
                          className="w-full text-xs rounded border border-slate-300 px-2 py-1.5 text-slate-800"
                        />
                      </div>

                      <div className="sm:col-span-6">
                        <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Alma Mater / University</label>
                        <input
                          type="text"
                          placeholder="e.g. University of the Philippines"
                          value={deg.institution}
                          onChange={(e) => handleUpdateDegree(idx, 'institution', e.target.value)}
                          className="w-full text-xs rounded border border-slate-300 px-2 py-1.5 text-slate-800"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Grad Year</label>
                        <input
                          type="number"
                          placeholder="2018"
                          value={deg.graduationYear}
                          onChange={(e) => handleUpdateDegree(idx, 'graduationYear', parseInt(e.target.value, 10))}
                          className="w-full text-xs rounded border border-slate-300 px-2 py-1.5 text-slate-800"
                        />
                      </div>

                      <div className="sm:col-span-4">
                        <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Honors / Distinctions</label>
                        <input
                          type="text"
                          placeholder="e.g. Cum Laude, Valedictorian"
                          value={deg.honors || ''}
                          onChange={(e) => handleUpdateDegree(idx, 'honors', e.target.value)}
                          className="w-full text-xs rounded border border-slate-300 px-2 py-1.5 text-slate-800"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Licenses & Certifications */}
              <div className="pt-2 border-t border-slate-200">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Professional Licenses & Board Certifications (e.g., LPT, PRC, TESDA, Cisco)
                </label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    placeholder="e.g. PRC Licensed Professional Teacher #102948"
                    value={newLicenseInput}
                    onChange={(e) => setNewLicenseInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddLicense();
                      }
                    }}
                    className="flex-1 text-sm rounded-lg border border-slate-300 px-3 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddLicense}
                    className="px-3 py-1.5 text-xs font-semibold bg-slate-800 text-white rounded-lg hover:bg-slate-700"
                  >
                    Add License
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {(formData.licensesCertifications || []).map((lic, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center text-xs bg-indigo-50 text-indigo-800 border border-indigo-200 px-2.5 py-1 rounded-md"
                    >
                      {lic}
                      <button
                        type="button"
                        onClick={() => handleRemoveLicense(i)}
                        className="ml-1.5 text-indigo-500 hover:text-indigo-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {(!formData.licensesCertifications || formData.licensesCertifications.length === 0) && (
                    <span className="text-xs text-slate-400 italic">No licenses registered yet.</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: EMPLOYMENT & TEACHING LOAD */}
          {activeTab === 'employment' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Faculty / Staff ID</label>
                  <input
                    type="text"
                    placeholder="FAC-2024-001"
                    value={formData.employeeNumber || ''}
                    onChange={(e) => setFormData({ ...formData, employeeNumber: e.target.value })}
                    className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 text-slate-900 font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Faculty Rank / Designation</label>
                  <select
                    value={formData.facultyRank}
                    onChange={(e) => setFormData({ ...formData, facultyRank: e.target.value as FacultyRank })}
                    className="w-full text-sm rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {FACULTY_RANKS.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Academic Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value as DepartmentName })}
                    className="w-full text-sm rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Employment Status</label>
                  <select
                    value={formData.employmentStatus}
                    onChange={(e) => setFormData({ ...formData, employmentStatus: e.target.value as EmploymentStatus })}
                    className="w-full text-sm rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {EMPLOYMENT_STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Date Hired</label>
                  <input
                    type="date"
                    value={formData.dateHired || ''}
                    onChange={(e) => setFormData({ ...formData, dateHired: e.target.value })}
                    className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Current Active Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full text-sm rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Sabbatical">Sabbatical</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Teaching Load / Subject assignment */}
              <div className="pt-2 border-t border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Assigned Subjects & Teaching Units
                    </h3>
                    <p className="text-xs text-slate-500">
                      Total Units: <strong className="text-indigo-600">{formData.totalTeachingUnits || 0}</strong> | Total Weekly Hours: <strong className="text-indigo-600">{formData.weeklyTeachingHours || 0} hrs</strong>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddSubject}
                    className="inline-flex items-center text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg border border-indigo-200"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Assign Subject
                  </button>
                </div>

                <div className="space-y-2">
                  {(formData.assignedSubjects || []).map((sub, idx) => (
                    <div key={sub.id || idx} className="grid grid-cols-1 sm:grid-cols-12 gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200 items-center">
                      <div className="sm:col-span-2">
                        <input
                          type="text"
                          placeholder="Code (e.g. CS101)"
                          value={sub.code}
                          onChange={(e) => handleUpdateSubject(idx, 'code', e.target.value)}
                          className="w-full text-xs rounded border border-slate-300 px-2 py-1 uppercase font-semibold"
                        />
                      </div>
                      <div className="sm:col-span-5">
                        <input
                          type="text"
                          placeholder="Subject Title"
                          value={sub.title}
                          onChange={(e) => handleUpdateSubject(idx, 'title', e.target.value)}
                          className="w-full text-xs rounded border border-slate-300 px-2 py-1"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <input
                          type="number"
                          placeholder="Units"
                          value={sub.units}
                          onChange={(e) => handleUpdateSubject(idx, 'units', parseFloat(e.target.value) || 0)}
                          className="w-full text-xs rounded border border-slate-300 px-2 py-1"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <input
                          type="text"
                          placeholder="Section"
                          value={sub.section}
                          onChange={(e) => handleUpdateSubject(idx, 'section', e.target.value)}
                          className="w-full text-xs rounded border border-slate-300 px-2 py-1"
                        />
                      </div>
                      <div className="sm:col-span-1 text-right">
                        <button
                          type="button"
                          onClick={() => handleRemoveSubject(idx)}
                          className="text-rose-500 hover:text-rose-700 p-1"
                          title="Remove Course"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {(!formData.assignedSubjects || formData.assignedSubjects.length === 0) && (
                    <p className="text-xs text-slate-400 italic py-2">No active subjects assigned for this faculty member yet.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: COMPENSATION & PAYROLL */}
          {activeTab === 'payroll' && (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-900">
                Configure basic pay parameters, standard academic allowances (chalk, advisory, research grants), statutory deductions, and bank disbursement details.
              </div>

              {/* Base Salary & Rates */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Monthly Base Salary (₱)</label>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={formData.baseMonthlySalary ?? ''}
                    onChange={(e) => setFormData({ ...formData, baseMonthlySalary: parseFloat(e.target.value) || 0 })}
                    className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Hourly Teaching Rate (₱)</label>
                  <input
                    type="number"
                    min="0"
                    step="10"
                    value={formData.hourlyTeachingRate ?? ''}
                    onChange={(e) => setFormData({ ...formData, hourlyTeachingRate: parseFloat(e.target.value) || 0 })}
                    className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Overload Rate / Hour (₱)</label>
                  <input
                    type="number"
                    min="0"
                    step="10"
                    value={formData.overloadRatePerHour ?? ''}
                    onChange={(e) => setFormData({ ...formData, overloadRatePerHour: parseFloat(e.target.value) || 0 })}
                    className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Academic Allowances */}
              <div className="border border-slate-200 rounded-lg p-3.5 bg-slate-50/50 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Monthly Academic & Institutional Allowances
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Chalk / Supplies</label>
                    <input
                      type="number"
                      value={formData.allowances?.chalkInstructional ?? 0}
                      onChange={(e) => setFormData({
                        ...formData,
                        allowances: { ...formData.allowances!, chalkInstructional: parseFloat(e.target.value) || 0 }
                      })}
                      className="w-full text-xs rounded border border-slate-300 px-2 py-1.5"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Advisory / Section</label>
                    <input
                      type="number"
                      value={formData.allowances?.advisoryHomeroom ?? 0}
                      onChange={(e) => setFormData({
                        ...formData,
                        allowances: { ...formData.allowances!, advisoryHomeroom: parseFloat(e.target.value) || 0 }
                      })}
                      className="w-full text-xs rounded border border-slate-300 px-2 py-1.5"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Research Grant</label>
                    <input
                      type="number"
                      value={formData.allowances?.researchPublication ?? 0}
                      onChange={(e) => setFormData({
                        ...formData,
                        allowances: { ...formData.allowances!, researchPublication: parseFloat(e.target.value) || 0 }
                      })}
                      className="w-full text-xs rounded border border-slate-300 px-2 py-1.5"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Rice / Commute</label>
                    <input
                      type="number"
                      value={formData.allowances?.transportationRice ?? 0}
                      onChange={(e) => setFormData({
                        ...formData,
                        allowances: { ...formData.allowances!, transportationRice: parseFloat(e.target.value) || 0 }
                      })}
                      className="w-full text-xs rounded border border-slate-300 px-2 py-1.5"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Other Honorarium</label>
                    <input
                      type="number"
                      value={formData.allowances?.otherAllowance ?? 0}
                      onChange={(e) => setFormData({
                        ...formData,
                        allowances: { ...formData.allowances!, otherAllowance: parseFloat(e.target.value) || 0 }
                      })}
                      className="w-full text-xs rounded border border-slate-300 px-2 py-1.5"
                    />
                  </div>
                </div>
              </div>

              {/* Deductions & Loans */}
              <div className="border border-slate-200 rounded-lg p-3.5 bg-slate-50/50 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Monthly Statutory Deductions & Loans
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">SSS / GSIS Pension</label>
                    <input
                      type="number"
                      value={formData.statutoryDeductions?.sssGsis ?? 0}
                      onChange={(e) => setFormData({
                        ...formData,
                        statutoryDeductions: { ...formData.statutoryDeductions!, sssGsis: parseFloat(e.target.value) || 0 }
                      })}
                      className="w-full text-xs rounded border border-slate-300 px-2 py-1.5"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">PhilHealth Insurance</label>
                    <input
                      type="number"
                      value={formData.statutoryDeductions?.philHealth ?? 0}
                      onChange={(e) => setFormData({
                        ...formData,
                        statutoryDeductions: { ...formData.statutoryDeductions!, philHealth: parseFloat(e.target.value) || 0 }
                      })}
                      className="w-full text-xs rounded border border-slate-300 px-2 py-1.5"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Pag-IBIG / Provident</label>
                    <input
                      type="number"
                      value={formData.statutoryDeductions?.pagIbigProvident ?? 0}
                      onChange={(e) => setFormData({
                        ...formData,
                        statutoryDeductions: { ...formData.statutoryDeductions!, pagIbigProvident: parseFloat(e.target.value) || 0 }
                      })}
                      className="w-full text-xs rounded border border-slate-300 px-2 py-1.5"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Loan Amortization</label>
                    <input
                      type="number"
                      value={formData.loanMonthlyDeduction ?? 0}
                      onChange={(e) => setFormData({
                        ...formData,
                        loanMonthlyDeduction: parseFloat(e.target.value) || 0
                      })}
                      className="w-full text-xs rounded border border-slate-300 px-2 py-1.5"
                    />
                  </div>
                </div>
              </div>

              {/* Bank Details */}
              <div className="border border-slate-200 rounded-lg p-3.5 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Disbursement Bank Account
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Bank Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Land Bank / BPI / BDO"
                      value={formData.bankDetails?.bankName || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        bankDetails: { ...formData.bankDetails!, bankName: e.target.value }
                      })}
                      className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Account Number</label>
                    <input
                      type="text"
                      placeholder="e.g. 1094-5582-9901"
                      value={formData.bankDetails?.accountNumber || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        bankDetails: { ...formData.bankDetails!, accountNumber: e.target.value }
                      })}
                      className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 text-slate-900 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Disbursement Mode</label>
                    <select
                      value={formData.bankDetails?.disbursementMethod}
                      onChange={(e) => setFormData({
                        ...formData,
                        bankDetails: { ...formData.bankDetails!, disbursementMethod: e.target.value as any }
                      })}
                      className="w-full text-sm rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900"
                    >
                      <option value="Direct Bank Deposit">Direct Bank Deposit</option>
                      <option value="Payroll Check">Payroll Check</option>
                      <option value="Cashier Voucher">Cashier Voucher</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            {activeTab === 'personal' && 'Step 1 of 5: Personal Details & Age'}
            {activeTab === 'contact_address' && 'Step 2 of 5: Address & Contact Lines'}
            {activeTab === 'education' && 'Step 3 of 5: Educational Degrees'}
            {activeTab === 'employment' && 'Step 4 of 5: Academic Designation & Subjects'}
            {activeTab === 'payroll' && 'Step 5 of 5: Compensation & Bank Account'}
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>

            {activeTab !== 'payroll' ? (
              <button
                type="button"
                onClick={() => {
                  if (activeTab === 'personal') setActiveTab('contact_address');
                  else if (activeTab === 'contact_address') setActiveTab('education');
                  else if (activeTab === 'education') setActiveTab('employment');
                  else if (activeTab === 'employment') setActiveTab('payroll');
                }}
                className="px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-slate-800 text-white hover:bg-slate-700 transition-colors"
              >
                Next Section
              </button>
            ) : null}

            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-500 transition-colors shadow-sm flex items-center space-x-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{editingEmployee ? 'Update Profile' : 'Save Faculty Record'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
