export function calculateAgeWithMonths(dateOfBirth: any) {
    try {
      // Parse the date of birth into a Date object
      const dob = new Date(dateOfBirth);
  
      // Get the current date
      const currentDate = new Date();
  
      // Calculate the difference in years
      let yearsDifference = currentDate.getFullYear() - dob.getFullYear();
  
      // Adjust for months if the birthday hasn't happened yet this year
      const monthsDifference = currentDate.getMonth() - dob.getMonth();
      if (monthsDifference < 0 || (monthsDifference === 0 && currentDate.getDate() < dob.getDate())) {
        yearsDifference--;
      }
  
      // Calculate the remaining months
      const totalMonths = 12 * yearsDifference + monthsDifference;
  
      return {
        years: yearsDifference,
        months: totalMonths % 12,
      };
    } catch (error) {
      console.error("Invalid date format provided.");
      return null;
    }
  }

export function getHourFromFormattedDate(formattedDate: any) {
  try {
    // Parse the formatted date into a Date object
    const date = new Date(formattedDate);

    // Get the hour in 24-hour format (0-23)
    const hour = date.getUTCHours();

    return hour;
  } catch (error) {
    console.error("Invalid date format provided.");
    return null;
  }
}