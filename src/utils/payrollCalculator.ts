import { Employee, PayrollPeriod, Payslip } from '../types';

export function calculateAge(birthDateString: string): number {
  if (!birthDateString) return 0;
  const today = new Date();
  const birthDate = new Date(birthDateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return Math.max(0, age);
}

export function formatCurrency(amount: number, currency: string = '₱'): string {
  return `${currency} ${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function computeDailyAndHourlyRate(employee: Employee): { dailyRate: number; hourlyRate: number } {
  if (employee.salaryBasis === 'Hourly' && employee.hourlyTeachingRate > 0) {
    const hourly = employee.hourlyTeachingRate;
    return {
      dailyRate: hourly * 8,
      hourlyRate: hourly,
    };
  }

  // Monthly standard (assuming 22 working days per month, 8 hours/day)
  const monthly = employee.baseMonthlySalary || 0;
  const dailyRate = monthly > 0 ? monthly / 22 : 0;
  const hourlyRate = dailyRate > 0 ? dailyRate / 8 : 0;

  return { dailyRate, hourlyRate };
}

/**
 * Standard progressive withholding tax formula based on semi-monthly or monthly compensation
 */
export function calculateTax(taxableIncome: number, isSemiMonthly: boolean = true): number {
  if (taxableIncome <= 0) return 0;
  
  // Annualized or periodic brackets
  // Semi-monthly brackets (approx standard TRAIN/progressive model):
  // Up to 10,417: 0%
  // 10,417 - 16,666: 15% of excess over 10,417
  // 16,667 - 33,332: 937.50 + 20% of excess over 16,667
  // 33,333 - 83,332: 4,270.70 + 25% of excess over 33,333
  // 83,333 - 333,332: 16,770.70 + 30% of excess over 83,333
  // Above 333,333: 91,770.70 + 35% of excess
  if (isSemiMonthly) {
    if (taxableIncome <= 10417) return 0;
    if (taxableIncome <= 16666) return (taxableIncome - 10417) * 0.15;
    if (taxableIncome <= 33332) return 937.5 + (taxableIncome - 16667) * 0.20;
    if (taxableIncome <= 83332) return 4270.7 + (taxableIncome - 33333) * 0.25;
    if (taxableIncome <= 333332) return 16770.7 + (taxableIncome - 83333) * 0.30;
    return 91770.7 + (taxableIncome - 333333) * 0.35;
  } else {
    // Monthly brackets
    if (taxableIncome <= 20833) return 0;
    if (taxableIncome <= 33333) return (taxableIncome - 20833) * 0.15;
    if (taxableIncome <= 66666) return 1875 + (taxableIncome - 33333) * 0.20;
    if (taxableIncome <= 166666) return 8541.67 + (taxableIncome - 66666) * 0.25;
    if (taxableIncome <= 666666) return 33541.67 + (taxableIncome - 166666) * 0.30;
    return 183541.67 + (taxableIncome - 666666) * 0.35;
  }
}

export interface AttendanceInput {
  actualDaysWorked?: number;
  expectedDays?: number;
  overloadHours?: number;
  tardinessMinutes?: number;
  absentDays?: number;
}

export function generateEmployeePayslip(
  employee: Employee,
  period: PayrollPeriod,
  attendance?: AttendanceInput
): Payslip {
  const isSemiMonthly = period.periodType.includes('Semi-Monthly');
  const divisor = isSemiMonthly ? 2 : 1;
  const expectedDays = attendance?.expectedDays ?? (isSemiMonthly ? 11 : 22);
  const absentDays = attendance?.absentDays ?? 0;
  const actualDaysWorked = attendance?.actualDaysWorked ?? Math.max(0, expectedDays - absentDays);
  const overloadHours = attendance?.overloadHours ?? 0;
  const tardinessMinutes = attendance?.tardinessMinutes ?? 0;

  const { dailyRate, hourlyRate } = computeDailyAndHourlyRate(employee);

  // Earnings calculations
  const baseSalaryForPeriod = (employee.baseMonthlySalary || 0) / divisor;
  const overloadPay = overloadHours * (employee.overloadRatePerHour || hourlyRate * 1.25);
  
  // Academic Allowances (distributed across pay periods)
  const chalkAllowance = (employee.allowances.chalkInstructional || 0) / divisor;
  const advisoryAllowance = (employee.allowances.advisoryHomeroom || 0) / divisor;
  const researchAllowance = (employee.allowances.researchPublication || 0) / divisor;
  const riceTransportAllowance = (employee.allowances.transportationRice || 0) / divisor;
  const otherAllowances = (employee.allowances.otherAllowance || 0) / divisor;

  const grossEarnings = 
    baseSalaryForPeriod +
    overloadPay +
    chalkAllowance +
    advisoryAllowance +
    researchAllowance +
    riceTransportAllowance +
    otherAllowances;

  // Deductions
  const minuteRate = hourlyRate / 60;
  const tardinessDeduction = tardinessMinutes * minuteRate;
  const absenceDeduction = absentDays * dailyRate;

  // Statutory contributions (divided if semi-monthly)
  const sssGsis = (employee.statutoryDeductions.sssGsis || 0) / divisor;
  const philHealth = (employee.statutoryDeductions.philHealth || 0) / divisor;
  const pagIbigProvident = (employee.statutoryDeductions.pagIbigProvident || 0) / divisor;
  const loanAmortization = (employee.loanMonthlyDeduction || 0) / divisor;

  // Tax computation
  const nonTaxableStatutory = sssGsis + philHealth + pagIbigProvident;
  const taxableIncome = Math.max(0, grossEarnings - nonTaxableStatutory - tardinessDeduction - absenceDeduction);
  
  const withholdingTax = employee.statutoryDeductions.customTaxOverride !== undefined
    ? (employee.statutoryDeductions.customTaxOverride / divisor)
    : calculateTax(taxableIncome, isSemiMonthly);

  const totalDeductions = 
    withholdingTax +
    sssGsis +
    philHealth +
    pagIbigProvident +
    tardinessDeduction +
    absenceDeduction +
    loanAmortization;

  const netPay = Math.max(0, grossEarnings - totalDeductions);

  return {
    id: `PAY-${period.id}-${employee.id}-${Date.now().toString().slice(-4)}`,
    periodId: period.id,
    employeeId: employee.id,
    employeeNumber: employee.employeeNumber,
    employeeName: employee.fullName,
    facultyRank: employee.facultyRank,
    department: employee.department,
    bankAccountNumber: employee.bankDetails.accountNumber || 'N/A',
    paymentMethod: employee.bankDetails.disbursementMethod || 'Direct Bank Deposit',
    payDate: period.payDate,
    periodTitle: period.title,
    periodDates: `${period.startDate} to ${period.endDate}`,

    expectedDays,
    actualDaysWorked,
    regularHoursWorked: actualDaysWorked * 8,
    overloadHours,
    tardinessMinutes,
    absentDays,

    basicPay: baseSalaryForPeriod,
    overloadPay,
    chalkAllowance,
    advisoryAllowance,
    researchAllowance,
    riceTransportAllowance,
    otherAllowances,
    grossEarnings,

    withholdingTax,
    sssGsis,
    philHealth,
    pagIbigProvident,
    tardinessDeduction,
    absenceDeduction,
    loanAmortization,
    totalDeductions,

    netPay,
    status: period.status === 'Disbursed' ? 'Paid' : 'Pending',
    generatedAt: new Date().toISOString(),
  };
}
