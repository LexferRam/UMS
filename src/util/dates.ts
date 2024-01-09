export function isDateWithinRange(dateToCheck: any, startDate: any, endDate: any) {
  // Ensure all dates are Date objects:
  dateToCheck = new Date(dateToCheck).setHours(0,0,0,0);
  startDate = new Date(startDate).setHours(0,0,0,0);
  endDate = new Date(endDate).setHours(0,0,0,0);

  // Check if the date is greater than or equal to the start date
  // and less than or equal to the end date:
  return dateToCheck >= startDate && dateToCheck <= endDate;
}

export const eventForToday = (eventsArray: any) => {

  let eventsForTodayArray: any[] = []

  eventsArray?.map((event: any) => {
    const today = new Date();
    isDateWithinRange(today, event.start, event.end) && eventsForTodayArray.push(event)
  })

  return eventsForTodayArray
}

export function calculateAge(dateOfBirth: any) {
  // Get the current date and time
  const now = new Date();

  // Extract year, month, and day from the date of birth
  const birthYear = dateOfBirth.getFullYear();
  const birthMonth = dateOfBirth.getMonth();
  const birthDay = dateOfBirth.getDate();

  // Calculate the age in years
  let ageInYears = now.getFullYear() - birthYear;

  // Adjust for months and days if the birthday hasn't occurred yet this year
  if (
    now.getMonth() < birthMonth ||
    (now.getMonth() === birthMonth && now.getDate() < birthDay)
  ) {
    ageInYears--;
  }

  // Calculate months and days for more precise age
  const ageInMonths = now.getMonth() - birthMonth + (ageInYears * 12);
  const ageInDays =
    now.getDate() - birthDay + (ageInMonths * 30) + (ageInYears * 365);

  // Return the age in years, months, and days
  return {
    years: ageInYears,
    months: ageInMonths,
    days: ageInDays,
  };
}

export function formatDate(dateStr: string) {
  const dateObj = new Date(dateStr);
  return dateObj.toISOString().slice(0, 10);
}

export function calculateAge2(birthdate: any) {
  // Get current date
  console.log(birthdate)
  const today = new Date();

  // Extract year, month, and day from birthdate
  const birthYear = new Date(birthdate).getFullYear();
  const birthMonth = new Date(birthdate).getMonth();
  const birthDay = new Date(birthdate).getDate();

  // Extract year, month, and day from today's date
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const currentDay = today.getDate();

  // Calculate age in years
  let age = currentYear - birthYear;

  // Adjust age if birthday hasn't occurred yet in the current year
  if (
    currentMonth < birthMonth ||
    (currentMonth === birthMonth && currentDay < birthDay)
  ) {
    age--;
  }

  return age;
}