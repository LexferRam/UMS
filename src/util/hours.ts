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

    console.log(minutes)

    return Number(minutes)
}