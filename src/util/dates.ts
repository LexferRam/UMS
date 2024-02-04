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

export function addOneYear(dateString: any) {
  // Validate the input format
  const dateParts = dateString.split("-");
  if (dateParts.length !== 3 || isNaN(dateParts[0]) || isNaN(dateParts[1]) || isNaN(dateParts[2])) {
    throw new Error("Invalid date format. Please use YYYY-MM-DD.");
  }

  // Create a Date object from the input string
  const date = new Date(dateString);

  // Add 1 year to the date
  date.setFullYear(date.getFullYear() + 1);
  date.setDate(date.getDate() + 1);

  // Format the resulting date as YYYY-MM-DD
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function addOneDay(date: any) {
  // Create a copy of the date to avoid modifying the original
  const newDate = new Date(date);

  // Add one day to the new date
  newDate.setDate(newDate.getDate() + 1);

  const year = newDate.getFullYear();
  const month = String(newDate.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day = String(newDate.getDate()).padStart(2, "0");

  // Return the new date
  return `${year}-${month}-${day}`;
}

export function sortByDateField(data : any, dateFieldName : any = 'createdAt') {
  return data?.sort((a: any, b: any) => {
    const dateA = a[dateFieldName];
    const dateB = b[dateFieldName];

    if (dateA > dateB) {
      return -1; // Descending order (recent to oldest)
    } else if (dateA < dateB) {
      return 1; // Ascending order (oldest to recent)
    } else {
      return 0; // Equal dates
    }
  });
}

export function formatDateToDDMMYYYY(dateString: string): string {
  const date = new Date(dateString);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}