export const eventForToday = (arr: any) => {

    const dates = arr?.map((date:any) => date?.start)

    let arrayLength: any[] = []

    arr?.map((date: any) => {
        const givenDate = new Date(date?.start);
        const today = new Date();

        // Compare only the year, month, and day to avoid timezone issues
        const isToday = givenDate.getFullYear() === today.getFullYear() &&
            givenDate.getMonth() === today.getMonth() &&
            givenDate.getDate() === today.getDate();

        isToday && arrayLength.push(date)
    })

    return arrayLength
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
