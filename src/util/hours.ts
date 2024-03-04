export function getHoursBetweenToTimes(hour1: string, hour2: string) {

    // Create Date objects for each hour
    const date1: any = new Date();
    date1.setHours(parseInt(hour1.split(":")[0]));
    date1.setMinutes(parseInt(hour1.split(":")[1]));

    const date2: any = new Date();
    date2.setHours(parseInt(hour2.split(":")[0]));
    date2.setMinutes(parseInt(hour2.split(":")[1]));

    // Calculate the difference in milliseconds
    const difference = Math.abs(date2 - date1);

    // Convert milliseconds to minutes and round down
    const minutes = Math.floor(difference / (1000 * 60));

    return Number(minutes)
}

export function getDateMinusSevenDays(givenDate: string) {

    // Convert the date string to a Date object
    const dateObj = new Date(givenDate);

    // Calculate the number of milliseconds in 7 days
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const daysToSubtract = 7;
    const timeDifference = daysToSubtract * millisecondsPerDay;

    // Create a new Date object 7 days before the given date
    const previousDate = new Date(dateObj.getTime() - timeDifference);

    // Format the previous date as YYYY-MM-DD
    const formattedDate = previousDate.toISOString().slice(0, 10);
    console.log(formattedDate)

    return formattedDate
}