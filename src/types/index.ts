export type TitlePrefix = 'Dr.' | 'Prof.' | 'Assoc. Prof.' | 'Asst. Prof.' | 'Engr.' | 'Atty.' | 'Mr.' | 'Ms.' | 'Mrs.';

export type GenderType = 'Male' | 'Female' | 'Non-binary' | 'Prefer not to say';

export type CivilStatus = 'Single' | 'Married' | 'Widowed' | 'Separated';

export type DegreeLevel = 
  | 'Doctorate / Ph.D.'
  | "Master's Degree"
  | 'Post-Graduate Diploma'
  | "Bachelor's Degree"
  | 'Associate Degree'
  | 'High School Diploma';

export interface AcademicDegree {
  id: string;
  level: DegreeLevel;
  degreeName: string;
  major: string;
  institution: string;
  graduationYear: number;
  honors?: string;
}

export interface TeachingSubject {
  id: string;
  code: string;
  title: string;
  units: number;
  hoursPerWeek: number;
  section: string;
}

export type EmploymentStatus = 
  | 'Full-Time Tenured'
  | 'Full-Time Probationary'
  | 'Contractual / Fixed Term'
  | 'Part-Time Adjunct'
  | 'Visiting Lecturer';

export type FacultyRank =
  | 'Full Professor'
  | 'Associate Professor'
  | 'Assistant Professor'
  | 'Senior Instructor'
  | 'Instructor III'
  | 'Instructor I'
  | 'Part-Time Lecturer'
  | 'Academic Program Head'
  | 'Department Chair'
  | 'Guidance Counselor'
  | 'Administrative Officer'
  | 'Laboratory Specialist';

export type DepartmentName =
  | 'College of Computer Studies & IT'
  | 'College of Education & Teacher Training'
  | 'College of Engineering & Architecture'
  | 'Department of Mathematics & Physical Sciences'
  | 'Department of Humanities & Languages'
  | 'School of Business & Accountancy'
  | 'Senior High School Academic Strand'
  | 'Administration, Library & Support Services';

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  address?: string;
}

export interface BankDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
  disbursementMethod: 'Direct Bank Deposit' | 'Payroll Check' | 'Cashier Voucher';
}

export interface Allowances {
  chalkInstructional: number;
  advisoryHomeroom: number;
  researchPublication: number;
  transportationRice: number;
  otherAllowance: number;
}

export interface StatutoryDeductions {
  sssGsis: number;
  philHealth: number;
  pagIbigProvident: number;
  customTaxOverride?: number; // If set, overrides progressive tax computation
}

export interface Employee {
  id: string;
  employeeNumber: string; // e.g., "FAC-2024-001"
  
  // Personal Info
  title: TitlePrefix;
  firstName: string;
  middleName: string;
  lastName: string;
  suffix?: string;
  fullName: string;
  age: number;
  birthDate: string; // YYYY-MM-DD
  gender: GenderType;
  civilStatus: CivilStatus;

  // Contact Details
  phone: string;
  mobile: string;
  email: string; // Institutional
  personalEmail?: string;
  emergencyContact: EmergencyContact;

  // Address
  streetAddress: string;
  city: string;
  provinceState: string;
  postalCode: string;
  country: string;

  // Educational Background
  highestAttainment: DegreeLevel;
  degrees: AcademicDegree[];
  licensesCertifications: string[];
  specialization: string;
  researchInterests: string[];

  // Employment & Academic Profile
  facultyRank: FacultyRank;
  department: DepartmentName;
  employmentStatus: EmploymentStatus;
  dateHired: string; // YYYY-MM-DD
  status: 'Active' | 'On Leave' | 'Sabbatical' | 'Inactive';
  assignedSubjects: TeachingSubject[];
  totalTeachingUnits: number;
  weeklyTeachingHours: number;

  // Compensation & Payroll
  salaryBasis: 'Monthly' | 'Hourly' | 'Per-Unit';
  baseMonthlySalary: number;
  hourlyTeachingRate: number;
  overloadRatePerHour: number;
  allowances: Allowances;
  statutoryDeductions: StatutoryDeductions;
  loanMonthlyDeduction: number;
  bankDetails: BankDetails;

  notes?: string;
  avatarColor?: string;
}

export interface PayrollPeriod {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  payDate: string;
  status: 'Draft' | 'Computed' | 'Approved' | 'Disbursed';
  periodType: 'Semi-Monthly (1st-15th)' | 'Semi-Monthly (16th-End)' | 'Monthly' | 'Mid-Year / 13th Month';
}

export interface Payslip {
  id: string;
  periodId: string;
  employeeId: string;
  employeeNumber: string;
  employeeName: string;
  facultyRank: FacultyRank;
  department: DepartmentName;
  bankAccountNumber: string;
  paymentMethod: string;
  payDate: string;
  periodTitle: string;
  periodDates: string;

  // Attendance & Work metrics
  expectedDays: number;
  actualDaysWorked: number;
  regularHoursWorked: number;
  overloadHours: number;
  tardinessMinutes: number;
  absentDays: number;

  // Earnings
  basicPay: number;
  overloadPay: number;
  chalkAllowance: number;
  advisoryAllowance: number;
  researchAllowance: number;
  riceTransportAllowance: number;
  otherAllowances: number;
  grossEarnings: number;

  // Deductions
  withholdingTax: number;
  sssGsis: number;
  philHealth: number;
  pagIbigProvident: number;
  tardinessDeduction: number;
  absenceDeduction: number;
  loanAmortization: number;
  totalDeductions: number;

  // Net Pay
  netPay: number;
  status: 'Pending' | 'Paid';
  generatedAt: string;
  remarks?: string;
}

export interface InstitutionSettings {
  schoolName: string;
  schoolCampus: string;
  address: string;
  contactNumber: string;
  tinNumber: string;
  currencySymbol: string;
  preparedByName: string;
  preparedByTitle: string;
  approvedByName: string;
  approvedByTitle: string;
}
